# SuruhAja — User Flow & Information Architecture

Dokumen kerja untuk diskusi tim sebelum pembuatan prototipe.
Aplikasi jasa suruh berbasis AI yang mempertemukan kebutuhan harian dengan runner terverifikasi di sekitar pengguna.

**Status:** draf — menunggu ACC tim
**Mata kuliah:** Kewirausahaan Berbasis Teknologi — Departemen Sistem Informasi ITS
**Tim:** Annisa Nur Fauzi · Lailatul Fitaliqoh · Harbima Razan Adhitya · Rahmadhona Elokpribadi K

---

## Keputusan yang sudah diambil

| Topik       | Keputusan                                                                                                                                              | Acuan              |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| Skema harga | Sistem memberi **tarif acuan**, pelanggan mengajukan bayaran awal, runner dapat **mengajukan penawaran balik** hingga tercapai kesepakatan | Laporan subbab 3.1 |
| Pembayaran  | Ditahan sistem (*escrow*) setelah harga disepakati, dilepas setelah pelanggan mengonfirmasi                                                          | Laporan subbab 3.2 |
| Verifikasi  | Wajib untuk runner sebelum dapat menerima tugas                                                                                                        | Laporan subbab 3.2 |

> **Catatan untuk revisi laporan.** Subbab 3.2 saat ini masih menyatakan "harga tidak lagi dinegosiasikan secara personal". Kalimat itu bertentangan dengan skema 3.1 yang kita pakai, jadi perlu diselaraskan. Framing yang bisa dipakai: negosiasi tetap ada, tetapi berlangsung **di dalam sistem dengan harga acuan sebagai jangkar**, bukan tawar-menawar personal lewat chat pribadi. Rasa sungkan runner berkurang karena ada angka acuan yang netral, bukan karena negosiasinya dihapus.

---

## 1. User Flow — Sisi Pelanggan

```mermaid
flowchart TD
    A([Buka aplikasi]) --> B{Sudah punya akun?}
    B -- Belum --> C["Daftar (nomor HP + OTP)"]
    C --> D[Lengkapi profil dasar]
    D --> E[Beranda]
    B -- Sudah --> E

    E --> F[/Tulis kebutuhan, lokasi, dan tenggat/]
    F --> G[Sistem mengklasifikasikan jenis tugas]
    G --> H[Tampilkan tarif acuan]
    H --> I[/Ajukan bayaran awal/]
    I --> J[Kirim permintaan ke runner di radius terdekat]

    J --> K{Tanggapan runner}
    K -- "Tidak ada sampai tenggat" --> L{Lanjutkan?}
    L -- "Naikkan bayaran" --> I
    L -- "Batalkan" --> M([Permintaan dibatalkan])

    K -- "Menerima bayaran" --> R[Harga disepakati]
    K -- "Mengajukan penawaran balik" --> N{Setuju harga runner?}
    N -- "Setuju" --> R
    N -- "Tawar lagi" --> O[/Kirim harga balasan/]
    O --> K
    N -- "Tolak" --> P[Cari runner lain]
    P --> J

    R --> S["Pembayaran ditahan sistem (escrow)"]
    S --> T[Pantau progres dan bagikan status ke kontak terpercaya]
    T --> U[Runner mengunggah bukti penyelesaian]

    U --> V{Hasil sesuai?}
    V -- Tidak --> W[Ajukan sengketa]
    W --> X[Admin menengahi]
    X --> Y{Keputusan admin}
    Y -- "Dana ke runner" --> Z
    Y -- "Dana dikembalikan" --> AA([Dana kembali ke pelanggan])

    V -- Ya --> Z[Escrow dilepas ke runner, komisi dipotong]
    Z --> AB[Rating dua arah]
    AB --> AC([Pesanan masuk riwayat])
```

---

## 2. User Flow — Sisi Runner

```mermaid
flowchart TD
    A([Masuk ke akun]) --> B[Aktifkan mode runner]
    B --> C[/Unggah KTM atau KTP dan swafoto/]
    C --> D{Verifikasi disetujui?}
    D -- Tidak --> E[Perbaiki data]
    E --> C

    D -- Ya --> F[Atur status ketersediaan]
    F --> G[Terima notifikasi tawaran terdekat]
    G --> H[Lihat detail tugas, jarak, tenggat, dan bayaran]

    H --> I{Tanggapan}
    I -- "Lewati" --> J[Tawaran diteruskan ke runner lain]
    J --> G
    I -- "Ajukan penawaran balik" --> K[/Kirim harga usulan/]
    K --> L{Pelanggan setuju?}
    L -- "Tidak, dibatalkan" --> G
    L -- "Tawar balik" --> I
    L -- "Setuju" --> M[Harga disepakati]
    I -- "Terima bayaran" --> M

    M --> N["Dana pelanggan masuk escrow"]
    N --> O[Konfirmasi detail ke pelanggan]
    O --> P[Jalankan tugas dan perbarui progres]
    P --> Q[Unggah bukti penyelesaian]

    Q --> R{Pelanggan mengonfirmasi?}
    R -- "Disengketakan" --> S[Admin menengahi]
    S --> T{Keputusan admin}
    T -- "Menguntungkan runner" --> U
    T -- "Menguntungkan pelanggan" --> V([Dana dikembalikan ke pelanggan])

    R -- Ya --> U[Dana masuk saldo, dikurangi komisi]
    U --> W[Terima rating dari pelanggan]
    W --> X[Skor kepercayaan diperbarui]
    X --> Y([Prioritas tawaran bertambah])
```

