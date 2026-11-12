# Prep Tracker

**A focused 16-week job-hunt tracker for freshers. It plans your day, tracks DSA, interview prep and applications, and shows whether you're actually on track.**

Prep Tracker turns a placement plan into a daily routine you can follow. It tells you what to work on right now, counts what you did today, and shows over the weeks whether that was enough. It covers everything a fresher full-stack candidate prepares: the NeetCode 150 DSA sheet, JavaScript polyfills, machine-coding rounds, interview theory, portfolio projects and the job pipeline itself.

It's plain HTML, CSS and vanilla JavaScript: no framework, no build step and no account. Your data stays in your browser. It works offline and can be installed on your phone like an app.

---

## Why it exists

Preparing for a first job usually fails in quiet ways: too many tutorials, no fixed daily routine, DSA eating the whole day, and no idea whether the effort is enough. This tracker solves that with a few rules built into the app:

- **A fixed day.** A 9:30–5:30 timetable with a rotating topic for each weekday, so you never decide what to study next.
- **A minimum day.** 2 DSA problems + 10 applications + 30 minutes of project work. On a bad day, do only that and the day still counts.
- **Never miss twice.** A streak and a heatmap make missed days visible. Your rest day doesn't break the streak.
- **Apply from week one.** Applications and referral messages are tracked every day alongside prep.

## Features

### Plan and focus
- **Right now:** the current block in its own colour, with a live countdown, a progress bar, a timeline strip of the whole day, "later today" blocks, and buttons for that block. During DSA you get "Solve: next problem"; during job hunt, +1 application and a link to Naukri; during project time, a 90-minute focus timer.
- **4 phases with deadlines:** Foundation → Build depth → Interview mode → Convert, each with dated checkpoints.
- **Focus timer:** 25, 45, 60, 90 or 120 minutes, with a sound and a message when it ends.

### Track
- **Today page, laid out in the order of a day:**
  - **Week strip:** a coloured dot per day. Tap any day to view or edit it.
  - **Day summary:** a ring showing how much of the minimum day is done, plus a plain-English next step (for example "Solve 1 more DSA problem, send 6 more applications…"). It also tells you whether a past day counted.
  - **Log your work:** −/+ goal tiles.
  - **Schedule:** the current block highlighted, with a live countdown and finished blocks ticked.
  - **Done today:** with the next problem one tap away.
  - **Reflection:** mood, focused hours and notes, saved automatically.
- **Today's goals:** coloured progress rings for DSA, applications, referrals, interviews and project time, with one-tap **+1**.
- **Stats with 7-day trends:** streak, DSA solved, applications and interviews, each with a mini bar chart.
- **Consistency heatmap:** one square per day of the plan.
- **Weekly review:** weekly totals against targets, bar charts, and a "what went well / what to fix" note per week.
- **Job pipeline:** company, role, source, status (Saved → Applied → Interviewing → Offer…), link, notes and response rate.

### Prepare
- **DSA sheet:** NeetCode 150 grouped by pattern and ordered by phase. ★ marks core problems. ↻ schedules a problem for spaced revision, and you can add notes per problem.
- **JS & machine coding:** 26 polyfill and utility questions (debounce, Promise.all, an async task queue…) and 20 timed 90-minute React builds.
- **Interview topics:** about 64 topics across JavaScript, React, Next.js, Node, databases, CS fundamentals, HTML/CSS, system design and HR. You rate each one *Not started / Shaky / Okay / Ready*.
- **Learning links on every item:**
  - 📖 **Learn:** the exact MDN, javascript.info, react.dev or OWASP page where one exists, otherwise a Google search limited to the official docs.
  - 🧩 **Practice:** a BigFrontEnd / GreatFrontEnd search for that question.
  - ▶ **Video:** a YouTube search. DSA uses "neetcode + problem".
- **Projects:** milestones with due dates (profile fixes, polishing projects, flagship v2) that also appear on the dashboard.

### Easy to use
- **Command palette:** `Ctrl/⌘ K` searches pages, actions and every problem, and can mark them done.
- **Quick actions:** the floating **+** button, or the `N` key.
- **Undo:** instead of confirmation pop-ups, an Undo button appears for 5 seconds after you tick or delete something.
- **Celebrations:** for a minimum day, all targets hit, 10/25/50/100 problems, and met deadlines.
- **First-run setup:** asks your name, dates, daily targets, design style and theme.
- **Fully customisable:** edit, add, rename or delete any problem, topic, group, link, milestone, timetable block, rotation day, phase or target.

## Design

