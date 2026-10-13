import React, { useState, useEffect, useMemo } from 'react';
import { Category, Post, UserProfile, Comment } from './types/database';
import { storageService } from './lib/storageService';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import PostCard from './components/PostCard';
import CategorySidebar from './components/CategorySidebar';
import PostDetail from './components/PostDetail';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProfilePage from './components/admin/AdminProfilePage';
import PostFormModal from './components/admin/PostFormModal';
import CategoryModal from './components/admin/CategoryModal';
import SupabaseModal from './components/admin/SupabaseModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'post-detail' | 'admin-login' | 'admin-dashboard' | 'admin-profile'>('home');
  const [activeSlug, setActiveSlug] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data state
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(storageService.getProfile());
  const [isAdmin, setIsAdmin] = useState(false);

  // Modals state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Initial load
  useEffect(() => {
    const loadedCategories = storageService.getCategories();
    const loadedPosts = storageService.getPosts();
    const loadedComments = storageService.getComments();
    const loadedProfile = storageService.getProfile();

    setCategories(loadedCategories);
    setPosts(loadedPosts);
    setComments(loadedComments);
    setUserProfile(loadedProfile);
    setIsAdmin(storageService.isAdminLoggedIn());

    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/blog/')) {
        const slug = hash.replace('#/blog/', '');
        setActiveSlug(slug);
        setCurrentView('post-detail');
      } else if (hash === '#/admin/profile') {
        setCurrentView(storageService.isAdminLoggedIn() ? 'admin-profile' : 'admin-login');
      } else if (hash === '#/admin/dashboard') {
        setCurrentView(storageService.isAdminLoggedIn() ? 'admin-dashboard' : 'admin-login');
      } else if (hash === '#/admin/login') {
        setCurrentView('admin-login');
      } else {
        setCurrentView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const reloadData = () => {
    setCategories(storageService.getCategories());
    setPosts(storageService.getPosts());
    setComments(storageService.getComments());
    setUserProfile(storageService.getProfile());
  };

  const navigateTo = (view: 'home' | 'post-detail' | 'admin-login' | 'admin-dashboard' | 'admin-profile', param?: string) => {
    if (view === 'post-detail' && param) {
      setActiveSlug(param);
      window.location.hash = `#/blog/${param}`;
    } else if (view === 'admin-profile') {
      window.location.hash = '#/admin/profile';
    } else if (view === 'admin-dashboard') {
      window.location.hash = '#/admin/dashboard';
    } else if (view === 'admin-login') {
      window.location.hash = '#/admin/login';
    } else {
      window.location.hash = '';
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredPublishedPosts = useMemo(() => {
    return posts.filter((post) => {
      if (!post.published) return false;
      const matchCategory = !selectedCategoryId || post.category_id === selectedCategoryId;
      const matchSearch =
        !searchQuery.trim() ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [posts, selectedCategoryId, searchQuery]);

  const totalViews = useMemo(() => {
    return posts.reduce((acc, p) => acc + (p.views || 0), 0);
  }, [posts]);

  const currentPost = useMemo(() => {
    return posts.find((p) => p.slug === activeSlug);
  }, [posts, activeSlug]);

  const currentPostComments = useMemo(() => {
    if (!currentPost) return [];
    return comments.filter((c) => c.post_id === currentPost.id);
  }, [comments, currentPost]);

  const relatedPosts = useMemo(() => {
    if (!currentPost) return [];
    return posts.filter(
      (p) => p.id !== currentPost.id && p.published && (!currentPost.category_id || p.category_id === currentPost.category_id)
    );
  }, [posts, currentPost]);

  // Handlers CRUD
  const handleSavePost = (postData: Partial<Post>) => {
    if (editingPost) {
      storageService.updatePost(editingPost.id, postData);
    } else {
      storageService.createPost({
        title: postData.title || 'Untitled',
        slug: postData.slug || 'untitled-' + Date.now(),
        excerpt: postData.excerpt || null,
        content: postData.content || '',
        category_id: postData.category_id || null,
        author_name: userProfile.name,
        featured_image: postData.featured_image || null,
        published: postData.published ?? true,
      });
    }
    reloadData();
    setIsPostModalOpen(false);
    setEditingPost(null);
  };

  const handleDeletePost = (id: string) => {
    storageService.deletePost(id);
    reloadData();
  };

  const handleTogglePublish = (id: string, currentStatus: boolean) => {
    storageService.updatePost(id, { published: !currentStatus });
    reloadData();
  };

  const handleAddCategory = (name: string, slug: string, description: string) => {
    storageService.addCategory(name, slug, description);
    reloadData();
  };

  const handleDeleteCategory = (id: string) => {
    storageService.deleteCategory(id);
    reloadData();
  };

  const handleSaveProfile = (updated: UserProfile) => {
    storageService.saveProfile(updated);
    setUserProfile(updated);
  };

  const handleAddComment = (authorName: string, content: string) => {
    if (!currentPost) return;
    storageService.addComment(currentPost.id, authorName, content);
    setComments(storageService.getComments());
  };

  const handleDeleteComment = (id: string) => {
    storageService.deleteComment(id);
    setComments(storageService.getComments());
  };

  const handleLoginSuccess = () => {
    storageService.setAdminLoggedIn(true);
    setIsAdmin(true);
    navigateTo('admin-dashboard');
  };

  const handleLogout = () => {
    storageService.setAdminLoggedIn(false);
    setIsAdmin(false);
    navigateTo('home');
  };

  const activeCategoryObject = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        currentView={currentView}
        onNavigate={(view) => navigateTo(view as any)}
        isAdmin={isAdmin}
        userProfile={userProfile}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-grow-1">
        {currentView === 'home' && (
          <>
            <Hero
              totalPosts={posts.filter((p) => p.published).length}
              totalCategories={categories.length}
              totalViews={totalViews}
              onExplore={() => {
                document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              selectedCategoryName={activeCategoryObject?.name}
              onResetCategory={() => setSelectedCategoryId(null)}
            />

            <div className="container mb-5" id="articles-section">
              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                    <div>
                      <h4 className="fw-bold mb-0 text-dark">
                        {activeCategoryObject ? `Kategori: ${activeCategoryObject.name}` : 'Karya Sastra & Tulisan Terkini'}
                      </h4>
                      {searchQuery && (
                        <small className="text-muted">Hasil pencarian untuk "{searchQuery}"</small>
                      )}
                    </div>
                    <span className="badge bg-warning-subtle text-warning-emphasis py-2 px-3 fw-semibold">
                      {filteredPublishedPosts.length} Karya Terbit
                    </span>
                  </div>

                  {filteredPublishedPosts.length === 0 ? (
                    <div className="card border-0 shadow-sm p-5 text-center bg-white my-3 rounded-4">
                      <i className="bi bi-search display-6 text-muted mb-3"></i>
                      <h5 className="fw-bold text-dark">Tidak Ada Karya Sastra Ditemukan</h5>
                      <p className="text-muted small mb-3">
                        Coba gunakan kata kunci lain atau telusuri kategori sastra lainnya.
                      </p>
                      <div>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategoryId(null);
                          }}
                        >
                          Reset Pencarian
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {filteredPublishedPosts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onSelectPost={(slug) => navigateTo('post-detail', slug)}
                          onSelectCategory={(catId) => setSelectedCategoryId(catId)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-lg-4">
                  <CategorySidebar
                    categories={categories}
                    posts={posts}
                    selectedCategoryId={selectedCategoryId}
                    onSelectCategory={setSelectedCategoryId}
                    onSelectPost={(slug) => navigateTo('post-detail', slug)}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {currentView === 'post-detail' && currentPost && (
          <PostDetail
            post={currentPost}
            relatedPosts={relatedPosts}
            comments={currentPostComments}
            authorProfile={userProfile}
            isAdmin={isAdmin}
            onBack={() => navigateTo('home')}
            onSelectPost={(slug) => navigateTo('post-detail', slug)}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
          />
        )}

        {currentView === 'post-detail' && !currentPost && (
          <div className="container py-5 text-center">
            <div className="card border-0 shadow-sm p-5 mx-auto" style={{ maxWidth: '450px' }}>
              <i className="bi bi-file-earmark-x display-4 text-warning mb-3"></i>
              <h4 className="fw-bold">Artikel Tidak Ditemukan</h4>
              <p className="text-muted small mb-4">Artikel yang Anda cari mungkin telah dipindahkan atau dihapus.</p>
              <button className="btn btn-primary btn-sm" onClick={() => navigateTo('home')}>
                Kembali ke Beranda
              </button>
            </div>
          </div>
        )}

        {currentView === 'admin-login' && (
          <AdminLogin
            onLoginSuccess={handleLoginSuccess}
            onBackToHome={() => navigateTo('home')}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboard
            posts={posts}
            categories={categories}
            totalComments={comments.length}
            userProfile={userProfile}
            onOpenCreateModal={() => {
              setEditingPost(null);
              setIsPostModalOpen(true);
            }}
            onOpenEditModal={(post) => {
              setEditingPost(post);
              setIsPostModalOpen(true);
            }}
            onDeletePost={handleDeletePost}
            onTogglePublish={handleTogglePublish}
            onOpenCategoriesModal={() => setIsCategoryModalOpen(true)}
            onOpenProfileModal={() => navigateTo('admin-profile')}
            onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
            onViewPostPublic={(slug) => navigateTo('post-detail', slug)}
            onLogout={handleLogout}
            onBackToHome={() => navigateTo('home')}
          />
        )}

        {currentView === 'admin-profile' && (
          <AdminProfilePage
            profile={userProfile}
            onSaveProfile={handleSaveProfile}
            onBackToDashboard={() => navigateTo('admin-dashboard')}
            onBackToHome={() => navigateTo('home')}
          />
        )}
      </main>

      <Footer
        onNavigateToHome={() => navigateTo('home')}
        onNavigateToAdmin={() => navigateTo(isAdmin ? 'admin-dashboard' : 'admin-login')}
      />

      {/* Modals */}
      <PostFormModal
        isOpen={isPostModalOpen}
        onClose={() => {
          setIsPostModalOpen(false);
          setEditingPost(null);
        }}
        onSave={handleSavePost}
        categories={categories}
        editingPost={editingPost}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
}
