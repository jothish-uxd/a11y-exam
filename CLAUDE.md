# CPACC Practice Sheets — notes for Claude

Static study site for the IAAP CPACC exam. No framework, no build, no dependencies. Keep it that way unless asked.

## Where things go
- Questions: `data/questions.json` only. Never hard-code question text in `js/app.js`.
- Exam facts and domain weights: `data/domains.json`.
- Styling: `css/styles.css`. Every color is a custom property on `:root`, redefined for dark mode in both the `prefers-color-scheme` block and `[data-theme="dark"]`. Add new colors the same way.
- After editing data, run `node scripts/validate.mjs`. It must pass.

- Routes are bare hash tokens (letters, digits, hyphens) handled in `route()` in `js/app.js`. See the table in README.md. Keep links as real `<a href="#…">` elements.
- The Claude artifact preview is generated from `index.html` by `node scripts/build-preview.mjs <out>`. Only markup between the `SHELL:START` and `SHELL:END` comments is used, so keep page markup there.

## Information architecture
- Study mode: domain → Body of Knowledge topic → question. Prev/Next stays within the chosen scope.
- Mock exam: weighted draw (from `weight` in domains.json), 2-hour timer, mark for review, results by domain linking back to Study.
- Topics with no questions still show ("No questions yet") so gaps in coverage stay visible.

## Writing questions
- `topic` must be a topic id from `data/domains.json` in the same domain. Domain weights must total 100.
- Four options, one correct. Plausible distractors drawn from the same CPACC topic.
- `rationale` explains the concept, not just the label. `distractors` explains every wrong option.
- Every source must be real and reachable. Fetch each URL before adding it. Prefer IAAP, W3C/WAI, WHO, UN, government legal texts (ADA, Section 508, EN 301 549, AODA, ACA), and the CPACC Body of Knowledge.
- Paraphrase. No copied passages from sources.
- Keep domain balance close to the exam weights: 40% domain 1, 40% domain 2, 20% domain 3 (Body of Knowledge, Oct 2023).
- `id` format: `d<domain>-<short-slug>`. Never change an existing id; saved progress and deep links depend on it.

## Accessibility is the product
This site teaches accessibility, so it must model it:
- Answers are native radio inputs in a `fieldset` with a `legend`.
- Results are announced through `aria-live` and focus moves to the verdict.
- Correct and incorrect states always carry text, never color alone.
- Visible focus on every control, 44px minimum targets, `prefers-reduced-motion` respected.
- Test with VoiceOver (Cmd+F5) and keyboard only before shipping UI changes.
