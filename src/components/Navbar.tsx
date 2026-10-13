import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types/database';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  isAdmin: boolean;
  userProfile?: UserProfile;
  onLogout?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  isAdmin,
  userProfile,
  onLogout,
  searchQuery,
  onSearchChange,
}: NavbarProps) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Menutup dropdown ketika user mengklik di luar menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-2">
      <div className="container">
        {/* Brand Logo & Teks Mentari Bersastra */}
        <button
          className="navbar-brand fw-bold d-flex align-items-center gap-2 border-0 bg-transparent text-white p-0 me-3"
          onClick={() => {
            onNavigate('home');
            setIsNavCollapsed(true);
          }}
        >
          <span className="badge bg-warning text-dark rounded-3 p-2 shadow-xs">
            <i className="bi bi-feather fs-5"></i>
          </span>
          <span className="fs-5 tracking-tight">Mentari<span className="text-warning">Bersastra</span></span>
        </button>

        {/* PROFIL & TOGGLE KANAN */}
        <div className="d-flex align-items-center gap-2 order-lg-last ms-auto ms-lg-0">
          {isAdmin ? (
            <div className="position-relative" ref={dropdownRef}>
              <button
                className="btn btn-dark border-secondary btn-sm d-flex align-items-center gap-2 py-1 px-2 rounded-pill shadow-xs"
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label="Menu Profil Akun"
              >
                <img
                  src={userProfile?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                  alt="Avatar"
                  className="rounded-circle object-fit-cover"
                  style={{ width: '28px', height: '28px' }}
                />
                <span className="text-white small fw-semibold d-none d-sm-inline pe-1">
                  {userProfile?.name?.split(' ')[0] || 'Redaksi'}
                </span>
                <i className="bi bi-chevron-down small text-muted"></i>
              </button>

              {isUserMenuOpen && (
                <div
                  className="dropdown-menu dropdown-menu-end show position-absolute shadow-lg border-0 py-2 mt-2 end-0 bg-white rounded-3"
                  style={{ minWidth: '230px', zIndex: 1060 }}
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
                    className="dropdown-item d-flex align-items-center gap-2 small py-2"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate('admin-dashboard');
                    }}
                  >
                    <i className="bi bi-speedometer2 text-primary"></i>
                    <span>Dashboard Karya & Redaksi</span>
                  </button>

                  <button
                    className="dropdown-item d-flex align-items-center gap-2 small py-2"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate('admin-profile');
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
              onClick={() => {
                onNavigate('admin-login');
                setIsNavCollapsed(true);
              }}
            >
              <i className="bi bi-person-fill"></i>
              <span>Masuk / Daftar</span>
            </button>
          )}

          {/* Tombol Hamburger Khusus Mobile */}
          <button
            className="navbar-toggler border-0 p-1 ms-1"
            type="button"
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            aria-controls="navbarMainContent"
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" style={{ width: '1.25em', height: '1.25em' }}></span>
          </button>
        </div>

        {/* Konten Menu yang Di-Collapse */}
        <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="navbarMainContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <button
                className={`nav-link border-0 bg-transparent ${currentView === 'home' ? 'active fw-semibold text-white' : ''}`}
                onClick={() => {
                  onNavigate('home');
                  setIsNavCollapsed(true);
                }}
              >
                <i className="bi bi-book me-1"></i> Beranda Sastra
              </button>
            </li>
          </ul>

          {/* Kolom Pencarian */}
          <form
            className="d-flex align-items-center me-lg-3 my-2 my-lg-0"
            onSubmit={(e) => e.preventDefault()}
            role="search"
          >
            <div className="input-group input-group-sm" style={{ maxWidth: '280px' }}>
              <span className="input-group-text bg-dark border-secondary text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="search"
                className="form-control bg-dark text-white border-secondary small"
                placeholder="Cari bait puisi, prosa, esai..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Cari artikel"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn btn-dark border-secondary text-muted"
                  onClick={() => onSearchChange('')}
                  aria-label="Hapus pencarian"
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
}
