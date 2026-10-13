import React, { useState } from 'react';
import { UserProfile } from '../../types/database';

interface AdminProfilePageProps {
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onBackToDashboard: () => void;
  onBackToHome: () => void;
}

export default function AdminProfilePage({
  profile,
  onSaveProfile,
  onBackToDashboard,
  onBackToHome,
}: AdminProfilePageProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [role, setRole] = useState(profile.role);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [website, setWebsite] = useState(profile.website || '');
  const [github, setGithub] = useState(profile.github || '');
  const [twitter, setTwitter] = useState(profile.twitter || '');

  // Pengaturan kata sandi
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notice, setNotice] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setNotice({ type: 'danger', message: 'Nama lengkap dan Email wajib diisi!' });
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setNotice({ type: 'danger', message: 'Kata sandi baru minimal 6 karakter.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setNotice({ type: 'danger', message: 'Konfirmasi kata sandi baru tidak cocok.' });
        return;
      }
    }

    onSaveProfile({
      ...profile,
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      bio: bio.trim(),
      avatar_url: avatarUrl.trim(),
      website: website.trim() || undefined,
      github: github.trim() || undefined,
      twitter: twitter.trim() || undefined,
    });

    setNotice({ type: 'success', message: 'Profil akun redaksi dan pengaturan berhasil diperbarui!' });
    setNewPassword('');
    setConfirmPassword('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container py-4 pb-5" style={{ maxWidth: '860px' }}>
      {/* Navigasi Breadcrumbs */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2 pb-3 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 small text-muted mb-1">
            <button className="btn btn-link p-0 text-muted text-decoration-none small" onClick={onBackToHome}>
              Beranda
            </button>
            <span>/</span>
            <button className="btn btn-link p-0 text-muted text-decoration-none small" onClick={onBackToDashboard}>
              Dashboard
            </button>
            <span>/</span>
            <span className="text-dark fw-semibold">Profil Pengguna</span>
          </div>
          <h2 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
            <i className="bi bi-person-gear text-primary"></i>
            <span>Pengaturan Profil & Akun</span>
          </h2>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 shadow-xs"
            onClick={onBackToDashboard}
          >
            <i className="bi bi-arrow-left"></i>
            <span>Kembali ke Dashboard</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className={`alert alert-${notice.type} alert-dismissible fade show d-flex align-items-center gap-2 mb-4 shadow-sm`} role="alert">
          <i className={`bi ${notice.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} fs-5`}></i>
          <div className="fw-medium">{notice.message}</div>
          <button type="button" className="btn-close ms-auto" onClick={() => setNotice(null)}></button>
        </div>
      )}

      {/* Header Banner Profil Terpadu (Konsisten & Rapi) */}
      <div className="card border-0 shadow-sm bg-white p-4 mb-4 rounded-3">
        <div className="d-flex flex-column flex-sm-row align-items-center gap-4">
          <div className="position-relative">
            <img
              src={avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
              alt={name}
              className="rounded-circle object-fit-cover border border-3 border-primary-subtle shadow-sm"
              style={{ width: '100px', height: '100px' }}
            />
          </div>
          <div className="text-center text-sm-start flex-grow-1">
            <div className="d-flex align-items-center justify-content-center justify-content-sm-start gap-2 mb-1 flex-wrap">
              <h4 className="fw-bold text-dark mb-0">{name || 'Nama Pengguna'}</h4>
              <span className="badge bg-primary-subtle text-primary py-1 px-3 rounded-pill fw-semibold small">
                {role || 'Kontributor Sastra'}
              </span>
            </div>
            <p className="text-muted small mb-2 d-flex align-items-center justify-content-center justify-content-sm-start gap-1">
              <i className="bi bi-envelope"></i>
              <span>{email || 'email@mentaribersastra.id'}</span>
            </p>
            <p className="small text-secondary mb-0" style={{ maxWidth: '600px' }}>
              {bio || 'Pencinta sastra nusantara dan kurator literasi Mentari Bersastra.'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Bagian 1: Identitas & Biografi */}
        <div className="card border-0 shadow-sm p-4 mb-4 bg-white rounded-3">
          <h5 className="fw-bold mb-3 text-dark pb-2 border-bottom d-flex align-items-center gap-2">
            <i className="bi bi-person-vcard text-primary"></i>
            <span>Informasi Personal & Redaksi</span>
          </h5>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Nama Lengkap</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nama lengkap Anda..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold">Alamat Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="nama@mentaribersastra.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold">Peran / Jabatan Literasi</label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: Pemimpin Redaksi & Kurator Sastra"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold">Tautan Foto Avatar (URL)</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>

            <div className="col-12">
              <label className="form-label small fw-semibold">Biografi Sastra & Profil Singkat</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Tuliskan biografi singkat tentang ketertarikan literasi atau karya Anda..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <div className="form-text small text-muted">
                Biografi ini akan disematkan di bagian bawah setiap karya sastra dan artikel yang Anda terbitkan.
              </div>
            </div>
          </div>
        </div>

        {/* Bagian 2: Tautan Publik & Media Sosial */}
        <div className="card border-0 shadow-sm p-4 mb-4 bg-white rounded-3">
          <h5 className="fw-bold mb-3 text-dark pb-2 border-bottom d-flex align-items-center gap-2">
            <i className="bi bi-link-45deg text-primary"></i>
            <span>Tautan Literasi & Media Sosial</span>
          </h5>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Situs Web / Portofolio</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><i className="bi bi-globe"></i></span>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://situsanda.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold">Akun Twitter / X</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><i className="bi bi-twitter-x"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="@username"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold">Akun GitHub / Repositori</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><i className="bi bi-github"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="username"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bagian 3: Keamanan & Sandi */}
        <div className="card border-0 shadow-sm p-4 mb-4 bg-white rounded-3">
          <h5 className="fw-bold mb-3 text-dark pb-2 border-bottom d-flex align-items-center gap-2">
            <i className="bi bi-shield-lock text-primary"></i>
            <span>Pembaruan Kata Sandi</span>
          </h5>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Kata Sandi Baru</label>
              <input
                type="password"
                className="form-control"
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold">Konfirmasi Kata Sandi Baru</label>
              <input
                type="password"
                className="form-control"
                placeholder="Ketik ulang kata sandi baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <small className="text-muted d-block mt-2">
            Biarkan kosong jika Anda tidak ingin memperbarui kata sandi akun Anda saat ini.
          </small>
        </div>

        {/* Tombol Simpan */}
        <div className="d-flex justify-content-end gap-2 pt-2">
          <button
            type="button"
            className="btn btn-outline-secondary px-4 py-2 fw-semibold"
            onClick={onBackToDashboard}
          >
            Batal
          </button>
          <button
            type="submit"
            className="btn btn-primary px-5 py-2 fw-semibold shadow-sm d-flex align-items-center gap-2"
          >
            <i className="bi bi-check2-circle fs-5"></i>
            <span>Simpan Seluruh Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  );
}
