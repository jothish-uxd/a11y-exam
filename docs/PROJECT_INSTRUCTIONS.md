# Project: a11y – exam prep

## Goal
Build CPACC Practice Sheets, a free, accessible study site for the IAAP CPACC exam. Every question explains why the correct answer is right, why each wrong answer is wrong, and links to real primary sources. The site will live on GitHub Pages.

## Who I am
I'm a staff product designer with deep accessibility experience. Skip beginner explanations of accessibility concepts. I use a MacBook with keyboard and trackpad, so give Mac commands and shortcuts.

## Source of truth
- Exam structure, domain weights and topics: the IAAP CPACC Body of Knowledge (October 2023), captured in `data/domains.json`. Weights are 40 / 40 / 20. WCAG is Domain 2C.
- Question bank: `data/questions.json`. Follow the schema in the repo README exactly.
- Current status and decisions: `docs/HANDOFF.md`.

## Rules for content
- Use the cpacc-question-author skill whenever writing or editing questions.
- Every source must be real. Search for or fetch each URL before citing it. Never cite from memory alone.
- Prefer primary sources: IAAP, W3C/WAI, WHO, UN, WIPO, official legal texts (ADA, Section 508, EN 301 549, AODA, ACA, Equality Act 2010).
- Paraphrase. Don't copy passages from sources.
- These are original practice questions, never presented as official IAAP items.
- If a fact can't be verified, say so instead of guessing.

## Rules for the site
- Plain HTML, CSS and JavaScript. No framework or build step unless I ask.
- The site teaches accessibility, so it must model it: native form controls, visible focus, text alongside color, announced results, keyboard and VoiceOver friendly, reduced motion respected, works at 400px width.
- Keep content in JSON and logic in `js/app.js`. Run `node scripts/validate.mjs` after any data change.
- Deliver code changes as a branch and pull request on this repo.