---

## 3. Information Architecture

```mermaid
flowchart LR
    APP(("SuruhAja"))

    APP --> A["1. Autentikasi"]
    A --> A1["Masuk (HP + OTP)"]
    A --> A2["Daftar akun"]
    A --> A3["Lengkapi profil"]
    A --> A4["Verifikasi identitas (runner)"]

    APP --> B["2. Beranda"]
    B --> B1["Kategori tugas cepat"]
    B --> B2["Permintaan sedang berjalan"]
    B --> B3["Runner aktif di sekitar"]
    B --> B4["Pencarian"]

    APP --> C["3. Buat Permintaan"]
    C --> C1["Deskripsi tugas"]
    C --> C2["Lokasi dan tenggat"]
    C --> C3["Tarif acuan dan bayaran"]
    C --> C4["Preferensi runner"]
    C --> C5["Ringkasan dan kirim"]

    APP --> D["4. Pesanan"]
    D --> D1["Menunggu runner"]
    D --> D2["Penawaran dan negosiasi"]
    D --> D3["Sedang berlangsung"]
    D --> D4["Detail dan pelacakan"]
    D --> D5["Chat pelanggan-runner"]
    D --> D6["Bukti penyelesaian"]
    D --> D7["Riwayat"]

    APP --> E["5. Notifikasi"]
    E --> E1["Tawaran masuk (runner)"]
    E --> E2["Penawaran balik harga"]
    E --> E3["Perubahan status pesanan"]
    E --> E4["Pengingat konfirmasi"]

    APP --> F["6. Akun"]
    F --> F1["Profil dan identitas"]
    F --> F2["Saldo dan metode bayar"]
    F --> F3["Rating dan skor kepercayaan"]
    F --> F4["Mode runner"]
    F --> F5["Bantuan dan sengketa"]
```

**Navigasi bawah:** Beranda · Pesanan · ➕ Buat Permintaan · Notifikasi · Akun

---

## 4. Daftar layar untuk prototipe

Versi lengkap IA berisi sekitar 28 layar. Untuk prototipe *clickable* yang hanya perlu menunjukkan jalur utama, 12 layar berikut sudah memadai.

| No | Layar                        | Sisi      | Catatan                                          |
| -- | ---------------------------- | --------- | ------------------------------------------------ |
| 1  | Masuk / Daftar               | Keduanya  | Cukup satu layar dengan OTP palsu                |
| 2  | Beranda                      | Pelanggan | Kategori tugas + pesanan berjalan                |
| 3  | Buat Permintaan              | Pelanggan | Deskripsi, lokasi, tenggat                       |
| 4  | Tarif acuan & bayaran        | Pelanggan | Layar kunci — tunjukkan angka acuan dari sistem |
| 5  | Menunggu runner              | Pelanggan | Status pencarian                                 |
| 6  | Penawaran balik masuk        | Pelanggan | Layar kunci — tunjukkan alur negosiasi          |
| 7  | Daftar tawaran               | Runner    | Detail tugas, jarak, bayaran                     |
| 8  | Ajukan penawaran balik       | Runner    | Layar kunci — sisi lain dari negosiasi          |
| 9  | Pesanan berjalan & pelacakan | Keduanya  | Peta + status                                    |
| 10 | Unggah bukti penyelesaian    | Runner    |                                                  |
| 11 | Konfirmasi & rating          | Pelanggan |                                                  |
| 12 | Akun & skor kepercayaan      | Runner    | Tunjukkan rekam jejak                            |

Layar sengketa, riwayat, dan verifikasi identitas cukup ditampilkan sebagai gambar statis di laporan, tidak perlu dibuat *clickable*.

---

## 5. Yang perlu di-ACC tim

- [ ] Alur negosiasi: berapa kali maksimal tawar-menawar sebelum permintaan ditutup?
- [ ] Batas waktu menunggu runner sebelum pelanggan diminta menaikkan bayaran
- [ ] Apakah penawaran balik dikirim oleh satu runner saja, atau beberapa runner bersaing sekaligus?
- [ ] Besaran komisi platform dan biaya layanan (masih asumsi di laporan)
- [ ] Revisi kalimat subbab 3.2 agar selaras dengan skema harga 3.1

Setelah poin-poin ini disepakati, prototipe bisa langsung dikerjakan.
