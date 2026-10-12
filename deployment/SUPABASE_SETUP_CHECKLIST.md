# Checklist Konfigurasi Supabase Production

Gunakan daftar periksa ini untuk memastikan database, otentikasi, dan media storage Supabase siap melayani trafik produksi.

---

## 1. Skema Database & RLS
- [ ] Buka menu **SQL Editor** di Supabase Dashboard.
- [ ] Jalankan seluruh perintah dari file `supabase.sql`.
- [ ] Pastikan tabel `public.categories` dan `public.posts` telah terbuat.
- [ ] Pastikan status RLS bertuliskan **Enabled** pada kedua tabel.

---

## 2. Storage Bucket (`blog-images`)
- [ ] Buka menu **Storage** di Supabase Dashboard.
- [ ] Pastikan bucket dengan nama `blog-images` sudah dibuat.
- [ ] Pastikan visibilitas bucket diatur ke **Public** (agar pembaca dapat melihat gambar artikel).
- [ ] Pastikan kebijakan RLS untuk `storage.objects` telah aktif sesuai skrip `supabase.sql`.

---

## 3. Pembuatan Akun Admin
- [ ] Buka menu **Authentication** > **Users**.
- [ ] Klik **Add User** > **Create User**.
- [ ] Masukkan Email admin (contoh: `admin@domainanda.com`) dan Kata Sandi.
- [ ] Centang opsi **Auto Confirm User?** agar user langsung aktif tanpa menunggu verifikasi email.

---

## 4. Konfigurasi URL Redirect Authentication
- [ ] Buka menu **Authentication** > **URL Configuration**.
- [ ] Pada bagian **Site URL**, masukkan domain Vercel Anda: `https://nama-aplikasi.vercel.app`
- [ ] Pada bagian **Redirect URLs**, tambahkan endpoint callback auth:
  ```text
  https://nama-aplikasi.vercel.app/api/auth/callback
  http://localhost:3000/api/auth/callback
  ```
