# Handoff: CPACC Practice Sheets

_Last updated October 26, 2026._

## Where it stands
- Working site with Study and Mock exam modes, 119 sourced questions (9 / 76 / 34 across the domains), validator, GitHub Actions check, and docs.
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
- **Mock exam.** A random 40 / 40 / 20 draw from each domain's pool (shares of `exam.questions` by `weight`). Pools can be larger than their share; a smaller pool is used whole, other domains don't top it up, and the setup screen names the short domains. 2-hour timer, live-region reminders at 30, 10, 5 and 1 minutes, auto-submit at zero, mark for review, review screen before submit, results by domain with links back into Study.
- **Links.** Every view has a bare hash token: `#start`, `#d1`/`#d2`/`#d3`/`#all`, topic ids like `#d2c`, question ids like `#d1-social-model`, `#mock`, `#mock-results`. Question ids are permanent.
- **Visual design.** Answer-sheet motif. Bricolage Grotesque (display), Atkinson Hyperlegible (body, chosen because it was designed for low-vision readers), IBM Plex Mono (labels). One accent, violet (`--accent`), for eyebrows, the exam tip callout and data bars; the same violet (`--action`) also drives links, focus rings, selection and button hovers, so there is no blue left. Domains are not color-coded. Full light and dark themes via CSS custom properties.
- **Progress** is saved in localStorage per device; the page works without it.

## Corrections made along the way
- Domain weights are **40 / 40 / 20** (Domain 2 is 40%, Domain 3 is 20%). An earlier version said 40 / 20 / 40.
- WCAG principles are **Domain 2.3**, not Domain 3. The WCAG question id changed to `d2-wcag-perceivable`.

## Question bank
119 questions (D1: 9, D2: 76, D3: 34). Domains 2 and 3 are built out as study pools larger than their mock shares (40 and 20). Domain 1 needs at least 31 more for a full 100-question mock.

Options are written to similar lengths so the longest answer isn't a giveaway; keep that up when adding questions.

