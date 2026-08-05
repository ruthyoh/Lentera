import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Award, Brain, Trophy } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import FormMasuk from './FormMasuk';

export const metadata: Metadata = {
  title: 'Masuk ke Lentera',
  description: 'Masuk ke akun Lentera dan akses ribuan materi belajar serta beasiswa.',
};

const poinUnggulan = [
  {
    ikon: BookOpen,
    teks: 'Ribuan catatan & rangkuman kuliah yang dikurasi komunitas',
  },
  {
    ikon: Award,
    teks: 'Pencocokan beasiswa otomatis sesuai profil akademikmu',
  },
  {
    ikon: Brain,
    teks: 'Ringkasan, kuis, dan draf esai beasiswa dihasilkan AI',
  },
  {
    ikon: Trophy,
    teks: 'Sistem poin & papan peringkat untuk motivasi belajar',
  },
];

export default function HalamanMasuk() {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--color-cream-200)' }}
    >
      {/* Panel Kiri — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero flex-col justify-center p-12 relative overflow-hidden">
        {/* Dekorasi background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, var(--color-gold-500), transparent 70%)' }}
          />
          <div
            className="absolute bottom-20 left-10 w-80 h-80 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, var(--color-gold-600), transparent 70%)' }}
          />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(201,151,30,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,151,30,0.3) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Konten panel — terpusat secara vertikal, TANPA logo kedua */}
        <div className="relative z-10 flex flex-col gap-8">
          {/* Kutipan langsung — tanpa logo tambahan di atasnya */}
          <blockquote>
            <p
              className="text-2xl font-bold leading-snug mb-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)' }}
            >
              &ldquo;Ilmu yang dibagikan adalah cahaya yang tidak pernah padam.&rdquo;
            </p>
            <footer className="text-sm" style={{ color: 'var(--text-muted-on-dark)' }}>
              — Semangat Lentera untuk mahasiswa Indonesia
            </footer>
          </blockquote>

          {/* Poin keunggulan */}
          <div className="space-y-4">
            {poinUnggulan.map((item) => {
              const Ikon = item.ikon;
              return (
                <div key={item.teks} className="flex items-start gap-3.5">
                  <div
                    className="w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(201,151,30,0.18)', border: '1px solid rgba(201,151,30,0.3)' }}
                  >
                    <Ikon size={16} style={{ color: 'var(--color-gold-300)' }} />
                  </div>
                  <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--text-on-dark)' }}>
                    {item.teks}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Badge TCC */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[var(--radius-sm)] text-xs font-semibold"
              style={{
                background: 'rgba(201,151,30,0.15)',
                border: '1px solid rgba(201,151,30,0.3)',
                color: 'var(--color-gold-300)',
              }}
            >
              ★ TCC Vibe Code 2026 — Triple-C
            </div>
          </div>
        </div>
      </div>

      {/* Panel Kanan — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 pt-24 lg:pt-16">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo ukuran="besar" />
          </div>

          <div className="mb-8">
            <h1
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-light)' }}
            >
              Selamat Datang Kembali 👋
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted-on-light)' }}>
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
              color: 'var(--text-on-light)',
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
          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted-on-light)' }}>
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="font-semibold transition-colors hover:underline"
              style={{ color: 'var(--color-gold-600)' }}
            >
              Daftar gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
