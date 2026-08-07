import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase Client — Browser Side
 *
 * Gunakan di Client Components ('use client') saja.
 * Hanya menggunakan NEXT_PUBLIC_SUPABASE_ANON_KEY yang aman diekspos ke publik.
 *
 * @example
 * 'use client'
 * import { createClient } from '@/lib/supabase/client'
 * const supabase = createClient()
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
