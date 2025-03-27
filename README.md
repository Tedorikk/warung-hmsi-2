Dibuat oleh: Kelompok Gacor
1. Tedrik Stepanus (H1101231027)
2. Hisyam Al Husaini (H1101231054)
3. Aura Rizkiatul Arsyi (H1101231003)
4. Aulia Dwi Jumarni (H1101231017)

Panduan clone
1. Buka terminal pada komputer, arahkan ke folder laragon/www
2. Jalankan command dibawah untuk clone
`git clone https://github.com/Tedorikk/warung-hmsi-2`
3. Tunggu sampai clone selesai
4. Jalankan command dibawah untuk pindah ke direktori projek `cd warung-hmsi-2`
5. Jalankan command `composer install`
6. Jalankan command `npm install`
7. Jalankan command `npm run build`
8. Buat file .env pada folder root
9. Buka file .env.example pada folder root lalu salin dan tempel semua isinya ke file .env yang sudah dibuat
10. Konfigurasikan database pada .env menyesuaikan konfigurasi MySQL pada komputer masing-masing
11. Jalankan command `php artisan key:generate`
12. Buka aplikasi Laragon pada komputer dan start, tunggu sampai semua server berjalan
13. Jalankan command `php artisan migrate`
14. Jalankan command `php artisan db:seed`
15. Jalankan command `composer run dev`
16. Buka aplikasi pada browser
17. Untuk login sebagai admin gunakan email `hisyam@hmsi.com` dan password `password`
18. Untuk login sebagai user silahkan buat akun baru dengan register
