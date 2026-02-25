const STORAGE_KEY = "dailyOperatorCopilot.v1";

const PLAYBOOK_RANGE = {
  start: "2026-02-20",
  end: "2026-03-31",
};

const DAILY_BLOCKS = [
  {
    id: "outreach",
    index: 1,
    name: "Outreach",
    window: "7:00–8:20",
    mode: "High energy · people mode",
    tasks: [
      {
        id: "research",
        label: "7:00 Research",
        durationMin: 15,
        detail: "Find 10 profiles/posts (LinkedIn M/W/F, Facebook T/Th/Sat). Save to tab group and note what they posted.",
      },
      {
        id: "warm_comments",
        label: "7:15 Warm-up comments",
        durationMin: 15,
        detail: "Comment on 5 posts with a specific observation + teaching tip. Story-first, not generic praise.",
      },
      {
        id: "send_dms",
        label: "7:30 Send 5 DMs",
        durationMin: 20,
        detail: "DM the 5 people you commented on. Personalize from the post, lead with a short story.",
      },
      {
        id: "watering_hole",
        label: "7:50 Watering Hole",
        durationMin: 25,
        detail: "Send 5–8 MyLanguageExchange messages and prep Lingoda mention lines for breaks.",
      },
      {
        id: "log_results",
        label: "8:15 Log results",
        durationMin: 5,
        detail: "Log DMs / responses / WhatsApp adds / classes booked. Add positive replies to broadcast list.",
      },
    ],
  },
  {
    id: "distribution",
    index: 2,
    name: "Distribution",
    window: "8:30–9:30",
    mode: "Admin mode · one task only",
    tasks: [
      {
        id: "distribution_task",
        label: "8:30 Distribution task of the day",
        durationMin: 60,
        detail: "Do only the weekly-rotation task. Build UTMs and link everything to landing page.",
      },
    ],
  },
  {
    id: "teaching",
    index: 3,
    name: "Teaching",
    window: "12:00–5:00",
    mode: "Live teaching + break-time maintenance",
    tasks: [
      {
        id: "teaching_block",
        label: "12:00–5:00 Teaching block",
        durationMin: 300,
        detail: "Teach Lingoda classes. Breaks: check DM replies, MLE messages, and scatter TikTok comments.",
      },
    ],
  },
  {
    id: "bug_fixes",
    index: 4,
    name: "Bug Fixes",
    window: "5:00–6:00",
    mode: "Code mode · hard stop",
    tasks: [
      {
        id: "app_maintenance",
        label: "5:00 App maintenance",
        durationMin: 60,
        detail: "Fix highest-impact bug only. P0 now, P1 log, P2 ignore. Hard stop at 6:00 PM even mid-fix.",
      },
    ],
  },
  {
    id: "content",
    index: 5,
    name: "Content",
    window: "6:30–8:30",
    mode: "Creative mode · two channels, two characters",
    tasks: [
      {
        id: "mr_blue_short",
        label: "6:30 Mr Blue short",
        durationMin: 60,
        detail: "1 short/day (TikTok + YouTube). Wholesome confusion. Comments end with 🔵🔵🔵.",
      },
      {
        id: "guided_nap_short",
        label: "7:30 Guided Nap short",
        durationMin: 60,
        detail: "1 short/day (TikTok + YouTube). Deadpan sincerity, absurdist collapse, no emoji signature.",
      },
    ],
  },
];

const WEEKLY_ROTATION = {
  1: { outreach: "LinkedIn — French", distribution: "Directory submissions" },
  2: { outreach: "Facebook — Spanish/LATAM", distribution: "Reddit value post" },
  3: { outreach: "LinkedIn — Brazilian", distribution: "Directory follow-ups" },
  4: { outreach: "Facebook — Russian", distribution: "Reddit comments / karma" },
  5: { outreach: "LinkedIn — Best performers", distribution: "Indie Hackers / community" },
  6: { outreach: "Facebook — All groups", distribution: "PH prep / asset creation" },
  0: { outreach: "Rest", distribution: "Weekly review + plan" },
};

const SPRINT_CALENDAR = [
  { start: "2026-02-20", end: "2026-03-01", mode: "SPRINT", totalPerDay: 40, split: "20 Mr Blue + 20 Guided Nap", approxTime: "~50 min/day" },
  { start: "2026-03-02", end: "2026-03-22", mode: "MAINTENANCE", totalPerDay: 10, split: "5 Mr Blue + 5 Guided Nap", approxTime: "~15 min/day" },
  { start: "2026-03-23", end: "2026-03-29", mode: "SPRINT", totalPerDay: 35, split: "17–18 each", approxTime: "~45 min/day" },
  { start: "2026-03-30", end: "2099-12-31", mode: "MAINTENANCE", totalPerDay: 10, split: "5 + 5", approxTime: "~15 min/day" },
];

const DISTRIBUTION_WEEKS = [
  {
    name: "Week 1: Foundation",
    start: "2026-02-20",
    end: "2026-02-26",
    tasks: [
      "Thu: Submit to 5 directories via Submit.co. Set UTM links (UTM.io) + short links (Dub.co).",
      "Fri: Submit to 5 more directories. Activate Product Hunt Ship page (Launchman).",
      "Sat: Create Reddit account if needed, join target subs, start commenting.",
    ],
  },
  {
    name: "Week 2: Expand Directories",
    start: "2026-02-27",
    end: "2026-03-05",
    tasks: [
      "Mon: Submit to BetaList with compelling one-liner + screenshot.",
      "Tue: Submit to AlternativeTo (position vs Duolingo). Post a genuine Reddit comment.",
      "Wed: Submit to Futurepedia. Follow up on Week 1 directories.",
      "Thu: Reddit 3–5 genuine comments on language-learning posts (build karma).",
      "Fri: Check directory analytics and double down.",
      "Sat: Review metrics and adjust.",
    ],
  },
  {
    name: "Week 3: Community Seeding",
    start: "2026-03-06",
    end: "2026-03-12",
    tasks: [
      "Mon: Write Indie Hackers launch post (authentic founder story + neurodivergent angle).",
      "Tue: First value post to r/languagelearning (methodology, not app link).",
      "Wed: Post to r/ADHD or r/socialanxiety about speaking anxiety.",
      "Thu: LinkedIn builder journey + newsletter CTA.",
      "Fri: Respond to all Reddit/IH comments. Link only if asked.",
      "Sat: Review traction and plan Week 4 focus.",
    ],
  },
  {
    name: "Week 4: Product Hunt Prep",
    start: "2026-03-13",
    end: "2026-03-19",
    tasks: [
      "Mon: Launchman checklist (logo, tagline, screenshots, maker comment draft).",
      "Tue: Write 3 PH update posts for Ship subscribers and schedule them.",
      "Wed: Reach out to 10 people for early PH votes.",
      "Thu: Finalize PH gallery images + demo GIF. Test landing page conversion.",
      "Fri: Draft launch day timeline and pick launch day in Week 5–6.",
      "Sat: Fix onboarding friction from tester feedback (no new features).",
    ],
  },
  {
    name: "Week 5–6: Product Hunt Launch",
    start: "2026-03-20",
    end: "2026-03-31",
    tasks: [
      "Launch: Go live 12:01 AM PST. Post maker comment. Share everywhere. Monitor all day.",
      "Day 2: Respond to every PH comment. Share LinkedIn + founder thread.",
      "Day 3–5: Follow-up on IH, Reddit recap, newsletter update.",
      "Rest: Analyze PH cohort, D1 retention, conversion rate, review quality. Cut bottom channels.",
    ],
  },
];

const DOM = {
  datePicker: document.getElementById("datePicker"),
  commentMode: document.getElementById("commentMode"),
  contentToolsToggle: document.getElementById("contentToolsToggle"),
  simpleModeToggle: document.getElementById("simpleModeToggle"),
  resetDayBtn: document.getElementById("resetDayBtn"),
  dailyFlowSteps: document.getElementById("dailyFlowSteps"),
  mleSequencer: document.getElementById("mleSequencer"),
  tiktokSequencer: document.getElementById("tiktokSequencer"),
  replyIntelPlatform: document.getElementById("replyIntelPlatform"),
  replyIntelTimeElapsed: document.getElementById("replyIntelTimeElapsed"),
  replyIntelPrevAttempts: document.getElementById("replyIntelPrevAttempts"),
  replyIntelObjective: document.getElementById("replyIntelObjective"),
  replyIntelOriginalMessage: document.getElementById("replyIntelOriginalMessage"),
  replyIntelTheirReply: document.getElementById("replyIntelTheirReply"),
  analyzeReplyIntelBtn: document.getElementById("analyzeReplyIntelBtn"),
  replyIntelStatus: document.getElementById("replyIntelStatus"),
  replyIntelOutput: document.getElementById("replyIntelOutput"),
  todaySummary: document.getElementById("todaySummary"),
  todayCards: document.getElementById("todayCards"),
  timeline: document.getElementById("timeline"),
  timerDisplay: document.getElementById("timerDisplay"),
  timerLabel: document.getElementById("timerLabel"),
  timerTaskSelect: document.getElementById("timerTaskSelect"),
  loadTimerBtn: document.getElementById("loadTimerBtn"),
  startPauseTimerBtn: document.getElementById("startPauseTimerBtn"),
  resetTimerBtn: document.getElementById("resetTimerBtn"),
  contextNotes: document.getElementById("contextNotes"),
  outreachDrafts: document.getElementById("outreachDrafts"),
  willCommentDrafts: document.getElementById("willCommentDrafts"),
  mleDrafts: document.getElementById("mleDrafts"),
  conversionDrafts: document.getElementById("conversionDrafts"),
  mrBlueDrafts: document.getElementById("mrBlueDrafts"),
  guidedNapDrafts: document.getElementById("guidedNapDrafts"),
  captionDrafts: document.getElementById("captionDrafts"),
  safetyNotes: document.getElementById("safetyNotes"),
  generateClaudePackBtn: document.getElementById("generateClaudePackBtn"),
  claudePackOutput: document.getElementById("claudePackOutput"),
  metricDmsSent: document.getElementById("metricDmsSent"),
  metricResponses: document.getElementById("metricResponses"),
  metricWhatsAppAdds: document.getElementById("metricWhatsAppAdds"),
  metricClassesBooked: document.getElementById("metricClassesBooked"),
  metricMrBlueComments: document.getElementById("metricMrBlueComments"),
  metricGuidedNapComments: document.getElementById("metricGuidedNapComments"),
  quickLogRow: document.getElementById("quickLogRow"),
  generateDailyReviewBtn: document.getElementById("generateDailyReviewBtn"),
  generateWeeklyReviewBtn: document.getElementById("generateWeeklyReviewBtn"),
  copyDailyReviewBtn: document.getElementById("copyDailyReviewBtn"),
  startVoiceNotesBtn: document.getElementById("startVoiceNotesBtn"),
  stopVoiceNotesBtn: document.getElementById("stopVoiceNotesBtn"),
  voiceNotesStatus: document.getElementById("voiceNotesStatus"),
  dailyNotes: document.getElementById("dailyNotes"),
  dailyReviewOutput: document.getElementById("dailyReviewOutput"),
  analytics: document.getElementById("analytics"),
  performanceForm: document.getElementById("performanceForm"),
  perfChannel: document.getElementById("perfChannel"),
  perfCharacter: document.getElementById("perfCharacter"),
  perfAccount: document.getElementById("perfAccount"),
  perfTopic: document.getElementById("perfTopic"),
  perfLikes: document.getElementById("perfLikes"),
  perfReplies: document.getElementById("perfReplies"),
  perfOutcome: document.getElementById("perfOutcome"),
  performanceTableWrap: document.getElementById("performanceTableWrap"),
  brandPackJson: document.getElementById("brandPackJson"),
  validateBrandPackBtn: document.getElementById("validateBrandPackBtn"),
  useProvidedBrandPackBtn: document.getElementById("useProvidedBrandPackBtn"),
  brandPackStatus: document.getElementById("brandPackStatus"),
  contextHubPathInput: document.getElementById("contextHubPathInput"),
  saveContextHubPathBtn: document.getElementById("saveContextHubPathBtn"),
  refreshContextHubBtn: document.getElementById("refreshContextHubBtn"),
  contextHubStatusLine: document.getElementById("contextHubStatusLine"),
  contextHubSummary: document.getElementById("contextHubSummary"),
  screenshotInput: document.getElementById("screenshotInput"),
  clearScreenshotsBtn: document.getElementById("clearScreenshotsBtn"),
  generateScreenshotPromptBtn: document.getElementById("generateScreenshotPromptBtn"),
  copyScreenshotPromptBtn: document.getElementById("copyScreenshotPromptBtn"),
  copyScreenshotBundleBtn: document.getElementById("copyScreenshotBundleBtn"),
  downloadScreenshotHandoffBtn: document.getElementById("downloadScreenshotHandoffBtn"),
  analyzeScreenshotsBtn: document.getElementById("analyzeScreenshotsBtn"),
  screenshotPasteZone: document.getElementById("screenshotPasteZone"),
  linkInput: document.getElementById("linkInput"),
  fetchLinkContextBtn: document.getElementById("fetchLinkContextBtn"),
  generateLinkPromptBtn: document.getElementById("generateLinkPromptBtn"),
  copyLinkPromptBtn: document.getElementById("copyLinkPromptBtn"),
  linkStatusLine: document.getElementById("linkStatusLine"),
  linkContextPreview: document.getElementById("linkContextPreview"),
  socialPostTextInput: document.getElementById("socialPostTextInput"),
  apiProviderSelect: document.getElementById("apiProviderSelect"),
  apiModelInput: document.getElementById("apiModelInput"),
  maxScreenshotsInput: document.getElementById("maxScreenshotsInput"),
  dailyApiCapInput: document.getElementById("dailyApiCapInput"),
  autoImportAnalyzeCheckbox: document.getElementById("autoImportAnalyzeCheckbox"),
  apiStatusLine: document.getElementById("apiStatusLine"),
  claudeHandoffStatusLine: document.getElementById("claudeHandoffStatusLine"),
  screenshotGallery: document.getElementById("screenshotGallery"),
  screenshotPromptOutput: document.getElementById("screenshotPromptOutput"),
  screenshotClaudeOutput: document.getElementById("screenshotClaudeOutput"),
  screenshotDecisionsPreview: document.getElementById("screenshotDecisionsPreview"),
  repairScreenshotJsonBtn: document.getElementById("repairScreenshotJsonBtn"),
  importScreenshotOutputBtn: document.getElementById("importScreenshotOutputBtn"),
  leadRadarRawInput: document.getElementById("leadRadarRawInput"),
  loadLeadRadarBtn: document.getElementById("loadLeadRadarBtn"),
  clearLeadRadarBtn: document.getElementById("clearLeadRadarBtn"),
  leadRadarStatusLine: document.getElementById("leadRadarStatusLine"),
  leadRadarList: document.getElementById("leadRadarList"),
  ttHandle: document.getElementById("ttHandle"),
  ttStatus: document.getElementById("ttStatus"),
  ttVideoUrl: document.getElementById("ttVideoUrl"),
  ttScreenshotRef: document.getElementById("ttScreenshotRef"),
  ttUseLatestScreenshotBtn: document.getElementById("ttUseLatestScreenshotBtn"),
  ttObjective: document.getElementById("ttObjective"),
  ttHookType: document.getElementById("ttHookType"),
  ttToneStyle: document.getElementById("ttToneStyle"),
  ttCtaStrength: document.getElementById("ttCtaStrength"),
  ttPersonaCluster: document.getElementById("ttPersonaCluster"),
  ttReplyLatencyDays: document.getElementById("ttReplyLatencyDays"),
  ttFirstDm: document.getElementById("ttFirstDm"),
  ttReply: document.getElementById("ttReply"),
  ttNotes: document.getElementById("ttNotes"),
  ttSaveEntryBtn: document.getElementById("ttSaveEntryBtn"),
  ttClearFormBtn: document.getElementById("ttClearFormBtn"),
  ttExportCsvBtn: document.getElementById("ttExportCsvBtn"),
  ttTrackerStatusLine: document.getElementById("ttTrackerStatusLine"),
  ttTrackerSummary: document.getElementById("ttTrackerSummary"),
  ttTrackerList: document.getElementById("ttTrackerList"),
  refreshActionsBtn: document.getElementById("refreshActionsBtn"),
  refreshRemindersBtn: document.getElementById("refreshRemindersBtn"),
  actionsStatusLine: document.getElementById("actionsStatusLine"),
  nextBestActionsList: document.getElementById("nextBestActionsList"),
  pendingRemindersList: document.getElementById("pendingRemindersList"),
  mleQaList: document.getElementById("mleQaList"),
  willCommentHandoffList: document.getElementById("willCommentHandoffList"),
};

const defaultDayTemplate = () => ({
  checkboxes: {},
  drafts: {
    contextNotes: "",
    outreachDrafts: "",
    willCommentDrafts: "",
    mleDrafts: "",
    conversionDrafts: "",
    mrBlueDrafts: "",
    guidedNapDrafts: "",
    captionDrafts: "",
    safetyNotes: "",
  },
  metrics: {
    dmsSent: 0,
    responses: 0,
    whatsAppAdds: 0,
    classesBooked: 0,
    mrBlueComments: 0,
    guidedNapComments: 0,
  },
  notes: "",
  commentModeOverride: "AUTO",
  performanceRecords: [],
  screenshotClaudeOutput: "",
  screenshotPromptOutput: "",
  linkInput: "",
  linkContextData: null,
  socialPostTextInput: "",
  dailyReviewOutput: "",
  apiProvider: "claude",
  apiModel: "",
  maxScreenshotsPerRequest: 8,
  dailyApiCap: 12,
  autoImportAnalyze: true,
  apiUsageByDate: {},
  mleSequencer: {
    targetPerDay: 4,
    sentCount: 0,
  },
  tiktokSequencer: {
    targetPerDay: 7,
    sentCount: 0,
  },
  replyIntel: {
    platform: "MyLanguageExchange",
    timeElapsedDays: 1,
    previousAttempts: 1,
    objective: "tester",
    originalMessage: "",
    theirReply: "",
    lastResult: null,
  },
  leadRadarRaw: "",
  leadRadarLeads: [],
  tiktokDmTracker: {
    items: [],
    draft: {
      handle: "",
      status: "sent",
      videoUrl: "",
      screenshotRef: "",
      objective: "tester",
      hookType: "",
      toneStyle: "",
      ctaStrength: "",
      personaCluster: "",
      replyLatencyDays: "",
      firstDm: "",
      reply: "",
      notes: "",
    },
    editingId: null,
  },
});

let runtimeScreenshots = [];
let backendState = {
  checked: false,
  online: false,
};
let voiceNotesRecognition = null;
let voiceNotesListening = false;

const PROVIDED_BRAND_PACK = {
  meta: {
    version: "1.0",
    created: "2026-02-23",
    owner: "Will — Unmute / Guiding Bros / AI Sprint",
    purpose: "Social Media Agent configuration — voice rules, personas, examples, guardrails, and targeting",
  },
  brand_voice: {
    description: "Will's outreach voice",
    identity: {
      name: "Will",
      credentials: "TESOL-certified, 12 years, 60+ nationalities, 8 countries",
      based_in: "Tbilisi, Georgia",
    },
    tone_rules: [
      "Warm but direct. Never salesy.",
      "Lead with empathy and a specific observation about THEM, not you.",
      "Short sentences. No paragraphs in DMs.",
      "Always give value BEFORE asking anything.",
      "Mirror the other person's energy and language level.",
    ],
    avoid: [
      "Corporate language",
      "Generic openers",
      "ADHD/neurodivergent mention in cold outreach",
      "Emoji spam",
      "Multiple questions in one message",
    ],
  },
  personas: {
    mr_blue: {
      voice_rules: [
        "Short. Punchy. Under 15 words per caption.",
        "Deadpan, dry, slightly defeated but lovable.",
        "Comments always end with 🔵🔵🔵",
        "No hard CTAs.",
      ],
      comment_examples: [
        "my vocabulary knows 10,000 words. my mouth knows 7 🔵🔵🔵",
        "the silent letters in English have better job security than me 🔵🔵🔵",
      ],
    },
    guided_nap: {
      brand_name: "Guiding Bros",
      sub_brand: "Guided Nap",
      voice_rules: [
        "Deadpan sincerity. Always.",
        "ZERO emoji.",
        "Under 15 words for captions/comments.",
        "Sound profound then collapse.",
      ],
      comment_examples: [
        "breathe in clarity. breathe out your credit score",
        "place your phone somewhere it can't judge you",
      ],
    },
  },
  guardrails: {
    hard_nos: [
      "NEVER send the same message to two people",
      "NEVER mention ADHD/neurodivergent in cold outreach",
      "NEVER follow-up more than once if no response",
      "NEVER use emoji in Guiding Bros content",
      "NEVER break the 🔵🔵🔵 rule for Mr Blue comments",
    ],
    platform_specific_rules: {
      MyLanguageExchange: "No mention of app in messages. App conversation happens on WhatsApp only.",
      TikTok: "No hard CTAs. No 'link in bio' in video.",
      LinkedIn: "Lead with teaching story, not product.",
      Reddit: "Give genuine help first. Mention app only if asked.",
    },
  },
  offer: {
    product: {
      name: "Unmute",
      tagline: "Practice speaking English without the panic.",
      hero_statement: "You know the grammar. You know the words. But when it's time to speak, you freeze.",
    },
    founders_pass: {
      price: "$97",
      limit: "First 100 users only",
    },
  },
};

