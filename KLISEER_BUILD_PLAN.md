# Kliseer build plan (v1, hackathon)

## Context

Desain FigCraft (`design/kliseer.figcraft`, export `design/export/*.png`, `design/tokens.css`, `DESIGN.md` §4–§10) dan daftar sumber (`docs/sources.md`) sudah ada. Yang dibangun: web app Track 2 "Future of Work" (sales ops), deploy di Vultr VM, URL publik. Deadline submit: 8 Nov 2026 22:00 UTC (`vultr-agent-rush.md` §Jadwal A). Alur end-to-end: setup seller (Company → ICP → Target → Review) → `Find prospects` → Seer tabel (tier S/A/B/C) → detail prospek dengan sinyal bertanggal + URL sumber. Data sinyal real dari permit publik; profil seller Harborline sintetis (DESIGN.md §10 "Data (Q2)"). Engine generik per seller, bukan hardcoded electrical, supaya seller lain bisa dipakai.

Animasi (Anime.js/Three.js, D-16) tidak dibatasi Next.js: pasang di client component (`'use client'`), Three.js lewat `next/dynamic` dengan `ssr: false`. Dikerjakan setelah plan ini selesai.

## Approach

### 1. Scaffold app di root repo ini

- Repo kerja: `kliseer-v2` (sudah git, remote `origin` = `https://github.com/ArdineSB/kliseer.git`). App dibuat di root; `docs/`, `design/`, `DESIGN.md` tetap.
- `npx create-next-app@latest . --ts --app --eslint --no-tailwind --no-src-dir --import-alias "@/*" --use-npm`. Kalau menolak karena folder tidak kosong: buat di `tmp-app/`, pindahkan isi ke root, hapus `tmp-app/`.
- Pin semua versi exact di `package.json` (hapus `^`/`~`).
- Dependensi tambahan, versi exact: `postgres` (driver Postgres), `openai` (client OpenAI-compatible untuk Fireworks/Vultr), `tsx` (dev, untuk script ingest). Tidak ada UI kit, tidak ada Tailwind, tidak ada ORM.
- `app/globals.css`: copy isi `design/tokens.css` di atas, lalu style dasar. Komponen pakai CSS Modules.
- `.env.example` dengan key: `DATABASE_URL`, `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`, `SODA_APP_TOKEN` (opsional). `.env.local` di `.gitignore`.
- Font: `next/font/google` Inter (DESIGN.md §7 Tipografi).

### 2. Database Postgres

- Lokal: `docker run -d --name kliseer-pg -e POSTGRES_PASSWORD=dev -p 5432:5432 postgres:16`; `DATABASE_URL=postgres://postgres:dev@localhost:5432/postgres`.
- `db/schema.sql` (idempotent, `create table if not exists`):

```sql
create table if not exists sellers (
  id serial primary key,
  company jsonb not null default '{}',   -- {name, website, products[], customerSegments[], existingCustomers[], region[], priceRange, keywords[]}
  icp jsonb not null default '{}',       -- {industry[], companySize, region[], eventTypes[]}
  target jsonb not null default '{}',    -- {companyTypes[], regions[], buyerRoles[]}
  status jsonb not null default '{"company":"draft","icp":"draft","target":"draft"}', -- per bagian: draft|approved
  sources jsonb not null default '{}',   -- per field: {"company.website": <chat_messages.id>}
  updated_at timestamptz not null default now()
);
create table if not exists companies (
  id serial primary key,
  name text not null,
  name_key text not null unique,         -- hasil normalizeName()
  state text not null                    -- 'NY','TX','WA'
);
create table if not exists signals (
  id serial primary key,
  company_id int not null references companies(id),
  source text not null,                  -- id dari SOURCES, mis. 'nyc-dob-permits'
  source_record_id text not null,
  signal_date date not null,
  summary text not null,
  region text,
  source_url text not null,
  raw jsonb not null,
  unique (source, source_record_id)
);
create index if not exists signals_company_date on signals(company_id, signal_date desc);
create table if not exists chat_messages (
  id serial primary key,
  seller_id int not null references sellers(id),
  tab text not null,                     -- 'home','klise','target','seer','signals','competitors','profiling','icp'
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
```

