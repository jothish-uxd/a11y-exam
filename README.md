# CPACC Practice Sheets

Practice questions for the IAAP **Certified Professional in Accessibility Core Competencies (CPACC)** exam. Every question explains why the right answer is right, why each wrong answer is wrong, and links to primary sources (IAAP, W3C, WHO, UN, and others).

No build step, no dependencies. Plain HTML, CSS and JavaScript, with all content in JSON.

## Project layout

```
index.html                 Page shell (header, dialog, live region)
css/styles.css             All styles; light and dark themes via CSS custom properties
js/app.js                  Routing, rendering, saved progress (localStorage)
data/domains.json          Exam facts, the three domains, weights, and Body of Knowledge topics
data/questions.json        The question bank
scripts/validate.mjs       Schema check for the data (Node, no deps)
scripts/build-preview.mjs  Builds the Claude artifact preview shell from index.html
.github/workflows/         Runs the validator on every push and PR that touches data/
CLAUDE.md                  Conventions for Claude Code sessions in this repo
docs/HANDOFF.md            Where the work stands: decisions, corrections, next steps
docs/PROJECT_INSTRUCTIONS.md  Goals and rules for content and the site
.claude/skills/            cpacc-question-author skill for writing questions
```

## Information architecture

Two modes, both reachable from the header on every page.

**Study** — pick Domain 1, 2, 3 or All. Each domain page lists the Body of Knowledge topics (1.1, 1.2, …) with every question and its status: not answered, correct or missed. On a question page the same list sits in a side panel on wide screens and in a bottom sheet on phones (open it from the "Question 2 of 4" button). Previous and Next stay inside the chosen domain; the last question offers the next domain. Feedback appears after each answer.

**Mock exam** — 100 questions drawn at random from each domain's pool by exam weight (40 / 40 / 20), so a domain can hold more questions than its share and each attempt gets a fresh set. A pool smaller than its share is used whole and the setup screen says so. Each mock has a 2-hour timer with spoken reminders at 30, 10, 5 and 1 minutes, mark for review, and a review screen before submitting. Results break down by domain and link each missed question back into Study.

Every view has its own link:

| Link | View |
|---|---|
| `#start` | Landing page |
| `#d1` `#d2` `#d3` `#all` | Study overview for a domain, or all |
| `#d1a` … `#d3f` | A Body of Knowledge topic inside its domain |
| `#d1-social-model` | A single question (its `id`) |
| `#mock` | Mock exam |
| `#mock-results` | Last mock exam results |

## Run it locally (Mac)

The page loads JSON with `fetch`, so open it through a local server, not by double-clicking the file.

```sh
cd a11y-exam
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Add a question

Append an object to `data/questions.json`, then run `node scripts/validate.mjs`.

| Field         | Type                | Notes |
|---------------|---------------------|-------|
| `id`          | string              | Stable, lowercase, hyphenated, prefixed with domain: `d1-social-model`. Used for deep links (`#d1-social-model`) and saved progress. Never rename a published id. |
| `domain`      | 1 \| 2 \| 3         | Must match an id in `data/domains.json`. |
| `topic`       | string              | Topic id from `data/domains.json`, e.g. `d1a` (Body of Knowledge section 1.1). Must belong to the same domain. |
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
- Exam facts (100 questions, 2 hours) and domain weights (40 / 40 / 20) and topics come from the IAAP CPACC Body of Knowledge, October 2023. Check for a newer version before each exam cycle and update `data/domains.json`.
- Write rationales in your own words. Do not paste text from sources.
