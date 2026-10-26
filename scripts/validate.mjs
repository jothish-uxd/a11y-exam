// Checks data/questions.json against the question schema described in README.md.
// Run: node scripts/validate.mjs   (no dependencies)
import { readFileSync } from "node:fs";

const root = new URL("..", import.meta.url);
const domains = JSON.parse(readFileSync(new URL("data/domains.json", root))).domains;
const questions = JSON.parse(readFileSync(new URL("data/questions.json", root)));
const domainIds = new Set(domains.map((d) => d.id));
const topicDomain = {};
domains.forEach((d) => (d.topics || []).forEach((t) => (topicDomain[t.id] = d.id)));
const weightSum = domains.reduce((s, d) => s + d.weight, 0);
if (weightSum !== 100) console.error(`✗ domain weights add up to ${weightSum}, not 100`), process.exit(1);

const errors = [];
const ids = new Set();
const err = (id, msg) => errors.push(`${id}: ${msg}`);

questions.forEach((q, n) => {
  const id = q.id || `#${n + 1}`;
  if (!/^[a-z0-9-]+$/.test(q.id || "")) err(id, "id must be lowercase letters, digits and hyphens");
  if (ids.has(q.id)) err(id, "duplicate id");
  ids.add(q.id);
  if (!domainIds.has(q.domain)) err(id, `domain ${q.domain} is not in domains.json`);
  if (!q.id?.startsWith(`d${q.domain}-`)) err(id, `id should start with d${q.domain}-`);
  if (!(q.topic in topicDomain)) err(id, `topic "${q.topic}" is not a topic id in domains.json`);
  else if (topicDomain[q.topic] !== q.domain) err(id, `topic ${q.topic} belongs to domain ${topicDomain[q.topic]}, not ${q.domain}`);
  for (const f of ["topic", "question", "rationale"]) if (!q[f] || typeof q[f] !== "string") err(id, `missing ${f}`);
  if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6) err(id, "options must have 2–6 entries");
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options || []).length) err(id, "answer must index into options");
  const wrong = (q.options || []).map((_, k) => k).filter((k) => k !== q.answer);
  for (const k of wrong) if (!q.distractors?.[k]) err(id, `distractors is missing an explanation for option ${k}`);
  if (q.distractors?.[q.answer] !== undefined) err(id, "distractors should not explain the correct option");
  if (!Array.isArray(q.sources) || q.sources.length < 1) err(id, "needs at least one source");
  (q.sources || []).forEach((s, k) => {
    if (!s.title) err(id, `source ${k} has no title`);
    try { if (new URL(s.url).protocol !== "https:") err(id, `source ${k} must use https`); }
    catch { err(id, `source ${k} url is invalid`); }
  });
});

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n  ` + errors.join("\n  "));
  process.exit(1);
}
const byDomain = domains.map((d) => `D${d.id}: ${questions.filter((q) => q.domain === d.id).length}`).join(", ");
console.log(`✓ ${questions.length} questions valid (${byDomain})`);
