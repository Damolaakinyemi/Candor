// api/teacher.js — server-side proxy for the AI Teacher.
// Keeps ANTHROPIC_API_KEY secret (never shipped to the browser) and lets the
// app call /api/teacher same-origin (no CORS). The client sends { system, messages };
// this adds the key + model and passes Anthropic's response straight back.

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: "ANTHROPIC_API_KEY is not configured on the server." });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { system, messages } = body || {};
  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: "Request must include a non-empty messages[] array." });
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
        max_tokens: 1000,
        system,
        messages,
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: data?.error?.message || `Anthropic returned HTTP ${r.status}` });
    }
    // Pass through; the client reads data.content[].
    return res.status(200).json(data);
  } catch (e) {
    return res.status(502).json({ error: "Upstream Anthropic request failed: " + e.message });
  }
}
