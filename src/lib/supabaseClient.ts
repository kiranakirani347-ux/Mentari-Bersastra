import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Mengambil konfigurasi kredensial Supabase.
 * Mengutamakan variabel lingkungan Vite, dengan kemampuan override melalui pengaturan lokal.
 */
export const getSupabaseConfig = (): { url: string; anonKey: string; isConfigured: boolean } => {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  const customUrl = (typeof window !== 'undefined' ? localStorage.getItem('custom_supabase_url') : '') || '';
  const customKey = (typeof window !== 'undefined' ? localStorage.getItem('custom_supabase_key') : '') || '';

  const activeUrl = (customUrl.trim() || envUrl.trim());
  const activeKey = (customKey.trim() || envKey.trim());

  return {
    url: activeUrl,
    anonKey: activeKey,
    isConfigured: Boolean(activeUrl && activeKey && activeUrl.startsWith('http')),
  };
};

const config = getSupabaseConfig();

/**
 * Singleton client Supabase untuk browser.
 * Bernilai null jika belum dikonfigurasi.
 */
export const supabase: SupabaseClient | null = config.isConfigured
  ? createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Memeriksa apakah Supabase siap digunakan.
 */
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};

/**
 * Menguji koneksi langsung ke Supabase Cloud.
 */
export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  if (!supabase) {
    return {
      success: false,
      message: 'Kredensial Supabase belum terkonfigurasi pada Environment Variables Vercel atau Pengaturan.',
    };
  }

  try {
    const { error } = await supabase.from('categories').select('id').limit(1);
    if (error) throw error;
    return {
      success: true,
      message: 'Koneksi ke database Supabase Cloud terverifikasi aktif!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Gagal terhubung ke database Supabase Cloud.',
    };
  }
};
