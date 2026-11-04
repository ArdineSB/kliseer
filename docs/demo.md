# Demo: seller dan ICP (draft)

Status: draft. Belum dikonfirmasi user. Belum ada data perusahaan prospek yang dikumpulkan dari sumber nyata.

## Seller 1: Harborline Electrical Supply (fiktif)

- Lokasi: metro NY/NJ, US.
- Bisnis: distributor industri peralatan listrik.
- Produk: standby generator, switchboard, panelboard, transformer, cable tray, automatic transfer switch (ATS).
- Pembeli: general contractor, fasilitas industri, dan pembangun gudang komersial.
- Mata uang: USD, integer cents (D13).
- Bahasa teks: English.

## ICP draft untuk Harborline

Kriteria yang bisa dicek. Nilai yang belum diisi perlu keputusan user.

| Kriteria | Nilai | Status |
|---|---|---|
| Segmen | NAICS 236 (bangunan), 238 (specialty trade). Contoh 238210: electrical contractors. | Acuan, cek di census.gov |
| Peran | General contractor, electrical contractor, industrial owner atau developer, pembangun gudang komersial | Dari README |
| Region | NY dan NJ (metro), lalu US | Draft |
| Ukuran perusahaan | Belum diisi | Perlu user |
| Jenis event yang relevan | Permit bangunan komersial atau industri, perluasan fasilitas, kontrak proyek baru, lowongan teknisi listrik | Usulan asisten |

## Usulan pemetaan sinyal ke alasan beli (per seller, bukan hardcoded)

| Sinyal | Alasan beli | Produk yang relevan |
|---|---|---|
| Permit bangunan baru atau renovasi | Perlu panel dan switchboard untuk beban baru | Switchboard, panelboard |
| Perluasan fasilitas industri | Perlu cadangan daya | Standby generator, ATS |
| Proyek transmisi atau beban besar | Perlu transformer | Transformer |
| Pemasangan kabel baru | Perlu jalur kabel | Cable tray |

Pemetaan ini usulan asisten dan belum dikonfirmasi user.

## Seller 2: belum dipilih

User bilang demo boleh dua perusahaan. Belum jelas apakah yang kedua seller non-electrical yang hasilnya sengaja tipis, atau prospek tambahan. Lihat `open-questions.md` nomor 4.

## Data perusahaan prospek

Belum ada. Tunggu keputusan real atau sintetis (`open-questions.md` nomor 2) dan pilihan sumber (nomor 1). Jangan mengisi kolom sumber dengan URL yang belum dibuka.
