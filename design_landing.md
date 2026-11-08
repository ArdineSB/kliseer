# Kliseer — Landing Page Design

Dokumen khusus landing, dirangkum dari pembahasan user dan brief yang sebelumnya ada di `DESIGN.md`.

**Status:** brief tercatat; landing belum digambar di FigCraft dan animasi belum diimplementasikan. Copy kerja di bawah belum merupakan approval atas layout final. Video motion design dikerjakan nanti, bukan bagian tahap desain sekarang.

## 1. Tujuan dan audiens

- **Mode:** Persuade. Pengunjung memahami manfaat Kliseer lalu memilih **Explore Demo**.
- **Audiens:** sales rep pada supplier/distributor material dan peralatan pekerjaan bangunan di Amerika Serikat.
- **Masalah:** informasi perusahaan dan sinyal proyek tersebar; perlu diubah menjadi target yang jelas, prospek relevan, dan outreach yang terarah.
- **Mekanisme:** **Klise understands your business; Seer finds the prospects that fit.**
- **Makna brand:** dari informasi abstrak menjadi pemahaman dan sasaran yang lebih presisi. Jangan menerjemahkan nama Kliseer menjadi English “cliché”.
- **Bahasa UI/copy:** English. Penjelasan desain di dokumen ini boleh Indonesian.

Metafora yang dipakai adalah **precision / aiming / focus**, bukan menjangkau sebanyak mungkin sambil berharap ada yang cocok. Tidak perlu visual senjata, peluru, atau kekerasan literal. Relevansi bukan jaminan perusahaan akan membeli.

## 2. Copy dan CTA

### Hero — copy kerja utama

**Headline**

> Stop guessing. Start aiming.

**Supporting copy**

> Turn scattered business data into clear targets, relevant prospects, and focused outreach.

**CTA utama yang dipilih user**

> Explore Demo

**Usulan navigasi/aksi pendamping:** Create account sebagai CTA sekunder; Log in di navbar. Keduanya bukan CTA utama yang bersaing dengan Explore Demo.

### Alternatif motto

> Aim with precision. Don’t spray and pray.

Ini alternatif, **bukan headline kedua yang ditampilkan bersamaan** dengan headline utama. “Spread the bullets” bukan copy English yang dipakai. Untuk tahap terakhir workflow, gunakan “Make your move”, bukan “Shoot the bullet”.

## 3. Empat langkah workflow

| Langkah | Judul English | Isi dan UI yang diperlihatkan |
|---|---|---|
| 1 | **Understand your business** | Klise menyusun produk, kemampuan, dan wilayah dari informasi perusahaan; tampilkan Company dan sumber inputnya. |
| 2 | **Define your target** | Bentuk target berdasarkan jenis perusahaan, wilayah, dan buyer roles. Buyer roles bukan faktor skor. |
| 3 | **Find your prospects** | Seer memperlihatkan perusahaan yang relevan, rating kecocokan, sinyal bertanggal, serta sumber yang bisa diperiksa. |
| 4 | **Make your move** | Pilih kontak yang tersedia dan siapkan draft outreach untuk diperiksa manusia. Bukan mengirim email otomatis. |

Ini padanan English kerja untuk alur user: understanding company → find target → get prospects → shoot the bullet. Maksud tindakan pada langkah terakhir dipertahankan tanpa mengubahnya menjadi klaim sending.

## 4. Struktur landing

Urutan section yang diterima sebagai arah:

1. **Hero** — manfaat utama, CTA Explore Demo, dan preview produk.
2. **How it works** — alur empat tahap di atas dengan informasi yang bergerak antartahap.
3. **Inside a prospect** — perlihatkan rating, Analysis, kontak, dan Sources melalui UI produk.
4. **Data and limitations** — asal sinyal dan batas interpretasi: kontak dapat tidak tersedia; skor bukan buying intent.
5. **Final CTA** — kembali ke Explore Demo, dengan Create account sebagai opsi pendamping.

Label section ini adalah struktur kerja, bukan semua heading/copy section final. Jangan mengarang paragraf pemasaran, harga, statistik hasil, atau bukti pelanggan seolah sudah disetujui.

**Pricing ditahan** sampai harga/paket diputuskan. Tidak menambahkan section testimoni/logo pelanggan tanpa bukti nyata.

## 5. Visual authority dan aset

Pertahankan logo resmi, Inter, identitas ungu, dan semantic tokens Kliseer dari `DESIGN.md`. Landing boleh lebih ekspresif daripada workspace aplikasi, tetapi bukan identitas brand baru. Background landing tidak mengubah background layar internal.

