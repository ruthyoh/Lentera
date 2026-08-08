import { Users, BookOpen, Award, TrendingUp, Sparkles } from 'lucide-react';

const statistik = [
  {
    ikon: <Users size={24} />,
    angka: '5.000+',
    label: 'Mahasiswa Aktif',
    deskripsi: 'Bergabung dari 50+ universitas di seluruh Indonesia',
    warnaGlow: 'from-cyan-500/20 to-blue-500/5',
    warnaIconBg: 'bg-cyan-100 text-cyan-700 group-hover:bg-cyan-600 group-hover:text-white',
    warnaAngka: 'from-cyan-600 via-teal-600 to-indigo-700',
    topBar: 'from-cyan-400 via-blue-500 to-teal-400',
  },
  {
    ikon: <BookOpen size={24} />,
    angka: '12.000+',
    label: 'Materi Tersedia',
    deskripsi: 'Catatan, rangkuman, modul, dan bank soal berkualitas',
    warnaGlow: 'from-rose-500/20 to-pink-500/5',
    warnaIconBg: 'bg-rose-100 text-rose-700 group-hover:bg-rose-600 group-hover:text-white',
    warnaAngka: 'from-rose-600 via-pink-600 to-purple-700',
    topBar: 'from-rose-400 via-pink-500 to-amber-400',
  },
  {
    ikon: <Award size={24} />,
    angka: '300+',
    label: 'Program Beasiswa',
    deskripsi: 'Dari pemerintah, swasta, dan lembaga internasional',
    warnaGlow: 'from-amber-500/20 to-orange-500/5',
    warnaIconBg: 'bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-white',
    warnaAngka: 'from-amber-600 via-orange-600 to-red-700',
    topBar: 'from-amber-400 via-orange-400 to-yellow-400',
  },
  {
    ikon: <TrendingUp size={24} />,
    angka: '92%',
    label: 'Tingkat Kepuasan',
    deskripsi: 'Mahasiswa merasa terbantu dalam studi dan pencarian beasiswa',
    warnaGlow: 'from-indigo-500/20 to-purple-500/5',
    warnaIconBg: 'bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white',
    warnaAngka: 'from-indigo-600 via-purple-600 to-pink-700',
    topBar: 'from-indigo-400 via-purple-400 to-cyan-400',
  },
];

