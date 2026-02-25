const http = require("http");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

loadDotEnv(path.join(process.cwd(), ".env"));

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || "127.0.0.1";

const DEFAULT_MODELS = {
  gemini: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  claude: process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest",
};

const STATIC_FILES = {
  "/": "index.html",
  "/index.html": "index.html",
  "/styles.css": "styles.css",
  "/app.js": "app.js",
  "/README.md": "README.md",
};

const DATA_DIR = path.join(process.cwd(), "data");
const REPLY_INTEL_HISTORY_FILE = path.join(DATA_DIR, "reply_intel_history.json");
const APP_SETTINGS_FILE = path.join(DATA_DIR, "app_settings.json");
const DEFAULT_CONTEXT_HUB_PATH =
  process.env.CONTEXT_HUB_PATH || "/Users/williamvercoutre/Desktop/context-hub 2";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

let v11ModulePromise = null;

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url) return sendJson(res, 400, { error: "Missing URL" });

    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (req.method === "GET" && url.pathname === "/api/health") {
      return sendJson(res, 200, {
        ok: true,
        providerKeys: {
          gemini: Boolean(process.env.GEMINI_API_KEY),
          claude: Boolean(process.env.ANTHROPIC_API_KEY),
        },
        defaults: DEFAULT_MODELS,
      });
    }

    if (req.method === "POST" && url.pathname === "/api/analyze-screenshots") {
      const body = await readJsonBody(req, 60 * 1024 * 1024);
      const result = await analyzeScreenshots(body);
      return sendJson(res, 200, result);
    }

    if (req.method === "POST" && url.pathname === "/api/analyze-screenshots/claude-direct") {
      const body = await readJsonBody(req, 60 * 1024 * 1024);
      const result = await analyzeScreenshots({ ...(body || {}), provider: "claude" });
      return sendJson(res, 200, result);
    }

    if (req.method === "POST" && url.pathname === "/api/link-context") {
      const body = await readJsonBody(req, 2 * 1024 * 1024);
      const result = await fetchLinkContext(body);
      return sendJson(res, 200, result);
    }

    if (req.method === "POST" && url.pathname === "/api/reply-intel/analyze") {
      const body = await readJsonBody(req, 2 * 1024 * 1024);
      const result = analyzeReplyIntelligence(body || {});
      await appendReplyIntelHistory({ input: body || {}, output: result });
      return sendJson(res, 200, { ok: true, result });
    }

    if (req.method === "GET" && url.pathname === "/api/context-hub/settings") {
      const settings = readAppSettings();
      return sendJson(res, 200, {
        ok: true,
        contextHubPath: settings.contextHubPath || DEFAULT_CONTEXT_HUB_PATH,
      });
    }

    if (req.method === "PUT" && url.pathname === "/api/context-hub/settings") {
      const body = await readJsonBody(req, 1024 * 1024);
      const candidate = String(body?.contextHubPath || "").trim();
      if (!candidate) return sendJson(res, 400, { error: "contextHubPath is required" });
      const next = { ...readAppSettings(), contextHubPath: candidate };
      writeAppSettings(next);
      return sendJson(res, 200, { ok: true, contextHubPath: next.contextHubPath });
    }

    if (req.method === "GET" && url.pathname === "/api/context-hub/summary") {
      const summary = readContextHubSummary();
      return sendJson(res, 200, { ok: true, summary });
    }

    if (req.method === "GET" && url.pathname === "/api/brand-pack") {
      const v11 = await getV11();
      const brandPack = await v11.readGlobalBrandPack();
      return sendJson(res, 200, { ok: true, brandPack });
    }

    if (req.method === "PUT" && url.pathname === "/api/brand-pack") {
      const body = await readJsonBody(req, 20 * 1024 * 1024);
      if (!body || typeof body.brandPack !== "object" || Array.isArray(body.brandPack)) {
        return sendJson(res, 400, { error: "Expected { brandPack: object }" });
      }
      const v11 = await getV11();
      await v11.writeGlobalBrandPack(body.brandPack);
      return sendJson(res, 200, { ok: true });
    }

    if (req.method === "POST" && url.pathname === "/api/migrate-brand-pack") {
      const v11 = await getV11();
      const result = await v11.migrateDailyStateBrandPackToGlobal();
      return sendJson(res, 200, result);
    }

    if (req.method === "POST" && url.pathname === "/api/screenshot-analysis/import") {
      const body = await readJsonBody(req, 20 * 1024 * 1024);
      const v11 = await getV11();
      const queued = await v11.queueNextBestActions(body.analysis ?? body, {
        source: body.source || "manual_import",
      });
      return sendJson(res, 200, { ok: true, queue: queued });
    }

    if (req.method === "GET" && url.pathname === "/api/next-best-actions") {
      const v11 = await getV11();
      const includeSkip = url.searchParams.get("includeSkip") === "1";
      const limit = Number(url.searchParams.get("limit") || 25);
      const items = await v11.getNextBestActions({ includeSkip, limit });
      return sendJson(res, 200, { ok: true, items });
    }

    if (req.method === "POST" && url.pathname === "/api/reminders") {
      const body = await readJsonBody(req, 2 * 1024 * 1024);
      const { targetId, interactionType, meta } = body || {};
      const v11 = await getV11();
      const reminder = await v11.setFollowUpReminder(String(targetId || ""), String(interactionType || ""), { meta });
      return sendJson(res, 200, { ok: true, reminder });
    }

    if (req.method === "GET" && url.pathname === "/api/reminders/pending") {
      const v11 = await getV11();
      const reminders = await v11.getPendingReminders();
      return sendJson(res, 200, { ok: true, reminders });
    }

    if (req.method === "GET" || req.method === "HEAD") {
      return serveStatic(url.pathname, res, req.method === "HEAD");
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    const status = error.statusCode || 500;
    sendJson(res, status, { error: sanitizeErrorMessage(error) });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Daily Operator server running at http://${HOST}:${PORT}`);
  console.log("API screenshot reading enabled if GEMINI_API_KEY and/or ANTHROPIC_API_KEY are set.");
});

function loadDotEnv(envPath) {
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] == null) process.env[key] = value;
  }
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function serveStatic(pathname, res, isHead) {
  const file = STATIC_FILES[pathname];
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("Not found");
  }
  const filePath = path.join(process.cwd(), file);
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const content = fs.readFileSync(filePath);
  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "Content-Length": content.length,
  });
  if (!isHead) res.end(content);
  else res.end();
}

