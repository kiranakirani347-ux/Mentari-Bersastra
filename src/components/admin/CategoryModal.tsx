import React, { useState } from 'react';
import { Category } from '../../types/database';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (name: string, slug: string, description: string) => void;
  onDeleteCategory: (id: string) => void;
}

export default function CategoryModal({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onDeleteCategory,
}: CategoryModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;
    onAddCategory(name.trim(), slug.trim(), description.trim());
    setName('');
    setSlug('');
    setDescription('');
  };

  return (
    <div
      className="modal show d-block"
      style={{
        backgroundColor: 'rgba(0,0,0,0.65)',
        zIndex: 1055,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog modal-lg my-4">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-dark text-white py-3 sticky-top">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-tags-fill"></i>
              <span>Kelola Kategori Artikel</span>
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div
            className="modal-body p-4 bg-light"
            style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}
          >
            <div className="row g-4">
              {/* Tambah Kategori */}
              <div className="col-md-5">
                <div className="card border-0 shadow-sm p-3 bg-white">
                  <h6 className="fw-bold mb-3">Tambah Kategori Baru</h6>
                  <form onSubmit={handleAdd}>
                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Nama Kategori</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Contoh: Mobile App"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Slug URL</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="mobile-app"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Deskripsi</label>
                      <textarea
                        className="form-control form-control-sm"
                        rows={2}
                        placeholder="Keterangan singkat..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm w-100">
                      <i className="bi bi-plus-lg me-1"></i> Simpan Kategori
                    </button>
                  </form>
                </div>
              </div>

              {/* Daftar Kategori */}
              <div className="col-md-7">
                <div className="card border-0 shadow-sm overflow-hidden bg-white">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 small">
                      <thead className="table-light">
                        <tr>
                          <th className="ps-3">Nama</th>
                          <th>Slug</th>
                          <th className="text-end pe-3">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((c) => (
                          <tr key={c.id}>
                            <td className="ps-3 fw-semibold">{c.name}</td>
                            <td className="text-muted font-monospace">{c.slug}</td>
                            <td className="text-end pe-3">
                              <button
                                className="btn btn-outline-danger btn-sm py-0 px-2"
                                title="Hapus Kategori"
                                onClick={() => onDeleteCategory(c.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer bg-white border-top py-2 sticky-bottom">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