let state = loadState();
let currentDateKey = state.selectedDate || getDateKey(new Date());
let timerInterval = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { selectedDate: null, days: {}, timer: freshTimer(), globalBrandPackJson: "", simpleMode: true, showContentTools: false };
    }
    const parsed = JSON.parse(raw);
    const days = parsed.days || {};
    let globalBrandPackJson = typeof parsed.globalBrandPackJson === "string" ? parsed.globalBrandPackJson : "";

    if (!globalBrandPackJson) {
      for (const day of Object.values(days)) {
        if (day && typeof day.brandPackJson === "string" && day.brandPackJson.trim()) {
          globalBrandPackJson = day.brandPackJson;
          break;
        }
      }
    }

    // Strip legacy per-day copies to keep brand pack truly global in frontend state.
    const normalizedDays = {};
    for (const [dateKey, day] of Object.entries(days)) {
      if (day && typeof day === "object") {
        const { brandPackJson: _legacyBrandPackJson, ...rest } = day;
        normalizedDays[dateKey] = rest;
      } else {
        normalizedDays[dateKey] = day;
      }
    }

    return {
      selectedDate: parsed.selectedDate || null,
      days: normalizedDays,
      timer: parsed.timer || freshTimer(),
      globalBrandPackJson,
      simpleMode: typeof parsed.simpleMode === "boolean" ? parsed.simpleMode : true,
      showContentTools: typeof parsed.showContentTools === "boolean" ? parsed.showContentTools : false,
      contextHubPath: typeof parsed.contextHubPath === "string" ? parsed.contextHubPath : "",
    };
  } catch {
    return { selectedDate: null, days: {}, timer: freshTimer(), globalBrandPackJson: "", simpleMode: true, showContentTools: false, contextHubPath: "" };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function freshTimer() {
  return {
    taskKey: "",
    label: "",
    durationSec: 0,
    remainingSec: 0,
    running: false,
    startedAt: null,
  };
}

function getDay(dateKey = currentDateKey) {
  if (!state.days[dateKey]) {
    state.days[dateKey] = defaultDayTemplate();
  }
  return state.days[dateKey];
}

function getDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDateKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatLongDate(dateKey) {
  return parseDateKey(dateKey).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function withinRange(dateKey, start, end) {
  return dateKey >= start && dateKey <= end;
}

function getRotationForDate(dateKey) {
  const dayIndex = parseDateKey(dateKey).getDay();
  return WEEKLY_ROTATION[dayIndex];
}

function getCommentModeForDate(dateKey) {
  const day = getDay(dateKey);
  if (day.commentModeOverride && day.commentModeOverride !== "AUTO") {
    const entry = SPRINT_CALENDAR.find((p) => p.mode === day.commentModeOverride);
    return entry ? { ...entry, overridden: true } : { mode: day.commentModeOverride, totalPerDay: 0, split: "", approxTime: "" };
  }
  const found = SPRINT_CALENDAR.find((period) => withinRange(dateKey, period.start, period.end));
  return found || { mode: "MAINTENANCE", totalPerDay: 10, split: "5 + 5", approxTime: "~15 min/day" };
}

function getDistributionWeek(dateKey) {
  return DISTRIBUTION_WEEKS.find((w) => withinRange(dateKey, w.start, w.end)) || null;
}

function getTimerTaskOptions() {
  return DAILY_BLOCKS.flatMap((block) =>
    block.tasks.map((task) => ({
      key: `${block.id}:${task.id}`,
      label: `${task.label} (${task.durationMin}m)`,
      durationMin: task.durationMin,
    }))
  );
}

function getAllTaskLookup() {
  const map = new Map();
  DAILY_BLOCKS.forEach((block) => {
    block.tasks.forEach((task) => {
      map.set(`${block.id}:${task.id}`, { block, task });
    });
  });
  return map;
}

const TASK_LOOKUP = getAllTaskLookup();

function ensureTodayBindings() {
  const day = getDay();
  day.apiUsageByDate ||= {};
  day.mleSequencer ||= { targetPerDay: 4, sentCount: 0 };
  day.tiktokSequencer ||= { targetPerDay: 7, sentCount: 0 };
  day.tiktokDmTracker ||= { items: [], draft: {}, editingId: null };
  day.tiktokDmTracker.items ||= [];
  day.tiktokDmTracker.draft ||= {};
  day.tiktokDmTracker.editingId ||= null;
  day.replyIntel ||= {
    platform: "MyLanguageExchange",
    timeElapsedDays: 1,
    previousAttempts: 1,
    objective: "tester",
    originalMessage: "",
    theirReply: "",
    lastResult: null,
  };
  state.selectedDate = currentDateKey;
  DOM.datePicker.value = currentDateKey;
  DOM.commentMode.value = day.commentModeOverride || "AUTO";
  if (DOM.simpleModeToggle) DOM.simpleModeToggle.checked = state.simpleMode !== false;
  if (DOM.contentToolsToggle) DOM.contentToolsToggle.checked = state.showContentTools === true;
  if (DOM.contextHubPathInput) DOM.contextHubPathInput.value = state.contextHubPath || "";

  DOM.contextNotes.value = day.drafts.contextNotes;
  DOM.outreachDrafts.value = day.drafts.outreachDrafts;
  DOM.willCommentDrafts.value = day.drafts.willCommentDrafts || "";
  DOM.mleDrafts.value = day.drafts.mleDrafts;
  DOM.conversionDrafts.value = day.drafts.conversionDrafts;
  DOM.mrBlueDrafts.value = day.drafts.mrBlueDrafts;
  DOM.guidedNapDrafts.value = day.drafts.guidedNapDrafts;
  DOM.captionDrafts.value = day.drafts.captionDrafts;
  DOM.safetyNotes.value = day.drafts.safetyNotes;
  DOM.brandPackJson.value = state.globalBrandPackJson || "";
  DOM.screenshotClaudeOutput.value = day.screenshotClaudeOutput || "";
  DOM.screenshotPromptOutput.value = day.screenshotPromptOutput || "";
  DOM.linkInput.value = day.linkInput || "";
  DOM.socialPostTextInput.value = day.socialPostTextInput || "";
  DOM.apiProviderSelect.value = day.apiProvider || "claude";
  DOM.apiModelInput.value = day.apiModel || "";
  DOM.maxScreenshotsInput.value = day.maxScreenshotsPerRequest ?? 8;
  DOM.dailyApiCapInput.value = day.dailyApiCap ?? 12;
  DOM.autoImportAnalyzeCheckbox.checked = day.autoImportAnalyze !== false;
  DOM.replyIntelPlatform.value = day.replyIntel.platform || "MyLanguageExchange";
  DOM.replyIntelTimeElapsed.value = String(day.replyIntel.timeElapsedDays ?? 1);
  DOM.replyIntelPrevAttempts.value = day.replyIntel.previousAttempts ?? 1;
  if (DOM.replyIntelObjective) DOM.replyIntelObjective.value = day.replyIntel.objective || "tester";
  DOM.replyIntelOriginalMessage.value = day.replyIntel.originalMessage || "";
  DOM.replyIntelTheirReply.value = day.replyIntel.theirReply || "";
  if (DOM.leadRadarRawInput) DOM.leadRadarRawInput.value = day.leadRadarRaw || "";
  if (DOM.ttHandle) DOM.ttHandle.value = day.tiktokDmTracker.draft.handle || "";
  if (DOM.ttStatus) DOM.ttStatus.value = day.tiktokDmTracker.draft.status || "sent";
  if (DOM.ttVideoUrl) DOM.ttVideoUrl.value = day.tiktokDmTracker.draft.videoUrl || "";
  if (DOM.ttScreenshotRef) DOM.ttScreenshotRef.value = day.tiktokDmTracker.draft.screenshotRef || "";
  if (DOM.ttObjective) DOM.ttObjective.value = day.tiktokDmTracker.draft.objective || "tester";
  if (DOM.ttHookType) DOM.ttHookType.value = day.tiktokDmTracker.draft.hookType || "";
  if (DOM.ttToneStyle) DOM.ttToneStyle.value = day.tiktokDmTracker.draft.toneStyle || "";
  if (DOM.ttCtaStrength) DOM.ttCtaStrength.value = day.tiktokDmTracker.draft.ctaStrength || "";
  if (DOM.ttPersonaCluster) DOM.ttPersonaCluster.value = day.tiktokDmTracker.draft.personaCluster || "";
  if (DOM.ttReplyLatencyDays) DOM.ttReplyLatencyDays.value = day.tiktokDmTracker.draft.replyLatencyDays ?? "";
  if (DOM.ttFirstDm) DOM.ttFirstDm.value = day.tiktokDmTracker.draft.firstDm || "";
  if (DOM.ttReply) DOM.ttReply.value = day.tiktokDmTracker.draft.reply || "";
  if (DOM.ttNotes) DOM.ttNotes.value = day.tiktokDmTracker.draft.notes || "";

  DOM.metricDmsSent.value = day.metrics.dmsSent;
  DOM.metricResponses.value = day.metrics.responses;
  DOM.metricWhatsAppAdds.value = day.metrics.whatsAppAdds;
  DOM.metricClassesBooked.value = day.metrics.classesBooked;
  DOM.metricMrBlueComments.value = day.metrics.mrBlueComments;
  DOM.metricGuidedNapComments.value = day.metrics.guidedNapComments;
  DOM.dailyNotes.value = day.notes;
  DOM.dailyReviewOutput.value = day.dailyReviewOutput || "";
}

function renderToday() {
  const rotation = getRotationForDate(currentDateKey);
  const mode = getCommentModeForDate(currentDateKey);
  const week = getDistributionWeek(currentDateKey);
  const dateLabel = formatLongDate(currentDateKey);
  const showContentTools = state.showContentTools === true;

  DOM.todaySummary.textContent = `${dateLabel} · ${withinRange(currentDateKey, PLAYBOOK_RANGE.start, PLAYBOOK_RANGE.end) ? "Playbook Active Window" : "Outside Playbook Window"}`;

  const cards = [
    {
      title: "Outreach Target",
      body: rotation ? rotation.outreach : "No rotation found",
    },
    {
      title: "Distribution Focus",
      body: rotation ? rotation.distribution : "Weekly review + plan",
    },
    {
      title: "Week Plan",
      body: week ? `${week.name}\n${week.tasks[0] || ""}` : "No week plan matched.",
    },
  ];

  if (showContentTools) {
    cards.splice(2, 0, {
      title: "Content Comment Mode",
      body: `${mode.mode} · ${mode.totalPerDay} comments/day · ${mode.split} · ${mode.approxTime}`,
      tag: mode.mode,
    });
  }

  DOM.todayCards.innerHTML = cards
    .map(
      (card) => `
      <article class="today-card">
        <h3>${escapeHtml(card.title)}</h3>
        ${card.tag ? `<div class="pill ${card.tag.toLowerCase() === "sprint" ? "sprint" : "maintenance"}">${escapeHtml(card.tag)}</div>` : ""}
        <p>${escapeHtml(card.body).replace(/\n/g, "<br>")}</p>
      </article>`
    )
    .join("");
}

function renderTimeline() {
  const day = getDay();
  const rotation = getRotationForDate(currentDateKey);
  const week = getDistributionWeek(currentDateKey);

  DOM.timeline.innerHTML = DAILY_BLOCKS.map((block) => {
    const tasks = block.tasks
      .map((task) => {
        const key = `${block.id}:${task.id}`;
        const checked = Boolean(day.checkboxes[key]);
        let detail = task.detail;
        if (task.id === "research" && rotation) detail += ` Today: ${rotation.outreach}.`;
        if (task.id === "distribution_task" && rotation) detail += ` Today: ${rotation.distribution}.`;
        if (task.id === "distribution_task" && week) detail += ` ${week.name}.`;
        return `
        <div class="task-row ${checked ? "done" : ""}" data-task-key="${key}">
          <input type="checkbox" ${checked ? "checked" : ""} aria-label="Mark ${escapeHtml(task.label)} done">
          <div class="task-text">
            <strong>${escapeHtml(task.label)}</strong>
            <span>${escapeHtml(detail)}</span>
          </div>
          <div class="task-time">${task.durationMin}m</div>
          <button class="mini-btn ghost load-task-timer" type="button" data-task-key="${key}">Timer</button>
        </div>`;
      })
      .join("");

    return `
      <section class="block" data-block-id="${block.id}">
        <div class="block-head">
          <div class="block-index">${block.index}</div>
          <div>
            <h3>${escapeHtml(block.name)}</h3>
            <p>${escapeHtml(block.window)} · ${escapeHtml(block.mode)}</p>
          </div>
          <div class="pill">${escapeHtml(block.window)}</div>
        </div>
        <div class="task-list">${tasks}</div>
      </section>`;
  }).join("");

  DOM.timeline.querySelectorAll('.task-row input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const row = event.target.closest(".task-row");
      const taskKey = row.dataset.taskKey;
      const dayState = getDay();
      dayState.checkboxes[taskKey] = event.target.checked;
      row.classList.toggle("done", event.target.checked);
      saveState();
      renderAnalytics();
    });
  });

  DOM.timeline.querySelectorAll(".load-task-timer").forEach((button) => {
    button.addEventListener("click", () => {
      loadTimer(button.dataset.taskKey);
    });
  });
}

function initTimerTaskSelect() {
  const options = getTimerTaskOptions();
  DOM.timerTaskSelect.innerHTML = options
    .map((o) => `<option value="${o.key}">${escapeHtml(o.label)}</option>`)
    .join("");
}

function loadTimer(taskKeyFromButton) {
  const taskKey = taskKeyFromButton || DOM.timerTaskSelect.value;
  const lookup = TASK_LOOKUP.get(taskKey);
  if (!lookup) return;
  const { task } = lookup;
  state.timer = {
    taskKey,
    label: task.label,
    durationSec: task.durationMin * 60,
    remainingSec: task.durationMin * 60,
    running: false,
    startedAt: null,
  };
  DOM.timerTaskSelect.value = taskKey;
  saveState();
  renderTimer();
}

function renderTimer() {
  const t = state.timer;
  DOM.timerDisplay.textContent = formatDuration(t.remainingSec);
  DOM.timerLabel.textContent = t.label ? `${t.label} (${Math.round(t.durationSec / 60)}m)` : "No task loaded";
  DOM.startPauseTimerBtn.textContent = t.running ? "Pause" : "Start";
}

function tickTimer() {
  if (!state.timer.running) return;
  const now = Date.now();
  const elapsedSec = Math.floor((now - state.timer.startedAt) / 1000);
  const remaining = Math.max(0, state.timer.durationSec - elapsedSec);
  state.timer.remainingSec = remaining;
  renderTimer();
  if (remaining === 0) {
    state.timer.running = false;
    state.timer.startedAt = null;
    saveState();
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Timer complete", { body: state.timer.label || "Task finished" });
    }
  }
}

function startPauseTimer() {
  const t = state.timer;
  if (!t.taskKey) return;
  if (!t.running) {
    t.running = true;
    t.startedAt = Date.now() - ((t.durationSec - t.remainingSec) * 1000);
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
    timerInterval ||= setInterval(tickTimer, 500);
  } else {
    t.running = false;
    t.startedAt = null;
  }
  saveState();
  renderTimer();
}

function resetTimer() {
  const t = state.timer;
  t.running = false;
  t.startedAt = null;
  t.remainingSec = t.durationSec || 0;
  saveState();
  renderTimer();
}

function restoreTimerIfNeeded() {
  const t = state.timer;
  if (!t.running) return;
  if (!t.startedAt) {
    t.running = false;
    return;
  }
  timerInterval ||= setInterval(tickTimer, 500);
  tickTimer();
}

function formatDuration(totalSec) {
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function bindDraftInputs() {
  const map = [
    ["contextNotes", DOM.contextNotes],
    ["outreachDrafts", DOM.outreachDrafts],
    ["willCommentDrafts", DOM.willCommentDrafts],
    ["mleDrafts", DOM.mleDrafts],
    ["conversionDrafts", DOM.conversionDrafts],
    ["mrBlueDrafts", DOM.mrBlueDrafts],
    ["guidedNapDrafts", DOM.guidedNapDrafts],
    ["captionDrafts", DOM.captionDrafts],
    ["safetyNotes", DOM.safetyNotes],
  ];

  map.forEach(([key, node]) => {
    node.addEventListener("input", () => {
      getDay().drafts[key] = node.value;
      saveState();
      if (key === "mleDrafts" || key === "outreachDrafts" || key === "willCommentDrafts") renderMleDmQa();
    });
  });
}

function bindBrandPackAndScreenshots() {
  DOM.brandPackJson.addEventListener("input", () => {
    state.globalBrandPackJson = DOM.brandPackJson.value;
    saveState();
    renderBrandPackStatus();
  });

  DOM.validateBrandPackBtn.addEventListener("click", () => {
    renderBrandPackStatus(true);
    void syncBrandPackToBackend();
  });

  DOM.useProvidedBrandPackBtn.addEventListener("click", () => {
    state.globalBrandPackJson = JSON.stringify(PROVIDED_BRAND_PACK, null, 2);
    DOM.brandPackJson.value = state.globalBrandPackJson;
    saveState();
    renderBrandPackStatus(true);
    void syncBrandPackToBackend();
  });

  DOM.screenshotInput.addEventListener("change", async (event) => {
    const files = [...(event.target.files || [])];
    await addScreenshotsFromFiles(files, "file picker");
    DOM.screenshotInput.value = "";
  });

  DOM.clearScreenshotsBtn.addEventListener("click", () => {
    runtimeScreenshots = [];
    renderScreenshotGallery();
    setClaudeHandoffStatus("Screenshots cleared.", "ok");
  });

  DOM.generateScreenshotPromptBtn.addEventListener("click", () => {
    const prompt = buildScreenshotPrompt();
    DOM.screenshotPromptOutput.value = prompt;
    getDay().screenshotPromptOutput = prompt;
    saveState();
    setClaudeHandoffStatus("Prompt generated. Copy it into Claude Desktop and attach the same screenshots.", "ok");
  });

  DOM.copyScreenshotPromptBtn.addEventListener("click", async () => {
    const prompt = DOM.screenshotPromptOutput.value.trim() || buildScreenshotPrompt();
    if (!DOM.screenshotPromptOutput.value.trim()) {
      DOM.screenshotPromptOutput.value = prompt;
      getDay().screenshotPromptOutput = prompt;
      saveState();
    }
    const copied = await copyText(prompt);
    setClaudeHandoffStatus(
      copied
        ? "Prompt copied. Paste into Claude Desktop, then attach screenshots."
        : "Clipboard blocked. Copy the prompt manually from the box below.",
      copied ? "ok" : "warn"
    );
  });

  DOM.copyScreenshotBundleBtn.addEventListener("click", async () => {
    const prompt = DOM.screenshotPromptOutput.value.trim() || buildScreenshotPrompt();
    if (!DOM.screenshotPromptOutput.value.trim()) {
      DOM.screenshotPromptOutput.value = prompt;
      getDay().screenshotPromptOutput = prompt;
      saveState();
    }
    const bundle = buildClaudeDesktopPasteBundle(prompt);
    const copied = await copyText(bundle);
    setClaudeHandoffStatus(
      copied
        ? "Prompt + steps copied. Paste into Claude Desktop, then attach screenshots and send."
        : "Clipboard blocked. Copy the prompt manually and attach screenshots in Claude Desktop.",
      copied ? "ok" : "warn"
    );
  });

  DOM.downloadScreenshotHandoffBtn.addEventListener("click", () => {
    const prompt = DOM.screenshotPromptOutput.value.trim() || buildScreenshotPrompt();
    if (!DOM.screenshotPromptOutput.value.trim()) {
      DOM.screenshotPromptOutput.value = prompt;
      getDay().screenshotPromptOutput = prompt;
      saveState();
    }
    const handoff = buildClaudeDesktopHandoff(prompt);
    downloadTextFile(`claude-handoff-${currentDateKey}.json`, JSON.stringify(handoff, null, 2), "application/json");
    setClaudeHandoffStatus("Claude handoff JSON downloaded. Attach screenshots in Claude Desktop and use the prompt from the app.", "ok");
  });

  DOM.analyzeScreenshotsBtn.addEventListener("click", analyzeScreenshotsViaApi);

  DOM.linkInput.addEventListener("input", () => {
    getDay().linkInput = DOM.linkInput.value;
    saveState();
  });

  DOM.socialPostTextInput.addEventListener("input", () => {
    getDay().socialPostTextInput = DOM.socialPostTextInput.value;
    saveState();
  });

  DOM.fetchLinkContextBtn.addEventListener("click", () => {
    void fetchLinkContext();
  });

  DOM.generateLinkPromptBtn.addEventListener("click", () => {
    const prompt = buildLinkPrompt();
    DOM.screenshotPromptOutput.value = prompt;
    getDay().screenshotPromptOutput = prompt;
    saveState();
    setLinkStatus("Link prompt generated. Paste into Claude Desktop and include the link (and screenshot if needed).", "ok");
  });

  DOM.copyLinkPromptBtn.addEventListener("click", async () => {
    const prompt = DOM.screenshotPromptOutput.value.trim() || buildLinkPrompt();
    if (!DOM.screenshotPromptOutput.value.trim()) {
      DOM.screenshotPromptOutput.value = prompt;
      getDay().screenshotPromptOutput = prompt;
      saveState();
    }
    const copied = await copyText(prompt);
    setLinkStatus(
      copied
        ? "Link prompt copied. Paste into Claude Desktop. If the page is blocked/weak, attach a screenshot too."
        : "Clipboard blocked. Copy the link prompt manually.",
      copied ? "ok" : "warn"
    );
  });

  DOM.screenshotClaudeOutput.addEventListener("input", () => {
    getDay().screenshotClaudeOutput = DOM.screenshotClaudeOutput.value;
    saveState();
    renderScreenshotDecisionsPreviewFromRaw(DOM.screenshotClaudeOutput.value);
    renderWillCommentHandoffsFromRaw(DOM.screenshotClaudeOutput.value);
  });

  DOM.importScreenshotOutputBtn.addEventListener("click", () => {
    void importScreenshotOutput();
  });

  DOM.repairScreenshotJsonBtn?.addEventListener("click", () => {
    repairScreenshotJson();
  });

  DOM.apiProviderSelect.addEventListener("change", () => {
    getDay().apiProvider = DOM.apiProviderSelect.value;
    saveState();
  });

  DOM.apiModelInput.addEventListener("input", () => {
    getDay().apiModel = DOM.apiModelInput.value;
    saveState();
  });

  DOM.maxScreenshotsInput.addEventListener("input", () => {
    getDay().maxScreenshotsPerRequest = clampNum(Number(DOM.maxScreenshotsInput.value || 8), 1, 20);
    saveState();
  });

  DOM.dailyApiCapInput.addEventListener("input", () => {
    getDay().dailyApiCap = clampNum(Number(DOM.dailyApiCapInput.value || 12), 1, 100);
    saveState();
  });

  DOM.autoImportAnalyzeCheckbox.addEventListener("change", () => {
    getDay().autoImportAnalyze = DOM.autoImportAnalyzeCheckbox.checked;
    saveState();
  });

  DOM.screenshotPasteZone.addEventListener("click", () => {
    DOM.screenshotPasteZone.focus();
    setClaudeHandoffStatus("Paste screenshot now (Cmd+V) or drop image files here.", "ok");
  });

  DOM.screenshotPasteZone.addEventListener("paste", async (event) => {
    const handled = await tryHandleClipboardImages(event, "paste zone");
    if (handled) event.preventDefault();
  });

  DOM.screenshotPasteZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    DOM.screenshotPasteZone.classList.add("dragover");
  });

  DOM.screenshotPasteZone.addEventListener("dragleave", () => {
    DOM.screenshotPasteZone.classList.remove("dragover");
  });

  DOM.screenshotPasteZone.addEventListener("drop", async (event) => {
    event.preventDefault();
    DOM.screenshotPasteZone.classList.remove("dragover");
    const files = [...(event.dataTransfer?.files || [])];
    await addScreenshotsFromFiles(files, "drag and drop");
  });

  document.addEventListener("paste", async (event) => {
    if (event.defaultPrevented) return;
    const active = document.activeElement;
    const isTextField =
      active instanceof HTMLTextAreaElement ||
      (active instanceof HTMLInputElement && active.type !== "file") ||
      active?.isContentEditable;
    if (isTextField) return;
    const handled = await tryHandleClipboardImages(event, "global paste");
    if (handled) event.preventDefault();
  });

  DOM.refreshActionsBtn.addEventListener("click", () => {
    void refreshNextBestActionsAndReminders();
  });
  DOM.refreshRemindersBtn.addEventListener("click", () => {
    void refreshPendingReminders();
  });

  DOM.saveContextHubPathBtn?.addEventListener("click", () => {
    void saveContextHubPath();
  });
  DOM.refreshContextHubBtn?.addEventListener("click", () => {
    void refreshContextHubSummary();
  });

  DOM.leadRadarRawInput?.addEventListener("input", () => {
    getDay().leadRadarRaw = DOM.leadRadarRawInput.value;
    saveState();
  });
  DOM.loadLeadRadarBtn?.addEventListener("click", () => {
    loadLeadRadarFromText();
  });
  DOM.clearLeadRadarBtn?.addEventListener("click", () => {
    clearLeadRadar();
  });
  DOM.leadRadarList?.addEventListener("click", (event) => {
    const copyBtn = event.target.closest?.("[data-radar-copy]");
    if (copyBtn) {
      void (async () => {
        const copied = await copyText(copyBtn.dataset.radarCopy || "");
        setActionsStatus(copied ? "Radar excerpt copied." : "Could not copy radar excerpt.", copied ? "ok" : "warn");
      })();
      return;
    }
    const addBtn = event.target.closest?.("[data-radar-add-note]");
    if (addBtn) {
      addRadarLeadToContextNotes(addBtn.dataset.radarAddNote || "");
    }
  });

  [
    DOM.ttHandle,
    DOM.ttStatus,
    DOM.ttVideoUrl,
    DOM.ttScreenshotRef,
    DOM.ttObjective,
    DOM.ttHookType,
    DOM.ttToneStyle,
    DOM.ttCtaStrength,
    DOM.ttPersonaCluster,
    DOM.ttReplyLatencyDays,
    DOM.ttFirstDm,
    DOM.ttReply,
    DOM.ttNotes,
  ]
    .filter(Boolean)
    .forEach((node) => {
      const eventName = node.tagName === "SELECT" ? "change" : "input";
      node.addEventListener(eventName, () => {
        persistTikTokTrackerDraftFromInputs();
        renderTikTokTracker();
      });
    });

  DOM.ttUseLatestScreenshotBtn?.addEventListener("click", () => {
    useLatestScreenshotRefForTikTokTracker();
  });

  DOM.ttSaveEntryBtn?.addEventListener("click", () => {
    saveTikTokTrackerEntry();
  });

  DOM.ttClearFormBtn?.addEventListener("click", () => {
    clearTikTokTrackerDraft();
  });

  DOM.ttExportCsvBtn?.addEventListener("click", () => {
    exportTikTokTrackerCsv();
  });

  DOM.ttTrackerList?.addEventListener("click", (event) => {
    const actionBtn = event.target.closest?.("[data-tt-action]");
    if (!actionBtn) return;
    const action = actionBtn.dataset.ttAction;
    const id = actionBtn.dataset.ttId || "";
    if (action === "copy-dm") {
      void (async () => {
        const copied = await copyText(actionBtn.dataset.ttText || "");
        setTikTokTrackerStatus(copied ? "TikTok DM copied." : "Could not copy DM.", copied ? "ok" : "warn");
      })();
      return;
    }
    if (action === "edit") {
      startEditTikTokTrackerItem(id);
      return;
    }
    if (action === "mark") {
      updateTikTokTrackerStatus(id, actionBtn.dataset.status || "sent");
      return;
    }
    if (action === "delete") {
      if (!window.confirm("Delete this TikTok tracker record?")) return;
      deleteTikTokTrackerItem(id);
    }
  });
}

