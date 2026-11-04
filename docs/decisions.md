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
| D-12 | Struktur tab: Home (chat dan history semua thread), Background (Klise), Target, Prospects (Seer), Signals, Competitors, Profiling, ICP. Tiap tab punya satu thread chat kecil di sisi kanan. Outreach di luar v1. | Chat, 3 Nov ("setuju") |
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

## Dari workspace memory, belum dikonfirmasi user di chat

- ICP dan aturan "sinyal → alasan beli" dibuat per seller sebagai konfigurasi, tidak hardcoded untuk electrical.
- Sinyal permit NYC: pemilik perusahaan dipetakan dari `owner_business_name`, lalu `applicant_business_name`, lalu `unknown`. Nama orang tidak pernah dipakai. Baris live diberi `synthetic: false`, dan baris dengan `issued_date` null dibuang.
- Kontak production: Hunter by domain sebagai default, Apollo hanya untuk telepon dan title. Ini hanya di README sebagai arah berikutnya.
- Phase 2 dan Phase 4 demo memakai seed sintetis berlabel. Ini bertentangan dengan permintaan data real, lihat `open-questions.md` nomor 2.

## Usulan asisten, belum disetujui

- Satu sinyal tidak cukup. Kalau sinyal yang selaras kurang dari dua, status `unknown`.
- Klaim tanpa sumber tidak ditampilkan.
- LLM tidak menghitung skor, tanggal, harga, atau margin. LLM hanya mengekstrak data dengan kutipan dan menulis draf.
- Kontak tanpa sumber tidak ditampilkan. Email tidak ditebak dari pola nama@domain.
