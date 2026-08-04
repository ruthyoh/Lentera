import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/ui/Logo';
import Tombol from '@/components/ui/Button';
import FormMasuk from './FormMasuk';

export const metadata: Metadata = {
  title: 'Masuk ke Lentera',
  description: 'Masuk ke akun Lentera dan akses ribuan materi belajar serta beasiswa.',
};

export default function HalamanMasuk() {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--color-cream-200)' }}
    >
      {/* Panel Kiri — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <div
            className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, var(--color-terracotta-400), transparent 70%)' }}
          />
          <div
            className="absolute bottom-20 left-10 w-80 h-80 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, var(--color-forest-300), transparent 70%)' }}
          />
        </div>

        <div className="relative z-10">
          <Logo ukuran="sedang" tampilkanTeks className="[&>a>span]:text-white" />
        </div>

        <div className="relative z-10 space-y-8">
          <blockquote className="text-white">
            <p className="text-2xl font-bold mb-4 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              &ldquo;Ilmu yang dibagikan adalah cahaya yang tidak pernah padam.&rdquo;
            </p>
            <footer className="text-sm opacity-75">
              — Semangat Lentera untuk mahasiswa Indonesia
            </footer>
          </blockquote>

          <div className="space-y-3">
            {[
              { emoji: '📚', teks: 'Ribuan materi kuliah berkualitas' },
              { emoji: '🏆', teks: 'Temukan beasiswa yang sesuai profilmu' },
              { emoji: '🤖', teks: 'Asisten Belajar & Beasiswa AI 24/7' },
            ].map((item) => (
              <div key={item.teks} className="flex items-center gap-3">
                <span className="text-xl">{item.emoji}</span>
                <p className="text-white/80 text-sm">{item.teks}</p>
              </div>
            ))}
          </div>

          {/* Logo TCC */}
          <Image
            src="/logo-tcc.svg"
            alt="TCC Triple-C Vibe Code 2026"
            width={120}
            height={36}
            className="opacity-60"
          />
        </div>
      </div>

      {/* Panel Kanan — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo ukuran="besar" />
          </div>

          <div className="mb-8">
            <h1
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-charcoal-900)' }}
            >
              Selamat Datang Kembali 👋
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-charcoal-500)' }}>
              Masuk untuk mengakses materi belajar dan beasiswamu.
            </p>
          </div>

          {/* Form masuk (Client Component) */}
          <FormMasuk />

          {/* Divider */}
          <div className="my-6 divider-teks">atau masuk dengan</div>

          {/* OAuth Google (placeholder — belum aktif) */}
          <button
            type="button"
            id="tombol-masuk-google"
            disabled
            title="Segera hadir"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-[var(--radius-sm)] border-2 text-sm font-semibold transition-all duration-200 opacity-50 cursor-not-allowed"
            style={{
              borderColor: 'var(--color-cream-400)',
              color: 'var(--color-charcoal-700)',
              background: 'white',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Masuk dengan Google (Segera Hadir)
          </button>

          {/* Link ke register */}
          <p className="text-center text-sm mt-6" style={{ color: 'var(--color-charcoal-500)' }}>
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="font-semibold transition-colors"
              style={{ color: 'var(--color-forest-700)' }}
            >
              Daftar gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
