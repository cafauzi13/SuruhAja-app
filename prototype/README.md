# Prototipe SuruhAja

Prototipe clickable untuk demo dua jalur pemesanan SuruhAja. Seluruh data dan interaksi berjalan lokal di browser; tidak ada autentikasi atau pembayaran sungguhan.

## Menjalankan

```sh
npm install
npm run dev
```

Buka URL lokal yang ditampilkan Vite. Untuk memeriksa build produksi:

```sh
npm run build
```

## Link Demo

GitHub Actions menerbitkan prototipe ke [cafauzi13.github.io/SuruhAja-app](https://cafauzi13.github.io/SuruhAja-app/) setiap ada push ke `main` yang mengubah folder `prototype/`. Aktifkan sekali di **Repository Settings → Pages → Build and deployment → Source: GitHub Actions**, karena token Actions tidak punya izin untuk membuat Pages site pada repo ini.

Di desktop, aplikasi tampil di bingkai ponsel 390 x 844. Pada layar selebar 430 px atau kurang, aplikasi memenuhi layar. Tombol **Demo · Pelanggan / Runner** di header adalah pengalih peran presentasi.

Negosiasi permintaan memiliki batas waktu demo 5 menit dan maksimal 3 putaran.

## Identitas visual

- Hijau SuruhAja `#0E6B45` untuk aksi utama dan navigasi.
- Hijau gelap `#083F2D` untuk bidang utama.
- Kuning `#EDB938` sebagai aksen, dengan kategori jasa berikon warna berbeda.
- Plus Jakarta Sans untuk teks dan Space Grotesk untuk heading.

## Rute

| Rute | Layar |
| --- | --- |
| `/masuk` | Masuk / daftar demo |
| `/` | Beranda pelanggan |
| `/profil` | Profil dan perpindahan mode pelanggan / runner |
| `/aktivitas` | Aktivitas terbaru dan riwayat |
| `/pesan` | Kotak Masuk pelanggan dan runner |
| `/buat` | Tulis permintaan dan lokasi |
| `/buat/waktu` | Pilih waktu segera atau terjadwal |
| `/buat/bayaran` | Tarif acuan dan penawaran pelanggan |
| `/pesanan/:id/menunggu` | Pencarian runner dan hitung mundur |
| `/pesanan/:id/negosiasi` | Penawaran harga, maksimal 3 putaran |
| `/katalog` | Daftar jasa katalog |
| `/katalog/:id` | Detail jasa dan pemesanan harga tetap |
| `/pesanan` | Daftar pesanan |
| `/pesanan/:id` | Detail, progres, dan status escrow |
| `/pesanan/:id/chat` | Chat dan riwayat penawaran pesanan |
| `/pesanan/:id/konfirmasi` | Bukti selesai, konfirmasi, dan rating |
| `/runner` | Dashboard dan status kesiapan runner |
| `/runner/tawaran` | Daftar tawaran tugas mendadak |
| `/runner/tawaran/:id` | Detail tawaran dan respons runner |
| `/runner/katalog` | Katalog Saya: tambah, edit, hapus, dan buka/tutup per jasa |