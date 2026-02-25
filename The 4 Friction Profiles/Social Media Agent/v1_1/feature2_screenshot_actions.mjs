import crypto from "node:crypto";
import { readJsonFile, writeJsonFile } from "./state/json_store.mjs";
import { STATE_PATHS } from "./state/paths.mjs";

export const ACTION_TYPES = Object.freeze(["COMMENT", "FOLLOW", "DM", "SKIP"]);

export const SCREENSHOT_ANALYSIS_OUTPUT_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "ScreenshotAnalysisOutputV1_1",
  type: "object",
  additionalProperties: false,
  required: ["target_notes"],
  properties: {
    target_notes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "screenshot_index",
          "platform",
          "handle_or_name",
          "quick_context",
          "action_type",
          "target_score",
          "confidence",
        ],
        properties: {
          screenshot_index: { type: "integer", minimum: 1 },
          platform: { type: "string", minLength: 1 },
          handle_or_name: { type: "string", minLength: 1 },
          post_topic: { type: "string" },
          quick_context: { type: "string", minLength: 1 },
          what_they_seem_to_need: { type: "string" },
          action_type: { type: "string", enum: ACTION_TYPES },
          target_score: { type: "integer", minimum: 1, maximum: 10 },
          target_score_reason: { type: "string" },
          target_persona_match: {
            type: "array",
            items: { type: "string", enum: ["Will", "Mr Blue", "Guided Nap", "Guiding Bros"] },
          },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
          personalization_hook_story_angle: { type: "string" },
          spam_risk_notes: { type: "string" },
        },
      },
    },
    outreach_dms: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["screenshot_index", "channel", "message", "spam_risk_check"],
        properties: {
          screenshot_index: { type: "integer", minimum: 1 },
          channel: { type: "string", minLength: 1 },
          message: { type: "string" },
          personalization_hook_used: { type: "string" },
          spam_risk_check: { type: "string", enum: ["pass", "revise", "skip"] },
          if_revise_why: { type: "string" },
        },
      },
      default: [],
    },
    comment_drafts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["screenshot_index", "persona", "comment"],
        properties: {
          screenshot_index: { type: "integer", minimum: 1 },
          persona: { type: "string", enum: ["Will", "Mr Blue", "Guided Nap", "Guiding Bros"] },
          comment: { type: "string" },
          why_this_persona: { type: "string" },
        },
      },
      default: [],
    },
    followups: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["screenshot_index", "stage", "message"],
        properties: {
          screenshot_index: { type: "integer", minimum: 1 },
          stage: { type: "string" },
          message: { type: "string" },
          when_to_send: { type: "string" },
          condition: { type: "string" },
        },
      },
      default: [],
    },
  },
};

export function parseScreenshotAnalysisOutput(input) {
  const value = typeof input === "string" ? JSON.parse(input) : input;
  validateScreenshotAnalysisOutput(value);
  return normalizeScreenshotAnalysisOutput(value);
}

export function validateScreenshotAnalysisOutput(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError("Screenshot analysis output must be a JSON object");
  }
  if (!Array.isArray(value.target_notes)) {
    throw new TypeError("`target_notes` must be an array");
  }

  for (const [index, item] of value.target_notes.entries()) {
    assertObject(item, `target_notes[${index}]`);
    requireString(item.platform, `target_notes[${index}].platform`);
    requireString(item.handle_or_name, `target_notes[${index}].handle_or_name`);
    requireString(item.quick_context, `target_notes[${index}].quick_context`);
    requireInteger(item.screenshot_index, `target_notes[${index}].screenshot_index`, 1);
    requireEnum(item.action_type, `target_notes[${index}].action_type`, ACTION_TYPES);
    requireInteger(item.target_score, `target_notes[${index}].target_score`, 1, 10);
    requireEnum(item.confidence, `target_notes[${index}].confidence`, ["high", "medium", "low"]);
  }
}

function normalizeScreenshotAnalysisOutput(value) {
  return {
    target_notes: value.target_notes.map((t) => ({
      screenshot_index: t.screenshot_index,
      platform: t.platform.trim(),
      handle_or_name: t.handle_or_name.trim(),
      post_topic: t.post_topic?.trim?.() || "",
      quick_context: t.quick_context.trim(),
      what_they_seem_to_need: t.what_they_seem_to_need?.trim?.() || "",
      action_type: t.action_type,
      target_score: t.target_score,
      target_score_reason: t.target_score_reason?.trim?.() || "",
      target_persona_match: Array.isArray(t.target_persona_match) ? t.target_persona_match : [],
      confidence: t.confidence,
      personalization_hook_story_angle: t.personalization_hook_story_angle?.trim?.() || "",
      spam_risk_notes: t.spam_risk_notes?.trim?.() || "",
    })),
    outreach_dms: Array.isArray(value.outreach_dms) ? value.outreach_dms : [],
    comment_drafts: Array.isArray(value.comment_drafts) ? value.comment_drafts : [],
    followups: Array.isArray(value.followups) ? value.followups : [],
  };
}

