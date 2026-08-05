import type { Metadata } from 'next';
import { BookOpen, Award, Brain, Users } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import FormDaftar from './FormDaftar';

export const metadata: Metadata = {
  title: 'Daftar Akun Lentera',
  description: 'Buat akun Lentera gratis dan mulai akses ribuan materi belajar serta temukan beasiswa.',
};

const poinUnggulan = [
  {
    ikon: BookOpen,
    teks: 'Akses ribuan catatan & materi kuliah berkualitas',
  },
  {
    ikon: Award,
    teks: 'Temukan beasiswa yang sesuai profilmu secara otomatis',
  },
  {
    ikon: Brain,
    teks: 'Ringkasan, kuis, dan pencocokan beasiswa dibantu AI',
  },
  {
    ikon: Users,
    teks: 'Bergabung bersama 5.000+ mahasiswa di seluruh Indonesia',
  },
];

export default function HalamanDaftar() {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--color-cream-200)' }}
    >
      {/* Panel Kiri — Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-hero flex-col justify-center p-12 relative overflow-hidden">
        {/* Dekorasi background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, var(--color-gold-500), transparent 70%)' }}
          />
          <div
            className="absolute bottom-10 left-10 w-56 h-56 rounded-full opacity-8"
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
          {/* Headline langsung — tanpa logo tambahan di atasnya */}
          <div>
            <h2
              className="text-2xl lg:text-3xl font-bold leading-snug mb-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)' }}
            >
              Satu platform untuk belajar dan meraih beasiswa
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted-on-dark)' }}>
              Gratis selamanya untuk fitur dasar.
            </p>
          </div>

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

          {/* Badge TCC — dengan teks yang jelas dan kontras tinggi (bukan kotak kosong) */}
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
      <div className="flex-1 flex items-start justify-center p-6 lg:p-12 overflow-y-auto pt-24 lg:pt-20">
        <div className="w-full max-w-lg py-6">
          {/* Logo mobile */}
          <div className="lg:hidden mb-6 flex justify-center">
            <Logo ukuran="sedang" />
          </div>

          <div className="mb-8">
            <h1
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-light)' }}
            >
              Buat Akun Gratis ✨
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted-on-light)' }}>
              Isi data diri berikut untuk memulai perjalanan belajarmu di Lentera.
            </p>
          </div>

          {/* Form daftar (Client Component) */}
          <FormDaftar />
        </div>
      </div>
    </div>
  );
}