function bindMetricInputs() {
  const numericBindings = [
    ["dmsSent", DOM.metricDmsSent],
    ["responses", DOM.metricResponses],
    ["whatsAppAdds", DOM.metricWhatsAppAdds],
    ["classesBooked", DOM.metricClassesBooked],
    ["mrBlueComments", DOM.metricMrBlueComments],
    ["guidedNapComments", DOM.metricGuidedNapComments],
  ];

  numericBindings.forEach(([key, node]) => {
    node.addEventListener("input", () => {
      getDay().metrics[key] = Number(node.value || 0);
      saveState();
      renderAnalytics();
    });
  });

  DOM.dailyNotes.addEventListener("input", () => {
    getDay().notes = DOM.dailyNotes.value;
    saveState();
  });

  DOM.startVoiceNotesBtn?.addEventListener("click", () => {
    startVoiceNotes();
  });
  DOM.stopVoiceNotesBtn?.addEventListener("click", () => {
    stopVoiceNotes();
  });

  DOM.generateDailyReviewBtn?.addEventListener("click", () => {
    const report = buildDailyReviewReport();
    DOM.dailyReviewOutput.value = report;
    getDay().dailyReviewOutput = report;
    saveState();
  });

  DOM.generateWeeklyReviewBtn?.addEventListener("click", () => {
    const report = buildWeeklyReviewReport();
    DOM.dailyReviewOutput.value = report;
    getDay().dailyReviewOutput = report;
    saveState();
  });

  DOM.copyDailyReviewBtn?.addEventListener("click", async () => {
    const report = DOM.dailyReviewOutput?.value?.trim() || buildDailyReviewReport();
    if (!DOM.dailyReviewOutput.value.trim()) {
      DOM.dailyReviewOutput.value = report;
      getDay().dailyReviewOutput = report;
      saveState();
    }
    const copied = await copyText(report);
    setActionsStatus(copied ? "Daily review copied." : "Could not copy review automatically.", copied ? "ok" : "warn");
  });

  DOM.quickLogRow?.addEventListener("click", (event) => {
    const btn = event.target.closest?.("[data-metric-key][data-delta]");
    if (!btn) return;
    const key = btn.dataset.metricKey;
    const delta = Number(btn.dataset.delta || 0);
    if (!key || !Number.isFinite(delta)) return;
    adjustMetricValue(key, delta);
  });
}

function bindReplyIntel() {
  const saveInputs = () => {
    const day = getDay();
    day.replyIntel ||= {};
    day.replyIntel.platform = DOM.replyIntelPlatform?.value || "MyLanguageExchange";
    day.replyIntel.timeElapsedDays = Number(DOM.replyIntelTimeElapsed?.value || 1);
    day.replyIntel.previousAttempts = clampNum(Number(DOM.replyIntelPrevAttempts?.value || 1), 0, 9);
    day.replyIntel.objective = DOM.replyIntelObjective?.value || "tester";
    day.replyIntel.originalMessage = DOM.replyIntelOriginalMessage?.value || "";
    day.replyIntel.theirReply = DOM.replyIntelTheirReply?.value || "";
    saveState();
  };

  [DOM.replyIntelPlatform, DOM.replyIntelTimeElapsed, DOM.replyIntelPrevAttempts, DOM.replyIntelObjective, DOM.replyIntelOriginalMessage, DOM.replyIntelTheirReply]
    .filter(Boolean)
    .forEach((node) => {
      const eventName = node.tagName === "SELECT" ? "change" : "input";
      node.addEventListener(eventName, saveInputs);
    });

  DOM.analyzeReplyIntelBtn?.addEventListener("click", () => {
    void analyzeReplyIntel();
  });

  DOM.replyIntelOutput?.addEventListener("click", (event) => {
    const copyBtn = event.target.closest?.("[data-reply-intel-copy]");
    if (copyBtn) {
      void (async () => {
        const copied = await copyText(copyBtn.dataset.replyIntelCopy || "");
        setReplyIntelStatus(copied ? "Draft copied." : "Could not copy draft automatically.", copied ? "ok" : "warn");
      })();
      return;
    }

    const insertBtn = event.target.closest?.("[data-reply-intel-insert]");
    if (insertBtn) {
      insertReplyIntelDraft(insertBtn.dataset.replyIntelInsert || "", insertBtn.dataset.replyIntelText || "");
    }
  });
}

function setReplyIntelStatus(message, kind = "info") {
  if (!DOM.replyIntelStatus) return;
  DOM.replyIntelStatus.textContent = message;
  DOM.replyIntelStatus.className = "muted-line";
  if (kind === "ok") DOM.replyIntelStatus.classList.add("status-ok");
  if (kind === "warn") DOM.replyIntelStatus.classList.add("status-warn");
  if (kind === "err") DOM.replyIntelStatus.classList.add("status-err");
}

function insertReplyIntelDraft(targetBox, rawText) {
  const text = normalizeNoEmDash(String(rawText || "")).trim();
  if (!text) {
    setReplyIntelStatus("No draft text to insert.", "warn");
    return;
  }

  const mapping = {
    mle: { node: DOM.mleDrafts, key: "mleDrafts", label: "MyLanguageExchange Messages" },
    outreach: { node: DOM.outreachDrafts, key: "outreachDrafts", label: "Outreach DMs" },
    followups: { node: DOM.conversionDrafts, key: "conversionDrafts", label: "Conversion / Follow-up Drafts" },
  };
  const target = mapping[targetBox];
  if (!target?.node) {
    setReplyIntelStatus("Insert target not available.", "err");
    return;
  }

  const day = getDay();
  const platform = String(day.replyIntel?.platform || "Reply Intel");
  const modeLabel = targetBox === "followups" ? "Follow-up" : "Reply Intel";
  const block = [
    `### ${modeLabel} (${platform})`,
    text,
    "",
  ].join("\n");

  const existing = target.node.value.trim();
  target.node.value = [existing, block].filter(Boolean).join("\n\n");
  day.drafts[target.key] = target.node.value;
  saveState();

  if (target.key === "mleDrafts") renderMleDmQa();
  setReplyIntelStatus(`Inserted draft into ${target.label}.`, "ok");

  try {
    target.node.focus();
    target.node.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch {}
}

async function analyzeReplyIntel() {
  const day = getDay();
  const payload = {
    platform: DOM.replyIntelPlatform.value,
    time_elapsed_days: Number(DOM.replyIntelTimeElapsed.value || 1),
    original_message: DOM.replyIntelOriginalMessage.value.trim(),
    their_reply: DOM.replyIntelTheirReply.value.trim(),
    previous_attempts: Number(DOM.replyIntelPrevAttempts.value || 1),
    objective: DOM.replyIntelObjective?.value || "tester",
  };

  day.replyIntel = {
    ...(day.replyIntel || {}),
    platform: payload.platform,
    timeElapsedDays: payload.time_elapsed_days,
    previousAttempts: payload.previous_attempts,
    objective: payload.objective,
    originalMessage: payload.original_message,
    theirReply: payload.their_reply,
    lastResult: day.replyIntel?.lastResult || null,
  };
  saveState();

  if (!payload.original_message) {
    setReplyIntelStatus("Paste your original message first.", "warn");
    return;
  }

  setReplyIntelStatus("Analyzing reply, local heuristic mode...", "info");
  try {
    const data = await apiJson("/api/reply-intel/analyze", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const result = data?.result || null;
    day.replyIntel.lastResult = result;
    saveState();
    renderReplyIntelResult(result);
    const statusWord = String(result?.send_status || "").toUpperCase() || "DONE";
    setReplyIntelStatus(`Reply analysis ready (${statusWord}). Human review before sending.`, "ok");
  } catch (error) {
    setReplyIntelStatus(`Reply analysis failed: ${error.message}`, "warn");
    renderReplyIntelResult(null);
  }
}

function renderReplyIntelResult(result = getDay().replyIntel?.lastResult || null) {
  if (!DOM.replyIntelOutput) return;
  if (!result) {
    DOM.replyIntelOutput.innerHTML = `<p class="muted-line">No reply analysis yet. Fill the fields and click <strong>Analyze Reply</strong>.</p>`;
    return;
  }

  const sendStatus = String(result.send_status || "yellow").toLowerCase();
  const analysis = result.analysis || {};
  const tone = analysis.tone || analysis.emotional_tone_classification || "Unknown";
  const intent = analysis.intent_level || "Unknown";
  const score = Number.isFinite(Number(analysis.readiness_score)) ? Number(analysis.readiness_score) : null;
  const engagementDepth = Number.isFinite(Number(analysis.engagement_depth_score)) ? Number(analysis.engagement_depth_score) : null;
  const conversionLikelihood = Number.isFinite(Number(analysis.conversion_likelihood_score)) ? Number(analysis.conversion_likelihood_score) : null;
  const objectionType = analysis.objection_type || "none";
  const responseEnergy = analysis.response_energy_level || "unknown";
  const bestNextAction = result.best_next_action || analysis.best_next_action || "engage";
  const warning = analysis.warning ? String(analysis.warning) : "";
  const styleChecksObj = analysis.style_checks && typeof analysis.style_checks === "object" ? analysis.style_checks : {};
  const styleChecksLines = Object.entries(styleChecksObj).map(([k, v]) => `${k}: ${v ? "ok" : "fix"}`);
  const reasonCodes = Array.isArray(analysis.reason_codes) ? analysis.reason_codes : [];
  const draft1 = normalizeNoEmDash(String(result.draft_1 || ""));
  const draft2 = normalizeNoEmDash(String(result.draft_2 || ""));
  const platform = String(getDay().replyIntel?.platform || DOM.replyIntelPlatform?.value || "MyLanguageExchange");
  const suggestedTarget = /mylanguageexchange/i.test(platform) ? "mle" : "outreach";
  const suggestedLabel = suggestedTarget === "mle" ? "Use in MLE" : "Use in Outreach";

  const lightLabel =
    sendStatus === "green" ? "Green, send now" :
    sendStatus === "yellow" ? "Yellow, use low pressure" :
    "Red, do not send";

  DOM.replyIntelOutput.innerHTML = `
    <div class="reply-intel-card">
      <div class="action-top">
        <div class="action-badges">
          <span class="mini-pill reply-${escapeHtml(sendStatus)}">${escapeHtml(lightLabel)}</span>
          <span class="mini-pill">${escapeHtml(tone)}</span>
          <span class="mini-pill">${escapeHtml(intent)}</span>
          <span class="mini-pill">Readiness ${escapeHtml(score == null ? "-" : String(score))}/100</span>
        </div>
      </div>
      <div class="action-text"><strong>Objective:</strong> ${escapeHtml(result.recommended_objective || "No objective returned.")}</div>
      <div class="action-text"><strong>Best next action:</strong> ${escapeHtml(bestNextAction)}</div>
      ${warning ? `<div class="action-text"><strong>Warning:</strong> ${escapeHtml(warning)}</div>` : ""}

      <div class="reply-draft-option">
        <div class="reply-draft-head">
          <strong>Option A, Primary Draft</strong>
          <div class="action-buttons">
            <button type="button" class="ghost" data-reply-intel-copy="${escapeHtmlAttr(draft1)}" ${draft1 ? "" : "disabled"}>Copy</button>
            <button type="button" class="ghost" data-reply-intel-insert="${escapeHtmlAttr(suggestedTarget)}" data-reply-intel-text="${escapeHtmlAttr(draft1)}" ${draft1 ? "" : "disabled"}>${escapeHtml(suggestedLabel)}</button>
            <button type="button" class="ghost" data-reply-intel-insert="followups" data-reply-intel-text="${escapeHtmlAttr(draft1)}" ${draft1 ? "" : "disabled"}>Use in Follow-ups</button>
          </div>
        </div>
        <div class="action-draft">${escapeHtml(draft1 || "No draft. Follow send status guidance.")}</div>
      </div>

      <div class="reply-draft-option">
        <div class="reply-draft-head">
          <strong>Option B, Lighter Draft</strong>
          <div class="action-buttons">
            <button type="button" class="ghost" data-reply-intel-copy="${escapeHtmlAttr(draft2)}" ${draft2 ? "" : "disabled"}>Copy</button>
            <button type="button" class="ghost" data-reply-intel-insert="${escapeHtmlAttr(suggestedTarget)}" data-reply-intel-text="${escapeHtmlAttr(draft2)}" ${draft2 ? "" : "disabled"}>${escapeHtml(suggestedLabel)}</button>
            <button type="button" class="ghost" data-reply-intel-insert="followups" data-reply-intel-text="${escapeHtmlAttr(draft2)}" ${draft2 ? "" : "disabled"}>Use in Follow-ups</button>
          </div>
        </div>
        <div class="action-draft">${escapeHtml(draft2 || "No alternative draft.")}</div>
      </div>

      <details class="reply-analysis-details">
        <summary>Show Analysis</summary>
        <div class="reply-analysis-grid">
          <div class="action-text"><strong>Spam risk:</strong> ${escapeHtml(result.spam_risk || "unknown")}</div>
          <div class="action-text"><strong>Send status:</strong> ${escapeHtml(sendStatus)}</div>
          <div class="action-text"><strong>Objection type:</strong> ${escapeHtml(objectionType)}</div>
          <div class="action-text"><strong>Engagement depth:</strong> ${escapeHtml(engagementDepth == null ? "-" : String(engagementDepth))}/10</div>
          <div class="action-text"><strong>Conversion likelihood:</strong> ${escapeHtml(conversionLikelihood == null ? "-" : String(conversionLikelihood))}/10</div>
          <div class="action-text"><strong>Response energy:</strong> ${escapeHtml(responseEnergy)}</div>
          ${analysis.politeness_mask_risk ? `<div class="action-text"><strong>Politeness mask risk:</strong> ${escapeHtml(String(analysis.politeness_mask_risk))}</div>` : ""}
          ${
            Array.isArray(result.risk_analysis) && result.risk_analysis.length
              ? `<div class="action-text"><strong>What not to say:</strong> ${escapeHtml(result.risk_analysis.join(" | "))}</div>`
              : ""
          }
          ${reasonCodes.length ? `<div class="action-text"><strong>Reason codes:</strong> ${escapeHtml(reasonCodes.join(", "))}</div>` : ""}
          ${styleChecksLines.length ? `<div class="action-text"><strong>Style checks:</strong> ${escapeHtml(styleChecksLines.join(" | "))}</div>` : ""}
        </div>
      </details>
    </div>`;
}

function setVoiceNotesStatus(message, kind = "info") {
  if (!DOM.voiceNotesStatus) return;
  DOM.voiceNotesStatus.textContent = message;
  DOM.voiceNotesStatus.className = "muted-line";
  if (kind === "ok") DOM.voiceNotesStatus.classList.add("status-ok");
  if (kind === "warn") DOM.voiceNotesStatus.classList.add("status-warn");
  if (kind === "err") DOM.voiceNotesStatus.classList.add("status-err");
}

function ensureVoiceNotesRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;
  if (voiceNotesRecognition) return voiceNotesRecognition;

  const rec = new SpeechRecognition();
  rec.lang = "en-US";
  rec.interimResults = true;
  rec.continuous = true;
  rec.maxAlternatives = 1;

  rec.onstart = () => {
    voiceNotesListening = true;
    setVoiceNotesStatus("Listening... speak naturally. Click Stop when done.", "ok");
    if (DOM.startVoiceNotesBtn) DOM.startVoiceNotesBtn.disabled = true;
    if (DOM.stopVoiceNotesBtn) DOM.stopVoiceNotesBtn.disabled = false;
  };

  rec.onend = () => {
    voiceNotesListening = false;
    setVoiceNotesStatus("Voice note off", "info");
    if (DOM.startVoiceNotesBtn) DOM.startVoiceNotesBtn.disabled = false;
    if (DOM.stopVoiceNotesBtn) DOM.stopVoiceNotesBtn.disabled = true;
  };

  rec.onerror = (event) => {
    const code = event?.error || "unknown";
    const friendly =
      code === "not-allowed"
        ? "Microphone permission blocked. Allow mic access and try again."
        : code === "no-speech"
        ? "No speech detected. Try again."
        : `Voice note error: ${code}`;
    setVoiceNotesStatus(friendly, "warn");
  };

  rec.onresult = (event) => {
    let finalText = "";
    let interimText = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i];
      const transcript = String(result?.[0]?.transcript || "").trim();
      if (!transcript) continue;
      if (result.isFinal) finalText += `${transcript} `;
      else interimText += `${transcript} `;
    }

    if (finalText) {
      const cleaned = normalizeNoEmDash(finalText).replace(/\s+([,.!?])/g, "$1").trim();
      const existing = DOM.dailyNotes.value.trim();
      DOM.dailyNotes.value = [existing, cleaned].filter(Boolean).join(existing ? "\n" : "");
      getDay().notes = DOM.dailyNotes.value;
      saveState();
    }

    if (interimText) {
      setVoiceNotesStatus(`Listening... ${interimText.trim()}`, "ok");
    }
  };

  voiceNotesRecognition = rec;
  return rec;
}

function startVoiceNotes() {
  const rec = ensureVoiceNotesRecognition();
  if (!rec) {
    setVoiceNotesStatus("Voice notes need Chrome (Web Speech API) or a supported browser.", "warn");
    return;
  }
  if (voiceNotesListening) return;
  try {
    rec.start();
  } catch (error) {
    setVoiceNotesStatus(`Could not start voice note (${error.message || "unknown"}).`, "warn");
  }
}

function stopVoiceNotes() {
  if (!voiceNotesRecognition || !voiceNotesListening) {
    setVoiceNotesStatus("Voice note off", "info");
    return;
  }
  try {
    voiceNotesRecognition.stop();
  } catch {
    setVoiceNotesStatus("Voice note stopped.", "info");
  }
}

function adjustMetricValue(key, delta) {
  const day = getDay();
  if (!(key in day.metrics)) return;
  day.metrics[key] = Math.max(0, Number(day.metrics[key] || 0) + Number(delta || 0));
  syncMetricInputsFromState();
  saveState();
  renderAnalytics();
}

function syncMetricInputsFromState() {
  const m = getDay().metrics;
  DOM.metricDmsSent.value = m.dmsSent;
  DOM.metricResponses.value = m.responses;
  DOM.metricWhatsAppAdds.value = m.whatsAppAdds;
  DOM.metricClassesBooked.value = m.classesBooked;
  DOM.metricMrBlueComments.value = m.mrBlueComments;
  DOM.metricGuidedNapComments.value = m.guidedNapComments;
}

function renderAnalytics() {
  const day = getDay();
  const metrics = day.metrics;
  const responseRate = metrics.dmsSent ? `${Math.round((metrics.responses / metrics.dmsSent) * 100)}%` : "0%";
  const waRate = metrics.responses ? `${Math.round((metrics.whatsAppAdds / metrics.responses) * 100)}%` : "0%";
  const classRate = metrics.whatsAppAdds ? `${Math.round((metrics.classesBooked / metrics.whatsAppAdds) * 100)}%` : "0%";
  const commentMode = getCommentModeForDate(currentDateKey);
  const target = commentMode.totalPerDay || 0;
  const commentsDone = metrics.mrBlueComments + metrics.guidedNapComments;
  const commentPace = target ? `${commentsDone}/${target} (${Math.round((commentsDone / target) * 100)}%)` : `${commentsDone}`;

  const recent = getRecentDays(14);
  const totals14 = recent.reduce(
    (acc, d) => {
      acc.dms += d.metrics.dmsSent;
      acc.responses += d.metrics.responses;
      acc.wa += d.metrics.whatsAppAdds;
      acc.classes += d.metrics.classesBooked;
      return acc;
    },
    { dms: 0, responses: 0, wa: 0, classes: 0 }
  );
  const responseRate14 = totals14.dms ? `${Math.round((totals14.responses / totals14.dms) * 100)}%` : "0%";

  const topAccounts = summarizeTopAccounts(10).slice(0, 3);

  DOM.analytics.innerHTML = `
    ${analyticsRow("Today response rate", responseRate)}
    ${analyticsRow("Today response → WhatsApp", waRate)}
    ${analyticsRow("Today WhatsApp → class", classRate)}
    ${analyticsRow(`Comment pace (${commentMode.mode})`, commentPace)}
    ${analyticsRow("14-day DM response rate", responseRate14)}
    ${analyticsRow("14-day totals", `DMs ${totals14.dms} · Replies ${totals14.responses} · WA ${totals14.wa} · Classes ${totals14.classes}`)}
    ${analyticsRow("Top comment targets", topAccounts.length ? topAccounts.map((a) => `${a.account} (${a.score})`).join(" · ") : "No records yet")}
  `;
}

