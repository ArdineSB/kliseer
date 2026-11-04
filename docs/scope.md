# Scope Kliseer (dikunci)

Status: dikunci oleh user, 2 Nov 2026. Salinan dari `kliseer/docs/scope.md`. Kalau ada perubahan, ubah di sini dan catat di `decisions.md`.

Dokumen ini hanya menetapkan segmen perusahaan. Sumber data dan cara mengumpulkan kontak ada di `sources.md`.

## Segmen yang dilayani

Kliseer hanya melayani perusahaan di industri pekerjaan bangunan (building construction) di Amerika Serikat.

**Penjual** (akun yang memakai Kliseer untuk mencari prospek):
- Distributor atau supplier material dan peralatan untuk proyek bangunan, misalnya peralatan listrik, switchboard, generator, dan kabel tray.
- Demo memakai Harborline Electrical Supply (fiktif, sesuai D13).

**Prospek** (akun yang dicari):
- General contractor.
- Specialty trade contractor, misalnya listrik, mekanikal, dan plumbing.
- System integrator yang memasang peralatan bangunan.
- Pemilik atau developer yang membeli peralatan langsung untuk proyek bangunan komersial, industri, atau institusional.

Kode industri acuan: NAICS 236 (construction of buildings) dan 238 (specialty trade contractors). Untuk sisi penjual, cek kode grosir yang relevan di census.gov sebelum dipakai di UI.

## Di luar scope

- Pekerjaan sipil dan konstruksi berat: jalan, jembatan, bendungan, dan pipa (NAICS 237).
- Industri non-bangunan, misalnya software, manufaktur umum, ritel, dan jasa keuangan. Berlaku untuk penjual maupun prospek.
- Pasar di luar Amerika Serikat.
- Area Track 2 lain (finance, HR, support), ERPNext sungguhan, dan pengiriman email nyata.

## Perilaku produk di batas scope

- Perusahaan di luar segmen ditandai "di luar scope Kliseer". Perusahaan itu tidak diberi skor ICP atau tier, dan tidak masuk daftar prospek.
- Perusahaan dalam segmen tanpa sinyal dari sumber yang tersambung diberi status `unknown` dengan pesan "tidak ada sinyal dari sumber yang tersambung". Tidak ada hasil yang dikarang.

## Asumsi yang sudah dikonfirmasi user

1. Rumah tinggal (residential) masuk pekerjaan bangunan, tapi tidak dipakai di demo. User menjawab "ya gapapa" pada 3 Nov.
2. Kode NAICS adalah acuan, bukan filter. Filter di kode belum dibuat.
