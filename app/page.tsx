import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/components/sections/Hero';
import ModulCard from '@/components/sections/ModulCard';
import Stats from '@/components/sections/Stats';
import { ArrowRight, Sparkles, Shield, Zap, BookOpen, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lentera — Terangi Jalan Akademismu',
  description:
    'Platform terintegrasi untuk mahasiswa Indonesia: repositori materi belajar berkualitas dan basis data beasiswa dengan kecerdasan buatan.',
};

const nilaiUnggulan = [
  {
    ikon: <Sparkles size={24} />,
    judul: 'Didukung AI',
    deskripsi: 'Asisten kecerdasan buatan membantu belajar lebih efektif dan menemukan beasiswa yang tepat',
    badge: 'Kecerdasan Buatan',
    topBar: 'from-cyan-400 via-teal-400 to-blue-500',
    iconBg: 'bg-cyan-500/10 text-cyan-700 border border-cyan-400/30 group-hover:bg-cyan-600 group-hover:text-white',
    glow: 'from-cyan-500/15 via-teal-500/5 to-transparent',
  },
  {
    ikon: <Shield size={24} />,
    judul: 'Terpercaya',
    deskripsi: 'Materi dan beasiswa diverifikasi oleh komunitas mahasiswa dan tim editorial kami',
    badge: 'Terverifikasi',
    topBar: 'from-indigo-400 via-purple-400 to-rose-400',
    iconBg: 'bg-indigo-500/10 text-indigo-700 border border-indigo-400/30 group-hover:bg-indigo-600 group-hover:text-white',
    glow: 'from-indigo-500/15 via-purple-500/5 to-transparent',
  },
  {
    ikon: <Zap size={24} />,
    judul: 'Gratis & Cepat',
    deskripsi: 'Akses seluruh fitur dasar secara gratis dengan antarmuka yang cepat dan responsif',
    badge: 'Akses Terbuka',
    topBar: 'from-amber-400 via-rose-400 to-pink-500',
    iconBg: 'bg-amber-500/10 text-amber-700 border border-amber-400/30 group-hover:bg-amber-500 group-hover:text-white',
    glow: 'from-amber-500/15 via-rose-500/5 to-transparent',
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
        className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, var(--color-mist-100) 0%, #f3eeff 50%, var(--color-mist-200) 100%)' }}
        aria-labelledby="nilai-judul"
      >
        {/* Background Rame: Grid pattern, Lentera melayang, ring & pendaran cahaya */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-12"
            style={{
              backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 51, 234, 0.15) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Glowing Orbs */}
          <div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-25 blur-3xl animate-glow-pulse"
            style={{ background: 'radial-gradient(circle, #f59e0b 0%, rgba(245, 158, 11, 0.1) 60%, transparent 80%)' }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-25 blur-3xl animate-glow-pulse"
            style={{ background: 'radial-gradient(circle, var(--color-aurora-400) 0%, rgba(6, 182, 212, 0.1) 60%, transparent 80%)', animationDelay: '2s' }}
          />

          {/* Floating Sky Lantern 1 (Kiri Tengah) */}
          <div className="absolute top-[28%] left-[5%] opacity-45 animate-float-lentera" style={{ animationDuration: '11s', animationDelay: '1s' }}>
            <svg width="32" height="46" viewBox="0 0 40 56" fill="none">
              <circle cx="20" cy="28" r="15" fill="#F59E0B" opacity="0.4" className="animate-pulse" />
              <path d="M10 14C10 14 6 26 10 38C14 50 26 50 30 38C34 26 30 14 30 14H10Z" fill="url(#nilaiLantern1)" stroke="#FBBF24" strokeWidth="1.2" />
              <circle cx="20" cy="27" r="4.5" fill="#FEF08A" opacity="0.9" />
              <defs>
                <linearGradient id="nilaiLantern1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(245, 158, 11, 0.7)" />
                  <stop offset="100%" stopColor="rgba(236, 72, 153, 0.8)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Floating Sky Lantern 2 (Kanan Atas) */}
          <div className="absolute top-[18%] right-[6%] opacity-50 animate-float-lentera" style={{ animationDuration: '9.5s', animationDelay: '2.5s' }}>
            <svg width="34" height="48" viewBox="0 0 40 56" fill="none">
              <circle cx="20" cy="28" r="16" fill="var(--color-aurora-400)" opacity="0.4" className="animate-pulse" />
              <path d="M10 14C10 14 6 26 10 38C14 50 26 50 30 38C34 26 30 14 30 14H10Z" fill="url(#nilaiLantern2)" stroke="var(--color-aurora-300)" strokeWidth="1.2" />
              <circle cx="20" cy="27" r="5" fill="#7DD3FC" opacity="0.9" />
              <defs>
                <linearGradient id="nilaiLantern2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(6, 182, 212, 0.7)" />
                  <stop offset="100%" stopColor="rgba(99, 102, 241, 0.8)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Decorative concentric ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-purple-300/25 pointer-events-none" />

          {/* Floating sparks berpendar */}
          {[
            { top: '20%', left: '18%', size: '8px', delay: '0.4s', color: '#FBBF24' },
            { top: '35%', right: '22%', size: '6px', delay: '1.6s', color: 'var(--color-aurora-400)' },
            { top: '70%', left: '30%', size: '7px', delay: '2.8s', color: 'var(--color-rose-400)' },
            { top: '80%', right: '15%', size: '9px', delay: '0.9s', color: '#A855F7' },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                top: p.top,
                left: p.left,
                right: p.right,
                width: p.size,
                height: p.size,
                background: p.color,
                boxShadow: `0 0 12px ${p.color}, 0 0 20px ${p.color}`,
                animationDelay: p.delay,
                animationDuration: '2.5s',
              }}
            />
          ))}
        </div>

        <div className="container-lentera relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-amber-500/10 text-amber-800 border border-amber-500/20 shadow-xs mb-4 backdrop-blur-xs">
              <Sparkles size={14} className="text-amber-600 animate-pulse" />
              Keunggulan Utama
            </span>
            <h2
              id="nilai-judul"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-light)' }}
            >
              Mengapa{' '}
              <span className="bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 bg-clip-text text-transparent">
                Lentera?
              </span>
            </h2>
            <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted-on-light)' }}>
              Dirancang khusus untuk kebutuhan mahasiswa Indonesia yang menginginkan akses pendidikan berkualitas dan berkelanjutan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {nilaiUnggulan.map((nilai, index) => (
              <div
                key={nilai.judul}
                className="group relative bg-white/85 backdrop-blur-md rounded-2xl p-8 text-center border border-purple-200/60 shadow-lg hover:shadow-2xl hover:border-amber-400/80 transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col justify-between"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Top Glowing Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${nilai.topBar} opacity-75 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Hover gradient glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${nilai.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10">
                  {/* Badge Tag */}
                  <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-purple-100/80 text-purple-700 mb-6">
                    {nilai.badge}
                  </div>

                  {/* Icon Box */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs group-hover:shadow-md ${nilai.iconBg}`}
                    aria-hidden="true"
                  >
                    {nilai.ikon}
                  </div>

                  <h3
                    className="text-xl font-extrabold mb-3 tracking-tight"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-light)' }}
                  >
                    {nilai.judul}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted-on-light)' }}>
                    {nilai.deskripsi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Akhir — Mulai Perjalanan Belajarmu */}
      <section
        className="py-24 relative overflow-hidden"
        aria-labelledby="cta-judul"
        style={{ background: 'var(--color-dark-800)' }}
      >
        {/* Dekorasi background */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-15 blur-3xl"
            style={{ background: 'radial-gradient(circle, var(--color-aurora-400), transparent 70%)' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, var(--color-gold-400), transparent 70%)' }}
          />
          <div
            className="absolute inset-0 opacity-8"
            style={{
              backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.12) 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <div className="container-lentera text-center relative z-10">
          <p
            className="text-sm font-bold tracking-widest uppercase mb-4"
            style={{ color: 'var(--text-muted-on-dark)' }}
          >
            Mulai Sekarang
          </p>
          <h2
            id="cta-judul"
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)' }}
          >
            Mulai Perjalanan Belajarmu
          </h2>
          <h3
            className="text-xl md:text-2xl font-semibold mb-6"
            style={{ color: 'var(--color-gold-300)' }}
          >
            Akses Ribuan Materi &amp; Beasiswa
          </h3>
          <p
            className="text-lg mb-10 max-w-xl mx-auto"
            style={{ color: 'var(--text-muted-on-dark)' }}
          >
            Bergabung bersama ribuan mahasiswa yang sudah memanfaatkan Lentera untuk meraih prestasi akademik dan finansial terbaik.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[var(--radius-sm)] font-semibold text-base shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              style={{
                background: 'var(--text-on-dark)',
                color: 'var(--text-on-light)',
              }}
              id="cta-mulai-belajar"
            >
              <BookOpen size={18} />
              Mulai Belajar Gratis
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/beasiswa"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[var(--radius-sm)] font-semibold text-base border-2 hover:bg-white/10 transition-all duration-200"
              style={{ borderColor: 'var(--text-on-dark)', color: 'var(--text-on-dark)' }}
              id="cta-cari-beasiswa"
            >
              <Award size={18} />
              Cari Beasiswa
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}
