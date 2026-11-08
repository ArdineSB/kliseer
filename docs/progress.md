# Progress log

Updated: 2026-11-08 (frontend wiring: auth, guest, upload, Seer gate, draft email)

## Current status

- Next.js app scaffolded with exact dependency versions.
- Postgres schema, Harborline seed, SODA ingest, deterministic tiering, API routes, setup flow, Seer table/detail, Signals, Competitors, Profiling, and chat UI implemented.
- S1 and S14 ingest completed locally:
  - `nyc-dob-permits`: 147,825 signals
  - `nyc-dob-electrical`: 55,088 signals
  - seller rows: 1
- S12 and S13 ingested on Supabase from the app VM: `austin-permits` 13,815 signals, `seattle-electrical` 20,717 signals. Rerun inserted 0. TX and WA prospects show `Outside service region` on the public URL.
- S1 mapping follows the live API response:
  - `tracking_number` is the source record id.
  - `work_type + job_description` is the summary.
  - `work_permit` is not unique across renewals.
- Ingest rerun is idempotent: second run inserted `0` rows.
- Ten sampled source URLs returned matching source records.

## Verification

- `npx tsc --noEmit -p .` passed.
- `npx eslint .` passed.
- `npm run check` passed.
- `npm run build` passed.
- Production route smoke test passed with HTTP 200 for `/`, setup pages, `/seer`, `/signals`, `/competitors`, and `/profiling`.
- `/api/seller` returned HTTP 200.
- `/api/prospects?tier=S` returned 267 Tier S prospects and 50 items on page one.
- Browser verification passed for `/seer`, `/setup/company`, and a Seer prospect detail page; no browser console errors were observed.
- Chat request was tested successfully with the Vultr Serverless Inference key/model; `.env.local` now has an LLM API key and model configured. Never copy the key into this log.

## Infrastructure incident

- Docker Desktop/WSL temporarily failed with missing `/opt/docker-desktop/componentsVersion.json` and WSL exit `0xc00000fd`. `docker desktop restart` alone failed. A non-destructive `docker desktop stop`, `wsl --shutdown`, then `docker desktop start` restored the Docker engine; the `kliseer-pg` container restarted and accepts connections. No distro unregister, factory reset, or volume deletion was performed.

## Vultr configuration

- Credit checked 2026-11-06: Remaining Credit `$200.00`. Account limit: 5 instances, `$200/month`.
- Serverless Inference subscription `kliseer` (`6491c646-7ae4-4dba-aeac-5ac1d72d37c1`) is Active. No monthly fee.
- `.env.local` LLM settings: `LLM_BASE_URL=https://api.vultrinference.com/v1`, `LLM_MODEL=deepseek-v4.1-flash-1017`. A one-shot chat call returned JSON `{"ok":true}`. The API key stays only in `.env.local`.
- Supabase marketplace instance `kliseer` (`3121c5f1-2bd3-4976-ad36-7202a9167d49`): Atlanta, `144.202.26.170`, Ubuntu 24.04, 2 vCPU, 4 GB RAM, 80 GB SSD, image Supabase, status Running. Created 2026-11-06 01:13:53.
- Host port 5432 is Supavisor (`supabase-pooler`), not direct Postgres. Direct Postgres is only inside `supabase-db`. Pooler tenant id is the image default `your-tenant-id`. `.env.local` user is `postgres.your-tenant-id`. A login from this machine returned `current_user=postgres`. Password stays only in `.env.local`.
- Supabase published ports are filtered in `DOCKER-USER` on `enp1s0`, because Docker bypasses UFW. TCP 5432 and 6543 accept only `64.177.42.81/32` and admin `182.8.100.101/32`. TCP 8000 and 8443 accept only that admin IP. Other sources are dropped. IPv6 to those ports is dropped. Rules are reapplied by `kliseer-docker-firewall.service` after Docker starts. Checked 2026-11-07: admin IP still reaches 5432, 6543, and 8000; the app VM reaches 5432 and 6543 and is blocked on 8000.
- App VM: Ubuntu 24.04 at `64.177.42.81`; SSH host key verified out of band. Root key-only access and `kliseer-deploy` key-only access work. Root password login and SSH password authentication are disabled; SSH only allows `root` and `kliseer-deploy`, with max auth attempts 3.
- UFW on the app VM allows TCP 22, 80, and 443. Node.js 22.16.0 and Caddy 2.6.2 are installed. Caddy is enabled and active.
- `proxy.ts` adds fail-closed HTTP Basic authentication for app/API routes. Local smoke test: anonymous and invalid credentials → 401; valid credentials → 200. Missing demo credentials → 503. `.env.example` documents `DEMO_USER`/`DEMO_PASS`.
- `.github/workflows/ci.yml` runs tier checks, TypeScript, ESLint, and production build on PRs and pushes to `main`. A successful push to `main` then deploys that commit to `/opt/kliseer/releases/<sha>`, switches `/opt/kliseer/current`, and restarts `kliseer.service`. GitHub secret `DEPLOY_SSH_KEY` is the existing `kliseer-deploy` key. Runtime secrets stay in `/opt/kliseer/.env.local` and are not in the repo.
- App code is deployed on the remote app VM at `/opt/kliseer` as enabled systemd service `kliseer.service`, bound only to `127.0.0.1:3000`. Supabase schema initialization and both source ingests are complete; final verification found 1 seller, 18,769 companies, and 202,913 signals.
- `.gitignore` excludes `.env*`. Public HTTP/HTTPS is open only after Basic Auth and the Caddy reverse proxy were verified.
- `.env.local` now has demo Basic Auth credentials configured. A clean local production app on `127.0.0.1:3017` returned HTTP 401 anonymously and HTTP 200 with the configured credentials. Port 3000 was already occupied; that process was left untouched.
- Supabase `db:init` succeeded after clearing the exported `DATABASE_URL`: `schema ok, sellers=1`. Clean-environment idempotent ingest completed: `nyc-dob-permits` inserted 122,388; `nyc-dob-electrical` inserted 55,088. Final counts: 147,825 permits signals, 55,088 electrical signals, 18,769 companies, 1 seller.

