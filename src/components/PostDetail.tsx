import React, { useState } from 'react';
import { Post, Comment, UserProfile } from '../types/database';
import MarkdownViewer from './MarkdownViewer';

interface PostDetailProps {
  post: Post;
  relatedPosts: Post[];
  comments: Comment[];
  authorProfile?: UserProfile;
  isAdmin: boolean;
  onBack: () => void;
  onSelectPost: (slug: string) => void;
  onAddComment: (authorName: string, content: string) => void;
  onDeleteComment?: (id: string) => void;
}

export default function PostDetail({
  post,
  relatedPosts,
  comments,
  authorProfile,
  isAdmin,
  onBack,
  onSelectPost,
  onAddComment,
  onDeleteComment,
}: PostDetailProps) {
  const [copied, setCopied] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');

  const formattedDate = new Date(post.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;
    onAddComment(commentName.trim(), commentText.trim());
    setCommentText('');
  };

  return (
    <article className="container py-4 pb-5" style={{ maxWidth: '860px' }}>
      {/* Navigation & Action Bar */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <button
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
          onClick={onBack}
        >
          <i className="bi bi-arrow-left"></i>
          <span>Kembali ke Beranda</span>
        </button>

        <button
          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
          onClick={handleShare}
        >
          <i className={`bi ${copied ? 'bi-check2' : 'bi-share'}`}></i>
          <span>{copied ? 'Tautan Disalin!' : 'Bagikan Artikel'}</span>
        </button>
      </div>

      {/* Header Info */}
      <div className="mb-4 text-center text-md-start">
        {post.categories && (
          <span className="badge bg-primary fs-6 px-3 py-2 mb-3">
            {post.categories.name}
          </span>
        )}

        <h1 className="fw-bold display-5 text-dark mb-3" style={{ lineHeight: 1.25 }}>
          {post.title}
        </h1>

        <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-3 text-muted small flex-wrap">
          <span className="d-flex align-items-center gap-1">
            <i className="bi bi-person-circle"></i>
            {post.author_name || authorProfile?.name || 'Admin Redaksi'}
          </span>
          <span>•</span>
          <span className="d-flex align-items-center gap-1">
            <i className="bi bi-calendar3"></i>
            {formattedDate}
          </span>
          <span>•</span>
          <span className="d-flex align-items-center gap-1">
            <i className="bi bi-clock"></i>
            {post.reading_time || '3 menit baca'}
          </span>
          {post.views !== undefined && (
            <>
              <span>•</span>
              <span className="d-flex align-items-center gap-1">
                <i className="bi bi-eye"></i>
                {post.views} pembaca
              </span>
            </>
          )}
        </div>
      </div>

      {/* Featured Image */}
      {post.featured_image && (
        <div
          className="position-relative w-100 rounded-3 overflow-hidden shadow-sm mb-4"
          style={{ maxHeight: '450px' }}
        >
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-100 h-100 object-fit-cover rounded-3"
            style={{ maxHeight: '450px' }}
          />
        </div>
      )}

      {/* Content Area */}
      <div className="card border-0 shadow-sm p-4 p-md-5 bg-white mb-4">
        <MarkdownViewer content={post.content} />
      </div>

      {/* Author Card Box */}
      <div className="card border-0 shadow-sm p-4 bg-white mb-5 rounded-3">
        <div className="d-flex align-items-center gap-3 flex-column flex-sm-row text-center text-sm-start">
          <img
            src={authorProfile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt="Penulis"
            className="rounded-circle object-fit-cover border"
            style={{ width: '70px', height: '70px' }}
          />
          <div className="flex-grow-1">
            <h6 className="fw-bold mb-0 text-dark">{authorProfile?.name || post.author_name || 'Tim Redaksi'}</h6>
            <small className="text-warning-emphasis fw-semibold d-block mb-1">
              {authorProfile?.role || 'Kurator & Penulis Sastra'}
            </small>
            <p className="small text-muted mb-0">
              {authorProfile?.bio || 'Menulis untuk merawat keindahan bahasa, kejernihan nurani, dan estetika sastra nusantara.'}
            </p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="card border-0 shadow-sm p-4 bg-white mb-5">
        <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
          <i className="bi bi-chat-left-text-fill text-primary"></i>
          <span>Diskusi & Komentar ({comments.length})</span>
        </h5>

        {/* Form Tambah Komentar */}
        <form onSubmit={handleCommentSubmit} className="mb-4 pb-4 border-bottom">
          <div className="mb-3">
            <label className="form-label small fw-semibold">Nama Anda</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Masukkan nama Anda..."
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Komentar atau Tanggapan</label>
            <textarea
              className="form-control form-control-sm"
              rows={3}
              placeholder="Tulis tanggapan konstruktif Anda di sini..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm px-3">
            <i className="bi bi-send me-1"></i> Kirim Komentar
          </button>
        </form>

        {/* Daftar Komentar */}
        {comments.length === 0 ? (
          <p className="text-muted small text-center py-3 mb-0">
            Belum ada komentar untuk artikel ini. Jadilah yang pertama berkomentar!
          </p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {comments.map((cm) => (
              <div key={cm.id} className="p-3 bg-light rounded-2 position-relative">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <div className="fw-semibold text-dark small">{cm.author_name}</div>
                  <div className="d-flex align-items-center gap-2">
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {new Date(cm.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </small>
                    {isAdmin && onDeleteComment && (
                      <button
                        className="btn btn-link text-danger p-0 border-0"
                        title="Hapus komentar ini"
                        onClick={() => onDeleteComment(cm.id)}
                      >
                        <i className="bi bi-trash small"></i>
                      </button>
                    )}
                  </div>
                </div>
                <p className="small text-secondary mb-0">{cm.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="border-top pt-4">
          <h5 className="fw-bold mb-3 text-dark">Artikel Terkait Lainnya</h5>
          <div className="row g-3">
            {relatedPosts.slice(0, 2).map((rel) => (
              <div key={rel.id} className="col-md-6">
                <div
                  className="card h-100 border-0 shadow-sm p-3 card-hover-effect"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectPost(rel.slug)}
                >
                  <small className="text-primary fw-semibold mb-1">
                    {rel.categories?.name || 'Artikel'}
                  </small>
                  <h6 className="fw-bold mb-2 text-dark">{rel.title}</h6>
                  <p className="small text-muted mb-0">
                    {rel.excerpt || rel.content.slice(0, 90) + '...'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
