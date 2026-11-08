# Prompt: Kliseer Landing Page

> **Status:** Prompt tersimpan untuk dipakai nanti. Jangan mulai implementasi landing page sekarang: frontend belum diperbarui mengikuti desain terbaru. Sebelum mulai, cek frontend dan desain terbaru; jangan menganggap desain lama sebagai acuan final.

```text
Oke, sekarang kita rencanakan dan implementasikan landing page Kliseer setelah frontend diperbarui dengan desain terbaru.

Sebelum mulai, pelajari struktur project, frontend terbaru, keputusan produk, dan desain Kliseer yang sudah disetujui. Cek `reference/animation_1.mp4` untuk inspirasi cursor yang bergerak dan menavigasi UI produk, serta `reference/animation_flow.mp4` untuk inspirasi animasi workflow. Gunakan desain terbaru sebagai sumber kebenaran; jangan menyalin desain lama jika sudah tidak sesuai.

Gunakan Astro, bukan Next.js, untuk landing page. Gunakan HTML/CSS dan JavaScript yang memang diperlukan. Pertimbangkan Lenis hanya jika sesuai kebutuhan dan tidak mengganggu aksesibilitas/performa; jangan menambahkan dependency tanpa alasan.

Konten:
- Headline: “Stop guessing. Start aiming.”
- Supporting copy: “Turn scattered business data into clear targets, relevant prospects, and focused outreach.”
- CTA utama: “Explore Demo”
- Workflow: Understand your business → Define your target → Find your prospects → Make your move.
- Urutan section: Hero → How it works → Inside a prospect → Data and limitations → Final CTA.

Motion workflow harus terdiri dari EMPAT animasi terpisah, satu animasi untuk setiap tahap, bukan satu sequence all-in-one dan bukan empat kartu yang hanya fade-in. Susun sebagai section workflow terpisah yang berurutan saat pengunjung scroll:
1. Understand your business — tampilkan UI aplikasi dan cursor yang bergerak untuk menunjukkan perusahaan dipahami.
2. Define your target — saat pengunjung scroll ke section ini, tampilkan animasi UI dan cursor tersendiri yang menunjukkan target ditentukan.
3. Find your prospects — section berikutnya punya animasi UI dan cursor tersendiri untuk menemukan prospek.
4. Make your move — section terakhir punya animasi UI dan cursor tersendiri untuk menyiapkan langkah/outreach.

Setiap animasi harus berdiri sendiri dan punya awal/akhir yang jelas, tetapi tetap terasa sebagai empat tahap dari workflow yang sama. Gunakan transisi scroll antar-section; jangan menggabungkan seluruh tahapan menjadi satu animasi panjang yang mengunci scroll atau memaksa pengunjung menunggu. Cursor harus berinteraksi secara masuk akal dengan UI aplikasi pada tiap tahap, bukan bergerak dekoratif tanpa menjelaskan tindakan.

Buat storyboard motion per section sebelum implementasi: keyframe awal, aksi cursor, perubahan UI, keyframe akhir, trigger/timing, dan perilaku reduced-motion. Desktop lebih dulu; adaptasikan workflow mobile menjadi alur atas ke bawah. Informasi tetap bisa dibaca tanpa animasi dan tanpa JavaScript.

Visual dan brand:
- Gunakan logo resmi Kliseer, Inter, dan semantic tokens yang sudah ada.
- Pertahankan identitas Kliseer; jangan buat identitas baru atau gunakan metafora senjata literal.
- Gunakan background mauve/ungu blur yang bergerak pelan; grain tetap diam.
- Pastikan kontras dan keterbacaan konten, terutama di belakang headline.

Konten produk dan klaim:
- Jangan mengarang testimoni, logo pelanggan, angka hasil sales, atau kontak.
- Jangan mengklaim email dikirim otomatis.
- Jangan menambahkan pricing sebelum harga disepakati.
- Jika alur berakhir pada draft outreach, gunakan perusahaan dengan kontak seed yang sah, misalnya Hivolts. Jangan memasangkan kontak milik perusahaan lain.
- Tampilkan data dan keterbatasannya secara jujur; jangan menyiratkan bahwa relevansi adalah jaminan pembelian.

Sebelum implementasi, pastikan desain terbaru sudah tersedia dan sesuai untuk dijadikan acuan. Jika belum, jangan implementasikan landing page; laporkan aset/desain terbaru yang masih dibutuhkan. Jangan menimpa dokumentasi desain, mengganti keputusan yang sudah disetujui, atau mengunci library animasi tanpa alasan.
```
