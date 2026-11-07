# Belum diputuskan

Diperbarui 7 Nov 2026. Kickoff 3 Nov 2026, 15:00Z. Deadline submit 8 Nov 2026 22:00 UTC.

Yang sudah dijawab dipindah ke `decisions.md` dan tidak lagi ditulis di sini.

1. ~~Sumber sinyal: konflik "tambah sebanyak-banyaknya" vs keputusan lama~~ **Dijawab (G10, 7 Nov):** freeze di 4 sumber live. Tambah hanya setelah hackathon.
2. ~~Data real atau sintetis untuk demo~~ **Dijawab (Q18, 7 Nov):** data real, tanpa sintetis. Revisi Q18 (tanpa sensor) dikonfirmasi user 7 Nov.
3. ~~Hunter: Free dengan cache, atau Starter~~ **Dijawab (7 Nov):** tidak keduanya. Akun Free terukur 50 search credit/bulan. Uji 3 domain C5 gagal sebagai sumber default. Lihat `sources.md` C3.
4. ~~Perusahaan kedua di demo~~ **Dibatalkan (user, 7 Nov):** tidak usah.
5. ~~LinkedIn access path~~ **Dijawab (Q17, 7 Nov):** link manual tanpa extension. Akses resmi dibangun ulang hanya kalau LinkedIn memberi izin tertulis atau API.
6. **theHarvester.** Masih terbuka. Posisi asisten: tidak dipakai sebagai sumber kontak.
7. ~~Jalur kontak tanpa LinkedIn~~ **Dijawab (Q7, 7 Nov):** input manual, CSV dari CRM, Jina crawl (Step A), direktori publik (Step C). Cache Hunter belum diputuskan (lihat 3).
8. ~~Figcraft atau Sokudo~~ **Dijawab (Q13, 7 Nov):** FigCraft via MCP, user review di canvas.
9. **Data requirements dari gambar.** Masih terbuka. Gambar yang dikirim tidak terbaca; perlu teks atau foto ulang.
10. **Flow spec.** Masih terbuka. Ditulis di `KLISEER_BUILD_PLAN_2.md`, perlu persetujuan user.
11. **Prompt untuk Figcraft.** Masih terbuka. Layar sudah dirinci di `KLISEER_BUILD_PLAN_2.md`; prompt belum disusun.
12. **Pertanyaan chat Background.** Masih terbuka. 6 sampai 8 pertanyaan belum disusun.
13. ~~Aturan scoring~~ **Dijawab (G8/G9, 7 Nov):** bintang per komponen 0–5 (keyword, freshness, place, target fit), overall 0–20, tier S ≥ 16 / A ≥ 12 / B ≥ 8 / C ≥ 4. Materialisasi jalan 7 Nov. Formula di `docs/decisions.md` G8.
14. **Model Vultr.** Masih terbuka. Daftar model harus dicek live. Kandidat: glm-5.3, glm-5.3-flash, mimo-v2.6-pro.
15. ~~Aturan lablab~~ **Ditutup (user, 7 Nov):** dianggap aman, tidak ada tindakan.
16. **Angka tryclean "75 sinyal dalam 8 kategori".** Masih terbuka. Belum diverifikasi di halaman.
17. **Nama dua feed permit kota.** Masih terbuka. Perlu dicatat di `sources.md`.
18. **Sumber pertama yang diuji di scratch.** Masih terbuka. NYC SODA (`rbx6-tga4`) sudah tervalidasi sebagai kandidat.
19. ~~Aturan tier S, A, B, C~~ **Dijawab (Q5, 7 Nov):** tier dihitung dari skor kecocokan dengan Target, bukan temperature. Ambang per tier belum final.
20. ~~Prospek di luar wilayah layanan~~ **Dijawab (grill G5, 7 Nov):** bukan badge. Wilayah komponen skor. Yang tidak cocok jatuh dari top 20. Data tetap di DB.
21. ~~Verifikasi kinerja Seer~~ **Diukur (7 Nov):** agregat 365 hari 3901 ms, seq scan, 22.509 perusahaan. Detail di `KLISEER_BUILD_PLAN_2.md`.
22. ~~Coverage pipeline A + C~~ **Diukur (7 Nov):** Step A homepage 1/10; ditambah `/contact` `/about` `/team` jadi 4/10 (`islandelectric.info`, `slgreen.com`, `solasnyc.com`, `corescaffold.com`). C masih manual. Bukit 40 halaman semuanya 200.
23. **Sumber per-field C5.** Baru: email dan nama DM di C5 belum terbukti di `solasnyc.com/contact`. Perlu dicek sebelum tampil di UI.
24. ~~Tujuh kontak guest tambahan~~ **Diisi (7 Nov)** lewat Hunter ke tabel `contacts`, plus 3 lead C5 dan 2 ekstra (Ace Group, Berger Quality). Total 13 baris, 12 perusahaan. Guest 10 = Island, SL Green, Kale, Sunrun, Vornado, Momentum, Core Scaffold, Solas, Hivolts, A&S. Script: `scripts/seed-hunter-contacts.ts`.
