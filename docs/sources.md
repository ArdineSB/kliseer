# Kliseer — Data Sources

Terakhir diperbarui: 2026-11-04. Menggantikan versi sebelumnya.

Scope: United States — building construction (NAICS 236, 238).
Seller demo: Harborline Electrical Supply, NY/NJ metro (fiktif).

Sumber dibagi tiga layer: **signal discovery** (siapa yang aktif beli), **contact enrichment** (siapa yang dihubungi), dan **AI enrichment** (kenapa sekarang, tier berapa).

Kolom status: `live-tested` = API sudah dicoba dan berhasil · `validated` = endpoint dikonfirmasi ada dan gratis · `to-test` = belum dicoba · `manual-only` = tidak diintegrasikan ke kode, diuji manual dulu.

---

## Layer 1 — Signal Discovery

### S1 · NYC DOB NOW — Building Permits

| Field | Value |
|---|---|
| Endpoint | `https://data.cityofnewyork.us/resource/rbx6-tga4.json` |
| Access | SODA API — no auth, no rate limit for reasonable use |
| Coverage | New York City |
| Freshness | Daily |
| Signal types | `permit` |
| Status | `live-tested` |

**Field mapping:**

| Raw field | Kliseer field | Catatan |
|---|---|---|
| `owner_business_name` → fallback `applicant_business_name` | `companyName` | Buang placeholder seperti `PR`, `N/A`, `Not Applicable`; jangan pakai nama orang |
| `issued_date` | `signalDate` | Buang jika null |
| `work_type` + `job_description` | `signalSummary` | Respons live tidak punya `job_type` |
| `borough` | `region` | |
| `tracking_number` | `sourceRecordId` | `work_permit` berulang pada renewal; tracking number per issuance |
| `tracking_number` pada endpoint SODA | `sourceUrl` | Query URL mengembalikan record sumber |

**Filter sebelum ingestion:** buang `issued_date` null · buang jika kedua field nama null · scope: NYC = in-scope ✅

**Kualitas: ⭐⭐⭐⭐⭐** — data pemerintah resmi, terstruktur, API stabil.

---

### S2 · City permit datasets (bukan satu feed US-wide)

Bukan satu adapter yang otomatis mencakup 10 kota. Cek 4 Nov 2026 memanggil catalog/API, bukan menebak dataset ID. Jendela hitungan: `issue`/`issued`/`filing` setelah 2025-10-01, kecuali disebut lain. Kota yang portalnya tidak menjawab tidak dinyatakan "tidak punya data".

