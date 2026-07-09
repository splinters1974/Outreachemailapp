// Local development server. Serves the static frontend and mounts the same
// Netlify function modules that run in production, so local and deployed
// behaviour stay identical. Run with: npm start
import "dotenv/config";
import express from "express";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";
import { setGlobalDispatcher, EnvHttpProxyAgent } from "undici";

// Respect corporate/system proxies for outbound website fetches.
if (process.env.HTTPS_PROXY || process.env.https_proxy) {
  setGlobalDispatcher(new EnvHttpProxyAgent());
}

import status from "./netlify/functions/status.mjs";
import research from "./netlify/functions/research.mjs";
import generate from "./netlify/functions/generate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const handlers = { status, research, generate };

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.text({ type: "*/*" }));

app.all("/api/:name", async (req, res) => {
  const handler = handlers[req.params.name];
  if (!handler) return res.status(404).json({ error: "Not found" });

  const request = new Request(`http://localhost:${PORT}${req.originalUrl}`, {
    method: req.method,
    headers: req.headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
  });

  try {
    const response = await handler(request);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (response.body) {
      Readable.fromWeb(response.body).pipe(res);
    } else {
      res.end();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n  Ameresco Outreach is running.`);
  console.log(`  Open http://localhost:${PORT} in your browser.\n`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log(
      "  NOTE: no ANTHROPIC_API_KEY set — email generation is disabled until you add one to .env\n"
    );
  }
});
