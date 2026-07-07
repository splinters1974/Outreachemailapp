import "dotenv/config";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { setGlobalDispatcher, EnvHttpProxyAgent } from "undici";

// Respect corporate/system proxies for outbound website fetches.
if (process.env.HTTPS_PROXY || process.env.https_proxy) {
  setGlobalDispatcher(new EnvHttpProxyAgent());
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const VALUE_PROP_PATH = path.join(DATA_DIR, "value-prop.md");
const SETTINGS_PATH = path.join(DATA_DIR, "settings.json");
const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/vendor",
  express.static(path.join(__dirname, "node_modules", "papaparse"))
);

function readSettings() {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
  } catch {
    return {};
  }
}

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic();
}

const NO_KEY_MESSAGE =
  "No Anthropic API key found. Create a file named .env next to server.js containing:\n\nANTHROPIC_API_KEY=sk-ant-...\n\nthen restart the app (get a key at console.anthropic.com).";

// ---------------------------------------------------------------------------
// Status & settings
// ---------------------------------------------------------------------------

app.get("/api/status", (req, res) => {
  res.json({ hasApiKey: Boolean(process.env.ANTHROPIC_API_KEY), model: MODEL });
});

app.get("/api/value-prop", (req, res) => {
  let text = "";
  try {
    text = fs.readFileSync(VALUE_PROP_PATH, "utf8");
  } catch {
    /* first run without the file */
  }
  res.json({ text });
});

app.put("/api/value-prop", (req, res) => {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(VALUE_PROP_PATH, String(req.body.text ?? ""), "utf8");
  res.json({ ok: true });
});

app.get("/api/settings", (req, res) => {
  res.json(readSettings());
});

app.put("/api/settings", (req, res) => {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(req.body ?? {}, null, 2));
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// Company research
// ---------------------------------------------------------------------------

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
};

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchPageText(url) {
  const response = await fetch(url, {
    headers: FETCH_HEADERS,
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const html = await response.text();
  return htmlToText(html).slice(0, 12000);
}

async function collectWebsiteText(domain) {
  const base = domain.startsWith("http") ? domain : `https://${domain}`;
  const origin = new URL(base).origin;
  const pages = [];
  const errors = [];

  try {
    pages.push({ url: origin, text: await fetchPageText(origin) });
  } catch (err) {
    errors.push(`${origin}: ${err.message}`);
  }
  for (const suffix of ["/about", "/about-us"]) {
    if (pages.length >= 2) break;
    try {
      pages.push({
        url: origin + suffix,
        text: await fetchPageText(origin + suffix),
      });
    } catch {
      /* about pages are optional */
    }
  }
  return { pages, errors };
}

app.post("/api/research", async (req, res) => {
  const { companyName, domain } = req.body ?? {};
  if (!companyName) {
    return res.status(400).json({ error: "companyName is required." });
  }
  const client = getClient();
  if (!client) return res.status(400).json({ error: NO_KEY_MESSAGE });

  let websiteSection = "No website content could be retrieved.";
  let fetchNote = null;
  if (domain) {
    const { pages, errors } = await collectWebsiteText(domain);
    if (pages.length > 0) {
      websiteSection = pages
        .map((p) => `--- Content from ${p.url} ---\n${p.text}`)
        .join("\n\n");
    } else {
      fetchNote = `Could not fetch the website (${errors.join("; ")}). The summary below is based on the model's general knowledge and may be less current.`;
    }
  }

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      system:
        "You are a B2B sales researcher preparing a briefing for an Ameresco business development professional. " +
        "Ameresco is an energy efficiency, renewable energy, and energy infrastructure company. " +
        "Write concise, factual briefings. If you are unsure about something, say so rather than inventing details.",
      messages: [
        {
          role: "user",
          content:
            `Prepare a short briefing on the company "${companyName}"` +
            (domain ? ` (website: ${domain})` : "") +
            `.\n\nWebsite content retrieved just now:\n${websiteSection}\n\n` +
            "Combine the website content with what you reliably know about this company. Cover, in short labelled sections:\n" +
            "1. What they do — sector, offering, scale (sites/locations if evident).\n" +
            "2. Energy & sustainability angle — anything suggesting energy-intensive operations, ageing estate, net zero / ESG commitments, or regulatory pressure.\n" +
            "3. Likely priorities — what leadership at this company is probably focused on right now.\n" +
            "Keep the whole briefing under 250 words. Plain text, no markdown symbols.",
        },
      ],
    });
    const summary = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    res.json({ summary, fetchNote });
  } catch (err) {
    res.status(mapAnthropicStatus(err)).json({ error: friendlyError(err) });
  }
});

