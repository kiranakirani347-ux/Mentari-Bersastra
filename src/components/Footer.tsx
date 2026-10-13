import React from 'react';

interface FooterProps {
  onNavigate: (view: any, param?: string) => void;
  isAdmin: boolean;
}

export default function Footer({ onNavigate, isAdmin }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-footer py-5 mt-auto border-top">
      <div className="container">
        <div className="row gy-4 mb-5">
          {/* Kolom 1: Profil Brand Mentari Bersastra */}
          <div className="col-lg-5 col-md-6">
            <button
              onClick={() => onNavigate('home')}
              className="d-flex align-items-center gap-2 mb-3 border-0 bg-transparent p-0 text-start"
            >
              <span
                className="badge bg-warning text-dark rounded-3 p-2 shadow-xs d-inline-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px' }}
              >
                <i className="bi bi-feather fs-5"></i>
              </span>
              <span className="fs-5 fw-bold text-dark lh-1">
                Mentari<span className="text-warning-emphasis"> Bersastra</span>
              </span>
            </button>

            <p className="text-secondary small pe-lg-4 mb-4 lh-base" style={{ maxWidth: '420px' }}>
              Ruang publikasi literatur, bait sajak puisi pilihan, cerpen, esai kritis kebudayaan, dan apresiasi buku nusantara yang berdedikasi merawat keindahan bahasa, kejernihan nurani, dan martabat rasa.
            </p>

            {/* Kanal Komunitas Literasi */}
            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted me-2">Ikuti Kami:</span>
              <a
                href="#instagram"
                className="btn btn-sm btn-light border rounded-circle d-inline-flex align-items-center justify-content-center text-secondary hover-primary shadow-xs"
                style={{ width: '36px', height: '36px' }}
                aria-label="Instagram Resmi Mentari Bersastra"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="#twitter"
                className="btn btn-sm btn-light border rounded-circle d-inline-flex align-items-center justify-content-center text-secondary hover-primary shadow-xs"
                style={{ width: '36px', height: '36px' }}
                aria-label="Akun X Twitter Mentari Bersastra"
              >
                <i className="bi bi-twitter-x"></i>
              </a>
              <a
                href="#spotify"
                className="btn btn-sm btn-light border rounded-circle d-inline-flex align-items-center justify-content-center text-secondary hover-primary shadow-xs"
                style={{ width: '36px', height: '36px' }}
                aria-label="Podcast Sastra Mentari di Spotify"
              >
                <i className="bi bi-spotify"></i>
              </a>
              <a
                href="#rss"
                className="btn btn-sm btn-light border rounded-circle d-inline-flex align-items-center justify-content-center text-secondary hover-primary shadow-xs"
                style={{ width: '36px', height: '36px' }}
                aria-label="Sindikasi RSS Feed Literasi"
              >
                <i className="bi bi-rss"></i>
              </a>
            </div>
          </div>

          {/* Kolom 2: Navigasi Ruang Baca */}
          <div className="col-lg-3 col-6">
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-compass text-warning"></i>
              <span>Navigasi Ruang Baca</span>
            </h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li>
                <button
                  className="btn btn-link p-0 text-secondary text-decoration-none small text-start d-inline-flex align-items-center gap-2 hover-text-dark"
                  onClick={() => onNavigate('home')}
                >
                  <i className="bi bi-chevron-right text-muted" style={{ fontSize: '0.7rem' }}></i>
                  <span>Beranda Tulisan</span>
                </button>
              </li>
              <li>
                <button
                  className="btn btn-link p-0 text-secondary text-decoration-none small text-start d-inline-flex align-items-center gap-2 hover-text-dark"
                  onClick={() => onNavigate('tentang')}
                >
                  <i className="bi bi-chevron-right text-muted" style={{ fontSize: '0.7rem' }}></i>
                  <span>Tentang Mentari Bersastra</span>
                </button>
              </li>
              <li>
                <button
                  className="btn btn-link p-0 text-secondary text-decoration-none small text-start d-inline-flex align-items-center gap-2 hover-text-dark"
                  onClick={() => onNavigate('kirim-karya')}
                >
                  <i className="bi bi-chevron-right text-muted" style={{ fontSize: '0.7rem' }}></i>
                  <span>Kirim Karya & Kurasi</span>
                </button>
              </li>
              <li>
                <button
                  className="btn btn-link p-0 text-secondary text-decoration-none small text-start d-inline-flex align-items-center gap-2 hover-text-dark"
                  onClick={() => onNavigate(isAdmin ? 'admin-dashboard' : 'admin-login')}
                >
                  <i className="bi bi-chevron-right text-muted" style={{ fontSize: '0.7rem' }}></i>
                  <span>Portal Pengguna & Redaksi</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Komitmen & Kebijakan */}
          <div className="col-lg-4 col-6">
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-shield-check text-success"></i>
              <span>Komitmen & Kebijakan</span>
            </h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li>
                <button
                  className="btn btn-link p-0 text-secondary text-decoration-none small text-start d-inline-flex align-items-center gap-2 hover-text-dark"
                  onClick={() => onNavigate('hak-cipta')}
                >
                  <i className="bi bi-chevron-right text-muted" style={{ fontSize: '0.7rem' }}></i>
                  <span>Hak Cipta Penulis & Hak Cipta Karya</span>
                </button>
              </li>
              <li>
                <button
                  className="btn btn-link p-0 text-secondary text-decoration-none small text-start d-inline-flex align-items-center gap-2 hover-text-dark"
                  onClick={() => onNavigate('kebijakan-privasi')}
                >
                  <i className="bi bi-chevron-right text-muted" style={{ fontSize: '0.7rem' }}></i>
                  <span>Kebijakan Privasi Pembaca</span>
                </button>
              </li>
              <li>
                <button
                  className="btn btn-link p-0 text-secondary text-decoration-none small text-start d-inline-flex align-items-center gap-2 hover-text-dark"
                  onClick={() => onNavigate('kode-etik')}
                >
                  <i className="bi bi-chevron-right text-muted" style={{ fontSize: '0.7rem' }}></i>
                  <span>Kode Etik Kurasi Literasi</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Baris Bawah Copyright & Kutipan */}
        <div className="pt-4 border-top d-flex flex-column flex-md-row align-items-center justify-content-between text-muted small gap-2">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-light text-dark border">ID</span>
            <span>&copy; {currentYear} Mentari Bersastra. Seluruh hak cipta karya sastra dilindungi.</span>
          </div>
          <div className="text-secondary text-center text-md-end fst-italic">
            "Merayakan keindahan bahasa dan dialektika sastra Indonesia."
          </div>
        </div>
      </div>
    </footer>
  );
}