export async function queueNextBestActions(parsedOutput, options = {}) {
  const parsed = parseScreenshotAnalysisOutput(parsedOutput);
  const nowIso = new Date(options.now ?? Date.now()).toISOString();
  const source = options.source || "llm";

  const existing = await readJsonFile(STATE_PATHS.nextBestActions, {
    schemaVersion: "1.1",
    items: [],
  });

  const queueItems = parsed.target_notes.map((target) => {
    const dm = parsed.outreach_dms.find((x) => x.screenshot_index === target.screenshot_index);
    const comment = parsed.comment_drafts.find((x) => x.screenshot_index === target.screenshot_index);
    const followups = parsed.followups.filter((x) => x.screenshot_index === target.screenshot_index);

    const targetId =
      options.targetIdResolver?.(target) ||
      buildTargetId({
        platform: target.platform,
        handleOrName: target.handle_or_name,
        screenshotIndex: target.screenshot_index,
      });

    return {
      id: crypto.randomUUID(),
      targetId,
      createdAt: nowIso,
      source,
      actionType: target.action_type,
      targetScore: target.target_score,
      confidence: target.confidence,
      platform: target.platform,
      handleOrName: target.handle_or_name,
      quickContext: target.quick_context,
      postTopic: target.post_topic,
      personaMatch: target.target_persona_match || [],
      personalizationHook: target.personalization_hook_story_angle || "",
      spamRiskNotes: target.spam_risk_notes || "",
      drafts: {
        dm: dm || null,
        comment: comment || null,
        followups,
      },
      status: "pending",
    };
  });

  const merged = dedupeQueueItems([...(existing.items || []), ...queueItems]);
  const sorted = sortNextBestActions(merged);
  const nextState = {
    schemaVersion: "1.1",
    updatedAt: nowIso,
    items: sorted,
  };

  await writeJsonFile(STATE_PATHS.nextBestActions, nextState);
  return nextState;
}

export async function getNextBestActions({ limit = 25, includeSkip = false } = {}) {
  const state = await readJsonFile(STATE_PATHS.nextBestActions, { schemaVersion: "1.1", items: [] });
  let items = Array.isArray(state.items) ? state.items : [];
  if (!includeSkip) {
    items = items.filter((item) => item.actionType !== "SKIP");
  }
  return sortNextBestActions(items).slice(0, limit);
}

function dedupeQueueItems(items) {
  const byKey = new Map();
  for (const item of items) {
    const key = `${item.targetId}:${item.actionType}`;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, item);
      continue;
    }
    // Keep the higher score; break ties by newer timestamp.
    if (
      item.targetScore > existing.targetScore ||
      (item.targetScore === existing.targetScore && String(item.createdAt) > String(existing.createdAt))
    ) {
      byKey.set(key, item);
    }
  }
  return [...byKey.values()];
}

function sortNextBestActions(items) {
  const actionPriority = new Map([
    ["DM", 1],
    ["COMMENT", 2],
    ["FOLLOW", 3],
    ["SKIP", 4],
  ]);
  return [...items].sort((a, b) => {
    const pA = actionPriority.get(a.actionType) ?? 99;
    const pB = actionPriority.get(b.actionType) ?? 99;
    if (pA !== pB) return pA - pB;
    if (b.targetScore !== a.targetScore) return b.targetScore - a.targetScore;
    return String(b.createdAt).localeCompare(String(a.createdAt));
  });
}

function buildTargetId({ platform, handleOrName, screenshotIndex }) {
  const slug = String(handleOrName || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${String(platform || "unknown").toLowerCase()}:${slug || `shot-${screenshotIndex}`}`;
}

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
}

function requireString(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`${label} must be a non-empty string`);
  }
}

function requireInteger(value, label, min, max = Infinity) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${label} must be an integer between ${min} and ${max}`);
  }
}

function requireEnum(value, label, allowed) {
  if (!allowed.includes(value)) {
    throw new RangeError(`${label} must be one of: ${allowed.join(", ")}`);
  }
}

