# Belum diputuskan

Urut dari yang paling mendesak. Kickoff 3 Nov 2026, 15:00Z.

1. **Sumber sinyal: konflik antara "tambah sebanyak-banyaknya" dan keputusan lama.** Memory menyebut SEC EDGAR dan Chicago tidak dibangun di window hackathon. INAPROC dan UK tender di luar US, jadi tidak relevan. Pilih: ikut memory, atau ikut jawaban baru user.
2. **Data real atau sintetis untuk demo.** User minta data real. Memory (D4, D13) mengunci sinyal Phase 2 dan kontak Phase 4 sebagai seed sintetis berlabel. Pilih: sinyal real dari sumber publik dengan kontak sintetis, atau semua sintetis.
3. **Hunter: Free dengan cache, atau Starter.** Belum dijawab user. Angka 50 kredit per bulan dari pihak ketiga, belum dicek di hunter.io/pricing. Ketentuan Free untuk layanan yang dipakai juri juga belum dicek.
4. **Perusahaan kedua di demo.** User bilang boleh dua perusahaan. Belum jelas apakah yang kedua seller non-electrical atau prospect tambahan, dan namanya belum ada.
5. **LinkedIn, termasuk versi opsional.** Posisi asisten: tidak dibangun, dan tidak ada koneksi akun LinkedIn. User sudah dua kali meminta (ekstensi, lalu versi opsional). User belum menerima atau menolak secara tertulis. Ini menyangkut ToS dan risiko akun, jadi perlu keputusan eksplisit.
6. **theHarvester.** Posisi asisten: tidak dipakai sebagai sumber kontak. Belum dikonfirmasi user.
7. **Jalur kontak tanpa LinkedIn.** Usulan: input manual dengan URL sumber, CSV dari CRM, cache Hunter, dan halaman team publik. Belum disetujui user.
8. **Figcraft atau Sokudo untuk build.** User mungkin tidak memakai Sokudo untuk build. Belum diputuskan.
9. **Data requirements dari gambar.** Gambar yang dikirim user tidak terbaca. Perlu teks atau foto ulang.
10. **Flow spec.** Belum ditulis. User minta dibahas dulu. Playbook menyusul setelah flow disetujui.
11. **Prompt untuk Figcraft.** User minta asisten menyusun prompt desain. Layar yang dibutuhkan: Home, Background, Prospects, detail prospect, Signals, ICP. Tiap layar punya state kosong, loading, dan error.
12. **Pertanyaan chat Background.** 6 sampai 8 pertanyaan untuk mengisi profil seller belum disusun.
13. **Aturan scoring.** Usulan asisten: dua sinyal searah minimum, dengan jendela 90 hari. Memory juga punya aturan Kliseer: HOT, WARM, COLD, lag kontak 180 hari, dan 45 hari untuk catatan equipment-supply. Pilih: pakai aturan Kliseer, atau aturan baru.
14. **Model Vultr.** Daftar model harus dicek live. Dokumen KB sudah usang (`/v1/chat/models` 404). Kandidat: glm-5.3, glm-5.3-flash, mimo-v2.6-pro. API key Fireworks belum ada.
15. **Aturan lablab.** Belum dicek: hak organizer atas konten submission, batas karakter form (default title 5–50, short 50–255, long 600–2000, belum diverifikasi di form live), dan apakah repo baru saat kickoff sesuai aturan.
16. **Angka tryclean "75 sinyal dalam 8 kategori".** Belum diverifikasi di halaman.
17. **Nama dua feed permit kota.** KB menyebut dua feed kota menjawab panggilan live, tanpa nama. Perlu dicatat di `sources.md`.
18. **Sumber pertama yang diuji di scratch.** Belum dipilih. NYC SODA (`rbx6-tga4`) sudah tervalidasi di riset sebelumnya.


19. **Aturan tier S, A, B, C.** User minta tab Seer memakai tier, bukan temperature. Aturan penentuan tier per huruf belum ada. Engine Phase 3 memakai HOT, WARM, COLD, unknown. Pilih: tier sebagai label UI yang dipetakan dari temperature, atau tier dihitung dengan aturan baru.