- `lib/db.ts`: `export const sql = postgres(process.env.DATABASE_URL!)`. Semua query lewat tagged template `sql\`...\`` (parameterized).
- `npm run db:init` = `tsx scripts/db-init.ts`: jalankan `db/schema.sql`, lalu insert seller Harborline kalau tabel kosong (nilai dari `docs/demo.md`: produk standby generator, switchboard, panelboard, transformer, cable tray, ATS; region `["NY","NJ"]`; keywords `["generator","switchboard","panelboard","switchgear","transformer","cable tray","transfer switch","ats","service upgrade","electrical service"]`; semua status `draft`).
- Multi-seller di DB sudah siap; UI v1 selalu pakai seller `id=1` (single user). ponytail: tanpa akun/login, tambah auth + seller per user kalau ada lebih dari satu pengguna.

### 3. Ingest generik SODA (S1 + S14 dulu)

Semua sumber live-tested yang dipakai (S1, S14, S12, S13) adalah Socrata SODA, jadi satu fungsi fetch + config mapping per sumber. Tidak ada adapter per kota.

- `lib/sources.ts`:

```ts
export type SodaSource = {
  id: string; label: string; state: string;
  endpoint: string;                 // https://.../resource/<id>.json
  dateField: string;
  where?: string;                   // filter SoQL tambahan
  map: (r: any) => { companyName: string | null; date: string | null; summary: string; region: string | null; recordId: string | null; url: string | null };
};
export const SOURCES: SodaSource[] = [...]
```

- Isi awal (mapping persis dari `docs/sources.md`):
  - `nyc-dob-permits` (S1): endpoint `https://data.cityofnewyork.us/resource/rbx6-tga4.json`, state `NY`, `dateField: 'issued_date'`, companyName = `owner_business_name ?? applicant_business_name`, summary = `${job_type} ${work_type}`, region = `borough`, recordId = `job__`.
  - `nyc-dob-electrical` (S14): endpoint `https://data.cityofnewyork.us/resource/dm9a-ab7w.json`, state `NY`, `dateField: 'permit_issued_date'`, companyName = `firm_name`, summary = `job_description`, region = `borough`, recordId = `job_filing_number`.
  - `url`: S1/S14 tidak punya deep link terverifikasi, jadi url = `${endpoint}?${recordIdField}=${encodeURIComponent(recordId)}` (query SODA untuk record itu; bisa dibuka dan diverifikasi). Jangan mengarang URL portal.
- `lib/ingest.ts` `ingestSource(src, sinceISO)`:
  - Page `?$where=${dateField} >= '${since}'${where ? ' AND ' + where : ''}&$order=${dateField}&$limit=5000&$offset=N` sampai batch < 5000. Header `X-App-Token` kalau `SODA_APP_TOKEN` ada.
  - Buang baris kalau `companyName`, `date`, atau `recordId` null/kosong (D-28 data kosong).
  - `normalizeName(name)`: lowercase, hapus tanda baca, hapus suffix `llc|inc|corp|corporation|co|ltd|company`, rapikan spasi. Upsert `companies` on conflict `name_key` do nothing, ambil id.
  - Insert `signals` `on conflict (source, source_record_id) do nothing` (D-28 duplikat).
  - Return `{fetched, kept, inserted, skippedEmpty}`; log ke stdout.
  - HTTP non-2xx: throw dengan status + endpoint; script lanjut ke sumber berikutnya, exit code 1 di akhir.
- `npm run ingest` = `tsx scripts/ingest.ts [sourceId...]`; default semua `SOURCES`, `since` = hari ini − 365 hari.
- Gate D-28 sebelum lanjut: jalankan untuk S1 + S14, cek 10 baris acak di DB punya nama perusahaan (bukan nama orang), tanggal, summary, URL yang bisa dibuka dan mengembalikan record yang sama; jalankan ingest dua kali, jumlah `signals` tidak bertambah.

