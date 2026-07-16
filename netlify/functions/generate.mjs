import {
  MODEL_GENERATE,
  NO_KEY_MESSAGE,
  json,
  requireAuth,
  getClient,
  streamTextResponse,
} from "../shared/api-utils.mjs";

// Maps a recipient's job function to (a) the drivers that person is measured on
// and (b) the Ameresco value-proposition pillars that speak to those drivers.
function personaGuidance(jobTitle) {
  const t = (jobTitle || "").toLowerCase();
  const buckets = [
    {
      match: /\b(cfo|finance|financial|treasurer|controller|accounting)\b/,
      angle:
        "FINANCE / CFO — Their drivers: predictable operating costs, protecting margin, capital discipline, balance-sheet impact, risk. " +
        "Speak to: budget-neutral delivery via energy savings performance contracting (savings fund the works), guaranteed savings that de-risk the business case, no upfront capital, and a hedge against energy-price volatility.",
    },
    {
      match:
        /\b(facilit|estates|maintenance|building|property|site|plant|infrastructure)\b/,
      angle:
        "FACILITIES / ESTATES — Their drivers: uptime and reliability, occupant comfort, ageing plant and deferred maintenance, doing more with a flat maintenance budget. " +
        "Speak to: modernised HVAC / lighting / controls funded from savings, fewer breakdowns, and a single partner that operates and maintains the works so performance is sustained.",
    },
    {
      match: /\b(sustainab|esg|environment|carbon|net zero|climate|csr)\b/,
      angle:
        "SUSTAINABILITY / ESG — Their drivers: a credible, evidenced path to net zero, defensible reporting, avoiding greenwash, hitting board/regulatory commitments. " +
        "Speak to: measurable carbon reduction, on-site renewable generation, and the measurement & verification data that stands up in ESG reporting.",
    },
    {
      match: /\b(energy|utilities)\b/,
      angle:
        "ENERGY / UTILITIES MANAGER — Their drivers: consumption visibility, tariff and demand optimisation, resilience, technical credibility. " +
        "Speak to: peer-level engineering delivery, on-site generation and storage, and consumption/demand optimisation backed by measurement.",
    },
    {
      match: /\b(procure|purchasing|buyer|category|commercial)\b/,
      angle:
        "PROCUREMENT / COMMERCIAL — Their drivers: risk transfer, whole-life value, deliverability, defensible supplier selection. " +
        "Speak to: performance guarantees that move delivery risk to Ameresco, a single accountable partner across design/build/operate, and whole-life cost rather than lowest capital price.",
    },
    {
      match:
        /\b(ceo|chief executive|managing director|owner|president|founder|coo|operations director|general manager)\b/,
      angle:
        "EXECUTIVE / C-SUITE — Their drivers: competitiveness, resilience, reputation with customers/investors, strategic outcomes not technical detail. " +
        "Speak to: turning energy from a cost line into a strategic asset, resilience against price and supply shocks, and one or two sharp business outcomes. Keep it high-level.",
    },
  ];
  const hits = buckets.filter((b) => b.match.test(t)).map((b) => b.angle);
  if (hits.length > 0) return hits.join("\n\n");
  return "ROLE UNCLEAR — infer this person's likely commercial drivers from their job title and the company context, then connect one driver to the single most relevant Ameresco value-proposition pillar. Keep the angle business-outcome led, not technical.";
}

const EMAIL_ITEM = {
  type: "object",
  properties: {
    subject: {
      type: "string",
      description:
        "Subject line: 3-6 words, ~30-45 characters so it shows in full on mobile. Specific and relevant. No clickbait, no ALL CAPS, no emoji.",
    },
    body: {
      type: "string",
      description:
        "The email body as plain text, 60-120 words, including greeting and sign-off, with normal line breaks between short paragraphs.",
    },
    rationale: {
      type: "string",
      description:
        "One or two sentences: which driver you led with and which Ameresco pillar you tied it to, and why it fits this person/company.",
    },
  },
  required: ["subject", "body", "rationale"],
  additionalProperties: false,
};

const SINGLE_SCHEMA = EMAIL_ITEM;
const VARIATIONS_SCHEMA = {
  type: "object",
  properties: {
    variants: {
      type: "array",
      description: "Exactly three distinct email options.",
      items: EMAIL_ITEM,
    },
  },
  required: ["variants"],
  additionalProperties: false,
};

const BEST_PRACTICE = `You write first-touch cold outreach emails for Ameresco — an energy efficiency, renewable energy and energy infrastructure company — to senior people in large organisations.

HOW A GOOD SENIOR-LEVEL COLD EMAIL IS BUILT (follow this):
- Length: 60-120 words in the body. Shorter is better; a busy senior reader skims on a phone. Never exceed 120 words.
- Structure, three short movements, one to two sentences each:
    1) WHY I'M WRITING — open with something specific and true about THEM: their company, their sector's pressures, a recent development, or their role. Never open with Ameresco or "I hope this finds you well".
    2) WHAT I PROPOSE — the value in a single sentence tied to their driver. Not a feature list.
    3) PROOF — one credible proof point supported by the value proposition. If none fits, use a modest credibility line rather than inventing a statistic.
- One single call to action. The default is a brief 15-20 minute call, framed as low-commitment. Never stack two asks.
- Tailor on BOTH axes: the company (from the research) AND the person's role/drivers. The connection between their driver and the Ameresco pillar is the point of the email.

RULES:
- Sound like a considered, senior human. Plain, direct, warm-but-professional.
- Ban these words and any cliché like them: "leveraging", "cutting-edge", "best-in-class", "leading", "world-class", "innovative", "synergies", "ecosystem", "solutions provider", "circle back", "touch base", "quick question", "I hope this finds you well", "reaching out".
- No exclamation marks. No emoji. No marketing superlatives. British English spelling.
- Never invent facts about their company or fabricate numbers. If the research is thin, stay general rather than guessing.
- Plain text only. Include a greeting (use their first name if available) and a sign-off with the sender's name.`;

