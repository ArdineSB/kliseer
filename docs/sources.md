# Sumber sinyal dan kontak (kandidat)

Daftar ini kandidat, bukan daftar yang sudah jalan. Kolom "Status cek" menunjukkan apa yang sudah diuji. Semua sumber harus dicek robots.txt dan ToS-nya sebelum dipakai. Setiap sinyal dan kontak wajib menyimpan URL atau record sumber.

Sumber dibagi dua: sinyal (kejadian bertanggal) dan kontak (orang dan email).

## Sinyal

| Sumber | Data | Cakupan | Status cek | Catatan |
|---|---|---|---|---|
| NYC DOB NOW Approved Permits (SODA `rbx6-tga4`) | Permit bangunan | NYC saja | Live diuji di riset sebelumnya | Pemetaan pemilik dari `owner_business_name`, lalu `applicant_business_name`, lalu `unknown`. Tidak memakai nama orang. Opsional, off secara default (memory). |
| Halaman publik perusahaan (berita, press, halaman team, lowongan) | Ekspansi, proyek baru, kontrak, perekrutan | Nasional, sinyal tipis | Belum diuji | Cek robots.txt dan ToS per situs. |
| Dua feed permit kota (nama belum tercatat) | Permit bangunan | Kota tertentu | Panggilan live berhasil (KB) | Nama feed perlu dicatat. |
| USAspending | Kontrak dan hibah federal | Nasional | Belum diuji. Usulan user. | Berguna untuk GC yang dapat proyek federal. |
| OSHA (data inspeksi establishment) | Inspeksi keselamatan | Nasional | Belum diuji. Usulan user. | Relevansi ke sinyal beli belum jelas. |
| Filing UCC dan registri bisnis negara bagian | Filing kredit, pendaftaran, nama officer atau agent | Per negara bagian | Belum diuji | Format beda tiap negara bagian. Nama officer bisa nama orang, jadi perlu aturan khusus. |
| crt.sh (sertifikat TLS publik) | Domain dari nama perusahaan | Nasional | Belum diuji | Hanya untuk menemukan domain. Bukan sinyal beli. |
| SEC EDGAR | Filing perusahaan publik | Nasional, hanya perusahaan publik | Belum diuji | Memory: tidak dibangun di window hackathon. Kecil untuk distributor. |
| Permit Chicago | Permit bangunan | Chicago | Belum diuji | Memory: tidak dibangun di window hackathon. |
| Customs dan data loan (aggregator) | Pengiriman impor, pinjaman | Nasional | Tidak dicek, berbayar | Di luar v1 kecuali user membayar. |

Dikeluarkan dari daftar karena di luar US: INAPROC (Indonesia), UK tender API.

## Kontak

| Sumber | Data | Status cek | Catatan |
|---|---|---|---|
| Hunter Domain Search (Free) | Email per domain, dengan confidence dan halaman sumber | Belum diuji. Angka 50 kredit per bulan dari pihak ketiga. | Hasil di-cache beserta URL sumber, supaya juri tidak memakai kredit. Ketentuan Free untuk layanan publik belum dicek. |
| Hunter Starter | Sama seperti Free, 2.000 kredit | Harga dari pihak ketiga: $49 bulanan, $34 tahunan | Belum diputuskan (lihat `open-questions.md` nomor 3). |
| Apollo | Orang berdasarkan jabatan, title, telepon | Belum diuji | Berbayar. Telepon di luar scope v1. |
| Halaman team publik perusahaan | Nama dan jabatan | Belum diuji | Email sering tidak tercantum. URL halaman menjadi sumber. |
| Input manual atau CSV dari CRM user | Nama, jabatan, email, URL sumber | Belum diuji | Setiap baris wajib punya kolom sumber. |

## Tidak dipakai