function readJsonBody(req, limitBytes) {
  return new Promise((resolve, reject) => {
    let total = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > limitBytes) {
        reject(withStatus(new Error("Request body too large"), 413));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(withStatus(new Error("Invalid JSON body"), 400));
      }
    });
    req.on("error", (error) => reject(withStatus(error, 400)));
  });
}

function withStatus(error, statusCode) {
  error.statusCode = statusCode;
  return error;
}

async function analyzeScreenshots(body) {
  const provider = String(body.provider || "gemini").toLowerCase();
  const screenshots = Array.isArray(body.screenshots) ? body.screenshots : [];
  if (!screenshots.length) throw withStatus(new Error("No screenshots provided"), 400);

  const normalized = screenshots.map(normalizeScreenshot);
  const prompt = buildVisionPrompt(body, normalized);

  if (provider === "gemini") {
    if (!process.env.GEMINI_API_KEY) throw withStatus(new Error("GEMINI_API_KEY is missing in .env"), 400);
    return analyzeWithGemini({
      model: body.model || DEFAULT_MODELS.gemini,
      prompt,
      screenshots: normalized,
    });
  }

  if (provider === "claude" || provider === "anthropic") {
    if (!process.env.ANTHROPIC_API_KEY) throw withStatus(new Error("ANTHROPIC_API_KEY is missing in .env"), 400);
    return analyzeWithClaude({
      model: body.model || DEFAULT_MODELS.claude,
      prompt,
      screenshots: normalized,
    });
  }

  throw withStatus(new Error(`Unsupported provider: ${provider}`), 400);
}

function normalizeScreenshot(s) {
  const { mimeType, base64 } = parseDataUrl(s.dataUrl || "");
  return {
    index: Number(s.index || 0) || 0,
    name: String(s.name || `screenshot-${Date.now()}`),
    mimeType,
    base64,
  };
}

function parseDataUrl(dataUrl) {
  const match = /^data:([^;]+);base64,([A-Za-z0-9+/=\s]+)$/.exec(String(dataUrl).trim());
  if (!match) throw withStatus(new Error("Invalid image data URL"), 400);
  const mimeType = match[1].toLowerCase();
  if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(mimeType)) {
    throw withStatus(new Error(`Unsupported image type: ${mimeType}`), 400);
  }
  return { mimeType: mimeType === "image/jpg" ? "image/jpeg" : mimeType, base64: match[2].replace(/\s+/g, "") };
}

function buildVisionPrompt(body, screenshots) {
  const brand = body.brandPackSummary || body.brandPack || null;
  const compactBrand = compactBrandForPrompt(brand);

  const instruction = {
    role: "vision_and_writing_copilot_only",
    task: "Read attached profile/post screenshots and produce warm, non-spammy outreach drafts in Will's voice.",
    goals: [
      "Extract the most relevant profile/post signals for outreach",
      "Choose the next best action for each target (COMMENT, FOLLOW, DM, or SKIP)",
      "Score each target for outreach fit on a 1-10 scale using Will's weighted rubric",
      "Draft a helpful comment reply first for Facebook/LinkedIn prospects",
      "Draft a personalized DM in Will's voice",
      "Draft a comment when COMMENT is the best action (using the right persona)",
      "Draft one follow-up sequence with guardrails",
      "Flag spam risk or low-confidence interpretations",
    ],
    hard_rules: [
      "Human-in-the-loop only; do not assume auto-send",
      "Personalize from screenshot evidence",
      "No mass messaging language",
      "Do not use em dashes or en dashes (— or –) in drafted messages/comments; use commas or periods instead",
      "For MyLanguageExchange first-touch DMs: 2-3 short sentences max; goal is reply, not conversion",
      "MLE message structure: personal hook -> one light credibility marker -> casual invite",
      "No app mention or pitch in MLE first touch; save deeper insights for later conversation",
      "Use weighted scoring cues for MLE/outreach fit: speaking focus (3), friction signals (3), profile effort (2), hook quality (1), professional need (1), timezone fit (1), activity (1), normalized to 1-10",
      "Key question: would this person likely freeze when speaking English out loud? If yes, score should increase",
      "Facebook/LinkedIn mode: comment-first. Draft a 2-3 sentence value-first comment reply with no pitch. Only draft follow-up DM for AFTER comment engagement on green/yellow scores",
      "MLE safe volume guidance: 3-5 DMs/day max, spaced across the day",
      "MLE anti-ban rules: no identical messages, no links in DMs, no repeat DM on no-reply, mix browsing with messaging",
      "No ADHD/neurodivergent mention in cold outreach",
      "One follow-up max if no reply",
      "If uncertain, mark confidence low and state uncertainty",
    ],
    today: body.today || null,
    context_notes: body.contextNotes || "",
    facebook_linkedin_post_text_input: body.socialPostTextInput || "",
    screenshots: screenshots.map((s) => ({ screenshot_index: s.index, file: s.name })),
    output_json_schema: {
      target_notes: [
        {
          screenshot_index: 1,
          platform: "",
          handle_or_name: "",
          country_or_language_clue: "",
          post_topic: "",
          quick_context: "",
          what_they_seem_to_need: "",
          warm_status: "commented_yes|commented_no|unknown",
          action_type: "COMMENT|FOLLOW|DM|SKIP",
          target_score: 1,
          target_score_band: "🟢|🟡|🟠|🔴",
          target_score_reason: "",
          score_breakdown: {
            speaking_focus: { score: 0, reason: "" },
            friction_signals: { score: 0, reason: "" },
            profile_effort: { score: 0, reason: "" },
            hook_quality: { score: 0, reason: "" },
            professional_need: { score: 0, reason: "" },
            timezone_compatibility: { score: 0, reason: "" },
            activity: { score: 0, reason: "" },
          },
          target_persona_match: ["Will|Mr Blue|Guided Nap|Guiding Bros"],
          unmute_lead: false,
          confidence: "high|medium|low",
          personalization_hook_story_angle: "",
          spam_risk_notes: "",
        },
      ],
      outreach_dms: [
        {
          screenshot_index: 1,
          channel: "LinkedIn|Facebook|Instagram|Other",
          message: "",
          personalization_hook_used: "",
          first_touch_rule_check: "2-3 sentences|no_app_mention|casual_invite|pass|revise",
          spam_risk_check: "pass|revise|skip",
          if_revise_why: "",
        },
      ],
      comment_drafts: [
        {
          screenshot_index: 1,
          persona: "Will|Mr Blue|Guided Nap|Guiding Bros",
          comment: "",
          why_this_persona: "",
          comment_type: "fb_or_linkedin_value_reply|tiktok_or_youtube_comment|other",
        },
      ],
      followups: [
        {
          screenshot_index: 1,
          stage: "no_reply_72h|positive_reply|whatsapp_move|post_class_offer|after_comment_engagement_dm",
          message: "",
          when_to_send: "",
          condition: "",
        },
      ],
      mle_candidates: [
        {
          screenshot_index: 1,
          suitable_for_mle_style: true,
          message: "",
          dm_style: "first_touch|second_touch_whatsapp|linkedin_second_touch",
        },
      ],
    },
    brand_pack_summary: compactBrand,
  };

  return [
    "Analyze the attached screenshots.",
    "Return JSON only, matching the provided schema.",
    "For each target, action_type and target_score (1-10) are required.",
    "Keep MyLanguageExchange first-touch DMs short and non-pitchy (2-3 sentences max).",
    "When multiple prospects are present, sort by target_score descending and draft DMs for the strongest fits first.",
    "Do not wrap in markdown fences.",
    JSON.stringify(instruction, null, 2),
  ].join("\n\n");
}

