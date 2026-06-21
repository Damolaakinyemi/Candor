// api/fred.js — server-side proxy for FRED (Federal Reserve, St. Louis).
// Runs on Vercel's servers, so FRED_API_KEY stays secret and there's no CORS.
// Frontend calls:  /api/fred?series=GDPC1&start=1990-01-01
//
// FRED v2 (Nov 2025) requires a key. The classic observations endpoint below
// accepts the key as a query param; the v2 alternative is an
// "Authorization: Bearer <key>" header on the same path.

export default async function handler(req, res) {
  const { series, start, end } = req.query;
  if (!series) {
    return res.status(400).json({ error: "Missing ?series= (e.g. GDPC1, CPIAUCSL, UNRATE)" });
  }
  const key = process.env.FRED_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "FRED_API_KEY is not configured on the server." });
  }

  const params = new URLSearchParams({
    series_id: String(series).trim(),
    api_key: key,
    file_type: "json",
    observation_start: start || "1990-01-01",
    observation_end: end || "9999-12-31",
  });

  try {
    const r = await fetch(`https://api.stlouisfed.org/fred/series/observations?${params}`);
    if (!r.ok) {
      const text = await r.text().catch(() => "");
      return res.status(r.status).json({ error: `FRED returned HTTP ${r.status}. ${text.slice(0, 200)}` });
    }
    const data = await r.json();
    const rows = (data.observations || [])
      .filter((o) => o.value !== ".")              // FRED marks missing as "."
      .map((o) => ({ date: o.date, value: Number(o.value) }));

    // Cache at the CDN for 6h, keep serving stale for a day while revalidating.
    res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate=86400");
    return res.status(200).json({ series: String(series).trim(), source: "FRED", count: rows.length, rows });
  } catch (e) {
    return res.status(502).json({ error: "Upstream FRED request failed: " + e.message });
  }
}
