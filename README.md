# Job Tracker - Frontend

Aplikasi web untuk melacak lamaran pekerjaan: mulai dari wishlist, proses interview, hingga status diterima/ditolak. Dibangun dengan React + Vite, dilengkapi dashboard visual, manajemen daftar lamaran, dan autentikasi pengguna.

Backend terkait: [job-tracker-backend](https://github.com/mateusapsitumorang/job-tracker-backend)

## Fitur

- Autentikasi pengguna: registrasi, login, lupa password, reset password
- Dashboard dengan visualisasi data (grafik menggunakan Recharts)
- Manajemen lamaran kerja: tambah, edit, hapus, dan ubah status lamaran
- Status lamaran lengkap: Wishlist, Sudah Melamar, Menunggu Review, Assessment, Interview HR, Interview User, Interview Final, Offer, Ditolak, Diterima, Dibatalkan
- Ekspor data ke Excel (`xlsx`)
- Halaman terproteksi (private route) untuk pengguna yang sudah login
- Animasi transisi halaman menggunakan Framer Motion
- Auto-refresh access token (axios interceptor) saat token kedaluwarsa

## Tech Stack

| Layer            | Teknologi              |
|-------------------|--------------------------|
| Library UI       | React 18                |
| Build Tool       | Vite                    |
| Routing          | React Router DOM        |
| HTTP Client      | Axios                   |
| Animasi          | Framer Motion           |
| Grafik/Chart     | Recharts                |
| Ekspor Excel     | SheetJS (`xlsx`)        |
| Deployment       | Vercel                  |

## Struktur Proyek

```
job-tracker-frontend/
├── public/
│   └── JT-Logo.webp
├── src/
│   ├── api/
│   │   └── axios.js            # Konfigurasi axios + auto-refresh token
│   ├── assets/                 # Aset gambar/statis
│   ├── components/
│   │   ├── ApplicationForm.jsx
│   │   ├── ApplicationList.jsx
│   │   ├── CustomStatusSelect.jsx
│   │   ├── Layout.jsx
│   │   ├── PageLoader.jsx
│   │   └── PrivateRoute.jsx    # Wrapper rute yang butuh autentikasi
│   ├── context/
│   │   └── AuthContext.jsx     # State autentikasi global
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgetPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── Dashboard.jsx
│   │   └── Applications.jsx
│   ├── constants.js             # Daftar status lamaran & label
│   ├── styles.css
│   ├── App.jsx                  # Definisi routing & animasi transisi halaman
│   └── main.jsx                 # Entry point React
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

## Instalasi & Menjalankan Secara Lokal

### Prasyarat
- Node.js 18+
- Backend [job-tracker-backend](https://github.com/mateusapsitumorang/job-tracker-backend) sudah berjalan (lokal atau remote)

### Langkah-langkah

1. Clone repository dan masuk ke folder proyek:
   ```bash
   git clone https://github.com/mateusapsitumorang/job-tracker-frontend.git
   cd job-tracker-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Buat file `.env` di root proyek:
   ```env
   VITE_API_URL=http://localhost:4000/api
   ```
   Sesuaikan nilai `VITE_API_URL` dengan alamat API backend yang digunakan.

4. Jalankan server development:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173` (default port Vite).

### Build untuk Produksi

```bash
npm run build
```

Hasil build akan berada di folder `dist/`. Untuk melihat preview hasil build secara lokal:

```bash
npm run preview
```

## Routing

| Path                | Halaman              | Akses     |
|----------------------|----------------------|-----------|
| `/login`             | Login                | Publik    |
| `/register`          | Registrasi           | Publik    |
| `/lupa-password`     | Lupa Password        | Publik    |
| `/reset-password`    | Reset Password       | Publik    |
| `/dashboard`         | Dashboard            | Privat    |
| `/applications`      | Daftar Lamaran       | Privat    |

Halaman privat dilindungi oleh komponen `PrivateRoute`, yang akan mengarahkan pengguna belum login ke halaman `/login`.

## Autentikasi

Aplikasi menggunakan access token (disimpan di memori, bukan localStorage) dan refresh token (HTTP-only cookie dari backend). Axios interceptor pada `src/api/axios.js` akan otomatis memanggil endpoint `/auth/refresh` saat menerima respons `401`, lalu mengulang request yang gagal dengan token baru. Jika refresh gagal, pengguna akan diarahkan kembali ke halaman login.

## Environment Variables

| Variabel        | Deskripsi                                   | Contoh                          |
|-------------------|------------------------------------------------|----------------------------------|
| `VITE_API_URL`   | Base URL API backend                         | `http://localhost:4000/api`     |

## Deployment

Proyek ini dikonfigurasi untuk deploy ke **Vercel** (lihat `vercel.json`). Pastikan environment variable `VITE_API_URL` diarahkan ke URL backend production sebelum melakukan deploy.

## Lisensi

Copyright (c) 2026 Mateus Appuwan Situmorang

Seluruh hak cipta atas proyek ini dimiliki oleh Mateus Appuwan Situmorang.

Proyek ini dibuat untuk keperluan pembelajaran dan portofolio pribadi. Anda diperbolehkan melihat, mempelajari, dan menggunakan kode sebagai referensi untuk tujuan pendidikan.

Tanpa izin tertulis dari pemilik hak cipta, Anda tidak diperbolehkan:

* Menyalin dan mendistribusikan proyek ini secara utuh maupun sebagian untuk tujuan komersial.
* Mengklaim proyek ini sebagai karya sendiri.
* Menjual kembali atau menggunakan proyek ini sebagai bagian dari produk komersial.

Apabila Anda ingin menggunakan proyek ini untuk tujuan di luar pembelajaran atau portofolio, silakan meminta izin terlebih dahulu kepada pemilik hak cipta.

Dengan menggunakan proyek ini, Anda dianggap memahami dan menyetujui ketentuan lisensi ini.
