import crypto from "node:crypto";
import { readJsonFile, writeJsonFile } from "./state/json_store.mjs";
import { STATE_PATHS } from "./state/paths.mjs";

const FOLLOW_UP_WINDOW_MS = 72 * 60 * 60 * 1000;

export async function setFollowUpReminder(targetId, interactionType, options = {}) {
  if (!targetId || typeof targetId !== "string") {
    throw new TypeError("targetId must be a non-empty string");
  }
  if (!interactionType || typeof interactionType !== "string") {
    throw new TypeError("interactionType must be a non-empty string");
  }

  const now = Number(options.now ?? Date.now());
  const dueAt = new Date(now + FOLLOW_UP_WINDOW_MS).toISOString();
  const nowIso = new Date(now).toISOString();

  const state = await readJsonFile(STATE_PATHS.reminders, {
    schemaVersion: "1.1",
    items: [],
  });

  const reminder = {
    id: crypto.randomUUID(),
    targetId,
    interactionType,
    createdAt: nowIso,
    dueAt,
    status: "pending",
    meta: options.meta || {},
  };

  const nextState = {
    schemaVersion: "1.1",
    updatedAt: nowIso,
    items: [...(state.items || []), reminder],
  };

  await writeJsonFile(STATE_PATHS.reminders, nextState);
  return reminder;
}

export async function getPendingReminders(options = {}) {
  const now = Number(options.now ?? Date.now());
  const state = await readJsonFile(STATE_PATHS.reminders, {
    schemaVersion: "1.1",
    items: [],
  });

  const pending = (state.items || [])
    .filter((item) => item.status === "pending")
    .filter((item) => {
      const due = Date.parse(item.dueAt);
      return Number.isFinite(due) && due <= now;
    })
    .sort((a, b) => String(a.dueAt).localeCompare(String(b.dueAt)));

  return pending;
}

export async function markReminderCompleted(reminderId) {
  const state = await readJsonFile(STATE_PATHS.reminders, {
    schemaVersion: "1.1",
    items: [],
  });

  const nowIso = new Date().toISOString();
  const items = (state.items || []).map((item) =>
    item.id === reminderId ? { ...item, status: "completed", completedAt: nowIso } : item
  );

  const nextState = {
    schemaVersion: "1.1",
    updatedAt: nowIso,
    items,
  };
  await writeJsonFile(STATE_PATHS.reminders, nextState);
  return nextState;
}

export { FOLLOW_UP_WINDOW_MS };

