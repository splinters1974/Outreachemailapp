# Ameresco Outreach

A local app that turns a contact CSV into tailored first-touch outreach emails, ready to review and send from Outlook.

**How it works:** upload a CSV of contacts → pick a company → pick a person → the app researches the company from its website and drafts an email tailored to that person's job role, grounded in the Ameresco value proposition → one click opens the draft in Outlook for you to review, tweak, and send. Nothing is ever sent automatically.

## Setup (one time)

1. Install [Node.js](https://nodejs.org) (LTS version) if you don't have it.
2. In this folder, run:
   ```
   npm install
   ```
3. Copy `.env.example` to a new file called `.env`, and paste in your Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com) → API Keys):
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

## Run it

```
npm start
```

Then open **http://localhost:3000** in your browser.

First visit: click **Settings** and

- replace the starter value proposition with Ameresco's official messaging (this is what the AI draws on — the better it is, the better the emails), and
- fill in your name/title so emails are signed correctly.

## Using it

1. **Upload CSV** — one row per contact. The app auto-detects columns (email, name, job title, company, website) and lets you correct the mapping. Only the Email column is required; company is inferred from the email domain if missing.
2. **Pick a company, then a person.**
3. **Research company** — fetches the company website and produces a short briefing. You can edit it or paste your own notes.
4. **Generate email** — choose tone, length and call-to-action. The angle adapts to the recipient's role (a CFO gets budget-neutral funding and guaranteed savings; a Facilities Director gets ageing-kit reliability; a Sustainability lead gets a net zero pathway, etc.).
5. **Open in Outlook** — opens a pre-filled draft in your default mail app for review. Or **Copy email** to paste anywhere.

## Privacy notes

- The CSV is parsed entirely in your browser and never uploaded or saved anywhere.
- Only the currently selected company/contact details are sent to the Anthropic API to write the email.
- Your API key stays in the local `.env` file on your machine (it is git-ignored).

## Notes & limits

- `mailto:` links (the Outlook handoff) are plain text and some systems truncate around ~1,800 characters — the app warns you and offers Copy instead. Short emails (the default) are always fine.
- Behind a corporate proxy? The website-research fetch respects the standard `HTTPS_PROXY` environment variable.
- Model can be changed with `ANTHROPIC_MODEL` in `.env` (default: `claude-opus-4-8`).
