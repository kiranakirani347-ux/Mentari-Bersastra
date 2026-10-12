import React, { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBackToHome }: AdminLoginProps) {
  const [email, setEmail] = useState('admin@modernblog.com');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Simulasi otentikasi Supabase
    setTimeout(() => {
      if (email.trim() && password.length >= 6) {
        onLoginSuccess();
      } else {
        setErrorMsg('Email atau kata sandi tidak valid. Minimal 6 karakter.');
        setLoading(false);
      }
    }, 600);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-5 px-3 min-vh-75">
      <div className="card border-0 shadow-lg p-4 p-md-5" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="bg-primary text-white rounded-circle d-inline-flex p-3 mb-3 shadow-sm">
            <i className="bi bi-shield-lock-fill fs-3"></i>
          </div>
          <h4 className="fw-bold mb-1">Admin Portal</h4>
          <p className="text-muted small">Masuk untuk mengelola artikel & kategori blog</p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2 small d-flex align-items-center gap-2" role="alert">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email Pengelola</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-semibold mb-3 shadow-sm"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Memverifikasi...
              </>
            ) : (
              'Masuk dengan Kredensial'
            )}
          </button>

          {/* Quick Demo Access Button */}
          <div className="text-center pt-2 border-top">
            <button
              type="button"
              className="btn btn-outline-success btn-sm w-100 py-2 fw-semibold mb-3"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              <i className="bi bi-box-arrow-in-right me-1"></i> Masuk Instan (Akses Demo)
            </button>
            <button
              type="button"
              className="btn btn-link text-decoration-none text-muted small p-0"
              onClick={onBackToHome}
            >
              <i className="bi bi-arrow-left me-1"></i> Kembali ke Beranda Publik
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