// ---------------------------------------------------------------------------
// Email generation
// ---------------------------------------------------------------------------

function personaGuidance(jobTitle) {
  const t = (jobTitle || "").toLowerCase();
  const buckets = [
    {
      match: /\b(cfo|finance|financial|treasurer|controller|accounting)\b/,
      angle:
        "Financial lens: budget-neutral funding (energy savings performance contracting), guaranteed savings, reduced operating costs, hedging against energy price volatility, no upfront capital.",
    },
    {
      match:
        /\b(facilit|estates|maintenance|building|property|site|plant|infrastructure)\b/,
      angle:
        "Operational lens: ageing equipment and deferred maintenance, reliability and comfort, reduced breakdowns, modernised HVAC/lighting/controls without draining the maintenance budget.",
    },
    {
      match: /\b(sustainab|esg|environment|carbon|net zero|climate|csr)\b/,
      angle:
        "Sustainability lens: credible, measurable carbon reduction, net zero pathway, renewable generation on site, data for ESG reporting, avoiding greenwash.",
    },
    {
      match: /\b(energy|utilities)\b/,
      angle:
        "Energy management lens: consumption visibility, tariff and demand optimisation, on-site generation and storage, practical peer-level engineering credibility.",
    },
    {
      match: /\b(procure|purchasing|buyer|category|commercial)\b/,
      angle:
        "Procurement lens: proven delivery frameworks, risk transfer via performance guarantees, single accountable partner across design/build/operate, whole-life cost.",
    },
    {
      match: /\b(ceo|chief executive|managing director|owner|president|founder|coo|operations director)\b/,
      angle:
        "Executive lens: strategic resilience and competitiveness, turning energy from a cost line into an asset, reputation with customers/investors, one to two sharp business outcomes rather than technical detail.",
    },
  ];
  const hits = buckets.filter((b) => b.match.test(t)).map((b) => b.angle);
  if (hits.length > 0) return hits.join("\n");
  return "No standard persona match — infer their likely priorities from the job title and company context, and keep the angle business-outcome led.";
}

const EMAIL_SCHEMA = {
  type: "object",
  properties: {
    subject: {
      type: "string",
      description: "Email subject line, under 60 characters, no clickbait.",
    },
    body: {
      type: "string",
      description:
        "Full plain-text email body including greeting and sign-off, with normal line breaks.",
    },
    rationale: {
      type: "string",
      description:
        "One or two sentences explaining the angle chosen for this person and company.",
    },
  },
  required: ["subject", "body", "rationale"],
  additionalProperties: false,
};

