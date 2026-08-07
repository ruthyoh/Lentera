import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * Proxy Lentera — Next.js 16 (menggantikan middleware.ts)
 * Bertanggung jawab untuk:
 * 1. Refresh sesi Supabase (agar cookies auth selalu segar)
 * 2. Proteksi rute yang membutuhkan autentikasi
 * 3. Redirect user yang sudah login agar tidak mengakses /login & /register
 */

/** Rute yang HARUS login untuk mengaksesnya */
const RUTE_DILINDUNGI = [
  '/jelajah',
  '/materi',
  '/beasiswa',
  '/profil',
  '/papan-peringkat',
  '/unggah',
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
          // Update cookies di request untuk propagasi ke server
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Buat ulang response dengan cookies yang diperbarui
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          );
        },
      },
    }
  );

  // PENTING: Selalu gunakan getUser() bukan getSession() untuk keamanan
  // getUser() memvalidasi token ke server Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- Logika Proteksi Rute ---

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
    // Simpan tujuan asal agar bisa redirect setelah login
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

  // Kembalikan response dengan cookies yang sudah diperbarui
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Cocokkan semua path kecuali:
     * - _next/static (file statis Turbopack/Webpack)
     * - _next/image (optimasi gambar)
     * - File publik (SVG, PNG, ICO, dll.)
     */
    '/((?!_next/static|_next/image|favicon.ico|logo\\.svg|logo-tcc\\.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
