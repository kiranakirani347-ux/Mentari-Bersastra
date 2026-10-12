# Panduan Deployment Next.js + Bootstrap 5 + Supabase ke Vercel

Panduan ini berisi langkah-langkah detail untuk mempublikasikan website blog ke platform Vercel dengan performa tinggi dan zero-downtime.

---

## 1. Persiapan Pra-Deployment

Pastikan build lokal berjalan lancar tanpa error TypeScript atau lint:

```bash
# Uji kompilasi build produksi secara lokal
npm run build
```

Jika pesan `Compiled successfully` muncul, proyek siap dideploy.

---

## 2. Pengaturan Repositori Git

Inisialisasi git dan unggah kode ke repositori GitHub/GitLab:

```bash
git init
git add .
git commit -m "feat: complete modern blog engine"
git branch -M main
git remote add origin https://github.com/username-anda/modern-blog.git
git push -u origin main
```

---

## 3. Menghubungkan ke Vercel

1. Buka dashboard [vercel.com](https://vercel.com) dan masuk dengan akun GitHub Anda.
2. Klik tombol **Add New...** > **Project**.
3. Pilih repositori `modern-blog` yang baru saja Anda buat, lalu klik **Import**.
4. Biarkan pengaturan **Framework Preset** terdeteksi otomatis.

---

## 4. Konfigurasi Environment Variables di Vercel

Sebelum menekan tombol Deploy, buka bagian **Environment Variables** di halaman konfigurasi Vercel, lalu masukkan variabel wajib:

| Key | Value (Contoh) | Deskripsi |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xyzprojectref.supabase.co` | URL API Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1...` | Supabase Public Anon Key |
| `NEXT_PUBLIC_SITE_URL` | `https://nama-aplikasi.vercel.app` | Domain publik Vercel Anda |

> **Catatan:** Setelah deployment selesai pertama kali, perbarui `NEXT_PUBLIC_SITE_URL` dengan domain final yang diberikan oleh Vercel.

---

## 5. Deployment & Verifikasi

1. Klik tombol **Deploy**.
2. Vercel akan menjalankan instalasi dependensi dan proses build secara otomatis.
3. Setelah status berubah menjadi **Ready**, buka URL produksi untuk memeriksa seluruh fitur publik dan dashboard admin.
