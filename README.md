<p align="center">
  <img src="public/brand/kliseer-icon.svg" width="64" height="64" alt="Kliseer icon" />
</p>

<h1 align="center">Kliseer</h1>
<p align="center"><strong>From public signals to a reason to reach out.</strong></p>
<p align="center">An evidence-first sales workspace for US electrical and building-material suppliers.</p>
<p align="center">
  <a href="https://64-177-42-81.sslip.io">Demo</a> ·
  <a href="#quick-start">Quick start</a> ·
  <a href="#how-it-works">Workflow</a> ·
  <a href="#built-on-vultr">Vultr architecture</a> ·
  <a href="presentation/README.md">Presentation</a> ·
  <a href="LICENSE">MIT license</a>
</p>

![Kliseer Seer workspace showing ranked companies, dated permit signals, source filters, and workspace chat](docs/screenshots/seer-prospects.png)

*Actual local application capture, November 8, 2026. Counts, rankings, and dates are a database snapshot—not live metrics or a sales-performance claim.*

> **Vultr Agent Rush · Powering the Future of Work**  
> Klise helps a seller explain their business. Seer turns dated public activity into an inspectable prospect shortlist. AI helps with extraction, interpretation, and writing; code owns the scores, sources remain visible, and a person decides what to do next.

## Why Kliseer

A permit can reveal relevant construction activity. It does not tell a supplier whether that company needs their products—or give a rep a complete, trustworthy outreach brief. That work is scattered across public portals, company documents, contact pages, and notes.

Kliseer brings the handoffs into one workspace:

- **Understand the seller:** capture products, service regions, ideal customer profile (ICP), target company types, and signal keywords.
- **Find a reason to investigate:** surface companies with dated public permit activity and explain the rules behind their rank.
- **Keep evidence close:** inspect source records, keyword matches, signal dates, and contact provenance alongside the prospect.
- **Prepare the next action:** compare candidates in chat and generate an outreach draft for a selected contact. Nothing is emailed automatically.

The demo seller, **Harborline Electrical Supply**, is fictional. The permit feeds are public records; saved contact records have sources. Relevance is not proof of buying intent.

## Explore the demo

