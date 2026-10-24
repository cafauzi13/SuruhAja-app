# Prompt untuk Membangun Prototipe

Jalankan Claude Code **di dalam repositori ini** supaya ia bisa membaca `docs/`, lalu tempelkan prompt di bawah.

---

## Prompt

```
Bangun prototipe clickable aplikasi SuruhAja di folder `prototype/` pada repositori ini.

## Baca dulu

Sebelum menulis kode, baca tiga dokumen ini dan ikuti isinya sebagai spesifikasi:
- docs/01-konsep-dan-aturan.md — konsep dua jalur pemesanan, aturan negosiasi, status ketersediaan runner
- docs/02-user-flow.md — alur pelanggan, alur runner, urutan negosiasi harga
- docs/03-information-architecture.md — peta layar dan daftar 14 layar prototipe

Kalau ada yang bertentangan antara dokumen dan prompt ini, prompt ini yang menang.

## Tujuan

Prototipe untuk demo presentasi mata kuliah. Bukan produk jadi. Yang penting alurnya
bisa diklik dari awal sampai akhir, bukan kelengkapan fiturnya.

## Teknologi

- React + Vite + TypeScript
- Tailwind CSS untuk styling
- react-router-dom untuk navigasi antar layar
- lucide-react untuk ikon
- Tanpa backend. Semua data tiruan ditaruh di `src/data/` sebagai file TypeScript biasa.
- State aplikasi cukup React Context, tidak perlu library state management.

## Dimensi — ini bagian paling penting

Produk akhirnya adalah aplikasi ponsel, jadi prototipe harus terlihat seperti
aplikasi ponsel, bukan situs web yang dikecilkan.

- Rancang pada ukuran dasar 390 x 844 piksel (iPhone 14/15).
- Di layar lebar (desktop), tampilkan aplikasi di tengah dalam bingkai ponsel:
  lebar maksimum 390px, tinggi 844px, sudut membulat sekitar 2.5rem, ada bayangan,
  `overflow: hidden`, dan latar halaman di luar bingkai berwarna abu-abu netral.
- Di layar sempit (lebar <= 430px), aplikasi memenuhi layar tanpa bingkai.
- Pakai satuan `dvh`, bukan `vh`, supaya tidak terpotong di browser ponsel.
- Header menempel di atas, tinggi 56px.
- Navigasi bawah menempel di bawah, tinggi 64px.
- Area konten di antara keduanya yang bisa digulir, bukan seluruh halaman.
- Tidak boleh ada gulir horizontal di lebar berapa pun.
- Target sentuh minimal 44x44px.
- Ukuran teks dasar 15-16px, jangan ada teks di bawah 12px.

## Warna dan gaya

```
--hijau-tua   #0E6B57   warna utama, tombol primer, header
--hijau       #2E9E86   aksen, ikon aktif
--hijau-muda  #BFE5DA   latar lingkaran ikon, chip
--hijau-pucat #E9F6F2   latar kartu
--oranye      #C77F1A   status negosiasi dan peringatan
--teks        #1F2937
--teks-redup  #4B5A57
--latar       #F4FBF8
```

Gaya visual: bersih, kartu bersudut membulat, bayangan tipis, banyak ruang kosong.
Jangan memakai gradien mencolok atau animasi berlebihan.

## Layar yang dibuat

Buat 14 layar sesuai daftar di docs/03-information-architecture.md, dengan rute:

Pelanggan
- /masuk                      Masuk / Daftar (satu layar, OTP cukup tombol lanjut)
- /                           Beranda: katalog jasa, kategori tugas cepat, pesanan berjalan
- /buat                       Buat permintaan: deskripsi tugas dan lokasi
- /buat/waktu                 Pilih jenis waktu: butuh segera atau terjadwal
- /buat/bayaran               Tarif acuan dari sistem, pelanggan mengajukan bayaran
- /pesanan/:id/menunggu       Menunggu runner, dengan hitung mundur
- /pesanan/:id/negosiasi      Penawaran balik masuk, tampilkan putaran ke berapa
- /katalog                    Telusuri katalog jasa runner
- /katalog/:id                Detail jasa, pilih waktu, pesan dengan harga tetap
- /pesanan                    Daftar pesanan
- /pesanan/:id                Detail pesanan dan pelacakan
- /pesanan/:id/konfirmasi     Lihat bukti penyelesaian, konfirmasi, beri rating

Runner
- /runner                     Dasbor runner, sakelar status kesiapan
- /runner/tawaran             Daftar tawaran tugas mendadak yang masuk
- /runner/tawaran/:id         Detail tawaran, terima atau ajukan penawaran balik
- /runner/katalog             Katalog Saya, sakelar buka/tutup per jasa

## Perilaku yang harus benar

1. Negosiasi maksimal 3 putaran, urutannya runner, lalu pelanggan, lalu runner.
   Setiap layar negosiasi harus menampilkan "Putaran N dari 3".
   Di putaran ke-3 tulis jelas bahwa harga sudah final dan tidak bisa ditawar lagi.
   Pesanan dari katalog tidak punya negosiasi sama sekali.

2. Dua sakelar ketersediaan runner yang terpisah dan saling bebas:
   - Status kesiapan di /runner: aktif atau nonaktif, mengatur tugas mendadak.
   - Status katalog di /runner/katalog: buka atau tutup, per jasa, mengatur pesanan terjadwal.
   Keduanya harus bisa dinyalakan dan dimatikan, dan efeknya terlihat.
   Kalau status kesiapan nonaktif, daftar tawaran kosong dengan pesan yang jelas.

3. Layar menunggu runner menampilkan hitung mundur 10 menit untuk pesanan mendadak.
   Supaya enak didemokan, sediakan tombol kecil "percepat" yang melompatkan waktu.

4. Pembayaran ditahan sistem setelah harga disepakati. Tampilkan status escrow
   di detail pesanan, dan dana baru berpindah setelah pelanggan mengonfirmasi.

5. Sediakan pengalih peran di pojok layar untuk keperluan demo, agar bisa berpindah
   antara tampilan pelanggan dan runner tanpa keluar-masuk akun. Beri label jelas
   bahwa ini alat bantu demo, bukan fitur produk.

## Data tiruan

Siapkan di `src/data/`:
- 6 sampai 8 jasa katalog dengan spesialisasi berbeda, misalnya survei kos,
  bersih-bersih kamar, titip beli, antar jemput dokumen, cetak dan fotokopi.
  Setiap jasa punya nama runner, harga tetap, durasi, rating, dan status buka/tutup.
- 4 sampai 5 runner dengan nama, foto berupa inisial, rating, skor kepercayaan,
  jarak, dan status terverifikasi.
- 3 pesanan contoh dengan status berbeda: menunggu runner, sedang dikerjakan, selesai.
- Harga pakai format rupiah Indonesia, kisaran Rp10.000 sampai Rp75.000.
- Nama orang dan lokasi pakai konteks Surabaya, misalnya Keputih, Gebang, Mulyosari.

## Di luar lingkup

Jangan dibuat:
- Autentikasi sungguhan, OTP sungguhan, atau basis data
- Pembayaran sungguhan atau integrasi payment gateway
- Peta sungguhan. Pakai gambar statis atau kotak berwarna dengan penanda sederhana.
- Fitur chat yang berfungsi. Cukup layar contoh berisi beberapa pesan tiruan.
- Klasifikasi tugas dengan AI sungguhan. Tarif acuan cukup dihitung dari tabel
  harga per kategori di data tiruan.
- Alur sengketa, riwayat lengkap, dan verifikasi identitas sebagai layar interaktif.

## Selesai kalau

- `npm install` lalu `npm run dev` jalan tanpa galat.
- Kedua jalur pemesanan bisa diklik dari awal sampai selesai:
  jalur permintaan dengan negosiasi, dan jalur katalog dengan harga tetap.
- Semua rute di atas bisa dibuka dan tidak ada layar kosong.
- Di lebar 390px tidak ada gulir horizontal dan tidak ada teks terpotong.
- Di desktop aplikasi tampil dalam bingkai ponsel di tengah layar.
- Tambahkan `prototype/README.md` berisi cara menjalankan dan daftar rute.

Kerjakan bertahap: siapkan kerangka proyek dan tata letak ponsel dulu, pastikan
bingkainya benar, baru isi layar satu per satu.
```

---

## Setelah prototipe jadi

- Perbarui bagian **Menjalankan prototipe** di `README.md`
- Tangkap layar tiap tahapan untuk lampiran laporan
- Catat perbedaan antara prototipe dan dokumen desain di `docs/04-keputusan-terbuka.md`
