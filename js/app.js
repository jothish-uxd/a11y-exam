// CPACC Practice Sheets — renders the landing page and question views.
// Content lives in data/*.json; this file only handles rendering, state and navigation.
(function () {
  "use strict";

  const LETTERS = ["A", "B", "C", "D", "E", "F"];
  const STORAGE_KEY = "cpacc-prep:v1";

  const main = document.getElementById("main");
  const meta = document.getElementById("meta");

  let EXAM = null;
  let DOMAINS = {};
  let QUESTIONS = [];
  const state = { picks: {}, checked: {} }; // keyed by question id

  // ---------- storage (best effort; page works without it) ----------
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (s) { state.picks = s.picks || {}; state.checked = s.checked || {}; }
    } catch (e) { /* storage unavailable */ }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  // ---------- helpers ----------
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const color = (d) => `var(${d.colorToken})`;
  const isRight = (q) => state.picks[q.id] === q.answer;

  function setHash(h) { try { history.replaceState(null, "", "#" + h); } catch (e) { /* ignore */ } }

  function scoreLine() {
    const done = QUESTIONS.filter((q) => state.checked[q.id]);
    const right = done.filter(isRight).length;
    return done.length ? `${right} of ${done.length} answered correctly so far` : "";
  }

  // ---------- landing ----------
  function renderHome(focus) {
    meta.textContent = "Domain-based practice";
    const s = scoreLine();
    const resumeAt = QUESTIONS.findIndex((q) => !state.checked[q.id]);
    const doms = Object.values(DOMAINS);

    main.innerHTML = `
    <section class="hero" aria-labelledby="h1">
      <div class="bubbles" aria-hidden="true"><i></i><i class="on"></i><i></i><i></i></div>
      <p class="eyebrow">IAAP · ${esc(EXAM.name)}</p>
      <h1 id="h1">Practice for the ${esc(EXAM.code)}, one question at a time</h1>
      <p class="lede">Each question gives four choices, then explains why the right answer is right, why the others are wrong, and where to read more in the official sources.</p>
    </section>
    <section class="blueprint" aria-labelledby="bp">
      <h2 id="bp" class="vh">Exam blueprint</h2>
      <div class="facts">
        <div class="fact"><b>${EXAM.questions}</b><span>Questions</span></div>
        <div class="fact"><b>${EXAM.durationMinutes / 60} hr</b><span>Time limit</span></div>
        <div class="fact"><b>${doms.length}</b><span>Domains</span></div>
      </div>
      <div class="weights">
        <h2>How the exam is weighted</h2>
        <div class="wbar" aria-hidden="true">${doms.map((d) => `<span style="flex:${d.weight};background:${color(d)}"></span>`).join("")}</div>
        <ul class="wlist">${doms.map((d) => `<li><span class="sw" style="background:${color(d)}" aria-hidden="true"></span><span>Domain ${d.id}: ${esc(d.name)}</span><span class="pct">${d.weight}%</span></li>`).join("")}</ul>
      </div>
    </section>
    <ul class="how">
      <li>Pick an answer, then select Check answer.</li>
      <li>Read the rationale for every option, including the wrong ones.</li>
      <li>Use Previous and Next to move between questions. Your answers stay on this device.</li>
    </ul>
    ${s ? `<p class="score">${s}</p>` : ""}
    <div class="actions">
      <button class="btn" id="start" type="button">${s && resumeAt > -1 ? `Resume at question ${resumeAt + 1}` : "Start question 1"}</button>
      ${s ? `<button class="btn ghost" id="reset" type="button">Clear my answers</button>` : ""}
    </div>`;

    document.getElementById("start").onclick = () => go(s && resumeAt > -1 ? resumeAt : 0);
    const r = document.getElementById("reset");
    if (r) r.onclick = () => { state.picks = {}; state.checked = {}; save(); renderHome(true); };
    if (focus) main.focus();
  }

  // ---------- question ----------
  function renderQ(i, focus) {
    const Q = QUESTIONS[i];
    const D = DOMAINS[Q.domain];
    const checked = !!state.checked[Q.id];
    const pick = state.picks[Q.id];
    const last = i === QUESTIONS.length - 1;
    meta.textContent = `Question ${i + 1} of ${QUESTIONS.length}`;

    const opts = Q.options.map((o, k) => {
      let cls = "", tag = "";
      if (checked) {
        if (k === Q.answer) { cls = "is-correct"; tag = "Correct answer"; }
        else if (k === pick) { cls = "is-wrong"; tag = "Your answer"; }
      }
      return `<label class="opt ${cls}">
        <input type="radio" name="opt" value="${k}" ${pick === k ? "checked" : ""} ${checked ? "disabled" : ""}>
        <span class="dot" aria-hidden="true">${LETTERS[k]}</span>
        <span><span class="vh">${LETTERS[k]}. </span>${esc(o)}${tag ? `<span class="tag">${tag}</span>` : ""}</span>
      </label>`;
    }).join("");

    const progress = QUESTIONS.map((q, k) => {
      const done = state.checked[q.id];
      const cls = done ? (isRight(q) ? "done-good" : "done-bad") : "";
      const st = done ? (isRight(q) ? ", correct" : ", incorrect") : "";
      return `<button type="button" class="${cls}" data-go="${k}" ${k === i ? 'aria-current="step"' : ""} aria-label="Question ${k + 1}${st}">${k + 1}</button>`;
    }).join("");

    const rationale = checked ? `
      <section class="rationale" aria-labelledby="verdict">
        <p class="verdict ${isRight(Q) ? "good" : "bad"}" id="verdict" tabindex="-1">${isRight(Q) ? "Correct." : "Not quite."} The answer is ${LETTERS[Q.answer]}, ${esc(Q.options[Q.answer])}.</p>
        <div><h3>Why ${LETTERS[Q.answer]} is correct</h3><p>${esc(Q.rationale)}</p></div>
        <div><h3>Why the others are wrong</h3><ul class="why-not">${Object.entries(Q.distractors).map(([k, t]) => `<li><span class="l">${LETTERS[k]}</span><span><b>${esc(Q.options[k])}.</b> ${esc(t)}</span></li>`).join("")}</ul></div>
        ${Q.tip ? `<div class="tip"><h3>Exam tip</h3><p>${esc(Q.tip)}</p></div>` : ""}
        <div><h3>Sources</h3><ul class="refs">${Q.sources.map((r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}<span class="vh"> (opens in a new tab)</span></a>${r.note ? `<small>${esc(r.note)}</small>` : ""}</li>`).join("")}</ul></div>
      </section>` : "";

    main.innerHTML = `
    <div class="qhead">
      <span class="chip" style="color:${color(D)}">Domain ${Q.domain} · ${esc(Q.topic)}</span>
      <nav class="progress" aria-label="Questions">${progress}</nav>
    </div>
    <form id="qform" class="${checked ? "locked" : ""}">
      <fieldset>
        <legend><span class="qnum">Question ${i + 1}</span><span class="qtext" id="qtext" tabindex="-1">${esc(Q.question)}</span></legend>
        <div class="opts">${opts}</div>
      </fieldset>
      ${checked ? "" : `<div class="actions"><button class="btn" type="submit">Check answer</button></div><p class="hint" id="hint" aria-live="polite"></p>`}
    </form>
    <div id="result" aria-live="polite">${rationale}</div>
    <nav class="nav" aria-label="Question navigation">
      <button class="btn ghost" type="button" id="prev">${i === 0 ? "← Overview" : "← Previous"}</button>
      <button class="btn next" type="button" id="next">${last ? "Finish →" : "Next →"}</button>
    </nav>`;

    const form = document.getElementById("qform");
    form.addEventListener("change", (e) => {
      if (e.target.name !== "opt") return;
      state.picks[Q.id] = +e.target.value; save();
      const h = document.getElementById("hint"); if (h) h.textContent = "";
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (state.picks[Q.id] === undefined) { document.getElementById("hint").textContent = "Choose an answer first."; return; }
      state.checked[Q.id] = true; save();
      renderQ(i);
      document.getElementById("verdict").focus();
    });
    main.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => go(+b.dataset.go)));
    document.getElementById("prev").onclick = () => (i === 0 ? home() : go(i - 1));
    document.getElementById("next").onclick = () => (last ? home() : go(i + 1));
    if (focus) document.getElementById("qtext").focus();
  }

  // ---------- routing ----------
  // Deep links use the question id, e.g. #d1-social-model. #start is the landing page.
  function go(i) { setHash(QUESTIONS[i].id); renderQ(i, true); window.scrollTo(0, 0); }
  function home() { setHash("start"); renderHome(true); window.scrollTo(0, 0); }

  function route() {
    const id = (location.hash || "").slice(1);
    const i = QUESTIONS.findIndex((q) => q.id === id);
    if (i > -1) renderQ(i); else renderHome();
  }

  // ---------- boot ----------
  async function boot() {
    try {
      const [d, q] = await Promise.all([
        fetch("data/domains.json").then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }),
        fetch("data/questions.json").then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }),
      ]);
      EXAM = d.exam;
      d.domains.forEach((x) => (DOMAINS[x.id] = x));
      QUESTIONS = q;
    } catch (e) {
      main.innerHTML = `<p class="score">The question data could not load. If you opened index.html straight from your files, run a local server instead (see README).</p>`;
      return;
    }
    load();
    document.getElementById("home").onclick = home;
    route();
  }

  boot();
})();
