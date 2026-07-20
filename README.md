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
- **Uploaded contacts and the "emailed" markers are remembered in your browser** (localStorage) — they survive refreshes and revisits, and never touch a server. Use "Clear saved contacts" to reset, or generate on a different device/browser and they won't carry over.
- The **"emailed" badge** records the moment you clicked *Open in Outlook* for that person — it's a "prepared/sent" marker, not proof the mail actually left your outbox.
- **Greeting** — pick *Good morning/afternoon* (chosen from your local clock at generation time), *Hi*, *Hello*, or *Dear*.
- **Signature** — add it in Settings (text plus an optional image). The text goes into the *Open in Outlook* draft; the **image** can't travel through a `mailto:` link, so use **Copy formatted (with signature)** and paste into Outlook/Gmail to include it. The signature is applied locally at export and is never sent to the AI.

### Models & cost

To keep API spend down, the two AI calls use different models by default:

| Task | Default model | Why |
|---|---|---|
| Company research | `claude-haiku-4-5` | Summarising a website is easy — the cheapest model is plenty. |
| Email writing | `claude-sonnet-5` | The deliverable; a stronger writer, but far cheaper than Opus. |

Override with environment variables: `ANTHROPIC_MODEL_RESEARCH`, `ANTHROPIC_MODEL_GENERATE`, or `ANTHROPIC_MODEL` (sets both). The value proposition is sent with prompt caching, so generating several emails in one sitting reuses it cheaply. As a rough guide, a research + email pair costs well under a US cent at these defaults.

## Project layout

```
public/                  static frontend (served by Netlify's CDN)
netlify/functions/       serverless API: status, research, generate
netlify/shared/          code shared by the functions
dev-server.js            local dev server that mounts the same functions
```
