# Handoff: CPACC Practice Sheets

_Last updated October 26, 2026._

## Where it stands
- Working site with Study and Mock exam modes, 22 sourced questions (9 / 9 / 4 across the domains), validator, GitHub Actions check, and docs.
- Lives in the GitHub repo jothish-uxd/a11y-exam. GitHub Pages is not turned on yet.
- A preview is published as the Claude artifact "CPACC Practice Sheets". It is generated from `index.html` with `node scripts/build-preview.mjs <out>` and published with the `css/`, `js/` and `data/` files alongside.

## Decisions made
- **Content is data.** Questions in `data/questions.json`; exam facts, domains, weights and Body of Knowledge topics in `data/domains.json`. Code never hard-codes question text.
- **Information architecture.**
  - Header on every page: Domain 1, Domain 2, Domain 3, All, plus Mock exam as a separate mode.
  - Domain pages group questions by Body of Knowledge topic (1.1–1.5, 2.1–2.6, 3.1–3.6) with a status for each question: not answered, correct, missed. Empty topics show "No questions yet" to keep coverage gaps visible.
  - Question pages: side panel list from 960px wide, bottom sheet (native `<dialog>`) below that, opened from the "Question N of M" button.
  - Previous and Next stay within the chosen scope; the last question in a domain offers the next domain.
  - Rejected: a numbered 1–40 side nav. Bare numbers give no information scent and don't fit on a phone.
- **Mock exam.** Up to 100 questions drawn by weight, 2-hour timer, live-region reminders at 30, 10, 5 and 1 minutes, auto-submit at zero, mark for review, review screen before submit, results by domain with links back into Study.
- **Links.** Every view has a bare hash token: `#start`, `#d1`/`#d2`/`#d3`/`#all`, topic ids like `#d2c`, question ids like `#d1-social-model`, `#mock`, `#mock-results`. Question ids are permanent.
- **Visual design.** Answer-sheet motif. Bricolage Grotesque (display), Atkinson Hyperlegible (body, chosen because it was designed for low-vision readers), IBM Plex Mono (labels). One accent, violet (`--accent`), for eyebrows, the exam tip callout and data bars; the same violet (`--action`) also drives links, focus rings, selection and button hovers, so there is no blue left. Domains are not color-coded. Full light and dark themes via CSS custom properties.
- **Progress** is saved in localStorage per device; the page works without it.

## Corrections made along the way
- Domain weights are **40 / 40 / 20** (Domain 2 is 40%, Domain 3 is 20%). An earlier version said 40 / 20 / 40.
- WCAG principles are **Domain 2.3**, not Domain 3. The WCAG question id changed to `d2-wcag-perceivable`.

## Question bank
22 questions (D1: 9, D2: 9, D3: 4). Topics 3.2 Regional instruments and 3.6 Integrating accessibility across the organization have no questions yet.

| id | Topic | Answer |
|---|---|---|
| d1-social-model | 1.1 Models of disability | Social model |
| d1-biopsychosocial-model | 1.1 Models of disability | Biopsychosocial model |
| d1-photosensitive-seizures | 1.2 Disability categories, barriers & solutions | People with photosensitive epilepsy |
| d1-dyslexia-barriers | 1.2 Disability categories, barriers & solutions | Short text sections with clear headings, plus text-to-speech |
| d1-refreshable-braille | 1.3 Assistive technologies & adaptive strategies | A screen reader sending output to a refreshable braille display |
| d1-switch-access | 1.3 Assistive technologies & adaptive strategies | Switch |
| d1-screen-magnification | 1.3 Assistive technologies & adaptive strategies | Keeping layout, navigation and visual cues consistent from page to page |
| d1-who-global-prevalence | 1.4 Demographics & statistics | About 1 in 6 people (around 1.3 billion) |
| d1-etiquette-interpreter | 1.5 Disability etiquette | Look at and speak directly to the guest, for example "What dates would you like?" |
| d2-accommodation-vs-ud | 2.1 Accommodations vs. universal design | Reasonable accommodation |
| d2-business-case-innovation | 2.2 Benefits of accessibility | Driving innovation |
| d2-wcag-perceivable | 2.3 Web accessibility principles (WCAG) | Perceivable |
| d2-wcag-keyboard-trap | 2.3 Web accessibility principles (WCAG) | Operable |
| d2-wcag-conformance-levels | 2.3 Web accessibility principles (WCAG) | Meeting all Level A and Level AA success criteria |
| d2-ramp-slope | 2.4 Built environment | 1:12 |
| d2-situational-limitation | 2.5 Principles of universal design | Situational limitation |
| d2-ud-tolerance-for-error | 2.5 Principles of universal design | Tolerance for Error |
| d2-udl-representation | 2.6 Universal Design for Learning, usability & UX | Representation |
| d3-marrakesh-treaty | 3.1 International declarations & conventions | To make published works easier to get in accessible formats for people who are blind, visually impaired or otherwise print disabled |
| d3-ada-title-iii | 3.3 National & provincial laws | Title III |
| d3-section-508-wcag | 3.4 Domain-specific & procurement laws | ICT used or bought by federal agencies, referencing WCAG 2.0 Level A and AA |
| d3-en-301-549 | 3.5 Applying standards to ICT | The European standard setting accessibility requirements for ICT products and services |

## Next steps
1. Enable GitHub Pages from `main` once the site is merged.
2. Write questions, aiming at the exam split: for a 100-question bank, about 40 in Domain 1, 40 in Domain 2, 20 in Domain 3, spread across every topic.
3. Optional ideas: a "missed questions only" study filter, a per-topic progress summary, and a glossary page.

## Body of Knowledge reference
CPACC Body of Knowledge, October 2023 (hosted by Funka, an IAAP prep provider):
https://funka.com/globalassets/funka-academy-fr%C3%A5n-2023/iaap/cpacc_bok_oct2023.pdf
Check IAAP for a newer version before each exam cycle.
