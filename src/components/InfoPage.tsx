import React from 'react';

export type InfoPageType = 'tentang' | 'kirim-karya' | 'hak-cipta' | 'kebijakan-privasi' | 'kode-etik';

interface InfoPageProps {
  pageType: InfoPageType;
  onNavigate: (view: any, param?: string) => void;
  onBackToHome: () => void;
}

interface PageMeta {
  title: string;
  subtitle: string;
  icon: string;
  readTime: string;
  badge: string;
}

const PAGE_METAS: Record<InfoPageType, PageMeta> = {
  tentang: {
    title: 'Tentang Mentari Bersastra',
    subtitle: 'Mendedikasikan ruang aksara untuk merawat keindahan bahasa, kejernihan nurani, dan martabat sastra nusantara.',
    icon: 'bi-feather',
    readTime: '3 menit baca',
    badge: 'Visi & Redaksi',
  },
  'kirim-karya': {
    title: 'Panduan Kirim Karya & Kurasi Sastra',
    subtitle: 'Ruang terbuka bagi para penyair, cerpenis, esais, dan pegiat literasi nusantara untuk memublikasikan karya terbaik.',
    icon: 'bi-journal-arrow-up',
    readTime: '5 menit baca',
    badge: 'Pedoman Penulis',
  },
  'hak-cipta': {
    title: 'Hak Cipta Penulis & Perlindungan Karya',
    subtitle: 'Menjunjung tinggi hak moral dan hak ekonomi sastrawan atas setiap bait, prosa, dan gagasan intelektual.',
    icon: 'bi-shield-check',
    readTime: '4 menit baca',
    badge: 'Legalitas & Hak Intelektual',
  },
  'kebijakan-privasi': {
    title: 'Kebijakan Privasi Pembaca & Kontributor',
    subtitle: 'Komitmen kami menjaga keamanan data pribadi dan kerahasiaan pembaca berlandaskan UU Pelindungan Data Pribadi.',
    icon: 'bi-lock',
    readTime: '4 menit baca',
    badge: 'Keamanan Data',
  },
  'kode-etik': {
    title: 'Kode Etik Kurasi & Standar Redaksi Literasi',
    subtitle: 'Integritas, kepekaan estetik, dan independensi dalam menyeleksi serta menyajikan khazanah sastra Indonesia.',
    icon: 'bi-award',
    readTime: '4 menit baca',
    badge: 'Integritas Redaksi',
  },
};

