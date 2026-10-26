# Question schema

```json
{
  "id": "d1-social-model",
  "domain": 1,
  "topic": "d1a",
  "question": "Which model of disability holds that people are disabled mainly by barriers in society and the built environment, rather than by their impairments?",
  "options": ["Medical model", "Social model", "Charity model", "Economic model"],
  "answer": 1,
  "rationale": "Why the correct answer is correct, in 3–5 sentences.",
  "distractors": {
    "0": "Why option 0 is wrong.",
    "2": "Why option 2 is wrong.",
    "3": "Why option 3 is wrong."
  },
  "tip": "Optional exam strategy.",
  "sources": [
    { "title": "Source name", "url": "https://…", "note": "What the reader finds there." }
  ]
}
```

| Field | Rule |
|---|---|
| `id` | `d<domain>-<short-slug>`, lowercase letters, digits and hyphens. Permanent once published. |
| `domain` | 1, 2 or 3. |
| `topic` | A topic id from `bok-topics.md` belonging to the same domain. |
| `options` | 2–6 strings; use 4. |
| `answer` | Zero-based index of the correct option. |
| `distractors` | Every wrong option's index, and never the correct one. |
| `sources` | At least one; HTTPS only. |
