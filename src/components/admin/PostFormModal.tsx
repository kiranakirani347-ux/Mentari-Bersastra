import React, { useState, useEffect } from 'react';
import { Category, Post } from '../../types/database';
import MarkdownViewer from '../MarkdownViewer';

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (postData: Partial<Post>) => void;
  categories: Category[];
  editingPost?: Post | null;
}

export default function PostFormModal({
  isOpen,
  onClose,
  onSave,
  categories,
  editingPost,
}: PostFormModalProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [published, setPublished] = useState(true);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setSlug(editingPost.slug);
      setExcerpt(editingPost.excerpt || '');
      setContent(editingPost.content);
      setCategoryId(editingPost.category_id || (categories[0]?.id ?? ''));
      setImageUrl(editingPost.featured_image || '');
      setPublished(editingPost.published);
    } else {
      setTitle('');
      setSlug('');
      setExcerpt('');
      setContent('');
      setCategoryId(categories[0]?.id || '');
      setImageUrl('');
      setPublished(true);
    }
    setActiveTab('write');
  }, [editingPost, categories, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  };

  const insertMarkdown = (syntaxStart: string, syntaxEnd = '') => {
    const textarea = document.getElementById('postContentArea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = syntaxStart + (selectedText || 'teks') + syntaxEnd;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
  };

  const handleQuickImage = (url: string) => {
    setImageUrl(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) {
      alert('Judul, slug, dan isi konten artikel wajib diisi!');
      return;
    }

    onSave({
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      category_id: categoryId || null,
      featured_image: imageUrl.trim() || null,
      published,
    });
  };

  return (
    <div
      className="modal show d-block"
      style={{
        backgroundColor: 'rgba(0,0,0,0.65)',
        zIndex: 1050,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog modal-xl my-4">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-dark text-white py-3 sticky-top" style={{ zIndex: 10 }}>
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <i className={`bi ${editingPost ? 'bi-pencil-square' : 'bi-plus-circle'}`}></i>
              <span>{editingPost ? 'Edit Artikel' : 'Tulis Artikel Baru'}</span>
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              className="modal-body p-4 bg-light"
              style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}
            >
              <div className="row g-4">
                {/* Kolom Kiri: Input Utama & Konten */}
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm p-4 mb-3 bg-white">
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Judul Artikel</label>
                      <input
                        type="text"
                        className="form-control form-control-lg fw-bold"
                        placeholder="Contoh: Menelusuri Jejak Puitik Sastra Nusantara"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Slug URL</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light text-muted small">/blog/</span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="menelusuri-jejak-puitik-sastra-nusantara"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Ringkasan (Excerpt)</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="Deskripsi singkat untuk kartu artikel..."
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                      />
                    </div>

                    {/* Markdown Editor Area */}
                    <div className="mb-2">
                      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                        <label className="form-label fw-semibold small mb-0">Konten Artikel (Markdown)</label>
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className={`btn ${activeTab === 'write' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setActiveTab('write')}
                          >
                            <i className="bi bi-pencil me-1"></i> Tulis
                          </button>
                          <button
                            type="button"
                            className={`btn ${activeTab === 'preview' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setActiveTab('preview')}
                          >
                            <i className="bi bi-eye me-1"></i> Live Preview
                          </button>
                        </div>
                      </div>

                      {/* Toolbar Markdown */}
                      {activeTab === 'write' && (
                        <div className="btn-toolbar mb-2 gap-1 bg-light p-2 rounded border" role="toolbar">
                          <button
                            type="button"
                            className="btn btn-sm btn-white border"
                            title="Heading 2"
                            onClick={() => insertMarkdown('## ')}
                          >
                            H2
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-white border"
                            title="Heading 3"
                            onClick={() => insertMarkdown('### ')}
                          >
                            H3
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-white border fw-bold"
                            title="Bold"
                            onClick={() => insertMarkdown('**', '**')}
                          >
                            B
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-white border fst-italic"
                            title="Italic"
                            onClick={() => insertMarkdown('*', '*')}
                          >
                            I
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-white border"
                            title="Quote"
                            onClick={() => insertMarkdown('> ')}
                          >
                            <i className="bi bi-quote"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-white border"
                            title="Code Block"
                            onClick={() => insertMarkdown('```\n', '\n```')}
                          >
                            <i className="bi bi-code-slash"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-white border"
                            title="List"
                            onClick={() => insertMarkdown('- ')}
                          >
                            <i className="bi bi-list-ul"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-white border"
                            title="Link"
                            onClick={() => insertMarkdown('[Judul Link](', 'https://example.com)')}
                          >
                            <i className="bi bi-link-45deg"></i>
                          </button>
                        </div>
                      )}

                      {activeTab === 'write' ? (
                        <textarea
                          id="postContentArea"
                          className="form-control font-monospace"
                          rows={13}
                          placeholder="# Judul Artikel&#10;&#10;Tuliskan isi artikel Anda dengan format Markdown di sini..."
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          required
                        />
                      ) : (
                        <div
                          className="border rounded p-4 bg-white overflow-auto"
                          style={{ minHeight: '320px', maxHeight: '420px' }}
                        >
                          {content.trim() ? (
                            <MarkdownViewer content={content} />
                          ) : (
                            <p className="text-muted small fst-italic text-center py-5">
                              Belum ada teks untuk ditampilkan pada preview.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: Meta, Kategori, Gambar */}
                <div className="col-lg-4">
                  {/* Status & Kategori */}
                  <div className="card border-0 shadow-sm p-4 mb-3 bg-white">
                    <h6 className="fw-bold mb-3 text-dark">Pengaturan Publikasi</h6>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Kategori</label>
                      <select
                        className="form-select"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                      >
                        <option value="">Pilih Kategori</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-check form-switch mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="modalPublishedSwitch"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                      />
                      <label className="form-check-label fw-semibold small" htmlFor="modalPublishedSwitch">
                        Terbitkan ke Publik
                      </label>
                    </div>
                  </div>

                  {/* Gambar Cover */}
                  <div className="card border-0 shadow-sm p-4 bg-white">
                    <h6 className="fw-bold mb-3 text-dark">Gambar Utama</h6>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small">URL Gambar</label>
                      <input
                        type="url"
                        className="form-control form-control-sm"
                        placeholder="https://images.unsplash.com/..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                    </div>

                    {/* Preset gambar cepat */}
                    <div className="mb-3">
                      <label className="form-label small text-muted">Contoh Gambar Siap Pakai:</label>
                      <div className="d-flex flex-wrap gap-1">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => handleQuickImage('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80')}
                        >
                          Code
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => handleQuickImage('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80')}
                        >
                          Cloud
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => handleQuickImage('https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80')}
                        >
                          Design
                        </button>
                      </div>
                    </div>

                    {imageUrl && (
                      <div className="rounded overflow-hidden border mt-2">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-100 object-fit-cover"
                          style={{ maxHeight: '160px' }}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-white border-top py-3 sticky-bottom">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary fw-semibold px-4">
                <i className="bi bi-check-circle me-1"></i> Simpan Artikel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
