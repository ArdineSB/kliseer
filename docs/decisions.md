# Keputusan

Dokumen ini mencatat apa yang sudah diputuskan, siapa yang memutuskan, dan sumbernya. Keputusan yang belum final ada di `open-questions.md`.

Kickoff: 3 Nov 2026, 15:00Z.

## Sudah diputuskan user

| # | Keputusan | Sumber |
|---|---|---|
| D-01 | Nama produk Kliseer di UI, README, kode, dan package. "Klise" hanya label tab Background dan panggilan di chat. Tab Prospect bernama "Seer". | Chat, 3 Nov |
| D-02 | Redesign dari nol. Desain dibuat user di Figcraft (mirip Figma), lalu diintegrasikan ke aplikasi. | Chat, 3 Nov |
| D-03 | Pekerjaan redesign dilakukan di folder `kliseer-v2`. Folder ini bukan repo git. | Chat, 3 Nov |
| D-04 | Repo submission dibuat baru saat kickoff. Kode dari repo `kliseer` tidak disalin. Yang dibawa hanya docs dan seed yang sudah dicek ulang. | Chat, 3 Nov |
| D-05 | Sebelum kickoff hanya boleh docs, desain, mockup, dan riset. Tidak ada commit kode ke repo submission. | Aturan hackathon (KB), disetujui user |
| D-06 | Scope: konstruksi bangunan di AS, penjual dan prospek. Detail di `scope.md`. | Chat, 2 Nov (dikunci) |
| D-07 | Residential masuk scope pekerjaan bangunan, tapi tidak dipakai di demo. | Chat, 3 Nov ("ya gapapa") |
| D-08 | Seller demo: Harborline Electrical Supply (fiktif, NY/NJ, USD integer cents, teks English). Bukan Nusa Daya Teknik. | Chat, 3 Nov; spec D13 |
| D-09 | Demo hanya menyiapkan data dan ICP, bukan seluruh produk. Demo boleh memakai dua perusahaan. | Chat, 3 Nov |
| D-10 | Sumber sinyal v1 ditambah sebanyak yang diperlukan. Tiap sumber dicatat di `sources.md` dengan status cek. Ada konflik dengan keputusan lama, lihat `open-questions.md` nomor 1. | Chat, 3 Nov |
| D-11 | README root di `kliseer` disimpan sampai submission. Aturan hackathon meminta README yang menjelaskan pemakaian Vultr. | Chat, 3 Nov |
| D-12 | Struktur tab: Home (chat dan history semua thread), Background (Klise), Target, Prospects (Seer), Signals, Competitors, Profiling, ICP. Tiap tab punya satu thread chat kecil di sisi kanan. Draft email masuk v1 (direvisi Q8, 7 Nov). | Chat, 3 Nov ("setuju"); revisi 7 Nov |
| D-13 | LLM: Fireworks untuk dev, Vultr Serverless Inference untuk demo dan submission. | Chat, 2 Nov |
| D-15 | Tab Seer di UI menampilkan tier S, A, B, C, bukan temperature HOT, WARM, COLD, unknown. Berlaku untuk tabel dan detail. Engine Phase 3 tetap memakai temperature. | Chat, 3 Nov |
| D-14 | Docs scope (`scope.md`, README, `spec.md` bagian 1) di-commit ke repo `kliseer` sebelum kickoff. | Chat, 3 Nov ("ya") |
| D-16 | Front-end redesign dimulai sebagai desain/prototipe di FigCraft; implementasi React atau Next.js dilakukan setelah desain disetujui. Animasi Anime.js/Three.js menyusul setelah struktur dan interaksi stabil. | Chat, 3 Nov |
| D-17 | Visual desktop-first mengikuti referensi CRM terang: sidebar abu-abu muda, area kerja putih, tabel rapat dan mudah dipindai, aksen ungu seperlunya. | Chat, 3 Nov |
| D-18 | Setup pengguna baru memakai langkah Company → ICP → Target → Review, satu langkah per layar. Pengguna baru langsung mulai di Company; bagian yang selesai dapat dibuka kembali untuk diedit. | Chat, 3 Nov |
| D-19 | Setup dipetakan ke tab yang sudah ada: Company di Klise, ICP di ICP, dan target prospek di Target. Delapan tab tetap: Home, Klise, Target, Seer, Signals, Competitors, Profiling, ICP. | Chat, 3 Nov |
| D-20 | Chat membantu mengisi draf field terstruktur. Pengguna memeriksa dan menyetujui draf di Review; setiap isian menunjukkan pesan chat sumbernya. | Chat, 3 Nov |
| D-21 | Langkah Target menentukan jenis perusahaan, wilayah, dan peran pembeli yang dicari. Tujuan utamanya adalah target pasar/prospek, bukan jumlah meeting per bulan. | Chat, 3 Nov |
| D-22 | Setelah Review, aksi `Find prospects` membuka Seer dengan prospek yang cocok. Seer memakai tabel prospek dengan pencarian/filter dan ringkasan jumlah prospek, Tier S, dan prospek baru. | Chat, 3 Nov |
| D-23 | Desain rinci FigCraft berfokus pada setup, tabel Seer, dan detail prospek. Home, Signals, Competitors, dan Profiling cukup rancangan dasar untuk prototipe ini. | Chat, 3 Nov |
| D-24 | LinkedIn remains an optional product feature, off by default. Its access method is not approved by this decision; use only a method LinkedIn authorizes. | Chat, 4 Nov |
| D-25 | Prospect discovery uses each seller's products, relevant use cases/projects, and service region to rank and explain signal relevance; relevance is not a claim that a company will buy. | Chat, 4 Nov |
| D-26 | A prospect may be shown with a company, dated signal, and traceable source even when no contact name or email is available. | Chat, 4 Nov |
| D-27 | Prospects with traceable dated signals remain visible even when product fit is weak; relevance affects ranking and explanation rather than automatic exclusion. | Chat, 4 Nov |
| D-28 | Jangan menguji semua kandidat sumber sekaligus. Pilih sumber berdasarkan seller dan wilayah; validasi sumber terpilih end-to-end pada record nyata—nama perusahaan, tanggal, ringkasan, URL sumber, serta penanganan data kosong/duplikat—sebelum memperluas cakupan. NYC untuk demo NY/NJ dan Austin sebagai pembanding adalah kandidat awal, bukan pilihan final. | Chat, 4 Nov |