export default function InfoPage({ pageType, onNavigate, onBackToHome }: InfoPageProps) {
  const currentMeta = PAGE_METAS[pageType] || PAGE_METAS.tentang;

  const tabs: { key: InfoPageType; label: string; icon: string }[] = [
    { key: 'tentang', label: 'Tentang Redaksi', icon: 'bi-info-circle' },
    { key: 'kirim-karya', label: 'Kirim Karya', icon: 'bi-pen' },
    { key: 'hak-cipta', label: 'Hak Cipta', icon: 'bi-shield-check' },
    { key: 'kebijakan-privasi', label: 'Privasi Pembaca', icon: 'bi-lock' },
    { key: 'kode-etik', label: 'Kode Etik Kurasi', icon: 'bi-award' },
  ];

  return (
    <div className="py-4 py-md-5">
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Breadcrumb & Kembali */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item">
                <button
                  onClick={onBackToHome}
                  className="btn btn-link p-0 text-decoration-none text-muted d-inline-flex align-items-center gap-1"
                >
                  <i className="bi bi-house"></i> Beranda
                </button>
              </li>
              <li className="breadcrumb-item text-muted">Informasi Literasi</li>
              <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">
                {currentMeta.title}
              </li>
            </ol>
          </nav>

          <button
            onClick={onBackToHome}
            className="btn btn-sm btn-outline-dark rounded-pill px-3 d-inline-flex align-items-center gap-2"
          >
            <i className="bi bi-arrow-left"></i>
            <span>Kembali ke Beranda</span>
          </button>
        </div>

        {/* Tab Navigasi Kaca Antar Halaman Informasi */}
        <div className="glass-card p-2 rounded-4 mb-4 shadow-sm">
          <div className="d-flex flex-wrap gap-1 justify-content-center justify-content-md-start">
            {tabs.map((tab) => {
              const isActive = tab.key === pageType;
              return (
                <button
                  key={tab.key}
                  onClick={() => onNavigate(tab.key)}
                  className={`btn btn-sm rounded-pill px-3 py-2 fw-medium d-flex align-items-center gap-2 border-0 transition-all ${
                    isActive
                      ? 'bg-warning text-dark fw-bold shadow-xs'
                      : 'text-secondary hover-bg-light'
                  }`}
                >
                  <i className={`bi ${tab.icon}`}></i>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hero Header Halaman dengan Efek Kaca */}
        <div className="glass-card rounded-4 p-4 p-md-5 mb-4 shadow-sm border position-relative overflow-hidden">
          <div
            className="position-absolute"
            style={{
              top: '-30px',
              right: '-30px',
              width: '180px',
              height: '180px',
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0) 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />

          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="badge bg-warning text-dark py-2 px-3 rounded-pill fw-semibold shadow-xs">
              <i className={`bi ${currentMeta.icon} me-1`}></i>
              {currentMeta.badge}
            </span>
            <span className="text-muted small d-inline-flex align-items-center gap-1">
              <i className="bi bi-clock"></i> {currentMeta.readTime}
            </span>
          </div>

          <h1 className="fw-bold text-dark display-6 mb-3">{currentMeta.title}</h1>
          <p className="lead text-secondary mb-0 fs-6" style={{ maxWidth: '780px' }}>
            {currentMeta.subtitle}
          </p>
        </div>

        {/* Konten Utama Berdasarkan Halaman */}
        <div className="glass-card rounded-4 p-4 p-md-5 shadow-sm border bg-white mb-4">
          {pageType === 'tentang' && (
            <div className="markdown-body">
              <h2>Mengenal Mentari Bersastra</h2>
              <p>
                <strong>Mentari Bersastra</strong> lahir dari sebuah kerinduan mendalam akan ruang publikasi sastra
                Indonesia yang mengedepankan kualitas estetik, kejernihan nurani, dan kebebasan berekspresi. Di tengah
                arus deras konten instan di ruang digital, kami hadir sebagai suaka bagi kata-kata yang diracik dengan
                keheningan jiwa dan ketajaman kontemplasi.
              </p>

              <blockquote>
                "Bahasa adalah rumah keberadaan manusia. Ketika sastra dirawat dengan cinta, martabat peradaban suatu
                bangsa ikut bermekaran di dalam sanubari generasi penerusnya."
              </blockquote>

              <h3>Visi Kami</h3>
              <p>
                Menjadi lentera literasi sastra terdepan di Indonesia yang menghubungkan pencinta kata, penyair ulung,
                penulis pemula, dan pembaca kritis dalam satu ekosistem dialektika yang hangat dan bermartabat.
              </p>

              <h3>Misi Kami</h3>
              <ul>
                <li>
                  <strong>Merawat Orisinalitas:</strong> Memberikan ruang terhormat bagi puisi, prosa, cerpen, esai, dan
                  resensi buku yang ditulis dengan kejujuran rasa tanpa plagiarisme.
                </li>
                <li>
                  <strong>Membina Regenerasi Penulis:</strong> Menjadi wadah bagi suara-suara muda dari pelosok nusantara
                  agar karyanya dibaca dan diapresiasi khalayak luas.
                </li>
                <li>
                  <strong>Menghidupkan Budaya Kritik Sastra yang Sehat:</strong> Mengembangkan rubrik esai dan ulasan buku
                  yang membangun apresiasi mendalam terhadap khazanah literatur Indonesia dan dunia.
                </li>
                <li>
                  <strong>Digitalisasi Humanis:</strong> Memanfaatkan teknologi web modern berkecapatan tinggi demi
                  kenyamanan membaca tanpa kehilangan sentuhan hangat buku fisik.
                </li>
              </ul>

              <h3>Rubrik Sastra Utama</h3>
              <div className="row g-3 my-3">
                <div className="col-md-6">
                  <div className="p-3 rounded-3 bg-light border">
                    <h5 className="fw-bold text-dark mb-1">
                      <i className="bi bi-feather text-warning me-2"></i>Sastra & Puisi
                    </h5>
                    <p className="small text-muted mb-0">
                      Bait-bait sajak bebas, soneta, dan puisi kamar yang meraba lanskap batin dan sosial kemasyarakatan.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 rounded-3 bg-light border">
                    <h5 className="fw-bold text-dark mb-1">
                      <i className="bi bi-book-half text-warning me-2"></i>Prosa & Cerpen
                    </h5>
                    <p className="small text-muted mb-0">
                      Fragmen fiksi pendek yang memotret ragam realitas sosial, dinamika keluarga, dan misteri psikologis.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 rounded-3 bg-light border">
                    <h5 className="fw-bold text-dark mb-1">
                      <i className="bi bi-journal-text text-warning me-2"></i>Esai & Opini Literasi
                    </h5>
                    <p className="small text-muted mb-0">
                      Kajian kritis terhadap dinamika sosial, filsafat bahasa, dan arah pergerakan sastra nusantara.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 rounded-3 bg-light border">
                    <h5 className="fw-bold text-dark mb-1">
                      <i className="bi bi-bookmark-star text-warning me-2"></i>Resensi & Jejak Budaya
                    </h5>
                    <p className="small text-muted mb-0">
                      Apresiasi mendalam terhadap buku terbitan baru dan penelusuran tradisi tutur sastra lisan nusantara.
                    </p>
                  </div>
                </div>
              </div>

              <h3>Dewan Redaksi & Kurator</h3>
              <p>
                Dikelola oleh kolektif kurator sastra independen yang beranggotakan pegiat literasi, akademisi bahasa,
                dan penulis berpengalaman yang bekerja dengan dedikasi menjaga kejernihan standar kurasi sastra.
              </p>
            </div>
          )}

          {pageType === 'kirim-karya' && (
            <div className="markdown-body">
              <h2>Panduan dan Ketentuan Pengiriman Karya</h2>
              <p>
                Mentari Bersastra menerima kiriman karya tulisan dari siapa pun tanpa batasan usia maupun latar belakang.
                Kami meyakini bahwa setiap orang memiliki suara batin yang berhak didengar bila diolah dengan estetika kata yang tulus.
              </p>

              <div className="alert alert-warning border-0 rounded-3 p-3 my-3">
                <div className="d-flex align-items-center gap-2 fw-bold text-dark mb-1">
                  <i className="bi bi-info-circle-fill text-warning"></i>
                  Pengiriman Karya Bebas Biaya
                </div>
                <div className="small text-dark">
                  Seluruh proses pengiriman, penelaahan redaksi, dan publikasi di Mentari Bersastra adalah <strong>100% GRATIS</strong>.
                  Kami tidak pernah memungut biaya kurasi maupun administrasi apa pun.
                </div>
              </div>

              <h3>1. Kategori dan Kriteria Karya</h3>
              <ul>
                <li>
                  <strong>Puisi:</strong> Kirimkan 3 hingga 5 puisi bertema bebas yang belum pernah diterbitkan di media komersial mana pun.
                  Panjang sajak bebas, mengutamakan orisinalitas diksi dan kedalaman makna.
                </li>
                <li>
                  <strong>Cerpen (Cerita Pendek):</strong> Panjang naskah antara 800 sampai 2.500 kata. Cerita memiliki karakterisasi yang hidup,
                  alur yang padu, serta bebas dari unsur kebencian terhadap SARA.
                </li>
                <li>
                  <strong>Esai Sastra & Kebudayaan:</strong> Panjang naskah 1.000 sampai 2.000 kata. Berisi pemikiran kritis, argumentasi yang runtut,
                  dan didukung rujukan yang dapat dipertanggungjawabkan.
                </li>
                <li>
                  <strong>Resensi Buku:</strong> Panjang naskah 800 sampai 1.500 kata. Membahas buku sastra (novel, puisi, non-fiksi bermutu) yang diterbitkan secara resmi.
                </li>
              </ul>

              <h3>2. Format Berkas & Pengiriman</h3>
              <ol>
                <li>Naskah diketik rapi dengan huruf standar (Times New Roman atau Calibri 12pt, spasi 1.5).</li>
                <li>Cantumkan biodata narasi singkat (maksimal 60 kata) di akhir naskah beserta akun media sosial atau kontak WhatsApp.</li>
                <li>Sertakan pernyataan singkat bahwa naskah merupakan karya orisinal dan bukan hasil plagiarisme maupun hasil otomatisasi kecerdasan buatan tanpa olah batin.</li>
              </ol>

              <h3>3. Alur Kurasi Redaksi</h3>
              <div className="row g-3 my-3">
                <div className="col-md-4">
                  <div className="p-3 rounded-3 bg-light border text-center h-100">
                    <span className="badge bg-secondary rounded-pill mb-2">Tahap 1</span>
                    <h6 className="fw-bold mb-1">Penerimaan & Skrining</h6>
                    <p className="small text-muted mb-0">Pemeriksaan kelengkapan berkas dan keaslian naskah oleh sekretariat redaksi.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 rounded-3 bg-light border text-center h-100">
                    <span className="badge bg-warning text-dark rounded-pill mb-2">Tahap 2</span>
                    <h6 className="fw-bold mb-1">Penelaahan Kurator</h6>
                    <p className="small text-muted mb-0">Evaluasi gaya tutur, estetika diksi, dan substansi pesan sastra (1-3 hari kerja).</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 rounded-3 bg-light border text-center h-100">
                    <span className="badge bg-success rounded-pill mb-2">Tahap 3</span>
                    <h6 className="fw-bold mb-1">Publikasi & Tayang</h6>
                    <p className="small text-muted mb-0">Naskah yang lolos kurasi diterbitkan pada rubrik utama dan dibagikan ke khalayak.</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top d-flex flex-wrap gap-2 align-items-center">
                <button
                  onClick={() => onNavigate('admin-login')}
                  className="btn btn-warning rounded-pill px-4 fw-semibold text-dark shadow-xs"
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Masuk ke Portal Penulis
                </button>
                <a
                  href="mailto:redaksi@mentaribersastra.id?subject=Kiriman%20Karya%20Sastra"
                  className="btn btn-outline-secondary rounded-pill px-4"
                >
                  <i className="bi bi-envelope me-1"></i> Kirim via Email Redaksi
                </a>
              </div>
            </div>
          )}

          {pageType === 'hak-cipta' && (
            <div className="markdown-body">
              <h2>Hak Cipta Penulis & Perlindungan Karya Sastra</h2>
              <p>
                Mentari Bersastra menjunjung tinggi harkat martabat sastrawan dan menghormati hak kekayaan intelektual
                sebagaimana diamanatkan dalam <strong>Undang-Undang Republik Indonesia Nomor 28 Tahun 2014 tentang Hak Cipta</strong>.
              </p>

              <blockquote>
                "Karya sastra adalah anak rohani sang pengarang. Hak cipta moral dan ekonomi selamanya melekat pada diri penulis yang melahirkannya."
              </blockquote>

              <h3>1. Kepemilikan Hak Cipta Penuh</h3>
              <p>
                Seluruh hak cipta atas tulisan (bait puisi, cerita pendek, fragmen novel, esai reflektif, ulasan buku,
                maupun komentar sastra) yang diterbitkan di Mentari Bersastra tetap menjadi <strong>milik penuh penulis bersangkutan</strong>.
              </p>

              <h3>2. Lisensi Publikasi Non-Eksklusif</h3>
              <p>
                Dengan memublikasikan karya di Mentari Bersastra, penulis memberikan hak non-eksklusif kepada Mentari Bersastra untuk:
              </p>
              <ul>
                <li>Menayangkan naskah secara digital pada situs web resmi dan aplikasi Mentari Bersastra.</li>
                <li>Mencantumkan cuplikan karya dalam buletin literasi, arsip bacaan, dan media sosial resmi untuk tujuan promosi karya dan penulis.</li>
                <li>
                  Penulis <em>tetap berhak penuh</em> untuk membukukan karya tersebut di kemudian hari ke dalam buku cetak pribadi,
                  antologi bersama, atau menyertakannya dalam lomba sastra lain sesuai kehendak penulis.
                </li>
              </ul>

              <h3>3. Kewajiban Atribusi</h3>
              <p>
                Setiap pihak yang ingin mengutip karya dari Mentari Bersastra diwajibkan mencantumkan nama penulis secara jelas,
                judul karya, serta menyertakan tautan sumber asli ke halaman Mentari Bersastra. Pengutipan tanpa atribusi
                merupakan pelanggaran hak moral penulis.
              </p>

              <h3>4. Penolakan Tegas Plagiarisme</h3>
              <p>
                Mentari Bersastra memberlakukan kebijakan nol toleransi (<em>zero tolerance</em>) terhadap segala bentuk penjiplakan,
                saduran tanpa izin, maupun penggunaan karya orang lain tanpa menyebutkan sumber asli.
                Karya yang terbukti melanggar hak cipta akan segera ditarik dari peredaran dan akun pelaku akan dinonaktifkan secara permanen.
              </p>
            </div>
          )}

          {pageType === 'kebijakan-privasi' && (
            <div className="markdown-body">
              <h2>Kebijakan Privasi Pembaca & Kontributor</h2>
              <p>
                Privasi dan kenyamanan Anda saat membaca serta berkarya di Mentari Bersastra adalah prioritas utama kami.
                Kebijakan ini menjelaskan bagaimana informasi Anda dikelola dengan aman sesuai prinsip Undang-Undang
                Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).
              </p>

              <h3>1. Informasi yang Kami Kumpulkan</h3>
              <ul>
                <li>
                  <strong>Data Akun:</strong> Nama pengguna, alamat surel (email), kata sandi terenkripsi, foto avatar,
                  dan biodata singkat yang Anda masukkan saat mendaftarkan akun.
                </li>
                <li>
                  <strong>Aktivitas Literasi:</strong> Komentar yang Anda tuliskan pada artikel, karya yang Anda unggah,
                  dan preferensi kategori sastra yang Anda sukai.
                </li>
                <li>
                  <strong>Data Teknis Ringan:</strong> Alamat IP tersamar, tipe peramban web (browser), dan waktu kunjungan
                  semata-mata untuk mengoptimalkan kecepatan server dan mencegah serangan spam otomatis.
                </li>
              </ul>

              <h3>2. Penggunaan Informasi</h3>
              <p>Informasi yang kami simpan hanya digunakan untuk:</p>
              <ul>
                <li>Menghadirkan pengalaman membaca dan memublikasikan tulisan yang lancar, aman, dan personal.</li>
                <li>Memverifikasi identitas kontributor dalam proses kurasi redaksi.</li>
                <li>Mencegah penyalahgunaan portal dari spam, kata sandi bocor, atau aktivitas berbahaya.</li>
                <li>
                  <strong>Kami menjamin:</strong> Mentari Bersastra <em>tidak pernah menjual, menyewakan, atau menukar data pribadi Anda</em>
                  kepada pihak ketiga atau jaringan iklan mana pun.
                </li>
              </ul>

              <h3>3. Hak Anda atas Data Pribadi</h3>
              <p>
                Anda memiliki hak penuh untuk mengakses, memperbarui biodata, mengubah foto profil, atau meminta penghapusan akun beserta
                seluruh data yang tersimpan kapan saja melalui Halaman Pengaturan Profil Akun Anda atau dengan menghubungi tim teknis kami.
              </p>
            </div>
          )}

          {pageType === 'kode-etik' && (
            <div className="markdown-body">
              <h2>Kode Etik Kurasi & Standar Redaksi Literasi</h2>
              <p>
                Kepercayaan pembaca dan rasa hormat para penulis dibangun di atas pondasi kejujuran dan etika yang kukuh.
                Kode etik ini mengikat segenap jajaran dewan kurator, editor, dan pengelola teknis Mentari Bersastra.
              </p>

              <h3>1. Independensi & Keadilan Penilaian</h3>
              <p>
                Setiap naskah yang masuk dinilai semata-mata berdasarkan bobot estetik, kekuatan bahasa, dan kedalaman makna sastra.
                Kurator dilarang membeda-bedakan naskah berdasarkan popularitas nama penulis, suku, ras, agama, gender, maupun afiliasi politik.
              </p>

              <h3>2. Menghargai Keragaman Ekspresi Nusantara</h3>
              <p>
                Sastra Indonesia kaya akan dialek daerah, idiom kearifan lokal, dan sudut pandang multikultural.
                Redaksi menghormati keragaman gaya bahasa dan tidak memaksakan penyeragaman bentuk yang mematikan jiwa tutur lokal.
              </p>

              <h3>3. Integritas dan Keaslian Jiwa Manusiawi</h3>
              <p>
                Di tengah perkembangan pesat model bahasa generatif, Mentari Bersastra berpegang teguh pada prinsip bahwa
                sastra sejati bersumber dari pengalaman batin, kepekaan indrawi, dan pergulatan nyata nurani manusia.
                Kami menolak karya sintetik tanpa keterlibatan emosi dan pemikiran otentik penulis.
              </p>

              <h3>4. Tanggung Jawab Sosial dan Nilai Kemanusiaan</h3>
              <p>
                Kami menolak menerbitkan naskah yang menyebarkan kebencian, diskriminasi kemanusiaan, fitnah keji,
                atau glorifikasi kekerasan yang merusak persaudaraan kebangsaan.
              </p>
            </div>
          )}
        </div>

        {/* CTA Bawah */}
        <div className="glass-card rounded-4 p-4 text-center border shadow-sm">
          <h5 className="fw-bold text-dark mb-2">Ingin Terhubung dengan Redaksi Kami?</h5>
          <p className="text-secondary small mb-3">
            Punya naskah sastra, pertanyaan kurasi, atau usulan kolaborasi sastra nusantara? Kami selalu siap menyambut Anda.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <button
              onClick={() => onNavigate('kirim-karya')}
              className="btn btn-warning rounded-pill px-4 fw-semibold text-dark shadow-xs"
            >
              <i className="bi bi-feather me-1"></i> Kirim Naskah Sekarang
            </button>
            <button
              onClick={onBackToHome}
              className="btn btn-outline-dark rounded-pill px-4"
            >
              <i className="bi bi-house me-1"></i> Kembali Menjelajah
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