function priorEmailsBlock(history) {
  if (!Array.isArray(history) || history.length === 0) return "";
  return (
    "PREVIOUS EMAILS ALREADY SENT TO THIS PERSON (most recent last):\n" +
    history
      .map((h, i) => {
        const when = h.at ? ` (sent ${new Date(h.at).toLocaleDateString("en-GB")})` : "";
        return `#${i + 1}${when}\nSubject: ${h.subject || ""}\n${h.body || ""}`;
      })
      .join("\n\n") +
    "\n\n"
  );
}

export default async (req) => {
  const denied = requireAuth(req);
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const { company, contact, options, sender, valueProp } = body;
  const task = body.task || "first"; // first | followup | variations | refine

  if (!company?.name || !contact?.email) {
    return json(400, { error: "company.name and contact.email are required." });
  }
  if (!valueProp?.trim()) {
    return json(400, {
      error:
        "The value proposition is empty. Open Settings and paste in (or load from PDF) the Ameresco value proposition first.",
    });
  }

  const client = getClient();
  if (!client) return json(400, { error: NO_KEY_MESSAGE });

  const tone = options?.tone || "professional and warm";
  const length = options?.length || "short (around 90 words)";
  const cta = options?.callToAction || "a brief 15-20 minute intro call";

  const senderBlock = sender?.name
    ? `Sender: ${sender.name}${sender.title ? ", " + sender.title : ""}, Ameresco.${sender.phone ? " Phone: " + sender.phone : ""}`
    : "Sender: an Ameresco business development professional.";

  const firstName = (contact.name || "").trim().split(/\s+/)[0] || "";

  const targetBlock =
    `RECIPIENT: ${contact.name || "Unknown name"}` +
    (firstName ? ` (first name: ${firstName})` : "") +
    ` — ${contact.title || "role unknown"} at ${company.name}.\n\n` +
    `ROLE DRIVERS & MATCHING AMERESCO PILLARS:\n${personaGuidance(contact.title)}\n\n` +
    `COMPANY RESEARCH:\n${company.research || "None available — keep company-specific claims out and lead on the sector/role instead."}\n\n` +
    (company.extraContext
      ? `EXTRA CONTEXT FROM THE SENDER (use if relevant):\n${company.extraContext}\n\n`
      : "");

  let userContent;
  let schema = SINGLE_SCHEMA;

  if (task === "refine") {
    const draft = body.draft || {};
    const instruction = body.instruction || "Improve this email.";
    schema = SINGLE_SCHEMA;
    userContent =
      `Revise the email below. Keep everything that works; apply this change: ${instruction}\n\n` +
      `CURRENT SUBJECT: ${draft.subject || ""}\nCURRENT BODY:\n${draft.body || ""}\n\n` +
      `Context for reference:\n${targetBlock}${senderBlock}\n` +
      `Keep it a single cold outreach email that still follows all the rules. Return the full revised subject and body.`;
  } else if (task === "followup") {
    schema = SINGLE_SCHEMA;
    userContent =
      `Write a FOLLOW-UP cold outreach email — the previous message(s) got no reply. ` +
      `Do not repeat the earlier angle; take a fresh, useful angle for this person's role. ` +
      `Keep it shorter than a first touch (aim ~60-90 words), reference lightly that you wrote before without guilt-tripping, add one new specific point or proof, and keep a single low-pressure ask.\n\n` +
      priorEmailsBlock(body.history) +
      targetBlock +
      `${senderBlock}\n` +
      `Tone: ${tone}. Call to action: ${cta}.`;
  } else if (task === "variations") {
    schema = VARIATIONS_SCHEMA;
    userContent =
      `Write THREE distinctly different cold outreach emails for the same recipient — different opening hooks and different angles (e.g. one financial, one operational, one sustainability/strategic where the role allows), so the sender can pick the best. Each must independently follow all the rules.\n\n` +
      targetBlock +
      `${senderBlock}\n` +
      `Tone: ${tone}. Length: ${length}. Call to action: ${cta}.\n` +
      `Return exactly three options in "variants".`;
  } else {
    // first touch
    schema = SINGLE_SCHEMA;
    userContent =
      `Write one cold outreach email.\n\n` +
      targetBlock +
      `${senderBlock}\n` +
      `Tone: ${tone}. Length: ${length}. Call to action: ${cta}.`;
  }

  const stream = client.messages.stream({
    model: MODEL_GENERATE,
    max_tokens: task === "variations" ? 2500 : 1200,
    thinking: { type: "disabled" },
    output_config: { format: { type: "json_schema", schema } },
    system: [
      { type: "text", text: BEST_PRACTICE },
      {
        type: "text",
        text:
          "AMERESCO VALUE PROPOSITION (the only source of truth for claims about Ameresco — draw only on what is stated here):\n" +
          valueProp,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userContent }],
  });

  return streamTextResponse(stream);
};

export const config = { path: "/api/generate" };
