import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/components/sections/Hero';
import ModulCard from '@/components/sections/ModulCard';
import Stats from '@/components/sections/Stats';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lentera — Terangi Jalan Akademismu',
  description:
    'Platform terintegrasi untuk mahasiswa Indonesia: repositori materi belajar berkualitas dan basis data beasiswa dengan kecerdasan buatan.',
};

const nilaiUnggulan = [
  {
    ikon: <Sparkles size={20} />,
    judul: 'Didukung AI',
    deskripsi: 'Asisten kecerdasan buatan membantu belajar lebih efektif dan menemukan beasiswa yang tepat',
  },
  {
    ikon: <Shield size={20} />,
    judul: 'Terpercaya',
    deskripsi: 'Materi dan beasiswa diverifikasi oleh komunitas mahasiswa dan tim editorial kami',
  },
  {
    ikon: <Zap size={20} />,
    judul: 'Gratis & Cepat',
    deskripsi: 'Akses seluruh fitur dasar secara gratis dengan antarmuka yang cepat dan responsif',
  },
];

export default function HalamanUtama() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Seksi Dua Modul */}
      <section
        className="py-20"
        style={{ background: 'var(--color-cream-100)' }}
        aria-labelledby="modul-judul"
      >
        <div className="container-lentera">
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: 'var(--color-gold-600)' }}
            >
              Dua Modul Terintegrasi
            </p>
            <h2
              id="modul-judul"
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-light)' }}
            >
              Satu Platform, Dua Solusi
            </h2>
            <p
              className="text-base max-w-2xl mx-auto"
              style={{ color: 'var(--text-muted-on-light)' }}
            >
              Lentera hadir dengan dua modul yang saling melengkapi untuk mendukung perjalanan akademik dan finansialmu sebagai mahasiswa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ModulCard modul="belajar" />
            <ModulCard modul="beasiswa" />
          </div>
        </div>
      </section>

      {/* Seksi Statistik */}
      <Stats />

      {/* Seksi Nilai Unggulan */}
      <section
        className="py-20"
        style={{ background: 'var(--color-cream-100)' }}
        aria-labelledby="nilai-judul"
      >
        <div className="container-lentera">
          <div className="text-center mb-14">
            <h2
              id="nilai-judul"
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-light)' }}
            >
              Mengapa Lentera?
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted-on-light)' }}>
              Dirancang khusus untuk kebutuhan mahasiswa Indonesia yang menginginkan akses pendidikan berkualitas dan berkelanjutan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nilaiUnggulan.map((nilai, index) => (
              <div
                key={nilai.judul}
                className="card-glass p-8 text-center group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div
                  className="w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: 'var(--color-gold-100)',
                    color: 'var(--color-gold-700)',
                  }}
                  aria-hidden="true"
                >
                  {nilai.ikon}
                </div>
                <h3
                  className="text-lg font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-light)' }}
                >
                  {nilai.judul}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted-on-light)' }}>
                  {nilai.deskripsi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Akhir */}
      <section
        className="py-24 relative overflow-hidden"
        aria-labelledby="cta-judul"
        style={{ background: 'var(--color-dark-800)' }}
      >
        {/* Dekorasi background */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, var(--color-terracotta-400), transparent 70%)' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, var(--color-gold-600), transparent 70%)' }}
          />
        </div>

        <div className="container-lentera text-center relative z-10">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-4"
            style={{ color: 'var(--color-terracotta-400)' }}
          >
            Mulai Sekarang
          </p>
          <h2
            id="cta-judul"
            className="text-3xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)' }}
          >
            Siap Meraih Impianmu?
          </h2>
          <p
            className="text-lg mb-10 max-w-xl mx-auto"
            style={{ color: 'var(--text-muted-on-dark)' }}
          >
            Bergabung sekarang dan mulai perjalanan belajarmu bersama ribuan mahasiswa Indonesia yang telah merasakan manfaat Lentera.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[var(--radius-sm)] font-semibold text-base shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              style={{
                background: 'var(--text-on-dark)',
                color: 'var(--text-on-light)',
              }}
              id="cta-daftar-sekarang"
            >
              <Sparkles size={18} />
              Daftar Gratis Sekarang
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/jelajah"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[var(--radius-sm)] font-semibold text-base border-2 hover:bg-white/10 transition-all duration-200"
              style={{ borderColor: 'var(--text-on-dark)', color: 'var(--text-on-dark)' }}
              id="cta-jelajah-dulu"
            >
              Jelajah Dulu
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
