import { Category, Post, UserProfile, Comment } from '../types/database';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-mentari-1',
  name: 'Dewi Anjani',
  email: 'dewi.anjani@mentaribersastra.id',
  role: 'Pemimpin Redaksi & Kurator Sastra',
  bio: 'Pencinta sastra nusantara, pegiat aksara, dan penikmat bait-bait puisi. Menulis untuk merawat keindahan bahasa, estetika rasa, dan refleksi batin manusia.',
  avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  website: 'https://mentaribersastra.id',
  github: 'https://github.com/mentaribersastra',
  twitter: 'https://twitter.com/mentaribersastra',
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-puisi',
    name: 'Sastra & Puisi',
    slug: 'sastra-puisi',
    description: 'Kumpulan bait sajak, antologi puisi kontemporer, dan renungan kata yang memantik ruang batin pembaca.',
    created_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'cat-prosa',
    name: 'Prosa & Cerpen',
    slug: 'prosa-cerpen',
    description: 'Kisah fiksi pendek, fragmen kehidupan, dan cerita yang menyentuh nurani dan ragam dinamika kemanusiaan.',
    created_at: new Date('2025-01-02').toISOString(),
  },
  {
    id: 'cat-esai',
    name: 'Esai & Opini Literasi',
    slug: 'esai-literasi',
    description: 'Ulasan kritis, dialog kebudayaan, dan refleksi mendalam atas perkembangan literasi di era modern.',
    created_at: new Date('2025-01-03').toISOString(),
  },
  {
    id: 'cat-resensi',
    name: 'Resensi Buku',
    slug: 'resensi-buku',
    description: 'Apresiasi dan tinjauan mendalam atas karya sastra terpilih, novel nusantara, dan karya penulis dunia.',
    created_at: new Date('2025-01-04').toISOString(),
  },
  {
    id: 'cat-budaya',
    name: 'Jejak Budaya',
    slug: 'jejak-budaya',
    description: 'Menelusuri khazanah folklor nusantara, kearifan tutur daerah, serta tradisi sastra lisan Indonesia.',
    created_at: new Date('2025-01-05').toISOString(),
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-sastra-1',
    title: 'Hujan di Sudut Kota dan Kenangan yang Tertinggal di Cangkir Kopi',
    slug: 'hujan-di-sudut-kota-dan-kenangan-yang-tertinggal-di-cangkir-kopi',
    excerpt: 'Sebuah fragmen prosa tentang pertemuan yang tak direncanakan, aroma tanah basah, dan bait percakapan yang selesai sebelum senja tanggal.',
    content: `# Hujan di Sudut Kota dan Kenangan yang Tertinggal di Cangkir Kopi

Gerimis turun tanpa permisi di ujung Jalan Malioboro. Langit abu-abu menggantung rendah, membiaskan cahaya lampu jalanan yang baru saja menyala temaram. Di balik kaca kedai tua yang mulai berembun, cangkir kopi hitam mengepulkan aroma sangrai robusta yang hangat.

## Pertemuan yang Menepi

Ada orang-orang yang hadir dalam hidup kita seperti rintik hujan pertama di musim kemarau: datang tiba-tiba, mengejutkan tanah yang tandus, lalu menyisakan aroma basah yang bertahan berminggu-minggu dalam ingatan.

> *"Kadang-kadang, yang kita rindukan bukanlah orangnya, melainkan bagaimana perasaan kita saat duduk bersamanya di tengah derasnya dunia yang bising."*

Dua pasang mata bertemu tanpa prasangka. Percakapan mengalir santai—tentang buku usang yang tergeletak di meja, tentang bait puisi Sapardi yang tercecer di saku jaket, dan tentang cita-cita sederhana yang sering kali terlibas oleh rutinitas kota metropolitan.

## Mengapa Kenangan Menetap?

Kenangan memiliki cara unik untuk menenun dirinya sendiri:
1. **Melalui Aroma**: Harum seduhan kopi dan tanah basah setelah gerimis (petrikor).
2. **Melalui Nada**: Gemerincing sendok kecil beradu dengan cangkir porselen putih.
3. **Melalui Keheningan**: Detik-detik jeda saat dua orang saling memandang dan memahami tanpa perlu sepatah kata pun terucap.

Hujan akhirnya reda, meninggalkan genangan air kecil yang memantulkan kerlip lampu kota. Cangkir kopi telah mendingin, namun kehangatan di dada tetap tinggal. Kita melangkah ke arah yang berbeda, menyadari bahwa hidup adalah tentang keberanian untuk menyimpan keindahan, meski ia hanya berlangsung sepenggal senja.`,
    featured_image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    category_id: 'cat-prosa',
    author_name: 'Dewi Anjani',
    published: true,
    views: 1845,
    reading_time: '4 menit baca',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'post-sastra-2',
    title: 'Membaca Ulang Sajak Chairil Anwar: Mengapa Api Eksistensialisme Tak Pernah Padam?',
    slug: 'membaca-ulang-sajak-chairil-anwar-mengapa-api-eksistensialisme-tak-pernah-padam',
    excerpt: 'Menelisik kedalaman sajak "Aku" dan "Derai-Derai Cemara", serta bagaimana keberanian estetik Chairil mendobrak kemapanan sastra Indonesia.',
    content: `# Membaca Ulang Sajak Chairil Anwar: Mengapa Api Eksistensialisme Tak Pernah Padam?

Chairil Anwar bukan sekadar pelopor Angkatan '45; ia adalah letupan kesadaran individual dalam lanskap sastra Indonesia yang saat itu masih lekat dengan romantisisme Pujangga Baru yang mendayu-dayu.

## Keberanian Menggugat Batas Kata

Saat Chairil menulis *“Kalau sampai waktuku, 'ku mau tak seorang 'kan merayu”*, ia tidak sedang merajuk. Ia menyatakan sikap eksistensial yang radikal: manusia berhadapan langsung dengan kefanaan dirinya sendiri tanpa topeng kemunafikan sosial.

Bahasa Indonesia di tangan Chairil berubah dari bahasa yang seremonial menjadi pisau bedah jiwa yang tajam dan berotot:
- **Ketegasan Diksi**: Mengikis metafora berbunga-bunga yang klise.
- **Irama Batin**: Sajak tidak terikat pola rima mati, melainkan denyut nadi dan degup jantung sang penyair.
- **Kejujuran Emosi**: Berani mengakui luka, kelemahan, dan rasa kesepian yang paling purba.

## Warisan untuk Generasi Literasi Modern

> *"Hidup hanya menunda kekalahan, tambah terasing dari cinta sekolah rendah, dan tahu, ada yang tetap tidak diucapkan, sebelum pada akhirnya kita menyerah."* — Chairil Anwar, Derai-Derai Cemara (1949)

Dalam era banjir informasi digital di mana ribuan kata diketik setiap detiknya tanpa ruh, sajak-sajak Chairil mengingatkan kita bahwa setiap kata harus memiliki bobot darah dan kejujuran rasa. Sastra bukanlah hiasan dinding, melainkan api yang harus terus dinyalakan di rongga dada anak-anak zaman.`,
    featured_image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    category_id: 'cat-esai',
    author_name: 'Bagus Wicaksono',
    published: true,
    views: 2690,
    reading_time: '6 menit baca',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'post-sastra-3',
    title: 'Antologi Senja: Kumpulan Bait tentang Sunyi, Waktu, dan Asa yang Bersemi',
    slug: 'antologi-senja-kumpulan-bait-tentang-sunyi-waktu-dan-asa-yang-bersemi',
    excerpt: 'Di antara jingga yang luruh dan malam yang mengetuk jendela, bait-bait ini ditulis untuk merayakan keheningan yang paling jujur.',
    content: `# Antologi Senja: Kumpulan Bait tentang Sunyi, Waktu, dan Asa yang Bersemi

### I. Pukul Enam Sore
Langit menumpahkan jingganya ke pangkuan kota,  
seperti cat air yang tumpah di kertas buram anak sekolah.  
Di kejauhan, burung-burung camar mencari dahan terakhir,  
sementara kita masih sibuk mencari kata yang tak sempat terucap.

### II. Di Batas Keheningan
Kau bilang, sunyi adalah musuh orang-orang yang patah hati.  
Namun malam ini, aku menemukan bahwa sunyi adalah sahabat terbaik  
yang sudi mendengarkan detak jam dinding  
tanpa menghakimi mengapa air mata masih saja menetes pelan.

> *"Jangan padamkan lentera di dadamu,  
meski angin malam meniupnya berkali-kali.  
Sebab esok fajar akan tiba,  
dan kata-kata yang kau simpan akan menemukan pendengarnya."*

### III. Janji Mentari
Pada setiap helai daun yang gugur di beranda,  
tersimpan kabar bahwa perpisahan hanyalah cara bumi beristirahat.  
Mentari bersastra dalam bahasa cahaya,  
mengingatkan bahwa yang remuk redam pun  
selalu berhak menyambut pagi dengan bait baru.`,
    featured_image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1200&q=80',
    category_id: 'cat-puisi',
    author_name: 'Kirana Larasati',
    published: true,
    views: 3120,
    reading_time: '3 menit baca',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'post-sastra-4',
    title: 'Menyelami Martabat Manusia dalam Roman "Bumi Manusia": Sebuah Catatan Apresiasi',
    slug: 'menyelami-martabat-manusia-dalam-roman-bumi-manusia-sebuah-catatan-apresiasi',
    excerpt: 'Bagaimana Pramoedya Ananta Toer merajut martabat kemanusiaan, cinta Minke dan Annelies, serta pergulatan keadilan di masa kolonial.',
    content: `# Menyelami Martabat Manusia dalam Roman "Bumi Manusia": Sebuah Catatan Apresiasi

Membaca kembali tetralogi Buru, khususnya novel pertama *Bumi Manusia*, selalu membawa debar yang tak pernah pudar. Ditulis dari balik jeruji pembuangan Pulau Buru, Pramoedya Ananta Toer melahirkan salah satu mahakarya sastra terbesar yang pernah ditulis dalam bahasa Indonesia.

## Sosok Minke dan Nyai Ontosoroh

Kekuatan utama *Bumi Manusia* terletak pada kedalaman karakternya:
- **Minke**: Pemuda pribumi terpelajar yang merangkak keluar dari feodalisme Jawa menuju pencerahan modernitas dengan pena sebagai senjatanya.
- **Nyai Ontosoroh (Sanikem)**: Simbol ketabahan dan perlawanan luar biasa dari seorang perempuan yang dijual oleh keluarganya sendiri, namun bangkit menjadi perempuan mandiri yang menguasai hukum dan perdagangan kolonial.

> *"Seorang terpelajar harus sudah berbuat adil sejak dalam pikiran, apalagi dalam perbuatan."* — Pesan legendaris Jean Marais kepada Minke.

## Sastra sebagai Pembela Kaum Tertindas

Bagi Pramoedya, sastra bukan pelarian dari kenyataan pahit, melainkan instrumen untuk menegakkan martabat manusia (*human dignity*). Roman ini mengajarkan kita bahwa kekalahan fisik bukanlah akhir dari segalanya, selama jiwa perlawanan terhadap ketidakadilan tetap berkobar:

*“Kita telah melawan, Minke, sebaik-baiknya, sehormat-hormatnya!”* seru Nyai Ontosoroh di penghujung kisah saat Annelies direnggut secara paksa.

Sebuah karya agung yang abadi dan wajib dibaca oleh setiap penikmat literasi nusantara.`,
    featured_image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=1200&q=80',
    category_id: 'cat-resensi',
    author_name: 'Rendra Mahardika',
    published: true,
    views: 4210,
    reading_time: '5 menit baca',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'cm-sastra-1',
    post_id: 'post-sastra-1',
    author_name: 'Laras Sekar',
    content: 'Membaca prosa ini rasanya seperti kembali mencium wangi kopi dan gerimis sore di Yogyakarta. Pilihan kata yang sangat hangat dan menyentuh.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'cm-sastra-2',
    post_id: 'post-sastra-2',
    author_name: 'Faisal Hakim',
    content: 'Analisis yang tajam atas sajak Chairil. Eksistensialisme Chairil memang otentik dan sangat relevan untuk refleksi kita di zaman serba bising saat ini.',
    created_at: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'cm-sastra-3',
    post_id: 'post-sastra-3',
    author_name: 'Nadia Prameswari',
    content: 'Bait penutupnya memberi pengharapan yang indah. Terima kasih Mentari Bersastra atas puisi-puisi yang menyejukkan hati.',
    created_at: new Date(Date.now() - 20000000).toISOString(),
  },
];