| id | Topic | Answer |
|---|---|---|
| d1-social-model | 1.1 Models of disability | Social model |
| d1-biopsychosocial-model | 1.1 Models of disability | Biopsychosocial model |
| d1-photosensitive-seizures | 1.2 Disability categories, barriers & solutions | People with photosensitive epilepsy |
| d1-dyslexia-barriers | 1.2 Disability categories, barriers & solutions | Short text sections with clear headings, plus text-to-speech |
| d1-refreshable-braille | 1.3 Assistive technologies & adaptive strategies | A screen reader with a braille display |
| d1-switch-access | 1.3 Assistive technologies & adaptive strategies | Switch |
| d1-screen-magnification | 1.3 Assistive technologies & adaptive strategies | Keeping layout and navigation consistent across pages |
| d1-who-global-prevalence | 1.4 Demographics & statistics | About 1 in 6 people (around 1.3 billion) |
| d1-etiquette-interpreter | 1.5 Disability etiquette | Look at and speak directly to the guest, for example "What dates would you like?" |
| d2-accommodation-vs-ud | 2.1 Accommodations vs. universal design | Reasonable accommodation |
| d2-accommodation-employer-choice | 2.1 Accommodations vs. universal design | Yes, if it is equally effective; the employer chooses among effective options |
| d2-accommodation-request | 2.1 Accommodations vs. universal design | Yes, a request can be made in plain, everyday language |
| d2-undue-hardship | 2.1 Accommodations vs. universal design | Significant difficulty or expense for that employer |
| d2-accommodation-essential-functions | 2.1 Accommodations vs. universal design | Removing an essential job function or lowering a standard |
| d2-accommodation-application-process | 2.1 Accommodations vs. universal design | A change to the job application process |
| d2-accommodation-personal-items | 2.1 Accommodations vs. universal design | No, personal-use items needed both on and off the job generally aren't required |
| d2-ud-and-assistive-devices | 2.1 Accommodations vs. universal design | Universal design still allows assistive devices where needed |
| d2-proactive-captioning | 2.1 Accommodations vs. universal design | A is universal design; B is accommodation on request |
| d2-interactive-process | 2.1 Accommodations vs. universal design | A collaborative conversation to find an effective accommodation |
| d2-business-case-innovation | 2.2 Benefits of accessibility | Driving innovation |
| d2-benefit-transcripts-search | 2.2 Benefits of accessibility | Wider market reach and discoverability |
| d2-benefit-legal-risk | 2.2 Benefits of accessibility | Minimizing legal risk |
| d2-benefit-situational | 2.2 Benefits of accessibility | People using a phone in bright sunlight |
| d2-benefit-older-users | 2.2 Benefits of accessibility | Age-related changes overlap with needs WCAG covers |
| d2-benefit-build-in-early | 2.2 Benefits of accessibility | Because it is more efficient than retrofitting accessibility later |
| d2-benefit-purple-pound | 2.2 Benefits of accessibility | The Purple Pound |
| d2-benefit-brand | 2.2 Benefits of accessibility | Enhancing the brand |
| d2-benefit-slow-connections | 2.2 Benefits of accessibility | People with slow or expensive internet connections |
| d2-benefit-mobile-overlap | 2.2 Benefits of accessibility | Phone and other small-screen users |
| d2-wcag-perceivable | 2.3 Web accessibility principles (WCAG) | Perceivable |
| d2-wcag-keyboard-trap | 2.3 Web accessibility principles (WCAG) | Operable |
| d2-wcag-conformance-levels | 2.3 Web accessibility principles (WCAG) | Meeting all Level A and Level AA success criteria |
| d2-wcag-decorative-images | 2.3 Web accessibility principles (WCAG) | Hide it from assistive technology, for example with an empty alt attribute |
| d2-wcag-info-relationships | 2.3 Web accessibility principles (WCAG) | 1.3.1 Info and Relationships |
| d2-wcag-use-of-color | 2.3 Web accessibility principles (WCAG) | Add a visible asterisk, explained in the form instructions |
| d2-wcag-contrast-ratios | 2.3 Web accessibility principles (WCAG) | At least 4.5:1 |
| d2-wcag-resize-text | 2.3 Web accessibility principles (WCAG) | 200% |
| d2-wcag-reflow | 2.3 Web accessibility principles (WCAG) | 1.4.10 Reflow |
| d2-wcag-audio-description | 2.3 Web accessibility principles (WCAG) | Audio description (1.2.5) |
| d2-wcag-timing-adjustable | 2.3 Web accessibility principles (WCAG) | Warn users before time runs out and let them extend it simply |
| d2-wcag-bypass-blocks | 2.3 Web accessibility principles (WCAG) | Adding a "Skip to main content" link at the top of each page |
| d2-wcag-focus-visible | 2.3 Web accessibility principles (WCAG) | Sighted people who navigate by keyboard |
| d2-wcag-focus-not-obscured | 2.3 Web accessibility principles (WCAG) | 2.4.11 Focus Not Obscured (Minimum) |
| d2-wcag-target-size | 2.3 Web accessibility principles (WCAG) | 24 by 24 CSS pixels |
| d2-wcag-language-of-page | 2.3 Web accessibility principles (WCAG) | 3.1.1 Language of Page |
| d2-wcag-on-input | 2.3 Web accessibility principles (WCAG) | 3.2.2 On Input |
| d2-wcag-error-identification | 2.3 Web accessibility principles (WCAG) | Identify the field in error and describe the error in text |
| d2-wcag-accessible-authentication | 2.3 Web accessibility principles (WCAG) | 3.3.8 Accessible Authentication (Minimum) |
| d2-wcag-name-role-value | 2.3 Web accessibility principles (WCAG) | 4.1.2 Name, Role, Value |
| d2-wcag-techniques-informative | 2.3 Web accessibility principles (WCAG) | Yes, because techniques are informative, not required |
| d2-ramp-slope | 2.4 Built environment | 1:12 |
| d2-clear-floor-space | 2.4 Built environment | 30 by 48 inches |
| d2-turning-space | 2.4 Built environment | A 60-inch circle, or a T-shaped space |
| d2-reach-range | 2.4 Built environment | 15 to 48 inches above the floor |
| d2-door-hardware | 2.4 Built environment | A lever handle that works with one hand and no twisting |
| d2-door-clear-width | 2.4 Built environment | 32 inches |
| d2-protruding-objects | 2.4 Built environment | Blind people who use a long cane, which sweeps below it |
| d2-van-accessible-parking | 2.4 Built environment | At least 1 in every 6 |
| d2-parking-access-aisle | 2.4 Built environment | To give room to transfer to a wheelchair or deploy a van lift |
| d2-tactile-signs | 2.4 Built environment | On the latch side wall, 48 to 60 inches above the floor |
| d2-accessible-route | 2.4 Built environment | 36 inches wide, running slope no steeper than 1:20 |
| d2-detectable-warnings | 2.4 Built environment | To warn blind pedestrians, by touch, of a street or drop-off |
| d2-changes-in-level | 2.4 Built environment | Up to 1/4 inch |
| d2-situational-limitation | 2.5 Principles of universal design | Situational limitation |
| d2-ud-tolerance-for-error | 2.5 Principles of universal design | Tolerance for Error |
| d2-ud-equitable-use | 2.5 Principles of universal design | Equitable Use |
| d2-ud-flexibility-in-use | 2.5 Principles of universal design | Flexibility in Use |
| d2-ud-simple-intuitive | 2.5 Principles of universal design | Simple and Intuitive Use |
| d2-ud-perceptible-information | 2.5 Principles of universal design | Perceptible Information |
| d2-ud-low-physical-effort | 2.5 Principles of universal design | Low Physical Effort |
| d2-ud-size-and-space | 2.5 Principles of universal design | Size and Space for Approach and Use |
| d2-ud-origin | 2.5 Principles of universal design | Ronald Mace's working group at NC State University, in 1997 |
| d2-ud-definition | 2.5 Principles of universal design | Designing so as many people as possible can use it, unadapted |
| d2-inclusive-solve-for-one | 2.5 Principles of universal design | Designing with disabled people yields solutions that help many |
| d2-inclusive-recognize-exclusion | 2.5 Principles of universal design | From designers' own biases and assumptions |
| d2-udl-representation | 2.6 Universal Design for Learning, usability & UX | Representation |
| d2-udl-engagement | 2.6 Universal Design for Learning, usability & UX | Engagement |
| d2-udl-action-expression | 2.6 Universal Design for Learning, usability & UX | Action & Expression |
| d2-udl-executive-function | 2.6 Universal Design for Learning, usability & UX | Design Options for Strategy Development |
| d2-usability-iso-definition | 2.6 Universal Design for Learning, usability & UX | Effectiveness, efficiency and satisfaction |
| d2-accessibility-vs-usability | 2.6 Universal Design for Learning, usability & UX | They overlap, but accessibility adds technical requirements |
| d2-user-testing-with-conformance | 2.6 Universal Design for Learning, usability & UX | Because users reveal problems conformance checks miss |
| d2-user-testing-recruiting | 2.6 Universal Design for Learning, usability & UX | Participants who match the site's audience, including novice assistive technology users |
| d2-user-testing-reporting | 2.6 Universal Design for Learning, usability & UX | With scope, methods and participants, and its limits stated |
| d2-coga-supplemental | 2.6 Universal Design for Learning, usability & UX | It goes beyond WCAG and isn't required for conformance |
| d3-marrakesh-treaty | 3.1 International declarations & conventions | To ease access to books in accessible formats for print-disabled people |
| d3-udhr-disability | 3.1 International declarations & conventions | It applies to everyone and names disability only once |
| d3-crpd-article-9 | 3.1 International declarations & conventions | Article 9, Accessibility |
| d3-crpd-general-principles | 3.1 International declarations & conventions | Respect for difference and human diversity |
| d3-crpd-optional-protocol | 3.1 International declarations & conventions | Individuals to bring complaints to the CRPD Committee |
| d3-crpd-consultation | 3.1 International declarations & conventions | Closely consult them, including via their own organizations |
| d3-crpd-purpose-definition | 3.1 International declarations & conventions | People with long-term impairments that, with barriers, hinder participation |
| d3-eu-charter-article-26 | 3.2 Regional instruments | Article 26, Integration of persons with disabilities |
| d3-african-charter-article-18 | 3.2 Regional instruments | A right of older and disabled people to special protection |
| d3-inter-american-convention | 3.2 Regional instruments | The Inter-American Convention on disability discrimination |
| d3-african-disability-protocol | 3.2 Regional instruments | Harmful practices such as ritual killings and abandonment |
| d3-european-accessibility-act | 3.2 Regional instruments | The European Accessibility Act |
| d3-web-accessibility-directive | 3.2 Regional instruments | An accessibility statement, with a way for users to report problems |
| d3-ada-title-iii | 3.3 National & provincial laws | Title III |
| d3-uk-anticipatory-duty | 3.3 National & provincial laws | Providers must plan ahead for the needs of disabled people in general, not wait for an individual request |
| d3-aoda-standards | 3.3 National & provincial laws | Through standards for public, private and non-profit bodies |
| d3-accessible-canada-act | 3.3 National & provincial laws | Federally regulated bodies, such as banks and airlines |
| d3-ada-definition-disability | 3.3 National & provincial laws | Being regarded as having an impairment |
| d3-ada-title-ii-web-rule | 3.3 National & provincial laws | WCAG 2.1 Level AA |
| d3-section-508-wcag | 3.4 Domain-specific & procurement laws | ICT used or bought by federal agencies, referencing WCAG 2.0 Level A and AA |
| d3-section-504 | 3.4 Domain-specific & procurement laws | Section 504 of the Rehabilitation Act |
| d3-air-carrier-access-act | 3.4 Domain-specific & procurement laws | Limiting the number of passengers with disabilities on a flight |
| d3-cvaa | 3.4 Domain-specific & procurement laws | The 21st Century Communications and Video Accessibility Act (CVAA) |
| d3-en-301-549 | 3.5 Applying standards to ICT | The European standard setting accessibility requirements for ICT products and services |
| d3-vpat-acr | 3.5 Applying standards to ICT | An Accessibility Conformance Report (ACR) |
| d3-wcag-iso-backwards-compatible | 3.5 Applying standards to ICT | It also conforms to WCAG 2.1 and 2.0 Level AA, because the versions are backwards compatible |
| d3-atag | 3.5 Applying standards to ICT | ATAG (Authoring Tool Accessibility Guidelines) |
| d3-wcag-em | 3.5 Applying standards to ICT | Explore the site, then test a structured and random sample |
| d3-maturity-model | 3.6 Integrating accessibility across the organization | Integrate |
| d3-accessibility-statement | 3.6 Integrating accessibility across the organization | Users; it needs a commitment, the standard and a contact |
| d3-involving-users | 3.6 Integrating accessibility across the organization | One person can't represent everyone, and launch is too late |
| d3-org-policy | 3.6 Integrating accessibility across the organization | The standard and level, the scope, and a timeline |
| d3-planning-initiate | 3.6 Integrating accessibility across the organization | Initiate |
| d3-arrm-ownership | 3.6 Integrating accessibility across the organization | The author is ultimately accountable for the task being done |

## Next steps
1. Enable GitHub Pages from `main` once the site is merged.
2. Grow Domain 1 to at least 40 questions (ideally a pool of about 75, like Domain 2) so a mock reaches 100. Each domain's pool can exceed its mock share; extra questions add variety between attempts.
3. Optional ideas: a "missed questions only" study filter, a per-topic progress summary, and a glossary page.

## Body of Knowledge reference
CPACC Body of Knowledge, October 2023 (hosted by Funka, an IAAP prep provider):
https://funka.com/globalassets/funka-academy-fr%C3%A5n-2023/iaap/cpacc_bok_oct2023.pdf
Check IAAP for a newer version before each exam cycle.
