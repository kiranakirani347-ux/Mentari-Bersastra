import React from 'react';

interface HeroProps {
  totalPosts: number;
  totalCategories: number;
  totalViews: number;
  onExplore: () => void;
  selectedCategoryName?: string;
  onResetCategory: () => void;
}

export default function Hero({
  totalPosts,
  totalCategories,
  totalViews,
  onExplore,
  selectedCategoryName,
  onResetCategory,
}: HeroProps) {
  return (
    <section className="bg-white border-bottom py-5 mb-4 position-relative overflow-hidden">
      <div className="container py-3">
        <div className="row align-items-center gy-4">
          <div className="col-lg-8 text-center text-lg-start">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 bg-primary-subtle text-primary rounded-pill small fw-semibold mb-3">
              <i className="bi bi-patch-check-fill"></i> Jurnal Rekayasa Perangkat Lunak & Teknologi
            </div>

            <h1 className="display-5 fw-bold text-dark mb-3">
              Wawasan Mendalam & Praktik Rekayasa Web
            </h1>

            <p className="lead text-secondary mb-4" style={{ maxWidth: '640px' }}>
              Temukan tulisan terpilih mengenai arsitektur sistem skala besar, performa web, dan rekayasa data terkini yang dirancang untuk insinyur perangkat lunak.
            </p>

            {selectedCategoryName ? (
              <div className="d-flex align-items-center gap-2 justify-content-center justify-content-lg-start">
                <span className="badge bg-primary fs-6 py-2 px-3">
                  Kategori: {selectedCategoryName}
                </span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={onResetCategory}
                >
                  <i className="bi bi-x-circle me-1"></i> Tampilkan Semua
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-3">
                <button
                  className="btn btn-primary px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
                  onClick={onExplore}
                >
                  <span>Mulai Membaca</span>
                  <i className="bi bi-arrow-down"></i>
                </button>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm bg-light p-3">
              <h6 className="fw-bold text-muted small text-uppercase mb-3">
                Statistik Redaksi
              </h6>
              <div className="row g-2 text-center">
                <div className="col-4">
                  <div className="bg-white p-2 rounded shadow-xs border">
                    <div className="fs-4 fw-bold text-primary">{totalPosts}</div>
                    <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Artikel</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="bg-white p-2 rounded shadow-xs border">
                    <div className="fs-4 fw-bold text-success">{totalCategories}</div>
                    <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Kategori</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="bg-white p-2 rounded shadow-xs border">
                    <div className="fs-4 fw-bold text-info">{totalViews.toLocaleString()}</div>
                    <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Pembaca</div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-top small text-muted d-flex align-items-center gap-2">
                <i className="bi bi-award text-primary fs-5"></i>
                <span>Artikel Terkurasi & Bebas Distraksi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
