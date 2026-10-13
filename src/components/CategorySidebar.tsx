import React, { useState } from 'react';
import { Category, Post } from '../types/database';

interface CategorySidebarProps {
  categories: Category[];
  posts: Post[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onSelectPost?: (slug: string) => void;
}

export default function CategorySidebar({
  categories,
  posts,
  selectedCategoryId,
  onSelectCategory,
  onSelectPost,
}: CategorySidebarProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Hitung jumlah artikel per kategori
  const getCategoryCount = (categoryId: string) => {
    return posts.filter((p) => p.category_id === categoryId && p.published).length;
  };

  // Artikel populer berdasarkan jumlah pembaca
  const popularPosts = [...posts]
    .filter((p) => p.published)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <aside>
      {/* Kategori Topik */}
      <div className="card border-0 shadow-sm p-4 mb-4 bg-white">
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <h6 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
            <i className="bi bi-tag-fill text-primary"></i> Kategori Topik
          </h6>
          {selectedCategoryId && (
            <button
              className="btn btn-sm btn-link text-decoration-none text-muted p-0"
              onClick={() => onSelectCategory(null)}
            >
              Reset
            </button>
          )}
        </div>

        <div className="list-group list-group-flush">
          <button
            className={`list-group-item list-group-item-action border-0 rounded-2 px-3 py-2 mb-1 d-flex justify-content-between align-items-center ${
              selectedCategoryId === null ? 'bg-primary text-white fw-semibold' : 'text-secondary'
            }`}
            onClick={() => onSelectCategory(null)}
          >
            <span>Semua Artikel</span>
            <span
              className={`badge rounded-pill ${
                selectedCategoryId === null ? 'bg-white text-primary' : 'bg-secondary-subtle text-dark'
              }`}
            >
              {posts.filter((p) => p.published).length}
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const count = getCategoryCount(cat.id);
            return (
              <button
                key={cat.id}
                className={`list-group-item list-group-item-action border-0 rounded-2 px-3 py-2 mb-1 d-flex justify-content-between align-items-center ${
                  isSelected ? 'bg-primary text-white fw-semibold' : 'text-secondary'
                }`}
                onClick={() => onSelectCategory(cat.id)}
              >
                <span>{cat.name}</span>
                <span
                  className={`badge rounded-pill ${
                    isSelected ? 'bg-white text-primary' : 'bg-secondary-subtle text-dark'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Artikel Populer */}
      {popularPosts.length > 0 && (
        <div className="card border-0 shadow-sm p-4 mb-4 bg-white">
          <h6 className="fw-bold mb-3 pb-2 border-bottom text-dark d-flex align-items-center gap-2">
            <i className="bi bi-fire text-danger"></i> Artikel Terpopuler
          </h6>
          <div className="d-flex flex-column gap-3">
            {popularPosts.map((p, idx) => (
              <div
                key={p.id}
                className="d-flex align-items-start gap-3 cursor-pointer"
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectPost && onSelectPost(p.slug)}
              >
                <span className="badge bg-light text-primary border rounded-circle p-2 fs-6 fw-bold">
                  {idx + 1}
                </span>
                <div>
                  <div className="fw-semibold text-dark small lh-sm mb-1 hover-primary">
                    {p.title}
                  </div>
                  <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-eye me-1"></i>
                    {p.views || 0} pembaca
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter Widget */}
      <div className="card border-0 shadow-sm p-4 bg-primary-subtle text-dark rounded-3">
        <h6 className="fw-bold mb-2 d-flex align-items-center gap-2">
          <i className="bi bi-envelope-paper-fill text-warning-emphasis"></i> Surat Sastra Mingguan
        </h6>
        <p className="small text-secondary mb-3">
          Dapatkan kurasi sajak, fragmen cerpen pilihan, dan esai sastra nusantara langsung ke kotak masuk email Anda setiap akhir pekan.
        </p>

        {subscribed ? (
          <div className="alert alert-success py-2 small mb-0 d-flex align-items-center gap-2">
            <i className="bi bi-check-circle-fill"></i>
            <span>Terima kasih! Anda telah terdaftar.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe}>
            <div className="input-group input-group-sm mb-2">
              <input
                type="email"
                className="form-control"
                placeholder="nama@email.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button className="btn btn-primary" type="submit">
                Daftar
              </button>
            </div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
              Bebas spam. Anda dapat berhenti kapan saja.
            </div>
          </form>
        )}
      </div>
    </aside>
  );
}
