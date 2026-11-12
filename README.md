# Prep Tracker

A small, calm, no-build progress tracker for a 16-week fresher job hunt (16 Nov 2026 → 7 Mar 2027).
Plain HTML + CSS + vanilla JS. No React, no npm.

## Run it

Double-click `index.html`, or serve the folder:

```bash
python3 -m http.server 5178 --directory prep-tracker
```

Then open http://localhost:5178.

## What's inside

| Page | What it does |
|---|---|
| Dashboard | Week x of 16, days left, current phase, "right now" block, streak, progress rings, consistency heatmap, upcoming deadlines, DSA problems due for revision |
| Today | Minimum-day checklist, counters (DSA, applications, referrals, interviews), mood, hours, notes, that day's timetable. Use the arrows or date picker to edit any day |
| DSA sheet | NeetCode 150 by pattern, ordered by phase. ★ = core. ↻ = bring it back for revision in N days. Notes per problem. Search and filters |
| JS & machine coding | Polyfills/utilities + 90-minute React builds, with a one-click 90-min timer |
| Interview topics | Rate each topic: Not started / Shaky / Okay / Ready |
| Projects | Milestones with due dates (Naukri fixes, polishing projects, flagship v2) + phase deadlines |
| Job hunt | Application pipeline with status, source, link, notes, response rate |
| Weekly review | Weekly totals vs targets + a "what went well / what to fix" note per week |
| Resources | Your saved sites, grouped |
| Settings | Dates, targets, minimum day, theme (system/light/dark), 6 accent colours, density, show/hide sections, timetable, weekly rotation, phases & deadlines, export/import/reset |

Everything is customisable: press **Customise** on any list page to rename, edit or delete items and groups, or use **+ Add** to add your own.
Deleting or ticking something shows an **Undo** button for 5 seconds.

**Learning links on every item:** 📖 Learn (exact MDN / javascript.info / react.dev page where one exists, otherwise a Google
`site:` search of trusted docs), 🧩 Practice (BigFrontEnd / GreatFrontEnd search for JS and machine coding), ▶ Video
(YouTube search; DSA uses "neetcode <problem>"). Change a group's search with **Customise → Edit group & links**, or give an
item its own Learn link with its edit button. Exact links live in `js/data.js` → `docs`.

**Design styles:** Settings → Design style: **Mono** (minimal black/white, Geist font, default) or **Calm** (soft warm, sage).
Both have light and dark modes; the moon button in the sidebar switches quickly.

## Fast ways to use it

| Where | What |
|---|---|
| Dashboard quick buttons | One tap: +1 DSA / application / referral / interview, project 30 min |
| **+** button (bottom right) or `N` | Quick actions sheet, plus your next problem to solve |
| `Ctrl/⌘ + K` or `/` | Search anything: pages, actions, any problem ("tree", "debounce"…) and mark it done |
| `1`–`9`, `0` | Jump to a page (0 = Settings) |
| `A` / `R` / `T` | +1 application / +1 referral / go to Today |
| Phone | Bottom tab bar: Home, Today, DSA, Job hunt, More |

## Install on your phone

Once it's deployed (below), open the URL on your phone:
- **Android (Chrome):** menu ⋮ → *Install app* / *Add to Home screen*
- **iPhone (Safari):** Share → *Add to Home Screen*

It then opens full-screen like an app and works offline.

## Deploy (Vercel, free)

```bash
vercel login
```

```bash
cd prep-tracker && vercel --prod
```

The first run asks a few questions: accept the defaults and pick a project name such as `prep-tracker`.
You get a URL like `https://prep-tracker-xxxx.vercel.app`. Run the same `vercel --prod` command again after any change.
If you change files, bump `VERSION` in `sw.js` so installed copies refresh their offline cache.

Alternatives: drag the `prep-tracker` folder onto https://app.netlify.com/drop, or push it to GitHub and enable GitHub Pages.

## Your data

Saved in your browser's localStorage only (key `prep-tracker-v1`). Clearing site data deletes it, so use
**Settings → Export backup** every week (the dashboard reminds you after 7 days). To change the default content before first run, edit `js/data.js`.

Each browser/device has its own copy: your laptop and phone do **not** sync. Pick one main device, or move data with
Export on one and Import on the other.
