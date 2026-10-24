# User Flow

Pembaruan terakhir: 24 Oktober 2026

Notasi mengikuti konvensi flowchart baku: `([...])` terminator, `[...]` proses, `{...}` keputusan, `[/.../]` input dari pengguna.

---

## 1. Alur Pelanggan

```mermaid
flowchart TD
    A([Beranda]) --> B{Cara memesan}

    B -- "Pasang permintaan" --> C[/Tulis kebutuhan dan lokasi/]
    C --> D{Jenis waktu}
    D -- "Butuh segera" --> E[Tenggat: secepatnya]
    D -- "Terjadwal" --> F[/Pilih tanggal dan jam/]
    E --> G[Sistem klasifikasi tugas dan tampilkan tarif acuan]
    F --> G
    G --> H[/Ajukan bayaran/]
    H --> I[Kirim ke satu runner terdekat]

    I --> J{Respons runner}
    J -- "Lewati atau tidak merespons" --> K{Ada runner lain?}
    K -- Ya --> I
    K -- Tidak --> L([Permintaan kedaluwarsa])
    J -- "Mengajukan penawaran balik" --> M[Negosiasi maksimal 3 putaran]
    M --> N{Sepakat?}
    N -- Tidak --> K
    N -- Ya --> Z
    J -- "Menerima bayaran" --> Z[Harga disepakati]

    B -- "Pilih dari katalog" --> P[Telusuri katalog jasa runner]
    P --> Q[/Pilih jasa dan usulkan waktu/]
    Q --> R[Harga tetap sesuai katalog, tanpa negosiasi]
    R --> S[Kirim pesanan ke runner]
    S --> T{Runner mengonfirmasi?}
    T -- Tidak --> P
    T -- Ya --> Z

    Z --> AA["Pembayaran ditahan sistem (escrow)"]
    AA --> AB[Pantau progres dan bagikan status ke kontak terpercaya]
    AB --> AC[Runner mengunggah bukti penyelesaian]
    AC --> AD{Hasil sesuai?}

    AD -- Tidak --> AE[Ajukan sengketa]
    AE --> AF[Admin menengahi]
    AF --> AG{Keputusan admin}
    AG -- "Dana ke runner" --> AH
    AG -- "Dana dikembalikan" --> AI([Dana kembali ke pelanggan])

    AD -- Ya --> AH[Escrow dilepas ke runner, komisi dipotong]
    AH --> AJ[Rating dua arah]
    AJ --> AK([Pesanan masuk riwayat])
```

---

## 2. Alur Negosiasi — maksimal 3 putaran

Hanya berlaku untuk Jalur A. Pesanan dari katalog memakai harga tetap.

```mermaid
sequenceDiagram
    autonumber
    participant P as Pelanggan
    participant S as Sistem
    participant R as Runner

    P->>S: Kirim permintaan tugas
    S->>S: Klasifikasi jenis tugas
    S-->>P: Tampilkan tarif acuan
    P->>S: Ajukan bayaran awal
    S->>R: Teruskan ke satu runner terdekat

    alt Runner langsung menerima
        R-->>S: Terima bayaran
        S-->>P: Harga disepakati
    else Putaran 1 — runner menawar
        R->>S: Penawaran balik
        S-->>P: Tampilkan harga runner

        alt Pelanggan setuju
            P-->>S: Setuju
        else Putaran 2 — pelanggan menawar
            P->>S: Harga balasan
            S-->>R: Tampilkan harga pelanggan

            alt Runner setuju
                R-->>S: Setuju
            else Putaran 3 — penawaran final runner
                R->>S: Penawaran final
                S-->>P: Harga final, tidak dapat ditawar lagi
                P-->>S: Terima atau tolak
            end
        end
    end

    Note over P,R: Bila tidak sepakat, permintaan diteruskan ke runner berikutnya
```

---

## 3. Alur Runner

```mermaid
flowchart TD
    A([Masuk ke akun]) --> B[Aktifkan mode runner]
    B --> C[/Unggah KTM atau KTP dan swafoto/]
    C --> D{Verifikasi disetujui?}
    D -- Tidak --> E[Perbaiki data]
    E --> C
    D -- Ya --> F([Dasbor runner])

    F --> G["Nyalakan status kesiapan (aktif/nonaktif)"]
    F --> H[Kelola katalog jasa]
    H --> H1[/Tambah jasa: nama, deskripsi, harga, durasi/]
    H1 --> H2["Buka atau tutup layanan per jasa"]

    G --> I[Terima tawaran tugas mendadak]
    I --> J{Tanggapan}
    J -- "Lewati" --> I
    J -- "Ajukan penawaran balik" --> K[Negosiasi maksimal 3 putaran]
    K --> L{Sepakat?}
    L -- Tidak --> I
    L -- Ya --> P
    J -- "Terima bayaran" --> P

    H2 --> M[Pesanan terjadwal masuk dari katalog]
    M --> N{Waktu yang diusulkan bisa diambil?}
    N -- Tidak --> O[Tolak pesanan, katalog tetap terbuka]
    O --> M
    N -- Ya --> P[Tugas masuk jadwal, waktu terkunci otomatis]

    P --> Q["Dana pelanggan ditahan di escrow"]
    Q --> R[Jalankan tugas dan perbarui progres]
    R --> S[Unggah bukti penyelesaian]
    S --> T{Pelanggan mengonfirmasi?}

    T -- "Disengketakan" --> U[Admin menengahi]
    U --> V{Keputusan admin}
    V -- "Menguntungkan runner" --> W
    V -- "Menguntungkan pelanggan" --> X([Dana dikembalikan ke pelanggan])

    T -- Ya --> W[Dana masuk saldo, dikurangi komisi]
    W --> Y[Terima rating, skor kepercayaan diperbarui]
    Y --> F
```