| Acuan | Fungsi |
|---|---|
| `reference/workflow_landing.png` | Empat node terhubung dengan konektor melengkung; arah flow kiri ke kanan. Ambil struktur, bukan tema gelap atau logo integrasi referensi. |
| `reference/background_landing.png` | Bidang warna mauve/ungu blur dengan grain; dasar arah background beranimasi. |
| `design/export/` | Kebenaran visual UI Kliseer yang sudah didesain; baca export terbaru sebelum menyusun demonstrasi. |
| `logo-concepts/kliseer-lockup.svg` | Logo icon + wordmark resmi. |
| `logo-concepts/kliseer-icon.svg` | Icon resmi. |
| `logo-concepts/kliseer-wordmark.svg` | Wordmark resmi. Jangan ketik ulang atau mengganti tipografinya. |

User menyebut workflow seperti **Tryclean**. Screenshot lokal menjadi acuan yang sudah diperiksa; tidak ada URL/video gerak Tryclean yang diperiksa. Jangan mengklaim timing atau choreography-nya sudah dianalisis dari screenshot statis.

## 6. Motion thesis

**Focal moment:** informasi yang awalnya abstrak diteruskan menjadi target, prospek, dan draft. Elemen yang sama berlanjut antartahap, bukan empat kartu independen yang fade-in bergantian.

### Choreography workflow

1. **Understand:** potongan informasi masuk dan tersusun menjadi field Company.
2. **Target:** sebagian informasi tadi diteruskan menjadi pilihan target. Chip produk mempertahankan kontinuitas visual.
3. **Prospects:** konektor tergambar; satu pulse ungu mengikuti jalur; tabel Seer memperlihatkan satu prospek terpilih.
4. **Make your move:** baris prospek terpilih berlanjut menjadi detail, kontak, dan panel draft yang relevan.

Node aktif diperjelas dengan border ungu dan satu perubahan mini-UI yang bermakna. Desktop mengalir **kiri → kanan**; mobile **atas → bawah**. Jangan mengecilkan diagram desktop hingga teks mobile tidak terbaca.

Workflow menjadi signature sequence. Section lain cukup mendukungnya; hindari fade-and-rise berulang untuk setiap section, efek berlapis tanpa makna, atau gerak yang membuat pengunjung menunggu untuk membaca.

### Background motion

- Dua atau tiga bidang warna besar bergerak pelan dengan fase berbeda dan perubahan skala kecil, seperti tinta/kabut yang menyebar.
- Grain tetap diam; jangan membuat noise berkedip atau tekstur bergerak cepat.
- Area di belakang headline tetap terang, tenang, dan terbaca di seluruh state.
- Background terasa abstrak, sementara UI foreground tajam dan terstruktur.
- Arah usulan: bidang warna terasa lebih terfokus di sekitar UI saat sequence mencapai hasil.
- Hindari mouse-parallax besar, partikel acak, gradient berputar, dan dekorasi 3D yang tidak menjelaskan produk.

### Demonstrasi UI

Urutan yang dibahas: **Company → Target → baris prospek → Analysis → draft outreach**.

- Baris prospek dapat membesar/berlanjut menjadi detail, bukan berganti ke perusahaan lain tanpa konteks.
- Rating bintang terisi sesuai data; overall/tier muncul sebagai hasil perhitungan aturan, bukan angka yang dihitung AI.
- Panel draft menjadi hasil akhir yang dapat diperiksa; tidak ada animasi Send atau klaim pesan sudah dikirim.
- Demonstrasi harus ditandai sebagai contoh produk/study case; jangan menyamarkannya sebagai permintaan live.

## 7. Data dan klaim

Acuan: `docs/decisions.md` G8–G13 dan `docs/sources.md` C5/C6. Gunakan sumber yang dapat ditelusuri, bukan data yang dikarang demi animasi.

- **Harborline** adalah seller study case fiktif, bukan pelanggan nyata atau default semua akun.
- **WCK ELECTRIC CORP.** memiliki contoh score **16/20, Tier S, Keyword5 / Freshness5 / Place5 / Target fit1** pada snapshot yang sudah dibaca. WCK tidak punya kontak pada seed yang disetujui: jangan tiba-tiba memberinya recipient/draft rekaan.
- Jika satu sequence berakhir pada draft, gunakan prospect dengan kontak seed sah, misalnya **Hivolts**, dan pertahankan perusahaan/kontak yang sama sepanjang sequence.
- Kontak hanya dari **13 baris seed** yang dicatat di `docs/sources.md` C6 dan `scripts/seed-hunter-contacts.ts`. Jangan menebak email, title, LinkedIn, atau nomor telepon.
- Bedakan sumber first-party, direktori, dan Hunter. Jangan mengubah provider-supplied menjadi website-confirmed atau deliverability-verified.
- Tidak ada testimoni, logo pelanggan, angka peningkatan conversion/sales, jaminan membeli, klaim semua kontak verified, atau klaim cakupan penuh AS tanpa bukti.
- Jangan mengubah permit Complete menjadi proyek aktif atau sinyal pembelian mendesak.

### Upload yang tampil di landing harus versi terbaru

**Multi-file upload sudah approved**, menggantikan desain single-file lama. Jika digunakan pada langkah Understand:

