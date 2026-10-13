import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfigStatus {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  source: 'vercel_env' | 'local_override' | 'none';
}

/**
 * Mengambil konfigurasi kredensial Supabase.
 * Mengutamakan variabel lingkungan Vite, dengan kemampuan override melalui pengaturan lokal (localStorage).
 */
export const getSupabaseConfig = (): SupabaseConfigStatus => {
  const customUrl = (typeof window !== 'undefined' ? localStorage.getItem('custom_supabase_url') : '') || '';
  const customKey = (typeof window !== 'undefined' ? localStorage.getItem('custom_supabase_key') : '') || '';

  if (customUrl.trim() && customKey.trim() && customUrl.startsWith('http')) {
    return {
      url: customUrl.trim(),
      anonKey: customKey.trim(),
      isConfigured: true,
      source: 'local_override',
    };
  }

  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  if (envUrl.trim() && envKey.trim() && envUrl.startsWith('http')) {
    return {
      url: envUrl.trim(),
      anonKey: envKey.trim(),
      isConfigured: true,
      source: 'vercel_env',
    };
  }

  return {
    url: '',
    anonKey: '',
    isConfigured: false,
    source: 'none',
  };
};

let activeClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const currentConfig = getSupabaseConfig();
  if (!currentConfig.isConfigured) {
    activeClient = null;
    return null;
  }

  if (!activeClient) {
    activeClient = createClient(currentConfig.url, currentConfig.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return activeClient;
};

// Singleton export
export const supabase = getSupabaseClient();

/**
 * Memeriksa apakah Supabase siap digunakan.
 */
export const isSupabaseConfigured = (): boolean => {
  return getSupabaseConfig().isConfigured;
};

/**
 * Menguji koneksi langsung ke Supabase Cloud.
 */
export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string; config: SupabaseConfigStatus }> => {
  const currentConfig = getSupabaseConfig();
  const client = getSupabaseClient();

  if (!client || !currentConfig.isConfigured) {
    return {
      success: false,
      message: 'Kredensial Supabase belum terdeteksi. Silakan periksa Environment Variables di Vercel (lalu Redeploy) atau masukkan lewat modal pengaturan.',
      config: currentConfig,
    };
  }

  try {
    // Uji kueri ringan ke tabel categories atau auth check
    const { error } = await client.from('categories').select('id').limit(1);
    if (error) {
      // Jika tabel belum dibuat, periksa apakah koneksi auth berhasil
      if (error.code === '42P01') { // relation does not exist
        return {
          success: true,
          message: `Koneksi ke Supabase Cloud (${currentConfig.url}) BERHASIL! Namun skrip SQL 'supabase_schema_fix.sql' belum dieksekusi di SQL Editor Supabase.`,
          config: currentConfig,
        };
      }
      throw error;
    }
    return {
      success: true,
      message: `Terhubung sempurna ke Supabase Cloud (${currentConfig.url})! Database siap digunakan.`,
      config: currentConfig,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Gagal menghubungi server database Supabase.',
      config: currentConfig,
    };
  }
};
