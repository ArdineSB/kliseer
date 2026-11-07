# Kliseer build plan part 2

Diperbarui 7 Nov 2026. Deadline submit 8 Nov 2026 22:00 UTC. Plan ini menggantikan `KLISEER_BUILD_PLAN.md` untuk scope berikut. Keputusan ada di `docs/decisions.md` (Q1–Q19). Sumber ada di `docs/sources.md`.

## Keputusan yang mengikat

- Auth: email + password, hash `scrypt` dari `node:crypto`, session 30 hari (diperpanjang saat layar login disambung). Tanpa verifikasi email. `proxy.ts` Basic Auth belum diganti. Ganti itu menunggu frame login (Q1, grill 7 Nov).
- Guest: satu baris seller kosong, `guest_token_hash` terisi, dihapus pada hari ke-7. Boleh isi Company, ICP, Target, upload, dan chat. Draft email dan auto-lookup hanya setelah login. Sepuluh prospek demo shared dan read-only. Baris tanpa `guest_token_hash` bukan guest. Seller Harborline tidak ikut terhapus.
- Mulai dari nol. Harborline tersedia sebagai study case yang disalin ke akun user, bukan data default (Q2).
- Upload PDF, MD, TXT untuk mengisi Company, ICP, Target sebagai draft dengan kutipan per field. Tanpa auto-approve (Q3, D-20).
- `Find prospects` hanya query DB. Tidak ada request ke sumber luar saat klik. Ingest terjadwal 06:00 UTC (Q4).
- Scoring terbaru G8: Keyword, Freshness, Place, Target fit masing-masing 0–5; overall jumlah 0–20; S≥16, A≥12, B≥8, C≥4, di bawah4 tidak tampil. Target fit mencocokkan target.companyTypes; baseline1 jika tidak cocok/kosong. Buyer roles tidak dinilai. AI hanya menulis interpretasi. Detail FigCraft sudah direvisi; tabel/runtime lama belum disambung.
- Seer default top 20. Sisanya tampil `Upgrade to view all` (copy English terbaru user). Gate UI saja, tanpa billing. Desain MCP ada; belum frontend.
- Draft email: satu baris per (seller, prospect). Subject dan body menyimpan `{contact.name}`. Nama diganti saat ditampilkan, satu kali, di subject dan body. Edit lain tidak tertimpa (grill Q8).
- Home chat mengikuti `reference/chat.png`: greeting, 3 kartu, 4 tombol aksi, composer. Warna dan font pakai token Kliseer (Q9).
- Routing: landing Astro statis di `/`, app Next.js di `/app` dengan `basePath`, satu domain via Caddy (Q11).
- Guest view: 10 perusahaan pre-seeded (Q12). Data asli, tanpa sensor. Nama DM, email bisnis, telepon, alamat tampil penuh. Tiap field wajib sourceUrl (Q18).
- Kontak: Free tier pakai auto-lookup 5 per bulan. LinkedIn manual: tombol "Open LinkedIn →" membuka link biasa, user isi nama dan title sendiri lewat form. Tanpa extension, tanpa scraping (Q17, S8).
- Contact enrichment: C0 urut Step A (Jina) → Step C (direktori publik) → floor. Step B (Google CSE) dihapus, API sunset 1 Jan 2027 (Q16). Free tier dilarang memanggil SerpAPI atau Hunter (C0).
- Floor kontak: alamat dari DOB, dengan link source record. Telepon tidak ada di S1 dan S14. Kalau tidak ditemukan, tampil `Phone: not found` + link (Q15).
- Ikon LinkedIn selalu tampil. Tanpa URL: ikon dicoret, tidak bisa diklik (Q17).
- Materialisasi tier dan skor saat ingest, bukan per request (Q14). Diukur 7 Nov: agregat 365 hari butuh 3.9 detik di server dan seq scan hampir semua sinyal.
- Build FigCraft: AI buat frame via MCP, user review di canvas (Q13).

## Langkah

Urutan ini yang dikunci. Layar tidak disentuh sampai frame FigCraft selesai.

1. Schema `users`, `sessions`, `contacts`, `email_drafts`, plus kolom guest di `sellers`. Sudah di Supabase, 7 Nov. Cek: empat tabel ada, purge menghapus 1 guest uji, seller Harborline tetap 1.
2. Fungsi tanpa route: hash password, validasi email dan password, keputusan klaim guest, token draft, baca upload, gerbang kutipan, purge guest. Selesai di repo. Purge dipanggil di awal `scripts/ingest.ts`. Kalau kolom belum ada di VM, ingest tetap jalan dan purge hanya dicatat gagal.
3. Kamu desain frame di bawah. Jangan desain ulang Signals, Competitors, Profiling, atau stepper setup yang sudah ada di `design/export/`.
4. Setelah frame disetujui: sambung login, logout, upload, Seer top 20, panel kontak, panel draft, lalu ganti Basic Auth.
5. Landing Astro, `basePath` `/app`, dan Caddy menunggu frame landing. Bukan bagian kerja backend ini.
6. Skor baru dan materialisasi menunggu bobot. Jangan dihitung di UI lama.
7. Kontak diisi 7 Nov lewat Hunter (`scripts/seed-hunter-contacts.ts`): 13 baris, 12 perusahaan. Guest 10 = Island, SL Green, Kale, Sunrun, Vornado, Momentum, Core Scaffold, Solas, Hivolts, A&S. Ace Group dan Berger Quality ekstra untuk user login.

