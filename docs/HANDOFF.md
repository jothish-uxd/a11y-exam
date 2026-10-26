# Handoff: CPACC Practice Sheets

_Last updated October 25, 2026._

## Where it stands
- Working site with Study and Mock exam modes, 4 sourced questions (one or more in each domain), validator, GitHub Actions check, and docs.
- Lives in the GitHub repo jothish-uxd/a11y-exam. GitHub Pages is not turned on yet.
- A preview is published as the Claude artifact "CPACC Practice Sheets". It is generated from `index.html` with `node scripts/build-preview.mjs <out>` and published with the `css/`, `js/` and `data/` files alongside.

## Decisions made
- **Content is data.** Questions in `data/questions.json`; exam facts, domains, weights and Body of Knowledge topics in `data/domains.json`. Code never hard-codes question text.
- **Information architecture.**
  - Header on every page: Domain 1, Domain 2, Domain 3, All, plus Mock exam as a separate mode.
  - Domain pages group questions by Body of Knowledge topic (1A–1E, 2A–2F, 3A–3F) with a status for each question: not answered, correct, missed. Empty topics show "No questions yet" to keep coverage gaps visible.
  - Question pages: side panel list from 960px wide, bottom sheet (native `<dialog>`) below that, opened from the "Question N of M" button.
  - Previous and Next stay within the chosen scope; the last question in a domain offers the next domain.
  - Rejected: a numbered 1–40 side nav. Bare numbers give no information scent and don't fit on a phone.
- **Mock exam.** Up to 100 questions drawn by weight, 2-hour timer, live-region reminders at 30, 10, 5 and 1 minutes, auto-submit at zero, mark for review, review screen before submit, results by domain with links back into Study.
- **Links.** Every view has a bare hash token: `#start`, `#d1`/`#d2`/`#d3`/`#all`, topic ids like `#d2c`, question ids like `#d1-social-model`, `#mock`, `#mock-results`. Question ids are permanent.
- **Visual design.** Answer-sheet motif. Bricolage Grotesque (display), Atkinson Hyperlegible (body, chosen because it was designed for low-vision readers), IBM Plex Mono (labels). Domain colors: cobalt, violet, teal. Full light and dark themes via CSS custom properties.
- **Progress** is saved in localStorage per device; the page works without it.

## Corrections made along the way
- Domain weights are **40 / 40 / 20** (Domain 2 is 40%, Domain 3 is 20%). An earlier version said 40 / 20 / 40.
- WCAG principles are **Domain 2C**, not Domain 3. The WCAG question id changed to `d2-wcag-perceivable`.

## Question bank
| id | Topic | Answer |
|---|---|---|
| d1-social-model | 1A Models of disability | Social model |
| d2-wcag-perceivable | 2C WCAG principles | Perceivable |
| d2-situational-limitation | 2E Universal design | Situational limitation |
| d3-marrakesh-treaty | 3A International conventions | Accessible copies of published works |

## Next steps
1. Enable GitHub Pages from `main` once the site is merged.
2. Write questions, aiming at the exam split: for a 100-question bank, about 40 in Domain 1, 40 in Domain 2, 20 in Domain 3, spread across every topic.
3. Optional ideas: a "missed questions only" study filter, a per-topic progress summary, and a glossary page.

## Body of Knowledge reference
CPACC Body of Knowledge, October 2023 (hosted by Funka, an IAAP prep provider):
https://funka.com/globalassets/funka-academy-fr%C3%A5n-2023/iaap/cpacc_bok_oct2023.pdf
Check IAAP for a newer version before each exam cycle.
