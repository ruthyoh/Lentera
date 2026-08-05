import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

const statistik = [
  {
    ikon: <Users size={24} />,
    angka: '5.000+',
    label: 'Mahasiswa Aktif',
    deskripsi: 'Bergabung dari 50+ universitas di seluruh Indonesia',
    warna: 'gold',
  },
  {
    ikon: <BookOpen size={24} />,
    angka: '12.000+',
    label: 'Materi Tersedia',
    deskripsi: 'Catatan, rangkuman, modul, dan bank soal berkualitas',
    warna: 'terracotta',
  },
  {
    ikon: <Award size={24} />,
    angka: '300+',
    label: 'Program Beasiswa',
    deskripsi: 'Dari pemerintah, swasta, dan lembaga internasional',
    warna: 'gold',
  },
  {
    ikon: <TrendingUp size={24} />,
    angka: '92%',
    label: 'Tingkat Kepuasan',
    deskripsi: 'Mahasiswa merasa terbantu dalam studi dan pencarian beasiswa',
    warna: 'terracotta',
  },
];

export default function Stats() {
  return (
    <section
      className="py-20"
      style={{ background: 'var(--color-cream-200)' }}
      aria-labelledby="stats-judul"
    >
      <div className="container-lentera">
        {/* Header */}
        <div className="text-center mb-14">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: 'var(--color-terracotta-500)' }}
          >
            Dampak Nyata
          </p>
          <h2
            id="stats-judul"
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-light)' }}
          >
            Lentera dalam Angka
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted-on-light)' }}>
            Bersama-sama kami membangun ekosistem belajar yang inklusif dan berkelanjutan untuk mahasiswa Indonesia.
          </p>
        </div>

        {/* Grid Statistik */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          role="list"
          aria-label="Statistik platform Lentera"
        >
          {statistik.map((stat, index) => (
            <div
              key={stat.label}
              className="card-glass p-6 text-center group"
              role="listitem"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className="w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background:
                    stat.warna === 'gold'
                      ? 'var(--color-gold-100)'
                      : 'var(--color-terracotta-100)',
                  color:
                    stat.warna === 'gold'
                      ? 'var(--color-gold-700)'
                      : 'var(--color-terracotta-600)',
                }}
                aria-hidden="true"
              >
                {stat.ikon}
              </div>
              <p
                className="text-3xl font-bold mb-1"
                style={{
                  fontFamily: 'var(--font-display)',
                  color:
                    stat.warna === 'gold'
                      ? 'var(--color-gold-700)'
                      : 'var(--color-terracotta-600)',
                }}
              >
                {stat.angka}
              </p>
              <p
                className="font-semibold text-sm mb-2"
                style={{ color: 'var(--text-on-light)' }}
              >
                {stat.label}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted-on-light)' }}>
                {stat.deskripsi}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
