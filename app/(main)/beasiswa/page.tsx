import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ambilDaftarBeasiswa } from '@/lib/actions/beasiswa';
import KomponenBeasiswa from '@/components/beasiswa/KomponenBeasiswa';

export const metadata: Metadata = {
  title: 'Jelajah Beasiswa | Lentera',
  description:
    'Temukan ratusan beasiswa dari pemerintah, swasta, dan internasional. Pencocokan cerdas dengan profil akademikmu menggunakan AI Gemini.',
};

export default async function HalamanBeasiswa() {
  const daftarBeasiswa = await ambilDaftarBeasiswa();

  return (
    <Suspense fallback={
      <div className="min-h-screen pt-16 flex items-center justify-center" style={{ background: 'var(--color-cream-200)' }}>
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-[var(--color-terracotta-300)] border-t-[var(--color-terracotta-600)] animate-spin mx-auto" />
          <p className="text-sm text-[var(--text-muted-on-light)]">Memuat data beasiswa...</p>
        </div>
      </div>
    }>
      <KomponenBeasiswa daftarBeasiswaAwal={daftarBeasiswa} />
    </Suspense>
  );
}
