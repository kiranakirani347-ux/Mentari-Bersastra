import React, { useState } from 'react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupabaseModal({ isOpen, onClose }: SupabaseModalProps) {
  const [supabaseUrl, setSupabaseUrl] = useState(
    () => localStorage.getItem('custom_supabase_url') || ''
  );
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(
    () => localStorage.getItem('custom_supabase_key') || ''
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (supabaseUrl.trim()) {
      localStorage.setItem('custom_supabase_url', supabaseUrl.trim());
      localStorage.setItem('custom_supabase_key', supabaseAnonKey.trim());
    } else {
      localStorage.removeItem('custom_supabase_url');
      localStorage.removeItem('custom_supabase_key');
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1060 }}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-md">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-dark text-white py-3">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-database-fill-gear text-success"></i>
              <span>Status & Konfigurasi Supabase</span>
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSave}>
            <div className="modal-body p-4 bg-light">
              <div className="alert alert-success d-flex align-items-start gap-2 mb-3 py-2 small">
                <i className="bi bi-check-circle-fill text-success fs-5"></i>
                <div>
                  <strong>Mode Penyimpanan Siap Pakai:</strong>
                  <br />
                  Aplikasi saat ini aktif dan menyimpan artikel secara otomatis. Skrip DDL PostgreSQL lengkap tersedia di file <code>supabase.sql</code> di root proyek.
                </div>
              </div>

              {savedSuccess && (
                <div className="alert alert-info py-2 small">
                  Kredensial berhasil diperbarui!
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-semibold">Supabase Project URL</label>
                <input
                  type="url"
                  className="form-control form-control-sm"
                  placeholder="https://your-project.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Supabase Public Anon Key</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                />
              </div>

              <div className="card border-0 bg-white p-3 rounded small text-muted">
                <div className="fw-bold text-dark mb-1">
                  <i className="bi bi-folder-check text-primary me-1"></i> Dokumentasi Deployment:
                </div>
                <div>Periksa folder <code>deployment/</code> di dalam workspace:</div>
                <ul className="mb-0 ps-3 mt-1">
                  <li><code>deployment/VERCEL_DEPLOYMENT_GUIDE.md</code></li>
                  <li><code>deployment/SUPABASE_SETUP_CHECKLIST.md</code></li>
                  <li><code>deployment/TROUBLESHOOTING.md</code></li>
                </ul>
              </div>
            </div>

            <div className="modal-footer bg-white border-top py-2">
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
                Tutup
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Simpan Konfigurasi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
