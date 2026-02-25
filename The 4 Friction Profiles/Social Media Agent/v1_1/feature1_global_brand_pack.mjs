import { readJsonFile, writeJsonFile } from "./state/json_store.mjs";
import { STATE_PATHS } from "./state/paths.mjs";

export const GLOBAL_BRAND_PACK_REF = {
  type: "json_file",
  path: "data/global_brand_pack.json",
};

export const DEFAULT_DAILY_PLAYBOOK_STATE_V1_1 = {
  schemaVersion: "1.1",
  brandPackRef: GLOBAL_BRAND_PACK_REF,
  selectedDate: null,
  days: {},
  nextBestActionQueueRef: {
    type: "json_file",
    path: "data/next_best_actions.json",
  },
  remindersRef: {
    type: "json_file",
    path: "data/reminders.json",
  },
};

export async function readGlobalBrandPack() {
  return readJsonFile(STATE_PATHS.globalBrandPack, null);
}

export async function writeGlobalBrandPack(brandPack) {
  if (!brandPack || typeof brandPack !== "object" || Array.isArray(brandPack)) {
    throw new TypeError("brandPack must be a JSON object");
  }
  return writeJsonFile(STATE_PATHS.globalBrandPack, brandPack);
}

export async function loadDailyPlaybookState() {
  const state = await readJsonFile(STATE_PATHS.dailyPlaybook, null);
  if (!state) {
    return structuredClone(DEFAULT_DAILY_PLAYBOOK_STATE_V1_1);
  }

  // Normalize V1.1 references if missing.
  return {
    ...DEFAULT_DAILY_PLAYBOOK_STATE_V1_1,
    ...state,
    brandPackRef: state.brandPackRef || GLOBAL_BRAND_PACK_REF,
    nextBestActionQueueRef:
      state.nextBestActionQueueRef || DEFAULT_DAILY_PLAYBOOK_STATE_V1_1.nextBestActionQueueRef,
    remindersRef: state.remindersRef || DEFAULT_DAILY_PLAYBOOK_STATE_V1_1.remindersRef,
  };
}

export async function saveDailyPlaybookState(state) {
  const normalized = {
    ...DEFAULT_DAILY_PLAYBOOK_STATE_V1_1,
    ...state,
    schemaVersion: "1.1",
    brandPackRef: GLOBAL_BRAND_PACK_REF,
  };
  return writeJsonFile(STATE_PATHS.dailyPlaybook, normalized);
}

/**
 * Migrates a legacy daily state that stores `brandPackJson` inside each day.
 * Strategy:
 * - Find the first valid day.brandPackJson and store it as global brand pack.
 * - Remove duplicated day.brandPackJson from all days.
 * - Add `brandPackRef` to root state.
 */
export async function migrateDailyStateBrandPackToGlobal() {
  const state = await loadDailyPlaybookState();
  let globalBrandPack = await readGlobalBrandPack();
  let migratedBrandPack = false;

  const nextDays = {};
  for (const [dateKey, day] of Object.entries(state.days || {})) {
    const nextDay = { ...day };
    const rawBrandPack = typeof nextDay.brandPackJson === "string" ? nextDay.brandPackJson.trim() : "";

    if (!globalBrandPack && rawBrandPack) {
      try {
        globalBrandPack = JSON.parse(rawBrandPack);
        await writeGlobalBrandPack(globalBrandPack);
        migratedBrandPack = true;
      } catch {
        // Ignore invalid per-day brand pack strings; keep daily state untouched for that field below.
      }
    }

    if ("brandPackJson" in nextDay) {
      delete nextDay.brandPackJson;
    }

    nextDays[dateKey] = nextDay;
  }

  const nextState = {
    ...state,
    schemaVersion: "1.1",
    brandPackRef: GLOBAL_BRAND_PACK_REF,
    days: nextDays,
  };

  await saveDailyPlaybookState(nextState);

  return {
    ok: true,
    migratedBrandPack,
    hasGlobalBrandPack: Boolean(globalBrandPack),
    daysProcessed: Object.keys(nextDays).length,
    brandPackRef: GLOBAL_BRAND_PACK_REF,
  };
}

