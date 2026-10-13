import React, { useState } from 'react';
import { Category, Post, UserProfile } from '../../types/database';

interface AdminDashboardProps {
  posts: Post[];
  categories: Category[];
  totalComments: number;
  userProfile?: UserProfile;
  onOpenCreateModal: () => void;
  onOpenEditModal: (post: Post) => void;
  onDeletePost: (id: string) => void;
  onTogglePublish: (id: string, currentStatus: boolean) => void;
  onOpenCategoriesModal: () => void;
  onOpenProfileModal: () => void;
  onOpenSupabaseModal: () => void;
  onViewPostPublic: (slug: string) => void;
  onLogout: () => void;
  onBackToHome: () => void;
}

export default function AdminDashboard({
  posts,
  categories,
  totalComments,
  userProfile,
  onOpenCreateModal,
  onOpenEditModal,
  onDeletePost,
  onTogglePublish,
  onOpenCategoriesModal,
  onOpenProfileModal,
  onOpenSupabaseModal,
  onViewPostPublic,
  onLogout,
  onBackToHome,
}: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter artikel
  const filteredPosts = posts.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'all' || p.category_id === filterCategory;
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && p.published) ||
      (filterStatus === 'draft' && !p.published);
    return matchSearch && matchCategory && matchStatus;
  });

  const totalPublished = posts.filter((p) => p.published).length;
  const totalDrafts = posts.filter((p) => !p.published).length;

  return (
    <div className="container py-4 pb-5">
      {/* Top Header Bar */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3 pb-3 border-bottom">
        <div>
          <button
            className="btn btn-link text-decoration-none text-muted small p-0 d-flex align-items-center gap-1 mb-1"
            onClick={onBackToHome}
          >
            <i className="bi bi-arrow-left"></i> Kembali ke Beranda Publik
          </button>
          <div className="d-flex align-items-center gap-3">
            <h2 className="fw-bold mb-0 text-dark">
              <span>Dasbor Redaksi & Kurasi Sastra</span>
            </h2>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          {/* Menu Profil Akun */}
          <button
            className="btn btn-outline-dark btn-sm d-flex align-items-center gap-2"
            onClick={onOpenProfileModal}
          >
            <img
              src={userProfile?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
              alt="Avatar"
              className="rounded-circle object-fit-cover"
              style={{ width: '22px', height: '22px' }}
            />
            <span>Profil Akun</span>
          </button>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={onOpenCategoriesModal}
          >
            <i className="bi bi-tags me-1"></i> Kategori ({categories.length})
          </button>

          <button
            className="btn btn-primary btn-sm fw-semibold shadow-xs"
            onClick={onOpenCreateModal}
          >
            <i className="bi bi-plus-lg me-1"></i> Tulis Karya Baru
          </button>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={onOpenSupabaseModal}
            title="Koneksi Supabase"
          >
            <i className="bi bi-gear"></i>
          </button>

          <button
            className="btn btn-outline-danger btn-sm"
            onClick={onLogout}
            title="Keluar dari sesi admin"
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <small className="text-muted fw-semibold">Total Artikel</small>
                <h3 className="fw-bold mb-0 mt-1">{posts.length}</h3>
              </div>
              <div className="p-3 bg-primary-subtle text-primary rounded-circle">
                <i className="bi bi-file-earmark-text fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <small className="text-muted fw-semibold">Diterbitkan</small>
                <h3 className="fw-bold mb-0 mt-1 text-success">{totalPublished}</h3>
              </div>
              <div className="p-3 bg-success-subtle text-success rounded-circle">
                <i className="bi bi-check-circle fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <small className="text-muted fw-semibold">Draf / Draft</small>
                <h3 className="fw-bold mb-0 mt-1 text-warning">{totalDrafts}</h3>
              </div>
              <div className="p-3 bg-warning-subtle text-warning rounded-circle">
                <i className="bi bi-file-earmark-lock fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm p-3 bg-white">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <small className="text-muted fw-semibold">Total Komentar</small>
                <h3 className="fw-bold mb-0 mt-1 text-info">{totalComments}</h3>
              </div>
              <div className="p-3 bg-info-subtle text-info rounded-circle">
                <i className="bi bi-chat-dots fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm p-3 mb-3 bg-white">
        <div className="row g-2 align-items-center">
          <div className="col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Cari judul atau isi artikel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-3">
            <select
              className="form-select form-select-sm"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <div className="btn-group btn-group-sm w-100">
              <button
                className={`btn ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilterStatus('all')}
              >
                Semua ({posts.length})
              </button>
              <button
                className={`btn ${filterStatus === 'published' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilterStatus('published')}
              >
                Terbit ({totalPublished})
              </button>
              <button
                className={`btn ${filterStatus === 'draft' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilterStatus('draft')}
              >
                Draf ({totalDrafts})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Posts */}
      <div className="card border-0 shadow-sm overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th scope="col" className="ps-4" style={{ minWidth: '280px' }}>
                  Judul Artikel
                </th>
                <th scope="col">Kategori</th>
                <th scope="col">Status</th>
                <th scope="col">Tanggal Dibuat</th>
                <th scope="col" className="text-end pe-4" style={{ minWidth: '160px' }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">
                    <i className="bi bi-folder2-open display-6 text-secondary d-block mb-2"></i>
                    <span>Tidak ada artikel yang sesuai dengan filter atau kata kunci.</span>
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id}>
                    <td className="ps-4">
                      <div className="fw-bold text-dark">{post.title}</div>
                      <small className="text-muted font-monospace">/blog/{post.slug}</small>
                    </td>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary-emphasis">
                        {post.categories?.name || 'Tanpa Kategori'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`badge border-0 ${
                          post.published
                            ? 'bg-success-subtle text-success'
                            : 'bg-warning-subtle text-warning'
                        }`}
                        title="Klik untuk ubah status publikasi"
                        onClick={() => onTogglePublish(post.id, post.published)}
                        style={{ cursor: 'pointer' }}
                      >
                        <i className={`bi ${post.published ? 'bi-check-circle' : 'bi-pause-circle'} me-1`}></i>
                        {post.published ? 'Diterbitkan' : 'Draf'}
                      </button>
                    </td>
                    <td className="text-muted small">
                      {new Date(post.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="text-end pe-4">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-secondary"
                          title="Lihat Halaman Publik"
                          onClick={() => onViewPostPublic(post.slug)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-outline-primary"
                          title="Edit Artikel"
                          onClick={() => onOpenEditModal(post)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          title="Hapus Artikel"
                          onClick={() => {
                            if (confirm(`Hapus artikel "${post.title}"?`)) {
                              onDeletePost(post.id);
                            }
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
