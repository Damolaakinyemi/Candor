# Candor

A browser-based econometrics workspace. Upload a CSV or pull live economic data,
then drop in charts and analyses — OLS with cluster-robust standard errors,
instrumental variables (2SLS), difference-in-differences, ADF/KPSS stationarity
tests, and backtested forecasts — each explained by an AI Teacher you can set from
Beginner to Advanced. The statistics run locally in your browser and are validated
against `statsmodels`/`linearmodels`; only the Teacher's explanations and the live
data calls touch a server.

This repo is the **deployable web app**: a Vite + React frontend plus Vercel
serverless functions that keep API keys secret and dodge browser CORS.

## Project layout

```
candor/
├── index.html
├── vite.config.js
├── package.json
├── vercel.json                 # daily cron to refresh live data
├── .env.example                # the secrets you need to set
├── src/
│   ├── main.jsx
│   ├── Candor.jsx              # the whole application
│   └── index.css
└── api/                         # Vercel serverless functions (server-side, keys stay here)
    ├── teacher.js              # proxies the AI Teacher (ANTHROPIC_API_KEY)
    ├── fred.js                 # proxies FRED        (FRED_API_KEY)
    ├── bls.js                  # proxies BLS v2      (BLS_API_KEY)
    └── refresh.js              # cron target: warms the live-data cache
```

## Why the serverless functions exist

Three features can't run purely in the browser, all for the same reasons (secret
keys + CORS):

- **AI Teacher** → `/api/teacher` holds your `ANTHROPIC_API_KEY`.
- **FRED** → `/api/fred` holds your `FRED_API_KEY` (FRED v2 requires a key).
- **BLS** → `/api/bls` holds your `BLS_API_KEY`.

The frontend calls these same-origin routes; the routes attach the key on the
server and return clean JSON. World Bank data is fetched directly from the browser
(it's CORS-friendly and needs no key).

## Setup

```bash
npm install
cp .env.example .env.local      # then paste in your keys
```

Get the keys (all free): FRED → https://fredaccount.stlouisfed.org/apikeys ·
BLS → https://data.bls.gov/registrationEngine/ ·
Anthropic → https://console.anthropic.com/

## Run locally

```bash
# Full app INCLUDING the /api functions (recommended):
npm i -g vercel
vercel dev

# Frontend only (charts + local stats work; Teacher/FRED/BLS need the API, so use `vercel dev`):
npm run dev
```

> Plain `vite` (`npm run dev`) does not serve the `/api` functions, so the Teacher
> and the FRED/BLS connectors will 404 in that mode. Use `vercel dev` for the full
> experience, or just deploy.

## Deploy (Vercel)

```bash
vercel --prod
```

Then add `FRED_API_KEY`, `BLS_API_KEY`, `ANTHROPIC_API_KEY`, and `CRON_SECRET` in
the Vercel dashboard (Project → Settings → Environment Variables). Vercel
auto-detects Vite, builds `dist/`, and turns each file in `/api` into a function.

## The "actively pulls data" part

- Every `/api/fred|bls` response is CDN-cached for ~6 hours, so the first visitor
  triggers one upstream call and everyone else gets the cached copy — this keeps
  you under rate limits.
- `vercel.json` runs `/api/refresh` daily at 12:00 UTC to re-warm a watchlist of
  popular series. (Cron runs on production only; the Hobby plan caps frequency.)

## Notes

- Persistence: the app saves your documents to `localStorage`, so work survives a
  refresh on a real deployment.
- Costs: the Teacher and the live-data calls have real per-use costs against your
  keys. Consider a usage cap or a "bring your own key" option before opening it up.
- Adding sources: copy the pattern in `api/fred.js` — new `api/<source>.js`, key in
  an env var, normalize to `{ date, value }`, and add a connector entry in
  `Candor.jsx`.

## License

MIT for the app code. Data from FRED, BLS, and the World Bank is governed by each
provider's terms — cache responsibly and attribute the source.