function buildDailyReviewReport() {
  const day = getDay();
  const metrics = day.metrics || {};
  const dmsSent = Number(metrics.dmsSent || 0);
  const responses = Number(metrics.responses || 0);
  const waAdds = Number(metrics.whatsAppAdds || 0);
  const classes = Number(metrics.classesBooked || 0);
  const mrBlueComments = Number(metrics.mrBlueComments || 0);
  const guidedNapComments = Number(metrics.guidedNapComments || 0);

  const responseRate = dmsSent ? Math.round((responses / dmsSent) * 100) : 0;
  const waRate = responses ? Math.round((waAdds / responses) * 100) : 0;
  const classRate = waAdds ? Math.round((classes / waAdds) * 100) : 0;

  const topToday = summarizeTopAccountsForDate(currentDateKey).slice(0, 3);
  const notes = String(day.notes || "").trim();

  return [
    `Daily Review - ${formatLongDate(currentDateKey)}`,
    "",
    "Results",
    `- DMs sent: ${dmsSent}`,
    `- Replies: ${responses} (${responseRate}%)`,
    `- WhatsApp adds: ${waAdds} (${waRate}% of replies)`,
    `- Classes booked: ${classes} (${classRate}% of WhatsApp adds)`,
    `- Mr Blue comments: ${mrBlueComments}`,
    `- Guided Nap comments: ${guidedNapComments}`,
    "",
    "Best Comment Targets (today)",
    ...(topToday.length
      ? topToday.map((a) => `- ${a.channel} | ${a.account} (${a.score})`)
      : ["- No performance records logged today"]),
    "",
    "What Worked / Notes",
    ...(notes ? notes.split(/\r?\n/).filter(Boolean).map((line) => `- ${line}`) : ["- [Add one note about best hook/channel]"]),
    "",
    "Tomorrow Focus",
    "- Repeat the best-performing hook/style from today",
    "- Keep MLE to 3-5 messages spaced across the day",
    "- Follow up only on warm replies / engaged targets",
  ].join("\n");
}

function buildWeeklyReviewReport() {
  const endKey = currentDateKey;
  const endDate = parseDateKey(endKey);
  const keys = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(endDate);
    d.setDate(endDate.getDate() - i);
    keys.push(getDateKey(d));
  }

  const rows = keys.map((k) => ({ key: k, day: state.days?.[k] || null }));
  const totals = rows.reduce(
    (acc, row) => {
      const m = row.day?.metrics || {};
      acc.dms += Number(m.dmsSent || 0);
      acc.responses += Number(m.responses || 0);
      acc.wa += Number(m.whatsAppAdds || 0);
      acc.classes += Number(m.classesBooked || 0);
      acc.mrBlue += Number(m.mrBlueComments || 0);
      acc.guidedNap += Number(m.guidedNapComments || 0);
      return acc;
    },
    { dms: 0, responses: 0, wa: 0, classes: 0, mrBlue: 0, guidedNap: 0 }
  );

  const responseRate = totals.dms ? Math.round((totals.responses / totals.dms) * 100) : 0;
  const waRate = totals.responses ? Math.round((totals.wa / totals.responses) * 100) : 0;
  const classRate = totals.wa ? Math.round((totals.classes / totals.wa) * 100) : 0;

  const topWeekly = summarizeTopAccountsAcrossDates(keys, 5);
  const bestDays = rows
    .map((row) => {
      const m = row.day?.metrics || {};
      const dms = Number(m.dmsSent || 0);
      const replies = Number(m.responses || 0);
      const rr = dms ? Math.round((replies / dms) * 100) : 0;
      return { key: row.key, dms, replies, rr };
    })
    .filter((x) => x.dms > 0 || x.replies > 0)
    .sort((a, b) => b.rr - a.rr || b.replies - a.replies)
    .slice(0, 3);

  const notes = rows
    .flatMap((row) =>
      String(row.day?.notes || "")
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((line) => ({ key: row.key, line }))
    )
    .slice(-6);

  const tiktokItems = rows.flatMap((row) => {
    const items = row.day?.tiktokDmTracker?.items;
    return Array.isArray(items)
      ? items.map((item) => ({ ...item, _dateKey: row.key }))
      : [];
  });

  const isEngagedStatus = (status) => ["replied", "tester", "whatsapp", "converted"].includes(String(status || ""));
  const isConvertedStatus = (status) => ["converted"].includes(String(status || ""));
  const hookStats = new Map();
  const toneCounts = new Map();

  tiktokItems.forEach((item) => {
    const hook = String(item.hookType || "").trim();
    const tone = String(item.toneStyle || "").trim();
    const status = String(item.status || "").trim();
    if (hook) {
      const stat = hookStats.get(hook) || { total: 0, engaged: 0, converted: 0 };
      stat.total += 1;
      if (isEngagedStatus(status)) stat.engaged += 1;
      if (isConvertedStatus(status)) stat.converted += 1;
      hookStats.set(hook, stat);
    }
    if (tone) toneCounts.set(tone, (toneCounts.get(tone) || 0) + 1);
  });

  const scoredHooks = Array.from(hookStats.entries())
    .map(([hook, stat]) => {
      const engageRate = stat.total ? Math.round((stat.engaged / stat.total) * 100) : 0;
      const convertRate = stat.total ? Math.round((stat.converted / stat.total) * 100) : 0;
      return { hook, ...stat, engageRate, convertRate };
    })
    .sort((a, b) => b.convertRate - a.convertRate || b.engageRate - a.engageRate || b.total - a.total);

  const topHook = scoredHooks.find((h) => h.total >= 2) || scoredHooks[0] || null;
  const weakestHook =
    scoredHooks
      .filter((h) => h.total >= 2)
      .sort((a, b) => a.convertRate - b.convertRate || a.engageRate - b.engageRate || b.total - a.total)[0] || null;

  const toneEntries = Array.from(toneCounts.entries()).sort((a, b) => b[1] - a[1]);
  const topTone = toneEntries[0] || null;
  const overusedTone =
    topTone && tiktokItems.length >= 6 && topTone[1] / Math.max(1, tiktokItems.filter((i) => i.toneStyle).length || 1) >= 0.6
      ? topTone
      : null;

  const tiktokTrackedCount = tiktokItems.length;
  const tiktokEngagedCount = tiktokItems.filter((it) => isEngagedStatus(it.status)).length;
  const tiktokConvertedCount = tiktokItems.filter((it) => isConvertedStatus(it.status)).length;
  const tiktokAvgLatencyValues = tiktokItems
    .map((it) => Number(it.replyLatencyDays))
    .filter((n) => Number.isFinite(n) && n >= 0);
  const tiktokAvgLatency = tiktokAvgLatencyValues.length
    ? (tiktokAvgLatencyValues.reduce((a, b) => a + b, 0) / tiktokAvgLatencyValues.length).toFixed(1)
    : null;

  return [
    `Weekly Review - ${formatLongDate(keys[0])} to ${formatLongDate(keys[keys.length - 1])}`,
    "",
    "Totals (7 days)",
    `- DMs sent: ${totals.dms}`,
    `- Replies: ${totals.responses} (${responseRate}%)`,
    `- WhatsApp adds: ${totals.wa} (${waRate}% of replies)`,
    `- Classes booked: ${totals.classes} (${classRate}% of WhatsApp adds)`,
    `- Mr Blue comments: ${totals.mrBlue}`,
    `- Guided Nap comments: ${totals.guidedNap}`,
    "",
    "Best Days (reply rate)",
    ...(bestDays.length
      ? bestDays.map((d) => `- ${formatLongDate(d.key)}: ${d.replies}/${d.dms} (${d.rr}%)`)
      : ["- No DM activity logged this week"]),
    "",
    "Top Comment Targets (week)",
    ...(topWeekly.length
      ? topWeekly.map((a) => `- ${a.channel} | ${a.account} (${a.score})`)
      : ["- No performance records logged this week"]),
    "",
    "Recent Notes (week)",
    ...(notes.length ? notes.map((n) => `- ${formatLongDate(n.key)}: ${n.line}`) : ["- No notes logged this week"]),
    "",
    "TikTok DM Learning (week)",
    `- Tracked TikTok DMs: ${tiktokTrackedCount}`,
    `- Engaged (replied/tester/WhatsApp/converted): ${tiktokEngagedCount}`,
    `- Converted: ${tiktokConvertedCount}`,
    `- Avg reply latency (tracked): ${tiktokAvgLatency ? `${tiktokAvgLatency} day(s)` : "n/a"}`,
    topHook
      ? `- Top hook: ${topHook.hook} (${topHook.engaged}/${topHook.total} engaged, ${topHook.converted}/${topHook.total} converted)`
      : "- Top hook: Not enough TikTok tracker data yet",
    weakestHook
      ? `- Weakest hook: ${weakestHook.hook} (${weakestHook.engaged}/${weakestHook.total} engaged, ${weakestHook.converted}/${weakestHook.total} converted)`
      : "- Weakest hook: Not enough repeated hook data yet",
    overusedTone
      ? `- Overused tone warning: ${overusedTone[0]} appears in ${overusedTone[1]} tracker records. Rotate tone styles.`
      : "- Tone mix looks varied enough this week",
    "",
    "Next Week Focus",
    responseRate >= 20
      ? "- Reply rate is >20%. Continue another 4-week sprint and scale the best hooks."
      : responseRate < 10 && totals.dms >= 8
      ? "- Reply rate is <10%. Tighten hooks and shift more effort to Facebook groups for volume."
      : "- Keep testing hooks, stay within safe MLE volume (3-5/day), and double down on warm channels.",
    topHook ? `- Reuse the ${topHook.hook} hook style on TikTok DMs and test one variation.` : "- Add hook type labels in TikTok tracker so weekly review can learn patterns.",
    "- Prioritize comment-first -> DM-after-engagement on Facebook/LinkedIn.",
    "- Track which comments create profile visits and WhatsApp moves.",
  ].join("\n");
}

function analyticsRow(label, value) {
  return `<div class="analytics-row"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`;
}

function getRecentDays(limit) {
  return Object.entries(state.days)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, limit)
    .map(([, v]) => v);
}

function summarizeTopAccounts(limit = 20) {
  const scores = new Map();
  for (const [dateKey, day] of Object.entries(state.days)) {
    if (!Array.isArray(day.performanceRecords)) continue;
    for (const rec of day.performanceRecords) {
      const key = `${rec.channel}|${rec.account}`;
      const score = Number(rec.likes || 0) + Number(rec.replies || 0) * 3;
      if (!scores.has(key)) {
        scores.set(key, { dateKey, channel: rec.channel, account: rec.account, score: 0, entries: 0 });
      }
      const row = scores.get(key);
      row.score += score;
      row.entries += 1;
    }
  }
  return [...scores.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function summarizeTopAccountsForDate(dateKey, limit = 20) {
  const day = state.days?.[dateKey];
  if (!day || !Array.isArray(day.performanceRecords)) return [];
  const scores = new Map();
  for (const rec of day.performanceRecords) {
    const key = `${rec.channel}|${rec.account}`;
    const score = Number(rec.likes || 0) + Number(rec.replies || 0) * 3;
    if (!scores.has(key)) {
      scores.set(key, { channel: rec.channel, account: rec.account, score: 0, entries: 0 });
    }
    const row = scores.get(key);
    row.score += score;
    row.entries += 1;
  }
  return [...scores.values()].sort((a, b) => b.score - a.score).slice(0, limit);
}

function summarizeTopAccountsAcrossDates(dateKeys = [], limit = 20) {
  const keySet = new Set(dateKeys);
  const scores = new Map();
  for (const [dateKey, day] of Object.entries(state.days || {})) {
    if (!keySet.has(dateKey) || !Array.isArray(day.performanceRecords)) continue;
    for (const rec of day.performanceRecords) {
      const key = `${rec.channel}|${rec.account}`;
      const score = Number(rec.likes || 0) + Number(rec.replies || 0) * 3;
      if (!scores.has(key)) {
        scores.set(key, { channel: rec.channel, account: rec.account, score: 0, entries: 0 });
      }
      const row = scores.get(key);
      row.score += score;
      row.entries += 1;
    }
  }
  return [...scores.values()].sort((a, b) => b.score - a.score).slice(0, limit);
}

function bindClaudePack() {
  DOM.generateClaudePackBtn.addEventListener("click", () => {
    DOM.claudePackOutput.value = buildClaudePack();
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function addScreenshotsFromFiles(files, sourceLabel = "input") {
  const imageFiles = [...files].filter((f) => f && f.type && f.type.startsWith("image/"));
  if (!imageFiles.length) {
    setClaudeHandoffStatus(`No image found in ${sourceLabel}.`, "err");
    return 0;
  }

  const newShots = await Promise.all(
    imageFiles.map(async (file, idx) => ({
      id: cryptoRandomId(),
      name: file.name || `screenshot-${Date.now()}-${idx + 1}.png`,
      sizeKb: Math.round((file.size || 0) / 1024),
      previewUrl: await fileToDataUrl(file),
    }))
  );

  runtimeScreenshots = runtimeScreenshots.concat(newShots);
  renderScreenshotGallery();
  setClaudeHandoffStatus(`Added ${newShots.length} screenshot(s) from ${sourceLabel}.`, "ok");
  return newShots.length;
}

async function tryHandleClipboardImages(event, sourceLabel) {
  const items = [...(event.clipboardData?.items || [])];
  const imageItems = items.filter((item) => item.kind === "file" && item.type.startsWith("image/"));
  if (!imageItems.length) return false;

  const files = imageItems
    .map((item) => item.getAsFile())
    .filter(Boolean);

  if (!files.length) return false;
  await addScreenshotsFromFiles(files, sourceLabel);
  return true;
}

function renderScreenshotGallery() {
  if (!runtimeScreenshots.length) {
    DOM.screenshotGallery.innerHTML = `<p class="muted-line">No screenshots added yet.</p>`;
    return;
  }
  DOM.screenshotGallery.innerHTML = `
    <div class="screenshot-grid">
      ${runtimeScreenshots
        .map(
          (shot, idx) => `
        <article class="shot-card">
          <img src="${shot.previewUrl}" alt="${escapeHtml(shot.name)}">
          <div class="shot-meta">
            <strong>#${idx + 1} ${escapeHtml(shot.name)}</strong>
            <span>${escapeHtml(String(shot.sizeKb))} KB</span>
            <div class="shot-actions">
              <button class="ghost shot-copy-btn" type="button" data-shot-id="${shot.id}">Copy Image</button>
              <button class="ghost shot-download-btn" type="button" data-shot-id="${shot.id}">Download</button>
            </div>
          </div>
        </article>`
        )
        .join("")}
    </div>`;

  DOM.screenshotGallery.querySelectorAll(".shot-copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const shot = runtimeScreenshots.find((s) => s.id === btn.dataset.shotId);
      if (!shot) return;
      const ok = await copyImageDataUrlToClipboard(shot.previewUrl);
      setClaudeHandoffStatus(
        ok ? `Copied image: ${shot.name}. Paste it into Claude Desktop.` : "Could not copy image to clipboard in this browser. Drag the screenshot card or attach manually.",
        ok ? "ok" : "warn"
      );
    });
  });

  DOM.screenshotGallery.querySelectorAll(".shot-download-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const shot = runtimeScreenshots.find((s) => s.id === btn.dataset.shotId);
      if (!shot) return;
      downloadDataUrl(shot.previewUrl, shot.name);
      setClaudeHandoffStatus(`Downloaded screenshot: ${shot.name}`, "ok");
    });
  });
}

function clampNum(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function setClaudeHandoffStatus(message, kind = "info") {
  DOM.claudeHandoffStatusLine.textContent = message;
  DOM.claudeHandoffStatusLine.className = "muted-line";
  if (kind === "ok") DOM.claudeHandoffStatusLine.classList.add("status-ok");
  if (kind === "err") DOM.claudeHandoffStatusLine.classList.add("status-err");
  if (kind === "warn") DOM.claudeHandoffStatusLine.classList.add("status-warn");
}

function setLinkStatus(message, kind = "info") {
  if (!DOM.linkStatusLine) return;
  DOM.linkStatusLine.textContent = message;
  DOM.linkStatusLine.className = "muted-line";
  if (kind === "ok") DOM.linkStatusLine.classList.add("status-ok");
  if (kind === "err") DOM.linkStatusLine.classList.add("status-err");
  if (kind === "warn") DOM.linkStatusLine.classList.add("status-warn");
}

function setApiStatus(message, kind = "info") {
  DOM.apiStatusLine.textContent = message;
  DOM.apiStatusLine.className = "muted-line";
  if (kind === "ok") DOM.apiStatusLine.classList.add("status-ok");
  if (kind === "err") DOM.apiStatusLine.classList.add("status-err");
  if (kind === "warn") DOM.apiStatusLine.classList.add("status-warn");
}

function setActionsStatus(message, kind = "info") {
  DOM.actionsStatusLine.textContent = message;
  DOM.actionsStatusLine.className = "muted-line";
  if (kind === "ok") DOM.actionsStatusLine.classList.add("status-ok");
  if (kind === "err") DOM.actionsStatusLine.classList.add("status-err");
  if (kind === "warn") DOM.actionsStatusLine.classList.add("status-warn");
}

function setContextHubStatus(message, kind = "info") {
  if (!DOM.contextHubStatusLine) return;
  DOM.contextHubStatusLine.textContent = message;
  DOM.contextHubStatusLine.className = "muted-line";
  if (kind === "ok") DOM.contextHubStatusLine.classList.add("status-ok");
  if (kind === "err") DOM.contextHubStatusLine.classList.add("status-err");
  if (kind === "warn") DOM.contextHubStatusLine.classList.add("status-warn");
}

function setLeadRadarStatus(message, kind = "info") {
  if (!DOM.leadRadarStatusLine) return;
  DOM.leadRadarStatusLine.textContent = message;
  DOM.leadRadarStatusLine.className = "muted-line";
  if (kind === "ok") DOM.leadRadarStatusLine.classList.add("status-ok");
  if (kind === "err") DOM.leadRadarStatusLine.classList.add("status-err");
  if (kind === "warn") DOM.leadRadarStatusLine.classList.add("status-warn");
}

async function apiJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }
  return data;
}

async function loadContextHubSettings() {
  if (!DOM.contextHubPathInput) return null;
  try {
    const data = await apiJson("/api/context-hub/settings");
    state.contextHubPath = data.contextHubPath || state.contextHubPath || "";
    DOM.contextHubPathInput.value = state.contextHubPath || "";
    saveState();
    return data;
  } catch (error) {
    setContextHubStatus(`Context Hub settings unavailable: ${error.message}`, "warn");
    return null;
  }
}

async function saveContextHubPath() {
  if (!DOM.contextHubPathInput) return;
  const pathValue = String(DOM.contextHubPathInput.value || "").trim();
  if (!pathValue) {
    setContextHubStatus("Paste a Context Hub path first.", "warn");
    return;
  }
  try {
    const data = await apiJson("/api/context-hub/settings", {
      method: "PUT",
      body: JSON.stringify({ contextHubPath: pathValue }),
    });
    state.contextHubPath = data.contextHubPath || pathValue;
    saveState();
    setContextHubStatus("Context Hub path saved.", "ok");
    await refreshContextHubSummary();
  } catch (error) {
    setContextHubStatus(`Could not save path: ${error.message}`, "warn");
  }
}

async function refreshContextHubSummary() {
  if (!DOM.contextHubSummary) return;
  try {
    const data = await apiJson("/api/context-hub/summary");
    renderContextHubSummary(data.summary || null);
    setContextHubStatus("Context Hub summary loaded.", "ok");
  } catch (error) {
    renderContextHubSummary(null, error.message);
    setContextHubStatus(`Context Hub summary failed: ${error.message}`, "warn");
  }
}

function renderContextHubSummary(summary, errorMessage = "") {
  if (!DOM.contextHubSummary) return;
  if (!summary) {
    DOM.contextHubSummary.innerHTML = `<p class="muted-line">${escapeHtml(errorMessage || "No Context Hub summary yet.")}</p>`;
    return;
  }
  if (!summary.exists) {
    DOM.contextHubSummary.innerHTML = `<p class="muted-line status-warn">${escapeHtml(summary.warning || "Context Hub not found")} ${escapeHtml(summary.path || "")}</p>`;
    return;
  }
  const focus = summary.currentFocus || {};
  DOM.contextHubSummary.innerHTML = `
    <div class="action-item">
      <div class="action-top">
        <div class="action-badges"><span class="mini-pill done">CONNECTED</span></div>
        <strong>${escapeHtml(summary.path || "")}</strong>
      </div>
      <div class="action-text">Primary: ${escapeHtml((focus.primary_now || []).join(", ") || "n/a")}</div>
      <div class="action-text">Paused: ${escapeHtml((focus.paused_now || []).join(", ") || "n/a")}</div>
      <div class="action-text">Delayed: ${escapeHtml((focus.delayed || []).join(", ") || "n/a")}</div>
      ${(summary.priorities || []).length ? `<div class="action-text">Priorities: ${escapeHtml(summary.priorities.slice(0, 3).join(" | "))}</div>` : ""}
      ${(summary.warnings || []).length ? `<div class="action-text">Warnings: ${escapeHtml(summary.warnings.join(" | "))}</div>` : ""}
    </div>`;
}

async function fetchLinkContext() {
  const rawUrl = String(DOM.linkInput?.value || "").trim();
  if (!rawUrl) {
    setLinkStatus("Paste a public URL first.", "warn");
    renderLinkContextPreview(null);
    return;
  }

  try {
    new URL(rawUrl);
  } catch {
    setLinkStatus("Invalid URL. Paste a full public link (https://...).", "err");
    renderLinkContextPreview(null);
    return;
  }

  setLinkStatus("Fetching public link context...", "info");
  try {
    const data = await apiJson("/api/link-context", {
      method: "POST",
      body: JSON.stringify({ url: rawUrl }),
    });
    getDay().linkContextData = data;
    saveState();
    renderLinkContextPreview(data);
    setLinkStatus(
      data?.ok
        ? "Link context fetched. You can generate a Claude link prompt now."
        : "Link fetch returned limited data. Screenshot fallback may be better.",
      data?.ok ? "ok" : "warn"
    );
  } catch (error) {
    getDay().linkContextData = { ok: false, url: rawUrl, error: error.message };
    saveState();
    renderLinkContextPreview(getDay().linkContextData);
    setLinkStatus(`Link fetch failed: ${error.message}. Use screenshot fallback for login-only/blocked pages.`, "warn");
  }
}