### 4. Relevansi + tier (deterministik, tanpa LLM)

- `lib/tier.ts`:

```ts
export type Tier = 'S' | 'A' | 'B' | 'C' | '—';
export function matchKeywords(summary: string, keywords: string[]): string[]  // keyword yang muncul (case-insensitive, word boundary)
export function tierFor(signals: { date: string; matched: string[] }[], today: Date): Tier
```

- Aturan (jendela 90 hari dihitung dari `today`):
  - `S`: ≥2 sinyal dalam 90 hari dan ≥1 di antaranya relevan (`matched.length > 0`).
  - `A`: tepat 1 sinyal dalam 90 hari dan sinyal itu relevan.
  - `B`: ≥1 sinyal dalam 90 hari, tidak ada yang relevan.
  - `C`: tidak ada sinyal dalam 90 hari, ada sinyal dalam 365 hari.
  - `—`: tidak ada sinyal (status `unknown`, pesan `No signals from connected sources.`).
- Prospek relevansi lemah tetap tampil (D-27); relevansi hanya urutan + penjelasan.
- Penjelasan per sinyal di UI berupa template: `Matched "switchboard" in permit description` atau `No product keyword matched`. Bukan klaim akan membeli (D-25).
- Self-check: `scripts/tier.check.ts` dengan `node:assert` untuk tiap tier + batas 90/91 hari dan 365/366 hari; `npm run check` = `tsx scripts/tier.check.ts`.

### 5. API routes (App Router, `runtime = 'nodejs'`)

- `app/api/seller/route.ts`: `GET` → seller id 1. `PUT` body `{section: 'company'|'icp'|'target', data, approve?: boolean}`; validasi: section dari tiga nilai itu, `data` object, string ≤ 500 char, array ≤ 50 item; 400 kalau gagal. `approve: true` set `status[section]='approved'`; edit tanpa approve set kembali ke `draft`.
- `app/api/prospects/route.ts`: `GET ?q=&tier=&source=` → join `companies` + `signals` 365 hari terakhir, hitung `matchKeywords` dengan `company.keywords` seller, `tierFor`, flag `outsideRegion = !seller.company.region.includes(company.state)` (tetap tampil, hanya penanda; open-question 26 belum diputuskan). Urutan: tier S→A→B→C→—, lalu tanggal sinyal terbaru desc. Return juga summary `{total, tierS, new}` dengan `new` = company yang sinyal pertamanya ≤ 7 hari. ponytail: hitung di app per request; pindah ke materialized view kalau signals > ~200k.
- `app/api/prospects/[id]/route.ts`: `GET` → company + semua sinyal (date, source label, summary, matched, url) + tier. 404 kalau tidak ada.
- `app/api/chat/route.ts`: `POST {tab, message}` → simpan pesan user, panggil LLM (langkah 7), simpan balasan, return `{reply, drafts}`.

### 6. UI sesuai FigCraft

Acuan visual: `design/export/<frame>.png` per layar (nama frame di DESIGN.md §10). Ukur ulang dari file FigCraft lewat `get_node` bila perlu nilai persis.

