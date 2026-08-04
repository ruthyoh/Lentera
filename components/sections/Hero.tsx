import Link from 'next/link';
import { BookOpen, Award, ArrowRight, Sparkles, Star } from 'lucide-react';
import Tombol from '@/components/ui/Button';

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero"
      aria-labelledby="hero-judul"
    >
      {/* Background dekoratif */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Orbs */}
        <div
          className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, var(--color-terracotta-400), transparent 70%)' }}
        />
        <div
          className="absolute bottom-20 left-10 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, var(--color-forest-300), transparent 70%)' }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(var(--color-cream-200) 1px, transparent 1px), linear-gradient(90deg, var(--color-cream-200) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        {/* Floating lantern icon */}
        <div className="absolute top-1/4 right-1/4 w-24 h-24 opacity-10 animate-float">
          <svg viewBox="0 0 40 40" fill="white" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="6" width="12" height="2" rx="1"/>
            <rect x="10" y="8" width="20" height="22" rx="4"/>
            <rect x="12" y="30" width="16" height="3" rx="1.5"/>
          </svg>
        </div>
      </div>

      <div className="container-lentera relative z-10 py-24">
        <div className="max-w-3xl">
          {/* Badge kompetisi */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-semibold tracking-wide"
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'var(--color-cream-100)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Star size={12} className="text-yellow-300" fill="currentColor" />
            TCC Vibe Code 2026 — Digital Innovation &amp; Sustainable Communities
          </div>

          {/* Judul utama */}
          <h1
            id="hero-judul"
            className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Terangi Jalan{' '}
            <span
              className="relative"
              style={{ color: 'var(--color-terracotta-300)' }}
            >
              Akademismu
              <span
                className="absolute -bottom-1 left-0 right-0 h-1 rounded-full opacity-60"
                style={{ background: 'var(--color-terracotta-400)' }}
                aria-hidden="true"
              />
            </span>
          </h1>

          {/* Subjudul */}
          <p
            className="text-lg md:text-xl leading-relaxed mb-10 max-w-2xl animate-fade-in-up animate-delay-100"
            style={{ color: 'rgba(245, 240, 232, 0.85)' }}
          >
            <strong className="text-white font-semibold">Lentera</strong> — platform terintegrasi yang mendukung 
            keberlanjutan akses pendidikan mahasiswa. Bagikan ilmu, temukan beasiswa, 
            dan raih impian dengan bantuan kecerdasan buatan.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-14 animate-fade-in-up animate-delay-200">
            <Link href="/jelajah">
              <Tombol
                ukuran="besar"
                className="bg-white! text-[var(--color-forest-700)]! hover:bg-[var(--color-cream-200)]! shadow-lg!"
                ikonKiri={<BookOpen size={18} />}
                ikonKanan={<ArrowRight size={16} />}
              >
                Mulai Belajar
              </Tombol>
            </Link>
            <Link href="/beasiswa">
              <Tombol
                ukuran="besar"
                className="border-2! border-white! text-white! bg-transparent! hover:bg-white/15!"
                ikonKiri={<Award size={18} />}
                ikonKanan={<ArrowRight size={16} />}
              >
                Cari Beasiswa
              </Tombol>
            </Link>
          </div>

          {/* Statistik kecil */}
          <div
            className="flex flex-wrap gap-8 animate-fade-in-up animate-delay-300"
            role="list"
            aria-label="Statistik platform"
          >
            {[
              { angka: '5.000+', label: 'Mahasiswa Aktif' },
              { angka: '12.000+', label: 'Materi Tersedia' },
              { angka: '300+', label: 'Beasiswa Terdaftar' },
            ].map((stat) => (
              <div key={stat.label} role="listitem">
                <p
                  className="text-2xl font-bold"
                  style={{ color: 'var(--color-terracotta-300)', fontFamily: 'var(--font-display)' }}
                >
                  {stat.angka}
                </p>
                <p className="text-sm" style={{ color: 'rgba(245, 240, 232, 0.7)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Floating module preview cards */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block w-96 space-y-4 pr-4 opacity-90" aria-hidden="true">
          {/* Card Belajar */}
          <div
            className="p-5 rounded-[var(--radius-lg)] animate-fade-in-up animate-delay-200"
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-forest-500)' }}>
                <BookOpen size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Modul Belajar</p>
                <p className="text-xs" style={{ color: 'rgba(245,240,232,0.6)' }}>Repositori &amp; Asisten AI</p>
              </div>
            </div>
            <div className="flex gap-2">
              {['Catatan', 'Rangkuman', 'Bank Soal'].map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--color-cream-200)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Card Beasiswa */}
          <div
            className="p-5 rounded-[var(--radius-lg)] ml-8 animate-fade-in-up animate-delay-300"
            style={{
              background: 'rgba(196, 98, 45, 0.25)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(196, 98, 45, 0.4)',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-terracotta-500)' }}>
                <Award size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Modul Beasiswa</p>
                <p className="text-xs" style={{ color: 'rgba(245,240,232,0.6)' }}>Pencocokan &amp; Draf Esai AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={12} style={{ color: 'var(--color-terracotta-300)' }} />
              <span className="text-xs" style={{ color: 'rgba(245,240,232,0.8)' }}>AI menemukan beasiswa terbaik untukmu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider bawah */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0 80V40C240 0 480 60 720 40C960 20 1200 70 1440 40V80H0Z" fill="var(--color-cream-200)"/>
        </svg>
      </div>
    </section>
  );
}
