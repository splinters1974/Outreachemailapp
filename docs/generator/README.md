# UK Competitor Analysis — document generator

Regenerates `docs/Ameresco-UK-Competitor-Analysis-2026.docx`.

```bash
cd docs/generator
npm install docx
node build.js ..
```

Content lives in `part1.js`–`part5.js`; `lib.js` holds the styling helpers
(headings, tables, callouts, threat-rating shading). Edit the parts and
re-run the build to produce an updated Word file.

| File | Sections |
|---|---|
| `part1.js` | Executive summary, how to use, scope/method, market context, competitive map |
| `part2.js` | Top ten competitor battlecards |
| `part3.js` | Three challengers, seven segment maps |
| `part4.js` | Technology-component competitors, capital, advisers, procurement routes |
| `part5.js` | Master threat matrix, conclusions, appendices |