function renderLinkContextPreview(data = getDay().linkContextData) {
  if (!DOM.linkContextPreview) return;
  if (!data) {
    DOM.linkContextPreview.innerHTML = `<p class="muted-line">No link fetched yet. Paste a public URL, then click <strong>Fetch Link Context</strong>.</p>`;
    return;
  }

  const title = data?.meta?.title || data?.title || "";
  const description = data?.meta?.description || data?.description || "";
  const snippet = data?.snippet || "";
  const finalUrl = data?.finalUrl || data?.url || "";
  const host = data?.host || (finalUrl ? new URL(finalUrl).host : "");

  DOM.linkContextPreview.innerHTML = `
    <div class="action-item">
      <div class="action-top">
        <div class="action-badges">
          <span class="mini-pill">${escapeHtml(data?.ok ? "FETCHED" : "LIMITED")}</span>
          ${host ? `<span class="mini-pill">${escapeHtml(host)}</span>` : ""}
        </div>
        <strong>${escapeHtml(title || "Untitled page")}</strong>
      </div>
      ${finalUrl ? `<div class="action-text">${escapeHtml(finalUrl)}</div>` : ""}
      ${description ? `<div class="action-text">${escapeHtml(description)}</div>` : ""}
      ${snippet ? `<div class="action-text">${escapeHtml(snippet)}</div>` : ""}
      ${data?.error ? `<div class="action-text">Error: ${escapeHtml(data.error)}</div>` : ""}
      <div class="action-text">Use screenshot fallback for login-only pages (MLE) or weak/JS-only previews.</div>
    </div>`;
}

async function checkBackendHealth() {
  try {
    await apiJson("/api/health");
    backendState = { checked: true, online: true };
  } catch {
    backendState = { checked: true, online: false };
  }
  return backendState.online;
}

async function loadGlobalBrandPackFromBackend() {
  try {
    const data = await apiJson("/api/brand-pack");
    if (data.brandPack && typeof data.brandPack === "object" && Object.keys(data.brandPack).length) {
      const json = JSON.stringify(data.brandPack, null, 2);
      state.globalBrandPackJson = json;
      DOM.brandPackJson.value = json;
      saveState();
      renderBrandPackStatus();
      setActionsStatus("Loaded global brand pack from backend.", "ok");
    }
  } catch {
    // silent fallback to local storage
  }
}

async function syncBrandPackToBackend() {
  const parsed = tryParseBrandPack();
  if (!parsed.ok) return false;
  try {
    await apiJson("/api/brand-pack", {
      method: "PUT",
      body: JSON.stringify({ brandPack: parsed.parsed }),
    });
    setActionsStatus("Global brand pack saved to backend JSON.", "ok");
    return true;
  } catch (error) {
    setActionsStatus(`Brand pack save skipped (backend unavailable): ${error.message}`, "warn");
    return false;
  }
}

function renderNextBestActionsList(items = []) {
  if (!items.length) {
    DOM.nextBestActionsList.innerHTML = `<p class="muted-line">No queued actions yet. Import screenshot JSON to populate this queue.</p>`;
    return;
  }
  DOM.nextBestActionsList.innerHTML = `
    <div class="action-list">
      ${items
        .map((item) => {
          const actionClass = String(item.actionType || "").toLowerCase();
          const draft = item?.drafts?.dm?.message || item?.drafts?.comment?.comment || "";
          return `
            <article class="action-item" data-action-id="${escapeHtml(item.id)}">
              <div class="action-top">
                <div class="action-badges">
                  <span class="mini-pill ${escapeHtml(actionClass)}">${escapeHtml(item.actionType || "UNKNOWN")}</span>
                  <span class="mini-pill">Score ${escapeHtml(String(item.targetScore ?? "-"))}/10</span>
                  <span class="mini-pill">${escapeHtml(item.platform || "Unknown")}</span>
                </div>
                <strong>${escapeHtml(item.handleOrName || item.targetId || "Target")}</strong>
              </div>
              <div class="action-text">${escapeHtml(item.quickContext || "")}</div>
              ${draft ? `<div class="action-draft">${escapeHtml(draft)}</div>` : ""}
              <div class="action-buttons">
                <button class="ghost nba-copy-btn" type="button" data-copy="${escapeHtmlAttr(draft)}" ${draft ? "" : "disabled"}>Copy Draft</button>
                <button class="ghost nba-remind-btn" type="button" data-target-id="${escapeHtmlAttr(item.targetId || "")}" data-interaction-type="${escapeHtmlAttr((item.actionType || "COMMENT").toLowerCase())}">
                  Set 72h Reminder
                </button>
              </div>
            </article>`;
        })
        .join("")}
    </div>`;

  DOM.nextBestActionsList.querySelectorAll(".nba-copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const copied = await copyText(btn.dataset.copy || "");
      setActionsStatus(copied ? "Draft copied to clipboard." : "Could not copy draft automatically.", copied ? "ok" : "warn");
    });
  });
  DOM.nextBestActionsList.querySelectorAll(".nba-remind-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      void createFollowUpReminder(btn.dataset.targetId || "", btn.dataset.interactionType || "comment");
    });
  });
}

function renderPendingRemindersList(reminders = []) {
  if (!reminders.length) {
    DOM.pendingRemindersList.innerHTML = `<p class="muted-line">No reminders due yet.</p>`;
    return;
  }
  DOM.pendingRemindersList.innerHTML = `
    <div class="reminder-list">
      ${reminders
        .map(
          (r) => `
        <article class="reminder-item">
          <div class="action-top">
            <div class="action-badges">
              <span class="mini-pill">${escapeHtml(r.interactionType || "followup")}</span>
            </div>
            <strong>${escapeHtml(r.targetId || "target")}</strong>
          </div>
          <div class="action-text">Due: ${escapeHtml(new Date(r.dueAt).toLocaleString())}</div>
        </article>`
        )
        .join("")}
    </div>`;
}

function normalizeTargetScoreForUi(target) {
  if (Number.isInteger(target?.target_score)) return target.target_score;
  if (Number.isFinite(Number(target?.target_score_0_100))) {
    const score = Math.round(Number(target.target_score_0_100) / 10);
    return Math.min(10, Math.max(1, score));
  }
  return null;
}

function renderScreenshotDecisionsPreviewFromRaw(raw) {
  const text = String(raw || "").trim();
  if (!text) {
    DOM.screenshotDecisionsPreview.innerHTML = `<p class="muted-line">Paste screenshot-analysis JSON to preview action types and scores here.</p>`;
    return;
  }
  try {
    const parsed = parseJsonLike(text);
    renderScreenshotDecisionsPreview(parsed);
  } catch {
    DOM.screenshotDecisionsPreview.innerHTML = `<p class="muted-line">Preview unavailable until valid JSON is pasted.</p>`;
  }
}

function renderScreenshotDecisionsPreview(parsed) {
  const targets = Array.isArray(parsed?.target_notes) ? parsed.target_notes : [];
  if (!targets.length) {
    DOM.screenshotDecisionsPreview.innerHTML = `<p class="muted-line">No <code>target_notes</code> found in the JSON.</p>`;
    return;
  }
  const comments = Array.isArray(parsed?.comment_drafts) ? parsed.comment_drafts : [];
  const dms = Array.isArray(parsed?.outreach_dms) ? parsed.outreach_dms : [];

  DOM.screenshotDecisionsPreview.innerHTML = `
    <div class="action-list">
      ${targets
        .map((t) => {
          const action = String(t.action_type || "UNKNOWN");
          const score = normalizeTargetScoreForUi(t);
          const cls = action.toLowerCase();
          const scoreBand = getTargetScoreBand(score);
          const dm = dms.find((d) => d.screenshot_index === t.screenshot_index);
          const comment = comments.find((c) => c.screenshot_index === t.screenshot_index);
          return `
            <article class="action-item">
              <div class="action-top">
                <div class="action-badges">
                  <span class="mini-pill ${escapeHtml(cls)}">${escapeHtml(action)}</span>
                  <span class="mini-pill">Score ${escapeHtml(score == null ? "-" : String(score))}/10</span>
                  ${scoreBand ? `<span class="mini-pill">${escapeHtml(scoreBand.badge)}</span>` : ""}
                  <span class="mini-pill">${escapeHtml(t.platform || "Unknown")}</span>
                </div>
                <strong>${escapeHtml(t.handle_or_name || `Screenshot ${t.screenshot_index}`)}</strong>
              </div>
              <div class="action-text">${escapeHtml(t.quick_context || t.post_topic || "")}</div>
              ${t.personalization_hook_story_angle ? `<div class="action-text">Hook: ${escapeHtml(t.personalization_hook_story_angle)}</div>` : ""}
              <div class="action-text">Drafts: ${dm ? "DM" : ""}${dm && comment ? " + " : ""}${comment ? `${comment.persona || "Comment"} comment` : ""}${!dm && !comment ? "None" : ""}</div>
            </article>`;
        })
        .join("")}
    </div>`;
}

function getTargetScoreBand(score) {
  if (!Number.isFinite(Number(score))) return null;
  const s = Number(score);
  if (s >= 8) return { badge: "🟢 DM NOW" };
  if (s >= 5) return { badge: "🟡 DM IF LIGHT" };
  if (s >= 3) return { badge: "🟠 SKIP UNLESS SLOW" };
  return { badge: "🔴 SKIP" };
}

function renderMleDmQa() {
  if (!DOM.mleQaList) return;
  const candidates = extractMleDmCandidates(DOM.mleDrafts?.value || "");
  if (!candidates.length) {
    DOM.mleQaList.innerHTML = `<p class="muted-line">No MLE DM drafts detected yet. Import MLE drafts or paste them here to run checks.</p>`;
    return;
  }

  const countWarning =
    candidates.length > 5
      ? `<p class="muted-line status-warn">You have ${candidates.length} MLE DMs drafted. Safe volume target is 3-5/day max (space them out).</p>`
      : `<p class="muted-line">Safe volume target: 3-5 MLE DMs/day max, spaced across the day.</p>`;

  DOM.mleQaList.innerHTML = `
    ${countWarning}
    <div class="action-list">
      ${candidates
        .map((item, idx) => {
          const qa = evaluateMleDmDraft(item.message || "");
          const status = qa.pass ? "PASS" : "REVISE";
          const statusClass = qa.pass ? "comment" : "skip";
          return `
            <article class="action-item">
              <div class="action-top">
                <div class="action-badges">
                  <span class="mini-pill ${statusClass}">${escapeHtml(status)}</span>
                  <span class="mini-pill">${escapeHtml(`${qa.sentenceCount} sentence${qa.sentenceCount === 1 ? "" : "s"}`)}</span>
                  <span class="mini-pill">${escapeHtml(`${qa.wordCount} words`)}</span>
                  <span class="mini-pill">${escapeHtml(`${qa.charCount} chars`)}</span>
                </div>
                <strong>${escapeHtml(item.label || `MLE DM ${idx + 1}`)}</strong>
              </div>
              <div class="action-draft">${escapeHtml(item.message || "")}</div>
              ${
                qa.flags.length
                  ? `<div class="action-text">Flags: ${escapeHtml(qa.flags.join(" | "))}</div>`
                  : `<div class="action-text">Looks good for first-touch MLE (reply-first).</div>`
              }
              ${
                qa.tips.length
                  ? `<div class="action-text">Tighten: ${escapeHtml(qa.tips.join(" | "))}</div>`
                  : ""
              }
            </article>`;
        })
        .join("")}
    </div>`;
}

function renderWillCommentHandoffsFromRaw(raw) {
  if (!DOM.willCommentHandoffList) return;
  const text = String(raw || "").trim();
  if (!text) {
    DOM.willCommentHandoffList.innerHTML = `<p class="muted-line">Paste/import screenshot JSON to generate comment → DM handoffs for Facebook/LinkedIn targets.</p>`;
    return;
  }
  try {
    const parsed = parseJsonLike(text);
    renderWillCommentHandoffs(parsed);
  } catch {
    DOM.willCommentHandoffList.innerHTML = `<p class="muted-line">Handoffs unavailable until valid screenshot-analysis JSON is present.</p>`;
  }
}

function renderWillCommentHandoffs(parsed) {
  if (!DOM.willCommentHandoffList) return;
  const targets = Array.isArray(parsed?.target_notes) ? parsed.target_notes : [];
  const comments = Array.isArray(parsed?.comment_drafts) ? parsed.comment_drafts : [];
  const outreachDms = Array.isArray(parsed?.outreach_dms) ? parsed.outreach_dms : [];
  const followups = Array.isArray(parsed?.followups) ? parsed.followups : [];

  const entries = comments
    .filter((c) => {
      const persona = String(c?.persona || "").toLowerCase();
      const commentType = String(c?.comment_type || "").toLowerCase();
      const target = targets.find((t) => t.screenshot_index === c.screenshot_index);
      const platform = String(target?.platform || "").toLowerCase();
      const isWill = persona === "will";
      const isFbLiType = commentType.includes("fb_or_linkedin");
      const isFbLiPlatform = platform.includes("facebook") || platform.includes("linkedin");
      return isWill && (isFbLiType || isFbLiPlatform);
    })
    .map((c) => {
      const target = targets.find((t) => t.screenshot_index === c.screenshot_index) || {};
      const followup =
        followups.find((f) => f.screenshot_index === c.screenshot_index && f.stage === "after_comment_engagement_dm") ||
        outreachDms.find((d) => d.screenshot_index === c.screenshot_index && /facebook|linkedin/i.test(String(d.channel || ""))) ||
        null;
      const score = normalizeTargetScoreForUi(target);
      const targetId = buildTargetIdForTarget(target, c.screenshot_index);
      return {
        screenshotIndex: c.screenshot_index,
        target,
        comment: c,
        followup,
        score,
        targetId,
      };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  if (!entries.length) {
    DOM.willCommentHandoffList.innerHTML = `<p class="muted-line">No Facebook/LinkedIn Will comment drafts detected in the current screenshot JSON.</p>`;
    return;
  }

  DOM.willCommentHandoffList.innerHTML = `
    <div class="action-list">
      ${entries
        .map((entry) => {
          const action = String(entry.target?.action_type || "COMMENT");
          const actionCls = action.toLowerCase();
          const scoreBand = getTargetScoreBand(entry.score);
          const targetName = entry.target?.handle_or_name || `Screenshot ${entry.screenshotIndex}`;
          const platform = entry.target?.platform || "Unknown";
          const followupText = entry.followup?.message || "";
          return `
            <article class="action-item">
              <div class="action-top">
                <div class="action-badges">
                  <span class="mini-pill ${escapeHtml(actionCls)}">${escapeHtml(action)}</span>
                  <span class="mini-pill">Score ${escapeHtml(entry.score == null ? "-" : String(entry.score))}/10</span>
                  ${scoreBand ? `<span class="mini-pill">${escapeHtml(scoreBand.badge)}</span>` : ""}
                  <span class="mini-pill">${escapeHtml(platform)}</span>
                </div>
                <strong>${escapeHtml(targetName)}</strong>
              </div>
              <div class="action-text">${escapeHtml(entry.target?.quick_context || entry.target?.post_topic || "")}</div>
              <div class="action-text"><strong>Comment reply:</strong> ${escapeHtml(entry.comment?.comment || "")}</div>
              ${
                followupText
                  ? `<div class="action-text"><strong>After-engagement DM:</strong> ${escapeHtml(followupText)}</div>`
                  : `<div class="action-text">No after-comment DM draft found yet. Claude can add one using stage <code>after_comment_engagement_dm</code>.</div>`
              }
              <div class="action-buttons">
                <button class="ghost will-comment-copy-btn" type="button" data-copy="${escapeHtmlAttr(entry.comment?.comment || "")}">
                  Copy Comment
                </button>
                <button class="ghost will-comment-copy-dm-btn" type="button" data-copy="${escapeHtmlAttr(followupText)}" ${followupText ? "" : "disabled"}>
                  Copy DM (After Engagement)
                </button>
                <button class="ghost will-comment-engaged-btn" type="button"
                  data-target-id="${escapeHtmlAttr(entry.targetId)}"
                  data-platform="${escapeHtmlAttr(platform)}"
                  data-name="${escapeHtmlAttr(targetName)}"
                  data-score="${escapeHtmlAttr(entry.score == null ? "" : String(entry.score))}"
                  data-context="${escapeHtmlAttr(entry.target?.quick_context || entry.target?.post_topic || "")}"
                  data-dm="${escapeHtmlAttr(followupText)}"
                  ${followupText ? "" : "disabled"}>
                  Mark Engaged → Queue DM
                </button>
                <button class="ghost will-comment-handoff-btn" type="button"
                  data-target-id="${escapeHtmlAttr(entry.targetId)}"
                  data-label="${escapeHtmlAttr(`${platform} | ${targetName}`)}"
                  data-followup="${escapeHtmlAttr(followupText)}">
                  Comment → DM Handoff
                </button>
              </div>
            </article>`;
        })
        .join("")}
    </div>`;

  DOM.willCommentHandoffList.querySelectorAll(".will-comment-copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const copied = await copyText(btn.dataset.copy || "");
      setActionsStatus(copied ? "Comment reply copied." : "Could not copy comment reply.", copied ? "ok" : "warn");
    });
  });

  DOM.willCommentHandoffList.querySelectorAll(".will-comment-copy-dm-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const copied = await copyText(btn.dataset.copy || "");
      setActionsStatus(copied ? "After-engagement DM copied." : "Could not copy DM draft.", copied ? "ok" : "warn");
    });
  });

  DOM.willCommentHandoffList.querySelectorAll(".will-comment-engaged-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      void markWillCommentEngaged({
        targetId: btn.dataset.targetId || "",
        platform: btn.dataset.platform || "Unknown",
        handleOrName: btn.dataset.name || "Target",
        targetScore: Number(btn.dataset.score || 0) || 5,
        quickContext: btn.dataset.context || "",
        dmMessage: btn.dataset.dm || "",
      });
    });
  });

  DOM.willCommentHandoffList.querySelectorAll(".will-comment-handoff-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      void createCommentToDmHandoff({
        targetId: btn.dataset.targetId || "",
        label: btn.dataset.label || "",
        followupMessage: btn.dataset.followup || "",
      });
    });
  });
}

async function markWillCommentEngaged({ targetId, platform, handleOrName, targetScore, quickContext, dmMessage }) {
  if (!targetId || !dmMessage) {
    setActionsStatus("Missing target or DM draft for Mark Engaged.", "warn");
    return;
  }

  // Add a ready-to-send DM block to outreach drafts for immediate use.
  const block = [
    `### READY DM (After Comment Engagement) (${platform})`,
    `Target: ${handleOrName}`,
    dmMessage,
    "",
  ].join("\n");
  const existing = DOM.outreachDrafts.value.trim();
  DOM.outreachDrafts.value = [existing, block].filter(Boolean).join("\n\n");
  getDay().drafts.outreachDrafts = DOM.outreachDrafts.value;
  saveState();

  // Queue into Next Best Actions backend as a DM item (best effort).
  const synthetic = {
    target_notes: [
      {
        screenshot_index: 1,
        platform,
        handle_or_name: handleOrName,
        quick_context: quickContext,
        action_type: "DM",
        target_score: Math.min(10, Math.max(1, Number(targetScore || 5))),
      },
    ],
    outreach_dms: [
      {
        screenshot_index: 1,
        channel: platform,
        message: dmMessage,
        personalization_hook_used: "after_comment_engagement",
        spam_risk_check: "pass",
      },
    ],
  };
  await queueImportedScreenshotAnalysis(synthetic);

  const copied = await copyText(dmMessage);
  setActionsStatus(
    copied
      ? `Queued ready DM for ${handleOrName} and copied to clipboard.`
      : `Queued ready DM for ${handleOrName}.`,
    "ok"
  );
}

function buildTargetIdForTarget(target, fallbackIndex) {
  const platform = String(target?.platform || "target").trim().toLowerCase().replace(/\s+/g, "_");
  const handle = String(target?.handle_or_name || `screenshot_${fallbackIndex}`)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${platform}:${handle || `screenshot_${fallbackIndex}`}`;
}

async function createCommentToDmHandoff({ targetId, label, followupMessage }) {
  if (!targetId) {
    setActionsStatus("Missing target id for comment → DM handoff.", "err");
    return;
  }
  await createFollowUpReminder(targetId, "after_comment_engagement_dm");

  const templateLines = [
    `### Comment → DM Handoff (${label || targetId})`,
    "Stage: after_comment_engagement_dm",
    "Trigger: Only send after they engage with your comment (reply/like/profile visit + warm signal).",
    followupMessage ? `DM draft: ${followupMessage}` : "DM draft: [Draft after comment engagement using the same hook and keep it short.]",
    "",
  ];
  const existing = DOM.conversionDrafts.value.trim();
  DOM.conversionDrafts.value = [existing, ...templateLines].filter(Boolean).join("\n\n");
  getDay().drafts.conversionDrafts = DOM.conversionDrafts.value;
  saveState();
  setActionsStatus(`Comment → DM handoff created for ${label || targetId} (72h reminder + template).`, "ok");
}

