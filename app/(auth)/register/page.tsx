import type { Metadata } from 'next';
import Image from 'next/image';
import Logo from '@/components/ui/Logo';
import FormDaftar from './FormDaftar';

export const metadata: Metadata = {
  title: 'Daftar Akun Lentera',
  description: 'Buat akun Lentera gratis dan mulai akses ribuan materi belajar serta temukan beasiswa.',
};

export default function HalamanDaftar() {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--color-cream-200)' }}
    >
      {/* Panel Kiri — Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-hero flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <div
            className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, var(--color-terracotta-400), transparent 70%)' }}
          />
          <div
            className="absolute bottom-10 left-10 w-56 h-56 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, var(--color-forest-300), transparent 70%)' }}
          />
        </div>

        <div className="relative z-10">
          <Logo ukuran="sedang" tampilkanTeks className="[&>a>span]:text-white" />
        </div>

        <div className="relative z-10 space-y-6">
          {[
            { emoji: '📚', teks: 'Akses ribuan materi kuliah berkualitas' },
            { emoji: '🏆', teks: 'Temukan beasiswa yang sesuai profilmu' },
            { emoji: '🤖', teks: 'Dibantu Asisten AI 24/7' },
            { emoji: '🎓', teks: 'Bergabung bersama 5.000+ mahasiswa' },
          ].map((item) => (
            <div key={item.teks} className="flex items-center gap-3">
              <span className="text-2xl">{item.emoji}</span>
              <p className="text-white/85 text-sm font-medium">{item.teks}</p>
            </div>
          ))}

          <Image
            src="/logo-tcc.svg"
            alt="TCC Triple-C Vibe Code 2026"
            width={120}
            height={36}
            className="opacity-60 mt-4"
          />
        </div>
      </div>

      {/* Panel Kanan — Form */}
      <div className="flex-1 flex items-start justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-lg py-6">
          {/* Logo mobile */}
          <div className="lg:hidden mb-6 flex justify-center">
            <Logo ukuran="sedang" />
          </div>

          <div className="mb-8">
            <h1
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-charcoal-900)' }}
            >
              Buat Akun Gratis ✨
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-charcoal-500)' }}>
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