- 2026-11-07: Initial `npm run db:init` inherited an exported `DATABASE_URL`; `tsx --env-file=.env.local` does not override exported variables, so that attempt failed before schema execution with `ENOIDENTIFIER`. Retried with `unset DATABASE_URL && npm run db:init`; it succeeded with `schema ok, sellers=1`. No tenant or routing change was needed. Operator confirmed the running tenant registration and route match `POOLER_TENANT_ID`.
- 2026-11-07: Public URL is `https://64-177-42-81.sslip.io`. No custom domain was set; the hostname is the app VM IP via sslip.io. Caddy reverse-proxies that name to `127.0.0.1:3000` and obtained a Let's Encrypt certificate. Anonymous `HEAD /` returned HTTP 401 with the Basic Auth challenge.

- 2026-11-07: S12 `austin-permits` and S13 `seattle-electrical` added. First ingest on the app VM: Austin fetched 15,286, kept 13,815, inserted 13,815; Seattle fetched 25,593, kept 20,717, inserted 20,717. Rerun inserted 0. Stored `source_url` is the portal link (Austin 13,815, Seattle 20,717; SODA fallback 0). SODA query for Austin `2025-147767 EP` and Seattle `7128541-EL` returned the same record id. Seattle portal HTML contained `7128541-EL`. Austin portal HTML is a 960-byte shell and did not contain the permit number. Companies: TX 2,684, WA 1,069. 47 signals attached to existing NY rows because `name_key` is global; those names do not get the outside-region badge. Public `/seer/{id}` for one TX and one WA company returned HTTP 200 and `Outside service region`.
- 2026-11-07: `kliseer-deploy` crontab runs `npm run ingest` at 06:00 UTC from `/opt/kliseer/current`. Log: `/var/log/kliseer-ingest.log` (not `/opt/kliseer`, because the app lives on the `current` symlink). `README.md` documents Vultr usage, architecture, local setup, and env keys.

## Frontend wiring (2026-11-08)

