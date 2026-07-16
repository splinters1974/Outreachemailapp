import Anthropic from "@anthropic-ai/sdk";

// Model selection is split by task to control cost:
//  - Research is straightforward summarisation → a fast, cheap model is plenty.
//  - Email writing is the deliverable and benefits from a stronger writer, but
//    Sonnet is far cheaper than Opus and easily good enough here.
// Both can be overridden per environment; ANTHROPIC_MODEL overrides both.
export const MODEL_RESEARCH =
  process.env.ANTHROPIC_MODEL_RESEARCH ||
  process.env.ANTHROPIC_MODEL ||
  "claude-haiku-4-5";
export const MODEL_GENERATE =
  process.env.ANTHROPIC_MODEL_GENERATE ||
  process.env.ANTHROPIC_MODEL ||
  "claude-sonnet-5";
// Back-compat export used by the status endpoint.
export const MODEL = MODEL_GENERATE;

export const NO_KEY_MESSAGE =
  "No Anthropic API key is configured. Site owner: add ANTHROPIC_API_KEY in Netlify → Site configuration → Environment variables (get a key at console.anthropic.com), then redeploy. Running locally: put it in a .env file.";

// Streamed responses can't change their HTTP status once bytes have been
// sent, so mid-stream failures are signalled with this marker instead.
export const ERROR_MARKER = "\u0000ERROR:";

export function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Returns an error Response if the request is not authorised, else null. */
export function requireAuth(req) {
  const required = process.env.APP_PASSCODE;
  if (!required) return null;
  if (req.headers.get("x-passcode") === required) return null;
  return json(401, {
    error: "Passcode required or incorrect.",
    passcode: true,
  });
}

export function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic();
}

export function friendlyError(err) {
  if (err instanceof Anthropic.AuthenticationError) {
    return "The Anthropic API key was rejected. Check the ANTHROPIC_API_KEY value in the site's environment variables (or your local .env).";
  }
  if (err instanceof Anthropic.RateLimitError) {
    return "Rate limited by the Anthropic API — wait a minute and try again.";
  }
  if (err instanceof Anthropic.APIConnectionError) {
    return "Could not reach the Anthropic API. Try again in a moment.";
  }
  if (err instanceof Anthropic.APIError) {
    return `Anthropic API error (${err.status}): ${err.message}`;
  }
  return `Unexpected error: ${err.message}`;
}

/**
 * Wrap an Anthropic SDK MessageStream as a streamed plain-text Response.
 * Sends an immediate byte (and gentle keepalives while the model is
 * thinking) so serverless platforms don't time out waiting for output.
 * Errors after streaming has begun are appended as an ERROR_MARKER line
 * the client detects.
 */
export function streamTextResponse(stream, extraHeaders = {}) {
  const encoder = new TextEncoder();
  let gotContent = false;
  let keepalive;

  const body = new ReadableStream({
    start(controller) {
      const safeEnqueue = (text) => {
        try {
          controller.enqueue(encoder.encode(text));
        } catch {
          /* client disconnected */
        }
      };
      safeEnqueue("\n");
      keepalive = setInterval(() => {
        if (!gotContent) safeEnqueue(" ");
      }, 5000);

      stream.on("text", (text) => {
        gotContent = true;
        safeEnqueue(text);
      });
      stream.on("error", (err) => {
        clearInterval(keepalive);
        safeEnqueue(ERROR_MARKER + friendlyError(err));
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      });
      stream.on("end", () => {
        clearInterval(keepalive);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      });
    },
    cancel() {
      clearInterval(keepalive);
      try {
        stream.abort();
      } catch {
        /* best effort */
      }
    },
  });

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}