- `app/layout.tsx`: shell desktop 1440×900 (sidebar 8 tab urutan DESIGN.md §4: Home, Klise, Target, Seer, Signals, Competitors, Profiling, ICP) + panel chat kanan per tab.
- Komponen di `components/` sesuai halaman `Components`: `Button` (Primary/Outline/Ghost, disabled, hover, focus), `NavItem`, `TierBadge`, `StatusBadge`, `TextField` (error), `ChipsField`, `ChatMessage`, `ChatComposer`, `SetupProgress`. Pakai `<button>`, `<label for>`, `<nav>`, `aria-current="page"`, focus ring 2px `--focus-ring`.
- Route: `/` Home, `/setup/company`, `/setup/icp`, `/setup/target`, `/setup/review`, `/seer`, `/seer/[id]`, `/signals`, `/competitors`, `/profiling`. Tab Klise → `/setup/company`, Target → `/setup/target`, ICP → `/setup/icp`.
- Setup: satu langkah per layar, stepper bisa klik ke langkah selesai (D-18). State per frame: empty, draft, loading, error, saved. Titik ungu + legenda `From chat` untuk field yang ada di `seller.sources` (D-20). Topbar status `Draft` / `Drafting…` / `Not saved` / `✓ Saved`. Simpan via `PUT /api/seller` saat `Continue`.
- Review: opsi Q20/A (approve per bagian, desain saat ini). `Find prospects` aktif hanya kalau ketiga bagian `approved`; navigasi ke `/seer`. Frame Q20/B dan Q20/C di FigCraft tidak disentuh.
- Seer tabel: cari + filter tier + filter sumber, ringkasan `total / Tier S / new`, state loading/empty/filtered-empty/error. Badge `Outside service region` kalau `outsideRegion`.
- Seer detail (`/seer/[id]`, dalam shell, `Back to prospects`): daftar sinyal dengan tanggal, sumber, summary, keyword matched, link sumber `target="_blank" rel="noopener"`. Tier `—` tampil pesan unavailable seperti frame `seer/detail/unavailable`. Kontak kosong ditampilkan sebagai kosong (D-26).
- Signals: tabel sinyal terbaru semua sumber (query langsung, tanpa route baru: server component). Competitors, Profiling: halaman statis dengan label `Sample data` sesuai frame.
- Home: chat global `tab='home'` + history thread per tab.

### 7. Chat draft (LLM)

- `lib/llm.ts`: `new OpenAI({ baseURL: process.env.LLM_BASE_URL, apiKey: process.env.LLM_API_KEY })`, model `process.env.LLM_MODEL`. Dev: Fireworks (`https://api.fireworks.ai/inference/v1`); demo: Vultr `https://api.vultrinference.com/v1` (D-13).
- Prompt sistem per tab setup: daftar field section itu + nilai sekarang; instruksi: balas JSON `{"reply": string, "drafts": {field: value}}`, hanya isi field yang disebut user. Tab non-setup: `drafts` selalu `{}`.
- Parse: `JSON.parse` dari blok `{...}` pertama di content. Gagal parse → `reply` = content mentah, `drafts` = `{}`. LLM error/timeout 30 s → 502 `{error: 'LLM unavailable'}`, UI tampil pesan + `Retry`; pesan user tetap tersimpan.
- Drafts ditulis ke section seller dengan status `draft`, dan `sources["<section>.<field>"] = assistantMessageId`. Klik titik ungu scroll panel chat ke pesan itu.
- LLM tidak menghitung tier/tanggal/skor.

### 8. Tambah S12 + S13

Setelah langkah 3–6 jalan end-to-end untuk NYC:

- `austin-permits` (S12): `https://data.austintexas.gov/resource/3syk-w9eu.json`, state `TX`, `dateField: 'issue_date'`, `where: "permit_class_mapped='Commercial'"`, companyName = `contractor_company_name`, summary = `${permit_type_desc} ${description}`, region = `original_city`, recordId = `permit_number`, url = `link?.url ?? link` (null → pakai rumus query SODA langkah 3).
- `seattle-electrical` (S13): `https://cos-data.seattle.gov/resource/c4tj-daue.json`, state `WA`, `dateField: 'issueddate'`, companyName = `contractorcompanyname` (buang yang diawali `BLANKET:`), summary = `${description} ${permittypemapped}`, region = `originalcity`, recordId = `permitnum`, url = `typeof link === 'string' ? link : link?.url`.
- Ulangi gate D-28 per sumber. Sumber lain di `docs/sources.md` (Chicago slot kontraktor, S3 USAspending, RSS, dll.) bentuk datanya beda; tidak masuk plan ini.

### 9. Deploy Vultr

