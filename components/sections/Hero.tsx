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
            <rect x="14" y="6" width="12" height="2" rx="1" />
            <rect x="10" y="8" width="20" height="22" rx="4" />
            <rect x="12" y="30" width="16" height="3" rx="1.5" />
          </svg>
        </div>
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
