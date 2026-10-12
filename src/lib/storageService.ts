import { Category, Post, UserProfile, Comment } from '../types/database';
import { INITIAL_CATEGORIES, INITIAL_POSTS, INITIAL_USER_PROFILE, INITIAL_COMMENTS } from './initialData';

const POSTS_STORAGE_KEY = 'modern_blog_posts_v1';
const CATEGORIES_STORAGE_KEY = 'modern_blog_categories_v1';
const ADMIN_AUTH_KEY = 'modern_blog_admin_session_v1';
const PROFILE_STORAGE_KEY = 'modern_blog_profile_v1';
const COMMENTS_STORAGE_KEY = 'modern_blog_comments_v1';

export const storageService = {
  // Profil User Admin
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // Abaikan jika error
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
  },

  // Komentar Artikel
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
      id: 'cm-' + Date.now(),
      post_id: postId,
      author_name: authorName.trim(),
      content: content.trim(),
      created_at: new Date().toISOString(),
    };
    const updated = [newComment, ...comments];
    this.saveComments(updated);
    return newComment;
  },

  deleteComment(id: string) {
    const comments = this.getComments();
    const filtered = comments.filter((c) => c.id !== id);
    this.saveComments(filtered);
  },

  // Kategori
  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // Abaikan jika error
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
      id: 'cat-' + Date.now(),
      name,
      slug,
      description: description || null,
      created_at: new Date().toISOString(),
    };
    const updated = [...categories, newCategory];
    this.saveCategories(updated);
    return newCategory;
  },

  deleteCategory(id: string) {
    const categories = this.getCategories();
    const updated = categories.filter((c) => c.id !== id);
    this.saveCategories(updated);
  },

  // Artikel
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
    const newPost: Post = {
      ...data,
      id: 'post-' + Date.now(),
      views: 1,
      reading_time: Math.max(1, Math.round(data.content.split(' ').length / 200)) + ' menit baca',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [newPost, ...posts];
    this.savePosts(updated);
    return newPost;
  },

  updatePost(id: string, data: Partial<Post>): Post | null {
    const posts = this.getPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updatedPost: Post = {
      ...posts[index],
      ...data,
      updated_at: new Date().toISOString(),
      reading_time: data.content 
        ? Math.max(1, Math.round(data.content.split(' ').length / 200)) + ' menit baca'
        : posts[index].reading_time,
    };
    posts[index] = updatedPost;
    this.savePosts(posts);
    return updatedPost;
  },

  deletePost(id: string) {
    const posts = this.getPosts();
    const filtered = posts.filter((p) => p.id !== id);
    this.savePosts(filtered);
  },

  // Sesi admin
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
