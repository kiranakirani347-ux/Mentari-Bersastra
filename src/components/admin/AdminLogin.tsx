import React, { useState } from 'react';
import { storageService } from '../../lib/storageService';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBackToHome }: AdminLoginProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState('Penulis Kontributor');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regNotice, setRegNotice] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    const email = loginEmail.trim();
    const password = loginPassword;

    // 1. Coba lewat Supabase jika kredensial aktif
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data.session) {
          storageService.setAdminLoggedIn(true);
          onLoginSuccess();
          return;
        } else if (error) {
          // Jika gagal di Supabase, coba cek apakah user ada di data pengguna lokal
          console.warn('Supabase login:', error.message);
        }
      } catch (err: any) {
        console.warn('Supabase login exception:', err.message);
      }
    }

    // 2. Cek pengguna lokal (termasuk yang baru saja didaftarkan di tab registrasi)
    const registeredUsers = storageService.getRegisteredUsers();
    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      storageService.setAdminLoggedIn(true);
      // Perbarui profil aktif ke user yang baru login
      storageService.saveProfile({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        bio: `Penulis & kontributor literasi pada Mentari Bersastra.`,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(foundUser.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
      });
      onLoginSuccess();
      return;
    }

    // 3. Fallback demo admin jika belum ada user lain
    if (email === 'admin@mentaribersastra.id' && password === 'admin123456') {
      storageService.setAdminLoggedIn(true);
      onLoginSuccess();
      return;
    }

    setLoginError('Email atau kata sandi tidak cocok. Silakan periksa kembali atau buat akun baru.');
    setLoginLoading(false);
  };

  // Handle Registrasi Pengguna Baru
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegNotice(null);

    if (!regName.trim() || !regEmail.trim()) {
      setRegNotice({ type: 'danger', message: 'Nama lengkap dan alamat email wajib diisi.' });
      return;
    }

    if (regPassword.length < 6) {
      setRegNotice({ type: 'danger', message: 'Kata sandi minimal 6 karakter.' });
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegNotice({ type: 'danger', message: 'Konfirmasi kata sandi tidak cocok.' });
      return;
    }

    setRegLoading(true);

    try {
      const result = await storageService.registerUser({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
      });

      if (result.success) {
        setRegNotice({
          type: 'success',
          message: `${result.message} Silakan masuk menggunakan akun baru Anda.`,
        });
        // Siapkan email di form login
        setLoginEmail(regEmail);
        setLoginPassword(regPassword);
        // Reset form registrasi
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        setRegConfirmPassword('');
        // Pindah ke tab login
        setTimeout(() => {
          setActiveTab('login');
        }, 1200);
      } else {
        setRegNotice({ type: 'danger', message: result.message });
      }
    } catch (err: any) {
      setRegNotice({ type: 'danger', message: err.message || 'Gagal mendaftarkan akun baru.' });
    } finally {
      setRegLoading(false);
    }
  };

  const handleQuickDemo = () => {
    storageService.setAdminLoggedIn(true);
    onLoginSuccess();
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-5 px-3 min-vh-75">
      <div className="card border-0 shadow-lg p-3 p-md-4 rounded-4" style={{ maxWidth: '480px', width: '100%' }}>
        {/* Brand Header */}
        <div className="text-center mb-3">
          <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex p-3 mb-2 shadow-xs">
            <i className="bi bi-feather fs-3"></i>
          </div>
          <h4 className="fw-bold mb-1 text-dark">Portal Pengguna & Redaksi</h4>
          <p className="text-muted small">Mentari Bersastra — Ruang Karya & Literasi Nusantara</p>
        </div>

        {/* Tab Navigasi: Masuk vs Registrasi */}
        <ul className="nav nav-pills nav-fill bg-light p-1 rounded-3 mb-4">
          <li className="nav-item">
            <button
              className={`nav-link py-2 fw-semibold small ${activeTab === 'login' ? 'active shadow-xs' : 'text-muted'}`}
              type="button"
              onClick={() => {
                setActiveTab('login');
                setLoginError('');
              }}
            >
              <i className="bi bi-box-arrow-in-right me-1"></i> Masuk Akun
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link py-2 fw-semibold small ${activeTab === 'register' ? 'active shadow-xs' : 'text-muted'}`}
              type="button"
              onClick={() => {
                setActiveTab('register');
                setRegNotice(null);
              }}
            >
              <i className="bi bi-person-plus me-1"></i> Tambah / Daftar User
            </button>
          </li>
        </ul>

        {/* ===================== TAB 1: FORM LOGIN ===================== */}
        {activeTab === 'login' && (
          <div>
            {loginError && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3 rounded-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Alamat Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="nama@mentaribersastra.id"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Kata Sandi</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-key"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold mb-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Memverifikasi Akses...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right"></i>
                    <span>Masuk ke Portal</span>
                  </>
                )}
              </button>

              <div className="text-center pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm w-100 py-2 fw-semibold mb-2 shadow-xs"
                  onClick={handleQuickDemo}
                >
                  <i className="bi bi-lightning-charge me-1"></i> Masuk Instan (Akses Redaksi Dewi Anjani)
                </button>
                <button
                  type="button"
                  className="btn btn-link text-decoration-none text-muted small p-0"
                  onClick={onBackToHome}
                >
                  <i className="bi bi-arrow-left me-1"></i> Kembali ke Beranda Mentari Bersastra
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================== TAB 2: FORM REGISTRASI USER ===================== */}
        {activeTab === 'register' && (
          <div>
            {regNotice && (
              <div className={`alert alert-${regNotice.type} py-2 small d-flex align-items-center gap-2 mb-3 rounded-3`} role="alert">
                <i className={`bi ${regNotice.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
                <span>{regNotice.message}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit}>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Nama Lengkap Penulis / Pengguna</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Bagus Wicaksono"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Alamat Email Aktif</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="email@domain.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Peran Pengguna</label>
                <select
                  className="form-select"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                >
                  <option value="Penulis Kontributor">Penulis Kontributor</option>
                  <option value="Kurator Sastra">Kurator Sastra</option>
                  <option value="Pengelola Redaksi">Pengelola Redaksi</option>
                  <option value="Pembaca & Penelaah">Pembaca & Penelaah</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Kata Sandi</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Minimal 6 karakter"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Konfirmasi Kata Sandi</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-shield-check"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Ketik ulang kata sandi"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 py-2 fw-semibold mb-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                disabled={regLoading}
              >
                {regLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Mendaftarkan Pengguna...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-check-fill"></i>
                    <span>Daftarkan Pengguna Baru</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2 border-top">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none text-muted small p-0"
                  onClick={onBackToHome}
                >
                  <i className="bi bi-arrow-left me-1"></i> Kembali ke Beranda Mentari Bersastra
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
