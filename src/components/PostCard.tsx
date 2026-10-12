import React from 'react';
import { Post } from '../types/database';

interface PostCardProps {
  post: Post;
  onSelectPost: (slug: string) => void;
  onSelectCategory?: (categoryId: string) => void;
}

export default function PostCard({ post, onSelectPost, onSelectCategory }: PostCardProps) {
  const formattedDate = new Date(post.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="col-md-6 col-lg-6 mb-4">
      <div className="card h-100 border-0 shadow-sm card-hover-effect overflow-hidden bg-white">
        {/* Cover Image */}
        <div
          className="position-relative w-100 bg-secondary-subtle cursor-pointer"
          style={{ height: '210px', cursor: 'pointer' }}
          onClick={() => onSelectPost(post.slug)}
        >
          {post.featured_image ? (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-100 h-100 object-fit-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
              <i className="bi bi-image fs-1"></i>
            </div>
          )}

          {post.categories && (
            <span
              className="badge bg-primary position-absolute top-0 end-0 m-3 shadow-sm text-decoration-none"
              style={{ zIndex: 2, cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectCategory && post.category_id) {
                  onSelectCategory(post.category_id);
                }
              }}
            >
              {post.categories.name}
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="card-body d-flex flex-column p-4">
          <div className="d-flex align-items-center justify-content-between text-muted small mb-2">
            <span>
              <i className="bi bi-calendar3 me-1"></i> {formattedDate}
            </span>
            <span>
              <i className="bi bi-clock me-1"></i> {post.reading_time || '3 menit'}
            </span>
          </div>

          <h5
            className="card-title fw-bold text-dark mb-2"
            style={{ cursor: 'pointer', lineHeight: 1.4 }}
            onClick={() => onSelectPost(post.slug)}
          >
            {post.title}
          </h5>

          <p className="card-text text-secondary flex-grow-1 small line-clamp-3 mb-3">
            {post.excerpt || post.content.replace(/[#*`_]/g, '').slice(0, 130) + '...'}
          </p>

          <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
            <span className="small text-muted d-flex align-items-center gap-1">
              <i className="bi bi-person-circle"></i>
              {post.author_name || 'Admin Redaksi'}
            </span>
            <button
              className="btn btn-link text-primary text-decoration-none p-0 fw-semibold small d-flex align-items-center gap-1"
              onClick={() => onSelectPost(post.slug)}
            >
              <span>Baca Selengkapnya</span>
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
