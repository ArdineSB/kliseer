# Kliseer

Sales-ops app for an electrical-supply seller. Public building permits become dated prospect signals. Tiers are deterministic. Chat only drafts the seller profile.

Track: Vultr Agent Rush, Powering the Future of Work. Seller profile in the demo is synthetic (Harborline). Permit signals are public records.

Demo: https://64-177-42-81.sslip.io — HTTP Basic Auth. Credentials are not in the repo.

## Vultr

- **Cloud Compute VM** (Ubuntu 24.04) runs the Next.js app. `kliseer.service` binds `127.0.0.1:3000`. Caddy terminates HTTPS for `64-177-42-81.sslip.io` and reverse-proxies to that port.
- **Supabase on Vultr Marketplace** is the Postgres backend, reached through Supavisor. Seller profile, chat, companies, and signals live there. The database port is not open to the public internet.
- **Serverless Inference** (`https://api.vultrinference.com/v1`) drafts setup fields from chat. It does not assign tiers, dates, or scores.

A push to `main` runs CI, then deploys that commit to `/opt/kliseer/releases/<sha>` and switches `/opt/kliseer/current`. Runtime secrets stay in `/opt/kliseer/.env.local`.

## Use case

1. Setup: Company, ICP, Target, Review. The chat agent returns JSON drafts for fields the user named. Each section is approved on its own.
2. Find prospects: companies with a permit signal in the last 365 days. Tier uses the last 90 days plus product-keyword matches (`S` / `A` / `B` / `C`).
3. Open a prospect: dated signals, source, summary, matched keyword, source URL. Companies outside the seller region stay visible and are marked `Outside service region`.

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

`npm run check` asserts the tier boundaries. `npm run ingest nyc-dob-permits` limits the pull to one source.

## Env

| Key | Use |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `LLM_BASE_URL` | OpenAI-compatible base URL. Demo: `https://api.vultrinference.com/v1` |
| `LLM_API_KEY` | Inference key. Server only |
| `LLM_MODEL` | Chat model id |
| `SODA_APP_TOKEN` | Optional Socrata app token |
| `DEMO_USER` / `DEMO_PASS` | HTTP Basic Auth. Missing values fail closed (503) |
