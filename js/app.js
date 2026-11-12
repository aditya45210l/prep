(function () {
  'use strict';

  /* =================== Utilities =================== */
  const D = window.PREP_DATA;
  const KEY = 'prep-tracker-v1';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const pad = n => String(n).padStart(2, '0');
  const ds = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = s => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, (m || 1) - 1, d || 1); };
  const today = () => ds(new Date());
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return ds(d); };
  const diff = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
  const fmt = (s, o = { day: 'numeric', month: 'short' }) => (s ? parse(s).toLocaleDateString('en-IN', o) : '');
  const clone = x => JSON.parse(JSON.stringify(x));
  const safeUrl = u => (/^https?:\/\//i.test(u || '') ? u : '');
  const pct = (a, b) => (b ? Math.min(100, Math.round((a / b) * 100)) : 0);
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const isDate = s => /^\d{4}-\d{2}-\d{2}$/.test(s || '');

  const ICON = {
    home: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
    sun: '<path d="M12 8a4 4 0 1 0 0 8 4 4 0 1 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    grid: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
    code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    box: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zM3 7.5 12 12l9-4.5M12 12v9"/>',
    brief: '<path d="M3 8h18v12H3zM8 8V5h8v3M3 13h18"/>',
    chart: '<path d="M5 20V11M11 20V5M17 20v-6M3 20h18"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1M15 4v4M9 10v4M17 16v4"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    repeat: '<path d="M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4"/>',
    note: '<path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    search: '<path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4"/>',
    clock: '<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
    flame: '<path d="M12 22c4 0 7-3 7-7 0-5-4-7-5-11-2 2-3 4-3 6-1-1-2-2-2-4-2 2-4 5-4 9 0 4 3 7 7 7z"/>',
    play: '<path d="M3 7.5C3 5.6 4.6 4 6.5 4h11C19.4 4 21 5.6 21 7.5v9c0 1.9-1.6 3.5-3.5 3.5h-11C4.6 20 3 18.4 3 16.5zM10 9v6l5-3z"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>'
  };

  /* =================== Learning links =================== */
  const yt = q => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
  const gsearch = q => `https://www.google.com/search?q=${encodeURIComponent(q)}`;
  const GENERIC = ['https://bigfrontend.dev/problem', 'https://bigfrontend.dev/problem/'];
  function metaFor(list, g) {
    const m = Object.assign({}, (D.listMeta || {})[list], (D.groupMeta || {})[g.name]);
    if (g.yt) m.yt = g.yt;
    if (g.site !== undefined && g.site !== null && g.site !== '') m.site = g.site;
    return m;
  }
  // Returns { learn, video, practice } URLs for an item (any may be '').
  function linksFor(list, g, i) {
    const m = metaFor(list, g);
    const clean = String(i.t).replace(/[()]/g, '').replace(/\s+/g, ' ').trim();
    const fill = tpl => String(tpl || '').replace(/\{t\}/g, clean).replace(/\{g\}/g, g.name);
    const siteQ = m.site ? `site:${m.site} ${clean}` : '';
    const exact = safeUrl(i.docs) || safeUrl((D.docs || {})[i.t]);
    const own = safeUrl(i.u) && !GENERIC.includes(i.u) ? i.u : '';
    const r = { learn: '', video: m.yt ? yt(fill(m.yt)) : '', practice: '' };
    if (list === 'dsa') {
      r.learn = exact;                       // title already opens LeetCode
    } else if (list === 'fe') {
      r.learn = exact;
      r.practice = own || (siteQ ? gsearch(siteQ) : '');
    } else {
      r.learn = exact || (siteQ ? gsearch(siteQ) : '');
    }
    return r;
  }
  function linkBtns(l) {
    const b = (u, icon, label) => (u ? `<a class="icon-btn link-btn" href="${esc(u)}" target="_blank" rel="noopener" title="${label}" aria-label="${label}">${ic(icon)}</a>` : '');
    return b(l.learn, 'book', 'Learn: read the docs') + b(l.practice, 'code', 'Practice this question') + b(l.video, 'play', 'Watch on YouTube');
  }
  const ic = (n, cls = '') => `<svg viewBox="0 0 24 24" aria-hidden="true" class="${cls}">${ICON[n] || ''}</svg>`;

  /* =================== State =================== */
  function defaults() {
    const g = (name, extra, items) => Object.assign({ id: uid(), name }, extra, { items });
    return {
      v: 1,
      settings: clone(D.settings),
      timetable: clone(D.timetable),
      rotation: clone(D.rotation),
      phases: D.phases.map(p => ({ id: uid(), name: p.name, start: p.start, end: p.end, focus: p.focus, deadlines: p.deadlines.map(([t, date]) => ({ id: uid(), t, date, done: false })) })),
      dsa: D.dsa.map(x => g(x.name, { phase: x.phase }, x.items.map(([t, s, d, c]) => ({ id: s, t, u: `https://leetcode.com/problems/${s}/`, d, core: !!c, done: null, rev: null, note: '' })))),
      fe: D.fe.map(x => g(x.name, { kind: x.kind }, x.items.map(([t, u]) => ({ id: uid(), t, u: u || x.link || '', done: null, note: '' })))),
      topics: D.topics.map(x => g(x.name, {}, x.items.map(t => ({ id: uid(), t, c: 0 })))),
      projects: D.projects.map(p => ({ id: uid(), name: p.name, ms: p.ms.map(([t, due]) => ({ id: uid(), t, due, done: false })) })),
      resources: D.resources.map(x => g(x.name, {}, x.items.map(([t, u]) => ({ id: uid(), t, u })))),
      jobs: [],
      logs: {},
      weeks: {},
      timerEnd: null,
      onboarded: false,
      lastBackup: null
    };
  }
  function merge(d, s) {
    const st = s.settings || {};
    return Object.assign({}, d, s, {
      settings: Object.assign({}, d.settings, st, {
        targets: Object.assign({}, d.settings.targets, st.targets || {}),
        minimum: Object.assign({}, d.settings.minimum, st.minimum || {}),
        hidden: Array.isArray(st.hidden) ? st.hidden : []
      }),
      logs: s.logs || {}, weeks: s.weeks || {}, jobs: Array.isArray(s.jobs) ? s.jobs : []
    });
  }
  function load() {
    const d = defaults();
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const s = JSON.parse(raw); if (s && s.settings && Array.isArray(s.dsa)) return merge(d, s); }
    } catch (e) { /* storage unavailable */ }
    return d;
  }
  let storageWarned = false;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); }
    catch (e) { if (!storageWarned) toast("Browser storage is blocked, so changes won't be kept. Use Settings → Export."); storageWarned = true; }
  }

  let S = load();
  const ui = { edit: false, day: today(), q: '', f: 'all', d: 'all', jobF: 'all', jobQ: '', open: {} };

  /* =================== Derived data =================== */
  const allDsa = () => S.dsa.flatMap(g => g.items);
  const allFe = kind => S.fe.filter(g => !kind || g.kind === kind).flatMap(g => g.items);
  const allTopics = () => S.topics.flatMap(g => g.items);
  const lg = d => S.logs[d] || {};
  const setLog = (d, k, v) => { (S.logs[d] = S.logs[d] || {})[k] = v; save(); };
  const totalWeeks = () => Math.max(1, Math.ceil((diff(S.settings.start, S.settings.end) + 1) / 7));
  const weekOf = d => Math.floor(diff(S.settings.start, d) / 7) + 1;
  const weekRange = w => [addDays(S.settings.start, (w - 1) * 7), addDays(S.settings.start, w * 7 - 1)];
  const sumLogs = k => Object.values(S.logs).reduce((a, l) => a + (+l[k] || 0), 0);

  function dsaOn(d) { return allDsa().filter(i => i.done === d).length + (+lg(d).dsaExtra || 0); }
  function mcOn(d) { return allFe('mc').filter(i => i.done === d).length; }
  function dayStatus(d) {
    const l = lg(d), T = S.settings;
    const dsa = dsaOn(d), apps = +l.apps || 0, refs = +l.refs || 0;
    const any = dsa || apps || refs || l.proj || +l.hours || l.note || +l.intv || mcOn(d) || allFe('js').some(i => i.done === d);
    const min = dsa >= T.minimum.dsa && apps >= T.minimum.apps && !!l.proj;
    const full = min && dsa >= T.targets.dsa && apps >= T.targets.apps && refs >= T.targets.refs;
    return { dsa, apps, refs, min, full, lvl: full ? 3 : min ? 2 : any ? 1 : 0 };
  }
  function streak() {
    let d = today(), n = 0, guard = 0;
    // Days before the plan start still count if you logged them.
    const first = Object.keys(S.logs).concat(S.settings.start).sort()[0];
    if (!dayStatus(d).min) d = addDays(d, -1);
    while (d >= first && guard++ < 1000) {
      if (dayStatus(d).min) n++;
      else if (parse(d).getDay() !== +S.settings.restDay) break;
      d = addDays(d, -1);
    }
    return n;
  }
  function bestStreak() {
    let best = 0, cur = 0, d = Object.keys(S.logs).concat(S.settings.start).sort()[0]; const t = today(); let guard = 0;
    while (d <= t && guard++ < 1000) {
      if (dayStatus(d).min) { cur++; best = Math.max(best, cur); }
      else if (parse(d).getDay() !== +S.settings.restDay && d !== t) cur = 0;
      d = addDays(d, 1);
    }
    return best;
  }
  function currentPhase(d = today()) {
    const i = S.phases.findIndex(p => p.start <= d && d <= p.end);
    return i === -1 ? null : { p: S.phases[i], n: i + 1 };
  }
  function phaseNo() {
    const c = currentPhase(); if (c) return c.n;
    return today() < S.settings.start ? 1 : S.phases.length;
  }
  function weekSum(w) {
    const [a] = weekRange(w); const r = { dsa: 0, apps: 0, refs: 0, intv: 0, mc: 0, min: 0, hours: 0 };
    for (let i = 0; i < 7; i++) {
      const d = addDays(a, i), l = lg(d), st = dayStatus(d);
      r.dsa += st.dsa; r.apps += st.apps; r.refs += st.refs; r.intv += +l.intv || 0; r.mc += mcOn(d); r.hours += +l.hours || 0; if (st.min) r.min++;
    }
    return r;
  }
  function rot(d) { return S.rotation[parse(d).getDay()] || { custom: true, note: '' }; }
  function blocksFor(d) {
    const r = rot(d);
    if (r.custom) return null;
    return S.timetable.map(b => Object.assign({}, b, { d: String(b.d || '').replace('{dev}', r.dev || '').replace('{slot}', r.slot || '') }));
  }
  const hm = () => { const n = new Date(); return `${pad(n.getHours())}:${pad(n.getMinutes())}`; };
  function nowBlock() {
    const bl = blocksFor(today()); if (!bl) return { custom: rot(today()) };
    const t = hm();
    const cur = bl.find(b => b.s <= t && t < b.e);
    if (cur) return { cur };
    const next = bl.find(b => b.s > t);
    return next ? { next } : { done: true };
  }
  function upcoming() {
    const a = [];
    S.phases.forEach(p => p.deadlines.forEach(x => a.push({ t: x.t, date: x.date, done: x.done, src: p.name, act: 'dl-toggle', p: p.id, i: x.id })));
    S.projects.forEach(p => p.ms.forEach(x => a.push({ t: x.t, date: x.due, done: x.done, src: p.name, act: 'ms-toggle', p: p.id, i: x.id })));
    return a.filter(x => !x.done && isDate(x.date)).sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0));
  }
  // Next unsolved problems, in phase order — removes the "what should I do now?" decision.
  function nextProblems(n) {
    const out = [];
    S.dsa.slice().sort((a, b) => (+a.phase || 9) - (+b.phase || 9)).some(g => g.items.some(i => {
      if (!i.done) out.push({ g, i });
      return out.length >= n;
    }));
    return out;
  }
  const hasData = () => Object.keys(S.logs).length > 0 || allDsa().some(i => i.done) || S.jobs.length > 0;

  function dueLabel(date) {
    const n = diff(today(), date);
    if (n < 0) return `<span class="bad">${-n}d overdue</span>`;
    if (n === 0) return '<span class="warn">today</span>';
    if (n === 1) return '<span class="warn">tomorrow</span>';
    return `<span class="muted">in ${n} days</span>`;
  }

  /* =================== Small render helpers =================== */
  const ring = (p, label, sub, href) => `<a class="ring-wrap" href="${href}"><div class="ring" style="--p:${p}"><span>${p}%</span></div><div><b>${esc(label)}</b>${esc(sub)}</div></a>`;
  const bar = (p, cls = '') => `<div class="bar ${cls}"><i style="width:${p}%"></i></div>`;
  const head = (title, sub, right = '') => `<header class="page-head"><div><h1>${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}</div><div class="row">${right}</div></header>`;
  const editToggle = () => `<button class="btn ${ui.edit ? 'on' : ''}" data-act="toggle-edit">${ic('sliders')} ${ui.edit ? 'Done customising' : 'Customise'}</button>`;
  const dataAttrs = o => Object.entries(o).map(([k, v]) => `data-${k}="${esc(v)}"`).join(' ');

  /* =================== Views =================== */
  function vDash() {
    const st = S.settings, t = today(), N = totalWeeks();
    const w = weekOf(t), cp = currentPhase();
    const total = diff(st.start, st.end) + 1;
    const elapsed = Math.max(0, Math.min(total, diff(st.start, t) + 1));
    const left = diff(t, st.end);
    const h = new Date().getHours();
    const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';

    let phaseLine;
    if (t < st.start) phaseLine = `Your plan starts ${fmt(st.start, { weekday: 'long', day: 'numeric', month: 'short' })}, in ${diff(t, st.start)} day${diff(t, st.start) === 1 ? '' : 's'}. Use the time to fix your Naukri profile.`;
    else if (t > st.end) phaseLine = 'Your plan window has ended. Extend the end date in Settings if you are still searching.';
    else phaseLine = cp ? `Phase ${cp.n} · ${esc(cp.p.name)} — ${esc(cp.p.focus)}` : 'Between phases.';

    const weekTxt = t < st.start ? `<b>0</b><small>of ${N} weeks</small>` : `<b>${Math.min(w, N)}</b><small>of ${N} weeks</small>`;
    const dsa = allDsa(), dsaDone = dsa.filter(i => i.done).length;
    const js = allFe('js'), mc = allFe('mc');
    const tps = allTopics();
    const ready = tps.length ? Math.round((tps.reduce((a, i) => a + (+i.c || 0), 0) / (tps.length * 3)) * 100) : 0;
    const ms = S.projects.flatMap(p => p.ms);
    const due = dsa.filter(i => i.rev && i.rev <= t);
    const nb = nowBlock();

    let nowHtml;
    if (nb.custom) nowHtml = `<div class="now"><span class="dot"></span><div><div class="muted small">${DAYS[parse(t).getDay()]}</div><b>${esc(nb.custom.note || 'Free day')}</b></div></div>`;
    else if (nb.cur) nowHtml = `<div class="now"><span class="dot"></span><div><div class="muted small">Now · until ${esc(nb.cur.e)}</div><b>${esc(nb.cur.t)}</b>${nb.cur.d ? `<div class="muted small">${esc(nb.cur.d)}</div>` : ''}</div></div>`;
    else if (nb.next) nowHtml = `<div class="now"><span class="dot" style="opacity:.4"></span><div><div class="muted small">Next at ${esc(nb.next.s)}</div><b>${esc(nb.next.t)}</b>${nb.next.d ? `<div class="muted small">${esc(nb.next.d)}</div>` : ''}</div></div>`;
    else nowHtml = '<div class="now"><span class="dot" style="opacity:.4"></span><div><div class="muted small">Work day finished</div><b>Log your day, then rest.</b></div></div>';

    const ups = upcoming().slice(0, 6);
    const todaySt = dayStatus(t);

    return `
      <section class="card hero">
        <div class="hero-top">
          <div>
            <p class="eyebrow">${fmt(t, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <h1>${greet}, ${esc(st.name || 'there')}</h1>
            <p class="focus-line">${phaseLine}</p>
          </div>
          <div class="hero-meta">
            <div>${weekTxt}</div>
            <div><b>${Math.max(0, left)}</b><small>days left</small></div>
          </div>
        </div>
        <div>${bar(pct(elapsed, total))}<div class="row small muted" style="margin-top:6px"><span>${fmt(st.start)}</span><span class="spacer"></span><span>${pct(elapsed, total)}% of the plan elapsed</span><span class="spacer"></span><span>${fmt(st.end)}</span></div></div>
      </section>

      ${backupNote()}
      <div class="quick-row" style="margin-top:var(--gap)">${quickButtons(t)}</div>

      <div class="grid g4" style="margin-top:var(--gap)">
        <div class="card stat"><span class="lbl">${ic('flame')} Streak</span><span class="num">${streak()} <small class="muted" style="font-size:14px">days</small></span><span class="hint">Best ${bestStreak()} · rest day doesn't break it</span></div>
        <div class="card stat"><span class="lbl">DSA solved</span><span class="num">${dsaDone}<small class="muted" style="font-size:14px"> / ${dsa.length}</small></span><span class="hint">${todaySt.dsa} today</span></div>
        <div class="card stat"><span class="lbl">Applications</span><span class="num">${sumLogs('apps')}</span><span class="hint">${todaySt.apps} today · ${sumLogs('refs')} referral msgs</span></div>
        <div class="card stat"><span class="lbl">Interviews</span><span class="num">${sumLogs('intv')}</span><span class="hint">${S.jobs.filter(j => j.status === 'Offer').length} offer${S.jobs.filter(j => j.status === 'Offer').length === 1 ? '' : 's'}</span></div>
      </div>

      <div class="grid g2" style="margin-top:var(--gap)">
        <div class="card"><h3>Right now<span class="spacer"></span><a class="btn sm ghost" href="#today">Log today ${ic('right')}</a></h3>${nowHtml}
          <div class="row" style="margin-top:16px">
            <span class="badge ${todaySt.min ? 'ok' : ''}">${todaySt.min ? ic('check') + ' Minimum day done' : 'Minimum day not done yet'}</span>
            ${todaySt.full ? `<span class="badge ok">${ic('check')} All targets hit</span>` : ''}
          </div>
        </div>
        ${nextUpCard()}
      </div>

      <div class="grid g2" style="margin-top:var(--gap)">
        <div class="card"><h3>Upcoming deadlines<span class="spacer"></span><a class="btn sm ghost" href="#projects">All ${ic('right')}</a></h3>
          ${ups.length ? `<ul class="list">${ups.map(u => `<li class="item"><button class="check" data-act="${u.act}" data-p="${u.p}" data-i="${u.i}" aria-label="Mark done">${ic('check')}</button><div class="item-main"><span class="t">${esc(u.t)}</span><div class="meta">${esc(u.src)} · ${fmt(u.date)} · ${dueLabel(u.date)}</div></div></li>`).join('')}</ul>` : '<p class="empty">Nothing pending. Nice.</p>'}
        </div>
        <div class="card"><h3>Due for revision <span class="tag">${due.length}</span><span class="spacer"></span><a class="btn sm ghost" href="#dsa">Sheet ${ic('right')}</a></h3>
          ${due.length ? `<ul class="list">${due.slice(0, 6).map(i => { const g = S.dsa.find(x => x.items.includes(i)); const u = safeUrl(i.u); return `<li class="item"><div class="item-main">${u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(i.t)}</a>` : `<span class="t">${esc(i.t)}</span>`}<div class="meta">${esc(g.name)} · due ${fmt(i.rev)}</div></div><button class="btn sm" data-act="rev-done" data-g="${g.id}" data-i="${esc(i.id)}">${ic('check')} Revised</button></li>`; }).join('')}</ul>${due.length > 6 ? `<p class="small muted">+${due.length - 6} more on the sheet</p>` : ''}` : '<p class="empty">No problems due. Mark tricky ones with the ↻ button and they come back here after ' + (+S.settings.reviseDays || 3) + ' days.</p>'}
        </div>
      </div>

      <div class="card" style="margin-top:var(--gap)">
        <h3>Progress</h3>
        <div class="rings">
          ${ring(pct(dsaDone, dsa.length), 'DSA', `${dsaDone}/${dsa.length}`, '#dsa')}
          ${ring(pct(js.filter(i => i.done).length, js.length), 'JS coding', `${js.filter(i => i.done).length}/${js.length}`, '#frontend')}
          ${ring(pct(mc.filter(i => i.done).length, mc.length), 'Machine coding', `${mc.filter(i => i.done).length}/${mc.length}`, '#frontend')}
          ${ring(ready, 'Topic readiness', `${tps.filter(i => i.c >= 3).length} ready`, '#topics')}
          ${ring(pct(ms.filter(m => m.done).length, ms.length), 'Milestones', `${ms.filter(m => m.done).length}/${ms.length}`, '#projects')}
        </div>
      </div>

      <div class="card" style="margin-top:var(--gap)"><h3>Consistency<span class="spacer"></span><span class="small muted" style="font-weight:400">Hover a square for the date</span></h3>${heatmap()}</div>`;
  }

  function quickButtons(d) {
    const l = lg(d), st = dayStatus(d);
    const q = (k, label, val) => `<button class="quick" data-act="quick-log" data-k="${k}"><span class="q-plus">${ic('plus')}</span><span><b>${label}</b><small>${val} today</small></span></button>`;
    return `${q('dsa', 'DSA problem', st.dsa)}${q('apps', 'Application', st.apps)}${q('refs', 'Referral msg', st.refs)}${q('intv', 'Interview', +l.intv || 0)}
      <button class="quick ${l.proj ? 'on' : ''}" data-act="quick-proj"><span class="q-plus">${ic('check')}</span><span><b>Project 30 min</b><small>${l.proj ? 'done' : 'not yet'}</small></span></button>`;
  }

  function nextUpCard() {
    const nx = nextProblems(3);
    return `<div class="card"><h3>Next up on the sheet<span class="spacer"></span><a class="btn sm ghost" href="#dsa">Sheet ${ic('right')}</a></h3>
      ${nx.length ? `<ul class="list">${nx.map(({ g, i }) => { const u = safeUrl(i.u); return `<li class="item">
        <button class="check" data-act="toggle" data-list="dsa" data-g="${g.id}" data-i="${esc(i.id)}" aria-label="Mark ${esc(i.t)} done">${ic('check')}</button>
        <div class="item-main"><span class="t">${esc(i.t)}</span><div class="meta">${esc(g.name)}</div></div>
        <span class="tag diff-${esc(i.d)}">${{ E: 'Easy', M: 'Medium', H: 'Hard' }[i.d] || ''}</span>
        ${u ? `<a class="btn sm" href="${esc(u)}" target="_blank" rel="noopener">Solve ${ic('ext')}</a>` : ''}</li>`; }).join('')}</ul>` : '<p class="empty">Every problem is solved. Time to revise.</p>'}
    </div>`;
  }

  function backupNote() {
    if (!hasData()) return '';
    const days = S.lastBackup ? diff(S.lastBackup, today()) : null;
    if (days !== null && days < 7) return '';
    return `<div class="notice" style="margin-top:var(--gap)">${ic('clock')}<span>${days === null ? 'You have never exported a backup.' : `Last backup was ${days} days ago.`} Your progress lives only in this browser.</span><button class="btn sm" data-act="export">Export backup</button></div>`;
  }

  function heatmap() {
    const st = S.settings, t = today();
    const first = addDays(st.start, -((parse(st.start).getDay() + 6) % 7));
    const cols = Math.max(1, Math.ceil((diff(first, st.end) + 1) / 7));
    let cells = '';
    for (let i = 0; i < cols * 7; i++) {
      const d = addDays(first, i);
      if (d < st.start || d > st.end) { cells += '<i class="hc out"></i>'; continue; }
      const lvl = d > t ? 'f' : dayStatus(d).lvl;
      const label = `${fmt(d, { weekday: 'short', day: 'numeric', month: 'short' })}${d > t ? '' : ' · ' + ['no activity', 'some activity', 'minimum day', 'all targets'][lvl]}`;
      cells += `<i class="hc l${lvl}${d === t ? ' now' : ''}" title="${label}"></i>`;
    }
    return `<div class="heat-wrap"><div class="heat" role="img" aria-label="Daily consistency heatmap">${cells}</div></div>
      <div class="legend"><span>Less</span><i class="hc l0"></i><i class="hc l1"></i><i class="hc l2"></i><i class="hc l3"></i><span>More</span><span class="spacer"></span><span>Columns are weeks, Mon → Sun</span></div>`;
  }

  function vToday() {
    const d = ui.day, l = lg(d), st = dayStatus(d), T = S.settings, isT = d === today();
    const auto = allDsa().filter(i => i.done === d).length;
    const counter = (k, label, val, target, extra = '') => `
      <div class="counter-card ${target && val >= target ? 'hit' : ''}">
        <div class="lbl">${label}</div>
        <div class="counter">
          <button class="icon-btn lg" data-act="cnt" data-k="${k}" data-n="-1" aria-label="Decrease ${label}">−</button>
          <b>${val}</b>
          <button class="icon-btn lg" data-act="cnt" data-k="${k}" data-n="1" aria-label="Increase ${label}">+</button>
        </div>
        <div class="tgt">${target ? `target ${target}` : '&nbsp;'}${extra}</div>
      </div>`;

    const bl = blocksFor(d);
    const r = rot(d);
    const t = hm();
    const timeline = bl
      ? `<div class="timeline">${bl.map(b => `<div class="blk ${b.k === 'break' ? 'break' : ''} ${isT && b.s <= t && t < b.e ? 'now' : ''} ${isT && b.e <= t ? 'past' : ''}"><div class="time">${esc(b.s)} – ${esc(b.e)}</div><div><b>${esc(b.t)}</b>${b.d ? `<div class="d">${esc(b.d)}</div>` : ''}</div></div>`).join('')}</div>`
      : `<p class="tip">${esc(r.note || 'No timetable for this day.')}</p>`;

    const solved = allDsa().filter(i => i.done === d);
    const feDone = allFe().filter(i => i.done === d);
    const moods = ['Low', 'Meh', 'Okay', 'Good', 'Great'];
    const mark = ok => `<span class="check ${ok ? 'on' : ''}" aria-hidden="true">${ic('check')}</span>`;

    return `
      ${head(isT ? 'Today' : fmt(d, { weekday: 'long', day: 'numeric', month: 'long' }), isT ? fmt(d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : (d > today() ? 'Planning ahead' : 'Editing a past day'),
        `<div class="day-nav"><button class="icon-btn lg" data-act="day" data-n="-1" aria-label="Previous day">${ic('left')}</button>${isT ? '' : '<button class="btn" data-act="day" data-n="0">Today</button>'}<input class="input" type="date" id="dayPick" value="${d}" style="width:auto"><button class="icon-btn lg" data-act="day" data-n="1" aria-label="Next day">${ic('right')}</button></div>`)}

      <div class="grid g2">
        <div class="card">
          <h3>Minimum day<span class="spacer"></span><span class="badge ${st.min ? 'ok' : ''}">${st.full ? 'All targets hit' : st.min ? 'Done — day counts' : 'Not yet'}</span></h3>
          <div class="min-list">
            <div class="row">${mark(st.dsa >= T.minimum.dsa)}<span>${T.minimum.dsa} DSA problems <span class="muted">(${st.dsa} done)</span></span></div>
            <div class="row">${mark(st.apps >= T.minimum.apps)}<span>${T.minimum.apps} applications <span class="muted">(${st.apps} sent)</span></span></div>
            <label class="row" style="cursor:pointer"><button class="check ${l.proj ? 'on' : ''}" data-act="log-toggle" data-k="proj" aria-pressed="${!!l.proj}" aria-label="30 minutes on project">${ic('check')}</button><span>30+ minutes on the project</span></label>
          </div>
          <p class="tip" style="margin:16px 0 0">Bad day? Do only the minimum and stop. Never miss two days in a row.</p>
        </div>
        <div class="card">
          <h3>How did it feel?</h3>
          <div class="moods">${moods.map((m, i) => `<button class="chip ${+l.mood === i + 1 ? 'active' : ''}" data-act="mood" data-v="${i + 1}">${m}</button>`).join('')}</div>
          <div class="form-grid" style="margin-top:14px">
            <label class="field"><span>Focused hours</span><input class="input" type="number" min="0" max="16" step="0.5" id="log-hours" data-log="hours" value="${esc(l.hours ?? '')}" placeholder="e.g. 6.5"></label>
          </div>
          <label class="field" style="margin-top:12px"><span>Notes — what went well, what blocked you</span><textarea class="input" id="log-note" data-log="note" placeholder="Optional">${esc(l.note || '')}</textarea></label>
        </div>
      </div>

      <p class="section-title">Counters</p>
      <div class="counters">
        ${counter('dsa', 'DSA problems', st.dsa, T.targets.dsa, auto ? ` · ${auto} from sheet` : '')}
        ${counter('apps', 'Applications', st.apps, T.targets.apps)}
        ${counter('refs', 'Referral messages', st.refs, T.targets.refs)}
        ${counter('intv', 'Interviews', +l.intv || 0, 0)}
      </div>

      <div class="grid g2" style="margin-top:var(--gap)">
        <div class="card"><h3>${DAYS[parse(d).getDay()]}'s plan<span class="spacer"></span><a class="btn sm ghost" href="#settings">Edit</a></h3>${timeline}</div>
        <div class="card"><h3>Completed this day</h3>
          ${solved.length || feDone.length ? `<ul class="list">${solved.concat(feDone).map(i => `<li class="item done"><span class="check on" aria-hidden="true">${ic('check')}</span><div class="item-main"><span class="t">${esc(i.t)}</span></div>${i.d ? `<span class="tag diff-${i.d}">${{ E: 'Easy', M: 'Medium', H: 'Hard' }[i.d]}</span>` : ''}</li>`).join('')}</ul>` : '<p class="empty">Tick problems on the DSA sheet or JS & machine coding pages and they show up here automatically.</p>'}
        </div>
      </div>`;
  }

  function matchDsa(i) {
    if (ui.q && !i.t.toLowerCase().includes(ui.q.toLowerCase())) return false;
    if (ui.f === 'todo' && i.done) return false;
    if (ui.f === 'done' && !i.done) return false;
    if (ui.f === 'rev' && !i.rev) return false;
    if (ui.f === 'core' && !i.core) return false;
    if (ui.d !== 'all' && i.d !== ui.d) return false;
    return true;
  }

  function itemRow(list, g, i) {
    const done = !!i.done, meta = [];
    const u = list === 'fe' ? '' : safeUrl(i.u);   // JS/machine-coding titles: links live in the buttons
    if (i.done) meta.push(`Done ${fmt(i.done)}`);
    if (i.rev) meta.push(i.rev <= today() ? '<span class="due">Revise now</span>' : `Revise ${fmt(i.rev)}`);
    if (i.note) meta.push(esc(i.note));
    const a = { list, g: g.id, i: i.id };
    return `<li class="item${done ? ' done' : ''}">
      <button class="check" data-act="toggle" ${dataAttrs(a)} aria-pressed="${done}" aria-label="${done ? 'Unmark' : 'Mark'} ${esc(i.t)}">${ic('check')}</button>
      <div class="item-main">${u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(i.t)}</a>` : `<span class="t">${esc(i.t)}</span>`}${meta.length ? `<div class="meta">${meta.join(' · ')}</div>` : ''}</div>
      ${i.d ? `<span class="tag diff-${esc(i.d)}">${{ E: 'Easy', M: 'Medium', H: 'Hard' }[i.d] || esc(i.d)}</span>` : ''}
      ${i.core ? '<span class="core" title="Core problem">★</span>' : ''}
      <span class="res-links">${linkBtns(linksFor(list, g, i))}</span>
      ${list === 'dsa' ? `<button class="icon-btn ${i.rev ? 'on' : ''}" data-act="rev" ${dataAttrs(a)} title="${i.rev ? 'Remove from revision' : `Revise in ${+S.settings.reviseDays || 3} days`}" aria-label="Toggle revision">${ic('repeat')}</button>` : ''}
      <button class="icon-btn ${i.note ? 'on' : ''}" data-act="note" ${dataAttrs(a)} title="Note" aria-label="Note">${ic('note')}</button>
      ${ui.edit ? `<button class="icon-btn" data-act="item-edit" ${dataAttrs(a)} title="Edit" aria-label="Edit">${ic('sliders')}</button><button class="icon-btn" data-act="item-del" ${dataAttrs(a)} title="Delete" aria-label="Delete">${ic('trash')}</button>` : ''}
    </li>`;
  }

  function groupBlock(list, g, rows, extraHead, forceOpen, defaultOpen) {
    const items = g.items, done = list === 'topics' ? items.filter(i => i.c >= 3).length : items.filter(i => i.done).length;
    const open = forceOpen || (ui.open[g.id] !== undefined ? ui.open[g.id] : defaultOpen);
    return `<details class="group" data-gid="${g.id}" ${open ? 'open' : ''}>
      <summary><span class="chev">${ic('chev')}</span><div class="sum-main"><b>${esc(g.name)}</b>${extraHead || ''}</div><span class="count">${done}/${items.length}</span></summary>
      <div class="group-body">${bar(pct(done, items.length), 'thin')}
        <ul class="list" style="margin-top:6px">${rows || '<li class="empty">Nothing here yet.</li>'}</ul>
        <div class="group-foot">
          <button class="btn sm ghost" data-act="item-add" data-list="${list}" data-g="${g.id}">${ic('plus')} Add ${LISTS[list].item}</button>
          ${ui.edit ? `<button class="btn sm ghost" data-act="group-edit" data-list="${list}" data-g="${g.id}">Edit group & links</button><button class="btn sm ghost danger" data-act="group-del" data-list="${list}" data-g="${g.id}">Delete group</button>` : ''}
        </div>
      </div>
    </details>`;
  }

  function vDSA() {
    const items = allDsa(), done = items.filter(i => i.done).length;
    const by = k => { const a = items.filter(i => i.d === k); return `${a.filter(i => i.done).length}/${a.length}`; };
    const core = items.filter(i => i.core);
    const revCount = items.filter(i => i.rev).length;
    const filtering = ui.q || ui.f !== 'all' || ui.d !== 'all';
    const pn = phaseNo();
    const groups = S.dsa.map(g => {
      const vis = g.items.filter(matchDsa);
      if (filtering && !vis.length) return '';
      return groupBlock('dsa', g, vis.map(i => itemRow('dsa', g, i)).join(''), `<span class="tag ${+g.phase === pn ? 'accent' : ''}">Phase ${esc(g.phase || '–')}</span>`, filtering, +g.phase === pn);
    }).join('');
    const chip = (k, v, label) => `<button class="chip ${ui[k] === v ? 'active' : ''}" data-act="ui" data-k="${k}" data-v="${v}">${label}</button>`;
    return `
      ${head('DSA sheet', `NeetCode 150 grouped by pattern, in the order of your phases. ★ = core (do these first if you fall behind).`, `${editToggle()}<button class="btn primary" data-act="group-add" data-list="dsa">${ic('plus')} Pattern</button>`)}
      <div class="grid g4" style="margin-bottom:var(--gap)">
        <div class="card stat"><span class="lbl">Solved</span><span class="num">${done}<small class="muted" style="font-size:14px"> / ${items.length}</small></span>${bar(pct(done, items.length))}</div>
        <div class="card stat"><span class="lbl">Core ★</span><span class="num">${core.filter(i => i.done).length}<small class="muted" style="font-size:14px"> / ${core.length}</small></span>${bar(pct(core.filter(i => i.done).length, core.length))}</div>
        <div class="card stat"><span class="lbl">By difficulty</span><div class="grid" style="gap:4px;margin-top:4px;font-size:14px">
          <div class="row" style="flex-wrap:nowrap"><span class="tag diff-E">Easy</span><span class="spacer"></span><b>${by('E')}</b></div>
          <div class="row" style="flex-wrap:nowrap"><span class="tag diff-M">Medium</span><span class="spacer"></span><b>${by('M')}</b></div>
          <div class="row" style="flex-wrap:nowrap"><span class="tag diff-H">Hard</span><span class="spacer"></span><b>${by('H')}</b></div></div></div>
        <div class="card stat"><span class="lbl">In revision</span><span class="num">${revCount}</span><span class="hint">${items.filter(i => i.rev && i.rev <= today()).length} due now</span></div>
      </div>
      <div class="toolbar">
        <div class="search">${ic('search')}<input class="input" id="dsa-q" data-ui="q" type="search" placeholder="Search problems" value="${esc(ui.q)}" aria-label="Search problems"></div>
        <div class="chips">${chip('f', 'all', 'All')}${chip('f', 'todo', 'To do')}${chip('f', 'done', 'Done')}${chip('f', 'rev', 'Revision')}${chip('f', 'core', '★ Core')}</div>
        <div class="chips">${chip('d', 'all', 'Any level')}${chip('d', 'E', 'Easy')}${chip('d', 'M', 'Medium')}${chip('d', 'H', 'Hard')}</div>
      </div>
      ${groups || '<p class="empty">No problems match these filters.</p>'}`;
  }

  function vFE() {
    const kinds = { js: 'JS coding', mc: 'Machine coding', other: 'Other' };
    const js = allFe('js'), mc = allFe('mc');
    const groups = S.fe.map(g => groupBlock('fe', g, g.items.map(i => itemRow('fe', g, i)).join(''), `<span class="tag">${esc(kinds[g.kind] || g.kind || '')}</span>`, false, true)).join('');
    return `
      ${head('JS & machine coding', 'Polyfills and utilities (BigFrontEnd / GreatFrontEnd style), plus 90-minute React builds. Use the focus timer in the corner.', `${editToggle()}<button class="btn" data-act="timer-start" data-min="90">${ic('clock')} 90-min build</button><button class="btn primary" data-act="group-add" data-list="fe">${ic('plus')} Group</button>`)}
      <div class="grid g3" style="margin-bottom:var(--gap)">
        <div class="card stat"><span class="lbl">JS coding</span><span class="num">${js.filter(i => i.done).length}<small class="muted" style="font-size:14px"> / ${js.length}</small></span>${bar(pct(js.filter(i => i.done).length, js.length))}</div>
        <div class="card stat"><span class="lbl">Machine coding builds</span><span class="num">${mc.filter(i => i.done).length}<small class="muted" style="font-size:14px"> / ${mc.length}</small></span>${bar(pct(mc.filter(i => i.done).length, mc.length))}</div>
        <div class="card stat"><span class="lbl">This week</span><span class="num">${weekOf(today()) >= 1 ? weekSum(weekOf(today())).mc : 0}<small class="muted" style="font-size:14px"> / ${S.settings.targets.mcWeek} builds</small></span><span class="hint">Weekly target</span></div>
      </div>
      ${groups}`;
  }

  function vTopics() {
    const labels = ['Not started', 'Shaky', 'Okay', 'Ready'];
    const tps = allTopics();
    const counts = [0, 1, 2, 3].map(c => tps.filter(i => (+i.c || 0) === c).length);
    const groups = S.topics.map(g => {
      const rows = g.items.map(i => `<li class="item topic-item">
        <div class="item-main"><span class="t">${esc(i.t)}</span></div>
        <span class="res-links">${linkBtns(linksFor('topics', g, i))}</span>
        <div class="seg" role="group" aria-label="Confidence">${labels.map((l, v) => `<button class="${(+i.c || 0) === v ? 'on c' + v : ''}" data-act="conf" data-g="${g.id}" data-i="${i.id}" data-v="${v}" aria-pressed="${(+i.c || 0) === v}">${l}</button>`).join('')}</div>
        ${ui.edit ? `<button class="icon-btn" data-act="item-edit" data-list="topics" data-g="${g.id}" data-i="${i.id}" aria-label="Edit">${ic('sliders')}</button><button class="icon-btn" data-act="item-del" data-list="topics" data-g="${g.id}" data-i="${i.id}" aria-label="Delete">${ic('trash')}</button>` : ''}
      </li>`).join('');
      return groupBlock('topics', g, rows, '', false, true);
    }).join('');
    return `
      ${head('Interview topics', 'Rate yourself honestly. "Ready" means you can explain it out loud with an example, without notes.', `${editToggle()}<button class="btn primary" data-act="group-add" data-list="topics">${ic('plus')} Group</button>`)}
      <div class="grid g4" style="margin-bottom:var(--gap)">
        ${labels.map((l, i) => `<div class="card stat"><span class="lbl">${l}</span><span class="num">${counts[i]}</span></div>`).join('')}
      </div>
      ${groups}`;
  }

  function vProjects() {
    const cards = S.projects.map(p => {
      const d = p.ms.filter(m => m.done).length;
      const rows = p.ms.slice().sort((a, b) => (a.due || '9') < (b.due || '9') ? -1 : 1).map(m => `<li class="item${m.done ? ' done' : ''}">
        <button class="check" data-act="ms-toggle" data-p="${p.id}" data-i="${m.id}" aria-pressed="${m.done}" aria-label="Toggle milestone">${ic('check')}</button>
        <div class="item-main"><span class="t">${esc(m.t)}</span><div class="meta">${m.due ? fmt(m.due, { weekday: 'short', day: 'numeric', month: 'short' }) : 'No date'}${!m.done && isDate(m.due) ? ' · ' + dueLabel(m.due) : ''}</div></div>
        ${ui.edit ? `<button class="icon-btn" data-act="ms-edit" data-p="${p.id}" data-i="${m.id}" aria-label="Edit">${ic('sliders')}</button><button class="icon-btn" data-act="ms-del" data-p="${p.id}" data-i="${m.id}" aria-label="Delete">${ic('trash')}</button>` : ''}
      </li>`).join('');
      return `<div class="card"><h3>${esc(p.name)}<span class="spacer"></span><span class="count">${d}/${p.ms.length}</span></h3>${bar(pct(d, p.ms.length), 'thin')}
        <ul class="list" style="margin-top:6px">${rows || '<li class="empty">No milestones yet.</li>'}</ul>
        <div class="group-foot"><button class="btn sm ghost" data-act="ms-add" data-p="${p.id}">${ic('plus')} Milestone</button>${ui.edit ? `<button class="btn sm ghost" data-act="proj-edit" data-p="${p.id}">Rename</button><button class="btn sm ghost danger" data-act="proj-del" data-p="${p.id}">Delete</button>` : ''}</div>
      </div>`;
    }).join('');
    const phases = S.phases.map((p, idx) => {
      const cur = p.start <= today() && today() <= p.end;
      return `<div class="card"><h3>Phase ${idx + 1} · ${esc(p.name)} ${cur ? '<span class="tag accent">Now</span>' : ''}<span class="spacer"></span><span class="small muted">${fmt(p.start)} → ${fmt(p.end)}</span></h3>
        <p class="small muted" style="margin:-6px 0 10px">${esc(p.focus)}</p>
        <ul class="list">${p.deadlines.map(x => `<li class="item${x.done ? ' done' : ''}"><button class="check" data-act="dl-toggle" data-p="${p.id}" data-i="${x.id}" aria-pressed="${x.done}" aria-label="Toggle deadline">${ic('check')}</button><div class="item-main"><span class="t">${esc(x.t)}</span><div class="meta">${fmt(x.date)}${!x.done && isDate(x.date) ? ' · ' + dueLabel(x.date) : ''}</div></div></li>`).join('') || '<li class="empty">No deadlines.</li>'}</ul></div>`;
    }).join('');
    return `
      ${head('Projects & deadlines', 'Milestones with due dates. Overdue items show up on the dashboard.', `${editToggle()}<button class="btn primary" data-act="proj-add">${ic('plus')} Project</button>`)}
      <div class="grid g2">${cards}</div>
      <p class="section-title">Phase deadlines <a class="btn sm ghost" href="#settings" style="text-transform:none;letter-spacing:0">Edit in Settings</a></p>
      <div class="grid g2">${phases}</div>`;
  }

  const STATUSES = ['Saved', 'Applied', 'Referral asked', 'Assignment / OA', 'Interviewing', 'Offer', 'Rejected', 'Ghosted'];
  const SOURCES = ['Naukri', 'LinkedIn', 'Referral', 'Company site', 'Wellfound', 'Cutshort', 'Instahyre', 'Internshala', 'Other'];

  function vJobs() {
    const q = ui.jobQ.toLowerCase();
    const list = S.jobs.filter(j => (ui.jobF === 'all' || j.status === ui.jobF) && (!q || `${j.company} ${j.role} ${j.notes}`.toLowerCase().includes(q)))
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    const count = s => S.jobs.filter(j => j.status === s).length;
    const rows = list.map(j => {
      const u = safeUrl(j.link);
      return `<div class="job">
        <div><div class="co">${esc(j.company)}${j.role ? ` <span class="muted" style="font-weight:400">· ${esc(j.role)}</span>` : ''}</div>
          <div class="meta">${esc(j.source || '')}${j.date ? ` · ${fmt(j.date)} · ${diff(j.date, today())}d ago` : ''}${j.notes ? ' · ' + esc(j.notes) : ''}</div></div>
        <div class="actions">
          <select class="input sm st-${esc((j.status || '').split(' ')[0])}" data-act="job-status" data-id="${j.id}" aria-label="Status">${STATUSES.map(s => `<option ${s === j.status ? 'selected' : ''}>${s}</option>`).join('')}</select>
          ${u ? `<a class="icon-btn" href="${esc(u)}" target="_blank" rel="noopener" aria-label="Open posting">${ic('ext')}</a>` : ''}
          <button class="icon-btn" data-act="job-edit" data-id="${j.id}" aria-label="Edit">${ic('note')}</button>
          <button class="icon-btn" data-act="job-del" data-id="${j.id}" aria-label="Delete">${ic('trash')}</button>
        </div></div>`;
    }).join('');
    const active = S.jobs.filter(j => ['Assignment / OA', 'Interviewing'].includes(j.status)).length;
    const replied = S.jobs.filter(j => !['Saved', 'Applied', 'Ghosted'].includes(j.status)).length;
    return `
      ${head('Job hunt', 'Track the applications that matter here. Count every quick apply with the counter on the Today page.', `<button class="btn primary" data-act="job-add">${ic('plus')} Add application</button>`)}
      <div class="grid g4" style="margin-bottom:var(--gap)">
        <div class="card stat"><span class="lbl">Tracked</span><span class="num">${S.jobs.length}</span></div>
        <div class="card stat"><span class="lbl">Response rate</span><span class="num">${pct(replied, S.jobs.filter(j => j.status !== 'Saved').length)}%</span><span class="hint">anything past "Applied"</span></div>
        <div class="card stat"><span class="lbl">In process</span><span class="num">${active}</span></div>
        <div class="card stat"><span class="lbl">Offers</span><span class="num">${count('Offer')}</span></div>
      </div>
      <div class="toolbar">
        <div class="search">${ic('search')}<input class="input" id="job-q" data-ui="jobQ" type="search" placeholder="Search company, role, notes" value="${esc(ui.jobQ)}" aria-label="Search applications"></div>
      </div>
      <div class="chips" style="margin-bottom:16px">
        <button class="chip ${ui.jobF === 'all' ? 'active' : ''}" data-act="ui" data-k="jobF" data-v="all">All<b>${S.jobs.length}</b></button>
        ${STATUSES.map(s => `<button class="chip ${ui.jobF === s ? 'active' : ''}" data-act="ui" data-k="jobF" data-v="${s}">${s}<b>${count(s)}</b></button>`).join('')}
      </div>
      <div class="card">${rows || `<p class="empty">${S.jobs.length ? 'No applications match.' : 'No applications yet. Add the ones you want to follow up on: referrals, companies you like, anything that replies.'}</p>`}</div>`;
  }

  function vWeekly() {
    const N = totalWeeks(), cw = weekOf(today()), T = S.settings.targets, work = 6;
    const tg = { dsa: T.dsa * work, apps: T.apps * work, refs: T.refs * work, mc: T.mcWeek };
    const cell = (v, t) => `<td class="${t && v >= t ? 'hit' : ''}">${v}${t ? `<span class="muted small"> / ${t}</span>` : ''}</td>`;
    let rows = '';
    for (let w = 1; w <= N; w++) {
      const [a, b] = weekRange(w), s = weekSum(w), future = w > cw;
      const ph = currentPhase(a);
      rows += `<tr class="${w === cw ? 'cur' : ''} ${future ? 'future' : ''}">
        <td><b>W${w}</b> <span class="muted small">${fmt(a)} – ${fmt(b)}</span>${ph ? ` <span class="tag">${esc(ph.p.name)}</span>` : ''}</td>
        ${future ? '<td colspan="6" class="muted small">—</td>' : `${cell(s.dsa, tg.dsa)}${cell(s.apps, tg.apps)}${cell(s.refs, tg.refs)}<td>${s.intv}</td>${cell(s.mc, tg.mc)}<td>${s.min}<span class="muted small"> / ${work}</span></td>`}
        <td><button class="btn sm ${S.weeks[w] ? 'on' : ''}" data-act="week-note" data-w="${w}">${S.weeks[w] ? 'View review' : 'Write review'}</button></td>
      </tr>`;
    }
    const cur = cw >= 1 && cw <= N ? weekSum(cw) : null;
    return `
      ${head('Weekly review', 'Fill this every Saturday. Weekly targets = daily targets × 6 working days.', '')}
      ${cur ? `<div class="grid g4" style="margin-bottom:var(--gap)">
        <div class="card stat"><span class="lbl">DSA this week</span><span class="num">${cur.dsa}<small class="muted" style="font-size:14px"> / ${tg.dsa}</small></span>${bar(pct(cur.dsa, tg.dsa))}</div>
        <div class="card stat"><span class="lbl">Applications</span><span class="num">${cur.apps}<small class="muted" style="font-size:14px"> / ${tg.apps}</small></span>${bar(pct(cur.apps, tg.apps))}</div>
        <div class="card stat"><span class="lbl">Referral messages</span><span class="num">${cur.refs}<small class="muted" style="font-size:14px"> / ${tg.refs}</small></span>${bar(pct(cur.refs, tg.refs))}</div>
        <div class="card stat"><span class="lbl">Minimum days</span><span class="num">${cur.min}<small class="muted" style="font-size:14px"> / ${work}</small></span>${bar(pct(cur.min, work))}</div>
      </div>` : ''}
      <div class="grid g2" style="margin-bottom:var(--gap)">
        ${trendChart('dsa', 'DSA problems per week', tg.dsa, N, cw)}
        ${trendChart('apps', 'Applications per week', tg.apps, N, cw)}
      </div>
      <div class="card"><div class="tbl-wrap"><table class="tbl">
        <thead><tr><th>Week</th><th>DSA</th><th>Applications</th><th>Referrals</th><th>Interviews</th><th>Machine coding</th><th>Min. days</th><th>Review</th></tr></thead>
        <tbody>${rows}</tbody></table></div></div>`;
  }

  // Simple CSS bar chart: one bar per week, dashed line = weekly target.
  function trendChart(key, title, target, N, cw) {
    const vals = []; for (let w = 1; w <= N; w++) vals.push(w <= cw ? weekSum(w)[key] : null);
    const max = Math.max((target || 1) * 1.3, ...vals.map(v => v || 0));
    const tPos = target ? (target / max) * 100 : 0;
    const bars = vals.map((v, i) => `<div class="tc-col ${i + 1 === cw ? 'cur' : ''}" title="Week ${i + 1}: ${v === null ? 'upcoming' : v}">
      <div class="tc-track"><div class="tc-bar ${v !== null && target && v >= target ? 'hit' : ''} ${v === null ? 'future' : ''}" style="height:${v === null ? 3 : Math.max(2, (v / max) * 100)}%"></div></div><span>${i + 1}</span></div>`).join('');
    return `<div class="card"><h3>${esc(title)}<span class="spacer"></span><span class="small muted" style="font-weight:400">target ${target}/week</span></h3>
      <div class="tc" role="img" aria-label="${esc(title)}">${target ? `<div class="tc-target" style="bottom:calc(18px + (100% - 18px) * ${(tPos / 100).toFixed(3)})"><span>target</span></div>` : ''}${bars}</div></div>`;
  }

  function vRes() {
    const groups = S.resources.map(g => `<div class="card"><h3>${esc(g.name)}<span class="spacer"></span>${ui.edit ? `<button class="btn sm ghost" data-act="group-edit" data-list="resources" data-g="${g.id}">Rename</button><button class="btn sm ghost danger" data-act="group-del" data-list="resources" data-g="${g.id}">Delete</button>` : ''}</h3>
      <div class="links">${g.items.map(i => { const u = safeUrl(i.u); let host = ''; try { host = new URL(u).hostname.replace(/^www\./, ''); } catch (e) { host = ''; } return `<div class="row" style="flex-wrap:nowrap;gap:4px"><a class="link-card" style="flex:1" href="${esc(u || '#')}" target="_blank" rel="noopener"><span class="favicon">${esc((host || i.t || '?')[0])}</span><span class="lt"><b>${esc(i.t)}</b><small>${esc(host)}</small></span>${ic('ext')}</a>${ui.edit ? `<button class="icon-btn" data-act="item-edit" data-list="resources" data-g="${g.id}" data-i="${i.id}" aria-label="Edit">${ic('sliders')}</button><button class="icon-btn" data-act="item-del" data-list="resources" data-g="${g.id}" data-i="${i.id}" aria-label="Delete">${ic('trash')}</button>` : ''}</div>`; }).join('')}</div>
      <div class="group-foot"><button class="btn sm ghost" data-act="item-add" data-list="resources" data-g="${g.id}">${ic('plus')} Add link</button></div></div>`).join('');
    return `${head('Resources', 'Your saved sites, in one place. One source per topic — don\'t collect more.', `${editToggle()}<button class="btn primary" data-act="group-add" data-list="resources">${ic('plus')} Group</button>`)}
      <div class="stack">${groups}</div>`;
  }

  function vSettings() {
    const st = S.settings;
    const inp = (path, label, type = 'text', val, extra = '') => `<label class="field"><span>${label}</span><input class="input" type="${type}" data-set="${path}" value="${esc(val)}" ${extra}></label>`;
    const accents = { mono: 'linear-gradient(135deg,#0a0a0a 50%,#ededed 50%)', sage: '#4f7d66', ocean: '#3f6e92', lavender: '#6a5f9c', sand: '#876a40', rose: '#985a66', slate: '#4d5c6b' };
    const seg = (path, cur, opts) => `<div class="chips">${opts.map(([v, l]) => `<button class="chip ${String(cur) === String(v) ? 'active' : ''}" data-act="set" data-path="${path}" data-val="${v}">${l}</button>`).join('')}</div>`;
    const views = VIEWS.filter(v => !['dashboard', 'settings'].includes(v[0]));
    return `
      ${head('Settings', 'Everything is saved in this browser only. Export a backup now and then.', '')}
      <div class="grid g2">
        <div class="card"><h3>Plan</h3>
          <div class="form-grid">
            ${inp('settings.name', 'Your name', 'text', st.name)}
            ${inp('settings.start', 'Start date', 'date', st.start)}
            ${inp('settings.end', 'End date', 'date', st.end)}
            ${inp('settings.reviseDays', 'Revise after (days)', 'number', st.reviseDays, 'min="1" max="30"')}
            <label class="field"><span>Rest day</span><select class="input" data-set="settings.restDay">${DAYS.map((d, i) => `<option value="${i}" ${+st.restDay === i ? 'selected' : ''}>${d}</option>`).join('')}</select></label>
          </div>
        </div>
        <div class="card"><h3>Daily targets</h3>
          <div class="form-grid">
            ${inp('settings.targets.dsa', 'DSA / day', 'number', st.targets.dsa, 'min="0"')}
            ${inp('settings.targets.apps', 'Applications / day', 'number', st.targets.apps, 'min="0"')}
            ${inp('settings.targets.refs', 'Referral msgs / day', 'number', st.targets.refs, 'min="0"')}
            ${inp('settings.targets.mcWeek', 'Machine coding / week', 'number', st.targets.mcWeek, 'min="0"')}
            ${inp('settings.minimum.dsa', 'Minimum day: DSA', 'number', st.minimum.dsa, 'min="0"')}
            ${inp('settings.minimum.apps', 'Minimum day: applications', 'number', st.minimum.apps, 'min="0"')}
          </div>
        </div>
        <div class="card"><h3>Appearance</h3>
          <div class="stack">
            <div><p class="small muted" style="margin:0 0 8px">Design style</p>
              <div class="style-pick">
                <button class="style-card ${st.style === 'mono' ? 'on' : ''}" data-act="style" data-val="mono"><span class="sw-mono" aria-hidden="true"><i></i><i></i><i></i></span><b>Mono</b><small>Minimal black & white, Geist font</small></button>
                <button class="style-card ${st.style !== 'mono' ? 'on' : ''}" data-act="style" data-val="calm"><span class="sw-calm" aria-hidden="true"><i></i><i></i><i></i></span><b>Calm</b><small>Soft warm neutrals, sage green</small></button>
              </div></div>
            <div><p class="small muted" style="margin:0 0 8px">Theme</p>${seg('settings.theme', st.theme, [['auto', 'System'], ['light', 'Light'], ['dark', 'Dark']])}</div>
            <div><p class="small muted" style="margin:0 0 8px">Accent colour</p><div class="swatches">${Object.entries(accents).map(([k, c]) => `<button class="swatch ${st.accent === k ? 'on' : ''}" style="background:${c}" data-act="set" data-path="settings.accent" data-val="${k}" aria-label="${k}" title="${k}"></button>`).join('')}</div></div>
            <div><p class="small muted" style="margin:0 0 8px">Density</p>${seg('settings.density', st.density, [['cozy', 'Cozy'], ['compact', 'Compact']])}</div>
          </div>
        </div>
        <div class="card"><h3>Sections</h3>
          <div class="grid" style="gap:10px">${views.map(v => `<label class="check-field"><input type="checkbox" data-act="hide" data-v="${v[0]}" ${st.hidden.includes(v[0]) ? '' : 'checked'}> ${v[1]}</label>`).join('')}</div>
        </div>
      </div>

      <div class="card" style="margin-top:var(--gap)"><h3>Weekday timetable<span class="spacer"></span><button class="btn sm" data-act="tt-add">${ic('plus')} Block</button><button class="btn sm ghost" data-act="tt-reset">Reset</button></h3>
        <p class="small muted" style="margin:-6px 0 12px">Use <code>{dev}</code> and <code>{slot}</code> in the details to pull in that day's topics from the rotation below.</p>
        <div class="edit-rows">${S.timetable.map((b, i) => `<div class="edit-row tt-row">
          <input class="input sm" type="time" data-set="timetable.${i}.s" value="${esc(b.s)}" aria-label="Start">
          <input class="input sm" type="time" data-set="timetable.${i}.e" value="${esc(b.e)}" aria-label="End">
          <input class="input sm" data-set="timetable.${i}.t" value="${esc(b.t)}" aria-label="Title" placeholder="Title">
          <input class="input sm" data-set="timetable.${i}.d" value="${esc(b.d)}" aria-label="Details" placeholder="Details">
          <button class="icon-btn" data-act="tt-del" data-i="${i}" aria-label="Remove block">${ic('trash')}</button></div>`).join('')}</div>
      </div>

      <div class="card" style="margin-top:var(--gap)"><h3>Weekly rotation</h3>
        <div class="edit-rows">${S.rotation.map((r, i) => `<div class="edit-row rot tt-row">
          <span class="day">${DAYS[i].slice(0, 3)}</span>
          ${r.custom ? `<input class="input sm note" data-set="rotation.${i}.note" value="${esc(r.note)}" placeholder="Plan for this day" aria-label="Plan">` : `<input class="input sm" data-set="rotation.${i}.dev" value="${esc(r.dev)}" placeholder="{dev} topic" aria-label="Development topic"><input class="input sm" data-set="rotation.${i}.slot" value="${esc(r.slot)}" placeholder="{slot} topic" aria-label="Rotating slot">`}
          <label class="check-field small"><input type="checkbox" data-set="rotation.${i}.custom" ${r.custom ? 'checked' : ''}> Custom</label></div>`).join('')}</div>
      </div>

      <div class="card" style="margin-top:var(--gap)"><h3>Phases & deadlines<span class="spacer"></span><button class="btn sm" data-act="phase-add">${ic('plus')} Phase</button></h3>
        <div class="stack">${S.phases.map((p, i) => `<div class="phase-edit">
          <div class="form-grid">
            ${inp(`phases.${i}.name`, `Phase ${i + 1} name`, 'text', p.name)}
            ${inp(`phases.${i}.start`, 'Start', 'date', p.start)}
            ${inp(`phases.${i}.end`, 'End', 'date', p.end)}
          </div>
          ${inp(`phases.${i}.focus`, 'Focus', 'text', p.focus)}
          <div class="edit-rows">${p.deadlines.map((x, j) => `<div class="row" style="flex-wrap:nowrap"><input class="input sm" data-set="phases.${i}.deadlines.${j}.t" value="${esc(x.t)}" aria-label="Deadline"><input class="input sm" type="date" style="width:auto" data-set="phases.${i}.deadlines.${j}.date" value="${esc(x.date)}" aria-label="Date"><button class="icon-btn" data-act="dl-del" data-p="${p.id}" data-i="${x.id}" aria-label="Remove deadline">${ic('trash')}</button></div>`).join('')}</div>
          <div class="row"><button class="btn sm ghost" data-act="dl-add" data-p="${p.id}">${ic('plus')} Deadline</button><span class="spacer"></span><button class="btn sm ghost danger" data-act="phase-del" data-p="${p.id}">Delete phase</button></div>
        </div>`).join('')}</div>
      </div>

      <div class="card" style="margin-top:var(--gap)"><h3>Your data</h3>
        <p class="small muted" style="margin:-6px 0 12px">Data lives in this browser's local storage. Clearing site data deletes it, so export a backup every week.</p>
        <div class="row"><button class="btn primary" data-act="export">Export backup</button><button class="btn" data-act="import">Import backup</button><span class="spacer"></span><button class="btn danger" data-act="reset">Reset everything</button></div>
      </div>`;
  }

  /* =================== Routing & render =================== */
  const VIEWS = [
    ['dashboard', 'Dashboard', 'home', vDash],
    ['today', 'Today', 'sun', vToday],
    ['dsa', 'DSA sheet', 'grid', vDSA],
    ['frontend', 'JS & machine coding', 'code', vFE],
    ['topics', 'Interview topics', 'book', vTopics],
    ['projects', 'Projects', 'box', vProjects],
    ['jobs', 'Job hunt', 'brief', vJobs],
    ['weekly', 'Weekly review', 'chart', vWeekly],
    ['resources', 'Resources', 'link', vRes],
    ['settings', 'Settings', 'sliders', vSettings]
  ];

  function applyTheme() {
    const r = document.documentElement, st = S.settings;
    if (st.theme === 'light' || st.theme === 'dark') r.setAttribute('data-theme', st.theme); else r.removeAttribute('data-theme');
    r.setAttribute('data-style', st.style || 'calm');
    r.setAttribute('data-accent', st.accent || 'sage');
    r.setAttribute('data-density', st.density || 'cozy');
  }

  function render() {
    const id = location.hash.slice(1) || 'dashboard';
    let v = VIEWS.find(x => x[0] === id) || VIEWS[0];
    if (S.settings.hidden.includes(v[0])) v = VIEWS[0];

    const ae = document.activeElement, fid = ae && ae.id;
    let sel = null;
    try { if (fid && typeof ae.selectionStart === 'number') sel = [ae.selectionStart, ae.selectionEnd]; } catch (e) { sel = null; }

    $('#nav').innerHTML = `<button class="nav-search" data-act="palette">${ic('search')}<span>Search</span><kbd>${/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? '⌘' : 'Ctrl'} K</kbd></button>` + VIEWS.filter(x => !S.settings.hidden.includes(x[0]) || x[0] === 'settings')
      .map(x => `<a href="#${x[0]}" class="${x[0] === v[0] ? 'active' : ''}" ${x[0] === v[0] ? 'aria-current="page"' : ''}>${ic(x[2])}<span>${x[1]}</span></a>`).join('');
    $('#main').innerHTML = v[3]();
    document.title = `${v[1]} · Prep Tracker`;

    // Mobile bottom tab bar: 4 main pages + "More".
    const main = ['dashboard', 'today', 'dsa', 'jobs'].filter(k => k === 'dashboard' || !S.settings.hidden.includes(k));
    const inMore = !main.includes(v[0]);
    $('#tabbar').innerHTML = main.map(k => { const x = VIEWS.find(y => y[0] === k); return `<a href="#${k}" class="${k === v[0] ? 'active' : ''}" ${k === v[0] ? 'aria-current="page"' : ''}>${ic(x[2])}<span>${k === 'dashboard' ? 'Home' : k === 'dsa' ? 'DSA' : x[1]}</span></a>`; }).join('')
      + `<button class="${inMore ? 'active' : ''}" data-act="more">${ic('sliders')}<span>${inMore ? esc(v[1].split(' ')[0]) : 'More'}</span></button>`;

    const t = today(), st = S.settings, left = diff(t, st.end);
    $('#brandSub').textContent = t < st.start ? `Starts ${fmt(st.start)}` : `Week ${Math.min(weekOf(t), totalWeeks())} of ${totalWeeks()}`;
    $('#sideFoot').innerHTML = `<b>${Math.max(0, left)} days</b>left until ${fmt(st.end, { day: 'numeric', month: 'short', year: 'numeric' })}<div style="margin-top:10px">${bar(pct(diff(st.start, t) + 1, diff(st.start, st.end) + 1), 'thin')}</div>`;

    if (fid) {
      const el = document.getElementById(fid);
      if (el) { el.focus(); if (sel) try { el.setSelectionRange(sel[0], sel[1]); } catch (e) { /* not a text input */ } }
    }
  }

  /* =================== Forms, toast, timer =================== */
  // Toast with optional Undo. snap() must be called before the change you want to be undoable.
  let undoState = null;
  const snap = () => { undoState = JSON.stringify(S); };
  function toast(msg, opts = {}) {
    if (typeof opts === 'number') opts = { ms: opts };
    const el = $('#toast');
    el.innerHTML = `<span>${esc(msg)}</span>${opts.undo ? '<button class="toast-btn" data-act="undo">Undo</button>' : ''}`;
    el.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove('show'), opts.ms || (opts.undo ? 5000 : 2600));
  }

  // Gentle celebration: a small burst of dots + message. Skipped when reduced motion is on.
  function celebrate(msg) {
    toast(msg, { ms: 4000 });
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const fx = $('#fx'); fx.innerHTML = '';
    for (let k = 0; k < 28; k++) {
      const s = document.createElement('i');
      const ang = Math.random() * Math.PI * 2, dist = 80 + Math.random() * 160;
      s.style.setProperty('--x', `${Math.cos(ang) * dist}px`);
      s.style.setProperty('--y', `${Math.sin(ang) * dist - 60}px`);
      s.style.setProperty('--d', `${Math.random() * 0.15}s`);
      s.style.setProperty('--o', String(0.45 + Math.random() * 0.55));
      fx.appendChild(s);
    }
    setTimeout(() => { fx.innerHTML = ''; }, 1400);
  }
  const MILESTONES = [10, 25, 50, 75, 100, 125, 150];
  // Compare before/after a change and celebrate the moments that matter.
  function checkWins(before) {
    const t = today(), st = dayStatus(t), solved = allDsa().filter(i => i.done).length;
    const hit = MILESTONES.find(m => before.solved < m && solved >= m);
    if (hit) return celebrate(`${hit} problems solved. Keep going!`);
    if (!before.full && st.full) return celebrate('All targets hit today. Great day!');
    if (!before.min && st.min) return celebrate('Minimum day done — today counts.');
  }
  const winState = () => { const st = dayStatus(today()); return { solved: allDsa().filter(i => i.done).length, min: st.min, full: st.full }; };

  function fieldHtml(f, val) {
    const id = 'f-' + f.n;
    if (f.type === 'checkbox') return `<label class="check-field"><input type="checkbox" name="${f.n}" ${val ? 'checked' : ''}> ${esc(f.l)}</label>`;
    if (f.type === 'select') return `<label class="field" for="${id}"><span>${esc(f.l)}</span><select class="input" id="${id}" name="${f.n}">${f.opts.map(([v, l]) => `<option value="${esc(v)}" ${String(val) === String(v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>`;
    if (f.type === 'textarea') return `<label class="field" for="${id}"><span>${esc(f.l)}</span><textarea class="input" id="${id}" name="${f.n}" placeholder="${esc(f.ph || '')}">${esc(val ?? '')}</textarea></label>`;
    return `<label class="field" for="${id}"><span>${esc(f.l)}</span><input class="input" id="${id}" name="${f.n}" type="${f.type || 'text'}" value="${esc(val ?? '')}" placeholder="${esc(f.ph || '')}" ${f.req ? 'required' : ''}></label>`;
  }

  function openForm(title, fields, values, onSave, saveLabel = 'Save') {
    const dlg = $('#dlg');
    if (dlg.open) dlg.close();
    dlg.innerHTML = `<form method="dialog" class="dlg-form"><h3>${esc(title)}</h3>${fields.map(f => fieldHtml(f, values[f.n])).join('')}
      <div class="dlg-actions"><button class="btn ghost" value="cancel" formnovalidate>Cancel</button><button class="btn primary" value="ok">${esc(saveLabel)}</button></div></form>`;
    const form = dlg.querySelector('form');
    form.addEventListener('submit', e => {
      if (e.submitter && e.submitter.value === 'cancel') return;
      e.preventDefault();
      if (!form.reportValidity()) return;
      const v = {};
      fields.forEach(f => {
        const el = form.elements[f.n];
        v[f.n] = f.type === 'checkbox' ? el.checked : f.type === 'number' ? (el.value === '' ? null : +el.value) : el.value.trim();
      });
      onSave(v);
      dlg.close(); save(); render();
    });
    dlg.showModal();
    const first = form.querySelector('input:not([type=checkbox]), textarea, select');
    if (first) first.focus();
  }

  function beep() {
    try {
      const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
      const c = new C(), o = c.createOscillator(), g = c.createGain();
      o.frequency.value = 660; g.gain.setValueAtTime(0.0001, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.2, c.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 1.2);
      o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime + 1.3);
    } catch (e) { /* audio unavailable */ }
  }
  function timerTick() {
    const el = $('#timer');
    if (!S.timerEnd) { el.hidden = true; el.classList.remove('run'); return; }
    el.hidden = false;
    const ms = S.timerEnd - Date.now();
    if (ms <= 0) { S.timerEnd = null; save(); toast("Time's up. Take a 5-minute break.", 6000); beep(); timerTick(); return; }
    const m = Math.floor(ms / 60000), s = Math.floor(ms / 1000) % 60;
    el.classList.add('run'); el.innerHTML = `${ic('clock')}<span>${m}:${pad(s)}</span>`;
  }
  function startTimer(min) { S.timerEnd = Date.now() + min * 60000; save(); timerTick(); toast(`${min}-minute focus started`); }

  /* =================== Quick sheet, palette, onboarding =================== */
  function openQuick() {
    const dlg = $('#dlg'), t = today(), st = dayStatus(t), l = lg(t);
    const nx = nextProblems(1)[0];
    const b = (act, icon, label, sub, extra = '') => `<button class="sheet-btn" data-act="${act}" data-close ${extra}>${ic(icon)}<span><b>${label}</b>${sub ? `<small>${sub}</small>` : ''}</span></button>`;
    dlg.innerHTML = `<div class="dlg-form">
      <div class="row"><h3>Quick actions</h3><span class="spacer"></span><button class="icon-btn" data-act="close-dlg" aria-label="Close">✕</button></div>
      <div class="sheet-grid">
        ${b('quick-log', 'grid', '+1 DSA problem', `${st.dsa} today`, 'data-k="dsa"')}
        ${b('quick-log', 'brief', '+1 Application', `${st.apps} today`, 'data-k="apps"')}
        ${b('quick-log', 'link', '+1 Referral message', `${st.refs} today`, 'data-k="refs"')}
        ${b('quick-log', 'book', '+1 Interview', `${+l.intv || 0} today`, 'data-k="intv"')}
        ${b('quick-proj', 'box', l.proj ? 'Undo project 30 min' : 'Project 30 min done', '')}
        ${b('job-add', 'plus', 'Track an application', 'company, role, link')}
        ${b('timer-start', 'clock', 'Focus 25 min', '', 'data-min="25"')}
        ${b('timer-start', 'clock', 'Focus 90 min', 'machine coding', 'data-min="90"')}
      </div>
      ${nx ? `<div class="notice"><span>Next problem: <b>${esc(nx.i.t)}</b></span><a class="btn sm primary" href="${esc(safeUrl(nx.i.u) || '#dsa')}" target="_blank" rel="noopener">Solve ${ic('ext')}</a></div>` : ''}
      <p class="small muted" style="margin:0">Tip: press <kbd>N</kbd> for this sheet and <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> to search anything.</p>
    </div>`;
    dlg.showModal();
  }

  function paletteItems(q) {
    const items = [];
    VIEWS.forEach((v, i) => items.push({ label: `Go to ${v[1]}`, hint: i < 9 ? String(i + 1) : '', icon: v[2], run: () => { location.hash = v[0]; } }));
    const quick = (k, label) => items.push({ label, hint: '', icon: 'plus', run: () => clickAct({ act: 'quick-log', k }) });
    quick('apps', '+1 Application'); quick('refs', '+1 Referral message'); quick('dsa', '+1 DSA problem (not on sheet)'); quick('intv', '+1 Interview');
    items.push({ label: 'Project 30 min done (toggle)', icon: 'box', run: () => clickAct({ act: 'quick-proj' }) });
    items.push({ label: 'Track an application', icon: 'brief', run: () => clickAct({ act: 'job-add' }) });
    items.push({ label: 'Start 25-min focus', icon: 'clock', run: () => startTimer(25) });
    items.push({ label: 'Start 90-min focus (machine coding)', icon: 'clock', run: () => startTimer(90) });
    items.push({ label: 'Switch theme (system → light → dark)', icon: 'sun', run: () => { const o = ['auto', 'light', 'dark']; S.settings.theme = o[(o.indexOf(S.settings.theme) + 1) % 3]; save(); applyTheme(); render(); toast(`Theme: ${S.settings.theme === 'auto' ? 'system' : S.settings.theme}`); } });
    items.push({ label: 'Export backup', icon: 'ext', run: () => clickAct({ act: 'export' }) });
    const ql = q.trim().toLowerCase();
    let res = ql ? items.filter(x => x.label.toLowerCase().includes(ql)) : items.slice(0, 10).concat(items.slice(VIEWS.length, VIEWS.length + 2));
    if (ql.length >= 2) {
      const probs = [];
      S.dsa.forEach(g => g.items.forEach(i => { if (i.t.toLowerCase().includes(ql)) probs.push({ g, i }); }));
      S.fe.forEach(g => g.items.forEach(i => { if (i.t.toLowerCase().includes(ql)) probs.push({ g, i, fe: true }); }));
      probs.slice(0, 8).forEach(({ g, i, fe }) => res.push({
        label: `${i.done ? 'Unmark' : 'Mark done'}: ${i.t}`, hint: g.name, icon: 'check',
        run: () => clickAct({ act: 'toggle', list: fe ? 'fe' : 'dsa', g: g.id, i: i.id })
      }));
      S.jobs.filter(j => j.company.toLowerCase().includes(ql)).slice(0, 4).forEach(j => res.push({ label: `Edit application: ${j.company}`, hint: j.status, icon: 'brief', run: () => clickAct({ act: 'job-edit', id: j.id }) }));
    }
    return res.slice(0, 14);
  }
  // Run an action through the same click handler the buttons use.
  function clickAct(data) {
    const b = document.createElement('button');
    Object.entries(data).forEach(([k, v]) => { b.dataset[k] = v; });
    b.hidden = true; document.body.appendChild(b); b.click(); b.remove();
  }
  function openPalette() {
    const pal = $('#pal');
    let sel = 0, res = [];
    pal.innerHTML = `<div class="pal-box"><div class="search">${ic('search')}<input class="input" id="pal-q" placeholder="Search pages, actions, problems…" autocomplete="off" aria-label="Command search"></div><ul class="pal-list" id="pal-list" role="listbox"></ul>
      <div class="pal-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> run</span><span><kbd>Esc</kbd> close</span><span class="spacer"></span><span><kbd>1</kbd>–<kbd>9</kbd> pages · <kbd>N</kbd> quick · <kbd>A</kbd> +1 app</span></div></div>`;
    const input = $('#pal-q', pal), list = $('#pal-list', pal);
    const draw = () => {
      res = paletteItems(input.value); sel = Math.min(sel, Math.max(0, res.length - 1));
      list.innerHTML = res.map((r, i) => `<li role="option" class="pal-item ${i === sel ? 'sel' : ''}" data-i="${i}" aria-selected="${i === sel}">${ic(r.icon)}<span class="pl">${esc(r.label)}</span>${r.hint ? `<span class="ph">${esc(r.hint)}</span>` : ''}</li>`).join('') || '<li class="empty" style="padding:12px">No matches</li>';
      const s = list.querySelector('.sel'); if (s) s.scrollIntoView({ block: 'nearest' });
    };
    const run = i => { const r = res[i]; if (!r) return; pal.close(); r.run(); };
    input.addEventListener('input', () => { sel = 0; draw(); });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { sel = Math.min(res.length - 1, sel + 1); draw(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); draw(); e.preventDefault(); }
      else if (e.key === 'Enter') { run(sel); e.preventDefault(); }
    });
    list.addEventListener('click', e => { const li = e.target.closest('.pal-item'); if (li) run(+li.dataset.i); });
    pal.addEventListener('click', e => { if (e.target === pal) pal.close(); });
    draw(); pal.showModal(); input.focus();
  }

  function onboarding() {
    const st = S.settings;
    openForm('Welcome! Set up your plan', [
      { n: 'name', l: 'Your name', req: true },
      { n: 'start', l: 'Start date (a Monday works best)', type: 'date', req: true },
      { n: 'end', l: 'Target date to have an offer', type: 'date', req: true },
      { n: 'dsa', l: 'DSA problems per day', type: 'number' },
      { n: 'apps', l: 'Applications per day', type: 'number' },
      { n: 'style', l: 'Design style', type: 'select', opts: [['mono', 'Mono: minimal black & white'], ['calm', 'Calm: soft and warm']] },
      { n: 'theme', l: 'Theme', type: 'select', opts: [['auto', 'Follow my system'], ['light', 'Light'], ['dark', 'Dark']] }
    ], { name: st.name, start: st.start, end: st.end, dsa: st.targets.dsa, apps: st.targets.apps, style: st.style, theme: st.theme }, v => {
      Object.assign(st, { name: v.name, theme: v.theme, style: v.style, accent: v.style === 'mono' ? 'mono' : (st.accent === 'mono' ? 'sage' : st.accent) });
      if (isDate(v.start)) st.start = v.start;
      if (isDate(v.end) && v.end > st.start) st.end = v.end;
      if (v.dsa != null) st.targets.dsa = Math.max(0, v.dsa);
      if (v.apps != null) st.targets.apps = Math.max(0, v.apps);
      S.onboarded = true; applyTheme();
      setTimeout(() => toast('All set. Press N any time for quick actions.', 4000), 300);
    }, 'Start tracking');
    $('#dlg').addEventListener('close', () => { if (!S.onboarded) { S.onboarded = true; save(); } }, { once: true });
  }

  /* =================== List configs (custom items) =================== */
  const LISTS = {
    dsa: {
      item: 'problem',
      fields: [{ n: 't', l: 'Problem name', req: true }, { n: 'u', l: 'Problem link', type: 'url', ph: 'https://leetcode.com/problems/…' }, { n: 'docs', l: 'Learn link (optional)', type: 'url', ph: 'Article or editorial' }, { n: 'd', l: 'Difficulty', type: 'select', opts: [['E', 'Easy'], ['M', 'Medium'], ['H', 'Hard']] }, { n: 'core', l: 'Core / must-do', type: 'checkbox' }],
      make: v => ({ id: uid(), t: v.t, u: v.u, docs: v.docs, d: v.d || 'M', core: !!v.core, done: null, rev: null, note: '' }),
      gfields: [{ n: 'name', l: 'Pattern name', req: true }, { n: 'phase', l: 'Phase (1–4)', type: 'number' }, { n: 'yt', l: 'YouTube search ({t} = problem title)', ph: 'neetcode {t}' }],
      gdef: { phase: 1 }
    },
    fe: {
      item: 'question',
      fields: [{ n: 't', l: 'Title', req: true }, { n: 'u', l: 'Practice link (optional)', type: 'url', ph: 'BigFrontEnd / GreatFrontEnd question' }, { n: 'docs', l: 'Learn link (optional)', type: 'url', ph: 'MDN / javascript.info' }],
      make: v => ({ id: uid(), t: v.t, u: v.u, docs: v.docs, done: null, note: '' }),
      gfields: [{ n: 'name', l: 'Group name', req: true }, { n: 'kind', l: 'Type', type: 'select', opts: [['js', 'JS coding'], ['mc', 'Machine coding'], ['other', 'Other']] }, { n: 'yt', l: 'YouTube search ({t} = title)', ph: '{t} javascript interview' }, { n: 'site', l: 'Practice sites for Google search', ph: 'bigfrontend.dev OR site:greatfrontend.com' }],
      gdef: { kind: 'js' }
    },
    topics: {
      item: 'topic',
      fields: [{ n: 't', l: 'Topic', req: true }, { n: 'docs', l: 'Learn link (optional)', type: 'url', ph: 'Best article you found' }],
      make: v => ({ id: uid(), t: v.t, docs: v.docs, c: 0 }),
      gfields: [{ n: 'name', l: 'Group name', req: true }, { n: 'yt', l: 'YouTube search ({t} = topic)', ph: '{t} explained' }, { n: 'site', l: 'Docs sites for Google search', ph: 'react.dev' }],
      gdef: {}
    },
    resources: {
      item: 'link',
      fields: [{ n: 't', l: 'Title', req: true }, { n: 'u', l: 'URL', type: 'url', req: true, ph: 'https://' }],
      make: v => ({ id: uid(), t: v.t, u: v.u }),
      gfields: [{ n: 'name', l: 'Group name', req: true }],
      gdef: {}
    }
  };
  const findG = (l, gid) => (S[l] || []).find(g => g.id === gid);
  const findI = (l, gid, iid) => { const g = findG(l, gid); return g ? g.items.find(i => i.id === iid) : null; };
  const findP = pid => S.projects.find(p => p.id === pid);
  const findPh = pid => S.phases.find(p => p.id === pid);

  function setPath(obj, path, val) {
    const ks = path.split('.'); let o = obj;
    for (let i = 0; i < ks.length - 1; i++) { if (o[ks[i]] == null) return; o = o[ks[i]]; }
    o[ks[ks.length - 1]] = val;
  }

  /* =================== Events =================== */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el || el.tagName === 'SELECT' || (el.tagName === 'INPUT' && el.type !== 'button')) return;
    const a = el.dataset, act = a.act;
    const rerender = () => { save(); render(); };
    // Actions launched from the quick sheet close it first.
    const dlg = $('#dlg');
    if (dlg.open && el.closest('#dlg') && a.close !== undefined) dlg.close();

    switch (act) {
      case 'undo': {
        if (!undoState) return;
        S = JSON.parse(undoState); undoState = null; save(); applyTheme(); render();
        $('#toast').classList.remove('show');
        return;
      }
      case 'toggle': {
        const i = findI(a.list, a.g, a.i); if (!i) return;
        const before = winState(); snap();
        i.done = i.done ? null : today();
        rerender();
        if (i.done) { toast(a.list === 'dsa' ? `Solved: ${i.t}` : `Done: ${i.t}`, { undo: true }); checkWins(before); }
        return;
      }
      case 'quick-log': {
        const before = winState(), d = today(), k = a.k;
        if (k === 'dsa') setLog(d, 'dsaExtra', (+lg(d).dsaExtra || 0) + 1);
        else setLog(d, k, (+lg(d)[k] || 0) + 1);
        render();
        const names = { dsa: 'DSA problem', apps: 'Application', refs: 'Referral message', intv: 'Interview' };
        toast(`+1 ${names[k]} logged`, { ms: 1600 });
        checkWins(before);
        return;
      }
      case 'quick-proj': {
        const before = winState(); setLog(today(), 'proj', !lg(today()).proj); render(); checkWins(before); return;
      }
      case 'quick': return openQuick();
      case 'close-dlg': if (dlg.open) dlg.close(); return;
      case 'more': {
        const cur = location.hash.slice(1) || 'dashboard';
        dlg.innerHTML = `<div class="dlg-form"><div class="row"><h3>All sections</h3><span class="spacer"></span><button class="icon-btn" data-act="close-dlg" aria-label="Close">✕</button></div>
          <div class="sheet-grid">${VIEWS.filter(x => !S.settings.hidden.includes(x[0]) || x[0] === 'settings').map(x => `<button class="sheet-btn ${x[0] === cur ? 'on' : ''}" data-act="go" data-v="${x[0]}" data-close>${ic(x[2])}<span><b>${x[1]}</b></span></button>`).join('')}</div>
          <div class="row" style="flex-wrap:nowrap"><button class="btn" style="flex:1" data-act="palette" data-close>${ic('search')} Search everything</button><button class="btn" data-act="theme-cycle" data-close>${ic('moon')} Light / dark</button></div></div>`;
        return dlg.showModal();
      }
      case 'palette': return openPalette();
      case 'go': location.hash = a.v; return;
      case 'rev': {
        const i = findI('dsa', a.g, a.i); if (!i) return;
        i.rev = i.rev ? null : addDays(today(), +S.settings.reviseDays || 3);
        if (i.rev) toast(`Back for revision on ${fmt(i.rev)}`);
        return rerender();
      }
      case 'rev-done': {
        const i = findI('dsa', a.g, a.i); if (i) { i.rev = null; if (!i.done) i.done = today(); }
        return rerender();
      }
      case 'note': {
        const i = findI(a.list, a.g, a.i); if (!i) return;
        return openForm(`Note · ${i.t}`, [{ n: 'note', l: 'Approach, mistakes, key idea', type: 'textarea' }], i, v => { i.note = v.note; });
      }
      case 'item-add': {
        const g = findG(a.list, a.g), L = LISTS[a.list]; if (!g) return;
        return openForm(`Add ${L.item} to ${g.name}`, L.fields, { d: 'M' }, v => { g.items.push(L.make(v)); });
      }
      case 'item-edit': {
        const i = findI(a.list, a.g, a.i), L = LISTS[a.list]; if (!i) return;
        return openForm(`Edit ${L.item}`, L.fields, i, v => { Object.assign(i, v); });
      }
      case 'item-del': {
        const g = findG(a.list, a.g); if (!g) return;
        const i = g.items.find(x => x.id === a.i); if (!i) return;
        snap(); g.items = g.items.filter(x => x.id !== a.i); rerender(); toast(`Deleted "${i.t}"`, { undo: true });
        return;
      }
      case 'group-add': {
        const L = LISTS[a.list];
        return openForm('New group', L.gfields, Object.assign({}, L.gdef), v => { S[a.list].push(Object.assign({ id: uid() }, L.gdef, v, { items: [] })); });
      }
      case 'group-edit': {
        const g = findG(a.list, a.g), L = LISTS[a.list]; if (!g) return;
        const cur = a.list === 'resources' ? g : Object.assign({}, metaFor(a.list, g), g, { yt: g.yt || metaFor(a.list, g).yt, site: g.site || metaFor(a.list, g).site });
        return openForm('Edit group', L.gfields, cur, v => { Object.assign(g, v); });
      }
      case 'group-del': {
        const g = findG(a.list, a.g);
        if (!g) return;
        snap(); S[a.list] = S[a.list].filter(x => x.id !== a.g); rerender(); toast(`Deleted group "${g.name}"`, { undo: true });
        return;
      }
      case 'conf': {
        const i = findI('topics', a.g, a.i); if (i) i.c = +a.v;
        return rerender();
      }
      case 'toggle-edit': ui.edit = !ui.edit; return render();
      case 'ui': ui[a.k] = a.v; return render();

      case 'day': {
        ui.day = +a.n === 0 ? today() : addDays(ui.day, +a.n);
        return render();
      }
      case 'cnt': {
        const d = ui.day, n = +a.n, before = winState();
        if (a.k === 'dsa') {
          const extra = +lg(d).dsaExtra || 0;
          if (n < 0 && extra <= 0) { toast('Untick the problem on the DSA sheet to reduce this.'); return; }
          setLog(d, 'dsaExtra', Math.max(0, extra + n));
        } else setLog(d, a.k, Math.max(0, (+lg(d)[a.k] || 0) + n));
        render(); if (n > 0) checkWins(before); return;
      }
      case 'log-toggle': { const before = winState(); setLog(ui.day, a.k, !lg(ui.day)[a.k]); render(); checkWins(before); return; }
      case 'mood': setLog(ui.day, 'mood', +lg(ui.day).mood === +a.v ? 0 : +a.v); return render();

      case 'ms-toggle': { const p = findP(a.p); const m = p && p.ms.find(x => x.id === a.i); if (!m) return; snap(); m.done = !m.done; rerender(); if (m.done) { if (p.ms.every(x => x.done)) celebrate(`${p.name}: all milestones done!`); else toast(`Done: ${m.t}`, { undo: true }); } return; }
      case 'ms-add': {
        const p = findP(a.p); if (!p) return;
        return openForm(`Milestone · ${p.name}`, [{ n: 't', l: 'Milestone', req: true }, { n: 'due', l: 'Due date', type: 'date' }], { due: addDays(today(), 7) }, v => { p.ms.push({ id: uid(), t: v.t, due: v.due, done: false }); });
      }
      case 'ms-edit': {
        const p = findP(a.p); const m = p && p.ms.find(x => x.id === a.i); if (!m) return;
        return openForm('Edit milestone', [{ n: 't', l: 'Milestone', req: true }, { n: 'due', l: 'Due date', type: 'date' }], m, v => { Object.assign(m, v); });
      }
      case 'ms-del': { const p = findP(a.p); if (!p) return; snap(); p.ms = p.ms.filter(x => x.id !== a.i); rerender(); toast('Milestone deleted', { undo: true }); return; }
      case 'proj-add': return openForm('New project', [{ n: 'name', l: 'Project name', req: true }], {}, v => { S.projects.push({ id: uid(), name: v.name, ms: [] }); });
      case 'proj-edit': { const p = findP(a.p); if (!p) return; return openForm('Rename project', [{ n: 'name', l: 'Project name', req: true }], p, v => { p.name = v.name; }); }
      case 'proj-del': { const p = findP(a.p); if (!p) return; snap(); S.projects = S.projects.filter(x => x.id !== a.p); rerender(); toast(`Deleted project "${p.name}"`, { undo: true }); return; }

      case 'dl-toggle': { const p = findPh(a.p); const x = p && p.deadlines.find(d => d.id === a.i); if (!x) return; snap(); x.done = !x.done; rerender(); if (x.done) celebrate(`Deadline met: ${x.t}`); return; }
      case 'dl-add': { const p = findPh(a.p); if (p) p.deadlines.push({ id: uid(), t: 'New deadline', date: p.end, done: false }); return rerender(); }
      case 'dl-del': { const p = findPh(a.p); if (!p) return; snap(); p.deadlines = p.deadlines.filter(d => d.id !== a.i); rerender(); toast('Deadline deleted', { undo: true }); return; }
      case 'phase-add': {
        const last = S.phases[S.phases.length - 1]; const start = last ? addDays(last.end, 1) : S.settings.start;
        S.phases.push({ id: uid(), name: 'New phase', start, end: addDays(start, 27), focus: '', deadlines: [] }); return rerender();
      }
      case 'phase-del': { snap(); S.phases = S.phases.filter(p => p.id !== a.p); rerender(); toast('Phase deleted', { undo: true }); return; }

      case 'job-add': {
        const f = [
          { n: 'company', l: 'Company', req: true }, { n: 'role', l: 'Role' },
          { n: 'source', l: 'Source', type: 'select', opts: SOURCES.map(s => [s, s]) },
          { n: 'date', l: 'Date', type: 'date' },
          { n: 'status', l: 'Status', type: 'select', opts: STATUSES.map(s => [s, s]) },
          { n: 'link', l: 'Job link', type: 'url', ph: 'https://' },
          { n: 'notes', l: 'Notes (contact, salary, next step)', type: 'textarea' },
          { n: 'count', l: "Also add to that day's application counter", type: 'checkbox' }
        ];
        return openForm('Add application', f, { source: 'Naukri', date: today(), status: 'Applied', count: true }, v => {
          const cnt = v.count; delete v.count;
          S.jobs.push(Object.assign({ id: uid() }, v));
          if (cnt && isDate(v.date)) setLog(v.date, 'apps', (+lg(v.date).apps || 0) + 1);
        });
      }
      case 'job-edit': {
        const j = S.jobs.find(x => x.id === a.id); if (!j) return;
        const f = [
          { n: 'company', l: 'Company', req: true }, { n: 'role', l: 'Role' },
          { n: 'source', l: 'Source', type: 'select', opts: SOURCES.map(s => [s, s]) },
          { n: 'date', l: 'Date', type: 'date' },
          { n: 'status', l: 'Status', type: 'select', opts: STATUSES.map(s => [s, s]) },
          { n: 'link', l: 'Job link', type: 'url' },
          { n: 'notes', l: 'Notes', type: 'textarea' }
        ];
        return openForm('Edit application', f, j, v => { Object.assign(j, v); });
      }
      case 'job-del': { const j = S.jobs.find(x => x.id === a.id); if (!j) return; snap(); S.jobs = S.jobs.filter(x => x.id !== a.id); rerender(); toast(`Deleted ${j.company}`, { undo: true }); return; }

      case 'week-note': {
        const w = +a.w, [s, en] = weekRange(w);
        return openForm(`Week ${w} review · ${fmt(s)} – ${fmt(en)}`, [
          { n: 'good', l: 'What went well?', type: 'textarea' },
          { n: 'fix', l: 'What will I fix next week?', type: 'textarea' }
        ], S.weeks[w] || {}, v => { S.weeks[w] = (v.good || v.fix) ? v : undefined; if (!S.weeks[w]) delete S.weeks[w]; });
      }

      case 'set': {
        setPath(S, a.path, a.val); applyTheme(); return rerender();
      }
      case 'style': {
        const st = S.settings; st.style = a.val;
        if (a.val === 'mono') st.accent = 'mono';
        else if (st.accent === 'mono') st.accent = 'sage';
        applyTheme(); return rerender();
      }
      case 'theme-cycle': {
        // Quick toggle: flip between light and dark based on what's showing now.
        const dark = S.settings.theme === 'dark' || (S.settings.theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
        S.settings.theme = dark ? 'light' : 'dark'; applyTheme(); return rerender();
      }
      case 'tt-add': { const last = S.timetable[S.timetable.length - 1]; S.timetable.push({ s: last ? last.e : '09:00', e: last ? last.e : '10:00', t: 'New block', d: '', k: 'focus' }); return rerender(); }
      case 'tt-del': S.timetable.splice(+a.i, 1); return rerender();
      case 'tt-reset': if (confirm('Reset the timetable to the default?')) { S.timetable = clone(D.timetable); S.rotation = clone(D.rotation); rerender(); } return;

      case 'timer': {
        if (S.timerEnd) { if (confirm('Stop the focus timer?')) { S.timerEnd = null; save(); timerTick(); } return; }
        return openForm('Focus timer', [{ n: 'min', l: 'Minutes', type: 'select', opts: [['25', '25 minutes'], ['45', '45 minutes'], ['60', '60 minutes'], ['90', '90 minutes (machine coding)'], ['120', '2 hours (DSA block)']] }], { min: '90' }, v => startTimer(+v.min));
      }
      case 'timer-start': return startTimer(+a.min);

      case 'export': {
        S.lastBackup = today(); save(); render();
        const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob), link = document.createElement('a');
        link.href = url; link.download = `prep-tracker-backup-${today()}.json`;
        document.body.appendChild(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return toast('Backup downloaded');
      }
      case 'import': return $('#importFile').click();
      case 'reset': {
        if (confirm('Reset everything? All progress in this browser will be deleted. Export a backup first if unsure.') && confirm('Really delete all progress?')) {
          S = defaults(); save(); applyTheme(); render(); toast('Reset to defaults');
        }
        return;
      }
      default:
    }
  });

  document.addEventListener('change', e => {
    const el = e.target;
    if (el.id === 'importFile') {
      const f = el.files && el.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          const s = JSON.parse(r.result);
          if (!s || !s.settings || !Array.isArray(s.dsa)) throw new Error('bad');
          S = merge(defaults(), s); save(); applyTheme(); render(); toast('Backup imported');
        } catch (err) { toast("That file isn't a Prep Tracker backup."); }
        el.value = '';
      };
      r.readAsText(f);
      return;
    }
    if (el.id === 'dayPick' && isDate(el.value)) { ui.day = el.value; return render(); }
    if (el.dataset.act === 'job-status') { const j = S.jobs.find(x => x.id === el.dataset.id); if (j) j.status = el.value; save(); return render(); }
    if (el.dataset.act === 'hide') {
      const h = S.settings.hidden, v = el.dataset.v;
      S.settings.hidden = el.checked ? h.filter(x => x !== v) : h.concat(v);
      save(); return render();
    }
    if (el.dataset.set) {
      const val = el.type === 'checkbox' ? el.checked : el.type === 'number' ? (el.value === '' ? 0 : +el.value) : el.value;
      if (el.type === 'date' && !isDate(val)) return;
      setPath(S, el.dataset.set, val);
      if (el.dataset.set === 'settings.start' || el.dataset.set === 'settings.end') {
        if (S.settings.end < S.settings.start) { toast('End date must be after start date'); S.settings.end = addDays(S.settings.start, 7 * 16 - 1); }
      }
      save(); applyTheme(); return render();
    }
  });

  document.addEventListener('input', e => {
    const el = e.target;
    if (el.dataset.ui) { ui[el.dataset.ui] = el.value; return render(); }
    if (el.dataset.log) { setLog(ui.day, el.dataset.log, el.type === 'number' ? (el.value === '' ? '' : +el.value) : el.value); }
  });

  document.addEventListener('toggle', e => {
    const d = e.target;
    if (d.tagName === 'DETAILS' && d.dataset.gid) ui.open[d.dataset.gid] = d.open;
  }, true);

  window.addEventListener('hashchange', () => { ui.edit = false; render(); window.scrollTo(0, 0); });
  window.addEventListener('storage', e => { if (e.key === KEY) { S = load(); applyTheme(); render(); } });

  // Refresh "right now" and the date at a calm pace.
  let lastDay = today();
  setInterval(() => {
    const t = today();
    if (t !== lastDay) { if (ui.day === lastDay) ui.day = t; lastDay = t; render(); return; }
    const v = location.hash.slice(1) || 'dashboard';
    const typing = document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if ((v === 'dashboard' || v === 'today') && !typing && !$('#dlg').open && !$('#pal').open) render();
  }, 60000);
  setInterval(timerTick, 1000);

  // Keyboard shortcuts (ignored while typing or when a dialog is open).
  document.addEventListener('keydown', e => {
    const typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '') || (document.activeElement || {}).isContentEditable;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (!$('#pal').open) openPalette(); return; }
    if (typing || e.metaKey || e.ctrlKey || e.altKey || $('#dlg').open || $('#pal').open) return;
    const k = e.key;
    if (/^[1-9]$/.test(k)) { const v = VIEWS[+k - 1]; if (v) { location.hash = v[0]; e.preventDefault(); } return; }
    if (k === '0') { location.hash = 'settings'; return; }
    if (k === '/' || k === '?') { e.preventDefault(); openPalette(); return; }
    if (k === 'n' || k === 'N') { e.preventDefault(); openQuick(); return; }
    if (k === 'a' || k === 'A') { clickAct({ act: 'quick-log', k: 'apps' }); return; }
    if (k === 'r' || k === 'R') { clickAct({ act: 'quick-log', k: 'refs' }); return; }
    if (k === 't' || k === 'T') { location.hash = 'today'; }
  });

  // Offline support + "Install app" when served over http(s).
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }

  applyTheme();
  render();
  timerTick();
  if (!S.onboarded && !hasData()) setTimeout(onboarding, 250);
})();