async function fetchLinkContext(body) {
  const rawUrl = String(body?.url || "").trim();
  if (!rawUrl) throw withStatus(new Error("Missing url"), 400);

  let parsedUrl;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    throw withStatus(new Error("Invalid URL"), 400);
  }
  if (!/^https?:$/.test(parsedUrl.protocol)) {
    throw withStatus(new Error("Only http/https URLs are supported"), 400);
  }

  const res = await fetch(parsedUrl.toString(), {
    method: "GET",
    redirect: "follow",
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
  }).catch((err) => {
    throw withStatus(new Error(`Link fetch failed: ${err.message}`), 502);
  });

  const contentType = String(res.headers.get("content-type") || "");
  const finalUrl = res.url || parsedUrl.toString();
  const status = res.status;
  const ok = res.ok;

  const isHtml = contentType.includes("text/html") || contentType.includes("application/xhtml+xml");
  const rawBody = await res.text().catch(() => "");

  if (!isHtml) {
    return {
      ok,
      url: parsedUrl.toString(),
      finalUrl,
      status,
      host: new URL(finalUrl).host,
      contentType,
      meta: {},
      snippet: rawBody.slice(0, 600),
      note: "Non-HTML response. Use screenshot fallback if this is a social app page.",
    };
  }

  const meta = extractHtmlMeta(rawBody);
  const text = extractVisibleText(rawBody);
  const snippet = text.slice(0, 1200);

  return {
    ok,
    url: parsedUrl.toString(),
    finalUrl,
    status,
    host: new URL(finalUrl).host,
    contentType,
    meta,
    snippet,
    note: ok
      ? "Public link context fetched. If page is JS-heavy or missing details, attach a screenshot for accurate drafting."
      : "Fetch returned non-200. Screenshot fallback recommended.",
  };
}

function extractHtmlMeta(html) {
  const title =
    matchTagContent(html, "title") ||
    matchMetaContent(html, "property", "og:title") ||
    matchMetaContent(html, "name", "twitter:title") ||
    "";
  const description =
    matchMetaContent(html, "name", "description") ||
    matchMetaContent(html, "property", "og:description") ||
    matchMetaContent(html, "name", "twitter:description") ||
    "";
  const siteName = matchMetaContent(html, "property", "og:site_name") || "";
  const author = matchMetaContent(html, "name", "author") || "";
  return { title, description, siteName, author };
}

function matchTagContent(html, tagName) {
  const re = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const m = re.exec(String(html || ""));
  return m ? decodeHtmlEntities(stripWhitespace(m[1])) : "";
}

function matchMetaContent(html, attrName, attrValue) {
  const source = String(html || "");
  const escaped = escapeRegex(attrValue);
  const patterns = [
    new RegExp(`<meta[^>]*${attrName}=["']${escaped}["'][^>]*content=["']([\\s\\S]*?)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]*content=["']([\\s\\S]*?)["'][^>]*${attrName}=["']${escaped}["'][^>]*>`, "i"),
  ];
  for (const re of patterns) {
    const m = re.exec(source);
    if (m && m[1]) return decodeHtmlEntities(stripWhitespace(m[1]));
  }
  return "";
}

function extractVisibleText(html) {
  return decodeHtmlEntities(
    stripWhitespace(
      String(html || "")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
        .replace(/<!--[\s\S]*?-->/g, " ")
        .replace(/<[^>]+>/g, " ")
    )
  );
}

