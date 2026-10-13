import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Category } from '../types/database';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  isAdmin: boolean;
  userProfile?: UserProfile;
  onLogout?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories?: Category[];
  onSelectCategory?: (categoryId: string | null) => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  isAdmin,
  userProfile,
  onLogout,
  searchQuery,
  onSearchChange,
  categories = [],
  onSelectCategory,
}: NavbarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Menutup dropdown akun ketika klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Kunci scroll halaman saat offcanvas drawer terbuka
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const handleNavClick = (view: string, param?: string) => {
    setIsDrawerOpen(false);
    setIsUserMenuOpen(false);
    onNavigate(view, param);
  };

  const handleCategoryClick = (categoryId: string | null) => {
    setIsDrawerOpen(false);
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
    onNavigate('home');
  };

  return (
    <>
      <nav className="navbar navbar-expand sticky-top py-2 py-md-3 glass-navbar">
        <div className="container">
          {/* Brand Logo & Nama (Satu tombol utama tanpa menu beranda yang mendobel) */}
          <button
            className="navbar-brand fw-bold d-flex align-items-center gap-2 border-0 bg-transparent text-white p-0 me-3"
            onClick={() => handleNavClick('home')}
            title="Mentari Bersastra - Beranda"
          >
            <span
              className="badge bg-warning text-dark rounded-3 p-2 shadow-xs d-inline-flex align-items-center justify-content-center"
              style={{ width: '36px', height: '36px' }}
            >
              <i className="bi bi-feather fs-5"></i>
            </span>
            <div className="d-flex flex-column text-start">
              <span className="fs-5 tracking-tight lh-1 text-white">
                Mentari<span className="text-warning">Bersastra</span>
              </span>
              <span className="text-white-50 small" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                RUANG LITERASI & SASTRA
              </span>
            </div>
          </button>

          {/* Kolom Pencarian Cepat (Desktop & Tablet) */}
          <div className="d-none d-md-block flex-grow-1 mx-lg-4 mx-2" style={{ maxWidth: '380px' }}>
            <form onSubmit={(e) => e.preventDefault()} role="search">
              <div className="input-group input-group-sm">
                <span className="input-group-text glass-input border-end-0 text-white-50 rounded-start-pill ps-3">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="search"
                  className="form-control glass-input border-start-0 rounded-end-pill pe-3 text-white small"
                  placeholder="Cari sajak, cerpen, esai, buku..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  aria-label="Cari artikel sastra"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="btn glass-input border-start-0 text-white-50 rounded-end-pill px-2"
                    onClick={() => onSearchChange('')}
                    aria-label="Hapus kata kunci"
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Sisi Kanan: Akun Redaksi & Hamburger Menu Efek Kaca */}
          <div className="d-flex align-items-center gap-2 ms-auto">
            {/* Profil Pengguna / Tombol Masuk */}
            {isAdmin ? (
              <div className="position-relative" ref={dropdownRef}>
                <button
                  className="btn glass-input d-flex align-items-center gap-2 py-1 px-2 rounded-pill shadow-xs"
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-label="Menu Pengguna Redaksi"
                >
                  <img
                    src={userProfile?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                    alt="Avatar"
                    className="rounded-circle object-fit-cover border border-warning"
                    style={{ width: '28px', height: '28px' }}
                  />
                  <span className="text-white small fw-semibold d-none d-sm-inline pe-1">
                    {userProfile?.name?.split(' ')[0] || 'Redaksi'}
                  </span>
                  <i className="bi bi-chevron-down small text-white-50"></i>
                </button>

                {/* Dropdown Menu Akun */}
                {isUserMenuOpen && (
                  <div
                    className="dropdown-menu dropdown-menu-end show position-absolute shadow-lg border-0 py-2 mt-2 end-0 glass-dropdown rounded-4"
                    style={{ minWidth: '240px', zIndex: 1060 }}
                  >
                    <div className="px-3 py-2 border-bottom">
                      <div className="fw-bold small text-dark text-truncate">{userProfile?.name || 'Redaksi'}</div>
                      <div className="text-muted small text-truncate" style={{ fontSize: '0.75rem' }}>
                        {userProfile?.email || 'redaksi@mentaribersastra.id'}
                      </div>
                      <span className="badge bg-warning-subtle text-warning-emphasis mt-1 py-1 px-2" style={{ fontSize: '0.7rem' }}>
                        {userProfile?.role || 'Kontributor Sastra'}
                      </span>
                    </div>

                    <button
                      className="dropdown-item d-flex align-items-center gap-2 small py-2 text-dark"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleNavClick('admin-dashboard');
                      }}
                    >
                      <i className="bi bi-speedometer2 text-primary"></i>
                      <span>Dashboard Redaksi</span>
                    </button>

                    <button
                      className="dropdown-item d-flex align-items-center gap-2 small py-2 text-dark"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleNavClick('admin-profile');
                      }}
                    >
                      <i className="bi bi-person-gear text-success"></i>
                      <span>Pengaturan Profil Akun</span>
                    </button>

                    <div className="dropdown-divider my-1"></div>

                    <button
                      className="dropdown-item d-flex align-items-center gap-2 small py-2 text-danger"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (onLogout) onLogout();
                      }}
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="btn btn-warning btn-sm d-flex align-items-center gap-2 fw-semibold px-3 py-1 shadow-xs rounded-pill text-dark"
                onClick={() => handleNavClick('admin-login')}
              >
                <i className="bi bi-person-fill"></i>
                <span className="d-none d-sm-inline">Masuk / Daftar</span>
              </button>
            )}

            {/* Tombol Hamburger Menu Efek Kaca (Tersedia di semua ukuran layar) */}
            <button
              className="btn glass-hamburger-btn d-flex align-items-center justify-content-center rounded-circle p-2"
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Buka Menu Hamburger dan Navigasi"
              style={{ width: '40px', height: '40px' }}
            >
              <i className="bi bi-list fs-4 lh-1"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* OFFCANVAS DRAWER EFEK KACA (MODERN SLIDE-OUT MENU) */}
      {isDrawerOpen && (
        <>
          <div
            className="glass-drawer-backdrop"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />

          <div
            className="position-fixed top-0 end-0 bottom-0 glass-offcanvas d-flex flex-column shadow-lg"
            style={{
              width: '100%',
              maxWidth: '380px',
              zIndex: 1050,
              overflowY: 'auto',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu Navigasi Ruang Sastra"
          >
            {/* Header Drawer */}
            <div className="d-flex align-items-center justify-content-between p-3 p-md-4 border-bottom border-white-10">
              <div className="d-flex align-items-center gap-2">
                <span
                  className="badge bg-warning text-dark rounded-3 p-2 d-inline-flex align-items-center justify-content-center"
                  style={{ width: '32px', height: '32px' }}
                >
                  <i className="bi bi-feather fs-6"></i>
                </span>
                <div>
                  <div className="fw-bold text-white lh-1">Mentari<span className="text-warning">Bersastra</span></div>
                  <small className="text-white-50" style={{ fontSize: '0.72rem' }}>Menu Navigasi Literasi</small>
                </div>
              </div>

              <button
                type="button"
                className="btn glass-hamburger-btn rounded-circle d-flex align-items-center justify-content-center p-2"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Tutup Menu"
                style={{ width: '36px', height: '36px' }}
              >
                <i className="bi bi-x-lg fs-6"></i>
              </button>
            </div>

            {/* Isi Drawer */}
            <div className="p-3 p-md-4 d-flex flex-column gap-3 flex-grow-1">
              {/* Kolom Pencarian Khusus Mobile */}
              <div className="d-block d-md-none">
                <div className="input-group input-group-sm">
                  <span className="input-group-text glass-input border-end-0 text-white-50 ps-3">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="search"
                    className="form-control glass-input border-start-0 pe-3 text-white small"
                    placeholder="Cari artikel, bait puisi..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="btn glass-input border-start-0 text-white-50 px-2"
                      onClick={() => onSearchChange('')}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Akun Pengguna */}
              <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white-10">
                {isAdmin ? (
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={userProfile?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                        alt="Avatar"
                        className="rounded-circle object-fit-cover border border-warning"
                        style={{ width: '36px', height: '36px' }}
                      />
                      <div>
                        <div className="fw-semibold text-white small">{userProfile?.name || 'Redaksi'}</div>
                        <div className="badge bg-warning text-dark py-0 px-2" style={{ fontSize: '0.68rem' }}>
                          {userProfile?.role || 'Kontributor'}
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-light rounded-pill px-2 py-1 small"
                      onClick={() => handleNavClick('admin-dashboard')}
                    >
                      Dashboard
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-1">
                    <div className="small text-white-50 mb-2">Ingin berkontribusi menerbitkan karya sastra?</div>
                    <button
                      className="btn btn-sm btn-warning w-100 rounded-pill fw-semibold text-dark"
                      onClick={() => handleNavClick('admin-login')}
                    >
                      <i className="bi bi-box-arrow-in-right me-1"></i> Masuk / Daftar Akun
                    </button>
                  </div>
                )}
              </div>

              {/* Kelompok 1: Ruang Baca & Beranda */}
              <div>
                <div className="text-uppercase text-warning fw-bold small mb-2 ps-2" style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}>
                  Ruang Baca & Kategori
                </div>
                <div className="d-flex flex-column gap-1">
                  <button
                    className={`glass-drawer-item d-flex align-items-center gap-2 ${currentView === 'home' ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(null)}
                  >
                    <i className="bi bi-house-door text-warning"></i>
                    <span>Beranda Utama Tulisan</span>
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      className="glass-drawer-item d-flex align-items-center justify-content-between"
                      onClick={() => handleCategoryClick(cat.id)}
                    >
                      <div className="d-flex align-items-center gap-2 text-truncate">
                        <i className="bi bi-bookmark-heart text-white-50"></i>
                        <span className="text-truncate">{cat.name}</span>
                      </div>
                      <i className="bi bi-chevron-right small text-white-50"></i>
                    </button>
                  ))}
                </div>
              </div>

              {/* Kelompok 2: Halaman Informasi & Komitmen Redaksi (Footer Pages) */}
              <div>
                <div className="text-uppercase text-warning fw-bold small mb-2 ps-2" style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}>
                  Informasi & Komitmen Redaksi
                </div>
                <div className="d-flex flex-column gap-1">
                  <button
                    className={`glass-drawer-item d-flex align-items-center gap-2 ${currentView === 'tentang' ? 'active' : ''}`}
                    onClick={() => handleNavClick('tentang')}
                  >
                    <i className="bi bi-info-circle text-info"></i>
                    <span>Tentang Mentari Bersastra</span>
                  </button>

                  <button
                    className={`glass-drawer-item d-flex align-items-center gap-2 ${currentView === 'kirim-karya' ? 'active' : ''}`}
                    onClick={() => handleNavClick('kirim-karya')}
                  >
                    <i className="bi bi-journal-arrow-up text-warning"></i>
                    <span>Kirim Karya & Kurasi Sastra</span>
                  </button>

                  <button
                    className={`glass-drawer-item d-flex align-items-center gap-2 ${currentView === 'hak-cipta' ? 'active' : ''}`}
                    onClick={() => handleNavClick('hak-cipta')}
                  >
                    <i className="bi bi-shield-check text-success"></i>
                    <span>Hak Cipta Penulis & Karya</span>
                  </button>

                  <button
                    className={`glass-drawer-item d-flex align-items-center gap-2 ${currentView === 'kebijakan-privasi' ? 'active' : ''}`}
                    onClick={() => handleNavClick('kebijakan-privasi')}
                  >
                    <i className="bi bi-lock text-primary"></i>
                    <span>Kebijakan Privasi Pembaca</span>
                  </button>

                  <button
                    className={`glass-drawer-item d-flex align-items-center gap-2 ${currentView === 'kode-etik' ? 'active' : ''}`}
                    onClick={() => handleNavClick('kode-etik')}
                  >
                    <i className="bi bi-award text-warning"></i>
                    <span>Kode Etik Kurasi Literasi</span>
                  </button>
                </div>
              </div>

              {/* Kelompok 3: Akses Pengelola Redaksi */}
              {isAdmin && (
                <div>
                  <div className="text-uppercase text-warning fw-bold small mb-2 ps-2" style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}>
                    Akses Redaksi
                  </div>
                  <div className="d-flex flex-column gap-1">
                    <button
                      className={`glass-drawer-item d-flex align-items-center gap-2 ${currentView === 'admin-dashboard' ? 'active' : ''}`}
                      onClick={() => handleNavClick('admin-dashboard')}
                    >
                      <i className="bi bi-speedometer2 text-primary"></i>
                      <span>Dashboard & Manajemen Tulisan</span>
                    </button>
                    <button
                      className={`glass-drawer-item d-flex align-items-center gap-2 ${currentView === 'admin-profile' ? 'active' : ''}`}
                      onClick={() => handleNavClick('admin-profile')}
                    >
                      <i className="bi bi-person-gear text-success"></i>
                      <span>Profil Pengguna & Akun</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Drawer */}
            <div className="p-3 p-md-4 border-top border-white-10 mt-auto bg-black bg-opacity-25">
              <div className="d-flex justify-content-around text-white-50 fs-5 mb-3">
                <a href="#instagram" className="text-white-50 hover-text-warning" aria-label="Instagram">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#twitter" className="text-white-50 hover-text-warning" aria-label="Twitter">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="#spotify" className="text-white-50 hover-text-warning" aria-label="Spotify">
                  <i className="bi bi-spotify"></i>
                </a>
                <a href="#rss" className="text-white-50 hover-text-warning" aria-label="RSS Feed">
                  <i className="bi bi-rss"></i>
                </a>
              </div>
              <div className="text-center text-white-50 small" style={{ fontSize: '0.75rem' }}>
                <em>"Merawat keindahan bahasa, kejernihan nurani, dan martabat rasa."</em>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
