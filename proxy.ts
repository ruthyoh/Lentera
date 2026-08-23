import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * Proxy Proteksi Rute Lentera (Next.js 16 — file convention: proxy.ts)
 *
 * Bertanggung jawab untuk:
 * 1. Refresh sesi Supabase (agar cookies auth selalu segar)
 * 2. Proteksi rute yang membutuhkan autentikasi
 * 3. Redirect user yang sudah login agar tidak mengakses /login & /register
 */

/** Rute yang HARUS login untuk mengaksesnya */
const RUTE_DILINDUNGI = [
  '/profil',
  '/papan-peringkat',
];

/** Rute auth — jika sudah login, redirect ke /jelajah */
const RUTE_AUTH = ['/login', '/register'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Buat response awal agar cookies bisa dimutasi
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(
              name,
              value,
              options as Parameters<typeof supabaseResponse.cookies.set>[2]
            )
          );
        },
      },
    }
  );

  // Refresh sesi user (wajib agar cookies tidak kedaluwarsa)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adalahRuteDilindungi = RUTE_DILINDUNGI.some((rute) =>
    pathname.startsWith(rute)
  );

  const adalahRuteAuth = RUTE_AUTH.some((rute) =>
    pathname.startsWith(rute)
  );

  // Jika mengakses rute yang dilindungi tanpa login → redirect ke /login
  if (adalahRuteDilindungi && !user) {
    const urlLogin = request.nextUrl.clone();
    urlLogin.pathname = '/login';
    urlLogin.searchParams.set('dari', pathname);
    return NextResponse.redirect(urlLogin);
  }

  // Jika sudah login dan mencoba akses /login atau /register → redirect ke /jelajah
  if (adalahRuteAuth && user) {
    const urlJelajah = request.nextUrl.clone();
    urlJelajah.pathname = '/jelajah';
    urlJelajah.search = '';
    return NextResponse.redirect(urlJelajah);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Cocokkan semua path kecuali:
     * - _next/static (file statis)
     * - _next/image (optimasi gambar)
     * - File publik (SVG, PNG, ICO, dll.)
     */
    '/((?!_next/static|_next/image|favicon.ico|logo\\.svg|logo-tcc\\.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
