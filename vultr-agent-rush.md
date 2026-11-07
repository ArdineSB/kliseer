# Vultr Agent Rush — catatan sumber

## Daftar isi

Judul di bawah sama dengan judul bagian. Tautan lompat ke bagian itu.

- [Diambil kapan, dari mana](#diambil)
- [Glosarium singkat](#glosarium)
- [Identitas acara (nama, host, tanggal online, tanggal on-site, format, tempat, tim, hadiah)](#identitas)
- [Jadwal (setiap langkah yang tertulis; tandai yang masih TBA)](#jadwal)
  - [A. Jendela acara di data halaman dan live dashboard](#jadwal-jendela)
  - [B. Widget “Event Schedule” di halaman acara](#jadwal-widget)
  - [C. Field timeline lain di payload, tidak tampil sebagai jadwal publik](#jadwal-payload)
  - [D. Vultr Community](#jadwal-community)
  - [E. Yang masih TBA atau tidak diisi](#jadwal-tba)
- [Dua jalur, lengkap, dipisah. Jangan dicampur.](#jalur)
  - [01 · Blast Radius Zero](#jalur-01)
  - [02 · Powering the Future of Work](#jalur-02)
- [Teknologi: wajib vs opsional, per jalur. GPU ya/tidak. Endpoint inference. Sandbox. API. Deploy helpers.](#teknologi)
  - [Wajib kedua jalur](#teknologi-wajib)
  - [Jalur 1](#teknologi-jalur-1)
  - [Jalur 2](#teknologi-jalur-2)
  - [Endpoint inference](#teknologi-inference)
  - [Sandbox — apa yang ditulis guide, bukan apa yang wajib dipakai](#teknologi-sandbox)
  - [API](#teknologi-api)
  - [Deploy helpers](#teknologi-deploy)
- [Kredit $200: syarat email, kapan kode diberikan, cara klaim, apa yang boleh dibayar, apa yang terjadi setelah acara](#kredit)
- [Cara ikut (enroll, Discord, tim 1–6)](#ikut)
- [Apa yang diserahkan (LabLab form + aturan khusus Vultr + Community yang opsional)](#serahan)
  - [Wajib untuk dinilai](#serahan-wajib)
  - [Default form LabLab, kalau acara tidak menimpanya](#serahan-default)
  - [Community, opsional](#serahan-community)
- [Kriteria juri, termasuk tabel skor 1–5 dari rule book kalau itu yang berlaku. Tulis kalau acara ini menimpa kriteria default.](#juri)
- [Aturan: orisinalitas, MIT, batas waktu, grace period, diskualifikasi, hak cipta/kepemilikan, payout hadiah, negara yang dilarang kalau ada](#aturan)
  - [Orisinalitas dan MIT](#aturan-mit)
  - [Batas waktu dan grace period](#aturan-batas)
  - [Diskualifikasi](#aturan-diskualifikasi)
  - [Hak cipta dan kepemilikan](#aturan-hak)
  - [Payout hadiah](#aturan-payout)
  - [Negara](#aturan-negara)
- [Sumber daya dan tautan (docs, video, Discord, Community)](#sumber)
- [Yang relevan untuk membangun (fakta saja, bukan ide produk): apa yang harus hidup di Vultr, apa yang harus kelihatan di video, apa yang tidak diminta jalur 2](#membangun)
  - [Yang harus hidup di Vultr](#membangun-vultr)
  - [Yang harus kelihatan di video](#membangun-video)
  - [Yang tidak diminta jalur 2](#membangun-bukan)
- [Belum tertulis](#belum)
- [Daftar URL yang benar-benar dibaca](#url)


<a id="diambil"></a>

## Diambil kapan, dari mana

Diambil Jumat, 30 Oktober 2026, sekitar 14:15 WIB (SEAST, UTC+7). Sumber utama: halaman acara lablab.ai (teks ter-render di browser + HTML), live dashboard, halaman Vultr Community (bagian yang terbuka di browser), rule book, guidelines, getting started, terms of use, submission guide, docs Vultr yang ditautkan acara, dan `GET https://api.vultrinference.com/v1/models`.

Yang gagal dibaca: halaman daftar Vultr dan halaman billing promo (Cloudflare “Just a moment…”). Tidak dibuat akun. Tidak ada kode gift yang disalin.

**Fakta** dan **Inferensi** dipisah. Kalau sebuah angka tidak ada di halaman yang dicek, ditulis “tidak tertulis”.

<a id="glosarium"></a>

## Glosarium singkat

- **Track / jalur:** salah satu dari dua tantangan di halaman acara. Live dashboard masih menulis “Tracks TBA”; itu konflik, lihat Jadwal.
- **Sandbox / kotak tertutup:** lingkungan eksekusi terpisah, supaya kerja agen tidak menyentuh host atau runtime aplikasi.
- **Agent / program langkah:** sistem yang merencanakan tugas, mengirim kerja, lalu mengembalikan hasil yang benar-benar dijalankan — bukan hanya mengobrol.
- **Demo:** aplikasi yang bisa dibuka juri lewat URL publik, plus video rekaman.
- **VM:** mesin virtual Vultr Cloud Compute. Acara memakai ini sebagai backend.
- **Serverless Inference:** layanan model Vultr. Endpoint yang ditulis acara: `https://api.vultrinference.com/v1`. Kompatibel dengan klien gaya OpenAI.
- **MIT:** lisensi open source yang disebut di syarat partisipasi dan di catatan hadiah halaman acara.

<a id="identitas"></a>

## Identitas acara (nama, host, tanggal online, tanggal on-site, format, tempat, tim, hadiah)

**Fakta.** Nama publik: “Vultr: Agent Rush Hackathon”. Tag di halaman: “LabLab × Vultr”. Tagline: “Build AI agents that do real work — safely sandboxed on Vultr.” Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon

Host platform: lablab.ai. Footer halaman dan terms memakai badan hukum **NativelyAI Inc.** (“© 2026 NativelyAI Inc.”). Vultr Community menulis “VULTR is a registered trademark of The Constant Company, LLC.” Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon dan https://community.vultr.com/e/vultr-agent-rush-hackathon

Format: **Hybrid**. Online build: 3–8 November 2026. Fase on-site: 8 November 2026. JSON-LD di halaman yang sama: `startDate` `2026-11-03T15:00:00.000Z`, `endDate` `2026-11-08T22:00:00.000Z`, `eventAttendanceMode` Mixed. Lokasi skema hanya `VirtualLocation` ke URL acara — alamat fisik ada di teks halaman, bukan di objek lokasi skema. Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon

Tempat on-site, tertulis di halaman acara: **Pierpont Place, 163 W Pierpont Ave, Salt Lake City, UT 84101, USA**. Ada tautan “View on Google Maps”. Kalimat halaman: kalau disetujui untuk pengalaman on-site, peserta bisa menampilkan proyek secara live. **Travel and accommodation will not be covered.** Proses “approved” tidak dijelaskan. Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon

Tim: 1–6 orang. Payload halaman memuat `teamMembersLimit: 6`. Solo boleh, menurut getting started (acara ini tidak melarangnya). Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon dan https://lablab.ai/getting-started-guide

Hadiah, halaman acara:

- Sampai **$15,000**: “$14,000 in competition prizes + onsite raffle”.
- **$9,000** cash + **$5,000** kredit Vultr.
- 1st: $5,000 cash + $3,000 kredit Vultr.
- 2nd: $3,000 cash + $1,000 kredit Vultr.
- 3rd: $1,000 cash + $1,000 kredit Vultr.
- Raffle on-site: sampai $1,000. Tiga pemenang individu. Masing-masing satu hadiah: PlayStation 5 Standard, Apple AirPods 5 with Wireless Charging Case, atau Razer DeathAdder V3 HyperSpeed. Harus datang langsung (“Join us in person”).
- Setiap peserta: **$200** kredit Vultr (bukan hadiah juara).

Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon

**Fakta, sumber lain, bukan halaman acara.** Cuitan resmi @Vultr (judul pos terbaca) menulis: “$9,000 in cash. $5,000 in Vultr credits. KubeCon invitations for winners.” plus breakdown 1st/2nd/3rd yang sama, dan “Build at Agent Rush, Nov. 3–8”. Undangan KubeCon **tidak ada** di bagian hadiah halaman acara. Jumlah undangan, kota, dan tahun KubeCon tidak tertulis di cuitan yang terbaca. Sumber: https://x.com/Vultr/status/2115516960867770475

Halaman Community mengulang $9,000 cash + $5,000 kredit, breakdown juara, $200 per peserta, dan “Prize distribution may take up to 90 days.” Community tidak menyebut raffle PS5/AirPods/Razer dan tidak menyebut KubeCon. Sumber: https://community.vultr.com/e/vultr-agent-rush-hackathon

Catatan kaki hadiah di halaman acara: partisipasi sukarela; hadiah bergantung pada kelayakan, ketersediaan, dan sponsor pihak ketiga; aturan, hadiah, dan syarat bisa diubah atau dibatalkan; submission harus original dan MIT-compliant; distribusi hadiah bisa sampai 90 hari. Tautan “Full details” mengarah ke https://lablab.ai/terms-of-use#16-participation-terms

**Bukan aturan.** Live dashboard, saat diambil, menulis 1.406 registered builders (+68 dalam 24 jam) dan 305 tim. Angka itu bergerak. Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon/live

<a id="jadwal"></a>

## Jadwal (setiap langkah yang tertulis; tandai yang masih TBA)

Ada **tiga jam** yang tidak sama. Jangan dipaksa jadi satu.

<a id="jadwal-jendela"></a>

### A. Jendela acara di data halaman dan live dashboard

**Fakta.**

- `startAt` / `startDate`: 3 November 2026, **15:00 UTC** = 22:00 WIB.
- `endAt` / `endDate`: 8 November 2026, **22:00 UTC** = 9 November 2026, 05:00 WIB.
- Tautan “Add to Google Calendar” di halaman memakai `20261103T150000Z/20261108T220000Z`.
- Live dashboard: “Registration open / starts Nov 3, 2026, 15:00 UTC”. “Registration closes the moment the event starts.”
- Live, Key milestones: Tue, Nov 3, **15:00 UTC** — “Kickoff · Registration closes” — All participants. Sun, Nov 8, **22:00 UTC** — “Submissions close” — “Judging begins”.
- Teks live: “You have until Nov 8, 2026, 22:00 UTC to submit.”

Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon dan https://lablab.ai/ai-hackathons/vultr-hackathon/live

<a id="jadwal-widget"></a>

### B. Widget “Event Schedule” di halaman acara

**Fakta.** HTML yang diunduh sudah menyimpan stempel waktu yang dilokalkan (meta: `transformed.timelineEvents.*.timestamp` = `localized`), dan zona-nya tidak seragam (GMT+0100 dan GMT+0400). Jam di bawah dihitung dari offset yang tertulis di string itu, bukan dari tebakan.

| Nama di widget | String di HTML | UTC dari offset itu | WIB (UTC+7) | Catatan widget |
| --- | --- | --- | --- | --- |
| Hackathon Kick-off | Tue Nov 03 2026 17:00:00 GMT+0100 | 3 Nov 2026, 16:00 UTC | 3 Nov, 23:00 | — |
| Discord Q&A session | Tue Nov 03 2026 18:00:00 GMT+0100 | 3 Nov 2026, 17:00 UTC | 4 Nov, 00:00 | — |
| Doors open | Sun Nov 08 2026 20:00:00 GMT+0400 | 8 Nov 2026, 16:00 UTC | 8 Nov, 23:00 | On-site |
| Welcoming remarks | Sun Nov 08 2026 20:30:00 GMT+0400 | 8 Nov 2026, 16:30 UTC | 8 Nov, 23:30 | On-site |
| End of Submissions! | Mon Nov 09 2026 03:00:00 GMT+0400 | 8 Nov 2026, 23:00 UTC | 9 Nov, 06:00 | — |
| Door close | Mon Nov 09 2026 05:00:00 GMT+0400 | 9 Nov 2026, 01:00 UTC | 9 Nov, 08:00 | On-site |

Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon

**Konflik, bukan diselesaikan di catatan ini.** Kick-off widget = 16:00 UTC. Live dan `startDate` = 15:00 UTC. “End of Submissions!” widget = 23:00 UTC tanggal 8. Live dan `endDate` = 22:00 UTC tanggal 8. Selisih satu jam di kedua ujung. Halaman tidak menjelaskan mana yang menang.

<a id="jadwal-payload"></a>

### C. Field timeline lain di payload, tidak tampil sebagai jadwal publik

**Fakta.** Di objek acara ada `timelineEvents` terpisah dari widget Builder:

- “Start”, `2026-11-09T15:00:00.000Z` (9 Nov 2026, 22:00 WIB), `showTime: true`, `autoCheck: true`, `description: null`.
- “End”, `2026-11-12T15:00:00.000Z` (12 Nov 2026, 22:00 WIB), sama.

Nama hanya “Start” dan “End”. Tidak tertulis bahwa ini masa juri. Widget publik tidak menampilkan dua baris ini. Sumber: HTML https://lablab.ai/ai-hackathons/vultr-hackathon

<a id="jadwal-community"></a>

### D. Vultr Community

**Fakta.** Kartu acara: Tue, Nov 3, 2026. Format Hybrid. Type Hackathon. Available Seats: Open. Waktu kartu, saat browser di GMT+7: **11:00 PM – 10:00 AM GMT+7**. Header hari agenda: Tuesday, November 3; Wednesday, November 4; Monday, November 9. Label “Times in GMT+7”.

Item yang terlihat setelah tab agenda dibuka, **tanpa label hari di tiap baris**:

- 11:00 PM – 12:00 AM — Hackathon Kick-off
- 12:00 – 1:00 AM — Doors open
- 1:00 – 6:00 AM — Welcoming remarks
- 6:00 – 9:00 AM — End of Submissions!
- 9:00 – 10:00 AM — Door close

Discord Q&A **tidak** ada di daftar Community yang terbuka. Hari untuk tiap baris selain kick-off **tidak tertulis** di DOM yang terbuka. Jangan disamakan dengan widget lablab.ai hanya karena namanya mirip. Sumber: https://community.vultr.com/e/vultr-agent-rush-hackathon

<a id="jadwal-tba"></a>

### E. Yang masih TBA atau tidak diisi

**Fakta.**

- Live dashboard, bagian Tracks: **“TBA / Announced soon”**. Ini bentrok dengan halaman acara, yang sudah menuliskan dua jalur. Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon/live
- Live dashboard, Tech partners: 0, “SDKs & credits included”.
- `videoLink` di objek acara: `null`. URL stream kick-off tidak tertulis di field itu. Tautan kalender mengarah ke Twitch `https://twitch.tv/lablabai`. Getting started hanya bilang kick-off biasanya disiarkan live; cek halaman acara. Sumber: https://lablab.ai/getting-started-guide
- Jam pengumuman pemenang, sesi mentor, dan cara undian raffle: tidak tertulis di halaman yang dibaca.
- Payload: `toBeAnnounced: false`, `participantsLimit: null`, `shouldAutoApproveParticipants: false`. Teks publik tidak menjelaskan apa arti field terakhir untuk orang yang menekan Enroll.

<a id="jalur"></a>

## Dua jalur, lengkap, dipisah. Jangan dicampur.

Halaman acara: pilih **satu** path, bangun aplikasi web bergaya produksi di Vultr. Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon

Paragraf pembuka halaman (sebelum dua kartu) berbicara soal agen yang menulis/menjalankan kode atau memakai browser, di dalam sandbox. Itu bahasa jalur 1. Jangan dipakaikan ke jalur 2. Community hanya menguraikan jalur 1 dan menyebutnya “Main challenge”. Jalur 2 **tidak ada** di teks Community yang dibaca. Sumber: https://community.vultr.com/e/vultr-agent-rush-hackathon

<a id="jalur-01"></a>

### 01 · Blast Radius Zero

**Fakta, halaman acara.** “Build a web-based agent that performs real work — writing and running code or operating a real browser — while every action stays inside an isolated sandbox running on Vultr.”

Cocok untuk: code execution, browser automation, autonomous agents, sandboxing, verification and safety.

Label teknologi di kartu: Vultr VM backend, Web app on Vultr, Serverless Inference, Isolated sandbox.

Ide inti: containment-first. Sistem merencanakan, mengirim, dan memverifikasi kerja yang benar-benar dijalankan — bukan hanya menggambarkan.

Yang dicari Vultr: aplikasi memakai Vultr sebagai **central control layer**, mengirim kerja nyata ke lingkungan eksekusi terisolasi, dan mengembalikan output yang bisa diverifikasi.

Boleh salah satu pola, atau keduanya.

**Pola A · Sandboxed code execution.** User asks → model writes code → code runs inside a container → real output returns → model explains the result. Errors can be fed back for retries.

**Pola B · Sandboxed browser use.** User gives a goal → model plans → Playwright runs in a container → screenshots return → a vision model verifies → human approval before final actions.

Nama contoh di halaman acara (tanpa uraian): CSV Analyst, Prove-It Code Reviewer, Chart Anything, File Fixer, Self-Healing Runner, Comparison Shopper, Form Filler, Site QA Sweep, Research with Receipts, Page Watcher.

**Fakta, uraian contoh hanya di Community** (halaman acara tidak menguraikan kalimat ini):

Pola A:

- CSV Analyst: upload a spreadsheet, ask questions in plain English, get an executed chart plus the code.
- Prove-It Code Reviewer: run a snippet or PR and its tests in the sandbox, then report what happened.
- Chart Anything: natural language in, executed matplotlib or plotly image out.
- File Fixer: messy CSV or JSON in, cleaned file out, with an executed before/after diff.
- Self-Healing Runner: run code, read errors, patch and retry, with the retry loop visible on screen.

Pola B:

- Comparison Shopper: two or three product URLs in, screenshot-backed comparison table out.
- Form Filler: structured data in, a multi-step web form filled, with a screenshot trail and an approve-before-submit gate.
- Site QA Sweep: find broken flows and links in a web app, with screenshots and repro steps.
- Research with Receipts: a brief where every claim links to a screenshot of its source.
- Page Watcher: monitor listing or pricing pages, extract structured data, and diff against the previous day.

Sumber uraian: https://community.vultr.com/e/vultr-agent-rush-hackathon

**Containment, halaman acara** (Community mengulang empat poin yang sama):

- Process isolation: execution never touches the host or app runtime.
- Secret hygiene: no API keys or credentials inside the sandbox.
- Resource limits: time and memory caps on every run.
- Lifecycle discipline: reset or destroy the environment after each task.

**Yang diserahkan, halaman acara:**

- GitHub repository with setup and documentation
- Vultr VM backend deployment
- Public demo URL
- Recorded demo video
- Clear architecture and use-case explanation
- One containment moment shown in the video

**Fakta tambahan, hanya Community.** Deliverables di sana lebih sempit ke jalur ini: backend di Vultr VM, panggilan LLM lewat Vultr Serverless Inference, demo publik “real product-style experience, not just a local demo”, dan video yang memuat satu containment moment, **“such as the sandbox absorbing an rm -rf, an infinite loop, or a hostile web page”**. Itu contoh di Community, bukan daftar tertutup di halaman lablab.ai. Sumber: https://community.vultr.com/e/vultr-agent-rush-hackathon

Kalimat teknologi di bawah tantangan, halaman acara: “Challenge 1 requires Vultr Serverless Inference and isolated sandbox execution.” GPU Vultr tidak tersedia untuk acara ini.

Cuitan resmi @lablabai (16 Oktober 2026) mengulang bahasa yang sama: agen menulis dan menjalankan kode atau mengemudikan browser live, setiap aksi di sandbox di Vultr, dan “the one thing every submission has to show on video”. Cuitan itu tidak menambah syarat di luar halaman. Balasan akun lain yang menyebut `rm -rf` adalah pihak ketiga; contoh `rm -rf` yang resmi ada di halaman Community, bukan di balasan itu. Sumber utas: https://x.com/lablabai/status/2111012321258619384

<a id="jalur-02"></a>

### 02 · Powering the Future of Work

**Fakta, halaman acara.** Judul kartu: “Powering the Future of Work”. Di playbook, judulnya “02 · Future of Work”.

“Build and deploy an enterprise-focused AI solution that coordinates realistic multi-step workflows and improves how teams operate day to day.”

Cocok untuk: sales ops, finance, HR, customer support, procurement, workflow automation and enterprise AI.

Label di kartu: Vultr VM backend, Web app on Vultr. **Tidak** ada label Serverless Inference atau Isolated sandbox.

Ide inti: platform atau alur kerja operasional yang nyata, bukan demo sekali jadi. Serverless Inference opsional untuk alur agentic atau reasoning.

Yang dicari Vultr: solusi berfokus enterprise, dengan alur multi-langkah yang agentic **atau rule-based**, use case future-of-work yang realistis, dan aplikasi web bergaya produksi yang berjalan di Vultr.

Fokus (semua tertulis sebagai area, bukan sebagai wajib dipilih semuanya):

- Sales Operations: qualify leads, research prospects, update CRM, draft outreach and follow up.
- Finance & Accounting: process invoices, reconcile transactions, flag anomalies and manage payment follow-ups.
- HR & Recruitment: screen candidates, schedule interviews, coordinate onboarding and track employee workflows.
- Customer Support: resolve tickets across systems, investigate issues, take actions and escalate when human input is needed.
- Procurement: monitor purchasing needs, compare vendors, request quotes, track orders and follow up on delays.

Ekspektasi produk:

- Accessible through a public web browser.
- A real product-style experience with clear user flows.
- Vultr as the central backend powering planning, workflows and operations.
- Platform thinking rather than a one-off local demo.

Yang diserahkan:

- GitHub repository with setup and documentation
- Vultr VM backend deployment
- Public demo URL
- Recorded demo video
- Clear architecture and use-case explanation

**Tidak ada** baris “one containment moment” di daftar jalur 2.

Kalimat teknologi: “Challenge 2 requires a Vultr VM backend and web deployment; Serverless Inference is optional, and Vultr GPUs are not available for this event.”

Sumber seluruh bagian ini: https://lablab.ai/ai-hackathons/vultr-hackathon

<a id="teknologi"></a>

## Teknologi: wajib vs opsional, per jalur. GPU ya/tidak. Endpoint inference. Sandbox. API. Deploy helpers.

**Fakta.** GPU: “Vultr GPUs are not available for this event.” Berlaku untuk acara, bukan hanya satu jalur. Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon

<a id="teknologi-wajib"></a>

### Wajib kedua jalur

- Vultr Cloud Compute: backend VM. Aplikasi web harus di-deploy di Vultr.
- Vultr adalah sistem pusat kontrol dan orkestrasi, “not just static hosting.”

<a id="teknologi-jalur-1"></a>

### Jalur 1

Wajib:

- Vultr Serverless Inference untuk panggilan LLM agen.
- Eksekusi terisolasi / sandbox di Vultr.

Sangat dianjurkan, bukan satu-satunya cara yang disebutkan: Docker.

Contoh pendekatan yang **disebut**, bukan wajib dipilih: OpenSandbox, gVisor, E2B Sandboxes, Microsandbox.

Opsional: Vultr API untuk throwaway instances. Community: “spin up and destroy a throwaway instance per task.” Community juga menulis batas sandbox sebagai “containers or throwaway instances on Vultr, never inside the app process.”

Perbedaan daftar contoh: Community menyebut Docker, OpenSandbox, gVisor, E2B. Microsandbox ada di halaman lablab.ai, tidak ada di kalimat stack Community yang dibaca.

<a id="teknologi-jalur-2"></a>

### Jalur 2

Wajib: VM Vultr sebagai backend, dan web app di-deploy di Vultr.

Opsional: Serverless Inference, untuk alur agentic atau reasoning.

Helper yang disebut untuk tim jalur 2: Supabase on Vultr dan Coolify on Vultr. Label bagian ini di halaman: “Optional / recommended”.

Sandbox terisolasi, Playwright, containment moment, dan Vultr API untuk instance sekali pakai: **tidak** ditulis sebagai syarat jalur 2.

<a id="teknologi-inference"></a>

### Endpoint inference

**Fakta.** Base URL yang ditulis acara: `https://api.vultrinference.com/v1`. “OpenAI-compatible”. Wajib untuk panggilan LLM agen di jalur 1; opsional di jalur 2. Community menambah: “vision-capable models available.” Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon dan https://community.vultr.com/e/vultr-agent-rush-hackathon

Provisioning, tiga langkah di docs: Products → Serverless → Inference → Add Serverless Inference → isi Label, akui daftar model dan catatan biaya, lalu Add. Docs juga bilang bisa lewat Console, API, atau CLI, tetapi halaman itu tidak menuliskan perintah API/CLI-nya. Sumber: https://docs.vultr.com/products/serverless/inference/provisioning

FAQ inference yang ditautkan dari docs itu hampir kosong di teks yang terambil: katalog model berubah, daftar terkini ada di Console, tab Prompt. Tidak ada daftar id di FAQ itu. Sumber: https://docs.vultr.com/products/compute/serverless-inference/faq

**Fakta, cuplikan 30 Oktober 2026.** `GET https://api.vultrinference.com/v1/models` mengembalikan 34 objek. Id di bawah adalah isi endpoint saat diambil, bukan daftar yang “diwajibkan acara”. Acara hanya menautkan “Live model list”.

| id                                     | nama di payload              | keluaran      |
| -------------------------------------- | ---------------------------- | ------------- |
| ace-step-1.5                           | ACE-Step 1.5                 | audio         |
| auk                                    | AuK (evaluation)             | speech        |
| auk-flash                              | AuK-Flash (evaluation)       | speech        |
| bge-reranker-v2-m3                     | BGE M3                       | rerank        |
| chatterbox                             | Chatterbox                   | speech        |
| clef                                   | Clef                         | decisions     |
| clef-flash                             | Clef Flash                   | decisions     |
| d3                                     | d3                           | decisions     |
| deepseek-v4.1-flash-1017               | DeepSeek V4.1 Flash 1017     | text          |
| glm-5.2                                | GLM 5.2                      | text          |
| glm-5.3                                | GLM 5.3                      | text          |
| glm-5.3-flash                          | GLM 5.3 Flash                | text          |
| mimo-v2.6-flash                        | MiMo V2.6 Flash              | text          |
| mimo-v2.6-pro                          | MiMo V2.6 Pro                | text          |
| minimax-h3                             | MiniMax H3                   | video, image  |
| minimax-m3.1-flash                     | MiniMax M3.1 Flash           | text          |
| minimax-music3                         | MiniMax Music 3              | audio         |
| moss-image                             | MOSS-Image                   | image         |
| muse-glimmer-30b                       | Muse Glimmer 30B             | text          |
| nemotron-3-nano-omni-30b-a3b-reasoning | Nemotron 3 Nano Omni         | text          |
| nemotron-3.5-content-safety            | Nemotron 3.5 Content Safety  | text          |
| pplx-decider-v1.2                      | pplx-decider v1.2            | decisions     |
| qwen-image-2.1                         | Qwen-Image 2.1 (evaluation)  | image         |
| qwen3-asr-1.7b                         | Qwen3-ASR 1.7B               | transcription |
| qwen3-embedding-4b                     | Qwen 3 Embedding 4B          | embeddings    |
| qwen3-tts-12hz-1.7b                    | Qwen 3 TTS 12Hz 1.7B         | speech        |
| qwen3.8-27b                            | Qwen 3.8 27B                 | text          |
| qwen3.8-flash-next                     | Qwen 3.8 Flash Next          | text          |
| raon-1-mini-preview                    | Raon-1 mini (preview)        | text          |
| voxtral-mini-4b-realtime               | Voxtral Mini 4B Realtime     | transcription |
| vultron-retriever-core-qwen3.5-4.5b    | Vultron Retriever Core 4.5B  | rerank        |
| vultron-retriever-flash-qwen3.5-0.8b   | Vultron Retriever Flash 0.8B | rerank        |
| whisper-large-v3-turbo                 | Whisper Large V3 Turbo       | transcription |
| z-image-turbo                          | Z-Image Turbo                | image         |

Yang input-nya memuat `image` dan output-nya `text` pada cuplikan itu (relevan untuk kalimat “vision model” di pola B, **bukan** daftar resmi juri): deepseek-v4.1-flash-1017, glm-5.2, glm-5.3, glm-5.3-flash, mimo-v2.6-flash, mimo-v2.6-pro, minimax-m3.1-flash, muse-glimmer-30b, nemotron-3-nano-omni-30b-a3b-reasoning, nemotron-3.5-content-safety, qwen3.8-27b, qwen3.8-flash-next, raon-1-mini-preview. clef, clef-flash, d3, dan pplx-decider-v1.2 menerima image tetapi keluarannya `decisions`, bukan text.

<a id="teknologi-sandbox"></a>

### Sandbox — apa yang ditulis guide, bukan apa yang wajib dipakai

**Fakta.** Acara menautkan https://docs.vultr.com/how-to-set-up-agent-sandboxing-on-vultr-cloud-compute. Guide itu khusus **Microsandbox** di Vultr VX1 Cloud Compute: microVM lewat `libkrun` di atas KVM, kernel terpisah dari host, bukan isolasi kernel bersama seperti container. Butuh flag virtualisasi dan `/dev/kvm`. CLI `msb` bisa membatasi CPU dan memori. Panduan itu menunjukkan isolasi jaringan antar sandbox, SDK Python, dan MCP. Contoh konfigurasinya memakai Vultr Serverless Inference sebagai provider OpenCode, `baseURL` `https://api.vultrinference.com/v1`.

**Inferensi.** Guide ini contoh salah satu pendekatan yang disebut halaman acara. Halaman acara tidak menulis “harus Microsandbox” atau “harus VX1”.

Tautan contoh lain di HTML halaman acara: https://github.com/opensandbox-group/OpenSandbox , https://gvisor.dev/ , https://github.com/e2b-dev/e2b . Microsandbox disebut namanya; di daftar `href` HTML yang diambil, namanya tidak punya URL sendiri. Repo OpenSandbox, pada cuplikan halaman GitHub, berlisensi Apache-2.0. Itu lisensi proyek contoh, bukan syarat lisensi submission.

<a id="teknologi-api"></a>

### API

**Fakta.** Acara menautkan https://www.vultr.com/api/ dan menulis: jalur 1 **may** use the Vultr API for throwaway instances. Bukan wajib.

Yang terbaca dari pengantar API v2: HTTP REST, JSON, auth, dan DELETE untuk menghancurkan resource. Rate limit: lebih dari 30 request per detik dari IP yang sama bisa dapat HTTP 429 dan header `Retry-After`. Sumber: https://www.vultr.com/api/

Skema operasi “create instance” / path pasti untuk membuat dan menghapus VM **tidak termuat** saat halaman itu dibuka (hash operasi tidak merender isi; unduhan OpenAPI 403/404). Jangan mengarang path.

Docs Coolify, bagian provisioning terprogram, menulis: API atau Terraform memakai `image_id` `coolify`; CLI memakai `vultr-cli instance create --image "coolify"`. Itu untuk image Marketplace Coolify, bukan instruksi throwaway-instance jalur 1. Sumber: https://docs.vultr.com/how-to-deploy-an-application-with-vultr-coolify-marketplace-app

<a id="teknologi-deploy"></a>

### Deploy helpers

**Fakta.** Ditautkan sebagai helper, label optional/recommended, disebut untuk tim jalur 2:

- Supabase di Vultr: Marketplace app, PostgreSQL, lalu contoh Next.js di VM yang sama, Nginx, domain, SSL. Sumber: https://docs.vultr.com/how-to-deploy-a-nextjs-application-with-vultr-supabase-marketplace-app
- Coolify di Vultr: Marketplace app, deploy dari repo Git, env, health check, domain, SSL. Sumber: https://docs.vultr.com/how-to-deploy-an-application-with-vultr-coolify-marketplace-app

Keduanya tidak ditulis sebagai wajib. Video di halaman acara adalah walkthrough kedua guide itu, pembicara Sanskriti Harmukh, Junior Developer Relations @ Vultr.

<a id="kredit"></a>

## Kredit $200: syarat email, kapan kode diberikan, cara klaim, apa yang boleh dibayar, apa yang terjadi setelah acara

**Fakta.** Semua dari https://lablab.ai/ai-hackathons/vultr-hackathon kecuali disebut lain.

- $200 kredit Vultr gratis per peserta, untuk membangun dan mencoba layanan Vultr selama hackathon.
- “Gift code available at kickoff.” Kode dibagikan saat kickoff. Nilai kode itu sendiri tidak tertulis di halaman (dan tidak dicari dengan membuat akun).
- Sebelum mulai: pakai email valid yang **belum pernah** terhubung ke akun Vultr.
- Buat akun di https://www.vultr.com/register/ : email aktif, password kuat, terima Terms of Service dan Privacy Policy, klik Create Free Account.
- Verifikasi email (“Verify Your E-mail”), lalu masuk Console.
- Saat kickoff, buka https://console.vultr.com/billing/?promo=HACKATHON . Cari Gift Code, masukkan kode acara, klik Apply Gift Code.
- Setelah berhasil, akun seharusnya menunjukkan **$200.00 in Remaining Credit**.
- Kredit dan akses akun tetap aktif sepanjang acara.
- Yang boleh dibayar, kalimat halaman: “Vultr Compute Instances, Managed Databases, Kubernetes clusters, and other Vultr services during the hackathon.”
- Setelah acara, supaya deployment tetap dipakai: tambah metode pembayaran di Billing.

**Tidak tertulis:** apakah sisa kredit hangus, kapan hangus, apakah bisa ditarik, dan apakah akun lama yang sudah pernah punya email yang sama bisa dikecualikan selain kalimat “not previously been associated”.

Video klaim, disematkan di halaman (bukan YouTube): `https://del1.vultrobjects.com/tech-talk/redeem-vultr-credits-for-hackathons.mp4`. Pembicara yang sama. Isi video tidak ditranskrip di catatan ini.

Halaman register dan billing promo, 30 Oktober 2026, tidak terbuka (Cloudflare). Langkah di atas berasal dari halaman acara, bukan dari form register yang berhasil dibaca.

<a id="ikut"></a>

## Cara ikut (enroll, Discord, tim 1–6)

**Fakta.** Hackathon berlangsung online di platform LabLab dan server Discord LabLab. Daftar di keduanya. Tombol di halaman: Enroll / Sign up, mengarah ke `https://lablab.ai/ai-hackathons/vultr-hackathon?enroll=true`. Baca juga Hackathon Guidelines, Getting Started Guide, dan LabLab Hackathon Rule Book. Semua boleh ikut, “regardless of previous AI or coding experience.” Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon

Discord yang wajib disebut halaman: https://discord.gg/lablabai

Urutan di guidelines (artikel umum, bukan salinan form acara ini): lengkapi profil lablab.ai, daftar hackathon, sambungkan Discord, buat atau gabung tim, submit. Tombol yang disebut artikel: “Enrol Now”. Sumber: https://lablab.ai/ai-articles/hackathon-guidelines

Getting started: semua alur tim dan submit ada di lablab.ai. Akun Discord harus tersambung ke profil dan harus sudah menjadi anggota server lablab.ai **sebelum** membuat atau bergabung tim. Kalau halaman acara lebih spesifik, halaman acara yang menang. Sumber: https://lablab.ai/getting-started-guide

Tim 1–6. Boleh solo. Cari tim di dashboard atau Discord. Artikel guidelines menyebut channel `#looking-for-team` dan badge “looking for members”. Itu panduan umum LabLab, bukan salinan channel khusus acara ini. Sumber: https://lablab.ai/ai-articles/hackathon-guidelines

Live: pendaftaran tutup saat acara mulai (15:00 UTC, 3 Nov). Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon/live

Community: “Register on lablab.ai and join the lablab.ai Discord - both are required.” Bagian “Your participation” di Community (“Save your spot”, “Enter the code shown in the room”) adalah UI acara Community, bukan pengganti enroll lablab.ai. Sumber: https://community.vultr.com/e/vultr-agent-rush-hackathon

**Fakta payload, arti tidak dijelaskan.** `shouldAutoApproveParticipants: false`. Teks publik tetap “Sign up” / “Registration open”. Apakah enroll perlu disetujui manual: tidak tertulis.

Usia: halaman acara tidak menulis batas umur. Terms umum lablab.ai, bagian 3.A: untuk memakai Services, harus 18 tahun atau lebih. Sumber: https://lablab.ai/terms-of-use#3-using-our-services

<a id="serahan"></a>

## Apa yang diserahkan (LabLab form + aturan khusus Vultr + Community yang opsional)

<a id="serahan-wajib"></a>

### Wajib untuk dinilai

**Fakta.** Submission resmi harus di LabLab. Tanpa itu, tidak masuk juri dan tidak masuk hadiah kompetisi. Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon

Field yang ditulis halaman acara:

- Basic: project title, short description, long description, technology & category tags.
- Cover image, video presentation, slide presentation.
- Public GitHub repository, demo application platform, application URL.

Dokumen khusus Vultr, di **README GitHub publik**, bukan laporan arsitektur terpisah (“no separate Vultr architecture report is needed”):

- Layanan dan infrastruktur Vultr yang dipakai.
- Arsitektur backend/deployment dan bagaimana Vultr menggerakkan solusi.
- Use case agen dan bagaimana ia menjalankan tugas nyata.
- Jalur 1: minimal satu containment moment di video demo, seperti di brief tantangan.

<a id="serahan-default"></a>

### Default form LabLab, kalau acara tidak menimpanya

Rule book: “Each event can change its form, so the form and the event page always take priority.” Sumber: https://lablab.ai/hackathon-rules

Submission guide mengulang prioritas yang sama, lalu menulis batas default. Sumber: https://lablab.ai/delivering-your-hackathon-solution

**Fakta default, belum dicek di form acara ini** (form tidak dibuka; membuka form berarti enroll):

- Title 5–50 karakter. Artikel guidelines menulis max 50, tanpa minimum 5.
- Short description 50–255. Artikel: max 255, tanpa minimum 50.
- Long description 600–2000 karakter. Artikel: minimum 100 kata, bukan 600–2000 karakter.
- Cover image opsional, crop 16:9. Rule book: opsional. Halaman acara hanya menyebut “Cover image”, tanpa kata opsional.
- Video: rule book, default wajib, MP4 atau MOV. Guide: MP4 atau MOV, sampai 300 MB, anjuran di bawah 5 menit (masalah, lalu slide, lalu proyek berjalan). Artikel guidelines: tautan video, di bawah 300 MB dan dalam 5 menit. Tiga dokumen tidak sama persis (file vs tautan).
- Slide: PDF. Rule book: wajib by default.
- GitHub publik. Kalau juri tidak bisa membuka, skor bisa turun.
- Demo platform: guide memberi contoh Streamlit, Replit, Vercel. Itu contoh guide umum, bukan daftar yang diizinkan Vultr. Halaman Vultr mewajibkan web app di Vultr.
- Hybrid: guide meminta Participation Mode, online atau onsite. Halaman acara tidak mengulang field ini.
- Yang boleh menekan submit: hanya team admin, plus sampai tiga rekan yang mereka pilih. Sumber: https://lablab.ai/getting-started-guide
- Boleh diedit sampai deadline. Sumber: https://lablab.ai/delivering-your-hackathon-solution

**Inferensi.** Karena form acara tidak dibuka, batas karakter dan “file vs tautan” di atas adalah default LabLab, bukan konfirmasi field Vultr Agent Rush.

<a id="serahan-community"></a>

### Community, opsional

Showcase di https://community.vultr.com/e/vultr-agent-rush-hackathon . Tidak menggantikan submission LabLab. “Exposure is not guaranteed.” Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon

<a id="juri"></a>

## Kriteria juri, termasuk tabel skor 1–5 dari rule book kalau itu yang berlaku. Tulis kalau acara ini menimpa kriteria default.

**Fakta.** Halaman acara menamai empat kriteria, tanpa angka, tanpa bobot, tanpa tabel 1–5:

- Application of Technology — “How effectively the chosen model(s) are integrated into the solution.”
- Presentation — “The clarity and effectiveness of the project presentation.”
- Business Value — “The impact and practical value, considering how well it fits into business areas.”
- Originality — “The uniqueness and creativity of the solution, highlighting approaches and ability to demonstrate behaviors.”

Community mengulang empat nama yang sama, dengan kalimat Originality yang lebih pendek (tanpa “approaches and ability to demonstrate behaviors”). Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon dan https://community.vultr.com/e/vultr-agent-rush-hackathon

Rule book: banyak acara menilai empat kriteria itu, masing-masing 1–5. Acara dan track boleh memasang kriteria, bobot, dan rentang skor sendiri; “the event page says which apply.” Sumber: https://lablab.ai/hackathon-rules

**Acara ini tidak menerbitkan tabel pengganti dan tidak menulis bahwa tabel default dibatalkan.** Ia juga tidak menulis “pakai tabel 1–5”. Yang tertulis: nama empat kriteria yang sama, dengan deskripsi pendek yang tidak menyalin sel tabel.

**Inferensi.** Tabel di bawah kemungkinan masih dipakai, karena halaman tidak menimpanya. Itu inferensi, bukan kalimat halaman.

Tabel dari https://lablab.ai/hackathon-rules :

Presentation (pdf and video):

| Skor | Tulisan rule book |
| --- | --- |
| 1 Poor | No description of problem or gaps to fill. |
| 2 Limited | The problem & solution are not effectively communicated and difficult to understand. Presentation video is less than 3 min. |
| 3 Adequate | Effectively communicates the problem, solution, and value proposition in less than 5 min. Absent market analysis and or marketing revenue. No future goals or plans. |
| 4 Strong | Effectively communicates the problem, solution, and value proposition in less than 5 min. Explain market analysis and marketing revenue. Explain future goals & plans. |
| 5 Excellent | Exceptional in every aspect. Well-crafted and flawlessly communicates problem, solution, and value proposition. Effectively shows project's strengths and uniqueness through competitive analysis. |

Business value:

| Skor | Tulisan rule book |
| --- | --- |
| 1 Limited | Little or no potential for practical or commercial viability. Not addressing a significant problem or market need. |
| 2 Some | Some potential for business value. Uncertain market feasibility, scalability, or revenue generation. Address a niche market with limited demand. |
| 3 Moderate | Shows reasonable business value. Addresses market need with potential to generate revenue. Require further development or validation. |
| 4 High | High business value, with clear market potential. Potential to attract a large customer base and generate significant revenue. Strong market feasibility and scalability. |
| 5 Exceptional | Stands out as having exceptional business value. Potential to disrupt the industry or create a new market. Presents a clear sustainable revenue generation and long-term business success. |

Application of technology:

| Skor        | Tulisan rule book                                                                                                                                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Poor      | Demo video is not available in video presentation. Demo link is not available. Github is not available.                                                                                                           |
| 2 Limited   | Demo video may be shown in presentation but not with full features of the idea. Framework is not clearly shown. Demo link is not available or working. Github code is not available or shown.                     |
| 3 Adequate  | Demo video is shown with all features tried. Demo link is available and working as expected, but there may be minor areas for improvement or optimization. Github code is not available or partly available.      |
| 4 Strong    | Demo video is shown with all features tried. Demo link is working & is well-executed, with features and functionalities working smoothly. Github code is available & well thought off.                            |
| 5 Excellent | Demonstrates exceptional application of AI technology through demo link, video & GitHub code. The technical implementation is flawless, and the project utilizes technology in a way that surpasses expectations. |

Originality:

| Skor                     | Tulisan rule book                                                                                                                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Not Original           | App is an exact copy of existing solutions without any novel approaches.                                                                                                                                  |
| 2 Limited                | Idea is common or lacks differentiation from existing solutions in the field.                                                                                                                             |
| 3 Moderately Original    | Exhibits some unique idea or approach that distinguishes it from existing non-AI solutions like decreasing cost or time.                                                                                  |
| 4 Highly Original        | Unique perspective or innovative idea employing unconventional methods to solve the problem. Novel elements, creative combinations, or unexpected applications.                                           |
| 5 Exceptionally Original | Stands out as exceptionally original, offering transformative idea or approach. Completely new perspective. Has potential to disrupt the industry or solve the problem in a completely unprecedented way. |

Orang di bagian “Speakers, Mentors & Judges”, dari API bagian halaman `https://lablab.ai/api/v4/vultr-hackathon/sections` saat diambil: 1 SPEAKER (Emmanuel Iriarte, CTO of NativelyAI) dan 26 JUDGE. Tidak ada role MENTOR di payload itu, meskipun judul bagiannya menyebut Mentors. Daftar juri (nama — title — role): Vasu Raj Jain — Senior Software Engineer @Amazon Ads; Victor Martins — Software Engineer & Founder; Shaktesh Pandey — AI Engineer | GenAI Systems | RAG Architect | LLMOps; Ansh Bilimoria — Senior Software Engineer, Meta; Udit Gupta — Principal Engineer - Cloud and Network Security, Palo Alto Networks; Urvi Bhanushali — Software Engineer; Harshit Gupta — Management Consultant, McKinsey & Company; Arjun Gopichander Ravichander — Software Engineer, Walmart Inc.; Niranjan Yadla — Senior Applied Scientist, Amazon; Anil Mandloi — Senior Software Engineer – American Express; Ali Amjad — Founder; Amit Gupta — Staff Software Engineer, Sagesure; Ashish Garg — Principal Product Manager, Walmart; Antoine Balliet — Context & AI Engineer; Mahati Kumar — Senior Staff Software Engineer, Technical Lead, at Meta; Bhargavi Vepuri — Director, Technology Lead at Prudential Financial; Mohamed Ally Iddi — Senior Software Engineer, Meta; Alejandro Soumah — Founder, Itô Markets; Anish Gupta — Product Manager at Microsoft; Haris Jalal — SWE AI; Shweta Chauhan — Software Development Engineer II, Amazon Robotics | IEEE Senior Member; Sachidananda Singh — Senior Engineering Manager, Hims & Hers Health; Suresh Kumar Gunasekaran — Senior Software Engineer; Subhasis Kundu — Senior Principal Solution Architect; Nalini Garg — Associate Vice President; Muhammad Inaamullah — lablab.ai. Semua itu `eventRole: JUDGE` kecuali Emmanuel Iriarte (`SPEAKER`). Apakah ada yang organizer: tidak tertulis, selain title “lablab.ai” dan “CTO of NativelyAI”.

<a id="aturan"></a>

## Aturan: orisinalitas, MIT, batas waktu, grace period, diskualifikasi, hak cipta/kepemilikan, payout hadiah, negara yang dilarang kalau ada

<a id="aturan-mit"></a>

### Orisinalitas dan MIT

**Fakta, kutipan.** Terms bagian 16: “All submissions by participants must be original work, open source, and compliant with the MIT License unless specified otherwise.” Sumber: https://lablab.ai/terms-of-use#16-participation-terms

Halaman acara: “Submissions must be original and MIT-compliant.” Tidak ada kalimat “unless specified otherwise” di halaman acara. Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon

Acara ini tidak menulis pengecualian lisensi. Jadi klausul “unless specified otherwise” tidak terisi oleh halaman ini.

<a id="aturan-batas"></a>

### Batas waktu dan grace period

**Fakta.** Tutup submit, versi live dan `endDate`: 8 November 2026, 22:00 UTC. Widget jadwal menulis “End of Submissions!” satu jam kemudian. Lihat bagian Jadwal. Jangan dipilih salah satu di catatan ini.

Rule book: “Submissions close at the deadline shown on the event page, after a short grace period of five minutes.” Perpanjangan hanya kalau organizer dihubungi sebelum deadline, dan hanya mereka yang bisa memperpanjang untuk satu tim. Halaman acara **tidak** mengulang grace period 5 menit, dan tidak membatalkannya. Sumber: https://lablab.ai/hackathon-rules

<a id="aturan-diskualifikasi"></a>

### Diskualifikasi

**Fakta, rule book.** Plagiarisme atau mengakali sistem voting: diskualifikasi langsung. Jika lablab.ai atau partner acara menilai peserta merusak keadilan — cheating, tampering with systems, unauthorized automation, fraudulent behaviour, atau alasan lain yang mereka anggap cukup — peserta boleh dikeluarkan. Gagal ikut pedoman submit bisa menurunkan skor atau mengeluarkan dari hackathon. Organizer boleh ikut tetapi tidak berhak hadiah. Mentor atau organizer yang ikut tidak boleh menjadi juri. Sumber: https://lablab.ai/hackathon-rules

Code of Conduct NativelyAI (tertaut footer, diperbarui 28 Juli 2023) adalah pedoman komunitas umum, bukan rule book hackathon ini. Ia menyebut sanksi, plagiarisme, dan “We honor international sanctions.” Sumber: https://lablab.ai/code-of-conduct

<a id="aturan-hak"></a>

### Hak cipta dan kepemilikan

**Fakta, kutipan, jangan digabung jadi nasihat hukum.**

Terms 4.D: “As between you and NativelyAI, you own Your Content.”

Terms 4.C: dengan mengirim Your Content, peserta “irrevocably grant us world-wide, perpetual, non-exclusive, royalty-free, assignable, sublicensable, transferable rights to use Your Content for any purpose.” “Use” di kalimat yang sama mencakup copy, publicly perform and display, reproduce, distribute, modify, translate, remove, analyze, commercialize, and prepare derivative works. Daftar itu “not intended to be exhaustive.”

Sumber kedua kutipan: https://lablab.ai/terms-of-use#4-content

**Inferensi.** Dua kalimat itu hidup bersama: kepemilikan tetap di peserta terhadap NativelyAI, plus lisensi sangat luas ke NativelyAI, plus kewajiban MIT/open source di bagian 16. Halaman acara tidak menjelaskan bagaimana MIT dan lisensi 4.C disusun bersama. Bukan opini hukum.

Feedback terpisah (ide yang dikirim ke mereka, bagian 8) juga diberi lisensi perpetual. Itu bukan otomatis sama dengan submission hackathon, kecuali submission masuk definisi Feedback. Sumber: https://lablab.ai/terms-of-use#8-suggestions-and-improvements

<a id="aturan-payout"></a>

### Payout hadiah

**Fakta.** Bagian 16: lablab.ai dan partner berhak mendistribusikan semua hadiah dalam 90 hari setelah pengumuman pemenang. lablab.ai tidak bertanggung jawab atas janji sponsor pihak ketiga. Hadiah, syarat, dan acara sendiri bisa diubah atau dibatalkan. Sumber: https://lablab.ai/terms-of-use#16-participation-terms

Bagian 17, Prize Money Payout Policy, kontak prize@lablab.ai. Sumber: https://lablab.ai/terms-of-use#17--prize-money-payout-policy

- Berlaku untuk uang hadiah kompetisi resmi. Hadiah diberikan **hanya kepada individu**, bukan tim atau badan hukum.
- Pemenang diberitahu lewat email dan mendapat tautan Prize Payout Form.
- Semua dokumen dalam **90 hari kalender** sejak email. Lewat itu: hangus otomatis.
- Pembayaran dalam USD. ACH untuk penerima AS, atau SWIFT untuk non-AS.
- Penerima AS boleh minta bank transfer, dengan biaya pemrosesan $15. Cek kedaluwarsa setelah 90 hari. (Kalimat di halaman: “U.S. recipients may request payment by bank transfer, subject to a $15 processing fee. Note: Checks expire after 90 days.”)
- Mereka tidak memotong service fee atau administrative fee. Jumlah bisa lebih kecil karena withholding pajak federal AS (W-9 atau W-8BEN) dan biaya bank transfer internasional.
- Angka yang diumumkan adalah nilai kotor.
- Mereka tidak bertanggung jawab atas keterlambatan atau gagal bayar karena data bank salah atau tidak lengkap.
- AS: Prize Payout Form + IRS Form W-9. Non-AS: Prize Payout Form + IRS Form W-8BEN + U.S. TIN jika mengklaim tax treaty. Form tidak lengkap atau tidak ditandatangani bisa menunda atau membatalkan pembayaran.
- Penerima AS: tidak ada withholding saat bayar. Kalau total hadiah dalam satu tahun kalender melebihi $600, dapat Form 1099-MISC. Tetap wajib lapor ke IRS berapa pun jumlahnya.
- Penerima non-AS: withholding standar **30%** pajak federal AS, kecuali ada tax treaty yang berlaku dan U.S. TIN di W-8BEN. Dilaporkan lewat Form 1042-S.
- Ambang IRS di teks mereka: total ≤ $600 dalam satu tahun kalender, mereka tidak wajib lapor ke IRS dan tidak terbitkan 1099-MISC, tetapi penerima tetap lapor. Di atas $600: 1099-MISC paling lambat 31 Januari tahun pajak berikutnya; mereka tidak withhold, penerima lapor sebagai Other Income di Line 8 Form 1040.
- Syarat akhir: Prize Payout Form, formulir pajak IRS yang sah dan ditandatangani (W-9 atau W-8BEN), government-issued photo ID, dan verifikasi rekening bank atas nama pemenang.
- Lewat 90 hari: hangus permanen. “No exceptions”: tidak ada submit terlambat, koreksi, banding, atau permintaan bayar setelah deadline.

Kredit Vultr ($5,000 pool juara dan $200 peserta) tidak dijelaskan di bagian 17. Bagian 17 berbicara “prize money”. Apakah kredit mengikuti form yang sama: tidak tertulis.

<a id="aturan-negara"></a>

### Negara

**Fakta.** Halaman acara tidak punya daftar negara terlarang.

Terms bagian 11, Representations and Warranties, kutipan utuh: “You represent and warrant that you are not organized under the laws of, operating from, or otherwise located or resident in a country or territory that is subject to US economic or trade sanctions (i.e. an embargo, including North Korea, Iran, Cuba, Russia, but not limited to as this list is not exhaustive); identified on a list of prohibited or restricted persons; or otherwise the target of US sanctions.” Sumber: https://lablab.ai/terms-of-use#11-your-representations-and-warranties

Itu syarat memakai Services lablab.ai, bukan lampiran khusus Agent Rush. Daftar negara di kalimat itu contoh, dan kalimat itu bilang tidak lengkap. Daftar orang terlarang tidak disalin di halaman.

<a id="sumber"></a>

## Sumber daya dan tautan (docs, video, Discord, Community)

**Fakta, ditautkan halaman acara.**

- Acara: https://lablab.ai/ai-hackathons/vultr-hackathon
- Live: https://lablab.ai/ai-hackathons/vultr-hackathon/live
- Enroll: https://lablab.ai/ai-hackathons/vultr-hackathon?enroll=true
- Community (opsional, bukan pengganti submit): https://community.vultr.com/e/vultr-agent-rush-hackathon
- Discord wajib: https://discord.gg/lablabai
- Discord NativelyAI, tercantum di blok sosial, tidak ditulis sebagai wajib: https://discord.gg/uP2TQVtkRj
- Twitch, dari tautan kalender: https://twitch.tv/lablabai
- X lablab.ai: https://x.com/lablabai
- Situs Vultr: https://www.vultr.com/
- Docs inference: https://docs.vultr.com/products/serverless/inference/provisioning
- Daftar model langsung: https://api.vultrinference.com/v1/models
- API: https://www.vultr.com/api/
- Sandbox guide: https://docs.vultr.com/how-to-set-up-agent-sandboxing-on-vultr-cloud-compute
- OpenSandbox: https://github.com/opensandbox-group/OpenSandbox
- gVisor: https://gvisor.dev/
- E2B: https://github.com/e2b-dev/e2b
- Supabase on Vultr: https://docs.vultr.com/how-to-deploy-a-nextjs-application-with-vultr-supabase-marketplace-app
- Coolify on Vultr: https://docs.vultr.com/how-to-deploy-an-application-with-vultr-coolify-marketplace-app
- Register: https://www.vultr.com/register/
- Promo billing: https://console.vultr.com/billing/?promo=HACKATHON
- Rule book: https://lablab.ai/hackathon-rules
- Guidelines: https://lablab.ai/ai-articles/hackathon-guidelines
- Getting started: https://lablab.ai/getting-started-guide
- Submit guide: https://lablab.ai/delivering-your-hackathon-solution
- Terms: https://lablab.ai/terms-of-use
- Help Center (tautan footer, tidak ada FAQ khusus acara yang ditemukan): https://lablab.ai/help-center

Video di halaman:

- Kredit: https://del1.vultrobjects.com/tech-talk/redeem-vultr-credits-for-hackathons.mp4
- Supabase: https://www.youtube.com/embed/icJzcsP59Ks — judul halaman YouTube: “Tech Talk: Accelerating Web App Deployment with Supabase on Vultr”, kanal Vultr. Sumber: https://www.youtube.com/watch?v=icJzcsP59Ks
- Coolify: https://www.youtube.com/embed/P0wZ2LYufGU — judul: “Tech Talk: Optimizing App Deployment and Server Management with Coolify on Vultr”, kanal Vultr. Sumber: https://www.youtube.com/watch?v=P0wZ2LYufGU

Kedua video YouTube itu lebih tua dari acara ini (halaman YouTube menulis posted 2025-10-17 dan 2025-10-31) dan di deskripsinya menawarkan promo $250 akun baru. Itu promo video, bukan kredit $200 hackathon. Jangan dicampur.

Cuitan pertama pihak yang dibaca: https://x.com/lablabai/status/2111012321258619384 dan https://x.com/Vultr/status/2115516960867770475

**Bukan acara ini.** “The Agent Arena Hackathon 2026” (San Francisco, September 2026, blog Vultr) adalah acara lain. Tidak dipakai sebagai aturan Agent Rush.

<a id="membangun"></a>

## Yang relevan untuk membangun (fakta saja, bukan ide produk): apa yang harus hidup di Vultr, apa yang harus kelihatan di video, apa yang tidak diminta jalur 2

<a id="membangun-vultr"></a>

### Yang harus hidup di Vultr

**Fakta.**

Kedua jalur: backend VM di Vultr, dan aplikasi web di-deploy di Vultr. Vultr harus menjadi pusat kontrol dan orkestrasi, bukan hosting statis semata. Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon

Jalur 1, tambahan: panggilan LLM agen lewat Serverless Inference di `https://api.vultrinference.com/v1`, dan eksekusi terisolasi yang berjalan di Vultr. Community: tidak di dalam proses aplikasi. Sumber: https://lablab.ai/ai-hackathons/vultr-hackathon dan https://community.vultr.com/e/vultr-agent-rush-hackathon

Jalur 2: Vultr sebagai backend pusat untuk planning, workflows, and operations. Inference tidak wajib.

GPU tidak tersedia, jadi tidak ada syarat “jalan di GPU Vultr”.

<a id="membangun-video"></a>

### Yang harus kelihatan di video

**Fakta.**

Keduanya, daftar submission halaman acara: recorded demo video, plus penjelasan arsitektur dan use case (bisa di README / presentasi; halaman tidak memaksa semua itu masuk video).

Jalur 1: minimal satu containment moment di video. Community memberi contoh isi momen itu: sandbox menahan `rm -rf`, infinite loop, atau halaman web yang bermusuhan. Halaman lablab.ai tidak mengunci contoh itu.

Default LabLab, kalau tidak ditimpa: video MP4 atau MOV, anjuran di bawah 5 menit; rule book menilai video di bawah 3 menit sebagai Presentation “Limited”. Halaman Vultr tidak mengulang batas menit.

Jalur 1, pola yang ditulis (bukan naskah video): kerja yang benar-benar dijalankan dan output yang kembali, bukan deskripsi. Pola B menyebut screenshot, vision model, dan human approval sebelum aksi final. Itu pola build, bukan checklist shot video, kecuali bagian containment.

<a id="membangun-bukan"></a>

### Yang tidak diminta jalur 2

**Fakta, karena tidak tertulis sebagai syarat jalur 2 di halaman acara.**

- Serverless Inference (opsional).
- Sandbox terisolasi, Docker, Playwright, atau containment moment di video.
- Vultr API untuk throwaway instance (kalimat itu ada di jalur 1, “may”).
- GPU.
- Laporan arsitektur Vultr terpisah (untuk kedua jalur: cukup README).
- Showcase Community.
- Uraian jalur 2 di halaman Community: tidak ada.

<a id="belum"></a>

## Belum tertulis

- Kode gift $200, dan jam persis kode itu dibacakan (hanya “at kickoff”).
- Nasib sisa kredit setelah acara, selain “tambah metode pembayaran kalau mau lanjut memakai deployment”.
- Apakah kredit juara ($3,000 / $1,000 / $1,000) mengikuti Prize Payout Form bagian 17.
- Mana yang menang: 15:00 UTC vs 16:00 UTC untuk kick-off, dan 22:00 UTC vs 23:00 UTC untuk tutup submit.
- Arti field “Start” 9 Nov 2026 15:00 UTC dan “End” 12 Nov 2026 15:00 UTC.
- Hari untuk tiap baris agenda Community selain yang terlihat tanpa label tanggal.
- URL stream kick-off (`videoLink` null).
- Proses “approved” on-site, kuota on-site, dan cara undian raffle.
- Apakah enroll perlu persetujuan manual (`shouldAutoApproveParticipants: false` tidak dijelaskan).
- Form submit acara ini: batas karakter, file vs tautan video, dan apakah Participation Mode muncul. Form tidak dibuka.
- Bobot juri dan apakah tabel 1–5 resmi dipakai (halaman tidak menimpanya dan tidak mengukuhkannya).
- Daftar mentor. Judul bagian menyebut Mentors; payload yang diambil tidak punya role MENTOR.
- Path API pasti untuk membuat dan menghapus throwaway instance. Pengantar API terbaca; skema operasi tidak.
- Isi halaman https://www.vultr.com/register/ dan https://console.vultr.com/billing/?promo=HACKATHON (Cloudflare).
- FAQ Discord, blog Vultr, atau halaman hadiah lain yang khusus acara ini. Pencarian blog Vultr yang kena adalah Agent Arena, acara berbeda.
- Instagram lablab.ai tidak dibaca langsung. Cuplikan mesin pencari tidak dipakai sebagai fakta.
- Negara di luar contoh terms bagian 11. Kalimat itu bilang daftar embargo tidak lengkap, dan tidak menempel daftar OFAC.
- Apakah submission hackathon masuk “Your Content” bagian 4 sekaligus “Feedback” bagian 8. Terms tidak memetakan itu ke form LabLab.

<a id="url"></a>

## Daftar URL yang benar-benar dibaca

Terbaca isinya, 30 Oktober 2026:

1. https://lablab.ai/ai-hackathons/vultr-hackathon
2. https://lablab.ai/ai-hackathons/vultr-hackathon/live
3. https://community.vultr.com/e/vultr-agent-rush-hackathon
4. https://lablab.ai/hackathon-rules
5. https://lablab.ai/ai-articles/hackathon-guidelines
6. https://lablab.ai/getting-started-guide
7. https://lablab.ai/terms-of-use
8. https://lablab.ai/delivering-your-hackathon-solution
9. https://lablab.ai/code-of-conduct
10. https://lablab.ai/api/v4/vultr-hackathon/sections?offlineParticipants=0&offlineFollowers=0
11. https://docs.vultr.com/products/serverless/inference/provisioning
12. https://docs.vultr.com/products/compute/serverless-inference/faq
13. https://api.vultrinference.com/v1/models
14. https://www.vultr.com/api/
15. https://docs.vultr.com/how-to-set-up-agent-sandboxing-on-vultr-cloud-compute
16. https://docs.vultr.com/how-to-deploy-a-nextjs-application-with-vultr-supabase-marketplace-app
17. https://docs.vultr.com/how-to-deploy-an-application-with-vultr-coolify-marketplace-app
18. https://gvisor.dev/
19. https://github.com/opensandbox-group/OpenSandbox
20. https://www.youtube.com/watch?v=icJzcsP59Ks
21. https://www.youtube.com/watch?v=P0wZ2LYufGU
22. https://x.com/lablabai/status/2111012321258619384
23. https://x.com/Vultr/status/2115516960867770475

Dibuka tetapi isinya tidak terbaca (Cloudflare): https://www.vultr.com/register/ dan https://console.vultr.com/billing/?promo=HACKATHON