- **Two design styles,** each with light and dark modes:
  - **Mono** (default): minimal black and white with the Geist / Geist Mono fonts, in the spirit of the Vercel design language.
  - **Calm:** soft warm neutrals with a sage accent.
- **A colour for each category,** used everywhere it appears: DSA 🔵 blue · Applications 🟢 green · Referrals 🟣 purple · Interviews 🟡 amber · Project 🩷 pink · Development 🩵 cyan · Streak 🟠 orange.
- **Grid-based layout:**
  - **Dashboard:** a 12-column grid. Each card spans 12, 8, 6, 4 or 3 columns and reflows at 1180px and 820px.
  - **List rows:** check · content · actions, each in its own grid area. On phones the actions move to a second line.
  - **Goal tiles and headers:** grid areas too.
  - **Tested:** at 1440, 1024, 768 and 375px with no sideways scrolling, nothing sticking out of its card, and no overlapping cards.
- **Phone layout:** a bottom tab bar (Home, Today, DSA, Job hunt, More), bottom-sheet dialogs, and safe-area padding.
- **Accessibility:** keyboard shortcuts, visible focus rings, ARIA labels on icon buttons, and support for reduced motion.

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Ctrl/⌘ K` or `/` | Search everything |
| `N` | Quick actions |
| `1`–`9`, `0` | Jump to a page (`0` = Settings) |
| `A` / `R` | +1 application / +1 referral |
| `T` | Go to Today |

## Run locally

No install needed. Double-click `index.html`, or serve the folder:

```bash
python3 -m http.server 5178 --directory prep-tracker
```

Then open http://localhost:5178. Serving the folder over http enables offline mode and "Install app".

## Deploy

It's a static site, so any static host works. With Vercel:

```bash
vercel login
```

```bash
cd prep-tracker && vercel --prod
```

Accept the defaults (framework "Other", no build command). Run `vercel --prod` again to publish changes; the URL stays the same.

Other options:
- **Netlify Drop:** drag the folder onto app.netlify.com/drop.
- **GitHub Pages:** push the folder to a repo and enable Pages on the `main` branch.

**When you change files,** bump `VERSION` in `sw.js` and the `?v=` number on the CSS/JS links in `index.html`. That way browsers and installed copies fetch the new files.

### Install on your phone
Open the deployed URL:
- **Android (Chrome):** ⋮ → *Install app*
- **iPhone (Safari):** Share → *Add to Home Screen*

## Your data and privacy

- **Where it's stored:** everything is in your browser's `localStorage` (key `prep-tracker-v1`). Nothing is sent to a server, and there is no account or tracking.
- **Each device has its own copy.** Your laptop and phone don't sync. Use **Settings → Export backup / Import backup** to move or back up your data. The dashboard reminds you if you haven't exported in 7 days.
- **Clearing site data deletes it,** so export a backup weekly.

## Customise the defaults

All starting content lives in [`js/data.js`](js/data.js) and is copied into your saved data on first run:

| Key | What it holds |
|---|---|
| `settings` | Name, plan dates, targets, minimum day, theme and style |
| `timetable`, `rotation` | Daily blocks and the per-weekday topics (`{dev}`, `{slot}`) |
| `phases` | The 4 phases and their deadlines |
| `dsa`, `fe`, `topics`, `projects`, `resources` | All list content |
| `groupMeta`, `listMeta`, `docs` | Where the Learn / Practice / Video buttons point |

To start fresh with edited defaults, use **Settings → Reset everything**.

## Project structure

```
prep-tracker/
├── index.html            App shell, theme bootstrap, PWA tags
├── css/styles.css        Design tokens (Mono / Calm × light / dark), category colours, grid layouts, components
├── js/data.js            Default plan and content (editable)
├── js/app.js             State, views, routing, events, palette, timer, celebrations
├── sw.js                 Offline cache (network-first)
├── manifest.webmanifest  Install metadata and shortcuts
└── icons/                App icons (SVG + 192/512 PNG)
```

**How it works:**
- **One state object, saved after every change:** `S` is saved to localStorage on each change.
- **Views are pure functions:** each returns an HTML string from that state.
- **One event handler for every button:** a single delegated listener handles all `data-act` clicks.
- **Routing:** uses the URL hash (`#dashboard`, `#dsa`, …).
- **Safety:** user text is escaped before rendering, and links are limited to `http(s)`.

## Roadmap ideas

- Sync across devices (for example Supabase) instead of export/import
- Reminder notifications for the minimum day
- Import a LeetCode profile to auto-tick solved problems
