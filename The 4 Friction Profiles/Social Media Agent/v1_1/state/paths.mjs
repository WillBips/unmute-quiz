import path from "node:path";

export const DATA_DIR = path.resolve(process.cwd(), "data");

export const STATE_PATHS = {
  dailyPlaybook: path.join(DATA_DIR, "daily_playbook_state.json"),
  globalBrandPack: path.join(DATA_DIR, "global_brand_pack.json"),
  nextBestActions: path.join(DATA_DIR, "next_best_actions.json"),
  reminders: path.join(DATA_DIR, "reminders.json"),
};