- Tampilkan Upload files, multiple picker/dropzone, tabel status per file, dan filename pada kutipan.
- PDF/MD/TXT; batas **2 MiB per file** (label UI 2 MB).
- Kegagalan satu file tidak menghapus hasil sukses dari file lain.
- Original tidak disimpan; nilai/kutipan tetap draft sampai diperiksa.
- Jangan menyalin meter storage1GB atau dukungan DOCX dari screenshot Tryclean.
- Referensi: `reference/upload-multiple-files.png`, `design/export/klise-upload-draft.png`, dan kontrak development upload pada `DESIGN.md`.

## 8. File FigCraft dan deliverable desain

Struktur kerja yang direkomendasikan untuk kelanjutan:

- Gunakan **`design/kliseer.figcraft` yang sama**, bukan file baru yang menduplikasi brand/token.
- Buat page **Landing** untuk storyboard per section; jangan satu layer panjang tanpa pembagian section.
- Page **Landing motion** boleh dipakai untuk keyframe/anotasi terpisah.
- Reuse logo/komponen dari Components. Untuk treatment landing khusus, buat komponen tersendiri tanpa mengubah master aplikasi yang sudah disetujui.
- Pertahankan Screens, auth, setup/stepper, detail prospect, serta tab lain di luar scope.
- Desktop lebih dulu, lalu adaptasi mobile yang disengaja.

Deliverable berikutnya berupa desain FigCraft, bukan kode:

1. Section Hero, How it works, Inside a prospect, Data and limitations, Final CTA.
2. Keyframe awal, perubahan penting, dan akhir untuk workflow/background/UI.
3. Anotasi hubungan elemen, urutan, trigger, timing, replay/interruption, dan reduced-motion; rincian yang belum dipilih tetap diberi status usulan.
4. Jalur CTA ke demo/auth yang sesuai, tanpa mengklaim autentikasi atau input runtime sudah berjalan.
5. Render/export preview desktop/mobile dan keyframe penting, pemeriksaan teks/kontras/overflow, lalu save file dan update status brief.

## 9. Teknologi dan aksesibilitas — belum implementasi

Routing yang sudah diputuskan untuk implementasi nanti: landing **Astro di `/`**, aplikasi **Next.js di `/app`**, satu domain melalui Caddy. Jangan otomatis mengganti stack karena skill atau contoh animasi memakai framework lain.

Pilihan teknologi gerak masih terbuka:

- **CSS:** background drift, hover, dan feedback sederhana.
- **SVG:** jalur konektor dan pulse.
- **Motion / Framer Motion:** kandidat jika demonstrasi UI memakai komponen React.
- **Anime.js:** kandidat timeline DOM/SVG pada Astro.
- **Three.js:** belum diperlukan untuk arah2D ini; bukan dependency wajib.

Pilih satu pengatur timeline utama saat implementasi. Jangan memasang semua library atau menambah GSAP/Lenis otomatis hanya karena skill menyarankannya. Ukur hasil, bukan menganggap sebuah library pasti memberi performa baik.

Konten harus terlihat tanpa menunggu motion/JavaScript. Gerak nonesensial berhenti saat offscreen atau tab hidden. Reduced-motion menampilkan alur lengkap tanpa perjalanan/panning, dengan feedback state tetap terbaca. Keyboard/focus dan keterbacaan harus dipertahankan.

Video motion design ditunda. Jangan membuat atau menjanjikan output video pada tahap storyboard ini.

## 10. Pemakaian skill

Skill [`awwwards` dari juliobsz/skills](https://github.com/juliobsz/skills) cocok sebagai panduan art direction, komposisi, kontinuitas, dan signature motion. Untuk tahap sekarang, gunakan dalam batas **FigCraft-only**.

Jangan menjalankan default build/ship skill, menimpa `DESIGN.md`, mengganti font/token/logo, menambah halaman yang tidak diminta, atau memilih engine animasi tanpa kebutuhan. Brief ini dan keputusan user mengungguli default skill.

## 11. Yang masih perlu diputuskan saat storyboard

- Layout/komposisi final hero dan tiap section; copy final di luar hero/workflow yang tercatat.
- Timing/easing rinci, scroll-driven versus autoplay, replay, dan cara interupsi sequence.
- Prospect yang dipakai untuk sequence lengkap sampai draft beserta field yang ditampilkan.
- Layout mobile dan penyederhanaan background untuk perangkat kecil.
- Pengatur timeline saat tahap implementasi, bukan tahap dokumentasi ini.
- Format/durasi/output video ketika pekerjaan video diminta kemudian.

## 12. Mulai di chat berikutnya

Baca dokumen ini bersama `DESIGN.md`, `docs/decisions.md`, `docs/sources.md`, `KLISEER_BUILD_PLAN_2.md`, referensi lokal, dan export terbaru. Inspect dokumen FigCraft sebelum mengubahnya; jangan mengandalkan numeric ID dari percakapan lama tanpa validasi.

**Scope kelanjutan: desain landing di FigCraft beserta storyboard motion. Belum implementasi frontend, install dependency, atau pembuatan video.**