- Auth/guest live: `lib/session.ts` resolves a seller from the session cookie, then the guest cookie; `proxy.ts` issues the anonymous guest token (page renders cannot set cookies in Next 16), `ensureSellerId` creates the guest row lazily. `/api/auth/[action]` handles login/signup/logout with the G4 copy strings verbatim. Signup/login claim the guest row (G2: filled account wins, empty account adopts the guest row and chat). `proxy.ts` Basic Auth removed — app auth is the only gate now. Pages `/login` and `/create-account` render `components/AuthForm.tsx` (shared, states empty/filled/submitting/error; disabled submit while empty or submitting).
- All data paths off `SELLER_ID=1`: `getSeller`/`saveSection`/`thread`/`threadHeads`/`sendMessage`/`listProspects`/`getProspect` take a sellerId. API routes resolve it via `ensureSellerId`.
- Seer: reads materialized `companies.score/tier/*_stars` (falls back to `tierFromCounts` if not refreshed), sorts by score, default view shows top 20 with the `Upgrade to view all` gate (Q6, UI-only; gate hides on any filter or paging). Empty state offers `Edit target`; filtered-empty offers `Clear search`.
- Detail: Analysis section shows Keyword/Freshness/Place/Target fit 0–5 star rows + `Overall n / 20` (G8, AI never computes scores); Contacts from the seeded 13 rows with per-contact `Source` link, honest `No contact found` otherwise; Email draft panel (`components/DraftPanel.tsx` + `/api/prospects/[id]/draft`) stores `{contact.name}` token, one row per (seller, company), Generate calls the LLM with real signals, Save writes the token text back; Sources last.
- Upload (`components/UploadFiles.tsx` on setup/company + `/api/upload`): multi picker + dropzone, per-file Reading…/Ready/Error with exact `Could not read that file.`, retry only re-opens the picker, remove drops the row only, drafts saved with quote + filename attribution, no auto-approve, original never persisted.
- Shell sidebar shows `Log in` for guests and `Log out` for users (G3).

- Smoke (dev, port 3018): home 200 (guest cookie issued), seer 200 with gate rendered, signup 200 (guest row claimed, session cookie set), login 200, bad password 401 with `Email or password is not valid.`, upload 2-file batch → 1 ready with citation + 1 error (exact copy), draft generate 200 (LLM live, token stored), draft save 200, WCK detail shows `No contact found` + source link, Hivolts detail shows both seeded contacts. Smoke users/guests/drafts deleted after; `sellers=1` (Harborline).
- `npm run check`, `tsc --noEmit`, `eslint .`, `npm run build` all pass.
- Not done (out of scope this pass): landing Astro + `/app` basePath (plan step 5), score-refresh against the new materialized columns is unchanged (cron), contact auto-lookup (C0) still backend-only, auth-form visual parity with FigCraft frames unverified (vision QA unavailable this session).

## Frontend revision (2026-11-08, later)

- Tailwind v4 (`tailwindcss`/`@tailwindcss/postcss` 4.3.5, theme + utilities only, no preflight; legacy CSS in `@layer base`). Used on Home, prospect detail, Contacts; other pages unchanged.
- Sidebar: Profiling and ICP removed, Contacts added. `/profiling` and `/setup/icp` still exist (setup wizard step 2).
- Home rebuilt per frame 5013. BrandLockup `seer` path was truncated (rendered "Klis"); full path restored from `logo-concepts/kliseer-lockup.svg`.
- Detail: disclaimer removed; per-star rule reasons; AI interpretation paragraph (`lib/analysis.ts`, `analyses` table, on-demand, never scores); Company profile (firm address from latest permit raw, contact-derived email/website/DM); contact cards with struck unavailable icons and Add contact manually.
- Contacts: `contacts.seller_id` (null = shared seed, set = manual, owner-only view/delete). `/contacts` table + New Contact dialog; `POST /api/contacts`, `DELETE /api/contacts/[id]`. Source URL required on manual entries. Draft generate only accepts seed or own contacts.
- Smoke (dev via SSH tunnel): home, Hivolts detail, manual add (rendered with Manual badge, then deleted; contacts back to 13), AI interpretation generated live, `/contacts` lists 14 then 13. `npm run check` (incl. `scripts/contacts.check.ts`), tsc, eslint, build pass. Schema applied with `db:init`.
- 2026-11-07: Seer aggregate measured through an SSH tunnel from this laptop to Supabase via the app VM. `EXPLAIN ANALYZE` of the 365-day company aggregate: 3901 ms, parallel seq scan, 363 rows filtered out of 237,239 signals, 22,509 companies returned. Direct 5432 from this laptop still times out. Counts at measure time: 238,328 signals, 22,556 companies.
