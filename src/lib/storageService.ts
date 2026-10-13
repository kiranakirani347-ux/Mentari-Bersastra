import { Category, Post, UserProfile, Comment } from '../types/database';
import { INITIAL_CATEGORIES, INITIAL_POSTS, INITIAL_USER_PROFILE, INITIAL_COMMENTS } from './initialData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const POSTS_STORAGE_KEY = 'mentari_bersastra_posts_v2';
const CATEGORIES_STORAGE_KEY = 'mentari_bersastra_categories_v2';
const ADMIN_AUTH_KEY = 'mentari_bersastra_session_v2';
const PROFILE_STORAGE_KEY = 'mentari_bersastra_profile_v2';
const COMMENTS_STORAGE_KEY = 'mentari_bersastra_comments_v2';
const USERS_LIST_STORAGE_KEY = 'mentari_bersastra_users_v2';

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  createdAt: string;
}

export const storageService = {
  // Membersihkan cache prototipe lama jika terdeteksi data lawas "modern_blog"
  checkAndCleanLegacyCache() {
    try {
      if (typeof window === 'undefined') return;
      const legacyPosts = localStorage.getItem('modern_blog_posts_v1');
      if (legacyPosts && legacyPosts.includes('Next.js')) {
        localStorage.removeItem('modern_blog_posts_v1');
        localStorage.removeItem('modern_blog_categories_v1');
        localStorage.removeItem('modern_blog_profile_v1');
        localStorage.removeItem('modern_blog_comments_v1');
      }
    } catch {
      // Abaikan jika gagal
    }
  },

  // ==========================================
  // 1. Profil Pengguna & Redaksi
  // ==========================================
  getProfile(): UserProfile {
    this.checkAndCleanLegacyCache();
    try {
      const data = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // Abaikan
    }
    this.saveProfile(INITIAL_USER_PROFILE);
    return INITIAL_USER_PROFILE;
  },

  saveProfile(profile: UserProfile) {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }

    // Jika Supabase aktif, simpan juga ke tabel profiles
    if (isSupabaseConfigured() && supabase) {
      supabase
        .from('profiles')
        .upsert({
          id: profile.id.length === 36 ? profile.id : undefined,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          website: profile.website || null,
          github: profile.github || null,
          twitter: profile.twitter || null,
          updated_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase sync profile notice:', error.message);
        });
    }
  },

  // ==========================================
  // 2. Registrasi & Manajemen Pengguna
  // ==========================================
  getRegisteredUsers(): RegisteredUser[] {
    try {
      const raw = localStorage.getItem(USERS_LIST_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Abaikan
    }
    const defaultUsers: RegisteredUser[] = [
      {
        id: 'usr-mentari-1',
        name: INITIAL_USER_PROFILE.name,
        email: INITIAL_USER_PROFILE.email,
        role: INITIAL_USER_PROFILE.role,
        password: 'admin123456',
        createdAt: new Date().toISOString(),
      },
    ];
    this.saveRegisteredUsers(defaultUsers);
    return defaultUsers;
  },

  saveRegisteredUsers(users: RegisteredUser[]) {
    try {
      localStorage.setItem(USERS_LIST_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save registered users', e);
    }
  },

  async registerUser(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<{ success: boolean; message: string; user?: RegisteredUser }> {
    const trimmedEmail = userData.email.trim().toLowerCase();
    const trimmedName = userData.name.trim();

    if (!trimmedName || !trimmedEmail || userData.password.length < 6) {
      return { success: false, message: 'Nama lengkap, email valid, dan kata sandi minimal 6 karakter wajib diisi.' };
    }

    const users = this.getRegisteredUsers();
    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, message: 'Alamat email ini sudah terdaftar sebagai pengguna/penulis.' };
    }

    const newUser: RegisteredUser = {
      id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'usr-' + Date.now(),
      name: trimmedName,
      email: trimmedEmail,
      role: userData.role || 'Penulis Kontributor',
      password: userData.password,
      createdAt: new Date().toISOString(),
    };

    // Jika Supabase aktif, daftar ke Supabase Auth
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: userData.password,
          options: {
            data: {
              name: trimmedName,
              role: newUser.role,
            },
          },
        });

        if (error) {
          console.warn('Supabase auth sign up notice:', error.message);
          // Tetap lanjutkan pembuatan user lokal jika mode email konfirmasi belum diverifikasi
        } else if (data.user) {
          newUser.id = data.user.id;
        }
      } catch (err: any) {
        console.warn('Supabase signup error:', err.message);
      }
    }

    // Simpan ke daftar lokal
    users.push(newUser);
    this.saveRegisteredUsers(users);

    // Otomatis aktifkan profil user baru ini
    const newProfile: UserProfile = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      bio: `Penulis dan kontributor literasi pada Mentari Bersastra. Bergabung sejak ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}.`,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newUser.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
    };
    this.saveProfile(newProfile);

    return {
      success: true,
      message: 'Pendaftaran akun berhasil! Anda kini telah terdaftar sebagai pengguna Mentari Bersastra.',
      user: newUser,
    };
  },

  // ==========================================
  // 3. Komentar Artikel
  // ==========================================
  getComments(postId?: string): Comment[] {
    let comments: Comment[] = [];
    try {
      const data = localStorage.getItem(COMMENTS_STORAGE_KEY);
      if (data) {
        comments = JSON.parse(data);
      } else {
        comments = INITIAL_COMMENTS;
        this.saveComments(comments);
      }
    } catch {
      comments = INITIAL_COMMENTS;
    }

    if (postId) {
      return comments.filter((c) => c.post_id === postId);
    }
    return comments;
  },

  saveComments(comments: Comment[]) {
    try {
      localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
    } catch (e) {
      console.error('Failed to save comments', e);
    }
  },

  addComment(postId: string, authorName: string, content: string): Comment {
    const comments = this.getComments();
    const newComment: Comment = {
      id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'cm-' + Date.now(),
      post_id: postId,
      author_name: authorName.trim() || 'Sahabat Sastra',
      content: content.trim(),
      created_at: new Date().toISOString(),
    };
    const updated = [newComment, ...comments];
    this.saveComments(updated);

    // Sync ke Supabase jika aktif
    if (isSupabaseConfigured() && supabase) {
      supabase
        .from('comments')
        .insert({
          post_id: newComment.post_id,
          author_name: newComment.author_name,
          content: newComment.content,
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase comment insert notice:', error.message);
        });
    }

    return newComment;
  },

  deleteComment(id: string) {
    const comments = this.getComments();
    const filtered = comments.filter((c) => c.id !== id);
    this.saveComments(filtered);

    if (isSupabaseConfigured() && supabase) {
      supabase.from('comments').delete().eq('id', id).then();
    }
  },

  // ==========================================
  // 4. Kategori Sastra
  // ==========================================
  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // Abaikan
    }
    this.saveCategories(INITIAL_CATEGORIES);
    return INITIAL_CATEGORIES;
  },

  saveCategories(categories: Category[]) {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories', e);
    }
  },

  addCategory(name: string, slug: string, description: string = ''): Category {
    const categories = this.getCategories();
    const newCategory: Category = {
      id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'cat-' + Date.now(),
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      created_at: new Date().toISOString(),
    };
    const updated = [...categories, newCategory];
    this.saveCategories(updated);

    if (isSupabaseConfigured() && supabase) {
      supabase
        .from('categories')
        .insert({
          name: newCategory.name,
          slug: newCategory.slug,
          description: newCategory.description,
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase category insert notice:', error.message);
        });
    }

    return newCategory;
  },

  deleteCategory(id: string) {
    const categories = this.getCategories();
    const updated = categories.filter((c) => c.id !== id);
    this.saveCategories(updated);

    if (isSupabaseConfigured() && supabase) {
      supabase.from('categories').delete().eq('id', id).then();
    }
  },

  // ==========================================
  // 5. Artikel & Karya Sastra
  // ==========================================
  getPosts(onlyPublished = false): Post[] {
    let posts: Post[] = [];
    try {
      const data = localStorage.getItem(POSTS_STORAGE_KEY);
      if (data) {
        posts = JSON.parse(data);
      } else {
        posts = INITIAL_POSTS;
        this.savePosts(posts);
      }
    } catch {
      posts = INITIAL_POSTS;
    }

    const categories = this.getCategories();
    const populated = posts.map((p) => ({
      ...p,
      categories: categories.find((c) => c.id === p.category_id) || null,
    }));

    if (onlyPublished) {
      return populated.filter((p) => p.published);
    }
    return populated;
  },

  savePosts(posts: Post[]) {
    try {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
    } catch (e) {
      console.error('Failed to save posts', e);
    }
  },

  getPostBySlug(slug: string): Post | undefined {
    const posts = this.getPosts();
    return posts.find((p) => p.slug === slug);
  },

  createPost(data: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Post {
    const posts = this.getPosts();
    const wordCount = (data.content || '').split(/\s+/).filter(Boolean).length;
    const calculatedReadingTime = Math.max(1, Math.round(wordCount / 180)) + ' menit baca';

    const newPost: Post = {
      ...data,
      id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'post-' + Date.now(),
      views: 1,
      reading_time: calculatedReadingTime,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [newPost, ...posts];
    this.savePosts(updated);

    // Sync ke Supabase jika aktif
    if (isSupabaseConfigured() && supabase) {
      supabase
        .from('posts')
        .insert({
          title: newPost.title,
          slug: newPost.slug,
          excerpt: newPost.excerpt,
          content: newPost.content,
          featured_image: newPost.featured_image,
          category_id: newPost.category_id,
          author_name: newPost.author_name,
          published: newPost.published,
          views: newPost.views,
          reading_time: newPost.reading_time,
        })
        .then(({ error }) => {
          if (error) console.warn('Supabase post insert notice:', error.message);
        });
    }

    return newPost;
  },

  updatePost(id: string, data: Partial<Post>): Post | null {
    const posts = this.getPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    let readingTime = posts[index].reading_time;
    if (data.content) {
      const wordCount = data.content.split(/\s+/).filter(Boolean).length;
      readingTime = Math.max(1, Math.round(wordCount / 180)) + ' menit baca';
    }

    const updatedPost: Post = {
      ...posts[index],
      ...data,
      reading_time: readingTime,
      updated_at: new Date().toISOString(),
    };
    posts[index] = updatedPost;
    this.savePosts(posts);

    // Sync ke Supabase
    if (isSupabaseConfigured() && supabase) {
      supabase
        .from('posts')
        .update({
          title: updatedPost.title,
          slug: updatedPost.slug,
          excerpt: updatedPost.excerpt,
          content: updatedPost.content,
          featured_image: updatedPost.featured_image,
          category_id: updatedPost.category_id,
          author_name: updatedPost.author_name,
          published: updatedPost.published,
          reading_time: updatedPost.reading_time,
          updated_at: updatedPost.updated_at,
        })
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.warn('Supabase post update notice:', error.message);
        });
    }

    return updatedPost;
  },

  deletePost(id: string) {
    const posts = this.getPosts();
    const filtered = posts.filter((p) => p.id !== id);
    this.savePosts(filtered);

    if (isSupabaseConfigured() && supabase) {
      supabase.from('posts').delete().eq('id', id).then();
    }
  },

  // ==========================================
  // 6. Status Autentikasi Pengguna & Admin
  // ==========================================
  isAdminLoggedIn(): boolean {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  },

  setAdminLoggedIn(val: boolean) {
    try {
      if (val) {
        localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      } else {
        localStorage.removeItem(ADMIN_AUTH_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  },
};
