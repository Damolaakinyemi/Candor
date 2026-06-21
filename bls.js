// api/bls.js — server-side proxy for BLS (Bureau of Labor Statistics) v2.
// Frontend calls:  /api/bls?series=CUUR0000SA0,LNS14000000&start=2015&end=2026
// Up to 50 comma-separated series per request (v2 limit). Key stays secret.

export default async function handler(req, res) {
  const series = req.query.series;
  const start = req.query.start || String(new Date().getFullYear() - 10);
  const end = req.query.end || String(new Date().getFullYear());
  if (!series) {
    return res.status(400).json({ error: "Missing ?series= (e.g. CUUR0000SA0). Comma-separate up to 50." });
  }

  const key = process.env.BLS_API_KEY; // optional, but v2 limits need it
  const body = {
    seriesid: String(series).split(",").map((s) => s.trim()).filter(Boolean).slice(0, 50),
    startyear: String(start),
    endyear: String(end),
    ...(key ? { registrationkey: key } : {}),
  };

  try {
    const r = await fetch("https://api.bls.gov/publicAPI/v2/timeseries/data/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (data.status !== "REQUEST_SUCCEEDED") {
      const msg = Array.isArray(data.message) ? data.message.join("; ") : data.message || "request failed";
      return res.status(502).json({ error: "BLS: " + msg });
    }
    const out = (data.Results?.series || []).map((s) => ({
      series: s.seriesID,
      rows: s.data
        .slice()
        .reverse()                                   // BLS returns newest-first
        .filter((d) => d.period && /^[MQ]/.test(d.period)) // monthly/quarterly points
        .map((d) => ({
          date: `${d.year}-${d.period.slice(1).padStart(2, "0")}-01`,
          value: Number(d.value),
        })),
    }));

    res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate=86400");
    return res.status(200).json({ source: "BLS", series: out });
  } catch (e) {
    return res.status(502).json({ error: "Upstream BLS request failed: " + e.message });
  }
}