- Vultr Cloud Compute VM (Ubuntu LTS). Postgres: Supabase on Vultr (Marketplace) dan pakai connection string Postgres-nya sebagai `DATABASE_URL`. Kalau Supabase on Vultr tidak tersedia/gagal dalam 1 jam: `docker run postgres:16` di VM yang sama, port tidak dibuka ke publik.
- App: Node LTS, `npm ci && npm run build`, jalankan `npm start` lewat systemd unit `kliseer.service` (`Restart=always`, `EnvironmentFile=/etc/kliseer.env`).
- HTTPS: Caddy reverse proxy `:443 → localhost:3000`, domain atau `<ip>.sslip.io`.
- Ingest: cron harian `0 6 * * * cd /opt/kliseer && npm run ingest >> /var/log/kliseer-ingest.log 2>&1`.
- Firewall: buka 22, 80, 443 saja.
- README: pemakaian Vultr (VM backend, Postgres, Serverless Inference), arsitektur, setup lokal, env keys.

## Critical files & anchors

- `design/export/*.png` + `design/kliseer.figcraft`: acuan piksel per frame; nama frame = route/state di langkah 6.
- `design/tokens.css`: sumber token; copy ke `app/globals.css`, jangan buat palet baru.
- `docs/sources.md` §S1, §S12, §S13, §S14: field mapping resmi; kalau beda dengan respons live, ikuti respons live dan update tabel di sana.
- `docs/demo.md`: data seller Harborline untuk seed.
- `docs/decisions.md` D-18…D-28: aturan produk yang mengikat UI dan ingest.

## Verification

Prasyarat: Docker jalan, `.env.local` terisi, cwd root repo.

1. `npm run db:init` → tabel ada, `select count(*) from sellers` = 1.
2. `npm run ingest nyc-dob-permits nyc-dob-electrical` → log `inserted > 0` per sumber; jalankan ulang → `inserted 0`. Buka 3 `source_url` acak di browser → JSON record dengan `recordId` sama.
3. `npm run check` → semua assert tier lolos.
4. `npm run dev`, browser `http://localhost:3000/setup/company`: isi lewat chat "We sell switchboards and standby generators in NY and NJ" → field Products terisi + titik `From chat`; Continue sampai Review; approve 3 bagian; `Find prospects` → `/seer` menampilkan prospek NYC real dengan tier, ringkasan angka benar (cocokkan `total` dengan `select count(distinct company_id) from signals where signal_date >= now() - interval '365 days'`).
5. Klik prospek tier S → detail: ≥2 sinyal ≤ 90 hari, ≥1 keyword matched, link sumber terbuka. Prospek tier `—`/C → pesan sesuai frame.
6. Matikan `LLM_API_KEY` → chat tampil error + `Retry`, pesan user tetap di thread.
7. Setelah langkah 8: prospek Austin/Seattle tampil dengan badge `Outside service region` untuk Harborline.
8. Setelah deploy: URL publik HTTPS membuka Home; ulangi langkah 4 di URL publik dengan `LLM_BASE_URL` Vultr.

## Assumptions & contingencies

- Stack: Next.js fullstack, satu proses di VM; Postgres via Supabase on Vultr (pilihan user).
- Tier: aturan rule-based langkah 4 (pilihan user). Engine temperature lama tidak dipakai; D-15 tetap tier di UI.
- Sumber: mulai S1 + S14, lalu S12 + S13 (pilihan user: mulai kecil, lalu tambah, data lintas scope).
- Tanpa auth: app publik tanpa login, siapa pun bisa edit seller dan memakai kredit LLM. Kalau user mau proteksi demo: tambah `middleware.ts` Basic Auth dengan `DEMO_USER`/`DEMO_PASS` dari env.
- Model LLM: daftar model Vultr belum dicek live (open-question 14). Saat deploy: `curl -H "Authorization: Bearer $LLM_API_KEY" https://api.vultrinference.com/v1/models`, pilih model chat pertama yang mendukung JSON di prompt, isi `LLM_MODEL`.
- Q20 = opsi A (approve per bagian), Q21 = detail dalam shell (desain saat ini).
- Kontak (Hunter, dll.) tidak dibangun; detail menampilkan kontak kosong (D-26).
