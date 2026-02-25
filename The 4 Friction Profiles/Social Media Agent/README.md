# Daily Operator Copilot (V1)

Local, human-in-the-loop workflow tool for your `THE DAILY PLAYBOOK`.

## What this V1 does

- Shows your daily blocks and tasks (Outreach, Distribution, Teaching, Bug Fixes, Content)
- Applies your weekly rotation automatically based on the selected date
- Tracks TikTok commenting mode (`SPRINT` vs `MAINTENANCE`) from your sprint calendar
- Gives you a focus timer for each task
- Stores draft queues for:
  - outreach DMs
  - MyLanguageExchange messages
  - Mr Blue comments
  - Guided Nap comments
  - captions/descriptions
- Generates a structured `Claude Pack` prompt + JSON (writing copilot only)
- Generates a `Claude Desktop screenshot handoff` (prompt + downloadable JSON package)
- Logs daily outcomes and comment-performance records
- Saves everything locally in browser `localStorage`

## What this V1 intentionally does NOT do

- Auto-send DMs
- Auto-post to TikTok / Instagram / YouTube
- Browser bot actions that could look like spam / bot activity

This is by design for platform safety and quality control.

## Run it

You can open `index.html` directly in your browser, or use a local server.

## Run with screenshot reading (recommended)

This enables the local backend (`server.js`) so the app can analyze screenshots using your Gemini/Claude API keys from `.env`.

```bash
node server.js
```

Then open:

- `http://127.0.0.1:8000`
- or `http://localhost:8000`

## Saved link vs running server (important)

- Saved link (example `http://localhost:8501`) only remembers the address
- Running server (example `streamlit run ...` or `node server.js`) actually turns the app on
- If the server is not running, the saved link will show `connection refused`

Optional health check:

- `http://127.0.0.1:8000/api/health`

## Run UI only (no screenshot API)

Simple local server (Python built-in):

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000`

## Next steps (V2 ideas)

- CSV export for daily logs / performance records
- Import structured Claude JSON responses into the draft fields
- IG + YouTube posting integration (official APIs)
- Safer browser assist mode (open tabs/checklists only, no unattended posting)
