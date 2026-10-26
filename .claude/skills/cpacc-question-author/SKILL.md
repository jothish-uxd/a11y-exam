---
name: cpacc-question-author
description: Write or revise CPACC practice questions for the CPACC Practice Sheets site, in its JSON schema, with explanations for every option and verified primary sources. Use when asked to add, draft, review or fix CPACC questions.
---

# Writing CPACC practice questions

Produce questions that drop straight into `data/questions.json` and pass `node scripts/validate.mjs`.

## Before writing
1. Read `references/bok-topics.md` and pick the topic id (e.g. `d1c`). The question must test something in that Body of Knowledge section.
2. Check the existing bank (`data/questions.json`) so you don't repeat a concept or an id.
3. Research first. Search for or fetch every source you plan to cite and confirm the page exists and supports the claim. Never cite a URL from memory alone. If you can't verify a fact, leave it out.

## Writing the question
- One clear stem. Scenario stems ("A user who…") are good; CPACC favors applying a concept over recalling a definition.
- Four options, exactly one correct. Distractors should be real terms from the same topic, plausible to someone half-prepared, and similar in length and grammar to the answer.
- Avoid "all of the above", "none of the above", negatives like "Which is NOT…", and trick wording.
- Vary the correct position across a batch (A, B, C, D roughly evenly).

## Writing the explanations
- `rationale`: 3–5 sentences explaining the concept, not just restating the answer. Include a concrete example where it helps.
- `distractors`: one entry for every wrong option, keyed by its index, saying what that option actually means and why it doesn't fit.
- `tip`: optional. An exam strategy or memory aid tied to the topic.
- Plain language, active voice, short sentences. Paraphrase sources; never copy their wording.

## Sources
- 1–3 per question, HTTPS only, each with `title`, `url` and a one-line `note` saying what the reader will find there.
- Prefer primary sources: IAAP Body of Knowledge, W3C/WAI, WHO, UN, WIPO, official legal texts and government sites. Use secondary sources (university, Microsoft Inclusive Design, Deque) only when no primary source covers the point.

## Output
Return the question objects as JSON, matching `references/schema.md`. Then:
1. Append them to `data/questions.json`.
2. Run `node scripts/validate.mjs` and fix anything it reports.
3. Report the new ids, their topics, and the updated count per domain against the 40 / 40 / 20 target.

## Quality check before finishing
- Would a subject expert agree the answer is unambiguously correct?
- Does every wrong option have an explanation?
- Did you actually open every source URL?
- Is any sentence copied from a source? Rewrite it.