function stripWhitespace(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(text) {
  return String(text || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, "/");
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function compactBrandForPrompt(brand) {
  if (!brand || typeof brand !== "object") return null;
  const get = (obj, pathParts) => pathParts.reduce((acc, p) => (acc && acc[p] != null ? acc[p] : undefined), obj);
  return {
    brand_voice: {
      tone_rules: toArray(get(brand, ["brand_voice", "tone_rules"])).slice(0, 12),
      phrasing_rules: toArray(get(brand, ["brand_voice", "phrasing_rules"])).slice(0, 12),
      avoid: toArray(get(brand, ["brand_voice", "avoid"])).slice(0, 24),
    },
    personas: {
      mr_blue: {
        voice_rules: toArray(get(brand, ["personas", "mr_blue", "voice_rules"])).slice(0, 10),
      },
      guided_nap: {
        voice_rules: toArray(get(brand, ["personas", "guided_nap", "voice_rules"])).slice(0, 10),
      },
    },
    guardrails: {
      hard_nos: toArray(get(brand, ["guardrails", "hard_nos"])).slice(0, 20),
      banned_phrases: toArray(get(brand, ["guardrails", "banned_phrases"])).slice(0, 40),
      platform_specific_rules: get(brand, ["guardrails", "platform_specific_rules"]) || {},
    },
    offer: {
      product: get(brand, ["offer", "product"]) || null,
      founders_pass: get(brand, ["offer", "founders_pass"]) || null,
      cta_rules: get(brand, ["offer", "cta_rules"]) || null,
    },
  };
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

async function analyzeWithGemini({ model, prompt, screenshots }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const parts = [];
  for (const shot of screenshots) {
    parts.push({ text: `Screenshot ${shot.index}: ${shot.name}` });
    parts.push({
      inline_data: {
        mime_type: shot.mimeType,
        data: shot.base64,
      },
    });
  }
  parts.push({ text: prompt });

  const requestBody = {
    contents: [{ role: "user", parts }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify(requestBody),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw withStatus(new Error(`Gemini API error: ${data.error?.message || res.statusText}`), 502);
  }
  const text = extractGeminiText(data);
  const parseInfo = parseModelJsonDetailed(text);
  const parsed = parseInfo.parsed;
  return {
    ok: true,
    provider: "gemini",
    model,
    parsed,
    parseInfo,
    usage: data.usageMetadata || null,
    rawText: parsed ? undefined : text,
  };
}

function extractGeminiText(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) throw withStatus(new Error("Gemini response missing content"), 502);
  const text = parts.map((p) => (typeof p.text === "string" ? p.text : "")).join("\n").trim();
  if (!text) throw withStatus(new Error("Gemini returned empty text"), 502);
  return text;
}

async function analyzeWithClaude({ model, prompt, screenshots }) {
  const content = [];
  for (const shot of screenshots) {
    content.push({
      type: "text",
      text: `Screenshot ${shot.index}: ${shot.name}`,
    });
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: shot.mimeType,
        data: shot.base64,
      },
    });
  }
  content.push({ type: "text", text: prompt });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1800,
      temperature: 0.2,
      messages: [{ role: "user", content }],
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw withStatus(new Error(`Claude API error: ${data.error?.message || res.statusText}`), 502);
  }
  const text = extractClaudeText(data);
  const parseInfo = parseModelJsonDetailed(text);
  const parsed = parseInfo.parsed;
  return {
    ok: true,
    provider: "claude",
    model,
    parsed,
    parseInfo,
    usage: data.usage || null,
    rawText: parsed ? undefined : text,
  };
}

function extractClaudeText(data) {
  const blocks = Array.isArray(data?.content) ? data.content : [];
  const text = blocks
    .filter((b) => b.type === "text")
    .map((b) => b.text || "")
    .join("\n")
    .trim();
  if (!text) throw withStatus(new Error("Claude returned empty text"), 502);
  return text;
}

