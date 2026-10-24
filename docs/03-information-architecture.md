# Information Architecture

Pembaruan terakhir: 24 Oktober 2026

---

## Peta layar

```mermaid
flowchart LR
    APP(("SuruhAja"))

    APP --> A["1. Autentikasi"]
    A --> A1["Masuk (HP + OTP)"]
    A --> A2["Daftar akun"]
    A --> A3["Lengkapi profil"]
    A --> A4["Verifikasi identitas (runner)"]

    APP --> B["2. Beranda"]
    B --> B1["Katalog jasa runner"]
    B --> B2["Kategori tugas cepat"]
    B --> B3["Pesanan sedang berjalan"]
    B --> B4["Pencarian"]

    APP --> C["3. Buat Permintaan"]
    C --> C1["Deskripsi tugas"]
    C --> C2["Lokasi"]
    C --> C3["Jenis waktu: segera atau terjadwal"]
    C --> C4["Tarif acuan dan bayaran"]
    C --> C5["Preferensi runner"]
    C --> C6["Ringkasan dan kirim"]

    APP --> D["4. Pesanan"]
    D --> D1["Menunggu runner"]
    D --> D2["Negosiasi harga"]
    D --> D3["Sedang berlangsung"]
    D --> D4["Detail dan pelacakan"]
    D --> D5["Chat pelanggan-runner"]
    D --> D6["Bukti penyelesaian"]
    D --> D7["Riwayat"]

    APP --> E["5. Notifikasi"]
    E --> E1["Tawaran masuk (runner)"]
    E --> E2["Penawaran balik harga"]
    E --> E3["Pesanan katalog masuk (runner)"]
    E --> E4["Perubahan status pesanan"]

    APP --> F["6. Katalog Saya (runner)"]
    F --> F1["Daftar jasa yang dipasang"]
    F --> F2["Tambah atau ubah jasa"]
    F --> F3["Sakelar buka atau tutup per jasa"]
    F --> F4["Pesanan terjadwal yang sudah terkunci"]

    APP --> G["7. Akun"]
    G --> G1["Profil dan identitas"]
    G --> G2["Sakelar status kesiapan"]
    G --> G3["Saldo dan metode bayar"]
    G --> G4["Rating dan skor kepercayaan"]
    G --> G5["Mode runner"]
    G --> G6["Bantuan dan sengketa"]
```

**Navigasi bawah:** Beranda · Pesanan · ➕ Buat Permintaan · Notifikasi · Akun

Menu **Katalog Saya** muncul di dalam Akun, hanya bagi pengguna yang mengaktifkan mode runner, supaya tampilan pelanggan biasa tidak ikut ramai.

---

## Daftar layar untuk prototipe

Peta lengkap di atas berisi sekitar 33 layar. Untuk prototipe *clickable*, 14 layar berikut sudah cukup menunjukkan kedua jalur.

| No | Layar | Sisi | Jalur |
|---|---|---|---|
| 1 | Masuk / Daftar | Keduanya | — |
| 2 | Beranda | Pelanggan | Keduanya |
| 3 | Buat Permintaan | Pelanggan | A |
| 4 | Pilih jenis waktu (segera / terjadwal) | Pelanggan | A |
| 5 | Tarif acuan dan bayaran | Pelanggan | A |
| 6 | Menunggu runner | Pelanggan | A |
| 7 | Penawaran balik masuk | Pelanggan | A |
| 8 | Daftar tawaran | Runner | A |
| 9 | Ajukan penawaran balik | Runner | A |
| 10 | Katalog jasa | Pelanggan | B |
| 11 | Detail jasa dan usulkan waktu | Pelanggan | B |
| 12 | Pesanan berjalan dan pelacakan | Keduanya | Keduanya |
| 13 | Unggah bukti dan konfirmasi | Keduanya | Keduanya |
| 14 | Katalog Saya | Runner | B |

Layar sengketa, riwayat, dan verifikasi identitas cukup ditampilkan sebagai gambar statis di laporan, tidak perlu dibuat *clickable*.