| Kota | Host yang menjawab | Dataset | Nama perusahaan | Status |
|---|---|---|---|---|
| Chicago | `data.cityofchicago.org` | [Building Permits `ydr8-5enu`](https://data.cityofchicago.org/d/ydr8-5enu), updated 2026-11-03 | `contact_1_type` sering `OWNER` (bisa nama orang). Contractor ada di slot kontak, bukan kolom tetap. 34.525 issued; 10.272 punya `CONTRACTOR*` di slot 1–3 | `live-tested`. Pakai hanya slot `CONTRACTOR*`; jangan pakai nama orang |
| Austin | `data.austintexas.gov` dan `datahub.austintexas.gov` | [Issued Construction Permits `3syk-w9eu`](https://datahub.austintexas.gov/d/3syk-w9eu) | `contractor_company_name`. 60.487 issued, 54.716 berisi nama. Commercial electrical: 4.857 / 3.940. `link.url` ada | `live-tested`. Kandidat pertama di luar NYC. Lihat S12 |
| Seattle | `cos-data.seattle.gov` | Electrical [`c4tj-daue`](https://cos-data.seattle.gov/resource/c4tj-daue.json); building `76t5-zqzr` | Electrical non-residential 2.490 / 2.188. Building non-residential 1.475 / 102. Buang nilai `BLANKET:` | Electrical `live-tested` (S13). Jangan utamakan building |
| Dallas | `www.dallasopendata.com` (`data.dallascityhall.com` tidak resolve) | Building Permits `e7gq-4sah`, updated 2026-11-04 | Kolom `contractor` ada, tetapi isi 2026 sangat jarang: commercial electrical 5.517 record, 43 berisi nama. Tanggal teks `MM/DD/YY` | `live-tested`, lemah untuk lead saat ini |
| Los Angeles | `data.lacity.org` | Issued building `pi9x-tg5x`, electrical `ysqd-apz7`: tidak ada kolom perusahaan. CofO [`3f9m-afei`](https://data.lacity.org/d/3f9m-afei) | CofO `contractors_business_name`: 11.730 issued, 7.622 berisi nama | Issued permit bukan lead source. CofO sinyal terlambat, belum diutamakan |
| San Francisco | `data.sfgov.org` / `data.sf.gov` | Permits `i98e-djp9` tanpa nama. Contacts [`3pee-9qhc`](https://data.sf.gov/resource/3pee-9qhc.json) punya `firm_name` | Join `permit_number` ke `issued_date` wajib. `from_date` kontak sering null | `live-tested`, belum siap diintegrasikan |
| Boston | `data.boston.gov` | Catalog SODA 404; API lokal 403 | Tidak diketahui | `to-test`. Jangan anggap SODA |
| Denver | `data.denvergov.org` | Catalog SODA 404; host lokal 301 | Tidak diketahui | `to-test` |
| Philadelphia | `data.phila.gov` | Catalog SODA 404; API lokal 403 | Tidak diketahui | `to-test` |
| Baltimore | ArcGIS Hub, bukan SODA | Housing and Building Permits 2015–2018 | Tidak ada field perusahaan. Bukan data saat ini | `validated`, lemah |

Ditolak untuk lead per perusahaan: [NJ Construction Permit Data `w9se-dmra`](https://data.nj.gov/resource/w9se-dmra.json) hanya punya kota/biaya/use group, tanpa nama perusahaan. Dataset kontraktor San Diego County ada di host `internal-*.data.socrata.com`; jangan dipakai. Calgary di luar scope AS.

**Kualitas S2 tidak seragam.** Austin dan Seattle electrical kuat. Chicago sedang. SF butuh join. Dallas 2026, LA issued, dan Baltimore lemah.

---

### S12 · Austin issued construction permits

| Field | Value |
|---|---|
| Endpoint | `https://data.austintexas.gov/resource/3syk-w9eu.json` (host `datahub.austintexas.gov` juga menjawab) |
| Dataset page | `https://datahub.austintexas.gov/d/3syk-w9eu` |
| Access | SODA, no auth pada panggilan uji |
| Coverage | City of Austin, bukan Texas |
| Freshness | `rowsUpdatedAt` metadata 4 Nov 2026; sample `issue_date` 2026-11-02 |
| License metadata | `Public Domain U.S. Government`. Halaman terms kota ([`ranj-cccq`](https://data.austintexas.gov/stories/s/ranj-cccq)) tidak mengembalikan teks hukum pada fetch statis. Baca terms itu sebelum redistribusi |
| Status | `live-tested` |

**Field mapping:**

| Raw field | Kliseer field | Catatan |
|---|---|---|
| `contractor_company_name` | `companyName` | Buang jika null. Jangan pakai `contractor_full_name` sebagai perusahaan |
| `issue_date` | `signalDate` | ISO. Buang jika null |
| `permit_type_desc` + `description` + `permit_class_mapped` | `signalSummary` | |
| `original_city` | `region` | Austin, TX |
| `permit_number` | `sourceRecordId` | |
| `link.url` | `sourceUrl` | Contoh: `https://abc.austintexas.gov/web/permit/public-search-other?t_detail=1&t_selected_folderrsn=13799220`. Angka itu bukan `permit_number`. Jangan dibuat |

Filter demo: `permit_class_mapped='Commercial'`. Untuk seller electrical, utamakan `permittype='EP'` (electrical). BP/MP komersial tetap relevan, tetapi lebih lebar. Residential ada di dataset yang sama; jangan ikut demo.

**Kualitas: tinggi untuk lead kota ini.** Nama perusahaan, tanggal, kelas commercial/residential, dan jenis electrical/building terpisah. Bukan cakupan nasional.

---

### S13 · Seattle electrical permits

| Field | Value |
|---|---|
| Endpoint | `https://cos-data.seattle.gov/resource/c4tj-daue.json` |
| Access | SODA, no auth pada panggilan uji |
| Coverage | City of Seattle |
| Freshness | View metadata `rowsUpdatedAt` 4 Nov 2026. Deskripsi resmi: all electrical permits issued or in process |
| License metadata | `Public Domain` |
| Status | `live-tested` |

**Field mapping:**

| Raw field | Kliseer field | Catatan |
|---|---|---|
| `contractorcompanyname` | `companyName` | Non-residential sejak 2025-10-01: 2.188 / 2.490 |
| `issueddate` | `signalDate` | |
| `description` + `permittypemapped` | `signalSummary` | |
| `originalcity` | `region` | |
| `permitnum` | `sourceRecordId` | |
| `link` | `sourceUrl` | Portal `services.seattle.gov/.../LinkToRecord.aspx?altId=`. SODA bisa mengembalikan string atau `{url}` |

`permitclassmapped='N/A'` berjumlah 20.049 pada jendela yang sama. Jangan dianggap commercial. Building permits `76t5-zqzr` baru, tetapi nama kontraktor terlalu jarang.

**Kualitas: tinggi untuk kontraktor electrical Seattle.** RAE tidak menambah apa-apa; API sudah publik.

---

### S14 · NYC DOB NOW electrical applications

| Field | Value |
|---|---|
| Endpoint | `https://data.cityofnewyork.us/resource/dm9a-ab7w.json` |
| Access | SODA, no auth pada panggilan uji |
| Coverage | New York City, bukan perluasan geografi |
| Freshness | 60.263 record dengan `permit_issued_date` setelah 2025-10-01; 60.262 punya `firm_name` |
| Status | `live-tested` |
| Signal types | `permit` |

**Field mapping:** `firm_name` → `companyName` · `permit_issued_date` → `signalDate` · `job_description` → `signalSummary` · `borough` → `region` · `job_filing_number` → `sourceRecordId`. Sample punya `license_type=Electrician`. Deep link per filing belum diverifikasi; jangan dibuat.

**Kualitas: tinggi untuk ICP electrical di NYC.** Lebih langsung daripada building permit S1, tetapi bukan coverage AS.

---

### S3 · USAspending.gov — Federal Contract Awards

| Field | Value |
|---|---|
| Endpoint | `https://api.usaspending.gov/api/v2/search/spending_by_award/` |
| Access | REST API — no auth |
| Coverage | US-wide (federal contracts only) |
| Freshness | Nightly |
| Signal types | `contract` |
| Status | `validated` |

**Field mapping:**

| Raw field | Kliseer field |
|---|---|
| `recipient_name` | `companyName` |
| `action_date` | `signalDate` |
| `award_description` | `signalSummary` |
| `place_of_performance_state_code` | `region` |
| `award_id` | `sourceRecordId` |
| `usaspending_permalink` | `sourceUrl` |

**Filter:** NAICS 236xxx dan 238xxx only · buang `action_date` null · buang non-US.

**Kualitas: ⭐⭐⭐⭐** — data federal resmi. Hanya GC yang dapat proyek federal, tidak mencakup private/commercial.

---

### S4 · SAM.gov — Federal Contracts + Opportunities

| Field | Value |
|---|---|
| Endpoint | `https://api.sam.gov/opportunities/v2/search` |
| Access | REST API — API key gratis (daftar di sam.gov) |
| Coverage | US-wide |
| Freshness | Near real-time |
| Signal types | `contract` |
| Status | `to-test` |

Lebih lengkap dari USAspending karena mencakup *opportunities* (tender yang sedang buka) bukan hanya awards. Berguna untuk menemukan GC yang sedang aktif mengejar proyek.

**Kualitas: ⭐⭐⭐⭐** — lebih luas dari USAspending, tapi butuh API key gratis.

---

### S5 · Google News RSS — Project & Expansion News

| Field | Value |
|---|---|
| URL | `https://news.google.com/rss/search?q=[query]&hl=en-US&gl=US&ceid=US:en` |
| Access | Public RSS — no auth |
| Coverage | US-wide |
| Freshness | Near real-time |
| Signal types | `contract`, `expansion` |
| Status | `validated` |

**Contoh query untuk Harborline ICP:**
- `"electrical contractor" "New York" "new project"`
- `"general contractor" "warehouse" "switchboard"`
- `"building permit" "Queens" "commercial"`

LLM diperlukan untuk ekstrak nama perusahaan dan jenis sinyal dari judul + snippet.

**Kualitas: ⭐⭐⭐** — cakupan baik, gratis, real-time. Noisy, duplikat umum.

---

### S6 · Trade Publication RSS — Industry Signals

| Sumber | RSS URL | Signal types |
|---|---|---|
| ENR (Engineering News-Record) | `https://www.enr.com/rss/all` | `contract`, `expansion` |
| Construction Dive | `https://www.constructiondive.com/feeds/news/` | `contract`, `expansion` |
| BD+C (Building Design+Construction) | `https://www.bdcnetwork.com/rss.xml` | `expansion`, `permit` |
| PR Newswire — Construction | `https://www.prnewswire.com/rss/news-releases-list.rss?category=CNS` | `contract`, `expansion` |
| GlobeNewswire | `https://www.globenewswire.com/RssFeed/industry/9828` | `contract`, `expansion` |

Access: semua RSS publik, no auth.
LLM diperlukan untuk ekstrak nama perusahaan, jenis sinyal, dan rangkuman.

**Kualitas: ⭐⭐⭐** — lebih targeted dari Google News, lebih sedikit noise. Volume lebih kecil.

---

### S7 · Indeed RSS — Hiring Signals

| Field | Value |
|---|---|
| URL | `https://www.indeed.com/rss?q=[query]&l=[location]` |
| Access | Public RSS — no auth |
| Coverage | US-wide |
| Freshness | Frequent |
| Signal types | `hiring` |
| Status | `validated` |

**Contoh query:**
- `q=electrician&l=New+York`
- `q=project+manager+electrical&l=United+States`
- `q=estimator+construction`

**Filter:** buang posting dari staffing agency (keywords: staffing, recruiting, agency).

**Kualitas: ⭐⭐⭐** — signal hiring kuat. Nama perusahaan kadang hilang atau dari agency.

---

### S8 · LinkedIn — link manual, tanpa extension

| Field | Value |
|---|---|
| Tool | Tidak ada. Tombol "Open LinkedIn →" membuka link biasa; user mengisi nama dan title sendiri lewat form |
| Access | Browser user sendiri. Kliseer tidak mengambil data dari LinkedIn |
| Coverage | Hanya URL yang sudah ada di data |
| Signal types | Tidak ada |
| Status | `manual-only` (Q17, 7 Nov) |

**Dibatalkan:** browser extension yang capture nama, jabatan, atau email dari LinkedIn. LinkedIn User Agreement §8.2 dan [automated activity guidance](https://www.linkedin.com/help/linkedin/answer/a1340567/automated-activity-on-linkedin?lang=en) menyebut browser extension. Persetujuan user tidak mengubah itu. Kasus Kaspr (CNIL, Des 2024) berbeda dari sisi sumber data dan tidak dijadikan dasar keputusan ini.

**Tidak dibangun:** extension capture, POST dari extension ke `/api/contacts`, scraping, token session, endpoint privat.

Dibangun ulang hanya kalau LinkedIn memberi akses resmi (API atau partnership). ToS dicek ulang saat itu.

---

### S9 · OSHA Establishment Data

| Field | Value |
|---|---|
| Endpoint | `https://data.osha.gov/api/` |
| Access | REST API — no auth |
| Coverage | US-wide |
| Freshness | Periodic |
| Signal types | `expansion` (perusahaan aktif beroperasi) |
| Status | `to-test` |

Berguna untuk verifikasi perusahaan konstruksi yang aktif, bukan sebagai sinyal beli utama.

**Kualitas: ⭐⭐** — lebih cocok untuk verifikasi dan enrichment daripada discovery.

---

### S10 · OpenCorporates — Business Registrations

| Field | Value |
|---|---|
| Endpoint | `https://api.opencorporates.com/v0.4/companies/search` |
| Access | REST API — free tier tersedia |
| Coverage | US-wide + global |
| Freshness | Varies per state |
| Signal types | `expansion` (registrasi bisnis baru) |
| Status | `to-test` |

Registrasi bisnis baru perusahaan konstruksi = potential prospect baru.
Field officer/name perlu aturan khusus: nama officer bisa nama orang, jangan dipakai sebagai company name.

### S11 · NYC DEP public construction bids (candidate)

| Field | Value |
|---|---|
| Source | [DEP Bids & Proposals](https://www.nyc.gov/site/dep/about/bids-and-proposals.page) · [Current Bids app](https://a826-web01.nyc.gov/GIGrant/PACT/BidEstimate.aspx) |
| Access | Public page; DEP links to a public embedded bid-list app |
| Coverage | NYC DEP projects only |
| Fields observed | Project/bid title, contract code/E-PIN, start date, bid date, pre-bid info |
| Status | `to-test` — source read manually; no API/client capture yet |
| Signal types | `contract`, `expansion` (candidate) |

The official DEP page links current bids and six-/24-month upcoming-bid lookaheads and says DEP awards more than $1B in construction, construction-related, and engineering contracts annually. The public list showed 15 current contracts when checked 4 Nov 2026. Good provenance for agency opportunities; relevance to a specific electrical supplier is **medium** until scopes/specifications identify electrical work. Coverage is one agency, not the citywide market. [DEP overview](https://www.nyc.gov/site/dep/about/bids-and-proposals.page) · [current list](https://a826-web01.nyc.gov/GIGrant/PACT/BidEstimate.aspx)

**RAE fit:** inspect the public embedded page only. RAE may reveal a public, unauthenticated data endpoint and generate a client; the presence of an iframe does not prove such an endpoint exists. If there is no suitable public API, use the visible public page or a documented source instead. Check site terms and rate limits before automation.

**Initial quality estimate:** source authority high; lead relevance medium; coverage narrow. RAE client quality is unknown until verified for paging, dates, missing fields, duplicates, and source links.

---

## Layer 2 — Contact Enrichment

### Product Tiers — Contact Access Model

| | Guest | Free (login) | Paid |
|---|---|---|---|
| **Data** | Harborline study case (disalin ke akun user) | Live signals (real permits) | Live signals |
| **Contact** | 10 perusahaan pre-seeded, data asli dengan sourceUrl (Q12, Q18) | 5 auto-lookup/bulan + LinkedIn manual unlimited | Unlimited auto-lookup + LinkedIn manual |
| **LinkedIn** | — | ✅ Link manual, unlimited (Q17) | ✅ Link manual, unlimited |
| **API cost ke kita** | \$0 | ~\$1–2/bulan | ~\$50+/bulan |

**Guest** hanya akses ke Harborline case study — data dan kontak sudah di-hardcode, tidak ada API call. Label UI: **"Explore Demo"** (bukan "Guest" — terkesan second-class).

---

### UI Copy — Contact Enrichment Panel

```
Get contact info two ways:

⚡ Auto-lookup  (5/month — for demo purposes)
   We find it from the company website and public directories.

🔗 LinkedIn  (manual, free)
   Open their LinkedIn, then add name and title here.
   [Open LinkedIn →]           ← tampil kalau ada LinkedIn URL
   Tanpa LinkedIn URL: ikon dicoret. Tooltip: "No LinkedIn found — try auto-lookup instead."
```

> [!NOTE] "For demo purposes" hanya tampil di tier Free. Paid tier tidak perlu label ini.

---

### C0 · Contact Enrichment Decision Tree

Setiap request kontak untuk satu company, backend jalankan urutan ini:

```
Company masuk enrichment queue
│
├─ 1. LinkedIn URL ada?
│      YES → tampilkan [Open LinkedIn →] (link biasa, new tab)
│             User isi nama + title sendiri lewat form
│             → POST /api/contacts { name, title, linkedinUrl, companyId, source: "user-manual" }
│      NO  → ikon LinkedIn dicoret, tidak bisa diklik
│
├─ 2. Auto-lookup (pakai 1 credit dari jatah bulanan):
│
│      Step A — Jina crawl website (GRATIS)
│               r.jina.ai/[domain]/contact · /about · /team
│               LLM ekstrak: nama, role, email + kutipan dan URL asal
│               → Dapat hasil? DONE. Simpan + return.
│
│      Step C — Direktori publik (GRATIS, manual-index)
│               The Blue Book · BBB · NYBizDB · NYC DOB license lookup
│               Hanya perusahaan NYC/NJ dalam scope demo
│               → Dapat hasil? DONE. Simpan + return.
│
│      Step D — SerpAPI + Hunter.io (BERBAYAR, paid tier saja)
│               Hanya kalau Step A dan C gagal. Free tier: DILARANG.
│
└─ 3. Floor — selalu ada, zero API:
       Alamat dari permit record (DOB), link ke source record
       Telepon tidak ditemukan dari A/C → "Phone: not found" + link source record
```

**Aturan ketat:**
- Free tier: TIDAK boleh memanggil SerpAPI atau Hunter.io
- Step B (Google Custom Search) dihapus: API ditutup untuk pelanggan baru, sunset 1 Jan 2027 (Q16). Pengganti dicari setelah ada yang terverifikasi masih hidup.
- Floor = alamat saja. S1 `applicant_business_address` adalah alamat pemohon (bisa beda dari owner); S14 `firm_address` adalah alamat firma. Telepon tidak ada di S1 dan S14 (Q15).
- Gagal A dan C → tampilkan floor + tawaran auto-lookup lebih dalam (paid).
- Kontak tanpa sourceUrl tidak ditampilkan (aturan provenance).
- Coverage Step A diukur 7 Nov pada 10 perusahaan guest: homepage saja 1/10, tambah `/contact` `/about` `/team` jadi 4/10. 40 halaman semuanya bisa di-crawl (HTTP 200).

**Runtime 8 Nov 2026:** auto-lookup sudah jalan (bukan desain saja). `lib/lookup.ts` + `POST /app/api/prospects/[id]/lookup`: DuckDuckGo HTML dibaca lewat `r.jina.ai` (dua query: `"<company> <state> contact email phone"` dan `"<company> linkedin"`), snippet hasil pencarian = kutipan halaman sumber, tiga halaman teratas di-crawl penuh paralel (halaman CAPTCHA dibuang), LLM ekstrak ≤5 kontak JSON, validasi ketat `cleanContact` + pencocokan sourceUrl dengan halaman yang benar-benar dibaca. Login wajib, kuota 5/bulan per seller (tabel `contact_lookups`), lookup tanpa hasil tetap memotong kuota. Tombol "Search publicly" di panel Contacts detail prospect; guest lihat "Log in to search contacts". Diuji live: JOSEPH WEINSTEIN ELECTRIC (id 69681) menghasilkan Martin Weinstein/Owner + LinkedIn + phone 718-843-5555 dari allbiz/chamberofcommerce — sama dengan pencarian Google manual. DuckDuckGo `&rut=` tracking suffix harus dibuang sebelum mencocokkan sourceUrl (tidak jadi query param). Step C manual (Blue Book dll.) belum otomatis; Step D tetap dilarang di Free.


---

### C1 · Jina AI Reader — Company Website Crawl

| Field | Value |
|---|---|
| URL | `https://r.jina.ai/[target-url]` |
| Access | Gratis, no auth |
| Status | `validated` |

**Workflow:**
1. Temukan domain perusahaan dari data permit / Google search
2. Crawl `r.jina.ai/https://[domain]/team`, `/about`, `/contact`
3. LLM ekstrak: nama, role, email dari markdown hasil crawl
4. Simpan dengan `sourceUrl` = URL halaman asli

**Target role:** VP of Operations, Project Manager, Procurement, Estimator, Facilities Manager.

**Kualitas: ⭐⭐⭐** — bekerja kalau ada halaman team. Banyak perusahaan konstruksi tidak publish staff online.

---

### C2 · Google → LinkedIn People Snippets (via SerpAPI)

| Field | Value |
|---|---|
| Endpoint | `https://serpapi.com/search` |
| Free tier | 100 req/bulan |
| Access | API key gratis |
| Status | `to-test` |

**Query pattern:** `site:linkedin.com/in "[company name]" "[city]"`

Membaca snippet Google dari index publik LinkedIn — bukan scrape LinkedIn langsung.

Hasil LLM: `decisionMaker.name`, `decisionMaker.role`, `decisionMaker.sourceUrl`.

**Kualitas: ⭐⭐⭐** — nama nyata dari profil nyata. Email tidak tersedia. Confidence: medium.

---

### C3 · Hunter.io Email Finder

| Field | Value |
|---|---|
| URL | `https://hunter.io` |
| Plan terukur | Free. Akun ini: 50 search credit/bulan, 100 verification. Dicek 7 Nov 2026 lewat `GET /v2/account`. Bukan 25 req. |
| Status | `paid-path` — klien di `lib/hunter.ts`. Dipakai sekali untuk 7 kontak guest, 7 Nov. Runtime tier Free tetap dilarang memanggilnya. |

Uji 7 Nov 2026, Domain Search, tiga domain C5. Kredit sesudah uji: search 2 terpakai, 48 sisa. Verification 4 terpakai. Domain tanpa hasil tidak memotong search credit.

| Domain | Hasil Hunter | Cek halaman |
|---|---|---|
| solasnyc.com | `office@solasnyc.com`, generic, confidence 76, sumber `solasnyc.com` dan `/about-5`. Juga `conor@solasnyc.com`, personal, confidence 85, sumber yang diklaim `solasnyc.com`. | `office@` ada di kedua halaman. `conor@` tidak ada di HTML kedua halaman. Jangan dipakai. |
| hivoltselectrical.com | `moishy@` dan `yosef@`. Sumbernya URL pencarian Google `site:linkedin.com`, bukan halaman perusahaan. | Homepage hanya memuat `jobs@hivoltelectrical.com` (domain beda satu huruf). `debbie@` dan `jobs@hivoltselectrical.com` tidak ada di HTML itu. Email Hunter tidak dipakai: sumbernya bukan halaman yang bisa dibuka sebagai bukti. |
| aselectricnyc.com | 0 email. | Homepage tidak memuat email. Email C5 ada di domain AOL, di luar jangkauan Domain Search. |

Keputusan: Hunter adalah Step D, jalur berbayar. Tujuh kontak guest diisi dari situ, 7 Nov, dan disimpan di tabel `contacts`. Runtime Free tetap tidak memanggil Hunter. Akun API ini masih plan Free Hunter, 50 search credit/bulan, bukan langganan Starter.

---

### C5 · Demo Enrichment Results — NYC DOB Leads (5 Nov 2026)

Tiga perusahaan dari S1 (NYC DOB electrical permits) diperkaya manual dari website publik, The Blue Book, BBB, NYBizDB, dan DOB licensing records. Data nyata, tanpa sensor, tanpa seed sintetis (Q18).

> [!NOTE] Data B2B: email bisnis yang dipublish perusahaan sendiri, nama owner dalam kapasitas profesional, alamat dan telepon dari direktori publik. Tiap field wajib punya sourceUrl saat tampil (aturan provenance).

---

#### Lead #1 — SOLAS ELECTRICAL CORP

| Field | Value |
|---|---|
| **Company** | Solas Electrical Corp |
| **Also known as** | Solas Electrical NYC |
| **Signal source** | NYC DOB electrical permits (S1) |
| **Signal date** | Nov 5, 2026 |
| **Signal count** | 135 (117 keyword match) |
| **Signal summary** | Wiring for 160' of sidewalk shed lighting |
| **Address** | 1611 East 233rd Street, The Bronx, NY |
| **Phone** | (718) 924-7839 |
| **Email** | office@solasnyc.com · conor@solasnyc.com |
| **Website** | https://solasnyc.com |
| **Decision maker** | Conor Downey |
| **DM title** | Owner / Founder |
| **DM notes** | Founded 2021. `conor@` dari Hunter Domain Search, 7 Nov. Diterima sebagai email publik. HTML halaman yang diklaim Hunter tidak memuat string itu saat dicek. |
| **Enrichment sources** | solasnyc.com (direct) · Hunter Domain Search |
| **Confidence** | High untuk `office@`. `conor@` diterima sebagai email publik, sumber Hunter. |

---

#### Lead #2 — HIVOLTS ELECTRICAL INC

| Field | Value |
|---|---|
| **Company** | Hivolts Electrical Inc |
| **Signal source** | NYC DOB electrical permits (S1) |
| **Signal date** | Nov 1, 2026 |
| **Signal count** | 37 (102 keyword match) |
| **Signal summary** | Temporary service, lighting and power |
| **Address** | 21 Herkimer Pl, Brooklyn, NY 11216 |
| **Phone** | (718) 855-4346 |
| **Email** | debbie@hivoltselectrical.com · jobs@hivoltselectrical.com · moishy@hivoltselectrical.com · yosef@hivoltselectrical.com |
| **Website** | https://hivoltselectrical.com |
| **Decision maker** | Isaac Fuchs |
| **DM title** | Licensed Electrician / Business Principal |
| **DM notes** | `moishy@` Operations Manager, Moishy Rosman. `yosef@` Yosef Oberlander. Keduanya dari Hunter, 7 Nov, diterima sebagai email publik. Sumber Hunter berupa URL pencarian Google, bukan halaman perusahaan. |
| **Enrichment sources** | hivoltselectrical.com · brokersnapshot.com · nyc.gov DOB licensing · Hunter Domain Search |
| **Confidence** | High untuk email yang ada di situs. Email Hunter diterima sebagai email publik. |

---

#### Lead #3 — A & S ELECTRIC INC.

| Field | Value |
|---|---|
| **Company** | A & S Electric Inc. |
| **Signal source** | NYC DOB electrical permits (S1) |
| **Signal date** | Nov 5, 2026 |
| **Signal count** | 50 (97 keyword match) |
| **Signal summary** | Generator Maintenance — Replace Oils and Filters |
| **Address** | 952 Flushing Ave, Suite 3, Brooklyn, NY 11206 |
| **Phone** | (718) 821-1211 |
| **Fax** | (718) 821-1255 |
| **Email** | aselectricinc@aol.com |
| **Website** | https://aselectricnyc.com |
| **Decision maker** | Francis Richards |
| **DM title** | President / CEO |
| **DM notes** | Terdaftar di The Blue Book dan BBB. Email domain AOL — kemungkinan perusahaan lama; approach via phone bisa lebih efektif. |
| **Enrichment sources** | thebluebook.com · bbb.org · nybizdb.com · nyc.gov |
| **Confidence** | Medium-high — DM dari business registry publik; email valid tapi domain lama |

---

**Pipeline stats dari 3 lead ini (manual):**

| Metric | Hasil |
|---|---|
| Perusahaan dari S1 | 3 |
| Punya website + email | 3/3 |
| DM teridentifikasi | 3/3 |
| Email DM langsung | 1/3 (Solas) |
| Email office/admin | 2/3 (Hivolts, A&S) |
| Waktu enrichment manual | ~10 menit/perusahaan |
| Step yang dipakai | A (Jina) + C (direktori), lihat C0 |
| Step B (Google CSE) | Dihapus (Q16) |
| SerpAPI / Hunter.io | Tidak dipakai |

Batas: 3 perusahaan, dikerjakan manual. Klaim "100+ lead/hari" dihapus; pipeline otomatis belum diuji. Count C5 adalah snapshot internal, bukan agregat baru; keyword totals Hivolts/A&S perlu rekonsiliasi karena melebihi total signal yang dicatat.

#### C5 — Field-level evidence for prospect design, checked 7 Nov 2026

| Lead | Evidence URLs | Confirmed / qualification |
|---|---|---|
| Solas | [DOB X01485985-I1-EL](https://data.cityofnewyork.us/resource/dm9a-ab7w.json?job_filing_number=X01485985-I1-EL), [website](https://www.solasnyc.com/), [About](https://www.solasnyc.com/about-5) | DOB: firm/date/shed-lighting scope excludes power feed and maintenance. Website: 1611 East 233rd Street, Bronx NY 10466; 718-924-7839; displayed office@solasnyc.com. About: established by Conor Downey in 2021; Founder supported, formal Owner title not verified. Displayed email's mailto target differs, so do not copy that target. |
| Solas personal email / social | Hunter Domain Search; [official-linked Facebook](https://www.facebook.com/profile.php?id=100063868372037&mibextid=LQQJ4d) | conor@ remains Hunter-provided, not found on cited company pages. Facebook is linked by company site. No verified LinkedIn found. |
| Hivolts | [DOB B01483138-I1-EL](https://data.cityofnewyork.us/resource/dm9a-ab7w.json?job_filing_number=B01483138-I1-EL), [website](https://hivoltselectrical.com/) | DOB: Nov 1 temporary power/generator-hoist work, permit issued/job in process; Isaac Fuchs applicant/electrician, not proof of ownership/current license validity. Website: 21 Herkimer Pl, Brooklyn NY 11216; 718-855-4346; exact published email jobs@hivoltelectrical.com (missing s compared with website domain). Do not silently correct spelling. |
| Hivolts people | [company LinkedIn](https://www.linkedin.com/company/hivolts-electrical-inc.), [Moishy Rosman](https://www.linkedin.com/in/moishy-rosman-819386380), [Yosef Oberlander](https://www.linkedin.com/in/yosef-oberlander-61b627339), [Hunter-cited search](https://www.google.com/search?q=site:linkedin.com%20moishy%20rosman%20hivoltselectrical) | Company page identity matches domain/address. Personal profiles block direct reading; names/association supported by search index/company employee links. Moishy Operations Manager and both personal emails documented in C5/Hunter, not company-website email proof. No verified Isaac LinkedIn profile. |
| A&S | [DOB X01485626-I1-EL](https://data.cityofnewyork.us/resource/dm9a-ab7w.json?job_filing_number=X01485626-I1-EL), [contact page](https://www.aselectricnyc.com/contact.html), [NYBizDB](https://www.nybizdb.com/company/a-s-electric-inc-1384619/), [BBB](https://www.bbb.org/us/ny/new-york/profile/electrician/a-s-electric-inc-0121-89607) | DOB: Nov 5 generator maintenance, filing Complete/job complete; not an active buying event. Contact page: 952 Flushing Ave Ste 3 Brooklyn NY 11206, 718-821-1211, fax 718-821-1255. NYBizDB: directory-published AOL email and CEO Francis A Richards, not deliverability proof; BBB corroborates President but lists older contact details. Use first-party current address. |
| A&S LinkedIn/social | No matched profile verified | Nashville A&S LinkedIn profiles are another company; website social buttons are share/login links, not verified company profiles. Render unavailable icons rather than inventing links. |

These checks support design provenance only; they do not implement contact enrichment, reaggregate C5 counts, or establish procurement intent. Sources tables in FigCraft preserve these distinctions.

### C6 · Approved 13-row contact seed for frame 7–9 revisions

Snapshot of `scripts/seed-hunter-contacts.ts`, read 7 Nov 2026. These are the allowed contact examples for the design, not 13 newly verified people. Generic company contacts remain generic; a null title is not filled in. Provider/directory provenance stays visible and is not a deliverability or ownership claim. Historical C5 names outside this seed must not become recipients in these frames.

| Company ID / company | Seed contact | Seed title | Email | Seed source URL |
|---|---|---|---|---|
| 69720 · ISLAND ELECTRIC CORP | Andrew | — | andrew@islandelectric.info | [Company service page](https://islandelectric.info/services-commercial-services.php) |
| 378 · SL GREEN REALTY CORP | Sonya Ruddy | Vice President, Retail Leasing | sonya.ruddy@slgreen.com | [Property page](https://slgreen.com/properties/485-lexington-avenue) |
| 880 · KALE CONSTRUCTION INC | Josh Winans | — | josh@kale-construction.com | [About page](https://kale-construction.com/about-us) |
| 69638 · SOLAS ELECTRICAL CORP | Conor Downey | Owner / Founder | office@solasnyc.com | [Company website](https://solasnyc.com) |
| 69825 · HIVOLTS ELECTRICAL INC | Hivolts Electrical | — | jobs@hivoltelectrical.com | [Company website](https://hivoltselectrical.com) |
| 69825 · HIVOLTS ELECTRICAL INC | Moishy Rosman | Operations Manager | moishy@hivoltselectrical.com | [Hunter-cited search](https://www.google.com/search?q=site:linkedin.com%20moishy%20rosman%20hivoltselectrical) |
| 69767 · A & S ELECTRIC INC. | A & S Electric Inc. | — | aselectricinc@aol.com | [NYBizDB](https://www.nybizdb.com/company/a-s-electric-inc-1384619/) |
| 49 · SUNRUN INSTALLATION SVC | Andy Blauvelt | Attorney Director | andy.blauvelt@sunrun.com | [CPUC filing](https://docs.cpuc.ca.gov/PublishedDocs/Efile/G000/M613/K172/613172045.PDF) |
| 255 · VORNADO REALTY TRUST | Eva Kim | General Manager | ekim@vno.com | [Directory](https://mallsandstores.info/california---ca/1288-the-beverly-connection.html) |
| 5 · MOMENTUM SOLAR | Peter Clark | Director | pclark@momentumsolar.com | [Princeton industry page](https://highwire.princeton.edu/tag/industry) |
| 182 · CORE SCAFFOLD SYSTEMS INC | Willy Pilku | Chief Executive Officer | willy@corescaffold.com | [Hunter-cited search](https://www.google.com/search?q=site:linkedin.com%20willy%20pilku%20corescaffold) |
| 420 · ACE GROUP NY CORP. | Rosie | — | rosie@acegroupny.com | [Company website](https://acegroupny.com) |
| 69635 · BERGER QUALITY ELEC'L CON | Fabian Maliza | — | fabian@bergerqualityelectric.com | [Hunter-cited search](https://www.google.com/search?q=site:linkedin.com%20fabian%20maliza%20bergerqualityelectric) |

WCK ELECTRIC CORP. is not in this seed. A read-only query of `contacts where company_id=69623` returned no rows. The revised WCK detail therefore has no named contact, phone, email, website or LinkedIn invented from another company. Its email panel requires a sourced contact before generation. Hivolts NameChanged uses Moishy ↔ the seeded Hivolts company contact; A&S uses the seeded company contact, not Francis Richards. Solas draft components use Conor with office@, not conor@. Seed titles are recorded verbatim here, not upgraded into independently verified titles.

#### WCK signal and scoring snapshot — 7 Nov 2026

- Company `69623`, NY: materialized `keyword_stars=5`, `freshness_stars=5`, `place_stars=5`, `target_fit_stars=1`, `score=16`, `tier=S`. Read-only DB result matches the user example and G8/G9; no score-refresh or seed mutation was run.
- Seller snapshot: region NY/NJ, target.companyTypes empty. Target fit is the G8 baseline1, not a guessed company classification. Buyer roles are not scored.
- 464 saved signals in DB; 5 keyword-matching signals within 90 days. Counts describe the saved snapshot, not a live API aggregate.
- Latest: [S01485307-I1-EL](https://data.cityofnewyork.us/resource/dm9a-ab7w.json?job_filing_number=S01485307-I1-EL), Nov 5, 2026, `GENERAL WIRING`, Permit Issued / Job in Process. Firm address: 1274 Prospect Avenue, Brooklyn, NY 11218. Project is in Staten Island; project location is not the firm's address. DOB applicant names are not used as outreach contacts.
- Keyword examples: [S01479552-I1-EL](https://data.cityofnewyork.us/resource/dm9a-ab7w.json?job_filing_number=S01479552-I1-EL), Oct 24, `200 Amps Service Upgrade/General Wiring Throughout Ground Floor Retail Space`; [Q01474380-I1-EL](https://data.cityofnewyork.us/resource/dm9a-ab7w.json?job_filing_number=Q01474380-I1-EL), Oct 14, `New Electrical service 400 Amps three phase 208 volt for  new 6 family building`.
- Hivolts (`69825`) and A&S (`69767`) materialized scores were also read as 5/5/5/1, total16/S. A&S's cited C5 permit remains Complete: a high aggregate match does not turn that completed filing into an active buying event.


---

### C4 · LinkedIn people (opsional; jalur akses belum disetujui)

Ini bagian dari kebutuhan fitur LinkedIn opsional di S8, bukan sumber tervalidasi. Jangan ekstrak daftar karyawan lewat extension kecuali LinkedIn mengizinkan metode akses tersebut. Jika akses diizinkan, uji akurasi nama/jabatan dan cakupan sebelum memberi nilai kualitas.

---

## Layer 3 — AI Enrichment

### A1 · LLM — Vultr Serverless Inference

Dipakai untuk semua transformasi yang butuh pemahaman bahasa:

| Task | Input | Output |
|---|---|---|
| Normalize company name | Nama raw dari permit/RSS | Nama canonical (strip Inc, LLC, Corp) |
| Extract reason to buy | Signal summary + product list seller | 1 kalimat alasan (misal: "New warehouse permit needs switchboards") |
| Assign signal type | Teks sinyal | `permit` / `hiring` / `contract` / `expansion` |
| Score tier | Jumlah sinyal + tipe + recency | `S` / `A` / `B` / `C` / `null` |
| Filter relevance | Nama perusahaan + industri + region | In scope / out of scope |
| Extract contacts | Markdown hasil crawl Jina | Nama + role + email (jika ada) |

**Aturan yang tidak boleh dilanggar LLM:**
- Jangan karang nama perusahaan, sinyal, tanggal, atau email
- Jangan buat URL sumber yang tidak ada
- Return `null` tier jika sinyal kurang dari 2 yang saling mendukung
- Selalu sebut sinyal mana yang mendorong reason-to-buy

---

## Prioritas integrasi

| Urutan | Sumber | Alasan |
|---|---|---|
| 1 | NYC DOB NOW building (S1) | API terbukti, demo NY/NJ |
| 2 | Austin issued permits (S12) | Live-tested. Nama perusahaan, commercial, electrical, URL record |
| 3 | Seattle electrical (S13) | Live-tested. Non-residential 88% punya nama. Building Seattle hanya ~7% |
| 4 | NYC DOB electrical (S14) | Live-tested. `firm_name` hampir lengkap. Geografi tetap NYC |
| 5 | Chicago permits (S2) | Live-tested. Contractor di slot kontak, sering nama orang |
| 6 | USAspending (S3) | Award federal, bukan permit lokal |
| 7 | Google News RSS (S5) | Discovery luas, noisy |
| 8 | Trade RSS (S6) | Lebih targeted, volume kecil |
| 9 | Indeed RSS (S7) | Hiring, nama perusahaan tidak stabil |
| 10 | SAM.gov (S4) | Butuh API key, belum diuji |
| 11 | SF contacts join (`3pee-9qhc`) | `firm_name` ada, tanggal harus di-join. Belum siap |
| 12 | Jina crawl (C1) | Enrichment kontak |
| 13 | SerpAPI snippets (C2) | Fallback kontak, kuota kecil |
| 14 | LinkedIn (S8/C4) | Opsional; jalur akses belum diizinkan |
| 15 | Hunter.io (C3) | Diuji 7 Nov. Tidak diintegrasikan. |
| 16 | OSHA / OpenCorporates (S9/S10) | Verifikasi, bukan discovery |
| 17 | Dallas 2026 / LA issued / Baltimore | Dicek. Jangan diutamakan |

---

## Aturan provenance (tidak boleh dilanggar)

- Setiap sinyal wajib menyimpan: `sourceName`, `sourceUrl`, `sourceRecordId`, `signalDate`
- `sourceUrl: null` hanya boleh jika sumber memang tidak punya URL
- Jangan buat URL palsu yang terlihat seperti sumber terverifikasi
- Jangan tampilkan perusahaan, kontak, atau sinyal tanpa sumber yang bisa dilacak
- Record dengan `signalDate: null` dibuang sebelum ditampilkan
- Label "Sample data" wajib tampil di topbar selama data belum dari sumber live

---

## Cakupan AS — hasil cek API 4 Nov 2026

Belum ada feed permit komersial nasional per perusahaan. Bukti lebih panjang: `docs/us-coverage-research.md`.

Yang terbukti punya nama perusahaan dan tanggal: NYC building (S1), NYC electrical (S14), Austin (S12), Seattle electrical (S13). Chicago punya nama di slot kontak, sering nama orang. SF permit `i98e-djp9` tidak punya nama; contacts `3pee-9qhc` punya `firm_name`, tetapi `signalDate` harus di-join ke `issued_date` — belum siap. Dallas punya kolom `contractor`, tetapi commercial electrical 2026 hanya 43/5.517 berisi nama. LA issued dan Baltimore ArcGIS 2015–2018 tidak punya nama perusahaan. Census BPS tetap agregat hunian.

RAE tidak diperlukan untuk sumber SODA yang sudah menjawab, dan tidak menambah field yang memang tidak ada. Boston (403), Denver (WAF), dan Philadelphia (403, tanpa dataset id) bukan target RAE. Host `internal-*.socrata.com` bukan target.

Kandidat pertama di luar NYC: **Austin S12**. Seattle electrical kedua. Keduanya kota, bukan nationwide.

---

## Evaluasi kontak yang akan dilakukan

Sebelum memutuskan sumber kontak utama, uji manual pendekatan ini dengan 5–10 perusahaan konstruksi nyata di NY/NJ:

| Metode | Yang diuji | Kriteria keputusan |
|---|---|---|
| Hunter.io (C3) | Domain Search pada 3 domain C5, 7 Nov | Tidak. Hanya 1 email terbukti di halaman sumber. Tidak jadi default. |
| Jina crawl /team (C1) | Crawl halaman team → ekstrak LLM | Belum diukur. |
| LinkedIn (C4) | Hanya metode yang diizinkan LinkedIn | Jangan uji employee list lewat extension sebelum ada izin. |
Hasil evaluasi dicatat di sini sebelum salah satu diintegrasikan sebagai default.
