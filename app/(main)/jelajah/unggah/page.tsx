import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Upload, Sparkles } from 'lucide-react';
import FormUnggahMateri from '@/components/materi/FormUnggahMateri';

export const metadata: Metadata = {
  title: 'Unggah Materi Belajar',
  description: 'Bagikan catatan kuliah, rangkuman, atau bank soal untuk membantu sesama mahasiswa dan dapatkan poin kontribusi.',
};

export default function HalamanUnggahMateri() {
  return (
    <div
      className="min-h-screen pt-16"
      style={{ background: 'var(--color-cream-200)' }}
    >
      {/* Header */}
      <div
        className="py-12 relative overflow-hidden"
        style={{ background: 'var(--color-dark-800)' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          aria-hidden="true"
          style={{
            backgroundImage: `linear-gradient(rgba(201,151,30,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,151,30,0.3) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="container-lentera relative z-10">
          <Link
            href="/jelajah"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-4 transition-colors text-[var(--color-gold-400)] hover:underline"
          >
            <ArrowLeft size={14} />
            Kembali ke Jelajah Materi
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1
                className="text-3xl font-bold mb-2 text-[var(--text-on-dark)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Unggah Materi Belajar
              </h1>
              <p className="text-sm text-[var(--text-muted-on-dark)]">
                Bagikan catatan, rangkuman, atau bank soal terbaikmu untuk mahasiswa se-Indonesia.
              </p>
            </div>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(201,151,30,0.18)',
                border: '1px solid rgba(201,151,30,0.35)',
                color: 'var(--color-gold-300)',
              }}
            >
              <Sparkles size={14} />
              Dapatkan +10 Poin Kontribusi per Berkas
            </div>
          </div>
        </div>
      </div>

      <div className="container-lentera py-10">
        <div className="max-w-2xl mx-auto card-glass p-8">
          <FormUnggahMateri />
        </div>
      </div>
    </div>
  );
}
