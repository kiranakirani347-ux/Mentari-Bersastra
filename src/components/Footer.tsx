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
              <span className="badge bg-primary rounded-3 p-2">
                <i className="bi bi-journal-code fs-5"></i>
              </span>
              <h5 className="fw-bold mb-0 text-dark">ModernBlog</h5>
            </div>
            <p className="text-secondary small pe-lg-4 mb-3">
              Jurnal publikasi digital independen yang menyajikan artikel terkurasi seputar rekayasa perangkat lunak, arsitektur komputasi modern, dan desain produk digital.
            </p>
            <div className="d-flex gap-3 text-secondary fs-5">
              <a href="#github" className="text-secondary hover-primary" aria-label="GitHub">
                <i className="bi bi-github"></i>
              </a>
              <a href="#twitter" className="text-secondary hover-primary" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#linkedin" className="text-secondary hover-primary" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#rss" className="text-secondary hover-primary" aria-label="RSS Feed">
                <i className="bi bi-rss"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-3 col-6">
            <h6 className="fw-bold text-dark mb-3">Navigasi</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-2">
                <button
                  className="btn btn-link p-0 text-secondary text-decoration-none small"
                  onClick={onNavigateToHome}
                >
                  Beranda Artikel
                </button>
              </li>
              <li className="mb-2">
                <a href="#about" className="text-secondary text-decoration-none">
                  Tentang Redaksi
                </a>
              </li>
              <li className="mb-2">
                <a href="#contact" className="text-secondary text-decoration-none">
                  Kontak & Kerjasama
                </a>
              </li>
              <li className="mb-2">
                <button
                  className="btn btn-link p-0 text-secondary text-decoration-none small"
                  onClick={onNavigateToAdmin}
                >
                  Portal Pengelola
                </button>
              </li>
            </ul>
          </div>

          <div className="col-lg-4 col-6">
            <h6 className="fw-bold text-dark mb-3">Kebijakan</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-2">
                <a href="#privacy" className="text-secondary text-decoration-none">
                  Kebijakan Privasi
                </a>
              </li>
              <li className="mb-2">
                <a href="#terms" className="text-secondary text-decoration-none">
                  Syarat & Ketentuan
                </a>
              </li>
              <li className="mb-2">
                <a href="#guidelines" className="text-secondary text-decoration-none">
                  Pedoman Komunitas
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-top d-flex flex-column flex-md-row align-items-center justify-content-between text-muted small gy-2">
          <div>
            &copy; {new Date().getFullYear()} ModernBlog Media. Seluruh hak cipta dilindungi.
          </div>
          <div className="mt-2 mt-md-0">
            Dikelola secara profesional oleh Tim Redaksi.
          </div>
        </div>
      </div>
    </footer>
  );
}