function parseModelJsonDetailed(text) {
  const raw = String(text || "").replace(/^\uFEFF/, "").trim();
  const attempts = [];

  const tryParse = (label, candidate) => {
    try {
      const parsed = JSON.parse(candidate);
      return { parsed, label };
    } catch (error) {
      attempts.push({ label, error: String(error.message || error) });
      return null;
    }
  };

  let hit = tryParse("raw", raw);
  if (hit) {
    return { ok: true, parsed: hit.parsed, source: hit.label, attempts };
  }

  const fenced = raw.match(/```json\s*([\s\S]*?)```/i) || raw.match(/```\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    hit = tryParse("fenced", fenced[1].trim());
    if (hit) return { ok: true, parsed: hit.parsed, source: hit.label, attempts };
  }

  const first = raw.indexOf("{");
  const last = raw.lastIndexOf("}");
  if (first >= 0 && last > first) {
    hit = tryParse("object_slice", raw.slice(first, last + 1));
    if (hit) return { ok: true, parsed: hit.parsed, source: hit.label, attempts };
  }

  const repaired = repairJsonHeuristic(raw);
  if (repaired && repaired !== raw) {
    hit = tryParse("heuristic_repair", repaired);
    if (hit) return { ok: true, parsed: hit.parsed, source: hit.label, attempts, repairedText: repaired };
  }

  const lastError = attempts[attempts.length - 1]?.error || "Unknown JSON parse error";
  return {
    ok: false,
    parsed: null,
    source: null,
    repairedText: repaired && repaired !== raw ? repaired : null,
    error: lastError,
    attempts,
  };
}

function repairJsonHeuristic(rawText) {
  let text = String(rawText || "").trim();
  if (!text) return text;

  const fenced = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/i);
  if (fenced?.[1]) text = fenced[1].trim();
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first >= 0 && last > first) text = text.slice(first, last + 1);

  // Remove trailing commas before object/array close.
  text = text.replace(/,\s*([}\]])/g, "$1");

  // Remove JS-style comments if model accidentally added them.
  text = text.replace(/^\s*\/\/.*$/gm, "");

  return text.trim();
}

function sanitizeErrorMessage(error) {
  let msg = (error && error.message) ? String(error.message) : "Unexpected server error";
  const secrets = [process.env.GEMINI_API_KEY, process.env.ANTHROPIC_API_KEY].filter(Boolean);
  for (const secret of secrets) {
    msg = msg.replaceAll(secret, "[REDACTED]");
  }
  return msg;
}

async function getV11() {
  if (!v11ModulePromise) {
    const modUrl = pathToFileURL(path.join(process.cwd(), "v1_1", "index.mjs")).href;
    v11ModulePromise = import(modUrl);
  }
  return v11ModulePromise;
}

function analyzeReplyIntelligence(input) {
  const platform = normalizePlatform(input.platform);
  const timeElapsedDays = normalizeTimeElapsed(input.time_elapsed_days);
  const previousAttempts = clampInt(input.previous_attempts, 0, 9, 1);
  const objective = normalizeObjective(input.objective);
  const originalMessage = stripWhitespace(String(input.original_message || ""));
  const theirReply = stripWhitespace(String(input.their_reply || ""));
  const replyPresent = theirReply.length > 0;

  const noReplyOneBumpLimit = !replyPresent && previousAttempts > 1;
  if (noReplyOneBumpLimit) {
    return {
      analysis: {
        emotional_tone_classification: "Polite/Neutral",
        tone: "Polite/Neutral",
        objection_type: "no_reply",
        intent_level: "Low",
        engagement_depth_score: 1,
        conversion_likelihood_score: 1,
        response_energy_level: "low",
        politeness_mask_risk: "unknown",
        readiness_score: 0,
        warning: "one_bump_limit_reached",
        best_next_action: "drop",
        reason_codes: ["no_reply", "one_bump_limit_reached"],
        hard_stop: "one_bump_limit_reached",
        style_checks: styleChecks("", ""),
      },
      recommended_objective: "Do not send another follow-up.",
      best_next_action: "drop",
      draft_1: "",
      draft_2: "",
      risk_analysis: [
        "Do not send another bump",
        "Do not guilt them for not replying",
        "Do not add links or a pitch to revive the thread",
      ],
      spam_risk: "high",
      send_status: "red",
    };
  }

  const replySignals = detectReplySignals(theirReply);
  const tone = classifyTone(theirReply, replySignals);
  const intentLevel = classifyIntent(replyPresent, replySignals);
  const objectionType = classifyObjectionType({ replyPresent, signals: replySignals, reply: theirReply });
  const engagementDepth = computeEngagementDepthScore({ replyPresent, signals: replySignals, reply: theirReply });
  const conversionLikelihood = computeConversionLikelihoodScore({
    platform,
    objective,
    replyPresent,
    signals: replySignals,
    intentLevel,
    timeElapsedDays,
    engagementDepth,
    objectionType,
  });
  const responseEnergy = classifyResponseEnergy({ replyPresent, signals: replySignals, reply: theirReply });
  const politenessMaskRisk = classifyPolitenessMaskRisk({ replyPresent, signals: replySignals, tone, intentLevel, engagementDepth });
  const readinessScore = computeReadinessScore({
    replyPresent,
    timeElapsedDays,
    platform,
    signals: replySignals,
    intentLevel,
  });
  const sendStatus = classifySendStatus(replyPresent, readinessScore, replySignals, timeElapsedDays);
  const bestNextAction = classifyBestNextAction({
    replyPresent,
    sendStatus,
    intentLevel,
    platform,
    objective,
    signals: replySignals,
    objectionType,
  });
  const recommendedObjective = buildRecommendedObjective({
    replyPresent,
    platform,
    objective,
    timeElapsedDays,
    intentLevel,
    readinessScore,
    signals: replySignals,
    sendStatus,
  });

  const drafts = buildReplyIntelDrafts({
    platform,
    timeElapsedDays,
    previousAttempts,
    originalMessage,
    theirReply,
    replyPresent,
    tone,
    intentLevel,
    readinessScore,
    sendStatus,
    signals: replySignals,
  });

  const warning = getReplyIntelWarning({ replyPresent, timeElapsedDays, sendStatus, platform, previousAttempts });
  const risk = getReplyIntelRisk({ replyPresent, sendStatus, intentLevel, previousAttempts, platform });

  return {
    analysis: {
      emotional_tone_classification: tone,
      tone,
      objection_type: objectionType,
      intent_level: intentLevel,
      engagement_depth_score: engagementDepth,
      conversion_likelihood_score: conversionLikelihood,
      response_energy_level: responseEnergy,
      politeness_mask_risk: politenessMaskRisk,
      readiness_score: readinessScore,
      warning,
      best_next_action: bestNextAction,
      reason_codes: buildReasonCodes({ replyPresent, timeElapsedDays, platform, signals: replySignals, intentLevel, sendStatus }),
      hard_stop: null,
      style_checks: styleChecks(drafts.draft_1, drafts.draft_2),
    },
    recommended_objective: recommendedObjective,
    best_next_action: bestNextAction,
    draft_1: drafts.draft_1,
    draft_2: drafts.draft_2,
    risk_analysis: buildRiskAnalysis({
      platform,
      objective,
      replyPresent,
      intentLevel,
      sendStatus,
      objectionType,
      signals: replySignals,
      timeElapsedDays,
    }),
    spam_risk: risk,
    send_status: sendStatus,
  };
}

function normalizePlatform(value) {
  const raw = String(value || "Other").trim();
  if (!raw) return "Other";
  const known = ["MyLanguageExchange", "TikTok", "Facebook", "LinkedIn", "Instagram", "Other"];
  const match = known.find((k) => k.toLowerCase() === raw.toLowerCase());
  return match || raw;
}

function normalizeObjective(value) {
  const raw = String(value || "tester").trim().toLowerCase();
  if (["tester", "paid", "call"].includes(raw)) return raw;
  return "tester";
}

function normalizeTimeElapsed(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 1;
  if (n >= 5) return 5;
  if (n >= 3) return 3;
  if (n >= 1) return 1;
  return 0;
}

function clampInt(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function detectReplySignals(reply) {
  const text = String(reply || "");
  const lower = text.toLowerCase();
  return {
    hasQuestion: /\?/.test(text),
    asksAvailability: /\b(when are you free|when.*free|what time|what day|which day|when works|schedule|available)\b/i.test(text),
    positive: /\b(yes|yeah|yep|sounds good|great|sure|okay|ok|love to|interested|works for me)\b/i.test(text),
    apologyDelay: /\b(sorry|so sorry|busy|crazy week|crazy|late reply|late response)\b/i.test(text),
    hesitation: /\b(maybe|sometime|not sure|we'?ll see|later|perhaps)\b/i.test(text),
    bluntShort: lower.trim() === "ok" || lower.trim() === "okay" || lower.trim() === "sure",
    asksAboutNeeds: /\b(struggle|problem|help|practice|phrasal verbs|pronunciation|fluency)\b/i.test(text),
    wantsAudio: /\b(audio|voice|call|whatsapp|speak|speaking)\b/i.test(text),
    negativeNo: /\b(no thanks|not interested|can'?t|cannot|don'?t want)\b/i.test(text),
    wordCount: text ? text.split(/\s+/).filter(Boolean).length : 0,
  };
}

function classifyTone(reply, signals) {
  if (!reply) return "Polite/Neutral";
  if (signals.negativeNo) return "Blunt";
  if (signals.hesitation) return "Hesitant";
  if (signals.positive && (signals.hasQuestion || /!/.test(reply) || signals.wordCount >= 6)) return "Warm";
  if (signals.bluntShort) return "Blunt";
  return "Polite/Neutral";
}

function classifyIntent(replyPresent, signals) {
  if (!replyPresent) return "Low";
  if (signals.negativeNo) return "Low";
  if (signals.asksAvailability || (signals.hasQuestion && signals.positive) || signals.wantsAudio) return "High";
  if (signals.positive && !signals.hesitation) return "Medium";
  if (signals.hesitation || signals.bluntShort) return "Low";
  return "Medium";
}

function classifyObjectionType({ replyPresent, signals, reply }) {
  if (!replyPresent) return "no_reply";
  if (signals.negativeNo) return "rejection";
  if (signals.apologyDelay) return "timing";
  if (signals.asksAvailability) return "scheduling";
  if (signals.hesitation) return "low_commitment";
  if (signals.bluntShort) return "low_energy";
  if (signals.asksAboutNeeds) return "needs_clarity";
  if (/\b(price|cost|expensive|free)\b/i.test(String(reply || ""))) return "price";
  return "none";
}

function computeEngagementDepthScore({ replyPresent, signals, reply }) {
  if (!replyPresent) return 1;
  let score = 2;
  if (signals.positive) score += 2;
  if (signals.hasQuestion) score += 2;
  if (signals.asksAvailability) score += 2;
  if (signals.wantsAudio) score += 1;
  if (signals.asksAboutNeeds) score += 1;
  if ((signals.wordCount || 0) >= 10) score += 1;
  if (signals.bluntShort) score = Math.min(score, 2);
  if (signals.negativeNo) score = 1;
  return Math.max(1, Math.min(10, score));
}

function computeConversionLikelihoodScore({
  platform,
  objective,
  replyPresent,
  signals,
  intentLevel,
  timeElapsedDays,
  engagementDepth,
  objectionType,
}) {
  if (!replyPresent) return timeElapsedDays >= 5 ? 2 : 3;
  let score = 3;
  if (intentLevel === "High") score += 3;
  else if (intentLevel === "Medium") score += 2;
  if (engagementDepth >= 7) score += 2;
  else if (engagementDepth >= 5) score += 1;
  if (signals.asksAvailability || signals.wantsAudio) score += 1;
  if (signals.hesitation) score -= 2;
  if (signals.bluntShort) score -= 2;
  if (signals.negativeNo) score = 1;
  if (objectionType === "timing") score -= 1;
  if (platform === "MyLanguageExchange" && objective === "tester") score += 1;
  if (platform === "TikTok" && objective === "tester" && signals.positive) score += 1;
  return Math.max(1, Math.min(10, score));
}

function classifyResponseEnergy({ replyPresent, signals, reply }) {
  if (!replyPresent) return "none";
  if (signals.negativeNo) return "low";
  const text = String(reply || "");
  const exclam = (text.match(/!/g) || []).length;
  if ((signals.wordCount || 0) >= 10 || signals.hasQuestion || exclam >= 1) return "high";
  if ((signals.wordCount || 0) >= 4 || signals.positive) return "medium";
  return "low";
}

function classifyPolitenessMaskRisk({ replyPresent, signals, tone, intentLevel, engagementDepth }) {
  if (!replyPresent) return "unknown";
  if (signals.negativeNo) return "low";
  if (tone === "Polite/Neutral" && intentLevel === "Low" && engagementDepth <= 3 && !signals.hasQuestion) return "high";
  if (signals.hesitation || signals.bluntShort) return "medium";
  return "low";
}

function computeReadinessScore({ replyPresent, timeElapsedDays, platform, signals, intentLevel }) {
  if (!replyPresent) {
    let score = timeElapsedDays >= 5 ? 44 : timeElapsedDays >= 3 ? 35 : 20;
    if (platform === "MyLanguageExchange") score += 5;
    return Math.max(0, Math.min(100, score));
  }

  let score = 35;
  if (intentLevel === "High") score += 35;
  if (intentLevel === "Medium") score += 15;
  if (signals.positive) score += 10;
  if (signals.hasQuestion) score += 10;
  if (signals.asksAvailability) score += 10;
  if (signals.apologyDelay) score += 5;
  if (signals.hesitation) score -= 20;
  if (signals.bluntShort) score -= 15;
  if (signals.negativeNo) score = 5;
  if (timeElapsedDays >= 3 && !signals.apologyDelay) score -= 5;
  if (timeElapsedDays >= 5 && !signals.apologyDelay) score -= 10;
  if (platform === "MyLanguageExchange" && intentLevel === "High") score += 5;
  return Math.max(0, Math.min(100, score));
}

function classifySendStatus(replyPresent, readinessScore, signals, timeElapsedDays) {
  if (!replyPresent) {
    if (timeElapsedDays >= 5) return "yellow";
    return "red";
  }
  if (signals.negativeNo) return "red";
  if (readinessScore >= 61) return "green";
  if (readinessScore >= 31) return "yellow";
  return "red";
}

function classifyBestNextAction({ replyPresent, sendStatus, intentLevel, platform, objective, signals, objectionType }) {
  if (!replyPresent) {
    return sendStatus === "yellow" ? "engage" : "drop";
  }
  if (sendStatus === "red") return "drop";
  if (objectionType === "timing") return "pause";
  if (platform === "TikTok" && objective === "tester" && intentLevel === "High" && signals.positive) return "escalate";
  if (platform === "MyLanguageExchange" && intentLevel === "High" && (signals.asksAvailability || signals.wantsAudio)) return "escalate";
  if (intentLevel === "Low") return "engage";
  return "engage";
}

function buildRecommendedObjective({ replyPresent, platform, objective, timeElapsedDays, intentLevel, readinessScore, signals, sendStatus }) {
  if (!replyPresent) {
    if (sendStatus === "red") return "Wait. Do not send a bump yet.";
    return "Send one low-pressure bump with value or an easy out.";
  }
  if (sendStatus === "red") return "Do not push. Close the loop politely or move on.";
  if (platform === "MyLanguageExchange" && intentLevel === "High" && readinessScore >= 61) {
    return "Lock in a time and transition to WhatsApp.";
  }
  if (platform === "TikTok" && intentLevel === "High" && readinessScore >= 61) {
    if (objective === "call") return "Offer a very short call or voice chat next step, keep it low friction.";
    if (objective === "paid") return "Confirm interest and move toward a clear offer step, do not overload with details.";
    return "Send the Unmute link and ask for quick feedback. Keep it short.";
  }
  if (platform === "LinkedIn" && intentLevel === "High" && signals.asksAvailability) {
    return "Lock in a time and move to a professional scheduling channel.";
  }
  if (intentLevel === "Low") return "Test engagement with one lightweight question.";
  return "Keep momentum with a short, specific reply and one easy next step.";
}

function buildReplyIntelDrafts(ctx) {
  if (ctx.sendStatus === "red") return { draft_1: "", draft_2: "" };
  if (!ctx.replyPresent) return buildNoReplyDrafts(ctx);
  return buildReplyDrafts(ctx);
}

function buildNoReplyDrafts(ctx) {
  const basePrimary =
    ctx.timeElapsedDays >= 5
      ? "Hey, hope your week is going well. No rush on this, if you still want to practice later, I am around."
      : "No rush on this. The offer stands whenever the timing works.";
  const baseAlt =
    ctx.timeElapsedDays >= 5
      ? "Quick bump, no pressure. Happy to chat whenever your schedule calms down."
      : "All good if now is a busy week. We can pick this up later.";
  return finalizeDraftPair(basePrimary, baseAlt, ctx.platform);
}

function buildReplyDrafts(ctx) {
  const r = ctx.theirReply;
  const s = ctx.signals;
  const p = ctx.platform;

  let primary = "";
  let alt = "";

  if (p === "TikTok" && (ctx.intentLevel === "High" || s.positive)) {
    primary = "Nice. It is called Unmute, here is the link: [link]. Let me know what you think, any feedback helps.";
    alt = "Love it. I can send the Unmute link here, it is free while I am testing it. Want it?";
  } else if (s.asksAvailability || (ctx.intentLevel === "High" && s.hasQuestion)) {
    if (p === "MyLanguageExchange") {
      primary = "Awesome. I am free Tuesday or Wednesday around 5pm your time. If that works, send your WhatsApp and we can coordinate there.";
      alt = "Great. Tuesday or Thursday usually works best for me. Tell me what day is easiest for you.";
    } else if (p === "LinkedIn") {
      primary = "Great timing. I can do Tuesday or Wednesday afternoon. If that works, I can send a quick Calendly link or we can coordinate here.";
      alt = "Sounds good. I have a couple of slots this week, Tuesday or Thursday. Which is easier for you?";
    } else {
      primary = "Awesome. I can do Tuesday or Wednesday this week. What time usually works best for you?";
      alt = "Great. I have time this week, Tuesday or Thursday. Pick whatever is easiest.";
    }
  } else if (s.apologyDelay && s.positive) {
    primary = "No worries at all. Work gets busy. When things calm down, we can set up a quick practice call.";
    alt = "All good, life happens. If you still want to practice this week, send me a day that works.";
  } else if (s.hesitation || s.bluntShort || ctx.intentLevel === "Low") {
    primary = "Sounds good. No rush. Are you mostly looking for text chat or audio practice?";
    alt = "Cool. What kind of practice helps you most right now, conversation or pronunciation?";
  } else if (s.asksAboutNeeds) {
    primary = "That is a very normal problem. We can focus on that first in a short practice chat. I have time Thursday morning if that helps.";
    alt = "Makes sense. We can keep it simple and work on that exact issue first. Want to try a short exchange this week?";
  } else {
    primary = "Nice. Happy to do a short exchange this week. Tell me what day is easiest for you.";
    alt = "Great. I am up for a quick practice chat. We can keep it short and low pressure.";
  }

  if (ctx.timeElapsedDays >= 3) {
    primary = prependNoPressure(primary);
    alt = prependNoPressure(alt);
  }

  return finalizeDraftPair(primary, alt, p);
}

function prependNoPressure(text) {
  const t = String(text || "").trim();
  if (!t) return t;
  if (/^no worries|^all good|^no rush/i.test(t)) return t;
  return `No worries on the delay. ${t}`;
}

function finalizeDraftPair(primary, alt, platform) {
  let d1 = cleanDraftStyle(primary, platform);
  let d2 = cleanDraftStyle(alt, platform);
  return { draft_1: d1, draft_2: d2 };
}

function cleanDraftStyle(text, platform) {
  let out = String(text || "");
  out = out.replace(/[—–]/g, ",");
  out = out.replace(/\s+/g, " ").trim();
  out = out.replace(/\b(I noticed|I came across your profile)\b/gi, "");
  out = out.replace(/\s{2,}/g, " ").trim();
  if (platform === "MyLanguageExchange") {
    out = out.replace(/\bUnmute\b/gi, "");
    out = out.replace(/\bapp\b/gi, "practice tool");
  }
  out = enforceSentenceWordLimit(out, 15);
  return out;
}

function enforceSentenceWordLimit(text, maxWords) {
  const parts = String(text || "")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const clipped = parts.map((sentence) => {
    const words = sentence.split(/\s+/);
    if (words.length <= maxWords) return sentence;
    const endPunc = /[.!?]$/.test(sentence) ? sentence.slice(-1) : ".";
    const trimmed = words.slice(0, maxWords).join(" ").replace(/[.!?]+$/, "");
    return `${trimmed}${endPunc}`;
  });
  return clipped.join(" ").replace(/\s+([,.!?])/g, "$1").trim();
}

function getReplyIntelWarning({ replyPresent, timeElapsedDays, sendStatus, platform, previousAttempts }) {
  if (!replyPresent && previousAttempts > 1) return "one_bump_limit_reached";
  if (!replyPresent && timeElapsedDays < 5) return "wait_before_bump";
  if (platform === "MyLanguageExchange" && sendStatus !== "red") return "mle_no_app_mention";
  return null;
}

function getReplyIntelRisk({ replyPresent, sendStatus, intentLevel, previousAttempts }) {
  if (sendStatus === "red") return "high";
  if (!replyPresent && previousAttempts >= 1) return "medium";
  if (intentLevel === "Low") return "medium";
  return "low";
}

function buildReasonCodes({ replyPresent, timeElapsedDays, platform, signals, intentLevel, sendStatus }) {
  const codes = [];
  if (!replyPresent) codes.push("no_reply");
  if (replyPresent) codes.push("reply_present");
  if (timeElapsedDays === 0) codes.push("same_day");
  if (timeElapsedDays === 1) codes.push("normal_async_1_2d");
  if (timeElapsedDays === 3) codes.push("delayed_3_4d");
  if (timeElapsedDays === 5) codes.push("cold_5d_plus");
  if (signals.apologyDelay) codes.push("apology_delay_signal");
  if (signals.asksAvailability) codes.push("asks_availability");
  if (signals.hesitation) codes.push("hesitation_signal");
  if (signals.bluntShort) codes.push("short_reply");
  if (platform === "MyLanguageExchange") codes.push("mle_no_app");
  codes.push(`intent_${String(intentLevel || "").toLowerCase()}`);
  codes.push(`status_${String(sendStatus || "").toLowerCase()}`);
  return codes;
}

function buildRiskAnalysis({ platform, objective, replyPresent, intentLevel, sendStatus, objectionType, signals, timeElapsedDays }) {
  const items = [];
  if (!replyPresent && timeElapsedDays >= 5) {
    items.push("Do not guilt them for the silence");
    items.push("Do not send more than one bump");
  }
  if (platform === "MyLanguageExchange") {
    items.push("Do not mention Unmute or any app yet");
    items.push("Do not add links in the DM");
  }
  if (platform === "TikTok" && !signals.positive) {
    items.push("Do not send a link before clear interest");
  }
  if (objective === "paid" && intentLevel !== "High") {
    items.push("Do not push price or offer details too early");
  }
  if (objectionType === "timing") {
    items.push("Do not force scheduling if they said they are busy");
  }
  if (signals.bluntShort || sendStatus === "yellow") {
    items.push("Do not send a long paragraph");
    items.push("Do not ask multiple questions");
  }
  if (sendStatus === "red") {
    items.push("Do not keep nudging after a clear no or repeated no-reply");
  }
  return [...new Set(items)].slice(0, 6);
}

function styleChecks(draft1, draft2) {
  const combined = [draft1, draft2].filter(Boolean).join(" ");
  const sentenceWordCounts = combined
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.split(/\s+/).filter(Boolean).length);
  return {
    no_em_dash: !/[—–]/.test(combined),
    no_generic_opener: !/\b(i noticed|i came across your profile)\b/i.test(combined),
    max_sentence_words_ok: sentenceWordCounts.every((n) => n <= 15),
  };
}

async function appendReplyIntelHistory(entry) {
  try {
    ensureDataDir();
    let rows = [];
    if (fs.existsSync(REPLY_INTEL_HISTORY_FILE)) {
      const raw = fs.readFileSync(REPLY_INTEL_HISTORY_FILE, "utf8");
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) rows = parsed;
    }
    rows.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      ...entry,
    });
    if (rows.length > 500) rows = rows.slice(-500);
    fs.writeFileSync(REPLY_INTEL_HISTORY_FILE, JSON.stringify(rows, null, 2));
  } catch {
    // Non-fatal; do not block reply analysis if local history write fails.
  }
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readAppSettings() {
  try {
    ensureDataDir();
    if (!fs.existsSync(APP_SETTINGS_FILE)) return { contextHubPath: DEFAULT_CONTEXT_HUB_PATH };
    const raw = fs.readFileSync(APP_SETTINGS_FILE, "utf8");
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      contextHubPath: typeof parsed.contextHubPath === "string" && parsed.contextHubPath.trim()
        ? parsed.contextHubPath.trim()
        : DEFAULT_CONTEXT_HUB_PATH,
    };
  } catch {
    return { contextHubPath: DEFAULT_CONTEXT_HUB_PATH };
  }
}

function writeAppSettings(settings) {
  ensureDataDir();
  fs.writeFileSync(APP_SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

function readContextHubSummary() {
  const settings = readAppSettings();
  const hubPath = settings.contextHubPath || DEFAULT_CONTEXT_HUB_PATH;
  const exists = fs.existsSync(hubPath);
  if (!exists) {
    return {
      path: hubPath,
      exists: false,
      warning: "Context Hub folder not found",
    };
  }

  const safeReadJson = (relPath) => {
    try {
      const abs = path.join(hubPath, relPath);
      if (!fs.existsSync(abs)) return { missing: true, path: abs };
      return { data: JSON.parse(fs.readFileSync(abs, "utf8")), path: abs };
    } catch (error) {
      return { error: error.message };
    }
  };

  const currentState = safeReadJson(path.join("shared", "current_state.json"));
  const channels = safeReadJson(path.join("shared", "channels.json"));
  const weeklyRotation = safeReadJson(path.join("shared", "weekly_rotation.json"));
  const versionRegistry = safeReadJson(path.join("meta", "version_registry.json"));

  const summary = {
    path: hubPath,
    exists: true,
    files: {
      current_state: summarizeFileMeta(currentState.data),
      channels: summarizeFileMeta(channels.data),
      weekly_rotation: summarizeFileMeta(weeklyRotation.data),
      version_registry: summarizeFileMeta(versionRegistry.data),
    },
    currentFocus: currentState.data?.active_channel_focus || null,
    priorities: Array.isArray(currentState.data?.operating_priorities)
      ? currentState.data.operating_priorities.slice(0, 8)
      : [],
    outreachChannels: Array.isArray(channels.data?.channels)
      ? []
      : Object.entries(channels.data?.channels || {})
          .filter(([, v]) => String(v?.primary_use || "").toLowerCase().includes("outreach"))
          .map(([k, v]) => ({ key: k, status: v?.status || "unknown", label: v?.label || k })),
  };

  const warnings = [];
  if (currentState.missing) warnings.push("Missing shared/current_state.json");
  if (channels.missing) warnings.push("Missing shared/channels.json");
  if (weeklyRotation.missing) warnings.push("Missing shared/weekly_rotation.json");
  if (versionRegistry.missing) warnings.push("Missing meta/version_registry.json");
  if (currentState.error) warnings.push(`current_state.json error: ${currentState.error}`);
  if (channels.error) warnings.push(`channels.json error: ${channels.error}`);
  if (weeklyRotation.error) warnings.push(`weekly_rotation.json error: ${weeklyRotation.error}`);
  if (versionRegistry.error) warnings.push(`version_registry.json error: ${versionRegistry.error}`);
  if (warnings.length) summary.warnings = warnings;

  return summary;
}

function summarizeFileMeta(json) {
  if (!json || typeof json !== "object") return null;
  const meta = json._meta && typeof json._meta === "object" ? json._meta : {};
  return {
    version: meta.version || null,
    last_updated: meta.last_updated || null,
  };
}
