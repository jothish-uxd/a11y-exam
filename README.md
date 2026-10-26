# CPACC Practice Sheets

Practice questions for the IAAP **Certified Professional in Accessibility Core Competencies (CPACC)** exam. Every question explains why the right answer is right, why each wrong answer is wrong, and links to primary sources (IAAP, W3C, WHO, UN, and others).

No build step, no dependencies. Plain HTML, CSS and JavaScript, with all content in JSON.

## Project layout

```
index.html              Page shell
css/styles.css          All styles; light and dark themes via CSS custom properties
js/app.js               Rendering, navigation, progress (localStorage)
data/domains.json       Exam facts and the three CPACC domains with weights
data/questions.json     The question bank
scripts/validate.mjs    Schema check for the question bank (Node, no deps)
.github/workflows/      Runs the validator on every push and PR that touches data/
CLAUDE.md               Conventions for Claude Code sessions in this repo
```

## Run it locally (Mac)

The page loads JSON with `fetch`, so open it through a local server, not by double-clicking the file.

```sh
cd cpacc-practice
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Add a question

Append an object to `data/questions.json`, then run `node scripts/validate.mjs`.

| Field         | Type                | Notes |
|---------------|---------------------|-------|
| `id`          | string              | Stable, lowercase, hyphenated, prefixed with domain: `d1-social-model`. Used for deep links (`#d1-social-model`) and saved progress. Never rename a published id. |
| `domain`      | 1 \| 2 \| 3         | Must match an id in `data/domains.json`. |
| `topic`       | string              | Short label shown in the domain chip. |
| `question`    | string              | The stem. |
| `options`     | string[]            | Usually 4 (the CPACC format). |
| `answer`      | number              | Zero-based index into `options`. |
| `rationale`   | string              | Why the correct answer is correct. |
| `distractors` | `{ "index": text }` | One explanation for every wrong option, keyed by its index. |
| `tip`         | string (optional)   | Exam strategy related to the question. |
| `sources`     | `{title,url,note}[]`| At least one. HTTPS only. Prefer primary sources. |

## Deploy to GitHub Pages

1. Create a repo and push this folder.
2. In the repo, open **Settings → Pages**, set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. The site appears at `https://<user>.github.io/<repo>/`.

## Content notes

- These are original practice questions, not official IAAP exam items.
- Exam facts (100 questions, 2 hours, 40/20/40 domain weights) come from the IAAP CPACC Body of Knowledge. Check the current version before each exam cycle.
- Write rationales in your own words. Do not paste text from sources.
