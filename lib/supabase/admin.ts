import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Admin Client — Server-Side Only, Privileged
 *
 * Menggunakan SUPABASE_SERVICE_ROLE_KEY yang mem-bypass Row Level Security (RLS).
 * Gunakan HANYA untuk operasi server-side yang membutuhkan akses administrator.
 *
 * ⚠️ JANGAN PERNAH di-import di Client Components.
 *
 * @example
 * import { createAdminClient } from '@/lib/supabase/admin'
 * const supabase = createAdminClient()
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('[Supabase Admin] NEXT_PUBLIC_SUPABASE_URL belum diatur.');
  }
  if (!serviceRoleKey) {
    throw new Error('[Supabase Admin] SUPABASE_SERVICE_ROLE_KEY belum diatur.');
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
