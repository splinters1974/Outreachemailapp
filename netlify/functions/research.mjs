import {
  MODEL_RESEARCH,
  NO_KEY_MESSAGE,
  json,
  requireAuth,
  getClient,
  streamTextResponse,
} from "../shared/api-utils.mjs";

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
    signal: AbortSignal.timeout(8000),
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

export default async (req) => {
  const denied = requireAuth(req);
  if (denied) return denied;

  const { companyName, domain } = await req.json().catch(() => ({}));
  if (!companyName) return json(400, { error: "companyName is required." });

  const client = getClient();
  if (!client) return json(400, { error: NO_KEY_MESSAGE });

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

  const stream = client.messages.stream({
    model: MODEL_RESEARCH,
    max_tokens: 1024,
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

  const headers = {};
  if (fetchNote) headers["X-Fetch-Note"] = encodeURIComponent(fetchNote);
  return streamTextResponse(stream, headers);
};

export const config = { path: "/api/research" };
