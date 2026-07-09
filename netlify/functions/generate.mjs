import {
  MODEL,
  NO_KEY_MESSAGE,
  json,
  requireAuth,
  getClient,
  streamTextResponse,
} from "../shared/api-utils.mjs";

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
      match:
        /\b(ceo|chief executive|managing director|owner|president|founder|coo|operations director)\b/,
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

export default async (req) => {
  const denied = requireAuth(req);
  if (denied) return denied;

  const { company, contact, options, sender, valueProp } = await req
    .json()
    .catch(() => ({}));
  if (!company?.name || !contact?.email) {
    return json(400, { error: "company.name and contact.email are required." });
  }
  if (!valueProp?.trim()) {
    return json(400, {
      error:
        "The value proposition is empty. Open Settings and paste in the Ameresco value proposition first.",
    });
  }

  const client = getClient();
  if (!client) return json(400, { error: NO_KEY_MESSAGE });

  const tone = options?.tone || "professional and warm";
  const length = options?.length || "short (90-130 words)";
  const cta = options?.callToAction || "a brief 15-20 minute intro call";

  const senderBlock = sender?.name
    ? `Sender: ${sender.name}${sender.title ? ", " + sender.title : ""}, Ameresco.${sender.phone ? " Phone: " + sender.phone : ""}`
    : "Sender: an Ameresco business development professional.";

  const stream = client.messages.stream({
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

  return streamTextResponse(stream);
};

export const config = { path: "/api/generate" };
