# Handoff: CPACC Practice Sheets

_Last updated October 26, 2026._

## Where it stands
- Working site with Study and Mock exam modes, 185 sourced questions (75 / 76 / 34 across the domains), validator, GitHub Actions check, and docs.
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
185 questions (D1: 75, D2: 76, D3: 34). Every domain is built out as a study pool larger than its mock share (40 / 40 / 20), so each mock attempt draws a different 100.

Options are written to similar lengths so the longest answer isn't a giveaway; keep that up when adding questions.

| id | Topic | Answer |
|---|---|---|
| d1-social-model | 1.1 Models of disability | Social model |
| d1-biopsychosocial-model | 1.1 Models of disability | Biopsychosocial model |
| d1-medical-model | 1.1 Models of disability | Medical model |
| d1-charity-model | 1.1 Models of disability | Charity model |
| d1-economic-model | 1.1 Models of disability | Economic model |
| d1-functional-solutions-model | 1.1 Models of disability | Functional solutions model |
| d1-social-identity-model | 1.1 Models of disability | Social identity model |
| d1-medical-model-weakness | 1.1 Models of disability | It often overlooks barriers caused by inaccessible environments |
| d1-social-model-impairment | 1.1 Models of disability | Impairment is a condition of body or mind; disability is the exclusion barriers cause |
| d1-social-model-weakness | 1.1 Models of disability | It can downplay embodied experiences such as pain and fatigue |
| d1-icf-contextual-factors | 1.1 Models of disability | Environmental factors and personal factors |
| d1-crpd-disability-definition | 1.1 Models of disability | People with long-term impairments that, with barriers, may hinder equal participation |
| d1-photosensitive-seizures | 1.2 Disability categories, barriers & solutions | People with photosensitive epilepsy |
| d1-dyslexia-barriers | 1.2 Disability categories, barriers & solutions | Short text sections with clear headings, plus text-to-speech |
| d1-capd | 1.2 Disability categories, barriers & solutions | Central auditory processing disorder |
| d1-sign-language-first-language | 1.2 Disability categories, barriers & solutions | Sign language may be their first language, and written text a second one |
| d1-deafblind-communication | 1.2 Disability categories, barriers & solutions | Tactile signing, felt through the hands of the person signing |
| d1-aphasia | 1.2 Disability categories, barriers & solutions | Aphasia |
| d1-voice-only-service | 1.2 Disability categories, barriers & solutions | Offer text-based contact, such as chat, email or a web form |
| d1-dyscalculia | 1.2 Disability categories, barriers & solutions | Showing progress as a visual bar alongside the percentage |
| d1-adhd-barrier | 1.2 Disability categories, barriers & solutions | Autoplaying animation and ads that can't be paused or hidden |
| d1-memory-passwords | 1.2 Disability categories, barriers & solutions | Passwords and access codes that must be recalled from memory |
| d1-cognitive-function-not-diagnosis | 1.2 Disability categories, barriers & solutions | People with one diagnosis vary widely, and many have no diagnosis |
| d1-mental-health-disclosure | 1.2 Disability categories, barriers & solutions | Stigma leads many people not to disclose, so supports should be built in |
| d1-color-only | 1.2 Disability categories, barriers & solutions | Add a text label or distinct shape so color isn't the only cue |
| d1-contrast-sensitivity | 1.2 Disability categories, barriers & solutions | Light gray body text on a white background |
| d1-tremor-targets | 1.2 Disability categories, barriers & solutions | Larger targets with more space between them |
| d1-temporary-situational | 1.2 Disability categories, barriers & solutions | A temporary disability and a situational limitation |
| d1-multiple-disabilities | 1.2 Disability categories, barriers & solutions | A solution for one may depend on an ability affected by another |
| d1-older-adults | 1.2 Disability categories, barriers & solutions | Several mild age-related changes often occur together |
| d1-refreshable-braille | 1.3 Assistive technologies & adaptive strategies | A screen reader with a braille display |
| d1-switch-access | 1.3 Assistive technologies & adaptive strategies | Switch |
| d1-screen-magnification | 1.3 Assistive technologies & adaptive strategies | Keeping layout and navigation consistent across pages |
| d1-screen-reader-output | 1.3 Assistive technologies & adaptive strategies | Synthesized speech or a refreshable braille display |
| d1-speech-recognition-user | 1.3 Assistive technologies & adaptive strategies | Speech recognition software |
| d1-text-to-speech-dyslexia | 1.3 Assistive technologies & adaptive strategies | Text-to-speech that highlights words as it reads aloud |
| d1-sip-and-puff | 1.3 Assistive technologies & adaptive strategies | A switch operated by inhaling or exhaling through a tube |
| d1-eye-tracking | 1.3 Assistive technologies & adaptive strategies | An eye-tracking system that moves the pointer with gaze |
| d1-head-pointer-mouth-stick | 1.3 Assistive technologies & adaptive strategies | Both let a person press keys or touch a screen without hands |
| d1-on-screen-keyboard | 1.3 Assistive technologies & adaptive strategies | Someone who can use a trackball or joystick but not a keyboard |
| d1-aac-types | 1.3 Assistive technologies & adaptive strategies | Both are forms of augmentative and alternative communication |
| d1-aac-myth | 1.3 Assistive technologies & adaptive strategies | AAC doesn't stop speech and can help language development |
| d1-cart | 1.3 Assistive technologies & adaptive strategies | Communication Access Realtime Translation (CART) |
| d1-auto-captions | 1.3 Assistive technologies & adaptive strategies | Automatic captions are often too inaccurate to rely on alone |
| d1-descriptive-transcript | 1.3 Assistive technologies & adaptive strategies | A descriptive transcript of the dialogue and key visuals |
| d1-hearing-aid-vs-cochlear | 1.3 Assistive technologies & adaptive strategies | It bypasses damaged parts of the ear to stimulate the hearing nerve |
| d1-visual-haptic-alerts | 1.3 Assistive technologies & adaptive strategies | Add a visual alert and vibration alongside the sound |
| d1-adaptive-strategy | 1.3 Assistive technologies & adaptive strategies | Increasing text size using the browser's built-in zoom |
| d1-keyboard-support | 1.3 Assistive technologies & adaptive strategies | Many use a keyboard or keyboard-like device instead of a mouse |
| d1-who-global-prevalence | 1.4 Demographics & statistics | About 1 in 6 people (around 1.3 billion) |
| d1-vision-impairment-prevalence | 1.4 Demographics & statistics | At least 2.2 billion |
| d1-vision-impairment-facts | 1.4 Demographics & statistics | About 1 billion cases could have been prevented or are unaddressed |
| d1-hearing-loss-prevalence | 1.4 Demographics & statistics | About 430 million |
| d1-hearing-2050 | 1.4 Demographics & statistics | Nearly 2.5 billion people will have some degree of hearing loss |
| d1-epilepsy-stats | 1.4 Demographics & statistics | Around 50 million people have it, and up to 70% could be seizure-free |
| d1-autism-prevalence | 1.4 Demographics & statistics | About 1 in 100 people |
| d1-at-need | 1.4 Demographics & statistics | Over 2.5 billion need it, yet access is as low as 3% in some poorer countries |
| d1-health-inequity | 1.4 Demographics & statistics | Some people with disabilities die up to 20 years earlier than others |
| d1-stats-limitations | 1.4 Demographics & statistics | Countries define and ask about disability in different ways |
| d1-dyslexia-prevalence | 1.4 Demographics & statistics | About 5 to 10 percent |
| d1-disability-growing | 1.4 Demographics & statistics | People are living longer and noncommunicable diseases are increasing |
| d1-etiquette-interpreter | 1.5 Disability etiquette | Look at and speak directly to the guest, for example "What dates would you like?" |
| d1-etiquette-ask-first | 1.5 Disability etiquette | Ask if they'd like help, and follow their lead if they accept |
| d1-etiquette-wheelchair-space | 1.5 Disability etiquette | Not leaning on, pushing or touching the chair without asking |
| d1-etiquette-guide-dog | 1.5 Disability etiquette | Leave it alone, since a working dog shouldn't be distracted |
| d1-etiquette-guiding | 1.5 Disability etiquette | Offer your arm, and describe steps and obstacles as you approach |
| d1-etiquette-leaving-landmark | 1.5 Disability etiquette | Next to a landmark, such as a wall, counter or chair |
| d1-etiquette-speech-understanding | 1.5 Disability etiquette | Ask him to repeat it, or to write or show it another way |
| d1-etiquette-deaf-attention | 1.5 Disability etiquette | Tap them lightly on the shoulder or wave within their view |
| d1-etiquette-wheelchair-user-term | 1.5 Disability etiquette | She is a wheelchair user |
| d1-etiquette-identity-first | 1.5 Disability etiquette | Use their preferred term when you refer to them |
| d1-etiquette-intellectual | 1.5 Disability etiquette | Use short, concrete sentences and check understanding |
| d1-etiquette-relay-call | 1.5 Disability etiquette | Stay on the line and speak to the caller, allowing for pauses |
| d1-etiquette-chemical-sensitivity | 1.5 Disability etiquette | Limit fragranced products and spray cleaners onto a cloth |
| d1-etiquette-euphemisms | 1.5 Disability etiquette | Plain terms such as 'person with a disability' |
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
2. Keep the pools fresh: review sources and figures when WHO, W3C or IAAP update them (the Body of Knowledge and WHO fact sheets change every few years), and fix any source links that stop working.
3. Optional ideas: a "missed questions only" study filter, a per-topic progress summary, and a glossary page.

## Body of Knowledge reference
CPACC Body of Knowledge, October 2023 (hosted by Funka, an IAAP prep provider):
https://funka.com/globalassets/funka-academy-fr%C3%A5n-2023/iaap/cpacc_bok_oct2023.pdf
Check IAAP for a newer version before each exam cycle.
