import Link from 'next/link';
import { BookOpen, Award, ArrowRight, Sparkles, Star } from 'lucide-react';
import Tombol from '@/components/ui/Button';
import AnimatedValues from '@/components/ui/AnimatedValues';

export default function Hero() {
  return (
    <section
      // TIDAK pakai overflow-hidden di section agar kartu tidak terpotong
      // min-h-screen tapi konten boleh melebihi — gunakan pb-24 ekstra untuk wave divider
      className="relative flex items-start bg-gradient-hero"
      style={{ minHeight: '100svh', paddingBottom: '80px' }}
      aria-labelledby="hero-judul"
    >
      {/* Background dekoratif — animasi lentera bernuansa biru cyan / aurora */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Glow halo lembut di belakang judul utama */}
        <div
          className="absolute top-16 left-1/4 w-96 h-96 rounded-full opacity-25 animate-glow-pulse"
          style={{ background: 'radial-gradient(circle, var(--color-aurora-400) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 70%)' }}
        />
        <div
          className="absolute top-32 right-12 w-[480px] h-[480px] rounded-full opacity-20 animate-glow-pulse"
          style={{ background: 'radial-gradient(circle, var(--color-aurora-600) 0%, rgba(34, 211, 238, 0.05) 60%, transparent 70%)', animationDelay: '2.5s' }}
        />

        {/* Grid pattern biru/aurora tipis */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.15) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Lentera Melayang 1 — Atas Kanan */}
        <div
          className="absolute top-[18%] right-[18%] opacity-70 animate-float-lentera"
          style={{ animationDuration: '9s' }}
        >
          <svg width="36" height="52" viewBox="0 0 40 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="28" r="16" fill="var(--color-aurora-400)" opacity="0.3" className="animate-pulse" />
            <line x1="20" y1="0" x2="20" y2="10" stroke="rgba(165, 243, 252, 0.6)" strokeWidth="1.5" />
            <path d="M12 10H28L25 14H15L12 10Z" fill="var(--color-aurora-300)" opacity="0.8" />
            <path d="M10 14C10 14 6 26 10 38C14 50 26 50 30 38C34 26 30 14 30 14H10Z" fill="url(#blueLanternGrad1)" stroke="rgba(165, 243, 252, 0.7)" strokeWidth="1.2" />
            <circle cx="20" cy="27" r="5" fill="#A5F3FC" opacity="0.9" />
            <circle cx="20" cy="27" r="2.5" fill="#FFFFFF" />
            <rect x="14" y="44" width="12" height="3" rx="1" fill="var(--color-aurora-400)" opacity="0.8" />
            <line x1="20" y1="47" x2="20" y2="55" stroke="rgba(165, 243, 252, 0.5)" strokeWidth="1.5" />
            <defs>
              <linearGradient id="blueLanternGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(6, 182, 212, 0.4)" />
                <stop offset="50%" stopColor="rgba(34, 211, 238, 0.65)" />
                <stop offset="100%" stopColor="rgba(15, 23, 42, 0.7)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Lentera Melayang 2 — Kiri Tengah */}
        <div
          className="absolute top-[42%] left-[6%] opacity-60 animate-float-lentera"
          style={{ animationDuration: '11s', animationDelay: '2s' }}
        >
          <svg width="28" height="42" viewBox="0 0 40 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="28" r="14" fill="var(--color-aurora-500)" opacity="0.35" className="animate-pulse" />
            <line x1="20" y1="0" x2="20" y2="10" stroke="rgba(196, 181, 253, 0.6)" strokeWidth="1.5" />
            <path d="M12 10H28L25 14H15L12 10Z" fill="var(--color-mist-400)" opacity="0.8" />
            <path d="M10 14C10 14 6 26 10 38C14 50 26 50 30 38C34 26 30 14 30 14H10Z" fill="url(#blueLanternGrad2)" stroke="rgba(196, 181, 253, 0.7)" strokeWidth="1.2" />
            <circle cx="20" cy="27" r="4.5" fill="#E0E7FF" opacity="0.9" />
            <rect x="14" y="44" width="12" height="3" rx="1" fill="var(--color-mist-400)" opacity="0.8" />
            <line x1="20" y1="47" x2="20" y2="54" stroke="rgba(196, 181, 253, 0.5)" strokeWidth="1.5" />
            <defs>
              <linearGradient id="blueLanternGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(99, 102, 241, 0.4)" />
                <stop offset="50%" stopColor="rgba(165, 180, 252, 0.6)" />
                <stop offset="100%" stopColor="rgba(15, 23, 42, 0.7)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Lentera Melayang 3 — Kanan Bawah */}
        <div
          className="absolute top-[68%] right-[8%] opacity-55 animate-float-lentera"
          style={{ animationDuration: '8.5s', animationDelay: '4s' }}
        >
          <svg width="32" height="46" viewBox="0 0 40 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="28" r="15" fill="var(--color-aurora-300)" opacity="0.3" className="animate-pulse" />
            <line x1="20" y1="0" x2="20" y2="10" stroke="rgba(165, 243, 252, 0.5)" strokeWidth="1.5" />
            <path d="M12 10H28L25 14H15L12 10Z" fill="var(--color-aurora-300)" opacity="0.8" />
            <path d="M10 14C10 14 6 26 10 38C14 50 26 50 30 38C34 26 30 14 30 14H10Z" fill="url(#blueLanternGrad1)" stroke="rgba(165, 243, 252, 0.6)" strokeWidth="1.2" />
            <circle cx="20" cy="27" r="5" fill="#CFFAFE" opacity="0.95" />
            <rect x="14" y="44" width="12" height="3" rx="1" fill="var(--color-aurora-400)" opacity="0.8" />
            <line x1="20" y1="47" x2="20" y2="55" stroke="rgba(165, 243, 252, 0.5)" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Partikel Percikan Cahaya Lentera (Biru Cyan Glow) */}
        {[
          { top: '22%', left: '20%', size: '6px', delay: '0.5s' },
          { top: '35%', left: '42%', size: '8px', delay: '2.1s' },
          { top: '50%', right: '30%', size: '5px', delay: '1.2s' },
          { top: '75%', left: '35%', size: '7px', delay: '3.4s' },
          { top: '28%', right: '10%', size: '9px', delay: '4.0s' },
        ].map((p, idx) => (
          <div
            key={idx}
            className="absolute rounded-full animate-pulse"
            style={{
              top: p.top,
              left: p.left,
              right: p.right,
              width: p.size,
              height: p.size,
              background: 'var(--color-aurora-300)',
              boxShadow: '0 0 12px var(--color-aurora-400), 0 0 20px var(--color-aurora-500)',
              animationDuration: '3s',
              animationDelay: p.delay,
              opacity: 0.75,
            }}
          />
        ))}
      </div>

      <div className="container-lentera relative z-10 pt-24 sm:pt-26 md:pt-28 pb-8 w-full">
        {/* Layout dua kolom: teks kiri, kartu kanan */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
          {/* Kolom teks utama */}
          <div className="flex-1 max-w-2xl mb-14 lg:mb-0">
            {/* Badge kompetisi */}

            {/* Judul utama — KEDUA bagian pakai --text-on-dark (latar sama: gelap) */}
            <h1
              id="hero-judul"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)' }}
            >
              Terangi Jalan{' '}
              <span
                className="relative inline-block"
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

            {/* Statistik kecil + AnimatedValues Ticker */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12 animate-fade-in-up animate-delay-300">
              <div
                className="flex flex-wrap gap-8 shrink-0"
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
                      style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)' }}
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

              {/* AnimatedValues Ticker — Digeser 10cm ke kanan & diperlebar 10cm */}
              <div className="w-full lg:w-[520px] xl:w-[650px] shrink-0 lg:ml-12 xl:ml-16">
                <AnimatedValues />
              </div>
            </div>
          </div>

          {/* Kartu pratinjau modul — di samping teks, posisi atas-bawah */}
          <div
            className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0 grid grid-cols-1 gap-5 animate-fade-in-up animate-delay-400 lg:sticky lg:top-24"
            aria-hidden="true"
          >
            {/* Card Belajar — latar sedikit lebih terang dari hero bg, border gold */}
            <div
              className="
                group

                w-[300px]
                h-[170px]

                p-5
                rounded-[var(--radius-lg)]

                bg-white/0
                hover:bg-white/10

                border
                border-[rgba(201,151,30,0.3)]
                hover:border-[rgba(255,220,120,0.8)]

                backdrop-blur-md

                transition-all
                duration-500
                ease-out

                hover:-translate-y-2
                hover:scale-[1.03]

                shadow-[0_8px_32px_rgba(0,0,0,0.25)]
                hover:shadow-[0_12px_40px_rgba(0,0,0,0.35),0_0_35px_rgba(255,215,100,0.30)]
              "
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="
                    w-10 h-10 
                    rounded-lg 
                    flex items-center 
                    justify-center 
                    flex-shrink-0
                    bg-white

                    transition-all
                    duration-500

                    group-hover:rotate-6
                    group-hover:scale-110
                    group-hover:shadow-[0_0_18px_rgba(255,220,120,.55)]
                  "
                  style={{ background: '#FFFFFF' }}
                >
                  <BookOpen size={18} style={{ color: 'var(--color-dark-900)' }} />
                </div>
                <div>
                  {/* Judul kartu: text-on-dark */}
                  <p className="font-semibold text-sm" style={{ color: '#FFFFFF' }}>Modul Belajar</p>
                  {/* Subjudul kartu: text-muted-on-dark */}
                  <p className="text-xs" style={{ color: '#FFFFFF' }}>Repositori &amp; Asisten AI</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-8">
                {['Catatan', 'Rangkuman', 'Bank Soal'].map((tag) => (
                  <span
                    key={tag}
                    className="
                    text-xs
                    text-[#FFFFFF]
                    px-2.5 
                    py-2 
                    rounded-full

                    transition-all
                    duration-500

                    border
                    border-white/50

                    group-hover:bg-[rgba(255, 255, 255, 0.22)]
                    group-hover:scale-105
                  "

                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Beasiswa — latar terracotta redup, border terracotta */}
            <div
              className="
                group

                w-[300px]
                h-[170px]

                p-5
                rounded-[var(--radius-lg)]

                bg-white/0
                hover:bg-white/10

                border
                border-[rgba(201,151,30,0.3)]
                hover:border-[rgba(255,220,120,0.8)]

                backdrop-blur-md

                transition-all
                duration-500
                ease-out

                hover:-translate-y-2
                hover:scale-[1.03]

                shadow-[0_8px_32px_rgba(0,0,0,0.25)]
                hover:shadow-[0_12px_40px_rgba(0,0,0,0.35),0_0_35px_rgba(255,215,100,0.30)]
              "
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="
                  w-10
                  h-10
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                  border-2

                  bg-[var(--color-terracotta-600)]

                  transition-all
                  duration-500
                  group-hover:scale-110
                  group-hover:-rotate-6
                  "
                >
                  <Award size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#ffffffff' }}>Modul Beasiswa</p>
                  <p className="text-xs" style={{ color: '#ffffffff' }}>Pencocokan &amp; Draf Esai AI</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={13} style={{ color: 'var(--color-terracotta-300)' }} />
                <span className="text-xs" style={{ color: '#FFFFFF' }}>
                  AI menganalisis profilmu dan merekomendasikan beasiswa yang paling sesuai dengan potensimu
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider bawah — absolute, tidak memotong konten */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0 80V40C240 0 480 60 720 40C960 20 1200 70 1440 40V80H0Z" fill="var(--color-cream-200)" />
        </svg>
      </div>
    </section>
  );
}
