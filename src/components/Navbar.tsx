import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types/database';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  isAdmin: boolean;
  userProfile?: UserProfile;
  onOpenProfileModal?: () => void;
  onLogout?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  isAdmin,
  userProfile,
  onOpenProfileModal,
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
        {/* Brand Logo & Teks */}
        <button
          className="navbar-brand fw-bold d-flex align-items-center gap-2 border-0 bg-transparent text-white p-0 me-3"
          onClick={() => {
            onNavigate('home');
            setIsNavCollapsed(true);
          }}
        >
          <span className="badge bg-primary rounded-3 p-2">
            <i className="bi bi-journal-code fs-5"></i>
          </span>
          <span className="fs-5 tracking-tight">Modern<span className="text-primary">Blog</span></span>
        </button>

        {/* PROFIL & TOGGLE KANAN: Berada DI LUAR menu hamburger sehingga selalu tampak */}
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
                  src={userProfile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt="Avatar"
                  className="rounded-circle object-fit-cover"
                  style={{ width: '28px', height: '28px' }}
                />
                <span className="text-white small fw-semibold d-none d-sm-inline pe-1">
                  {userProfile?.name?.split(' ')[0] || 'Admin'}
                </span>
                <i className="bi bi-chevron-down small text-muted"></i>
              </button>

              {isUserMenuOpen && (
                <div
                  className="dropdown-menu dropdown-menu-end show position-absolute shadow-lg border-0 py-2 mt-2 end-0 bg-white rounded-3"
                  style={{ minWidth: '220px', zIndex: 1060 }}
                >
                  <div className="px-3 py-2 border-bottom">
                    <div className="fw-bold small text-dark text-truncate">{userProfile?.name || 'Administrator'}</div>
                    <div className="text-muted small text-truncate" style={{ fontSize: '0.75rem' }}>
                      {userProfile?.email || 'admin@modernblog.com'}
                    </div>
                  </div>

                  <button
                    className="dropdown-item d-flex align-items-center gap-2 small py-2"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate('admin-dashboard');
                    }}
                  >
                    <i className="bi bi-speedometer2 text-primary"></i>
                    <span>Dashboard Artikel</span>
                  </button>

                  <button
                    className="dropdown-item d-flex align-items-center gap-2 small py-2"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate('admin-profile');
                    }}
                  >
                    <i className="bi bi-person-circle text-success"></i>
                    <span>Halaman Profil Akun</span>
                  </button>

                  <button
                    className="dropdown-item d-flex align-items-center gap-2 small py-2"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      if (onOpenProfileModal) onOpenProfileModal();
                    }}
                  >
                    <i className="bi bi-sliders text-secondary"></i>
                    <span>Modal Edit Cepat</span>
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
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
              onClick={() => {
                onNavigate('admin-login');
                setIsNavCollapsed(true);
              }}
            >
              <i className="bi bi-shield-lock"></i>
              <span className="d-none d-sm-inline">Portal Pengelola</span>
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

        {/* Konten Menu yang Di-Collapse (Hanya Tautan & Kolom Cari) */}
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
                <i className="bi bi-house me-1"></i> Beranda
              </button>
            </li>
          </ul>

          {/* Kolom Pencarian */}
          {currentView === 'home' && (
            <div className="d-flex align-items-center my-2 my-lg-0 me-lg-3">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-secondary border-secondary text-light">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Cari artikel..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    type="button"
                    onClick={() => onSearchChange('')}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
