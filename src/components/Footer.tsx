import React from 'react';

interface FooterProps {
  onNavigateToHome: () => void;
  onNavigateToAdmin: () => void;
}

export default function Footer({ onNavigateToHome, onNavigateToAdmin }: FooterProps) {
  return (
    <footer className="bg-white border-top py-5 mt-auto">
      <div className="container">
        <div className="row gy-4 mb-4">
          <div className="col-lg-5 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-warning text-dark rounded-3 p-2 shadow-xs">
                <i className="bi bi-feather fs-5"></i>
              </span>
              <h5 className="fw-bold mb-0 text-dark">
                Mentari<span className="text-warning-emphasis"> Bersastra</span>
              </h5>
            </div>
            <p className="text-secondary small pe-lg-4 mb-3">
              Ruang publikasi literatur, bait sajak puisi pilihan, cerpen, esai kritis kebudayaan, dan apresiasi buku nusantara yang berdedikasi merawat keindahan bahasa, kejernihan nurani, dan martabat rasa.
            </p>
            <div className="d-flex gap-3 text-secondary fs-5">
              <a href="#instagram" className="text-secondary hover-primary" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#twitter" className="text-secondary hover-primary" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#spotify" className="text-secondary hover-primary" aria-label="Podcast Sastra">
                <i className="bi bi-spotify"></i>
              </a>
              <a href="#rss" className="text-secondary hover-primary" aria-label="RSS Feed">
                <i className="bi bi-rss"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-3 col-6">
            <h6 className="fw-bold text-dark mb-3">Navigasi Ruang Baca</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-2">
                <button
                  className="btn btn-link p-0 text-secondary text-decoration-none small"
                  onClick={onNavigateToHome}
                >
                  Beranda Tulisan
                </button>
              </li>
              <li className="mb-2">
                <a href="#about" className="text-secondary text-decoration-none">
                  Tentang Mentari Bersastra
                </a>
              </li>
              <li className="mb-2">
                <a href="#pedoman" className="text-secondary text-decoration-none">
                  Kirim Karya & Kurasi
                </a>
              </li>
              <li className="mb-2">
                <button
                  className="btn btn-link p-0 text-secondary text-decoration-none small"
                  onClick={onNavigateToAdmin}
                >
                  Portal Pengguna & Redaksi
                </button>
              </li>
            </ul>
          </div>

          <div className="col-lg-4 col-6">
            <h6 className="fw-bold text-dark mb-3">Komitmen & Kebijakan</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-2">
                <a href="#copyright" className="text-secondary text-decoration-none">
                  Hak Cipta Penulis & Hak Cipta Karya
                </a>
              </li>
              <li className="mb-2">
                <a href="#privacy" className="text-secondary text-decoration-none">
                  Kebijakan Privasi Pembaca
                </a>
              </li>
              <li className="mb-2">
                <a href="#guidelines" className="text-secondary text-decoration-none">
                  Kode Etik Kurasi Literasi
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-top d-flex flex-column flex-md-row align-items-center justify-content-between text-muted small gy-2">
          <div>
            &copy; {new Date().getFullYear()} Mentari Bersastra. Seluruh hak cipta karya sastra dilindungi.
          </div>
          <div className="mt-2 mt-md-0 text-secondary">
            Merayakan keindahan bahasa dan dialektika sastra Indonesia.
          </div>
        </div>
      </div>
    </footer>
  );
}
