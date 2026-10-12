# Solusi Masalah Umum (Troubleshooting) di Produksi

Berikut adalah daftar kendala umum yang sering ditemui beserta solusinya:

---

### 1. Masalah: Gambar Artikel Tidak Tampil / Error `next/image` Invalid Hostname
- **Penyebab:** Domain Supabase Storage belum didaftarkan pada konfigurasi Next.js.
- **Solusi:** Pastikan `next.config.mjs` memiliki konfigurasi `remotePatterns`:
  ```javascript
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  }
  ```

---

### 2. Masalah: Error `document is not defined` saat Build
- **Penyebab:** JavaScript bawaan Bootstrap (`bootstrap.bundle.min.js`) mengakses objek browser saat Server-Side Rendering (SSR).
- **Solusi:** Gunakan komponen `BootstrapClient.tsx` yang memanggil `import('bootstrap/dist/js/...')` di dalam hook `useEffect`.

---

### 3. Masalah: Admin Berulang Kali Mental ke Halaman Login
- **Penyebab:** Cookie sesi Supabase tidak terbaca oleh Server Component atau Middleware di domain production HTTPS.
- **Solusi:**
  1. Pastikan menggunakan paket `@supabase/ssr`.
  2. Pastikan file `src/middleware.ts` menangani metode `getAll()` serta `setAll()` untuk pengelolaan cookie.
  3. Periksa kesesuaian nilai `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

### 4. Masalah: Artikel Baru Belum Langsung Muncul di Halaman Utama Publik
- **Penyebab:** Halaman utama menggunakan strategi caching ISR dengan interval `revalidate = 60`.
- **Solusi:** Halaman utama akan otomatis memperbarui datanya di background setelah interval 60 detik.
