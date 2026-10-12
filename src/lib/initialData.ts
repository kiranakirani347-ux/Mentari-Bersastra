import { Category, Post, UserProfile, Comment } from '../types/database';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-1',
  name: 'Alex Pratama',
  email: 'alex.pratama@modernblog.com',
  role: 'Lead Technical Writer & Architect',
  bio: 'Software engineer dengan pengalaman 8+ tahun dalam ekosistem Next.js, Cloud Computing, dan arsitektur data terdistribusi.',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  website: 'https://alexpratama.dev',
  github: 'https://github.com/alexpratama',
  twitter: 'https://twitter.com/alexpratama',
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Panduan dan praktik terbaik teknologi web modern, frontend, dan backend.',
    created_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'cat-2',
    name: 'Cloud & Serverless',
    slug: 'cloud-serverless',
    description: 'Arsitektur cloud computing, Supabase, Vercel, dan infrastruktur modern.',
    created_at: new Date('2025-01-02').toISOString(),
  },
  {
    id: 'cat-3',
    name: 'Desain & UI/UX',
    slug: 'desain-ui-ux',
    description: 'Prinsip desain antarmuka, aksesibilitas web, dan sistem desain Bootstrap 5.',
    created_at: new Date('2025-01-03').toISOString(),
  },
  {
    id: 'cat-4',
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'Perkembangan AI terkini, model bahasa besar, dan integrasi cerdas.',
    created_at: new Date('2025-01-04').toISOString(),
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'Membangun Arsitektur Blog Modern dengan Next.js App Router dan Supabase',
    slug: 'membangun-arsitektur-blog-modern-dengan-nextjs-app-router-dan-supabase',
    excerpt: 'Pelajari bagaimana menggabungkan Next.js App Router dengan Supabase PostgreSQL dan Bootstrap 5 untuk performa maksimal di Vercel.',
    content: `# Membangun Arsitektur Blog Modern dengan Next.js App Router dan Supabase

Dalam beberapa tahun terakhir, ekosistem web telah berkembang pesat menuju arsitektur yang lebih ramping dan efisien. Menggabungkan **Next.js App Router**, **Supabase**, dan **Bootstrap 5** memberikan kombinasi luar biasa antara kecepatan pengembangan dan stabilitas produksi.

## Mengapa Next.js App Router?
Next.js App Router menghadirkan *React Server Components* (RSC) secara bawaan:
- **Zero-Bundle Sisi Klien**: Komponen yang hanya merender data tidak mengirimkan JavaScript tambahan ke browser pengguna.
- **Incremental Static Regeneration (ISR)**: Caching halaman dinamis dengan \`revalidate\` memastikan artikel disajikan secepat situs statis tanpa membebani database.
- **Streaming SSR**: Pengalaman pengguna tetap mulus dengan transisi loading skeleton otomatis.

## Integrasi Database & Auth dengan Supabase
Supabase menyediakan seluruh backend yang kita butuhkan:
1. **PostgreSQL Relasional**: Performa query tinggi dan integritas data terjamin.
2. **Row Level Security (RLS)**: Keamanan data ditegakkan langsung di level database sehingga API publik tidak bisa memodifikasi artikel sembarangan.
3. **Supabase Storage**: Bucket penyimpanan aset gambar dengan CDN global terdistribusi.

\`\`\`sql
-- Contoh RLS Policy untuk keamanan artikel
CREATE POLICY "Public can view published posts"
ON public.posts FOR SELECT
USING (published = true);
\`\`\`

## Kesimpulan
Dengan arsitektur ini, website blog Anda siap menangani jutaan kunjungan dengan biaya infrastruktur yang sangat efisien di Vercel.`,
    featured_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    category_id: 'cat-1',
    author_name: 'Alex Pratama',
    published: true,
    views: 1420,
    reading_time: '4 menit baca',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'post-2',
    title: 'Panduan Praktis Bootstrap 5: Elegan Tanpa Ketergantungan Utilitas Rumit',
    slug: 'panduan-praktis-bootstrap-5-elegan-tanpa-ketergantungan-utilitas-rumit',
    excerpt: 'Mengapa Bootstrap 5 tetap menjadi pilihan terpercaya para insinyur perangkat lunak untuk dashboard dan aplikasi responsif skala enterprise.',
    content: `# Panduan Praktis Bootstrap 5: Elegan Tanpa Ketergantungan Utilitas Rumit

Banyak developer mengira Bootstrap adalah masa lalu. Kenyataannya, **Bootstrap 5** telah menulis ulang core framework-nya tanpa jQuery, menggunakan CSS Custom Properties (variabel CSS), dan sistem grid flexbox yang sangat matang.

## Keunggulan Utama Bootstrap 5
- **Tanpa jQuery**: Ringan dan ramah framework modern seperti React dan Next.js.
- **Sistem Grid 12 Kolom**: Responsivitas teruji untuk tablet, mobile, dan layar desktop besar.
- **Komponen Standar Kaya**: Modal, alert, card, dropdown, dan badge yang mudah diakses (a11y).

> "Bootstrap memungkinkan tim teknik fokus pada logika bisnis dan alur data tanpa perlu menghabiskan waktu merancang ulang tombol dari nol."

## Tips Menghindari Hydration Error di SSR
Pastikan memuat file JavaScript bundle secara dinamis di sisi klien menggunakan \`useEffect\` agar tidak memicu error \`document is not defined\`.`,
    featured_image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    category_id: 'cat-3',
    author_name: 'Siti Rahma',
    published: true,
    views: 980,
    reading_time: '3 menit baca',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'post-3',
    title: 'Menerapkan Serverless Storage dan RLS Supabase untuk Pengelolaan Media Blog',
    slug: 'menerapkan-serverless-storage-dan-rls-supabase-untuk-pengelolaan-media-blog',
    excerpt: 'Cara aman mengatur bucket penyimpanan gambar, membatasi upload hanya untuk admin terotentikasi, dan menyajikan gambar secara publik.',
    content: `# Menerapkan Serverless Storage dan RLS Supabase untuk Pengelolaan Media Blog

Mengelola unggahan file pengguna sering kali menjadi celah keamanan jika tidak dikonfigurasi dengan benar. Supabase Storage menyelesaikan masalah ini dengan mengintegrasikan sistem file langsung dengan Postgres RLS.

## Tiga Lapisan Pengamanan Media:
1. **Public Read Bucket**: Pengunjung umum dapat memuat gambar dengan URL CDN publik.
2. **Authenticated Upload Only**: Hanya user dengan token autentikasi valid yang diizinkan mengunggah file baru.
3. **File MIME-Type Restriction**: Membatasi format file hanya untuk \`image/jpeg\`, \`image/png\`, dan \`image/webp\`.

Dengan langkah ini, penyimpanan aset media Anda aman dari eksploitasi dan siap digunakan di lingkungan produksi Vercel.`,
    featured_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    category_id: 'cat-2',
    author_name: 'Budi Santoso',
    published: true,
    views: 654,
    reading_time: '5 menit baca',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'cm-1',
    post_id: 'post-1',
    author_name: 'Dian Nugraha',
    content: 'Artikel yang sangat membuka wawasan! Pendekatan ISR di Next.js App Router memang terasa jauh lebih cepat untuk pembaca.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'cm-2',
    post_id: 'post-1',
    author_name: 'Farhan Pratama',
    content: 'Terima kasih atas penjelasan konfigurasi RLS-nya. Sangat aplikatif untuk proyek saya.',
    created_at: new Date(Date.now() - 43200000).toISOString(),
  },
];
