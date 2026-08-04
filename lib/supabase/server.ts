import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase Client — Server Side
 * Gunakan file ini HANYA di:
 * - Server Components
 * - API Routes (Route Handlers)
 * - Server Actions
 *
 * ⚠️ JANGAN import file ini di Client Components!
 * SERVICE_ROLE_KEY memberikan akses penuh ke database.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
            );
          } catch {
            // Dapat diabaikan jika dipanggil dari Server Component
          }
        },
      },
    }
  );
}

/**
 * Supabase Admin Client — Hanya untuk operasi privileged di API Routes
 * Menggunakan SERVICE_ROLE_KEY — bypass Row Level Security
 */
export async function createAdminClient() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
