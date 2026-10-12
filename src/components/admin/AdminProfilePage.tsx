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

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
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
        setNotice({ type: 'danger', message: 'Konfirmasi kata sandi tidak cocok.' });
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

    setNotice({ type: 'success', message: 'Profil dan pengaturan berhasil disimpan!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container py-4 pb-5" style={{ maxWidth: '980px' }}>
      {/* Navigation Breadcrumbs */}
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
            <span className="text-dark fw-semibold">Profil Akun</span>
          </div>
          <h2 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
            <i className="bi bi-person-circle text-primary"></i>
            <span>Pengaturan Profil Akun</span>
          </h2>
        </div>

        <button
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
          onClick={onBackToDashboard}
        >
          <i className="bi bi-arrow-left"></i>
          <span>Kembali ke Dashboard</span>
        </button>
      </div>

      {notice && (
        <div className={`alert alert-${notice.type} alert-dismissible fade show d-flex align-items-center gap-2 mb-4`} role="alert">
          <i className={`bi ${notice.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
          <div>{notice.message}</div>
          <button type="button" className="btn-close ms-auto" onClick={() => setNotice(null)}></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Kolom Kiri: Form Informasi Akun & Penulis */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm p-4 mb-4 bg-white">
              <h5 className="fw-bold mb-3 text-dark pb-2 border-bottom">
                Informasi Personal & Redaksi
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Nama Lengkap</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Alamat Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Jabatan / Peran Redaksi</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Technical Lead Writer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Biografi Penulis</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Deskripsi singkat yang tampil pada kotak profil di bawah artikel..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">URL Foto Avatar</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Media Sosial */}
            <div className="card border-0 shadow-sm p-4 bg-white mb-4">
              <h5 className="fw-bold mb-3 text-dark pb-2 border-bottom">
                Tautan Media Sosial
              </h5>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Website / Portofolio</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted"><i className="bi bi-globe"></i></span>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://domainanda.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Profil GitHub</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted"><i className="bi bi-github"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://github.com/username"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Profil Twitter / X</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted"><i className="bi bi-twitter-x"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://twitter.com/username"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Pratinjau Penulis & Ganti Password */}
          <div className="col-lg-5">
            {/* Pratinjau Kartu Penulis */}
            <div className="card border-0 shadow-sm p-4 bg-white mb-4 text-center">
              <h6 className="fw-bold mb-3 text-dark text-start pb-2 border-bottom">
                Pratinjau Kartu Penulis
              </h6>
              <div className="my-2">
                <img
                  src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={name}
                  className="rounded-circle object-fit-cover border border-3 border-primary-subtle shadow-sm"
                  style={{ width: '90px', height: '90px' }}
                />
              </div>
              <h5 className="fw-bold mb-1 text-dark mt-2">{name || 'Nama Penulis'}</h5>
              <span className="badge bg-primary-subtle text-primary mb-3 py-1 px-3">
                {role || 'Kontributor Teknis'}
              </span>
              <p className="small text-muted mb-3 px-2">
                {bio || 'Biografi penulis belum ditambahkan.'}
              </p>
              <div className="d-flex justify-content-center gap-2 text-muted">
                {website && <span title="Website"><i className="bi bi-globe"></i></span>}
                {github && <span title="GitHub"><i className="bi bi-github"></i></span>}
                {twitter && <span title="Twitter"><i className="bi bi-twitter-x"></i></span>}
              </div>
            </div>

            {/* Ubah Password */}
            <div className="card border-0 shadow-sm p-4 bg-white mb-4">
              <h6 className="fw-bold mb-3 text-dark pb-2 border-bottom">
                Keamanan & Kata Sandi
              </h6>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Kata Sandi Baru</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  placeholder="Minimal 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Konfirmasi Sandi Baru</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  placeholder="Ketik ulang kata sandi baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <small className="text-muted d-block">
                Kosongkan bidang ini jika tidak ingin mengubah kata sandi.
              </small>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2"
            >
              <i className="bi bi-check-circle-fill"></i>
              <span>Simpan Seluruh Perubahan</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