**[Open the demo site](https://64-177-42-81.sslip.io)** · **[Open the workspace directly](https://64-177-42-81.sslip.io/app)**

The repository records this deployment address; availability and deployed revision can change. The screenshots here were captured locally, not presented as proof of the current remote deployment.

1. Open **Home** as a guest. A new guest workspace starts blank; no account is required to explore it.
2. Choose **Load demo data** to copy Harborline's company, ICP, and target profile into that blank workspace. This does not fabricate leads or contacts; those come from records already in the database.
3. Open **Klise** and review the setup fields. The sequence is **Company → ICP → Target → Review**; each section has its own approval.
4. Open **Seer**, inspect a company, and compare its score breakdown with its **Sources**. Companies outside the service region are flagged rather than hidden.
5. In chat, try **“Compare the current prospects”**, **“Which prospect should I contact first?”**, or **“Which prospects have no contacts?”**. These common requests have database-backed answer paths.
6. Review a sourced contact and the **Email draft** section. Account-gated actions, including public contact search, ask guests to sign in. AI generation requires a working inference configuration.

**Demo kit:** [editable slides](presentation/Kliseer-Presentation-EN.pptx), [PDF deck](presentation/Kliseer-Presentation-EN.pdf), and [recording guide](presentation/Kliseer-Script-EN.md). Presentation UI is illustrative; its November 7 examples are historical snapshots, not live model responses.

## How it works
```mermaid
flowchart TD
    Input["Seller description or company files"] --> Klise["Klise: draft structured setup fields"]
    Klise --> Review["Human review and section approval"]
    Review --> Seer["Seer: inspect ranked prospects"]
    Feeds["Public permit feeds"] --> Ingest["Normalize, deduplicate, score"]
    Ingest --> Seer
    Seer --> Evidence["Check dated signals and sourced contacts"]
    Evidence --> Draft["Generate and review an outreach draft"]
```

### 1. Klise: turn seller context into reviewed fields

Describe the business in chat, enter fields manually, or upload company documents. AI proposes structured fields; it does not approve the profile on the user's behalf.

- Uploads support **PDF, TXT, MD, and Markdown**, up to **2 MiB per file** and **20 files per request**.
- Document proposals must include a quote that occurs in the extracted text. Fields with invalid values or missing exact quotes are rejected by code.
- Extraction uses the first **12,000 characters per file**. PDFs need an extractable text layer; scanned-image OCR is not implemented.
- A failed file does not cancel the other files. Accepted fields are saved as drafts; later files win when they propose the same field.

![Klise company setup with the fictional Harborline seller, products, service regions, and signal keywords](docs/screenshots/company-setup.png)

*Actual application capture: structured company setup and the adjacent Klise chat. Blank example text in inputs is a placeholder, not saved company evidence.*

### 2. Seer: make the shortlist explainable

The ingestion pipeline reads public permit feeds, maps source-specific records into a common signal model, normalizes company names, and deduplicates signals by source and record ID. Each signal retains its date, summary, source URL, and raw source record.

Seer lists companies with a signal in the last **365 days**. Its materialized score sums four deterministic components, each worth up to five points:

| Component | Rule |
|---|---|
| Keyword | One point per keyword-matching signal in the last 90 days, capped at 5. |
| Freshness | Latest signal: ≤30 days = 5; ≤90 = 4; ≤180 = 3; ≤270 = 2; ≤365 = 1; otherwise 0. |
| Place | Seller service state = 5; target state = 3; otherwise 0. |
| Target fit | Company name or latest signal matches a target company type = 5; otherwise the baseline is 1. |

The total is **0–20**. Materialized tiers are **S ≥16**, **A ≥12**, **B ≥8**, **C ≥4**, and **— below 4**. Results sort by score, tier, keyword-match count, and latest signal date. AI does not assign these values.

**Current scoring boundary:** materialized scores are shared company columns refreshed from the demo seller (`sellers.id = 1`), not personalized scores for every workspace. Before materialization, a separate activity/keyword-count tier fallback is used. The two paths are implemented in [`lib/score.ts`](lib/score.ts), [`lib/tier.ts`](lib/tier.ts), and [`lib/prospects.ts`](lib/prospects.ts).

![Prospect detail showing the deterministic 16 out of 20 score, component explanations, dated signal, and source links](docs/screenshots/prospect-evidence.png)

*Actual application capture: Hivolts' score explanation and linked permit evidence. The displayed result is a dated snapshot, not a predicted conversion probability.*

### 3. Contacts, chat, and outreach: move forward without inventing facts

- **Sourced contacts:** saved records retain a source URL; missing contact fields remain missing. Signed-in users can search public pages or add contacts manually. Public search uses DuckDuckGo results through Jina Reader and model-assisted extraction, so availability and accuracy depend on those external services and the original pages.
- **Workspace-aware chat:** Home and workspace conversations use the seller profile, the current top 20 Seer candidates, and sourced contact records. Common compare/recommend/contact-list requests are answered directly from database snapshots; other requests use the configured model. **New chat** creates a separate persistent thread, and Home groups conversations by workspace.
- **Outreach drafts:** generated from seller, prospect, signal, and selected-contact context. Drafts are stored for review; the contact-name token lets a recipient change without regenerating the whole message. There is no automatic email-sending integration.

Generated prose and extracted contact details still need human verification. A source link is evidence to inspect, not a guarantee of correctness or permission to contact someone.

## Built on Vultr

Vultr supports three distinct parts of the documented hackathon deployment: **application compute, durable Postgres storage, and model inference**. They are not interchangeable services, and none is used to manufacture lead scores.

```mermaid
flowchart TD
    Browser["Browser"] --> Caddy["Caddy: HTTPS and path routing"]
    subgraph Compute["Vultr Cloud Compute · Ubuntu 24.04"]
        Caddy --> Landing["Static Astro landing at /"]
        Caddy --> App["Next.js workspace at /app"]
        Job["Scheduled ingestion and rule-based scoring"]
    end
    App --> DB[("Postgres: Supabase on Vultr Marketplace")]
    App --> AI["Vultr Serverless Inference"]
    Public["Public Socrata permit APIs"] --> Job
    Job --> DB
```

*Deployment topology described by this repository. Caddy's routing is committed configuration; completing the production cutover is a separate operator action, not an effect of editing this README.*

| Vultr service | What Kliseer uses it for | Integration in this repository |
|---|---|---|
| **Cloud Compute** | Run the Next.js application and ingestion process; serve the built Astro landing through Caddy. | [`deploy/kliseer.service`](deploy/kliseer.service) runs Next on `127.0.0.1:3000`; [`deploy/Caddyfile`](deploy/Caddyfile) serves `/` and proxies `/app`. |
| **Supabase on Vultr Marketplace** | PostgreSQL storage for sellers, accounts/sessions, conversations, companies, signals, contacts, analyses, and drafts. The documented deployment uses Supavisor for the database connection. | [`lib/db.ts`](lib/db.ts) uses `DATABASE_URL`; [`db/schema.sql`](db/schema.sql) defines the data model. The app uses SQL directly, not Supabase Auth or a browser Supabase client. |
| **Serverless Inference** | Structured setup proposals, file extraction, AI interpretations, general chat, contact extraction, and outreach writing. | [`lib/llm.ts`](lib/llm.ts) uses an OpenAI-compatible client with `LLM_BASE_URL=https://api.vultrinference.com/v1`, a server-side API key, and a selected model ID. |

**Why this split:** the database holds durable evidence and workspace state; compute handles ingestion, routing, and deterministic decisions; inference handles language tasks. The UI can display stored records without asking a model to recreate them.

### Configure a Vultr-backed instance

1. Prepare an Ubuntu Compute instance with **Node.js 22**, npm, Caddy, and the service/deploy users expected by the checked-in deployment files. The current workflow targets a specific host and SSH account; review those values before using it for another server.
2. Provision Supabase from Vultr Marketplace and obtain a reachable Postgres/Supavisor connection string. Keep database access restricted to the application host or another explicitly trusted network; the schema and connection URL alone do not configure a firewall.
3. In Vultr's inference service, obtain an API key and an available model ID. Put the base URL, key, and exact model ID in the server environment. Model access and billing depend on the account; the repository does not provision them.
4. Store runtime variables in `/opt/kliseer/.env.local`. Initialize the schema, build the release, and install the service using the repository's deployment configuration.
5. Complete the **[one-time Caddy preparation](deploy/README.md)** before enabling release activation. It preserves the previous Caddyfile and establishes the persistent symlink required by CI.
6. Configure the GitHub Actions secret **`DEPLOY_SSH_KEY`** for the reviewed deployment target. Do not commit database passwords, inference keys, or private SSH keys.

Refer to the [official Vultr documentation](https://docs.vultr.com/) for account-specific provisioning. The repository supplies application/deployment configuration, not automated cloud provisioning.

### Release and rollback behavior

Pull requests and pushes to `main` run the checks, type generation/typecheck, lint, and build in [GitHub Actions](.github/workflows/ci.yml). Only a verified push to `main` enters the deployment job.

The job uploads source into `/opt/kliseer/releases/<commit-sha>`, links the server-owned environment file, installs dependencies, initializes the schema, and builds on the VM. Before switching `/opt/kliseer/current`, it checks the Caddy symlink/backup and validates the release configuration. Activation restarts Next, reloads Caddy, and checks the landing HTML plus `/app` directly and through Caddy.

Failure during restart, reload, or health checks invokes the rollback handler for the previous release. **This is application/configuration rollback, not a database restore**; schema initialization occurs before activation. Follow the [deployment runbook](deploy/README.md) and retain database backups separately. No production deployment was performed for this documentation update.

## Quick start

### Prerequisites

- **Node.js 22** and npm, matching CI.
- A reachable **PostgreSQL** database. Docker is optional for a local database.
- Outbound HTTPS access to the permit feeds for ingestion.
- An OpenAI-compatible inference endpoint, API key, and model ID for AI features. Vultr is the documented demo provider; the client is environment-configurable.

Run commands from the repository root. Do not start duplicate servers if ports 3999 or 4321 are already in use.

### 1. Install and configure

```sh
npm ci
cp .env.example .env.local
```

On PowerShell, use `Copy-Item .env.example .env.local` instead of `cp` if needed. Edit `.env.local` before the database commands. The example database URL expects port **5433**; copying the file does not start a database.

For an optional isolated local Postgres instance matching that URL:

```sh
docker run --name kliseer-postgres -e POSTGRES_PASSWORD=dev -p 127.0.0.1:5433:5432 -v kliseer-postgres:/var/lib/postgresql/data -d postgres:17
```

The password above is for local development only. If that container already exists, start it with `docker start kliseer-postgres` instead of creating a duplicate.

For Vultr inference, set these values in `.env.local`:

```dotenv
DATABASE_URL=postgres://postgres:dev@localhost:5433/postgres
LLM_BASE_URL=https://api.vultrinference.com/v1
LLM_API_KEY=your-server-side-inference-key
LLM_MODEL=your-available-model-id
```

Replace the key and model placeholders. **The checked-in `.env.example` currently defaults to a Fireworks endpoint**; explicitly replace it when using Vultr. Never put inference credentials in `NEXT_PUBLIC_*` variables.

### 2. Initialize and ingest

```sh
npm run db:init
npm run ingest
```

`db:init` applies the schema and creates the synthetic Harborline seller only when the seller table is empty. `ingest` loads the configured sources and refreshes materialized scores after a successful run. On a fresh database this is a historical pull, not a tiny seed operation; completion depends on public API availability.

To begin with only one source, use this **instead of** the full ingestion command:

```sh
npm run ingest nyc-dob-electrical
```

An empty guest workspace is separate from the seeded demo seller. Once the application is open, use **Load demo data** on Home to populate the guest profile.

### 3. Start both surfaces

Terminal 1 — Next.js application:

```sh
npm run dev
```

Terminal 2 — Astro landing with the development proxy:

```sh
npm run dev:landing
```

Open **http://127.0.0.1:4321** for the landing and **http://127.0.0.1:4321/app** for the workspace on one origin. For app-only development, use **http://127.0.0.1:3999/app**. Next's configured base path is `/app`; its root is not the landing page.

### Environment reference

| Variable | Required for | Notes |
|---|---|---|
| `DATABASE_URL` | Database-backed application and database scripts | PostgreSQL connection string; use your actual host, port, credentials, and applicable connection security settings. |
| `LLM_BASE_URL` | AI features using the selected provider | Vultr: `https://api.vultrinference.com/v1`; the sample file uses Fireworks. |
| `LLM_API_KEY` | AI features | Server-only secret. |
| `LLM_MODEL` | AI features | Exact model ID available to your inference account. |
| `SODA_APP_TOKEN` | Optional ingestion token | Added as the Socrata `X-App-Token` header when present. |
| `HUNTER_API_KEY` | Optional historical contact-seeding utility | Used by `scripts/seed-hunter-contacts.ts`, not the current interactive public-search path. |

`DEMO_USER` and `DEMO_PASS` remain in the sample file but are **not used by current application authentication**. The app supports guest workspaces and email/password accounts; the former Basic Auth gate has been replaced. Missing inference configuration makes AI-dependent operations unavailable; it does not turn on a fabricated-response fallback.

## Data sources and refresh

| Source | Source ID for `npm run ingest` | Official dataset |
|---|---|---|
| NYC DOB building permits | `nyc-dob-permits` | [NYC Open Data · rbx6-tga4](https://data.cityofnewyork.us/resource/rbx6-tga4.json) |
| NYC DOB electrical permits | `nyc-dob-electrical` | [NYC Open Data · dm9a-ab7w](https://data.cityofnewyork.us/resource/dm9a-ab7w.json) |
| Austin issued construction permits, commercial only | `austin-permits` | [Austin Open Data · 3syk-w9eu](https://data.austintexas.gov/resource/3syk-w9eu.json) |
| Seattle electrical permits | `seattle-electrical` | [Seattle Open Data · c4tj-daue](https://cos-data.seattle.gov/resource/c4tj-daue.json) |

Ingestion starts from a rolling 365-day lower bound on an empty source, then resumes from the newest saved signal date with overlap absorbed by unique record keys. Source field mappings live in [`lib/sources.ts`](lib/sources.ts); research and coverage notes live in [`docs/sources.md`](docs/sources.md).

For a VM whose cron timezone is **UTC**, the documented daily schedule is 06:00. Install it only after checking the server's Node/npm path, permissions, environment file, and log destination:

```cron
0 6 * * * cd /opt/kliseer/current && /usr/local/bin/npm run ingest >> /var/log/kliseer-ingest.log 2>&1
```

This is an operator-installed schedule, not a task automatically created by the CI workflow. Re-running ingestion adds new source records; existing source/record-ID pairs are skipped rather than updated, so upstream corrections to previously saved records are not automatically synchronized.

## Development and project map

| Command | Purpose |
|---|---|
| `npm run check` | Tier, account, contact, chat-workspace, and guest-routing behavior checks. |
| `npm run check:landing` | Typecheck the landing scripts. |
| `npx next typegen && npx tsc --noEmit -p .` | Generate route types and typecheck the application, as CI does. |
| `npm run lint` | ESLint. |
| `npm run build` | Build Next.js, motion assets, and the static Astro landing. |
| `npm run build:landing` | Build the landing and its motion bundle only. |
| `npm run preview:landing` | Preview the built static landing only; not the combined production `/app` routing. |
| `npm run start -- --hostname 127.0.0.1 --port 3000` | Serve a previously built Next application; use Caddy for the production combined origin. |

| Path | Responsibility |
|---|---|
| [`app/`](app/) · [`components/`](components/) | Next.js App Router pages, API routes, and workspace UI. |
| [`lib/`](lib/) | Seller/account state, chat context, scoring, source ingestion, contacts, and draft generation. |
| [`db/schema.sql`](db/schema.sql) · [`scripts/`](scripts/) | PostgreSQL schema and operational/check scripts. |
| [`landing/`](landing/) | Static Astro landing with pinned Lenis 1.3.27 scrolling, cursor-following WebGL haze, and visible-only looping DOM/WAAPI workflows. |
| [`deploy/`](deploy/) · [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | Caddy, systemd, release activation, and CI. |
| [`docs/`](docs/) | Source research, decisions, demo notes, and verification records. |
| [`design/`](design/) | Native FigCraft source, design exports, tokens, and bundled fonts. |
| [`opening-video/`](opening-video/) · [`presentation/`](presentation/) | Remotion compositions, editable presentation, and recording materials; not required to run the app. |

The landing keeps static content usable without JavaScript. Its loader gates the hero preview rather than the whole document. Reduced motion makes workflow scenes static, keeps background haze still and uses native instant scrolling. Save-data skips WebGL but retains CSS haze and otherwise-allowed workflow loops; Pause stops all motion and smooth scrolling. Implementation and verification details: [storyboard](docs/landing-storyboard.md) and [landing verification](docs/landing-verification.md).

## Boundaries, privacy, and responsible use

- **Focused coverage, not a national lead database.** Four permit feeds cover selected records in New York City, Austin, and Seattle. A permit's named owner, applicant, or contractor is not automatically a purchasing decision-maker.
- **Shared demo ranking.** Scores are materialized for seller 1, not isolated per workspace. Company identity is normalized by name across sources; same-name companies in different states can merge and retain the first stored state, affecting region labels. Inspect the underlying records.
- **Not a billing product.** The top-20/upgrade affordance is a UI gate, not an implemented subscription or payment system.
- **Human-reviewed output.** Model instructions and validation reduce unsupported output but do not guarantee factual accuracy. Check generated prose, contact details, and original source records before use.
- **External data processing.** AI actions send relevant seller/profile, extracted document text, conversation, prospect, or contact context to the configured inference provider. Public contact search also uses DuckDuckGo and Jina Reader. Do not upload confidential material without appropriate authorization and provider review.
- **Secrets are server-side.** Keep runtime secrets out of source control and screenshots. Restrict database access and review deployment/network controls before exposing an instance.
- **No autonomous outreach.** Kliseer drafts; it does not send email, verify consent, guarantee deliverability, or perform legal/compliance review. Follow applicable source terms, privacy rules, and outreach laws.

## License and attribution

Original Kliseer-contributor-authored code and documentation are available under the **[MIT License](LICENSE)**, copyright © 2026 Kliseer contributors. You may use, modify, and redistribute them, including commercially, subject to the license. **Include the copyright and permission notice in copies or substantial portions of the software.** The software is provided **“AS IS,” without warranty**.

MIT does not relicense everything referenced or bundled in this repository:

- **Inter and Sora fonts:** SIL Open Font License 1.1; original notices remain with the bundled fonts.
- **Third-party dependencies:** retain their respective licenses. In particular, **Remotion has its own licensing terms**, not a blanket MIT grant from this project.
- **Public records, contact information, and trademarks:** subject to their owners' and sources' terms; inclusion does not imply endorsement or unrestricted reuse.
- **Generated presentation narration:** Microsoft voice/software terms apply; redistribution rights for the Zira recordings have not been verified. Review those rights before redistributing audio/video artifacts.

See **[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)** for attribution paths, upstream references, and scope. The MIT grant covers original project source and documentation; it is not a legal guarantee for every dependency, dataset, brand, or generated media artifact.
