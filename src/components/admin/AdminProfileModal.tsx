import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types/database';

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
}

export default function AdminProfileModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}: AdminProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [role, setRole] = useState(profile.role);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [website, setWebsite] = useState(profile.website || '');
  const [github, setGithub] = useState(profile.github || '');
  const [twitter, setTwitter] = useState(profile.twitter || '');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState('');

  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
    setRole(profile.role);
    setBio(profile.bio);
    setAvatarUrl(profile.avatar_url);
    setWebsite(profile.website || '');
    setGithub(profile.github || '');
    setTwitter(profile.twitter || '');
    setPasswordNotice('');
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Nama dan Email wajib diisi.');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setPasswordNotice('Kata sandi baru minimal 6 karakter.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordNotice('Konfirmasi kata sandi tidak cocok.');
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
    onClose();
  };

  return (
    <div
      className="modal show d-block"
      style={{
        backgroundColor: 'rgba(0,0,0,0.65)',
        zIndex: 1060,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
      tabIndex={-1}
      onClick={(e) => {
        // Klik pada backdrop menutup modal
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog modal-lg my-4">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-dark text-white py-3 sticky-top" style={{ zIndex: 10 }}>
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-person-bounding-box text-primary"></i>
              <span>Profil Akun Pengelola</span>
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Modal Body dengan scroll aktif internal & eksternal */}
            <div
              className="modal-body p-4 bg-light"
              style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}
            >
              <div className="row g-4">
                {/* Kolom Kiri: Form Identitas */}
                <div className="col-md-7">
                  <div className="card border-0 shadow-sm p-3 mb-3 bg-white">
                    <h6 className="fw-bold mb-3 text-dark">Informasi Akun & Penulis</h6>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Nama Lengkap</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Alamat Email</label>
                      <input
                        type="email"
                        className="form-control form-control-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Peran / Jabatan Redaksi</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Biografi Penulis</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Deskripsi singkat yang tampil di bawah artikel..."
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label small fw-semibold">URL Foto Avatar</label>
                      <input
                        type="url"
                        className="form-control form-control-sm"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Media Sosial */}
                  <div className="card border-0 shadow-sm p-3 bg-white">
                    <h6 className="fw-bold mb-3 text-dark">Tautan Profil & Media Sosial</h6>
                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Website Pribadi</label>
                      <input
                        type="url"
                        className="form-control form-control-sm"
                        placeholder="https://..."
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small fw-semibold">GitHub</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="https://github.com/..."
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                      />
                    </div>
                    <div className="mb-0">
                      <label className="form-label small fw-semibold">Twitter / X</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="https://twitter.com/..."
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: Preview Kartu & Ubah Sandi */}
                <div className="col-md-5">
                  <div className="card border-0 shadow-sm p-3 mb-3 bg-white text-center">
                    <h6 className="fw-bold mb-3 text-dark text-start">Pratinjau Penulis</h6>
                    <div className="position-relative d-inline-block mx-auto mb-2">
                      <img
                        src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                        alt={name}
                        className="rounded-circle object-fit-cover border border-3 border-primary-subtle shadow-xs"
                        style={{ width: '80px', height: '80px' }}
                      />
                    </div>
                    <h6 className="fw-bold mb-0 text-dark">{name || 'Nama Penulis'}</h6>
                    <small className="text-primary fw-semibold d-block mb-2">{role || 'Redaktur'}</small>
                    <p className="small text-muted mb-0">{bio || 'Belum ada biografi.'}</p>
                  </div>

                  <div className="card border-0 shadow-sm p-3 bg-white">
                    <h6 className="fw-bold mb-3 text-dark">Ubah Kata Sandi</h6>
                    {passwordNotice && (
                      <div className="alert alert-info py-1 px-2 small mb-2">
                        {passwordNotice}
                      </div>
                    )}
                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Sandi Saat Ini</label>
                      <input
                        type="password"
                        className="form-control form-control-sm"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Sandi Baru</label>
                      <input
                        type="password"
                        className="form-control form-control-sm"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="mb-0">
                      <label className="form-label small fw-semibold">Konfirmasi Sandi Baru</label>
                      <input
                        type="password"
                        className="form-control form-control-sm"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-white border-top py-2 sticky-bottom">
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
                Tutup
              </button>
              <button type="submit" className="btn btn-primary btn-sm px-4">
                <i className="bi bi-check-circle me-1"></i> Simpan Profil
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
