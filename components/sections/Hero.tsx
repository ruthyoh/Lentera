import Link from 'next/link';
import { BookOpen, Award, ArrowRight, Sparkles, Star } from 'lucide-react';
import Tombol from '@/components/ui/Button';

export default function Hero() {
  return (
    <section
      // TIDAK pakai overflow-hidden di section agar kartu tidak terpotong
      // min-h-screen tapi konten boleh melebihi — gunakan pb-24 ekstra untuk wave divider
      className="relative flex items-start bg-gradient-hero"
      style={{ minHeight: '100svh', paddingBottom: '80px' }}
      aria-labelledby="hero-judul"
    >
      {/* Background dekoratif — overflow-hidden hanya pada div ini, bukan section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Orbs tekstur gold */}
        <div
          className="absolute top-20 right-16 w-80 h-80 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, var(--color-gold-600), transparent 70%)' }}
        />
        <div
          className="absolute bottom-24 left-10 w-96 h-96 rounded-full opacity-6"
          style={{ background: 'radial-gradient(circle, var(--color-gold-800), transparent 70%)' }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-4"
          style={{
            backgroundImage: `linear-gradient(rgba(201,151,30,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(201,151,30,0.2) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        {/* Floating lantern icon */}
        <div className="absolute top-1/4 right-1/4 w-24 h-24 opacity-6 animate-float">
          <svg viewBox="0 0 40 40" fill="var(--color-gold-500)" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="6" width="12" height="2" rx="1"/>
            <rect x="10" y="8" width="20" height="22" rx="4"/>
            <rect x="12" y="30" width="16" height="3" rx="1.5"/>
          </svg>
        </div>
      </div>

      <div className="container-lentera relative z-10 pt-28 pb-8 w-full">
        {/* Kolom teks utama */}
        <div className="max-w-2xl mb-14">
          {/* Badge kompetisi */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-semibold tracking-wide"
            style={{
              background: 'rgba(201,151,30,0.15)',
              border: '1px solid rgba(201,151,30,0.35)',
              color: 'var(--text-on-dark)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Star size={12} style={{ color: 'var(--color-gold-400)' }} fill="currentColor" />
            TCC Vibe Code 2026 — Digital Innovation &amp; Sustainable Communities
          </div>

          {/* Judul utama — KEDUA bagian pakai --text-on-dark (latar sama: gelap) */}
          <h1
            id="hero-judul"
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)' }}
          >
            Terangi Jalan{' '}
            <span
              className="relative"
              style={{ color: 'var(--color-gold-400)' }}
            >
              Akademismu
              <span
                className="absolute -bottom-1 left-0 right-0 h-1 rounded-full opacity-60"
                style={{ background: 'var(--color-gold-500)' }}
                aria-hidden="true"
              />
            </span>
          </h1>

          {/* Subjudul — pakai --text-muted-on-dark, bukan rgba hardcoded */}
          <p
            className="text-lg md:text-xl leading-relaxed mb-10 max-w-xl animate-fade-in-up animate-delay-100"
            style={{ color: 'var(--text-muted-on-dark)' }}
          >
            <strong style={{ color: 'var(--text-on-dark)' }}>Lentera</strong> — platform terintegrasi yang mendukung 
            keberlanjutan akses pendidikan mahasiswa. Bagikan ilmu, temukan beasiswa, 
            dan raih impian dengan bantuan kecerdasan buatan.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-14 animate-fade-in-up animate-delay-200">
            <Link href="/jelajah">
              {/* Tombol putih di latar gelap — teks pakai text-on-light */}
              <Tombol
                ukuran="besar"
                className="bg-[var(--text-on-dark)]! text-[var(--text-on-light)]! hover:bg-[var(--color-cream-300)]! shadow-lg! font-bold!"
                ikonKiri={<BookOpen size={18} />}
                ikonKanan={<ArrowRight size={16} />}
              >
                Mulai Belajar
              </Tombol>
            </Link>
            <Link href="/beasiswa">
              {/* Tombol outline di latar gelap — teks pakai text-on-dark */}
              <Tombol
                ukuran="besar"
                className="border-2! border-[var(--text-on-dark)]! text-[var(--text-on-dark)]! bg-transparent! hover:bg-white/10!"
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
                  style={{ color: 'var(--color-gold-400)', fontFamily: 'var(--font-display)' }}
                >
                  {stat.angka}
                </p>
                {/* Label statistik: muted-on-dark (kontras ~6:1 terhadap #1C140B) */}
                <p className="text-sm" style={{ color: 'var(--text-muted-on-dark)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Kartu pratinjau modul — grid di bawah teks, tidak terpotong */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl animate-fade-in-up animate-delay-400"
          aria-hidden="true"
        >
          {/* Card Belajar — latar sedikit lebih terang dari hero bg, border gold */}
          <div
            className="p-5 rounded-[var(--radius-lg)]"
            style={{
              background: 'rgba(42, 31, 18, 0.9)',   /* #2A1F12 — lebih terang dari hero */
              border: '1px solid rgba(201,151,30,0.3)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--color-gold-600)' }}
              >
                <BookOpen size={18} style={{ color: 'var(--color-dark-900)' }} />
              </div>
              <div>
                {/* Judul kartu: text-on-dark */}
                <p className="font-semibold text-sm" style={{ color: 'var(--text-on-dark)' }}>Modul Belajar</p>
                {/* Subjudul kartu: text-muted-on-dark */}
                <p className="text-xs" style={{ color: 'var(--text-muted-on-dark)' }}>Repositori &amp; Asisten AI</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Catatan', 'Rangkuman', 'Bank Soal'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(201,151,30,0.18)', color: 'var(--text-muted-on-dark)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Card Beasiswa — latar terracotta redup, border terracotta */}
          <div
            className="p-5 rounded-[var(--radius-lg)]"
            style={{
              background: 'rgba(42, 20, 10, 0.9)',   /* sedikit lebih terang, nada terracotta */
              border: '1px solid rgba(196, 98, 45, 0.35)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--color-terracotta-600)' }}
              >
                <Award size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-on-dark)' }}>Modul Beasiswa</p>
                <p className="text-xs" style={{ color: 'var(--text-muted-on-dark)' }}>Pencocokan &amp; Draf Esai AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={13} style={{ color: 'var(--color-terracotta-300)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted-on-dark)' }}>
                AI menemukan beasiswa terbaik untukmu
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider bawah — absolute, tidak memotong konten */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0 80V40C240 0 480 60 720 40C960 20 1200 70 1440 40V80H0Z" fill="var(--color-cream-200)"/>
        </svg>
      </div>
    </section>
  );
}