## Dari workspace memory, belum dikonfirmasi user di chat

- ICP dan aturan "sinyal → alasan beli" dibuat per seller sebagai konfigurasi, tidak hardcoded untuk electrical.
- Sinyal permit NYC: pemilik perusahaan dipetakan dari `owner_business_name`, lalu `applicant_business_name`, lalu `unknown`. Nama orang tidak pernah dipakai. Baris live diberi `synthetic: false`, dan baris dengan `issued_date` null dibuang.
- Kontak production: Hunter by domain sebagai default, Apollo hanya untuk telepon dan title. Ini hanya di README sebagai arah berikutnya.
- Phase 2 dan Phase 4 demo: seed sintetis dicabut. Data real dan kontak asli (Q18, 7 Nov). Lihat `open-questions.md`, poin 2 sudah dijawab.

## Keputusan Layer 2 — Contact Enrichment (7 Nov 2026)

| # | Keputusan | Sumber |
|---|---|---|
| Q15 | Floor kontak = alamat dari DOB saja. DOB S1 dan S14 tidak punya kolom telepon. Telepon tidak ditemukan dari A/C → `Phone: not found` + link source record. | Chat, 7 Nov (final) |
| Q16 | Step B (Google Custom Search API) dihapus dari C0. API ditutup untuk pelanggan baru, sunset 1 Jan 2027. Pipeline: Step A (Jina) → Step C (direktori publik) → floor. Pengganti dicari setelah ada yang terverifikasi hidup. | Chat, 7 Nov (final) |
| Q17 | Tier Free: LinkedIn manual. Tombol "Open LinkedIn →" membuka link biasa; user isi nama dan title sendiri lewat form. Extension capture dibatalkan (S8 diganti). Ikon dicoret kalau tidak ada URL. Dasar: LinkedIn User Agreement §8.2 dan automated activity guidance. | Chat, 7 Nov (final) |
| Q18 | Guest view: data asli, tanpa sensor. Nama DM, email bisnis, telepon, alamat tampil penuh. Tiap field wajib sourceUrl. Dasar: data B2B yang dipublish perusahaan sendiri atau direktori publik. Menggantikan versi sensor sebelumnya. | Chat, 7 Nov (revisi) |
| Q19 | Prioritas submit: semua wajib, tidak ada yang dipangkas. (1) Seer top 20 dengan skor kecocokan. (2) Setup Company, ICP, Target + upload file + Harborline case study. (3) Landing Astro. (4) Login + guest (Q1). (5) Draft email AI, edit, ganti nama kontak otomatis (Q8). (6) FigCraft layar baru. Agent FigCraft wajib baca `design/export/` dan dokumen ini sebelum mendesain. | Chat, 7 Nov |

