# Company Profile Website

Sebuah website modern untuk profil perusahaan dan promosi produk dengan panel admin terintegrasi.

## Fitur Utama

- **Desain Responsif**: Tampilan yang optimal di berbagai perangkat (desktop, tablet, mobile)
- **Panel Admin**: Pengelolaan konten untuk semua bagian website
- **Autentikasi**: Sistem login dan register untuk admin
- **Database**: Penyimpanan data menggunakan PostgreSQL (Supabase)
- **Dark/Light Mode**: Pilihan tema sesuai preferensi pengguna

## Cara Penggunaan

1. Salin `.env.example` ke `.env` dan isi dengan kredensial Supabase Anda
2. Install dependensi: `npm install`
3. Jalankan migrasi database: `npm run db:push`
4. Jalankan server: `npm run dev`
5. Akses website di browser: `http://localhost:5000`

## Akses Admin

Untuk mengakses panel admin:

1. Klik link "Admin" di footer website
2. Register akun admin baru jika belum memiliki akun
3. Login dengan kredensial admin
4. Kelola konten website melalui panel admin

## Struktur Halaman

- Home - Beranda utama
- About - Tentang perusahaan
- Services - Layanan yang ditawarkan
- Products - Produk yang tersedia
- Portfolio - Portofolio proyek
- Team - Tim perusahaan
- Contact - Formulir kontak
- FAQ - Pertanyaan umum

## Konfigurasi Supabase

Untuk menggunakan Supabase sebagai database:

1. Buat proyek di [Supabase Dashboard](https://supabase.com/dashboard)
2. Ambil URL koneksi database dari bagian Settings > Database
3. Salin Connection String dan tambahkan ke file .env:
   `DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.example.supabase.co:6543/postgres?pgbouncer=true`
4. Ganti [YOUR-PASSWORD] dengan password database yang Anda set untuk proyek

## Teknologi

- Frontend: React.js, TailwindCSS, Shadcn UI
- Backend: Express.js, PostgreSQL
- ORM: Drizzle
- Authentication: Passport.js