# Glossary

Istilah yang dipakai di produk dan dokumen. Keputusan lengkap ada di `docs/decisions.md`.

- **Seller**: perusahaan yang memakai Kliseer untuk mencari prospek. Demo: Harborline Electrical Supply.
- **Background (Klise)**: tab profil seller (Company). "Klise" hanya label tab dan panggilan di chat (D-01).
- **ICP**: tab profil pelanggan ideal seller.
- **Target**: tab kriteria prospek yang dicari: jenis perusahaan, wilayah, peran pembeli (D-21).
- **Setup**: alur Company, ICP, Target, Review. Isian yang belum disetujui di Review disebut draft.
- **Signal**: kejadian bertanggal dari sumber publik yang terkait satu perusahaan (mis. permit). Wajib punya sumber.
- **Source record**: record asli di sumber publik tempat sinyal atau kontak berasal.
- **Prospect**: perusahaan yang sinyalnya cocok dengan Target seller. Tab UI: Seer.
- **Relevance**: seberapa cocok sinyal dengan produk atau keyword seller. Bukan klaim akan membeli (D-25).
- **Fit score**: skor kecocokan prospek dengan Target, dari produk, wilayah, tipe perusahaan, dan kesegaran sinyal (Q5).
- **Tier S / A / B / C**: label hasil dari fit score (D-15).
- **Top 20**: prospek yang tampil di tab Seer. Sisanya terkunci sampai upgrade (Q6).
- **Contact**: orang atau kanal untuk dihubungi di sebuah perusahaan: nama, jabatan, email, telepon, LinkedIn, website.
- **Decision maker (DM)**: owner atau pejabat perusahaan yang dicari sebagai kontak utama.
- **Contact floor**: alamat dari record permit yang selalu tampil. Telepon tidak selalu ada (Q15).
- **Enrichment**: proses mencari kontak untuk satu perusahaan.
- **Auto-lookup**: enrichment otomatis dengan kuota bulanan di tier Free.
- **LinkedIn link**: tautan profil LinkedIn yang dibuka user sendiri. Kliseer tidak mengambil data dari LinkedIn (S8).
- **Guest**: pengguna tanpa login. Label UI "Explore Demo". Data guest dihapus otomatis setelah 7 hari (Q10).
- **Study case**: data Harborline bawaan untuk mencoba produk.
- **Upload (Klise)**: unggah PDF, MD, atau TXT untuk mengisi Company, ICP, dan Target sebagai draft (D-20).
- **Draft email**: email outreach yang dibuat AI, bisa diedit, dan nama kontaknya ikut berubah saat kontak diganti (Q8).
- **Outreach**: kegiatan menghubungi prospek. Draft email masuk v1 (D-12 direvisi).
- **Free tier / Paid tier**: akses terbatas (5 auto-lookup per bulan) dibanding akses penuh.
- **Landing**: halaman publik statis di Astro, di `/`. App di `/app` (Q11).
- **sourceUrl**: tautan untuk memverifikasi sinyal atau kontak. Tanpa sourceUrl, data tidak ditampilkan.