function extractMleDmCandidates(text) {
  const raw = String(text || "").trim();
  if (!raw) return [];

  const headerBlocks = raw.split(/\n(?=###\s*DM\b)/g).filter(Boolean);
  const hasHeaders = headerBlocks.some((b) => /^###\s*DM\b/m.test(b));
  if (hasHeaders) {
    return headerBlocks
      .map((block, i) => {
        const lines = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        if (!lines.length) return null;
        const header = lines[0];
        const msgLines = [];
        for (let j = 1; j < lines.length; j += 1) {
          const line = lines[j];
          if (/^(Hook used:|Spam check:|When:|Condition:|###\s)/i.test(line)) break;
          msgLines.push(line);
        }
        const message = msgLines.join(" ").trim();
        if (!message) return null;
        return { label: header.replace(/^###\s*/, ""), message, index: i + 1 };
      })
      .filter(Boolean);
  }

  return raw
    .split(/\n{2,}/)
    .map((chunk, i) => ({ label: `MLE DM ${i + 1}`, message: chunk.trim(), index: i + 1 }))
    .filter((x) => x.message);
}

function evaluateMleDmDraft(message) {
  const text = String(message || "").trim();
  const flags = [];
  const tips = [];
  const sentences = (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [])
    .map((s) => s.trim())
    .filter(Boolean);
  const sentenceCount = sentences.length;
  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const charCount = text.length;
  const questionCount = (text.match(/\?/g) || []).length;

  if (sentenceCount > 3) {
    flags.push("More than 3 sentences");
    tips.push("Cut to 2-3 sentences max");
  }
  if (charCount > 340 || wordCount > 65) {
    flags.push("Likely too long for cold MLE DM");
    tips.push("Trim 30-40%; keep only hook + one credential + invite");
  }
  if (/\b(unmute|app)\b/i.test(text)) {
    flags.push("Mentions app/product");
    tips.push("Remove app/product mention from first touch");
  }
  if (/\bgenuinely\b/i.test(text)) {
    flags.push("Uses banned word: genuinely");
    tips.push("Replace with plain language");
  }
  if (/\b(i noticed|i came across your profile)\b/i.test(text)) {
    flags.push("Generic opener phrase");
    tips.push("Lead with specific hook instead");
  }
  if (questionCount > 1) {
    flags.push("Too many questions");
    tips.push("End with one easy yes/no invite");
  }
  if (/(innovative|revolutionary|game-changing|startup|founder)/i.test(text)) {
    flags.push("Pitch/corporate wording");
    tips.push("Use peer-to-peer tone; save pitch for later");
  }
  if (/[—–]/.test(text)) {
    flags.push("Uses em/en dash");
    tips.push("Use comma or period instead of —");
  }

  return {
    pass: flags.length === 0,
    flags,
    tips,
    sentenceCount,
    wordCount,
    charCount,
    questionCount,
  };
}

function normalizeNoEmDash(text) {
  return String(text || "")
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

async function refreshNextBestActions() {
  try {
    const data = await apiJson("/api/next-best-actions?limit=20");
    renderNextBestActionsList(data.items || []);
    setActionsStatus(`Loaded ${(data.items || []).length} queued actions.`, "ok");
    return data.items || [];
  } catch (error) {
    renderNextBestActionsList([]);
    setActionsStatus(`Queue unavailable: ${error.message}`, "warn");
    return [];
  }
}

async function refreshPendingReminders() {
  try {
    const data = await apiJson("/api/reminders/pending");
    renderPendingRemindersList(data.reminders || []);
    return data.reminders || [];
  } catch {
    renderPendingRemindersList([]);
    return [];
  }
}

async function refreshNextBestActionsAndReminders() {
  await refreshNextBestActions();
  await refreshPendingReminders();
}

async function queueImportedScreenshotAnalysis(parsed) {
  const normalizedForV11 = {
    ...parsed,
    target_notes: Array.isArray(parsed?.target_notes)
      ? parsed.target_notes.map((t) => ({
          ...t,
          target_score:
            Number.isInteger(t?.target_score) ? t.target_score : normalizeTargetScoreForUi(t) ?? 1,
          action_type: t?.action_type || inferActionTypeFromDrafts(parsed, t?.screenshot_index),
          quick_context: t?.quick_context || t?.post_topic || "",
        }))
      : [],
  };
  try {
    await apiJson("/api/screenshot-analysis/import", {
      method: "POST",
      body: JSON.stringify({ analysis: normalizedForV11, source: "manual_import" }),
    });
    await refreshNextBestActionsAndReminders();
    return true;
  } catch (error) {
    setActionsStatus(`Imported drafts locally, but queueing failed: ${error.message}`, "warn");
    return false;
  }
}

function inferActionTypeFromDrafts(parsed, screenshotIndex) {
  const hasDm = Array.isArray(parsed?.outreach_dms) && parsed.outreach_dms.some((d) => d.screenshot_index === screenshotIndex && d.message);
  const hasComment = Array.isArray(parsed?.comment_drafts) && parsed.comment_drafts.some((c) => c.screenshot_index === screenshotIndex && c.comment);
  if (hasDm) return "DM";
  if (hasComment) return "COMMENT";
  return "SKIP";
}

async function createFollowUpReminder(targetId, interactionType) {
  if (!targetId) {
    setActionsStatus("Missing targetId for reminder.", "err");
    return;
  }
  try {
    await apiJson("/api/reminders", {
      method: "POST",
      body: JSON.stringify({ targetId, interactionType }),
    });
    setActionsStatus(`72h reminder set for ${targetId}.`, "ok");
    await refreshPendingReminders();
  } catch (error) {
    setActionsStatus(`Reminder failed: ${error.message}`, "warn");
  }
}

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  return false;
}

async function copyImageDataUrlToClipboard(dataUrl) {
  try {
    if (!window.ClipboardItem || !navigator.clipboard?.write) return false;
    const blob = dataUrlToBlob(dataUrl);
    const item = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch {
    return false;
  }
}

function dataUrlToBlob(dataUrl) {
  const [header, data] = String(dataUrl).split(",");
  const mimeMatch = /^data:([^;]+);base64$/.exec(header || "");
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const binary = atob(data || "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function downloadTextFile(filename, text, mimeType = "text/plain") {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename || "screenshot.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function buildClaudeDesktopPasteBundle(promptText) {
  const shots = runtimeScreenshots.map((s, i) => `#${i + 1} ${s.name}`).join("\n");
  return [
    "Use this prompt, then attach the screenshot image(s) in this same Claude Desktop message before sending.",
    "Return JSON only.",
    "",
    `Screenshots to attach:\n${shots || "(none loaded)"}`,
    "",
    promptText,
  ].join("\n");
}

function buildClaudeDesktopHandoff(promptText) {
  const day = getDay();
  const rotation = getRotationForDate(currentDateKey);
  const commentMode = getCommentModeForDate(currentDateKey);
  const brandPackResult = tryParseBrandPack();
  return {
    meta: {
      type: "claude_desktop_handoff",
      created_at: new Date().toISOString(),
      date: currentDateKey,
      app: "Daily Operator Copilot",
    },
    workflow: {
      recommended: "Paste prompt into Claude Desktop, attach the same screenshots, request JSON-only output, paste response back into the app, then click Import to Context + DMs.",
      human_in_the_loop: true,
      no_auto_send: true,
    },
    today: {
      outreach_source: rotation?.outreach || null,
      distribution_focus: rotation?.distribution || null,
      comment_mode: commentMode.mode,
      comment_target_total: commentMode.totalPerDay,
      comment_split: commentMode.split,
    },
    screenshots: runtimeScreenshots.map((s, i) => ({
      screenshot_index: i + 1,
      file_name: s.name,
      size_kb: s.sizeKb,
    })),
    context_notes: day.drafts.contextNotes || "",
    brand_pack_loaded: brandPackResult.ok,
    brand_pack_summary: brandPackResult.ok ? buildBrandPackSummary(brandPackResult.parsed) : null,
    claude_prompt: promptText,
    import_target_fields: ["Context Notes", "5 Outreach DMs", "Mr Blue / Guided Nap Comments", "Conversion / Follow-up Drafts", "Next Best Actions queue"],
  };
}

async function analyzeScreenshotsViaApi() {
  const day = getDay();
  day.apiUsageByDate ||= {};
  const maxShots = clampNum(Number(day.maxScreenshotsPerRequest || 8), 1, 20);
  const dailyCap = clampNum(Number(day.dailyApiCap || 12), 1, 100);
  const usedToday = Number(day.apiUsageByDate[currentDateKey] || 0);

  if (!runtimeScreenshots.length) {
    setApiStatus("Add at least one screenshot first.", "err");
    return;
  }
  if (usedToday >= dailyCap) {
    setApiStatus(`Daily API cap reached (${usedToday}/${dailyCap}).`, "err");
    return;
  }

  const screenshots = runtimeScreenshots.slice(0, maxShots).map((shot, idx) => ({
    index: idx + 1,
    name: shot.name,
    dataUrl: shot.previewUrl,
  }));

  const brandPackResult = tryParseBrandPack();
  const rotation = getRotationForDate(currentDateKey);
  const commentMode = getCommentModeForDate(currentDateKey);
  const requestBody = {
    provider: day.apiProvider || "claude",
    model: (day.apiModel || "").trim() || undefined,
    date: currentDateKey,
    screenshots,
    contextNotes: day.drafts.contextNotes || "",
    socialPostTextInput: day.socialPostTextInput || "",
    brandPack: brandPackResult.ok ? brandPackResult.parsed : null,
    brandPackSummary: brandPackResult.ok ? buildBrandPackSummary(brandPackResult.parsed) : null,
    today: {
      outreachSource: rotation?.outreach || null,
      distributionFocus: rotation?.distribution || null,
      commentMode: commentMode.mode,
      commentTargetTotal: commentMode.totalPerDay,
      commentSplit: commentMode.split,
    },
  };

  DOM.analyzeScreenshotsBtn.disabled = true;
  setApiStatus(`Analyzing ${screenshots.length} screenshot(s) via ${(requestBody.provider || "claude").toUpperCase()}...`);

  try {
    const apiPath =
      String(requestBody.provider || "claude").toLowerCase() === "claude"
        ? "/api/analyze-screenshots/claude-direct"
        : "/api/analyze-screenshots";
    const response = await fetch(apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    let parsed = data.parsed || null;
    let rawForBox = "";
    if (parsed) {
      DOM.screenshotClaudeOutput.value = JSON.stringify(parsed, null, 2);
    } else if (data.rawText) {
      rawForBox = String(data.rawText || "");
      DOM.screenshotClaudeOutput.value = rawForBox;

      // Try local parse/repair automatically so the user avoids manual copy-paste/repair loops.
      try {
        parsed = parseJsonLike(rawForBox);
        DOM.screenshotClaudeOutput.value = JSON.stringify(parsed, null, 2);
      } catch {
        try {
          const repaired = repairJsonLikeText(rawForBox);
          parsed = JSON.parse(repaired);
          DOM.screenshotClaudeOutput.value = JSON.stringify(parsed, null, 2);
          setClaudeHandoffStatus("Claude API returned malformed JSON, local repair succeeded.", "warn");
        } catch {
          // Leave raw text in box for manual review.
          DOM.screenshotClaudeOutput.value = rawForBox;
        }
      }
    } else {
      DOM.screenshotClaudeOutput.value = JSON.stringify(data, null, 2);
    }
    day.screenshotClaudeOutput = DOM.screenshotClaudeOutput.value;
    renderScreenshotDecisionsPreviewFromRaw(DOM.screenshotClaudeOutput.value);
    renderWillCommentHandoffsFromRaw(DOM.screenshotClaudeOutput.value);
    day.apiUsageByDate[currentDateKey] = usedToday + 1;
    saveState();

    if (parsed && day.autoImportAnalyze !== false) {
      await importScreenshotOutput();
    }

    const parseDiag = data.parseInfo?.error ? ` Parse issue: ${data.parseInfo.error}.` : "";
    setApiStatus(`Done. ${day.apiUsageByDate[currentDateKey]}/${dailyCap} API runs used today.${parsed ? "" : " (Model returned malformed/non-JSON, review manually.)"}${parseDiag}`, parsed ? "ok" : "warn");
  } catch (error) {
    setApiStatus(`API failed: ${error.message}. Run with node server.js (not Python server).`, "err");
  } finally {
    DOM.analyzeScreenshotsBtn.disabled = false;
  }
}

function tryParseBrandPack() {
  const raw = (state.globalBrandPackJson || "").trim();
  if (!raw) return { ok: false, reason: "No brand pack pasted yet." };
  try {
    const parsed = JSON.parse(raw);
    return { ok: true, parsed };
  } catch (error) {
    return { ok: false, reason: `Invalid JSON: ${error.message}` };
  }
}

function renderBrandPackStatus(force = false) {
  const result = tryParseBrandPack();
  DOM.brandPackStatus.className = "status-pill";
  if (!result.ok) {
    DOM.brandPackStatus.classList.add(force ? "warn" : "");
    DOM.brandPackStatus.textContent = result.reason;
    return;
  }
  const parsed = result.parsed || {};
  const hasVoice = Boolean(parsed.brand_voice);
  const hasPersonas = Boolean(parsed.personas);
  DOM.brandPackStatus.classList.add("ok");
  DOM.brandPackStatus.textContent = hasVoice && hasPersonas ? "Brand pack valid" : "Valid JSON (missing expected sections)";
}

function buildBrandPackSummary(parsed) {
  if (!parsed || typeof parsed !== "object") return null;
  return {
    owner: parsed.meta?.owner || null,
    brand_voice: {
      tone_rules: (parsed.brand_voice?.tone_rules || []).slice(0, 12),
      phrasing_rules: (parsed.brand_voice?.phrasing_rules || []).slice(0, 12),
      avoid: (parsed.brand_voice?.avoid || []).slice(0, 20),
    },
    personas: {
      mr_blue: {
        voice_rules: (parsed.personas?.mr_blue?.voice_rules || []).slice(0, 12),
        comment_examples: (parsed.personas?.mr_blue?.comment_examples || []).slice(0, 8),
        caption_examples: (parsed.personas?.mr_blue?.caption_examples || []).slice(0, 8),
      },
      guided_nap: {
        brand_name: parsed.personas?.guided_nap?.brand_name || "Guiding Bros",
        sub_brand: parsed.personas?.guided_nap?.sub_brand || "Guided Nap",
        voice_rules: (parsed.personas?.guided_nap?.voice_rules || []).slice(0, 12),
        comment_examples: (parsed.personas?.guided_nap?.comment_examples || []).slice(0, 8),
        caption_examples: (parsed.personas?.guided_nap?.caption_examples || []).slice(0, 8),
      },
    },
    guardrails: {
      hard_nos: (parsed.guardrails?.hard_nos || []).slice(0, 20),
      banned_phrases: (parsed.guardrails?.banned_phrases || []).slice(0, 30),
      platform_specific_rules: parsed.guardrails?.platform_specific_rules || {},
    },
    offer: {
      product: parsed.offer?.product || null,
      founders_pass: parsed.offer?.founders_pass || null,
      cta_rules: parsed.offer?.cta_rules || null,
    },
  };
}

function buildScreenshotPrompt() {
  const brandPack = tryParseBrandPack();
  const brandSummary = brandPack.ok ? buildBrandPackSummary(brandPack.parsed) : null;
  const shotList = runtimeScreenshots.map((s, i) => ({ index: i + 1, file: s.name }));
  const socialPostText = String(getDay().socialPostTextInput || "").trim();

  const payload = {
    role: "vision_plus_writing_copilot_only",
    task: "Analyze attached profile/post screenshots and draft warm personalized outreach DMs in Will's voice.",
    instructions: [
      "Read each attached screenshot carefully and extract profile/post context.",
      "If raw Facebook/LinkedIn post text is provided, treat it as alternate input and extract poster name (if available), what they said, and what they seem to be struggling with.",
      "If text is unclear, say what is uncertain instead of guessing.",
      "Draft warm, non-spammy DMs in Will's voice using the brand pack rules.",
      "Do not use em dashes or en dashes (— or –) in any drafted message/comment. Use commas or periods instead.",
      "For MyLanguageExchange first-touch messages: keep to 2-3 short sentences max; goal is reply, not conversion.",
      "MLE structure: personal hook -> one light credibility marker -> casual invite. No app mention, no pitch, no over-explaining.",
      "Trim over-polished phrasing. Sound like a real teacher texting, not a polished sales message.",
      "Score MLE prospects using Will's rubric: speaking focus (3), friction signals (3), profile effort (2), hook quality (1), professional English need (1), timezone fit (1), activity (1). Normalize to 1-10 and explain the real reason.",
      "Key question: would this person likely freeze when speaking English out loud? If yes, increase score materially.",
      "Facebook/LinkedIn mode: draft a helpful comment reply first (2-3 sentences, value-first, no pitch). If score is green/yellow, also draft a follow-up DM for AFTER they engage with the comment.",
      "MLE safe volume guidance: 3-5 DMs/day max, spaced across the day (not all at once).",
      "MLE anti-ban rules: no identical messages, no links in DMs, no second DM if they don't reply, mix browsing with messaging.",
      "Batch mode: sort by score highest first. Draft DMs only for strong/medium fits. Flag strong friction matches as UNMUTE LEAD (future only; no pitch in DM).",
      "Do not propose automation, scraping, or mass messaging.",
      "Assume human will send manually after review.",
      "If a screenshot is unsuitable for outreach, flag it and do not force a DM.",
    ],
    required_output: {
      target_notes: [
        {
          screenshot_index: 1,
          platform: "",
          handle_or_name: "",
          country_or_language_clue: "",
          post_topic: "",
          quick_context: "",
          what_they_seem_to_need: "",
          action_type: "COMMENT|FOLLOW|DM|SKIP",
          target_score: 1,
          target_score_band: "🟢|🟡|🟠|🔴",
          score_breakdown: {
            speaking_focus: { score: 0, reason: "" },
            friction_signals: { score: 0, reason: "" },
            profile_effort: { score: 0, reason: "" },
            hook_quality: { score: 0, reason: "" },
            professional_need: { score: 0, reason: "" },
            timezone_compatibility: { score: 0, reason: "" },
            activity: { score: 0, reason: "" },
          },
          unmute_lead: false,
          personalization_hook_story_angle: "",
          warm_status: "commented_yes_or_no_or_unknown",
          confidence: "high|medium|low",
        },
      ],
      outreach_dms: [
        {
          screenshot_index: 1,
          channel: "LinkedIn|Facebook|Instagram|Other",
          message: "",
          personalization_hook_used: "",
          first_touch_rule_check: "2-3 sentences|no_app_mention|casual_invite|pass|revise",
          spam_risk_check: "pass|revise",
          if_revise_why: "",
        },
      ],
      comment_drafts: [
        {
          screenshot_index: 1,
          persona: "Will|Mr Blue|Guided Nap",
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
    screenshots_attached: shotList,
    facebook_linkedin_post_text_input: socialPostText || null,
    brand_pack_summary: brandSummary,
  };

  return [
    "Attach the screenshots to this chat and analyze them.",
    "Return JSON only. No commentary before or after the JSON.",
    "For every screenshot target, action_type and target_score (1-10) are required.",
    JSON.stringify(payload, null, 2),
  ].join("\n\n");
}

function buildLinkPrompt() {
  const brandPack = tryParseBrandPack();
  const brandSummary = brandPack.ok ? buildBrandPackSummary(brandPack.parsed) : null;
  const day = getDay();
  const linkUrl = String(day.linkInput || DOM.linkInput?.value || "").trim();
  const linkContext = day.linkContextData || null;
  const socialPostText = String(day.socialPostTextInput || "").trim();

  const payload = {
    role: "link_plus_writing_copilot_only",
    task: "Analyze a public page link (and optional screenshot) and draft the next best action + DM/comment in Will's voice.",
    instructions: [
      "Use the fetched link context first. If a screenshot is attached, use it as the source of truth when there is conflict.",
      "If the link context is weak/blocked/login-only, say so and prefer COMMENT/FOLLOW/SKIP unless screenshot provides enough detail.",
      "If Facebook/LinkedIn post text is provided, extract poster name (if available), what they said, and what they seem to be struggling with before drafting.",
      "Do not use em dashes or en dashes (— or –) in any drafted message/comment. Use commas or periods instead.",
      "For MyLanguageExchange first-touch messages: 2-3 short sentences max; personal hook -> one credibility marker -> casual invite; no app mention.",
      "Facebook/LinkedIn mode: draft a helpful comment reply first (2-3 sentences, value-first, no pitch). If score is green/yellow, also draft a follow-up DM for AFTER COMMENT ENGAGEMENT.",
      "Score prospects using Will's weighted rubric and normalize to a 1-10 target_score. Explain why.",
      "MLE safe volume guidance: 3-5 DMs/day max, spaced across the day.",
      "Return JSON only. action_type and target_score (1-10) are required for each target.",
    ],
    link: {
      url: linkUrl,
      fetched_context: linkContext || null,
    },
    brand_pack_summary: brandSummary,
    required_output: {
      target_notes: [
        {
          screenshot_index: 1,
          platform: "",
          handle_or_name: "",
          post_topic: "",
          quick_context: "",
          what_they_seem_to_need: "",
          action_type: "COMMENT|FOLLOW|DM|SKIP",
          target_score: 1,
          target_score_band: "🟢|🟡|🟠|🔴",
          unmute_lead: false,
          personalization_hook_story_angle: "",
          confidence: "high|medium|low",
        },
      ],
      outreach_dms: [{ screenshot_index: 1, channel: "LinkedIn|Facebook|Instagram|MyLanguageExchange|Other", message: "" }],
      comment_drafts: [{ screenshot_index: 1, persona: "Will|Mr Blue|Guided Nap", comment: "", comment_type: "fb_or_linkedin_value_reply|other" }],
      followups: [{ screenshot_index: 1, stage: "no_reply_72h|positive_reply|whatsapp_move|post_class_offer|after_comment_engagement_dm", message: "" }],
    },
    facebook_linkedin_post_text_input: socialPostText || null,
  };

  return [
    "Analyze this public link context (and attached screenshot if provided).",
    "Return JSON only. No markdown fences.",
    JSON.stringify(payload, null, 2),
  ].join("\n\n");
}

function parseJsonLike(rawText) {
  const raw = String(rawText || "").trim().replace(/^\uFEFF/, "");
  if (!raw) throw new Error("Empty input");

  const attempts = [];
  attempts.push(raw);

  // Common Claude/Gemini formatting wrappers
  const fenced =
    raw.match(/```json\s*([\s\S]*?)```/i)?.[1] ||
    raw.match(/```\s*([\s\S]*?)```/i)?.[1];
  if (fenced) attempts.push(fenced.trim());

  // Extract object body if extra prose surrounds it
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    attempts.push(raw.slice(firstBrace, lastBrace + 1));
  }

  // Some UIs prepend "json" on first line
  if (/^json\s*\n/i.test(raw)) {
    attempts.push(raw.replace(/^json\s*\n/i, "").trim());
  }

  let lastError = null;
  for (const candidate of attempts) {
    try {
      return JSON.parse(candidate);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("Invalid JSON");
}

function repairJsonLikeText(rawText) {
  let text = String(rawText || "").replace(/^\uFEFF/, "").trim();
  if (!text) throw new Error("Empty input");

  // Remove code fences / wrappers early.
  const fenced =
    text.match(/```json\s*([\s\S]*?)```/i)?.[1] ||
    text.match(/```\s*([\s\S]*?)```/i)?.[1];
  if (fenced) text = fenced.trim();
  if (/^json\s*\n/i.test(text)) text = text.replace(/^json\s*\n/i, "").trim();

  // Extract object if extra prose surrounds JSON.
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) text = text.slice(firstBrace, lastBrace + 1);

  // Normalize common typography issues.
  text = text
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'");

  // Remove trailing commas before object/array closes.
  text = text.replace(/,\s*([}\]])/g, "$1");

  // Heuristic comma insertion for common model mistakes (newline-separated tokens).
  const insertionPatterns = [
    // end of string/number/boolean/null to next property key
    [/(".*?"|\d+|true|false|null)\s*\n(\s*")/g, "$1,\n$2"],
    // object close to next property key
    [/}\s*\n(\s*")/g, "},\n$1"],
    // array close to next property key
    [/]\s*\n(\s*")/g, "],\n$1"],
    // object close to next object in array
    [/}\s*\n(\s*{)/g, "},\n$1"],
    // string value close quote to next object/array item
    [/(")\s*\n(\s*{)/g, "$1,\n$2"],
  ];
  for (let i = 0; i < 3; i += 1) {
    let changed = false;
    for (const [re, replacement] of insertionPatterns) {
      const next = text.replace(re, replacement);
      if (next !== text) {
        text = next;
        changed = true;
      }
    }
    text = text.replace(/,\s*([}\]])/g, "$1");
    if (!changed) break;
  }

  // Validate after repair.
  JSON.parse(text);
  return text;
}

function repairScreenshotJson() {
  const raw = String(DOM.screenshotClaudeOutput?.value || "").trim();
  if (!raw) {
    alert("Paste Claude JSON first.");
    return;
  }
  try {
    // If already parseable, just normalize formatting.
    const parsed = parseJsonLike(raw);
    const pretty = JSON.stringify(parsed, null, 2);
    DOM.screenshotClaudeOutput.value = pretty;
    getDay().screenshotClaudeOutput = pretty;
    saveState();
    renderScreenshotDecisionsPreview(parsed);
    renderWillCommentHandoffs(parsed);
    setClaudeHandoffStatus("JSON is valid. Normalized formatting applied.", "ok");
    return;
  } catch {
    // Continue to repair heuristically.
  }

  try {
    const repairedText = repairJsonLikeText(raw);
    DOM.screenshotClaudeOutput.value = repairedText;
    getDay().screenshotClaudeOutput = repairedText;
    saveState();
    const parsed = JSON.parse(repairedText);
    renderScreenshotDecisionsPreview(parsed);
    renderWillCommentHandoffs(parsed);
    setClaudeHandoffStatus("JSON repaired. Review quickly, then import.", "ok");
  } catch (error) {
    setClaudeHandoffStatus(`Repair could not fix this JSON (${error.message}). Ask Claude: 'Fix JSON syntax only; return valid JSON only.'`, "warn");
    alert("JSON repair could not fully fix this one. Ask Claude to repair syntax only, then paste again.");
  }
}

async function importScreenshotOutput() {
  const raw = DOM.screenshotClaudeOutput.value.trim();
  if (!raw) return;

  try {
    const parsed = parseJsonLike(raw);
    const noteLines = [];
    const dmLines = [];
    const mleLines = [];
    const followupLines = [];
    const mrBlueCommentLines = [];
    const guidedNapCommentLines = [];
    const willCommentLines = [];

    if (Array.isArray(parsed.target_notes)) {
      parsed.target_notes.forEach((t) => {
        const uiScore = normalizeTargetScoreForUi(t);
        noteLines.push(
          [
            t.platform || "Unknown",
            t.handle_or_name || "Unknown",
            t.country_or_language_clue || "",
            t.post_topic || "",
            t.quick_context ? `Context: ${t.quick_context}` : "",
            `Action: ${t.action_type || "unknown"}`,
            `Score: ${uiScore ?? "-"}/10`,
            `Need: ${t.what_they_seem_to_need || ""}`,
            `Hook: ${t.personalization_hook_story_angle || ""}`,
            `Commented: ${t.warm_status || "unknown"}`,
          ]
            .filter(Boolean)
            .join(" | ")
        );
      });
    }

    if (Array.isArray(parsed.comment_drafts)) {
      parsed.comment_drafts.forEach((c, i) => {
        const block = [
          `### Comment ${i + 1} (${c.persona || "Unknown"})`,
          normalizeNoEmDash(c.comment || ""),
          c.why_this_persona ? `Why: ${c.why_this_persona}` : "",
          "",
        ].filter(Boolean);
        const persona = String(c.persona || "").toLowerCase();
        if (persona.includes("mr blue")) mrBlueCommentLines.push(...block);
        else if (persona.includes("guided nap") || persona.includes("guiding bros")) guidedNapCommentLines.push(...block);
        else willCommentLines.push(...block);
      });
    }

    if (Array.isArray(parsed.outreach_dms)) {
      parsed.outreach_dms.forEach((d, i) => {
        const block = [];
        block.push(`### DM ${i + 1} (${d.channel || "Unknown"})`);
        block.push(normalizeNoEmDash(d.message || ""));
        if (d.personalization_hook_used) block.push(`Hook used: ${d.personalization_hook_used}`);
        if (d.spam_risk_check) block.push(`Spam check: ${d.spam_risk_check}${d.if_revise_why ? ` (${d.if_revise_why})` : ""}`);
        block.push("");

        const channel = String(d.channel || "").toLowerCase();
        if (channel.includes("mylanguageexchange") || channel === "mle") {
          mleLines.push(...block);
        } else {
          dmLines.push(...block);
        }
      });
    }

    if (Array.isArray(parsed.followups)) {
      parsed.followups.forEach((f, i) => {
        followupLines.push(`### Follow-up ${i + 1} (${f.stage || "Unknown"})`);
        followupLines.push(normalizeNoEmDash(f.message || ""));
        if (f.when_to_send) followupLines.push(`When: ${f.when_to_send}`);
        if (f.condition) followupLines.push(`Condition: ${f.condition}`);
        followupLines.push("");
      });
    }

    if (noteLines.length) {
      const existing = DOM.contextNotes.value.trim();
      DOM.contextNotes.value = [existing, ...noteLines].filter(Boolean).join("\n\n");
      getDay().drafts.contextNotes = DOM.contextNotes.value;
    }
    if (dmLines.length) {
      const existing = DOM.outreachDrafts.value.trim();
      DOM.outreachDrafts.value = [existing, ...dmLines].filter(Boolean).join("\n\n");
      getDay().drafts.outreachDrafts = DOM.outreachDrafts.value;
    }
    if (mleLines.length) {
      const existing = DOM.mleDrafts.value.trim();
      DOM.mleDrafts.value = [existing, ...mleLines].filter(Boolean).join("\n\n");
      getDay().drafts.mleDrafts = DOM.mleDrafts.value;
    }
    if (followupLines.length) {
      const existing = DOM.conversionDrafts.value.trim();
      DOM.conversionDrafts.value = [existing, ...followupLines].filter(Boolean).join("\n\n");
      getDay().drafts.conversionDrafts = DOM.conversionDrafts.value;
    }
    if (mrBlueCommentLines.length) {
      const existing = DOM.mrBlueDrafts.value.trim();
      DOM.mrBlueDrafts.value = [existing, ...mrBlueCommentLines].filter(Boolean).join("\n\n");
      getDay().drafts.mrBlueDrafts = DOM.mrBlueDrafts.value;
    }
    if (guidedNapCommentLines.length) {
      const existing = DOM.guidedNapDrafts.value.trim();
      DOM.guidedNapDrafts.value = [existing, ...guidedNapCommentLines].filter(Boolean).join("\n\n");
      getDay().drafts.guidedNapDrafts = DOM.guidedNapDrafts.value;
    }
    if (willCommentLines.length) {
      const existingWillComments = DOM.willCommentDrafts.value.trim();
      DOM.willCommentDrafts.value = [existingWillComments, ...willCommentLines].filter(Boolean).join("\n\n");
      getDay().drafts.willCommentDrafts = DOM.willCommentDrafts.value;

      const existing = DOM.contextNotes.value.trim();
      DOM.contextNotes.value = [existing, "Will comment ideas:", ...willCommentLines].filter(Boolean).join("\n\n");
      getDay().drafts.contextNotes = DOM.contextNotes.value;
    }
    saveState();
    renderScreenshotDecisionsPreview(parsed);
    renderWillCommentHandoffs(parsed);
    renderMleDmQa();
    await queueImportedScreenshotAnalysis(parsed);
    alert("Imported screenshot notes, action types/scores, DMs/comments, and follow-ups into the draft fields.");
  } catch (error) {
    const existing = DOM.contextNotes.value.trim();
    DOM.contextNotes.value = [existing, DOM.screenshotClaudeOutput.value.trim()].filter(Boolean).join("\n\n");
    getDay().drafts.contextNotes = DOM.contextNotes.value;
    saveState();
    alert(`Could not parse JSON (${error?.message || "unknown error"}). Pasted raw screenshot output into Context Notes instead.`);
  }
}

function splitNonEmptyLines(text) {
  return text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildClaudePack() {
  const day = getDay();
  const rotation = getRotationForDate(currentDateKey);
  const commentMode = getCommentModeForDate(currentDateKey);
  const week = getDistributionWeek(currentDateKey);

  const brandPackResult = tryParseBrandPack();
  const brandPackSummary = brandPackResult.ok ? buildBrandPackSummary(brandPackResult.parsed) : null;
  const payload = {
    role: "writing_copilot_only",
    date: currentDateKey,
    today: {
      outreachSource: rotation?.outreach || null,
      distributionFocus: rotation?.distribution || null,
      commentMode: commentMode.mode,
      commentTargetTotal: commentMode.totalPerDay,
      commentSplit: commentMode.split,
      distributionWeek: week?.name || null,
    },
    constraints: {
      humanInTheLoop: true,
      doNotAutomatePostingOrDms: true,
      avoidSpammyLanguage: true,
      personalizeFromRealPost: true,
      oneFollowUpMaxWithoutReply: true,
      mleSafeDailyVolume: "3-5 DMs/day max, spaced across the day",
      mleSprintCadence: "4-week sprint, then evaluate",
      noLinksInDms: true,
      dontDmSamePersonTwiceIfNoReply: true,
      mrBlueSignature: "🔵🔵🔵",
      guidedNapNoEmojiSignature: true,
      noPromotionalComments: true,
    },
    brandPackLoaded: Boolean(brandPackSummary),
    brandPackSummary,
    contextNotes: splitNonEmptyLines(day.drafts.contextNotes),
    requestedOutputs: {
      outreachDms: 5,
      myLanguageExchangeMessages: "5-8",
      mrBlueComments: commentMode.mode === "SPRINT" ? "20 target" : "5 target",
      guidedNapComments: commentMode.mode === "SPRINT" ? "20 target" : "5 target",
      captions: "TikTok + YouTube caption/description variants as needed",
      followUps: "Conversion + post-class follow-ups",
    },
    existingDraftsToImprove: {
      outreach: splitNonEmptyLines(day.drafts.outreachDrafts),
      willCommentReplies: splitNonEmptyLines(day.drafts.willCommentDrafts || ""),
      mle: splitNonEmptyLines(day.drafts.mleDrafts),
      conversion: splitNonEmptyLines(day.drafts.conversionDrafts),
      mrBlue: splitNonEmptyLines(day.drafts.mrBlueDrafts),
      guidedNap: splitNonEmptyLines(day.drafts.guidedNapDrafts),
      captions: splitNonEmptyLines(day.drafts.captionDrafts),
    },
    safetyNotes: splitNonEmptyLines(day.drafts.safetyNotes),
    outputFormat: {
      preferred: "JSON",
      schema: {
        outreach_dms: [{ target: "", channel: "", message: "", personalization_hook: "" }],
        mle_messages: [{ message: "", angle: "" }],
        mr_blue_comments: [{ target_creator: "", search_term: "", comment: "" }],
        guided_nap_comments: [{ target_creator: "", search_term: "", comment: "" }],
        captions: [{ brand: "", platform: "", title_or_hook: "", caption: "", hashtags: [] }],
        followups: [{ stage: "", message: "" }],
        spam_risk_flags: [{ item: "", reason: "", safer_version: "" }],
      },
    },
  };

  const prompt = [
    "Use you as a writing copilot only. Draft content for my daily playbook.",
    "Do not propose automating posting, sending DMs, or anything that looks like bot behavior.",
    "Match my voice, avoid generic phrasing, and flag anything spammy.",
    "Do not use em dashes (—/–) in messages or comments; use commas or periods instead.",
    "Output JSON matching the schema below, then a short plain-language paste order.",
  ].join(" ");

  return `${prompt}\n\n${JSON.stringify(payload, null, 2)}`;
}

function bindPerformanceForm() {
  DOM.performanceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const day = getDay();
    const record = {
      id: cryptoRandomId(),
      createdAt: new Date().toISOString(),
      channel: DOM.perfChannel.value,
      character: DOM.perfCharacter.value,
      account: DOM.perfAccount.value.trim(),
      topic: DOM.perfTopic.value.trim(),
      likes: Number(DOM.perfLikes.value || 0),
      replies: Number(DOM.perfReplies.value || 0),
      outcome: DOM.perfOutcome.value.trim(),
    };
    if (!record.account || !record.topic) return;
    day.performanceRecords.unshift(record);
    saveState();
    DOM.performanceForm.reset();
    DOM.perfLikes.value = 0;
    DOM.perfReplies.value = 0;
    renderPerformanceTable();
    renderAnalytics();
  });
}

function renderPerformanceTable() {
  const records = getDay().performanceRecords || [];
  if (!records.length) {
    DOM.performanceTableWrap.innerHTML = `<p class="muted">No records yet. Log the posts/accounts that generate visibility and engagement.</p>`;
    return;
  }
  DOM.performanceTableWrap.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Channel</th>
            <th>Character</th>
            <th>Account</th>
            <th>Topic</th>
            <th>Likes</th>
            <th>Replies</th>
            <th>Outcome</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${records
            .map(
              (rec) => `
            <tr>
              <td>${escapeHtml(rec.channel)}</td>
              <td>${escapeHtml(rec.character)}</td>
              <td>${escapeHtml(rec.account)}</td>
              <td>${escapeHtml(rec.topic)}</td>
              <td>${escapeHtml(String(rec.likes))}</td>
              <td>${escapeHtml(String(rec.replies))}</td>
              <td>${escapeHtml(rec.outcome || "")}</td>
              <td><button class="delete-btn" data-record-id="${rec.id}" type="button">Delete</button></td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>`;

  DOM.performanceTableWrap.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const day = getDay();
      day.performanceRecords = day.performanceRecords.filter((rec) => rec.id !== btn.dataset.recordId);
      saveState();
      renderPerformanceTable();
      renderAnalytics();
    });
  });
}

function cryptoRandomId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeHtmlAttr(value) {
  return escapeHtml(value);
}

function bindTopLevelControls() {
  DOM.datePicker.addEventListener("change", () => {
    currentDateKey = DOM.datePicker.value;
    ensureTodayBindings();
    renderAll();
    saveState();
  });

  DOM.commentMode.addEventListener("change", () => {
    getDay().commentModeOverride = DOM.commentMode.value;
    saveState();
    renderToday();
    renderAnalytics();
  });

  DOM.simpleModeToggle?.addEventListener("change", () => {
    state.simpleMode = DOM.simpleModeToggle.checked;
    saveState();
    applyUiMode();
  });

  DOM.contentToolsToggle?.addEventListener("change", () => {
    state.showContentTools = DOM.contentToolsToggle.checked;
    saveState();
    applyUiMode();
    renderToday();
  });

  DOM.resetDayBtn.addEventListener("click", () => {
    if (!window.confirm(`Reset all saved data for ${currentDateKey}?`)) return;
    state.days[currentDateKey] = defaultDayTemplate();
    saveState();
    ensureTodayBindings();
    renderAll();
  });

  DOM.dailyFlowSteps?.addEventListener("click", (event) => {
    const btn = event.target.closest?.("[data-scroll-target]");
    if (!btn) return;
    const target = document.getElementById(btn.dataset.scrollTarget || "");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  DOM.mleSequencer?.addEventListener("click", (event) => {
    const btn = event.target.closest?.("[data-mle-action]");
    if (!btn) return;
    const day = getDay();
    day.mleSequencer ||= { targetPerDay: 4, sentCount: 0 };
    const seq = day.mleSequencer;
    const action = btn.dataset.mleAction;
    if (action === "set-target") {
      seq.targetPerDay = clampNum(Number(btn.dataset.value || seq.targetPerDay || 4), 3, 5);
    } else if (action === "sent-plus") {
      seq.sentCount = Math.max(0, Number(seq.sentCount || 0) + 1);
    } else if (action === "sent-minus") {
      seq.sentCount = Math.max(0, Number(seq.sentCount || 0) - 1);
    } else if (action === "reset") {
      seq.sentCount = 0;
    }
    saveState();
    renderMleSequencer();
    renderDailyFlow();
  });

  DOM.tiktokSequencer?.addEventListener("click", (event) => {
    const btn = event.target.closest?.("[data-tiktok-action]");
    if (!btn) return;
    const day = getDay();
    day.tiktokSequencer ||= { targetPerDay: 7, sentCount: 0 };
    const seq = day.tiktokSequencer;
    const action = btn.dataset.tiktokAction;
    if (action === "set-target") {
      seq.targetPerDay = clampNum(Number(btn.dataset.value || seq.targetPerDay || 7), 5, 10);
    } else if (action === "sent-plus") {
      seq.sentCount = Math.max(0, Number(seq.sentCount || 0) + 1);
    } else if (action === "sent-minus") {
      seq.sentCount = Math.max(0, Number(seq.sentCount || 0) - 1);
    } else if (action === "reset") {
      seq.sentCount = 0;
    }
    saveState();
    renderTikTokSequencer();
  });
}

function renderAll() {
  applyUiMode();
  if (DOM.startVoiceNotesBtn) DOM.startVoiceNotesBtn.disabled = Boolean(voiceNotesListening);
  if (DOM.stopVoiceNotesBtn) DOM.stopVoiceNotesBtn.disabled = !voiceNotesListening;
  if (!voiceNotesListening && DOM.voiceNotesStatus && !DOM.voiceNotesStatus.textContent.trim()) {
    setVoiceNotesStatus("Voice note off", "info");
  }
  renderDailyFlow();
  renderMleSequencer();
  renderTikTokSequencer();
  renderReplyIntelResult();
  renderToday();
  renderTimeline();
  renderTimer();
  renderBrandPackStatus();
  renderScreenshotGallery();
  renderLinkContextPreview();
  renderScreenshotDecisionsPreviewFromRaw(DOM.screenshotClaudeOutput?.value || "");
  renderWillCommentHandoffsFromRaw(DOM.screenshotClaudeOutput?.value || "");
  renderMleDmQa();
  renderLeadRadarList();
  renderTikTokTracker();
  setClaudeHandoffStatus("Fallback flow: Generate prompt and use Claude Desktop if API credits are unavailable.", "info");
  setApiStatus("Primary flow: Analyze with Claude (API) for direct import. Fallback to manual Claude Desktop if needed.", "info");
  setLinkStatus("Use this for public links. For login-only pages (like MLE), use screenshots.", "info");
  if (!DOM.nextBestActionsList.innerHTML.trim()) renderNextBestActionsList([]);
  if (!DOM.pendingRemindersList.innerHTML.trim()) renderPendingRemindersList([]);
  setActionsStatus("Run `node server.js` to enable backend queue + reminders.", "info");
  if (DOM.contextHubSummary && !DOM.contextHubSummary.innerHTML.trim()) {
    renderContextHubSummary(null, "Click Refresh Hub Summary to load shared context details.");
  }
  renderAnalytics();
  renderPerformanceTable();
}

function renderDailyFlow() {
  if (!DOM.dailyFlowSteps) return;
  const day = getDay();
  const hasScreenshots = runtimeScreenshots.length > 0;
  const hasJson = Boolean(String(DOM.screenshotClaudeOutput?.value || "").trim());
  const parsedPreviewReady = (() => {
    try {
      if (!hasJson) return false;
      const parsed = parseJsonLike(DOM.screenshotClaudeOutput.value);
      return Array.isArray(parsed?.target_notes) && parsed.target_notes.length > 0;
    } catch {
      return false;
    }
  })();
  const hasSendDrafts =
    Boolean(String(day.drafts.mleDrafts || "").trim()) ||
    Boolean(String(day.drafts.outreachDrafts || "").trim()) ||
    Boolean(String(day.drafts.willCommentDrafts || "").trim());

  const steps = [
    {
      n: 1,
      title: "Capture",
      status: hasScreenshots ? "Done" : "Next",
      statusClass: hasScreenshots ? "done" : "next",
      checks: [
        `${hasScreenshots ? "✓" : "•"} Screenshot added (${runtimeScreenshots.length})`,
        "Paste profile/post screenshot (or use public link in Advanced mode)",
      ],
      actions: [
        { label: "Go to Screenshot Intake", target: "screenshotPanel" },
      ],
    },
    {
      n: 2,
      title: "Import",
      status: parsedPreviewReady ? "Done" : hasJson ? "Needs Import" : "Next",
      statusClass: parsedPreviewReady ? "done" : hasJson ? "warn" : "next",
      checks: [
        `${hasJson ? "✓" : "•"} Claude JSON pasted`,
        `${parsedPreviewReady ? "✓" : "•"} Decisions preview ready`,
        "Click Import to Context + DMs",
      ],
      actions: [
        { label: "Go to JSON Import", target: "screenshotPanel" },
      ],
    },
    {
      n: 3,
      title: "Send",
      status: hasSendDrafts ? "Ready" : "Waiting",
      statusClass: hasSendDrafts ? "done" : "next",
      checks: [
        `${day.drafts.willCommentDrafts?.trim() ? "✓" : "•"} FB/LinkedIn comment replies`,
        `${day.drafts.outreachDrafts?.trim() ? "✓" : "•"} Outreach DMs`,
        `${day.drafts.mleDrafts?.trim() ? "✓" : "•"} MLE messages`,
      ],
      actions: [
        { label: "Go to Draft Studio", target: "draftPanel" },
        { label: "Go to Handoff Panel", target: "willCommentHandoffList" },
      ],
    },
  ];

  DOM.dailyFlowSteps.innerHTML = `
    <div class="flow-grid">
      ${steps
        .map(
          (step) => `
        <article class="flow-card">
          <div class="flow-top">
            <div class="flow-num">${step.n}</div>
            <div>
              <h3>${escapeHtml(step.title)}</h3>
              <span class="mini-pill ${escapeHtml(step.statusClass)}">${escapeHtml(step.status)}</span>
            </div>
          </div>
          <div class="flow-checks">
            ${step.checks.map((c) => `<div>${escapeHtml(c)}</div>`).join("")}
          </div>
          <div class="button-row">
            ${step.actions
              .map(
                (a) => `<button type="button" class="ghost" data-scroll-target="${escapeHtmlAttr(a.target)}">${escapeHtml(a.label)}</button>`
              )
              .join("")}
          </div>
        </article>`
        )
        .join("")}
    </div>`;
}

function renderMleSequencer() {
  if (!DOM.mleSequencer) return;
  const day = getDay();
  day.mleSequencer ||= { targetPerDay: 4, sentCount: 0 };
  const seq = day.mleSequencer;
  const target = clampNum(Number(seq.targetPerDay || 4), 3, 5);
  const sent = Math.max(0, Number(seq.sentCount || 0));
  const remaining = Math.max(0, target - sent);

  const slots = ["09:30", "12:00", "14:30", "17:00", "19:30"].slice(0, target);
  const nextSlot = slots[Math.min(sent, slots.length - 1)] || slots[slots.length - 1] || null;

  DOM.mleSequencer.innerHTML = `
    <div class="flow-card">
      <div class="flow-top">
        <div class="flow-num">M</div>
        <div>
          <h3>MLE Sequencer</h3>
          <span class="mini-pill ${remaining > 0 ? "next" : "done"}">${remaining > 0 ? `${remaining} left today` : "Target hit"}</span>
        </div>
      </div>
      <div class="flow-checks">
        <div>Safe volume: <strong>3–5 DMs/day max</strong> (space them out)</div>
        <div>Target today: <strong>${target}</strong> | Sent: <strong>${sent}</strong></div>
        ${nextSlot && remaining > 0 ? `<div>Next suggested send window: <strong>${nextSlot}</strong></div>` : `<div>Done for today. Focus on replies / WhatsApp handoffs.</div>`}
      </div>
      <div class="flow-checks">
        ${slots
          .map(
            (slot, idx) => `<div>${idx < sent ? "✓" : "•"} ${slot}</div>`
          )
          .join("")}
      </div>
      <div class="button-row">
        <button type="button" class="ghost" data-mle-action="set-target" data-value="3">Target 3</button>
        <button type="button" class="ghost" data-mle-action="set-target" data-value="4">Target 4</button>
        <button type="button" class="ghost" data-mle-action="set-target" data-value="5">Target 5</button>
        <button type="button" data-mle-action="sent-plus">+1 Sent</button>
        <button type="button" class="ghost" data-mle-action="sent-minus">Undo</button>
        <button type="button" class="ghost" data-mle-action="reset">Reset</button>
      </div>
    </div>`;
}

function renderTikTokSequencer() {
  if (!DOM.tiktokSequencer) return;
  const day = getDay();
  day.tiktokSequencer ||= { targetPerDay: 7, sentCount: 0 };
  const seq = day.tiktokSequencer;
  const target = clampNum(Number(seq.targetPerDay || 7), 5, 10);
  const sent = Math.max(0, Number(seq.sentCount || 0));
  const remaining = Math.max(0, target - sent);
  const overRisk = sent >= 15;

  DOM.tiktokSequencer.innerHTML = `
    <div class="flow-card">
      <div class="flow-top">
        <div class="flow-num">T</div>
        <div>
          <h3>TikTok DM Sequencer</h3>
          <span class="mini-pill ${overRisk ? "warn" : remaining > 0 ? "next" : "done"}">${overRisk ? "Past 15, stop" : remaining > 0 ? `${remaining} left (target)` : "Target hit"}</span>
        </div>
      </div>
      <div class="flow-checks">
        <div>Operating range: <strong>5-10/day</strong> (qualified intent only)</div>
        <div>Hard ceiling: <strong>15/day</strong> to avoid mass-DM flags</div>
        <div>Sent today: <strong>${sent}</strong> | Target: <strong>${target}</strong></div>
      </div>
      <div class="button-row">
        <button type="button" class="ghost" data-tiktok-action="set-target" data-value="5">Target 5</button>
        <button type="button" class="ghost" data-tiktok-action="set-target" data-value="7">Target 7</button>
        <button type="button" class="ghost" data-tiktok-action="set-target" data-value="10">Target 10</button>
        <button type="button" data-tiktok-action="sent-plus">+1 Sent</button>
        <button type="button" class="ghost" data-tiktok-action="sent-minus">Undo</button>
        <button type="button" class="ghost" data-tiktok-action="reset">Reset</button>
      </div>
    </div>`;
}

function parseLeadRadarJson(raw) {
  const parsed = parseJsonLike(raw);
  const leads = Array.isArray(parsed?.leads) ? parsed.leads : [];
  return { parsed, leads };
}

function loadLeadRadarFromText() {
  const raw = String(DOM.leadRadarRawInput?.value || "").trim();
  if (!raw) {
    setLeadRadarStatus("Paste Lead Radar JSON first.", "warn");
    return;
  }
  try {
    const { leads } = parseLeadRadarJson(raw);
    const day = getDay();
    day.leadRadarRaw = raw;
    day.leadRadarLeads = leads.slice(0, 100);
    saveState();
    renderLeadRadarList();
    setLeadRadarStatus(`Loaded ${day.leadRadarLeads.length} lead(s).`, "ok");
  } catch (error) {
    setLeadRadarStatus(`Could not parse JSON: ${error.message}`, "warn");
  }
}

function clearLeadRadar() {
  const day = getDay();
  day.leadRadarRaw = "";
  day.leadRadarLeads = [];
  if (DOM.leadRadarRawInput) DOM.leadRadarRawInput.value = "";
  saveState();
  renderLeadRadarList();
  setLeadRadarStatus("Lead Radar cleared.", "ok");
}

function renderLeadRadarList() {
  if (!DOM.leadRadarList) return;
  const leads = Array.isArray(getDay().leadRadarLeads) ? getDay().leadRadarLeads : [];
  if (!leads.length) {
    DOM.leadRadarList.innerHTML = `<p class="muted-line">No radar leads loaded yet. Paste a JSON export and click <strong>Load Radar Leads</strong>.</p>`;
    return;
  }
  DOM.leadRadarList.innerHTML = `
    <div class="action-list">
      ${leads
        .slice()
        .sort((a, b) => Number(b.intent_score || 0) - Number(a.intent_score || 0))
        .slice(0, 20)
        .map((lead, idx) => {
          const score = Number(lead.intent_score || 0);
          const excerpt = String(lead.excerpt || lead.title || "").trim();
          const noteLine = [
            `RADAR-${String(lead.platform || "reddit").toUpperCase()}`,
            lead.subreddit ? `r/${lead.subreddit}` : "",
            lead.author ? `@${lead.author}` : "",
            `Intent ${score}/100`,
            excerpt,
          ].filter(Boolean).join(" | ");
          return `
            <article class="action-item">
              <div class="action-top">
                <div class="action-badges">
                  <span class="mini-pill ${score >= 75 ? "done" : "warn"}">Intent ${escapeHtml(String(score))}</span>
                  <span class="mini-pill">${escapeHtml(String(lead.platform || "reddit").toUpperCase())}</span>
                  ${lead.subreddit ? `<span class="mini-pill">${escapeHtml(`r/${lead.subreddit}`)}</span>` : ""}
                </div>
                <strong>${escapeHtml(lead.author || `lead-${idx + 1}`)}</strong>
              </div>
              ${lead.title ? `<div class="action-text">${escapeHtml(lead.title)}</div>` : ""}
              ${excerpt ? `<div class="action-draft">${escapeHtml(excerpt)}</div>` : ""}
              ${(lead.friction_signals || []).length ? `<div class="action-text">Signals: ${escapeHtml((lead.friction_signals || []).join(", "))}</div>` : ""}
              ${lead.url ? `<div class="action-buttons"><a class="ghost link-btn" href="${escapeHtmlAttr(lead.url)}" target="_blank" rel="noopener noreferrer">Open Link</a>` : `<div class="action-buttons">`}
                <button type="button" class="ghost" data-radar-copy="${escapeHtmlAttr(excerpt || lead.url || "")}">Copy Excerpt</button>
                <button type="button" class="ghost" data-radar-add-note="${escapeHtmlAttr(noteLine)}">Add to Context Notes</button>
              </div>
            </article>`;
        })
        .join("")}
    </div>`;
}

function addRadarLeadToContextNotes(noteLine) {
  const line = String(noteLine || "").trim();
  if (!line) return;
  const existing = DOM.contextNotes.value.trim();
  DOM.contextNotes.value = [existing, line].filter(Boolean).join(existing ? "\n" : "");
  getDay().drafts.contextNotes = DOM.contextNotes.value;
  saveState();
  setActionsStatus("Radar lead added to Context Notes.", "ok");
}

function getTikTokTrackerState(day = getDay()) {
  day.tiktokDmTracker ||= { items: [], draft: {}, editingId: null };
  day.tiktokDmTracker.items ||= [];
  day.tiktokDmTracker.draft ||= {};
  if (!("editingId" in day.tiktokDmTracker)) day.tiktokDmTracker.editingId = null;
  return day.tiktokDmTracker;
}

function setTikTokTrackerStatus(message, kind = "info") {
  if (!DOM.ttTrackerStatusLine) return;
  DOM.ttTrackerStatusLine.textContent = message;
  DOM.ttTrackerStatusLine.className = "muted-line";
  if (kind === "ok") DOM.ttTrackerStatusLine.classList.add("status-ok");
  if (kind === "warn") DOM.ttTrackerStatusLine.classList.add("status-warn");
  if (kind === "err") DOM.ttTrackerStatusLine.classList.add("status-err");
}

function readTikTokTrackerDraftFromInputs() {
  return {
    handle: String(DOM.ttHandle?.value || "").trim(),
    status: String(DOM.ttStatus?.value || "sent").trim() || "sent",
    videoUrl: String(DOM.ttVideoUrl?.value || "").trim(),
    screenshotRef: String(DOM.ttScreenshotRef?.value || "").trim(),
    objective: String(DOM.ttObjective?.value || "tester").trim() || "tester",
    hookType: normalizeNoEmDash(String(DOM.ttHookType?.value || "")).trim(),
    toneStyle: normalizeNoEmDash(String(DOM.ttToneStyle?.value || "")).trim(),
    ctaStrength: String(DOM.ttCtaStrength?.value || "").trim(),
    personaCluster: normalizeNoEmDash(String(DOM.ttPersonaCluster?.value || "")).trim(),
    replyLatencyDays: String(DOM.ttReplyLatencyDays?.value || "").trim(),
    firstDm: normalizeNoEmDash(String(DOM.ttFirstDm?.value || "")).trim(),
    reply: normalizeNoEmDash(String(DOM.ttReply?.value || "")).trim(),
    notes: normalizeNoEmDash(String(DOM.ttNotes?.value || "")).trim(),
  };
}

function persistTikTokTrackerDraftFromInputs() {
  const tracker = getTikTokTrackerState();
  tracker.draft = readTikTokTrackerDraftFromInputs();
  saveState();
}

function writeTikTokTrackerDraftToInputs(draft = {}) {
  if (DOM.ttHandle) DOM.ttHandle.value = draft.handle || "";
  if (DOM.ttStatus) DOM.ttStatus.value = draft.status || "sent";
  if (DOM.ttVideoUrl) DOM.ttVideoUrl.value = draft.videoUrl || "";
  if (DOM.ttScreenshotRef) DOM.ttScreenshotRef.value = draft.screenshotRef || "";
  if (DOM.ttObjective) DOM.ttObjective.value = draft.objective || "tester";
  if (DOM.ttHookType) DOM.ttHookType.value = draft.hookType || "";
  if (DOM.ttToneStyle) DOM.ttToneStyle.value = draft.toneStyle || "";
  if (DOM.ttCtaStrength) DOM.ttCtaStrength.value = draft.ctaStrength || "";
  if (DOM.ttPersonaCluster) DOM.ttPersonaCluster.value = draft.personaCluster || "";
  if (DOM.ttReplyLatencyDays) DOM.ttReplyLatencyDays.value = draft.replyLatencyDays ?? "";
  if (DOM.ttFirstDm) DOM.ttFirstDm.value = draft.firstDm || "";
  if (DOM.ttReply) DOM.ttReply.value = draft.reply || "";
  if (DOM.ttNotes) DOM.ttNotes.value = draft.notes || "";
}

function clearTikTokTrackerDraft() {
  const tracker = getTikTokTrackerState();
  tracker.draft = {
    handle: "",
    status: "sent",
    videoUrl: "",
    screenshotRef: "",
    objective: "tester",
    hookType: "",
    toneStyle: "",
    ctaStrength: "",
    personaCluster: "",
    replyLatencyDays: "",
    firstDm: "",
    reply: "",
    notes: "",
  };
  tracker.editingId = null;
  writeTikTokTrackerDraftToInputs(tracker.draft);
  saveState();
  renderTikTokTracker();
  setTikTokTrackerStatus("Tracker form cleared.", "ok");
}

function useLatestScreenshotRefForTikTokTracker() {
  if (!runtimeScreenshots.length) {
    setTikTokTrackerStatus("No screenshots loaded in Prospect Capture yet.", "warn");
    return;
  }
  const latest = runtimeScreenshots[runtimeScreenshots.length - 1];
  if (DOM.ttScreenshotRef) DOM.ttScreenshotRef.value = latest.name || "";
  persistTikTokTrackerDraftFromInputs();
  setTikTokTrackerStatus(`Added screenshot ref: ${latest.name}`, "ok");
}

function buildTikTokTrackerRecordLabel(item) {
  return [item.handle || "unknown", item.status || "sent", item.screenshotRef || ""].filter(Boolean).join(" | ");
}

function saveTikTokTrackerEntry() {
  const tracker = getTikTokTrackerState();
  const draft = readTikTokTrackerDraftFromInputs();
  if (!draft.handle && !draft.videoUrl && !draft.firstDm) {
    setTikTokTrackerStatus("Add at least a handle, video URL, or first DM before saving.", "warn");
    return;
  }

  const nowIso = new Date().toISOString();
  const next = {
    ...draft,
    handle: draft.handle.replace(/^@+/, "@"),
    replyLatencyDays: draft.replyLatencyDays === "" ? "" : Number(draft.replyLatencyDays),
  };

  if (tracker.editingId) {
    const idx = tracker.items.findIndex((it) => it.id === tracker.editingId);
    if (idx === -1) {
      tracker.editingId = null;
    } else {
      const prev = tracker.items[idx];
      tracker.items[idx] = {
        ...prev,
        ...next,
        updatedAt: nowIso,
        lastTouchAt: nowIso,
      };
      tracker.draft = { ...next };
      saveState();
      renderTikTokTracker();
      setTikTokTrackerStatus(`Updated TikTok record: ${buildTikTokTrackerRecordLabel(tracker.items[idx])}`, "ok");
      return;
    }
  }

  const newItem = {
    id: cryptoRandomId(),
    handle: next.handle || "",
    status: next.status || "sent",
    videoUrl: next.videoUrl || "",
    screenshotRef: next.screenshotRef || "",
    objective: next.objective || "tester",
    hookType: next.hookType || "",
    toneStyle: next.toneStyle || "",
    ctaStrength: next.ctaStrength || "",
    personaCluster: next.personaCluster || "",
    replyLatencyDays:
      next.replyLatencyDays === "" || Number.isNaN(Number(next.replyLatencyDays)) ? "" : Number(next.replyLatencyDays),
    firstDm: next.firstDm || "",
    reply: next.reply || "",
    notes: next.notes || "",
    createdAt: nowIso,
    updatedAt: nowIso,
    lastTouchAt: nowIso,
  };
  tracker.items.unshift(newItem);
  tracker.draft = { ...next };
  tracker.editingId = null;
  saveState();
  renderTikTokTracker();
  setTikTokTrackerStatus(`Saved TikTok record: ${buildTikTokTrackerRecordLabel(newItem)}`, "ok");
}

function startEditTikTokTrackerItem(id) {
  const tracker = getTikTokTrackerState();
  const item = tracker.items.find((it) => it.id === id);
  if (!item) return;
  tracker.editingId = id;
  tracker.draft = {
    handle: item.handle || "",
    status: item.status || "sent",
    videoUrl: item.videoUrl || "",
    screenshotRef: item.screenshotRef || "",
    objective: item.objective || "tester",
    hookType: item.hookType || "",
    toneStyle: item.toneStyle || "",
    ctaStrength: item.ctaStrength || "",
    personaCluster: item.personaCluster || "",
    replyLatencyDays: item.replyLatencyDays ?? "",
    firstDm: item.firstDm || "",
    reply: item.reply || "",
    notes: item.notes || "",
  };
  writeTikTokTrackerDraftToInputs(tracker.draft);
  saveState();
  renderTikTokTracker();
  try {
    DOM.ttHandle?.scrollIntoView({ behavior: "smooth", block: "center" });
    DOM.ttHandle?.focus();
  } catch {}
  setTikTokTrackerStatus(`Editing ${item.handle || "TikTok record"}.`, "ok");
}

function updateTikTokTrackerStatus(id, status) {
  const tracker = getTikTokTrackerState();
  const item = tracker.items.find((it) => it.id === id);
  if (!item) return;
  item.status = status;
  item.updatedAt = new Date().toISOString();
  item.lastTouchAt = item.updatedAt;
  saveState();
  renderTikTokTracker();
  setTikTokTrackerStatus(`Status updated to ${status} for ${item.handle || "record"}.`, "ok");
}

function deleteTikTokTrackerItem(id) {
  const tracker = getTikTokTrackerState();
  const item = tracker.items.find((it) => it.id === id);
  tracker.items = tracker.items.filter((it) => it.id !== id);
  if (tracker.editingId === id) tracker.editingId = null;
  saveState();
  renderTikTokTracker();
  setTikTokTrackerStatus(`Deleted ${item?.handle || "TikTok record"}.`, "ok");
}

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function exportTikTokTrackerCsv() {
  const items = getTikTokTrackerState().items || [];
  if (!items.length) {
    setTikTokTrackerStatus("No TikTok records to export yet.", "warn");
    return;
  }
  const header = [
    "date_key",
    "handle",
    "status",
    "video_url",
    "screenshot_ref",
    "objective",
    "hook_type",
    "tone_style",
    "cta_strength",
    "persona_cluster",
    "reply_latency_days",
    "first_dm",
    "reply",
    "notes",
    "created_at",
    "updated_at",
    "last_touch_at",
  ];
  const rows = items.map((it) => [
    currentDateKey,
    it.handle || "",
    it.status || "",
    it.videoUrl || "",
    it.screenshotRef || "",
    it.objective || "",
    it.hookType || "",
    it.toneStyle || "",
    it.ctaStrength || "",
    it.personaCluster || "",
    it.replyLatencyDays ?? "",
    it.firstDm || "",
    it.reply || "",
    it.notes || "",
    it.createdAt || "",
    it.updatedAt || "",
    it.lastTouchAt || "",
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  downloadTextFile(`tiktok-dm-tracker-${currentDateKey}.csv`, csv, "text/csv;charset=utf-8");
  setTikTokTrackerStatus(`Exported ${items.length} TikTok record(s) to CSV.`, "ok");
}

function renderTikTokTracker() {
  if (!DOM.ttTrackerList) return;
  const tracker = getTikTokTrackerState();
  const items = Array.isArray(tracker.items) ? tracker.items : [];
  const counts = items.reduce((acc, it) => {
    const key = String(it.status || "sent");
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const converted = counts.converted || 0;
  const replied = (counts.replied || 0) + (counts.tester || 0) + (counts.whatsapp || 0) + converted;

  if (DOM.ttTrackerSummary) {
    DOM.ttTrackerSummary.innerHTML = `
      <div class="analytics">
        <div class="analytics-row"><span>Total tracked</span><span>${items.length}</span></div>
        <div class="analytics-row"><span>Replies / engaged</span><span>${replied}</span></div>
        <div class="analytics-row"><span>WhatsApp</span><span>${counts.whatsapp || 0}</span></div>
        <div class="analytics-row"><span>Converted</span><span>${converted}</span></div>
      </div>`;
  }

  if (!items.length) {
    DOM.ttTrackerList.innerHTML = `<p class="muted-line">No TikTok DM records yet. Add your first outreach record above.</p>`;
    if (!DOM.ttTrackerStatusLine?.textContent?.trim()) setTikTokTrackerStatus("No TikTok records yet.", "info");
    if (DOM.ttSaveEntryBtn) DOM.ttSaveEntryBtn.textContent = "Add TikTok Record";
    return;
  }

  if (DOM.ttSaveEntryBtn) DOM.ttSaveEntryBtn.textContent = tracker.editingId ? "Update TikTok Record" : "Add TikTok Record";

  DOM.ttTrackerList.innerHTML = `
    <div class="action-list">
      ${items
        .slice()
        .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime())
        .slice(0, 50)
        .map((item) => {
          const statusClass = String(item.status || "sent").toLowerCase().replace("_", "-");
          const metaPills = [
            item.objective ? `Obj: ${item.objective}` : "",
            item.hookType ? `Hook: ${item.hookType}` : "",
            item.toneStyle ? `Tone: ${item.toneStyle}` : "",
            item.ctaStrength ? `CTA: ${item.ctaStrength}` : "",
            item.replyLatencyDays !== "" && item.replyLatencyDays != null ? `Latency: ${item.replyLatencyDays}d` : "",
          ].filter(Boolean);
          return `
            <article class="action-item tracker-item" data-tt-id="${escapeHtmlAttr(item.id)}">
              <div class="action-top">
                <div class="action-badges">
                  <span class="mini-pill ${escapeHtml(statusClass)}">${escapeHtml(item.status || "sent")}</span>
                  <span class="mini-pill">TikTok</span>
                </div>
                <strong>${escapeHtml(item.handle || "Unknown handle")}</strong>
              </div>
              ${metaPills.length ? `<div class="action-badges">${metaPills.map((pill) => `<span class="mini-pill">${escapeHtml(pill)}</span>`).join("")}</div>` : ""}
              ${item.personaCluster ? `<div class="action-text"><strong>Persona:</strong> ${escapeHtml(item.personaCluster)}</div>` : ""}
              ${item.screenshotRef ? `<div class="action-text">Screenshot: ${escapeHtml(item.screenshotRef)}</div>` : ""}
              ${item.videoUrl ? `<div class="action-text">Video: <a class="link-btn-inline" href="${escapeHtmlAttr(item.videoUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.videoUrl)}</a></div>` : ""}
              ${item.firstDm ? `<div class="action-draft">${escapeHtml(item.firstDm)}</div>` : ""}
              ${item.reply ? `<div class="action-text"><strong>Reply:</strong> ${escapeHtml(item.reply)}</div>` : ""}
              ${item.notes ? `<div class="action-text"><strong>Notes:</strong> ${escapeHtml(item.notes)}</div>` : ""}
              <div class="action-text">Updated: ${escapeHtml(new Date(item.updatedAt || item.createdAt || Date.now()).toLocaleString())}</div>
              <div class="action-buttons">
                <button type="button" class="ghost" data-tt-action="edit" data-tt-id="${escapeHtmlAttr(item.id)}">Edit</button>
                <button type="button" class="ghost" data-tt-action="copy-dm" data-tt-text="${escapeHtmlAttr(item.firstDm || "")}">Copy DM</button>
                <button type="button" class="ghost" data-tt-action="mark" data-tt-id="${escapeHtmlAttr(item.id)}" data-status="replied">Mark Replied</button>
                <button type="button" class="ghost" data-tt-action="mark" data-tt-id="${escapeHtmlAttr(item.id)}" data-status="whatsapp">WhatsApp</button>
                <button type="button" class="ghost" data-tt-action="mark" data-tt-id="${escapeHtmlAttr(item.id)}" data-status="converted">Converted</button>
                <button type="button" class="delete-btn" data-tt-action="delete" data-tt-id="${escapeHtmlAttr(item.id)}">Delete</button>
              </div>
            </article>`;
        })
        .join("")}
    </div>`;
}

function applyUiMode() {
  const simple = state.simpleMode !== false;
  const showContentTools = state.showContentTools === true;
  document.body.classList.toggle("simple-mode", simple);
  document.body.classList.toggle("show-content-tools", showContentTools);
}

function seedDefaultsForNewDay() {
  const day = getDay();
  if (!day.drafts.safetyNotes) {
    day.drafts.safetyNotes = [
      "Reference the person’s actual post/comment in every DM.",
      "No identical mass messages.",
      "One follow-up max unless they reply.",
      "TikTok AI-edited/AI-generated posts: use native posting path and set AIGC label.",
    ].join("\n");
  }
  saveState();
}

async function bootstrapBackendV11() {
  const online = await checkBackendHealth();
  if (!online) {
    setActionsStatus("Backend offline. Brand pack + queue + reminders are local UI only until `node server.js` is running.", "warn");
    renderNextBestActionsList([]);
    renderPendingRemindersList([]);
    if (state.contextHubPath && DOM.contextHubPathInput) DOM.contextHubPathInput.value = state.contextHubPath;
    return;
  }

  await loadContextHubSettings();
  await refreshContextHubSummary();
  try {
    await apiJson("/api/migrate-brand-pack", { method: "POST", body: JSON.stringify({}) });
  } catch {
    // Non-fatal; continue.
  }
  await loadGlobalBrandPackFromBackend();
  await refreshNextBestActionsAndReminders();
}

function init() {
  if (!state.days[currentDateKey]) {
    getDay(currentDateKey);
  }
  initTimerTaskSelect();
  bindTopLevelControls();
  bindDraftInputs();
  bindBrandPackAndScreenshots();
  bindMetricInputs();
  bindReplyIntel();
  bindClaudePack();
  bindPerformanceForm();
  ensureTodayBindings();
  seedDefaultsForNewDay();
  ensureTodayBindings();
  renderAll();
  restoreTimerIfNeeded();
  void bootstrapBackendV11();
}

init();
