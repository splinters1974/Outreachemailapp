# Ameresco Outreach

Turns a contact CSV into tailored first-touch outreach emails, ready to review and send from Outlook.

**How it works:** upload a CSV of contacts → pick a company → pick a person → the app researches the company from its website and drafts an email tailored to that person's job role, grounded in the Ameresco value proposition → one click opens the draft in Outlook for you to review, tweak, and send. Nothing is ever sent automatically.

Runs two ways: **hosted on Netlify** (a shareable link, recommended) or **locally on your machine**.

## Deploy to Netlify

1. In [Netlify](https://app.netlify.com): **Add new site → Import an existing project**, pick this GitHub repo. The included `netlify.toml` configures everything — just deploy.
2. In **Site configuration → Environment variables**, add:
   - `ANTHROPIC_API_KEY` — your key from [console.anthropic.com](https://console.anthropic.com) *(required)*
   - `APP_PASSCODE` — any passcode you choose *(strongly recommended — anyone with the link uses your API credits; visitors are asked for this passcode once)*
3. Redeploy after adding the variables. Done — share the site URL.

## Run locally

```
npm install
npm start          # then open http://localhost:3000
```

Put your API key in a `.env` file first (copy `.env.example`). The local server runs the exact same code as the Netlify deployment.

## Using it

1. **Upload CSV** — one row per contact. Columns are auto-detected (email, name, job title, company, website) with a correction step. Only Email is required; company is inferred from the email domain if missing.
2. **Pick a company, then a person.**
3. **Research company** — fetches the company website and streams a short briefing you can edit or replace with your own notes.
4. **Generate email** — choose tone, length and call-to-action. The angle adapts to the recipient's role (a CFO gets budget-neutral funding and guaranteed savings; a Facilities Director gets ageing-kit reliability; a Sustainability lead gets a net zero pathway, etc.).
5. **Open in Outlook** — opens a pre-filled draft in your default mail app. Or **Copy email** to paste anywhere.

First visit, open **Settings** and paste in Ameresco's official value proposition (a starter draft is bundled) and your name/title for the sign-off.

## Privacy notes

- The CSV is parsed entirely in the browser and never uploaded or saved anywhere.
- Only the currently selected company/contact details are sent to the Anthropic API to write the email.
- Settings (value proposition, sender details, passcode) are stored in the browser's localStorage — the server keeps nothing.
- The API key lives in Netlify's environment variables (or the local `.env`), never in the page or the repo.

## Notes & limits

- `mailto:` links (the Outlook handoff) are plain text and some systems truncate around ~1,800 characters — the app warns you and offers Copy instead. Short emails (the default) are always fine.
- Responses stream from the serverless functions, which keeps within Netlify's function time limits even when the model thinks for a while.
- Model can be changed with the `ANTHROPIC_MODEL` environment variable (default: `claude-opus-4-8`).

## Project layout

```
public/                  static frontend (served by Netlify's CDN)
netlify/functions/       serverless API: status, research, generate
netlify/shared/          code shared by the functions
dev-server.js            local dev server that mounts the same functions
```
