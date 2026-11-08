# Kliseer

Sales-ops app for an electrical-supply seller. Public building permits become dated prospect signals. Tiers are deterministic. Klise drafts setup fields; workspace chat uses current prospect and sourced-contact records for grounded answers.

Track: Vultr Agent Rush, Powering the Future of Work. Seller profile in the demo is synthetic (Harborline). Permit signals are public records.

Demo: https://64-177-42-81.sslip.io — open in guest mode or sign in.

## Vultr

- **Cloud Compute VM** (Ubuntu 24.04) runs the Next.js app. `kliseer.service` binds `127.0.0.1:3000`. The new `deploy/Caddyfile` serves the static Astro landing at `/` and proxies `/app` to Next. Production cutover requires the one-time preparation in `deploy/README.md`; this work does not deploy automatically from the editor.
- **Supabase on Vultr Marketplace** is the Postgres backend, reached through Supavisor. Seller profile, chat, companies, and signals live there. The database port is not open to the public internet.
- **Serverless Inference** (`https://api.vultrinference.com/v1`) drafts setup fields from chat. It does not assign tiers, dates, or scores.

A push to `main` runs CI, then deploys that commit to `/opt/kliseer/releases/<sha>` and switches `/opt/kliseer/current`. Routing preflight must pass before activation. CI validates Caddy, reloads it, checks the landing HTML and `/app`, and rolls back failed activation. Runtime secrets stay in `/opt/kliseer/.env.local`.

## Use case

1. Setup: Company, ICP, Target, Review. The chat agent returns JSON drafts for fields the user named. Each section is approved on its own.
2. Find prospects: companies with a permit signal in the last 365 days. Tier uses the last 90 days plus product-keyword matches (`S` / `A` / `B` / `C`).
3. Open a prospect: dated signals, source, summary, matched keyword, source URL. Companies outside the seller region stay visible and are marked `Outside service region`.

Guest workspaces start blank. Home offers **Load demo data** to copy the Harborline company, ICP, and target profile into a blank guest workspace. The demo uses current public-signal prospects and sourced contacts already in the database; it does not create fictional lead or contact records.

Home and workspace chats receive the seller profile, the current top 20 Seer prospects, and sourced contact records. Chat can compare candidates, recommend a prospect, list available contacts, and identify top prospects without saved contacts. Those answers use database records; missing contact fields are never inferred. `New chat` creates a separate persistent conversation, and Home lists conversations by workspace.

Sources: NYC DOB building permits, NYC DOB electrical permits, Austin commercial construction permits, Seattle electrical permits.

Daily ingest on the VM, 06:00 UTC:

```
0 6 * * * cd /opt/kliseer/current && /usr/local/bin/npm run ingest >> /var/log/kliseer-ingest.log 2>&1
```

## Local setup

```
cp .env.example .env.local
npm ci
npm run db:init
npm run ingest
npm run dev
```

In a second terminal, run `npm run dev:landing`. Open `http://127.0.0.1:4321`: Astro serves the landing and proxies `/app` to Next on port 3999. `npm run dev` starts that Next server. Do not start a second instance when those ports are already occupied.

`npm run build` builds Next and the static Astro site at `landing/dist`. `npm run build:landing` builds only the landing and its motion modules. `npm run preview:landing` previews the static artifact only; use Caddy for a production-equivalent combined origin. `npm run check:landing` typechecks landing scripts. `npm run check` covers tier, account, contact, chat-workspace and guest-route behavior. `npm run ingest nyc-dob-permits` limits the pull to one source.

## Landing implementation

- Source: `landing/src/pages/index.astro`, reusable scenes in `landing/src/components`, shared-token styles in `landing/src/styles`, native DOM/WAAPI and WebGL in `landing/src/scripts`. No client React, animation library or smooth-scroll dependency is required.
- Loader: only the responsive hero preview is gated. Cached-ready images bypass it; decode completion or image error releases it immediately. A visitor can continue without the preview. No countdown, percentage or fabricated estimate. Static content remains usable without JavaScript.
- Enhancement entry is requested after hero readiness. Its statically imported modules initialize four independent scenes near the viewport and the Velvet Haze background when idle/visible. Both honor reduced motion, pause and visibility. Background failure keeps the static silver/violet fallback.
- Brand SVGs remain the official assets. Inter is self-hosted as a 48 KB Latin WOFF2 with its OFL license. Hero assets are 57 KB desktop / 46 KB mobile. Product figures explicitly use the historical November 7, 2026 Hivolts snapshot, not live scores or inferred contacts.
- Native design: additive Landing and Landing motion pages in `design/kliseer.figcraft`; 18 `design/export/landing-*` previews. Contract: `docs/landing-storyboard.md`. Verification: `docs/landing-verification.md`. Original design briefs and application master components are preserved.

## Env

| Key | Use |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `LLM_BASE_URL` | OpenAI-compatible base URL. Demo: `https://api.vultrinference.com/v1` |
| `LLM_API_KEY` | Inference key. Server only |
| `LLM_MODEL` | Chat model id |
| `SODA_APP_TOKEN` | Optional Socrata app token |
| `DEMO_USER` / `DEMO_PASS` | HTTP Basic Auth. Missing values fail closed (503) |