app.post("/api/generate", async (req, res) => {
  const { company, contact, options, sender } = req.body ?? {};
  if (!company?.name || !contact?.email) {
    return res
      .status(400)
      .json({ error: "company.name and contact.email are required." });
  }
  const client = getClient();
  if (!client) return res.status(400).json({ error: NO_KEY_MESSAGE });

  let valueProp = "";
  try {
    valueProp = fs.readFileSync(VALUE_PROP_PATH, "utf8");
  } catch {
    /* fall through */
  }
  if (!valueProp.trim()) {
    return res.status(400).json({
      error:
        "The value proposition is empty. Open Settings and paste in the Ameresco value proposition first.",
    });
  }

  const tone = options?.tone || "professional and warm";
  const length = options?.length || "short (90-130 words)";
  const cta = options?.callToAction || "a brief 15-20 minute intro call";

  const senderBlock = sender?.name
    ? `Sender: ${sender.name}${sender.title ? ", " + sender.title : ""}, Ameresco.${sender.phone ? " Phone: " + sender.phone : ""}`
    : "Sender: an Ameresco business development professional.";

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      output_config: { format: { type: "json_schema", schema: EMAIL_SCHEMA } },
      system:
        "You write first-touch B2B outreach emails for Ameresco, an energy efficiency, renewable energy and energy infrastructure company.\n\n" +
        "AMERESCO VALUE PROPOSITION (source of truth — draw only on claims made here):\n" +
        valueProp +
        "\n\nRULES:\n" +
        "- Personalise from the company research and the recipient's role; never invent facts about their company. If the research is thin, stay general rather than guessing.\n" +
        "- Lead with something relevant to THEM, not with Ameresco.\n" +
        "- One clear idea per email; no feature lists, no jargon, no exclamation marks.\n" +
        "- Sound like a considerate human colleague, not a marketing blast. Avoid cliches like 'I hope this finds you well', 'quick question', 'circle back'.\n" +
        "- End with the requested call to action, phrased as an easy, low-pressure ask.\n" +
        "- Use British English spelling.\n" +
        "- Plain text only. Include greeting and a sign-off with the sender's name.",
      messages: [
        {
          role: "user",
          content:
            `Write an outreach email.\n\n` +
            `RECIPIENT: ${contact.name || "Unknown name"} — ${contact.title || "role unknown"} at ${company.name}.\n\n` +
            `ROLE-SPECIFIC ANGLE GUIDANCE:\n${personaGuidance(contact.title)}\n\n` +
            `COMPANY RESEARCH:\n${company.research || "None available — keep company-specific claims out."}\n\n` +
            (company.extraContext
              ? `EXTRA CONTEXT FROM THE SENDER (e.g. how we know them, campaign angle):\n${company.extraContext}\n\n`
              : "") +
            `${senderBlock}\n` +
            `Tone: ${tone}. Length: ${length}. Call to action: ${cta}.`,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return res.status(400).json({
        error: "The model declined to generate this email. Try adjusting the inputs.",
      });
    }
    const text = response.content.find((b) => b.type === "text")?.text ?? "";
    const email = JSON.parse(text);
    res.json(email);
  } catch (err) {
    res.status(mapAnthropicStatus(err)).json({ error: friendlyError(err) });
  }
});

// ---------------------------------------------------------------------------
// Error helpers
// ---------------------------------------------------------------------------

function mapAnthropicStatus(err) {
  if (err instanceof Anthropic.APIError && err.status) {
    return err.status >= 500 ? 502 : err.status;
  }
  return 500;
}

function friendlyError(err) {
  if (err instanceof Anthropic.AuthenticationError) {
    return "The Anthropic API key was rejected. Check the ANTHROPIC_API_KEY value in your .env file.";
  }
  if (err instanceof Anthropic.RateLimitError) {
    return "Rate limited by the Anthropic API — wait a minute and try again.";
  }
  if (err instanceof Anthropic.APIConnectionError) {
    return "Could not reach the Anthropic API. Check your internet connection (or corporate proxy settings).";
  }
  if (err instanceof Anthropic.APIError) {
    return `Anthropic API error (${err.status}): ${err.message}`;
  }
  return `Unexpected error: ${err.message}`;
}

app.listen(PORT, () => {
  console.log(`\n  Ameresco Outreach is running.`);
  console.log(`  Open http://localhost:${PORT} in your browser.\n`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log(
      "  NOTE: no ANTHROPIC_API_KEY set — email generation is disabled until you add one to .env\n"
    );
  }
});
