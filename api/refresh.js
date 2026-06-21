// api/refresh.js — the "actively looks at the data" part.
// Vercel Cron calls this on a schedule (see vercel.json). It pings your own
// proxy routes for a watchlist of series, which warms the CDN cache so every
// visitor gets fresh data instantly and you stay well under FRED/BLS limits.
//
// To go further, write the results into a store (Vercel KV / Postgres) here and
// have the frontend read from that store for a true "live dashboard".

const FRED_WATCH = ["GDPC1", "CPIAUCSL", "UNRATE", "FEDFUNDS", "GS10", "PAYEMS"];
const BLS_WATCH = ["CUUR0000SA0", "LNS14000000"];

export default async function handler(req, res) {
  // Vercel sends "Authorization: Bearer <CRON_SECRET>" when it triggers a cron.
  if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const proto = req.headers["x-forwarded-proto"] || "https";
  const base = `${proto}://${req.headers.host}`;

  const jobs = [
    ...FRED_WATCH.map((s) => fetch(`${base}/api/fred?series=${s}`)),
    fetch(`${base}/api/bls?series=${BLS_WATCH.join(",")}`),
  ];
  const results = await Promise.allSettled(jobs);
  const ok = results.filter((r) => r.status === "fulfilled" && r.value.ok).length;

  return res.status(200).json({ refreshed: ok, of: results.length, at: new Date().toISOString() });
}
