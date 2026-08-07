import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase Client — Server Side (dengan Cookie Session)
 *
 * Gunakan di:
 * - Server Components
 * - Server Actions
 * - Route Handlers (GET yang perlu auth)
 *
 * Menggunakan ANON_KEY + cookie store untuk membaca sesi pengguna.
 * RLS tetap berlaku sesuai kebijakan Supabase.
 *
 * ⚠️ JANGAN gunakan di Client Components — import '@/lib/supabase/client' sebagai gantinya.
 *
 * @example
 * import { createServerSupabaseClient } from '@/lib/supabase/server'
 * const supabase = await createServerSupabaseClient()
 * const { data: { user } } = await supabase.auth.getUser()
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
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Dapat diabaikan jika dipanggil dari Server Component
            // (cookies tidak dapat di-set dari Server Component, hanya dari Middleware/Route Handler)
          }
        },
      },
    }
  );
}