## Keputusan Product (7 Nov 2026)

| # | Keputusan | Sumber |
|---|---|---|
| Q1 | Auth: email + password (hash `scrypt` dari `node:crypto`), session cookie httpOnly, tabel `users` dan `sessions`. Guest mode tanpa login. Tanpa verifikasi email di v1. Basic Auth di `proxy.ts` diganti. | Chat, 7 Nov |
| Q2 | Mulai dari nol. Harborline tersedia sebagai study case yang disalin ke akun user, bukan data default. | Chat, 7 Nov |
| Q3 | Upload PDF, MD, TXT untuk mengisi Company/ICP/Target sebagai draft dengan kutipan per field. Tanpa auto-approve. | Chat, 7 Nov |
| Q4 | `Find prospects` hanya query DB. Sinyal dari ingest terjadwal (cron 06:00 UTC). Tidak ada request ke sumber luar saat klik. | Chat, 7 Nov |
| Q5 | Rating S/A/B/C diganti skor kecocokan dengan Target: produk/keyword, wilayah, tipe perusahaan, kesegaran sinyal. Tiap komponen punya alasan template. LLM menulis analisis dari komponen, tidak menghitung skor. Prospek lemah tidak ditampilkan. **D-27 direvisi** untuk tampilan Seer; data tetap di DB. | Chat, 7 Nov |
| Q6 | Seer default: top 20 berdasarkan skor. CTA terbaru `Upgrade to view all`, English (menggantikan copy Indonesia), gate UI tanpa billing. | Chat, 7 Nov; revisi copy oleh user, 7 Nov |
| Q8 | Draft email masuk v1. **D-12 direvisi.** Dibuat AI, bisa diedit, tersimpan per (seller, prospect, contact); nama kontak di draft ikut berubah saat kontak diganti. | Chat, 7 Nov |
| Q9 | Home chat mengikuti `reference/chat.png` (greeting, 3 kartu, 4 tombol aksi, composer). Warna dan font pakai token Kliseer, bukan palet referensi. | Chat, 7 Nov |
| Q10 | Data guest: tersimpan di DB terikat cookie anonim, dihapus otomatis 7 hari. | Chat, 7 Nov |
| Q11 | Routing: landing Astro statis di `/`, app Next.js di `/app` (basePath), satu domain via Caddy. | Chat, 7 Nov |
| Q13 | Frame FigCraft dibuat AI via MCP, user review dan koreksi di canvas. | Chat, 7 Nov |
| Q14 | Tier dan skor dimaterialisasi saat ingest, bukan per request. Arah saja; ukur sebelum dan sesudah sebelum klaim penyebab lambat. | Chat, 7 Nov |
| G1 | Layar Login dan Create account terpisah. Create account tanpa nama dan tanpa Explore Demo. Sukses masuk Home. `proxy.ts` belum diganti. | Grill, 7 Nov |
| G2 | Klaim guest: akun yang sudah punya isi Company, ICP, atau Target menang, chat guest ikut terhapus. Akun kosong mengambil baris guest, chat ikut pindah. | Grill, 7 Nov |
| G3 | Logout bukan halaman baru. Guest melihat `Log in` di shell. User melihat `Log out`. | Grill, 7 Nov |
| G4 | Teks auth: `Email or password is not valid.` / `Enter a valid email.` / `Password must be at least 8 characters.` Tidak ditambah. | Grill, 7 Nov |
| G5 | Luar wilayah bukan badge di desain baru. Wilayah komponen skor. Tipe perusahaan ditunda sampai ada sumber. | Grill, 7 Nov |
| G6 | Hunter adalah jalur berbayar (Step D), bukan pipeline default tier Free. Klien ada di `lib/hunter.ts`. Tujuh kontak guest diisi 7 Nov ke tabel `contacts`. Akun API masih plan Free Hunter, bukan Starter. | Uji API, 7 Nov; user, 7 Nov |
| G7 | Detail prospect memakai Analysis untuk interpretasi AI why-now; sumber menjadi tabel Sources paling bawah. Tambahkan Company profile mengikuti field C5; semua teks UI English. Frame 7–9 dikerjakan dalam detail prospect, bukan halaman email terpisah. | Chat, 7 Nov |
| G8 | Skor bintang per komponen 0–5: keyword = min(sinyal 90 hari cocok keyword, 5); freshness = umur sinyal terbaru (≤30d=5, ≤90d=4, ≤180d=3, ≤270d=2, ≤365d=1, tidak ada=0); place = state di region seller 5, di target.regions 3, lain 0; target fit = nama perusahaan atau ringkasan sinyal memuat kata dari target.companyTypes 5, tidak 1. Overall = jumlah 0–20. Tier: S ≥ 16, A ≥ 12, B ≥ 8, C ≥ 4, di bawah itu tidak tampil. LLM tidak menghitung. Buyer roles tidak dinilai. | Chat, 7 Nov |
| G9 | Materialisasi skor: kolom `keyword_stars`, `freshness_stars`, `place_stars`, `target_fit_stars`, `score`, `tier` di `companies`. Diisi `scripts/score-refresh.ts` (jalankan setelah ingest). Sudah jalan 7 Nov: 22.556 perusahaan, 19 Tier S. `listProspects` lama tidak diubah, jadi UI yang ada tidak berubah sampai frame Seer disambung. | Chat, 7 Nov |
| G10 | Sumber sinyal freeze di 4 live (S1, S12, S13, S14). Chicago, SAM.gov, SF join, dan kandidat lain hanya setelah hackathon. | Chat, 7 Nov |
| G11 | User menyetujui revisi desain frame 7–9: Analysis empat rating bintang G8 + overall tier, WCK16/S (5/5/5/1), Company profile dan Sources terakhir, kontak hanya 13 seed rows, serta draft states termasuk WCK contact-required. Approval desain saja; bukan perubahan frame6 atau perintah mulai implementasi. | Approval user, 7 Nov |
| G12 | Landing: CTA utama Explore Demo. Pesan produk mengubah informasi bisnis abstrak menjadi target/prospek yang cocok dan outreach presisi. Workflow empat tahap: memahami bisnis → menentukan target → mendapat prospek → tindakan outreach. User menerima urutan section dan batas klaim tanpa bukti. Referensi workflow_landing.png untuk flow kiri→kanan dan background_landing.png untuk background beranimasi, ditambah motion UI Kliseer; video menyusul. Brief/copy kerja dan motion direction dipusatkan di [design_landing.md](../design_landing.md) atas permintaan user; belum menggambar/implementasi atau memilih library final. | Chat, permintaan catat dan dokumen khusus landing |
| G13 | **Revisi multi-file upload disetujui user7Nov.** Acuan screenshot Tryclean (`reference/upload-multiple-files.png`): Upload files, multiple picker/drop, tabel status per file, filename pada kutipan. PDF/MD/TXT,2MiB per file, original tidak disimpan, tanpa auto-approve; tidak mengadopsi storage1GB/DOCX. Kegagalan/retry/removal satu file tidak menghapus hasil sukses. Development wajib mengikuti kontrak/acceptance di DESIGN.md dan plan5; approval desain bukan klaim runtime selesai. | Permintaan revisi dan approval user, 7 Nov |

## Belum final

- Q12: 10 perusahaan pre-seeded untuk guest (Q12, 7 Nov, final). Baru 3 yang terverifikasi di C5. Sisanya 7 harus diperkaya dengan sumber nyata sebelum demo. Tidak ada data sintetis (Q18).


## Usulan asisten, belum disetujui

- Satu sinyal tidak cukup. Kalau sinyal yang selaras kurang dari dua, status `unknown`.
- Klaim tanpa sumber tidak ditampilkan.
- LLM tidak menghitung skor, tanggal, harga, atau margin. LLM hanya mengekstrak data dengan kutipan dan menulis draf.
- Kontak tanpa sumber tidak ditampilkan. Email tidak ditebak dari pola nama@domain.
