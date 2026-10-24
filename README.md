# SuruhAja

Aplikasi jasa suruh yang mempertemukan kebutuhan harian masyarakat dengan runner terverifikasi di sekitarnya.

Proyek mata kuliah **Kewirausahaan Berbasis Teknologi** — Departemen Sistem Informasi, Institut Teknologi Sepuluh Nopember.

---

## Tentang

Urusan kecil sehari-hari seperti mengambil paket, mencetak dokumen, membersihkan kos, atau mengganti lampu sering tertunda karena keterbatasan waktu, alat, atau kenalan yang bisa dimintai tolong. Di sisi lain banyak mahasiswa dan pekerja paruh waktu yang punya waktu luang dan ingin penghasilan tambahan.

Kebutuhan ini sudah dipertemukan secara informal lewat akun jasa suruh di media sosial, tetapi tarifnya tidak seragam dan penyedianya tidak terverifikasi. SuruhAja merapikan hal itu: tarif punya acuan, identitas runner diverifikasi, dan pembayaran ditahan sistem sampai tugas dikonfirmasi selesai.

**Dua cara pesanan terbentuk:**

- **Permintaan** — pelanggan menulis kebutuhan, sistem memberi tarif acuan, runner dapat mengajukan penawaran balik maksimal tiga putaran.
- **Katalog** — runner memasang jasanya lebih dulu dengan harga tetap, pelanggan memesan langsung tanpa negosiasi.

Keduanya bertemu di alur penyelesaian yang sama: escrow, pengerjaan, bukti penyelesaian, konfirmasi, pencairan dana, rating.

---

## Status

| Tahap                                | Status                    |
| ------------------------------------ | ------------------------- |
| Riset dan analisis masalah           | Selesai                   |
| Desain alur dan arsitektur informasi | Selesai, menunggu ACC tim |
| Prototipe *clickable*              | Belum mulai               |
| Laporan Tugas 1                      | Draf                      |

---

## Dokumentasi

| Dokumen                                                                       | Isi                                                                              |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [`docs/01-konsep-dan-aturan.md`](docs/01-konsep-dan-aturan.md)               | Konsep dua jalur, aturan negosiasi, waktu tunggu, dan status ketersediaan runner |
| [`docs/02-user-flow.md`](docs/02-user-flow.md)                               | Alur pelanggan, alur runner, dan urutan negosiasi harga                          |
| [`docs/03-information-architecture.md`](docs/03-information-architecture.md) | Peta layar aplikasi dan daftar layar untuk prototipe                             |
| [`docs/04-keputusan-terbuka.md`](docs/04-keputusan-terbuka.md)               | Hal yang masih perlu diputuskan tim                                              |
| [`docs/05-prompt-prototipe.md`](docs/05-prompt-prototipe.md)                 | Prompt untuk membangun prototipe                                                 |

Semua diagram ditulis dengan Mermaid dan terender otomatis di GitHub.

---

## Struktur repositori

```
.
├── README.md
├── docs/
│   ├── 01-konsep-dan-aturan.md
│   ├── 02-user-flow.md
│   ├── 03-information-architecture.md
│   ├── 04-keputusan-terbuka.md
│   └── 05-prompt-prototipe.md
└── prototype/              # menyusul
```

---

## Menjalankan prototipe

Belum tersedia. Bagian ini akan diisi setelah prototipe dibuat.

---

## Tim

| Nama                     | NRP        |
| ------------------------ | ---------- |
| Lailatul Fitaliqoh       | 5026231229 |
| Annisa Nur Fauzi         | 5026231228 |
| Harbima Razan Adhitya    | 5026231225 |
| Rahmadhona Elokpribadi K | 5026231217 |

**Dosen pengampu:** Dr. Ir. Niniek Fajar Puspita, M.Eng.

---

## Catatan

Repositori ini berisi dokumen desain dan prototipe untuk keperluan akademik. Angka pasar, tarif, dan parameter operasional di dalamnya sebagian masih berupa asumsi yang perlu divalidasi melalui survei, dan ditandai secara eksplisit di masing-masing dokumen.