export default function Stats() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--color-mist-200) 0%, #ede7fe 50%, var(--color-mist-100) 100%)' }}
      aria-labelledby="stats-judul"
    >
      {/* Background Rame: Grid pattern, floating lanterns, decorative rings & pendaran cahaya */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Pattern grid cyan/indigo halus */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.15) 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
          }}
        />

        {/* Ambient Glow Orbs besar */}
        <div
          className="absolute -top-20 left-10 w-96 h-96 rounded-full opacity-35 blur-3xl animate-glow-pulse"
          style={{ background: 'radial-gradient(circle, var(--color-aurora-400) 0%, rgba(6, 182, 212, 0.1) 60%, transparent 80%)' }}
        />
        <div
          className="absolute top-1/3 right-5 w-[420px] h-[420px] rounded-full opacity-30 blur-3xl animate-glow-pulse"
          style={{ background: 'radial-gradient(circle, var(--color-rose-400) 0%, rgba(244, 114, 182, 0.1) 60%, transparent 80%)', animationDelay: '2.5s' }}
        />
        <div
          className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full opacity-30 blur-3xl animate-glow-pulse"
          style={{ background: 'radial-gradient(circle, #fbbf24 0%, rgba(251, 191, 36, 0.1) 60%, transparent 80%)', animationDelay: '1.2s' }}
        />

        {/* Floating Sky Lantern 1 (Kiri Atas) */}
        <div className="absolute top-8 left-[5%] opacity-45 animate-float-lentera" style={{ animationDuration: '10s' }}>
          <svg width="34" height="48" viewBox="0 0 40 56" fill="none">
            <circle cx="20" cy="28" r="16" fill="var(--color-aurora-400)" opacity="0.4" className="animate-pulse" />
            <path d="M12 10H28L25 14H15L12 10Z" fill="var(--color-aurora-500)" opacity="0.8" />
            <path d="M10 14C10 14 6 26 10 38C14 50 26 50 30 38C34 26 30 14 30 14H10Z" fill="url(#statsLantern1)" stroke="var(--color-aurora-400)" strokeWidth="1.2" />
            <circle cx="20" cy="27" r="5" fill="#38BDF8" opacity="0.9" />
            <circle cx="20" cy="27" r="2" fill="#FFFFFF" />
            <defs>
              <linearGradient id="statsLantern1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(6, 182, 212, 0.6)" />
                <stop offset="100%" stopColor="rgba(99, 102, 241, 0.8)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating Sky Lantern 2 (Kanan Tengah) */}
        <div className="absolute top-1/2 right-[4%] opacity-50 animate-float-lentera" style={{ animationDuration: '12s', animationDelay: '3s' }}>
          <svg width="30" height="44" viewBox="0 0 40 56" fill="none">
            <circle cx="20" cy="28" r="15" fill="var(--color-rose-400)" opacity="0.4" className="animate-pulse" />
            <path d="M12 10H28L25 14H15L12 10Z" fill="var(--color-rose-500)" opacity="0.8" />
            <path d="M10 14C10 14 6 26 10 38C14 50 26 50 30 38C34 26 30 14 30 14H10Z" fill="url(#statsLantern2)" stroke="var(--color-rose-400)" strokeWidth="1.2" />
            <circle cx="20" cy="27" r="5" fill="#F472B6" opacity="0.9" />
            <circle cx="20" cy="27" r="2" fill="#FFFFFF" />
            <defs>
              <linearGradient id="statsLantern2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(244, 114, 182, 0.6)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0.8)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating Sky Lantern 3 (Kiri Bawah) */}
        <div className="absolute bottom-10 left-[8%] opacity-40 animate-float-lentera" style={{ animationDuration: '9s', animationDelay: '1.5s' }}>
          <svg width="26" height="38" viewBox="0 0 40 56" fill="none">
            <circle cx="20" cy="28" r="14" fill="#F59E0B" opacity="0.4" className="animate-pulse" />
            <path d="M10 14C10 14 6 26 10 38C14 50 26 50 30 38C34 26 30 14 30 14H10Z" fill="url(#statsLantern3)" stroke="#FBBF24" strokeWidth="1.2" />
            <circle cx="20" cy="27" r="4" fill="#FDE047" opacity="0.9" />
            <defs>
              <linearGradient id="statsLantern3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(245, 158, 11, 0.7)" />
                <stop offset="100%" stopColor="rgba(239, 68, 68, 0.8)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Concentric Decorative Rings di Tengah */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[780px] rounded-full border border-indigo-300/25 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full border border-cyan-300/25 pointer-events-none" />

        {/* Sparkles lentera berpendar banyak */}
        {[
          { top: '12%', left: '15%', size: '7px', delay: '0s', color: 'var(--color-aurora-400)' },
          { top: '22%', left: '80%', size: '9px', delay: '1s', color: 'var(--color-rose-400)' },
          { top: '48%', left: '88%', size: '6px', delay: '2.5s', color: '#FBBF24' },
          { top: '65%', left: '12%', size: '8px', delay: '1.8s', color: 'var(--color-aurora-400)' },
          { top: '82%', left: '75%', size: '7px', delay: '3.2s', color: 'var(--color-rose-400)' },
          { top: '35%', left: '25%', size: '5px', delay: '0.7s', color: '#A855F7' },
          { top: '75%', left: '45%', size: '6px', delay: '2.1s', color: '#38BDF8' },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 12px ${p.color}, 0 0 22px ${p.color}`,
              animationDelay: p.delay,
              animationDuration: '2.5s',
            }}
          />
        ))}
      </div>

      <div className="container-lentera relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-cyan-500/10 text-cyan-800 border border-cyan-500/20 shadow-xs mb-4 backdrop-blur-xs">
            <Sparkles size={14} className="text-cyan-600 animate-pulse" />
            Dampak Nyata
          </span>
          <h2
            id="stats-judul"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-light)' }}
          >
            Lentera dalam{' '}
            <span className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent">
              Angka
            </span>
          </h2>
          <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted-on-light)' }}>
            Bersama-sama kami membangun ekosistem belajar yang inklusif dan berkelanjutan untuk mahasiswa Indonesia.
          </p>
        </div>

        {/* Grid Statistik */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          role="list"
          aria-label="Statistik platform Lentera"
        >
          {statistik.map((stat, index) => (
            <div
              key={stat.label}
              className="group relative bg-white/80 backdrop-blur-md rounded-2xl p-7 text-center border border-purple-200/60 shadow-lg hover:shadow-2xl hover:border-cyan-400/80 transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col justify-between"
              role="listitem"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Top ambient glow light bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${stat.topBar} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* Background card radial glow on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${stat.warnaGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />

              <div className="relative z-10">
                {/* Icon box dengan efek glow */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110 shadow-md group-hover:shadow-xl ${stat.warnaIconBg}`}
                  aria-hidden="true"
                >
                  {stat.ikon}
                </div>

                {/* Angka dengan gradien memukau */}
                <p
                  className={`text-4xl lg:text-5xl font-extrabold mb-2 bg-gradient-to-r ${stat.warnaAngka} bg-clip-text text-transparent tracking-tight`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {stat.angka}
                </p>

                {/* Label */}
                <p
                  className="font-bold text-base mb-2 tracking-wide"
                  style={{ color: 'var(--text-on-light)' }}
                >
                  {stat.label}
                </p>

                {/* Deskripsi */}
                <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'var(--text-muted-on-light)' }}>
                  {stat.deskripsi}
                </p>
              </div>

              {/* Small subtle decorative flame spark on bottom right */}
              <div className="absolute bottom-2 right-3 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none">
                <Sparkles size={16} className="text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