## Frame FigCraft

Token Kliseer. Bukan palet `reference/chat.png`. Agent yang menggambar wajib baca `design/export/` dan `docs/decisions.md` dulu.

1. Landing. Storyboard scroll. Satu frame per bagian: hero, alur, CTA. Bukan satu layer panjang.
2. Login. Email, password, `Log in`, `Explore Demo`, link `Create account`. Gagal: `Email or password is not valid.` Sukses masuk Home, session langsung. Aturan klaim guest berlaku.
3. Create account. Layar terpisah. Email, password, `Create account`, link `Log in`. Tanpa `Explore Demo`. Tanpa nama. Email buruk: `Enter a valid email.` Password pendek: `Password must be at least 8 characters.` Email sudah terdaftar memakai teks gagal login. Sukses masuk Home.
4. Home. Struktur `reference/chat.png`: greeting, 3 kartu, 4 aksi, composer. Frame `home/chat/empty` dan export `design/export/home-chat-empty.png` direvisi via MCP dan disetujui user 7 Nov, termasuk kartu assistant putih dan outline gradient pada kartu/New chat. Guest dan user memakai frame yang sama. Shell: guest melihat `Log in`, user melihat `Log out`.
5. Upload di Klise. Kosong, sedang parsing, draft dengan kutipan per field, error `Could not read that file.` Tombol muat study case Harborline hanya di Company kosong. File tidak disimpan. Yang disimpan nanti hanya nilai field dan kutipan, status tetap draft. Empat state sudah digambar via MCP 7 Nov: `setup/company/empty` dan `klise/upload/{parsing,draft,error}`; menunggu review user. Stepper tidak diubah; upload masih simulasi prototipe, belum frontend.
6. Seer. 20 baris plus `Upgrade to view all`. Tanpa baris lemah atau badge luar wilayah. Loading/ready/empty/error dan filtered-empty tersedia. Copy CTA English direvisi sesuai user. Baris Hivolts ditautkan ke detail; skor/urutan masih ilustratif dan gate belum billing.
7. Detail kontak. Revisi frame lama, bukan gambar baru: ready2097 sekarang WCK, Hivolts4701 dan A&S8819 tetap. Kontak hanya dari 13 baris seed (docs/sources.md C6). WCK tidak punya kontak: not found + source, ikon unavailable. Hivolts memakai Moishy/company contact; A&S company contact, tanpa DM rekaan. Company profile15 field dan Sources terakhir tetap. Menunggu review; belum runtime lookup.
8. Analysis empat baris bintang0–5: Keyword, Freshness, Place, Target fit, ditambah overall score dan tier. WCK16/S dengan5/5/5/1; DB juga memverifikasi score Hivolts/A&S yang sama. Satu paragraf interpretasi terpisah; AI tidak menghitung. G8 menggantikan ketentuan tiga baris/tanpa tipe perusahaan sebelumnya. Revisi in-place via MCP; tidak menambah frame.
9. Panel draft lama direvisi, bukan halaman baru. Sebelas varian reusable dipertahankan dengan recipient sah. NameChanged sekarang Moishy → Hivolts Electrical (company contact); edit lain dipertahankan. A&S memakai kontak umum dari seed. WCK contact-required menonaktifkan Generate tanpa recipient. Menunggu review; belum frontend/persistence/sending.

## Verifikasi

- Kinerja Seer, diukur 7 Nov lewat SSH tunnel ke Supabase. `EXPLAIN ANALYZE` agregat 365 hari: **3901 ms**. Bukan estimasi. Hampir semua baris kena seq scan (`Rows Removed by Filter: 363` dari 237.239 sinyal). 22.509 perusahaan dikembalikan, lalu dipotong di Node jadi 50. Itu sebab `listProspects` habis memori di laptop. Angka ini waktu server, bukan transfer laptop. Cache dingin: 33.852 buffer read. Belum diukur ulang saat cache panas, dan belum dibandingkan sesudah materialisasi.
- Coverage pipeline A + C: baru 3 perusahaan (C5), manual. Coverage belum diukur.
- Sumber per-field C5: Jina probe ke `solasnyc.com/contact` jalan (HTTP 200), tapi `office@solasnyc.com` dan `Conor Downey` tidak ditemukan di hasil crawl. Perlu cek sumber per field sebelum tampil.

## Risiko

- Guest butuh 10 kontak, baru 3 terverifikasi. 7 sisanya perlu perkayaan dengan sumber nyata. Sumber dan cara ini belum ada. Ini blocker untuk Q12.
- Waktu: sekitar 37 jam sebelum deadline. Scope penuh (Q19) berat. Urutan kerja di atas menjaga item 1 dan 2 jalan lebih dulu.

## Verifikasi saat selesai

- `npm run check` dan `npm run build` lulus.
- Seer: waktu `/api/prospects` sebelum dan sesudah materialisasi, dengan angka.
- Guest: 10 kontak tampil dengan sourceUrl per field.
- Draft email: ganti kontak mengubah nama di draft tanpa menghapus isi lain.
- Landing: diuji di browser, animasi berjalan, route `/app` terbuka.
