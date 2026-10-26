// CPACC Practice Sheets
// Content lives in data/*.json. This file handles routing, rendering and saved progress.
//
// Routes (URL hash, bare tokens only):
//   #start               landing page
//   #d1 #d2 #d3 #all     study overview for a domain, or every domain
//   #d1a … #d3f          a Body of Knowledge topic (opens its domain overview at that topic)
//   #<question-id>       a study question, e.g. #d1-social-model
//   #mock                mock exam (intro, in progress, or review)
//   #mock-results        results of the last submitted mock exam
(function () {
  "use strict";

  const LETTERS = ["A", "B", "C", "D", "E", "F"];
  const STORAGE_KEY = "cpacc-prep:v2";
  const MOCK_MS = 120 * 60 * 1000;

  const main = document.getElementById("main");
  const topnav = document.getElementById("topnav");
  const sheet = document.getElementById("sheet");
  const sheetBody = document.getElementById("sheet-body");
  const sheetTitle = document.getElementById("sheet-title");
  const announcer = document.getElementById("announcer");

  let EXAM, DOMAINS = [], DOMAIN = {}, TOPIC = {}, QUESTIONS = [], QBYID = {};
  let scope = null;           // study scope: "d1" | "d2" | "d3" | "all"; a direct link to a question uses its domain
  let timerId = null;

  const store = { picks: {}, checked: {}, mock: null, lastMock: null };

  // ---------- storage (best effort; the page works without it) ----------
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (s) Object.assign(store, s);
    } catch (e) { /* storage unavailable */ }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch (e) { /* ignore */ }
  }

  // ---------- helpers ----------
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const topicNumber = (t) => `${t.id[1]}.${t.id.charCodeAt(2) - 96}`;
  const scopeLabel = (s) => (s === "all" ? "All domains" : `Domain ${s.slice(1)}`);
  const isRight = (q) => store.picks[q.id] === q.answer;
  const status = (q) => (!store.checked[q.id] ? "none" : isRight(q) ? "good" : "bad");
  const TIP_ICON = `<svg class="tip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2V16h5v-.2c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3z"/></svg>`;
  const STATUS_TEXT = { none: "Not answered", good: "Correct", bad: "Missed", answered: "Answered", flag: "Marked for review" };

  function mark(st, label = true) {
    const glyph = { none: "", good: "✓", bad: "✕", answered: "•", flag: "⚑" }[st];
    return `<span class="st st-${st}" aria-hidden="true">${glyph}</span>${label ? `<span class="vh">${STATUS_TEXT[st]}: </span>` : ""}`;
  }

  function inScope(s) {
    return s === "all" ? QUESTIONS : QUESTIONS.filter((q) => q.domain === +s.slice(1));
  }
  function counts(list) {
    const done = list.filter((q) => store.checked[q.id]);
    return { total: list.length, done: done.length, right: done.filter(isRight).length };
  }
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function fmtTime(ms) {
    const s = Math.max(0, Math.round(ms / 1000));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
    return `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  }
  function announce(msg) { announcer.textContent = ""; setTimeout(() => (announcer.textContent = msg), 50); }

  function setNav(active) {
    document.querySelectorAll(".bar [data-nav]").forEach((a) => {
      if (a.dataset.nav === active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function finish(focusEl) {
    window.scrollTo(0, 0);
    const el = focusEl || main.querySelector("h1");
    if (el) { el.setAttribute("tabindex", "-1"); el.focus({ preventScroll: true }); }
  }

  // ---------- question list (overview page, side panel, mobile sheet) ----------
  // head: optional markup shown with the status key in one box (the side panel puts the domain pill there)
  function questionList(s, currentId, head = "") {
    const ds = s === "all" ? DOMAINS : [DOMAIN[+s.slice(1)]];
    const n = { good: 0, bad: 0, none: 0 };
    QUESTIONS.forEach((q) => { if (s === "all" || q.domain === +s.slice(1)) n[status(q)]++; });
    const legend = `<div class="ql-key">${head}<p class="mlegend">${["good", "bad", "none"].map((st) => `<span>${mark(st, false)}${STATUS_TEXT[st]} (${n[st]})</span>`).join("")}</p></div>`;
    return legend + ds.map((d) => `
      <div class="ql-domain">
        ${s === "all" ? `<h3 class="ql-dh"><a href="#d${d.id}">Domain ${d.id}</a> <span>${esc(d.name)}</span></h3>` : ""}
        ${d.topics.map((t) => {
          const qs = QUESTIONS.filter((q) => q.topic === t.id);
          return `<div class="ql-topic">
            <h4 class="ql-th" id="list-${t.id}"><span class="ql-letter">${topicNumber(t)}</span>${esc(t.name)}</h4>
            ${qs.length ? `<ol class="ql">${qs.map((q) => `<li><a href="#${q.id}" ${q.id === currentId ? 'aria-current="page"' : ""}>${mark(status(q))}<span class="ql-q">${esc(q.question)}</span></a></li>`).join("")}</ol>`
              : `<p class="ql-empty">No questions yet</p>`}
          </div>`;
        }).join("")}
      </div>`).join("");
  }

  // ---------- landing ----------
  function renderHome() {
    setNav("start");
    const all = counts(QUESTIONS);
    const m = store.mock && !store.mock.submittedAt;
    main.innerHTML = `
    <div class="page wide">
      <section class="hero" aria-labelledby="h1">
        <p class="eyebrow">IAAP · ${esc(EXAM.name)}</p>
        <h1 id="h1">Practice for the ${esc(EXAM.code)}, one question at a time</h1>
        <p class="lede">Study by domain with a full explanation after every answer, or sit a timed mock exam that works like the real one.</p>
      </section>

      <section class="blueprint" aria-labelledby="bp">
        <h2 id="bp" class="vh">Exam blueprint</h2>
        <div class="facts">
          <div class="fact"><b>${EXAM.questions}</b><span>Questions</span></div>
          <div class="fact"><b>${EXAM.durationMinutes / 60} hr</b><span>Time limit</span></div>
          <div class="fact"><b>${DOMAINS.length}</b><span>Domains</span></div>
        </div>
        <div class="weights">
          <h3>How the exam is weighted</h3>
          <div class="wbar" aria-hidden="true">${DOMAINS.map((d, k) => `<span class="tone-${k + 1}" style="flex:${d.weight}"></span>`).join("")}</div>
          <ul class="wlegend">${DOMAINS.map((d, k) => `<li class="tone-${k + 1}" style="flex:${d.weight}">Domain ${d.id} <b>${d.weight}%</b></li>`).join("")}</ul>
        </div>
      </section>

      <section aria-labelledby="study-h" class="block">
        <h2 id="study-h" class="h2">Study by domain</h2>
        <p class="sub">Pick a domain, work through its topics, and read why each answer is right or wrong.</p>
        <ul class="domains">
          ${DOMAINS.map((d) => {
            const c = counts(inScope("d" + d.id));
            return `<li class="dcard">
              <div class="dcard-top"><span class="drow-n" aria-hidden="true">${d.id}</span><span class="drow-p">${c.done}/${c.total} answered</span></div>
              <h3 class="dcard-h"><a href="#d${d.id}"><span class="vh">Domain ${d.id}: </span>${esc(d.name)}</a></h3>
              <p class="dcard-meta">${d.weight}% of the exam · ${d.topics.length} topics · ${c.total} question${c.total === 1 ? "" : "s"}</p>
              ${d.summary ? `<p class="dcard-sum">${esc(d.summary)}</p>` : ""}
            </li>`;
          }).join("")}
          <li class="dall"><a class="drow drow-all" href="#all">
            <span class="drow-n" aria-hidden="true">∗</span>
            <span class="drow-main"><b>All domains</b><span>Every question in Body of Knowledge order</span></span>
            <span class="drow-p">${all.done}/${all.total}<span class="vh"> answered</span></span>
          </a></li>
        </ul>
      </section>

      <section aria-labelledby="mock-h" class="block mockcard">
        <h2 id="mock-h" class="h2">Mock exam</h2>
        <p class="sub">Up to ${EXAM.questions} questions drawn across domains by exam weight, a ${EXAM.durationMinutes / 60}-hour timer, and no feedback until you submit. Results show how you did in each domain.</p>
        <div class="bubbles"><ol aria-hidden="true"><li>A</li><li class="on">B</li><li>C</li><li>D</li></ol><p>Every question has four options and one answer, like the bubbles on an answer sheet.</p></div>
        <div class="actions"><a class="btn" href="#mock">${m ? "Resume mock exam" : "Set up a mock exam"}</a>
        ${store.lastMock ? `<a class="btn ghost" href="#mock-results">Last results</a>` : ""}</div>
      </section>

    </div>`;
  }

  // ---------- study overview: a domain or all ----------
  function renderOverview(s, topicId) {
    scope = s;
    setNav(s);
    const list = inScope(s);
    const c = counts(list);
    const d = s === "all" ? null : DOMAIN[+s.slice(1)];
    const next = list.find((q) => !store.checked[q.id]) || list[0];
    main.innerHTML = `
    <div class="page">
      <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="#start">Home</a></li><li aria-current="page">${scopeLabel(s)}</li></ol></nav>
      <header class="ohead">
        <p class="eyebrow">${d ? `Domain ${d.id} · ${d.weight}% of the exam` : "Study"}</p>
        <h1 id="h1">${d ? esc(d.name) : "All domains"}</h1>
        <p class="sub">${c.total ? `${c.done} of ${c.total} answered${c.done ? `, ${c.right} correct` : ""}.` : "No questions in this domain yet."} Topics follow the IAAP Body of Knowledge.</p>
        ${next ? `<div class="actions"><a class="btn" href="#${next.id}">${c.done && c.done < c.total ? "Continue" : c.done === c.total && c.total ? "Review from the start" : "Start"}</a></div>` : ""}
      </header>
      <div class="qlist">${questionList(s)}</div>
    </div>`;
    if (topicId) {
      const h = document.getElementById("list-" + topicId);
      window.scrollTo(0, 0);
      if (h) { h.setAttribute("tabindex", "-1"); h.focus(); h.scrollIntoView({ block: "start" }); return; }
    }
    finish();
  }

  // ---------- study question ----------
  function renderQuestion(q) {
    if (!scope || (scope !== "all" && +scope.slice(1) !== q.domain)) scope = "d" + q.domain;
    setNav(scope);
    const list = inScope(scope);
    const i = list.indexOf(q);
    const d = DOMAIN[q.domain], t = TOPIC[q.topic];
    const checked = !!store.checked[q.id], pick = store.picks[q.id];

    // previous / next stay inside the scope; the end of a domain offers the next one
    const prev = list[i - 1];
    let next = list[i + 1], nextLabel = "Next →", nextHref = next && "#" + next.id;
    if (!next) {
      const nd = scope !== "all" && DOMAINS.find((x) => x.id > q.domain && inScope("d" + x.id).length);
      if (nd) { nextHref = "#" + inScope("d" + nd.id)[0].id; nextLabel = `Domain ${nd.id} →`; }
      else { nextHref = "#" + scope; nextLabel = "Finish →"; }
    }

    const opts = q.options.map((o, k) => {
      let cls = "", tag = "";
      if (checked) {
        if (k === q.answer) { cls = "is-correct"; tag = "Correct answer"; }
        else if (k === pick) { cls = "is-wrong"; tag = "Your answer"; }
      }
      return `<label class="opt ${cls}">
        <input type="radio" name="opt" value="${k}" ${pick === k ? "checked" : ""} ${checked ? "disabled" : ""}>
        <span class="dot" aria-hidden="true">${LETTERS[k]}</span>
        <span><span class="vh">${LETTERS[k]}. </span>${esc(o)}${tag ? `<span class="tag">${tag}</span>` : ""}</span>
      </label>`;
    }).join("");

    const pill = `<span class="chip">${scope === "all" ? "All domains" : `Domain ${d.id} · ${d.weight}%`}</span>`;
    const rationale = checked ? `
      <section class="rationale" aria-labelledby="verdict">
        <p class="verdict ${isRight(q) ? "good" : "bad"}" id="verdict" tabindex="-1">${isRight(q) ? "Correct." : "Not quite."} The answer is ${LETTERS[q.answer]}, ${esc(q.options[q.answer])}.</p>
        <div><h3>Why ${LETTERS[q.answer]} is correct</h3><p>${esc(q.rationale)}</p></div>
        <div><h3>Why the others are wrong</h3><ul class="why-not">${Object.entries(q.distractors).map(([k, txt]) => `<li><span class="l">${LETTERS[k]}</span><span><b>${esc(q.options[k])}.</b> ${esc(txt)}</span></li>`).join("")}</ul></div>
        ${q.tip ? `<div class="tip">${TIP_ICON}<h3>Exam tip</h3><p>${esc(q.tip)}</p></div>` : ""}
      </section>
      <section class="sources" aria-labelledby="sources-h">
        <h3 id="sources-h">Sources</h3>
        <ul class="refs">${q.sources.map((r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}<span class="vh"> (opens in a new tab)</span></a>${r.note ? `<small>${esc(r.note)}</small>` : ""}</li>`).join("")}</ul>
      </section>` : "";

    main.innerHTML = `
    <div class="split">
      <aside class="side" aria-labelledby="side-h">
        <nav aria-labelledby="side-h" class="qlist compact">${questionList(scope, q.id, `<h2 id="side-h" class="side-h">${pill}</h2>`)}</nav>
      </aside>
      <div class="col">
        <nav class="crumbs" aria-label="Breadcrumb"><ol>
          <li><a href="#d${d.id}">Domain ${d.id}</a></li>
          <li><a href="#${t.id}">${topicNumber(t)} ${esc(t.name)}</a></li>
        </ol></nav>
        <div class="qhead">
          <button type="button" class="counter" id="open-list" aria-haspopup="dialog">Question ${i + 1} of ${list.length}<span class="counter-more"> · All questions</span></button>
          <span class="counter-static">Question ${i + 1} of ${list.length}</span>
        </div>
        <form id="qform" class="${checked ? "locked" : ""}">
          <fieldset>
            <legend><h1 class="qtext" id="h1">${esc(q.question)}</h1></legend>
            <div class="opts">${opts}</div>
          </fieldset>
          ${checked ? "" : `<div class="actions"><button class="btn" type="submit">Check answer</button></div><p class="hint" id="hint" aria-live="polite"></p>`}
        </form>
        <div id="result">${rationale}</div>
        <nav class="nav" aria-label="Previous and next question">
          ${prev ? `<a class="btn ghost" href="#${prev.id}">← Previous</a>` : `<a class="btn ghost" href="#${scope}">← ${scopeLabel(scope)}</a>`}
          <a class="btn ghost next" href="${nextHref}">${nextLabel}</a>
        </nav>
      </div>
    </div>`;

    const form = document.getElementById("qform");
    form.addEventListener("change", (e) => {
      if (e.target.name !== "opt") return;
      store.picks[q.id] = +e.target.value; save();
      const h = document.getElementById("hint"); if (h) h.textContent = "";
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (store.picks[q.id] === undefined) { document.getElementById("hint").textContent = "Choose an answer first."; return; }
      store.checked[q.id] = true; save();
      renderQuestion(q);
      document.getElementById("verdict").focus();
    });
    document.getElementById("open-list").onclick = () => openSheet("All questions", questionList(scope, q.id, `<p class="side-h">${pill}</p>`));
    finish();
  }

  // ---------- mobile sheet ----------
  function openSheet(title, html) {
    sheetTitle.textContent = title;
    sheetBody.innerHTML = html;
    if (typeof sheet.showModal === "function") sheet.showModal(); else sheet.setAttribute("open", "");
    const cur = sheetBody.querySelector('[aria-current="page"]');
    if (cur) cur.scrollIntoView({ block: "center" });
  }
  function closeSheet() { if (sheet.open) sheet.close ? sheet.close() : sheet.removeAttribute("open"); }
  document.getElementById("sheet-close").onclick = closeSheet;
  sheet.addEventListener("click", (e) => {
    if (e.target === sheet) closeSheet();               // backdrop
    if (e.target.closest("a")) closeSheet();             // navigation inside the sheet
  });

  // ---------- mock exam ----------
  function drawMock() {
    const total = Math.min(EXAM.questions, QUESTIONS.length);
    const picked = [];
    DOMAINS.forEach((d) => {
      const want = Math.round((total * d.weight) / 100);
      picked.push(...shuffle(inScope("d" + d.id).slice()).slice(0, want));
    });
    const rest = shuffle(QUESTIONS.filter((q) => !picked.includes(q)));
    while (picked.length < total && rest.length) picked.push(rest.pop());
    return shuffle(picked.slice(0, total)).map((q) => q.id);
  }

  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

  function startTimer() {
    stopTimer();
    const el = document.getElementById("timer");
    const warned = new Set(store.mock.warned || []);
    const tick = () => {
      const left = store.mock.startedAt + MOCK_MS - Date.now();
      if (el) el.textContent = fmtTime(left);
      for (const min of [30, 10, 5, 1]) {
        if (left <= min * 60000 && !warned.has(min)) {
          warned.add(min); store.mock.warned = [...warned]; save();
          announce(`${min} minute${min === 1 ? "" : "s"} left in the mock exam.`);
        }
      }
      if (left <= 0) { submitMock(true); }
    };
    tick();
    timerId = setInterval(tick, 1000);
  }

  function renderMock() {
    setNav("mock");
    const m = store.mock;
    if (!m || m.submittedAt) return renderMockIntro();
    if (m.view === "review") return renderMockReview();
    renderMockQuestion();
  }

  function renderMockIntro() {
    stopTimer();
    const total = Math.min(EXAM.questions, QUESTIONS.length);
    main.innerHTML = `
    <div class="page">
      <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="#start">Home</a></li><li aria-current="page">Mock exam</li></ol></nav>
      <h1 id="h1" class="h1s">Mock exam</h1>
      <p class="lede">Practice under exam conditions. You won't see whether an answer is right until you submit.</p>
      <ul class="how">
        <li>${total} question${total === 1 ? "" : "s"}, drawn by exam weight: ${DOMAINS.map((d) => `Domain ${d.id} ${d.weight}%`).join(", ")}.</li>
        <li>A ${EXAM.durationMinutes / 60}-hour timer. You'll hear a reminder at 30, 10, 5 and 1 minutes left. The exam submits itself when time runs out.</li>
        <li>Mark any question for review and come back to it before you submit.</li>
        <li>Your progress is saved on this device, so you can leave and resume.</li>
      </ul>
      ${QUESTIONS.length < EXAM.questions ? `<p class="note">The question bank has ${QUESTIONS.length} question${QUESTIONS.length === 1 ? "" : "s"} so far. A full mock needs ${EXAM.questions}. Until then, the mock uses every question available.</p>` : ""}
      <div class="actions">
        <button class="btn" id="mock-start" type="button">Start the timer</button>
        ${store.lastMock ? `<a class="btn ghost" href="#mock-results">Last results</a>` : ""}
      </div>
    </div>`;
    document.getElementById("mock-start").onclick = () => {
      store.mock = { order: drawMock(), answers: {}, flags: {}, startedAt: Date.now(), i: 0, view: "q", warned: [] };
      save(); renderMock(); finish();
    };
    finish();
  }

  function mockStatus(id) {
    const m = store.mock;
    return m.flags[id] ? "flag" : m.answers[id] !== undefined ? "answered" : "none";
  }

  // status key with live counts, above the number grid so it stays in view as the exam grows
  function mockCounts() {
    const c = { answered: 0, flag: 0, none: 0 };
    store.mock.order.forEach((id) => c[mockStatus(id)]++);
    return c;
  }
  function mockGrid(currentIndex) {
    const m = store.mock, c = mockCounts();
    const key = [["answered", '<span class="st st-answered" aria-hidden="true">•</span>', "Answered"], ["flag", '<span class="st st-flag" aria-hidden="true">⚑</span>', "Marked"], ["none", '<span class="st st-none" aria-hidden="true"></span>', "Not answered"]];
    return `<p class="mlegend mkey">${key.map(([k, icon, label]) => `<span>${icon}<span>${label} (<span data-count="${k}">${c[k]}</span>)</span></span>`).join("")}</p>
      <ol class="mgrid">${m.order.map((id, k) => `<li><button type="button" data-goto="${k}" class="mg mg-${mockStatus(id)}" ${k === currentIndex ? 'aria-current="step"' : ""}>
      <span aria-hidden="true">${k + 1}</span><span class="vh">Question ${k + 1}, ${STATUS_TEXT[mockStatus(id)]}</span></button></li>`).join("")}</ol>`;
  }
  // refresh one question's grid cell and the key's counts in place (side panel and open sheet)
  function updateMockStatus(i, id) {
    const st = mockStatus(id), c = mockCounts();
    document.querySelectorAll(`[data-goto="${i}"]`).forEach((g) => { g.className = `mg mg-${st}`; g.querySelector(".vh").textContent = `Question ${i + 1}, ${STATUS_TEXT[st]}`; });
    document.querySelectorAll("[data-count]").forEach((b) => (b.textContent = c[b.dataset.count]));
  }

  function mockBar(extra) {
    return `<div class="mbar">
      <span class="mtime"><span class="vh">Time left: </span><span id="timer" role="timer" aria-live="off">--:--:--</span></span>
      ${extra || ""}
    </div>`;
  }

  function renderMockQuestion() {
    const m = store.mock;
    const i = Math.min(m.i, m.order.length - 1);
    const q = QBYID[m.order[i]];
    const pick = m.answers[q.id];
    const flagged = !!m.flags[q.id];
    const last = i === m.order.length - 1;
    main.innerHTML = `
    <div class="split">
      <aside class="side" aria-labelledby="side-h"><h2 id="side-h" class="side-h">Mock exam</h2>${mockGrid(i)}</aside>
      <div class="col">
        ${mockBar(`<button type="button" class="counter" id="open-list" aria-haspopup="dialog">Question ${i + 1} of ${m.order.length}<span class="counter-more"> · All</span></button><span class="counter-static">Question ${i + 1} of ${m.order.length}</span>`)}
        <form id="qform">
          <fieldset>
            <legend><h1 class="qtext" id="h1">${esc(q.question)}</h1></legend>
            <div class="opts">${q.options.map((o, k) => `<label class="opt">
              <input type="radio" name="opt" value="${k}" ${pick === k ? "checked" : ""}>
              <span class="dot" aria-hidden="true">${LETTERS[k]}</span>
              <span><span class="vh">${LETTERS[k]}. </span>${esc(o)}</span></label>`).join("")}</div>
          </fieldset>
        </form>
        <div class="actions"><button type="button" class="btn ghost small" id="flag" aria-pressed="${flagged}">${flagged ? "⚑ Marked for review" : "⚐ Mark for review"}</button></div>
        <nav class="nav" aria-label="Previous and next question">
          ${i > 0 ? `<button class="btn ghost" type="button" id="m-prev">← Previous</button>` : `<span></span>`}
          <button class="btn ghost next" type="button" id="m-next">${last ? "Review and submit →" : "Next →"}</button>
        </nav>
      </div>
    </div>`;
    document.getElementById("qform").addEventListener("change", (e) => { m.answers[q.id] = +e.target.value; save(); updateMockStatus(i, q.id); });
    document.getElementById("flag").onclick = (e) => {
      m.flags[q.id] = !m.flags[q.id]; if (!m.flags[q.id]) delete m.flags[q.id]; save();
      const on = !!m.flags[q.id];
      e.currentTarget.setAttribute("aria-pressed", on);
      e.currentTarget.textContent = on ? "⚑ Marked for review" : "⚐ Mark for review";
      updateMockStatus(i, q.id);
    };
    const p = document.getElementById("m-prev"); if (p) p.onclick = () => gotoMock(i - 1);
    document.getElementById("m-next").onclick = () => (last ? (m.view = "review", save(), renderMock(), finish()) : gotoMock(i + 1));
    wireGrid(main);
    document.getElementById("open-list").onclick = () => { openSheet("Mock exam", mockGrid(i)); wireGrid(sheetBody); };
    startTimer();
  }

  function wireGrid(root) {
    root.querySelectorAll("[data-goto]").forEach((b) => (b.onclick = () => { closeSheet(); gotoMock(+b.dataset.goto); }));
  }
  function gotoMock(i) { store.mock.i = i; store.mock.view = "q"; save(); renderMockQuestion(); finish(); }

  function renderMockReview() {
    const m = store.mock;
    const unanswered = m.order.filter((id) => m.answers[id] === undefined).length;
    const flagged = Object.keys(m.flags).length;
    main.innerHTML = `
    <div class="page">
      ${mockBar()}
      <h1 id="h1" class="h1s">Review before you submit</h1>
      <p class="sub">${m.order.length - unanswered} of ${m.order.length} answered. ${unanswered ? `${unanswered} not answered.` : ""} ${flagged ? `${flagged} marked for review.` : ""} Select a number to go back to it.</p>
      ${mockGrid(-1)}
      <div class="confirm" id="confirm">
        <p>${unanswered ? `Unanswered questions count as wrong. ` : ""}Once you submit, you can't change your answers.</p>
        <div class="actions">
          <button class="btn" type="button" id="submit">Submit mock exam</button>
          <button class="btn ghost" type="button" id="back">Keep working</button>
        </div>
      </div>
    </div>`;
    wireGrid(main);
    document.getElementById("back").onclick = () => gotoMock(m.i);
    document.getElementById("submit").onclick = () => submitMock(false);
    startTimer();
  }

  function submitMock(timedOut) {
    stopTimer();
    const m = store.mock;
    if (!m || m.submittedAt) return;
    m.submittedAt = Date.now();
    m.timedOut = !!timedOut;
    store.lastMock = m;
    store.mock = null;
    save();
    setHash("mock-results");
    renderResults();
    if (timedOut) announce("Time is up. Your mock exam was submitted.");
  }

  function renderResults() {
    setNav("mock");
    stopTimer();
    const m = store.lastMock;
    if (!m) return renderMockIntro();
    const qs = m.order.map((id) => QBYID[id]).filter(Boolean);
    const right = qs.filter((q) => m.answers[q.id] === q.answer);
    const missed = qs.filter((q) => m.answers[q.id] !== q.answer);
    const pct = qs.length ? Math.round((right.length / qs.length) * 100) : 0;
    const used = fmtTime(Math.min(MOCK_MS, m.submittedAt - m.startedAt));
    main.innerHTML = `
    <div class="page">
      <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="#start">Home</a></li><li><a href="#mock">Mock exam</a></li><li aria-current="page">Results</li></ol></nav>
      <h1 id="h1" class="h1s">Mock exam results</h1>
      <p class="bigscore"><b>${right.length}</b> of ${qs.length} correct <span>(${pct}%)</span></p>
      <p class="sub">${m.timedOut ? "Time ran out, so the exam submitted itself." : `Finished in ${used}.`} This is practice and does not predict an official IAAP score.</p>
      <section aria-labelledby="bd" class="block">
        <h2 id="bd" class="h2">By domain</h2>
        <ul class="bars">${DOMAINS.map((d) => {
          const dq = qs.filter((q) => q.domain === d.id);
          const dr = dq.filter((q) => m.answers[q.id] === q.answer).length;
          const p = dq.length ? Math.round((dr / dq.length) * 100) : 0;
          return `<li><div class="bar-l"><a href="#d${d.id}">Domain ${d.id}</a> <span>${esc(d.name)}</span></div>
            <div class="bar-t" aria-hidden="true"><span style="width:${p}%"></span></div>
            <div class="bar-v">${dq.length ? `${dr}/${dq.length}` : "None drawn"}</div></li>`;
        }).join("")}</ul>
      </section>
      ${missed.length ? `<section aria-labelledby="ms" class="block">
        <h2 id="ms" class="h2">Study what you missed</h2>
        <p class="sub">Each link opens the question in Study mode with the full explanation.</p>
        <ol class="ql">${missed.map((q) => `<li><a href="#${q.id}">${mark("bad")}<span class="ql-q">${esc(q.question)}</span></a></li>`).join("")}</ol>
      </section>` : ""}
      <div class="actions"><a class="btn" href="#mock">New mock exam</a><a class="btn ghost" href="#start">Home</a></div>
    </div>`;
    finish();
  }

  // ---------- routing ----------
  function setHash(h) { try { history.replaceState(null, "", "#" + h); } catch (e) { /* ignore */ } }

  function route(initial) {
    const h = (location.hash || "").slice(1);
    if (sheet.open) closeSheet();
    if (!h || h === "start") { stopTimer(); renderHome(); return finish(); }
    if (/^(d[123]|all)$/.test(h)) { stopTimer(); return renderOverview(h); }
    if (TOPIC[h]) { stopTimer(); return renderOverview("d" + TOPIC[h].domain, h); }
    if (QBYID[h]) { stopTimer(); return renderQuestion(QBYID[h]); }
    if (h === "mock") { renderMock(); return finish(); }
    if (h === "mock-results") return renderResults();
    if (initial) { renderHome(); finish(); } // unknown token on first load; otherwise ignore (e.g. #main skip link)
  }

  // ---------- clear study progress (header button, confirmed in a dialog) ----------
  const clearDlg = document.getElementById("clear-dlg");
  const clearOpen = document.getElementById("clear-open");
  clearOpen.onclick = () => {
    const n = Object.keys(store.checked).length;
    document.getElementById("clear-desc").textContent = n
      ? `This removes your answers to ${n} study question${n === 1 ? "" : "s"}. Mock exam results are kept.`
      : "You have no study answers to clear yet.";
    document.getElementById("clear-yes").hidden = !n;
    document.getElementById("clear-cancel").textContent = n ? "Cancel" : "Close";
    clearDlg.returnValue = "";
    clearDlg.showModal();
  };
  clearDlg.addEventListener("close", () => {
    if (clearDlg.returnValue !== "clear") return;
    store.picks = {}; store.checked = {}; save();
    route(true);
    clearOpen.focus();
    announce("Study progress cleared.");
  });

  // ---------- boot ----------
  async function boot() {
    try {
      const get = (p) => fetch(p).then((r) => { if (!r.ok) throw new Error(p + " " + r.status); return r.json(); });
      const [d, q] = await Promise.all([get("data/domains.json"), get("data/questions.json")]);
      EXAM = d.exam;
      DOMAINS = d.domains;
      DOMAINS.forEach((x) => { DOMAIN[x.id] = x; x.topics.forEach((t) => (TOPIC[t.id] = { ...t, domain: x.id })); });
      const topicOrder = Object.keys(TOPIC);
      QUESTIONS = q.slice().sort((a, b) => topicOrder.indexOf(a.topic) - topicOrder.indexOf(b.topic));
      QUESTIONS.forEach((x) => (QBYID[x.id] = x));
    } catch (e) {
      main.innerHTML = `<div class="page"><p class="note">The question data could not load. If you opened index.html straight from your files, run a local server instead (see README).</p></div>`;
      return;
    }
    load();
    if (store.mock && !store.mock.submittedAt && Date.now() > store.mock.startedAt + MOCK_MS) submitMock(true);
    window.addEventListener("hashchange", () => route(false));
    route(true);
  }

  boot();
})();
