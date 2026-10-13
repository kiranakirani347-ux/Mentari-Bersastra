import React, { useState, useEffect } from 'react';
import { storageService } from '../../lib/storageService';
import {
  getSupabaseClient,
  getSupabaseConfig,
  isSupabaseConfigured,
  testSupabaseConnection,
} from '../../lib/supabaseClient';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBackToHome }: AdminLoginProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Status Diagnostik Supabase
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    loading: boolean;
  }>({
    tested: false,
    success: false,
    message: '',
    loading: false,
  });

  const [config, setConfig] = useState(getSupabaseConfig());
  const [showManualConfig, setShowManualConfig] = useState(false);
  const [manualUrl, setManualUrl] = useState(config.url || '');
  const [manualKey, setManualKey] = useState(config.anonKey || '');

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

  // Uji koneksi saat komponen pertama kali dimuat
  useEffect(() => {
    runConnectionTest();
  }, []);

  const runConnectionTest = async () => {
    setConnectionStatus((prev) => ({ ...prev, loading: true }));
    const result = await testSupabaseConnection();
    setConnectionStatus({
      tested: true,
      success: result.success,
      message: result.message,
      loading: false,
    });
    setConfig(getSupabaseConfig());
  };

  const handleSaveManualConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrl.trim() && manualKey.trim()) {
      localStorage.setItem('custom_supabase_url', manualUrl.trim());
      localStorage.setItem('custom_supabase_key', manualKey.trim());
    } else {
      localStorage.removeItem('custom_supabase_url');
      localStorage.removeItem('custom_supabase_key');
    }
    setShowManualConfig(false);
    window.location.reload();
  };

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    const email = loginEmail.trim();
    const password = loginPassword;
    const client = getSupabaseClient();

    // 1. Coba lewat Supabase jika aktif
    if (client && isSupabaseConfigured()) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Tangkap pesan error spesifik dari Supabase
          if (error.message.includes('Email not confirmed')) {
            setLoginError('Email belum dikonfirmasi di Supabase. Silakan periksa inbox email Anda atau matikan "Confirm Email" di Supabase Dashboard (Auth > Providers > Email).');
            setLoginLoading(false);
            return;
          }
          if (error.message.includes('Invalid login credentials')) {
            setLoginError('Email atau kata sandi salah menurut server Supabase Cloud.');
            setLoginLoading(false);
            return;
          }
          setLoginError(`Supabase Auth: ${error.message}`);
          setLoginLoading(false);
          return;
        }

        if (data.session) {
          storageService.setAdminLoggedIn(true);
          // Ambil nama profil dari auth metadata jika ada
          const userName = data.user?.user_metadata?.name || email.split('@')[0];
          storageService.saveProfile({
            id: data.user.id,
            name: userName,
            email: email,
            role: data.user?.user_metadata?.role || 'Pengelola Redaksi',
            bio: 'Pengguna terverifikasi Supabase Cloud.',
            avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
          });
          onLoginSuccess();
          return;
        }
      } catch (err: any) {
        setLoginError(`Koneksi Supabase bermasalah: ${err.message}`);
        setLoginLoading(false);
        return;
      }
    }

    // 2. Fallback Pengguna Lokal (jika Supabase belum aktif / mode offline)
    const registeredUsers = storageService.getRegisteredUsers();
    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      storageService.setAdminLoggedIn(true);
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

    // 3. Fallback Akun Demo
    if (email === 'admin@mentaribersastra.id' && password === 'admin123456') {
      storageService.setAdminLoggedIn(true);
      onLoginSuccess();
      return;
    }

    setLoginError('Akun tidak ditemukan. Pastikan email & kata sandi benar atau buat akun baru di tab Registrasi.');
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
      const client = getSupabaseClient();
      let supabaseMessage = '';

      // Daftar ke Supabase Auth
      if (client && isSupabaseConfigured()) {
        const { data, error } = await client.auth.signUp({
          email: regEmail.trim().toLowerCase(),
          password: regPassword,
          options: {
            data: {
              name: regName.trim(),
              role: regRole,
            },
          },
        });

        if (error) {
          setRegNotice({ type: 'danger', message: `Supabase Auth Error: ${error.message}` });
          setRegLoading(false);
          return;
        }

        if (data.user && !data.session) {
          supabaseMessage = ' (Konfirmasi email dikirimkan oleh Supabase. Jika fitur "Confirm Email" aktif, cek kotak masuk email Anda).';
        } else {
          supabaseMessage = ' (Tersinkron langsung ke Supabase Cloud).';
        }
      }

      // Simpan juga ke cache pengguna lokal
      const result = await storageService.registerUser({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
      });

      if (result.success) {
        setRegNotice({
          type: 'success',
          message: `${result.message}${supabaseMessage}`,
        });
        setLoginEmail(regEmail);
        setLoginPassword(regPassword);
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        setRegConfirmPassword('');
        setTimeout(() => {
          setActiveTab('login');
        }, 1500);
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
      <div className="card border-0 shadow-lg p-3 p-md-4 rounded-4" style={{ maxWidth: '520px', width: '100%' }}>
        {/* Brand Header */}
        <div className="text-center mb-3">
          <div className="bg-warning-subtle text-warning-emphasis rounded-circle d-inline-flex p-3 mb-2 shadow-xs border border-warning-subtle">
            <i className="bi bi-feather fs-3"></i>
          </div>
          <h4 className="fw-bold mb-1 text-dark">Portal Pengguna & Redaksi</h4>
          <p className="text-muted small">Mentari Bersastra — Ruang Karya & Literasi Nusantara</p>
        </div>

        {/* Indikator Status Koneksi Supabase */}
        <div className="card border-0 bg-light p-3 rounded-3 mb-3">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="small fw-bold text-dark d-flex align-items-center gap-2">
              <i className="bi bi-broadcast text-primary"></i> Status Database:
            </span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-decoration-none small"
              onClick={runConnectionTest}
              disabled={connectionStatus.loading}
            >
              {connectionStatus.loading ? (
                <span><span className="spinner-border spinner-border-sm me-1"></span>Menguji...</span>
              ) : (
                <span><i className="bi bi-arrow-clockwise me-1"></i>Uji Ulang</span>
              )}
            </button>
          </div>

          <div className="d-flex align-items-start gap-2 mt-1">
            <span className={`badge ${connectionStatus.success ? 'bg-success' : 'bg-warning text-dark'} py-1 px-2 mt-1`}>
              {connectionStatus.success ? 'TERHUBUNG KE CLOUD' : 'OFFLINE / LOCAL CACHE'}
            </span>
            <div className="small text-secondary flex-grow-1" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
              {connectionStatus.tested ? (
                connectionStatus.message
              ) : (
                'Memeriksa ketersediaan Environment Variables...'
              )}
            </div>
          </div>

          {/* Opsi Pengaturan Kredensial Manual jika Vercel belum redeploy */}
          <div className="mt-2 pt-2 border-top d-flex justify-content-between align-items-center">
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              Sumber: {config.source === 'vercel_env' ? 'Vercel Env' : config.source === 'local_override' ? 'Browser Override' : 'Belum Terisi'}
            </span>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-primary small text-decoration-none"
              style={{ fontSize: '0.75rem' }}
              onClick={() => setShowManualConfig(!showManualConfig)}
            >
              <i className="bi bi-sliders me-1"></i>
              {showManualConfig ? 'Tutup Pengaturan Kredensial' : 'Isi Kredensial di Browser'}
            </button>
          </div>

          {showManualConfig && (
            <form onSubmit={handleSaveManualConfig} className="mt-3 pt-2 border-top">
              <div className="mb-2">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Supabase URL</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="https://xxx.supabase.co"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Supabase Anon Key</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  placeholder="eyJhbGciOi..."
                  value={manualKey}
                  onChange={(e) => setManualKey(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm w-100 py-1 mt-1">
                Simpan & Muat Ulang Browser
              </button>
            </form>
          )}
        </div>

        {/* Tab Navigasi: Masuk vs Registrasi */}
        <ul className="nav nav-pills nav-fill bg-light p-1 rounded-3 mb-3">
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
              <i className="bi bi-person-plus me-1"></i> Buat Akun Baru
            </button>
          </li>
        </ul>

        {/* ===================== TAB 1: FORM LOGIN ===================== */}
        {activeTab === 'login' && (
          <div>
            {loginError && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3 rounded-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                <div style={{ fontSize: '0.85rem' }}>{loginError}</div>
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
                    placeholder="nama@email.com"
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
                    <span>Memverifikasi Akun...</span>
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

        {/* ===================== TAB 2: FORM REGISTRASI ===================== */}
        {activeTab === 'register' && (
          <div>
            {regNotice && (
              <div className={`alert alert-${regNotice.type} py-2 small d-flex align-items-start gap-2 mb-3 rounded-3`} role="alert">
                <i className={`bi ${regNotice.type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'} fs-5 mt-1`}></i>
                <div style={{ fontSize: '0.85rem' }}>{regNotice.message}</div>
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
                    placeholder="Nama Lengkap Anda..."
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
                    placeholder="nama@email.com"
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
                    <span>Mendaftarkan ke Database...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-check-fill"></i>
                    <span>Daftarkan Akun Baru</span>
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
