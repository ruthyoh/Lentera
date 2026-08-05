import type { Metadata } from 'next';
import { Trophy, Medal, Star, TrendingUp, Crown, BookOpen, Upload } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Papan Peringkat',
  description: 'Lihat peringkat kontributor terbaik platform Lentera. Raih poin dengan berbagi materi dan membantu sesama mahasiswa.',
};

const peringkatPlaceholder = Array.from({ length: 15 }, (_, i) => ({
  peringkat: i + 1,
  nama: [
    'Ahmad Rizky Pratama',
    'Siti Nurhaliza',
    'Budi Prasetyo',
    'Rina Maharani',
    'Doni Ardiansyah',
    'Lestari Handayani',
    'Fajar Kurniawan',
    'Dewi Sartika',
    'Rizky Firmansyah',
    'Putri Ayu Lestari',
    'Hendra Wijaya',
    'Anisa Rahma',
    'Galih Pratama',
    'Nadia Safitri',
    'Eko Prasetyo',
  ][i],
  jurusan: [
    'Teknik Informatika',
    'Manajemen',
    'Sistem Informasi',
    'Psikologi',
    'Teknik Elektro',
    'Akuntansi',
    'Hukum',
    'Kedokteran',
    'Ekonomi',
    'Ilmu Komunikasi',
    'Teknik Sipil',
    'Sastra Indonesia',
    'Teknik Mesin',
    'Pendidikan',
    'Teknik Kimia',
  ][i],
  poin: [12450, 11230, 9876, 8765, 7654, 6543, 5987, 5432, 4876, 4321, 3987, 3654, 3210, 2876, 2543][i],
  kontribusi: [87, 72, 65, 58, 52, 45, 41, 38, 34, 30, 27, 24, 21, 19, 16][i],
  unduhan: [15420, 12340, 9870, 8760, 7650, 6540, 5980, 5430, 4870, 4320, 3980, 3650, 3210, 2870, 2540][i],
}));

const ikonPeringkat: Record<number, React.ReactNode> = {
  1: <Crown size={22} className="text-yellow-400" fill="currentColor" />,
  2: <Medal size={20} className="text-gray-400" />,
  3: <Medal size={20} className="text-amber-600" />,
};

export default function HalamanPapanPeringkat() {
  return (
    <div className="min-h-screen pt-16" style={{ background: 'var(--color-cream-200)' }}>
      {/* Header */}
      <div
        className="py-14 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--color-dark-900) 0%, var(--color-dark-800) 50%, var(--color-dark-700) 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-10" aria-hidden="true" style={{
          backgroundImage: `radial-gradient(circle, rgba(201,151,30,0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />
        <div className="container-lentera relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4" aria-hidden="true">
              <Trophy size={32} style={{ color: 'var(--color-gold-400)' }} />
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-3 text-[var(--text-on-dark)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Papan Peringkat
            </h1>
            <p className="text-sm max-w-lg mx-auto text-[var(--text-muted-on-dark)]">
              Kontributor terbaik yang aktif berbagi ilmu dan membantu sesama mahasiswa di platform Lentera
            </p>
          </div>
        </div>
      </div>

      <div className="container-lentera py-10">
        {/* Cara Mendapat Poin */}
        <div
          className="card-glass p-5 mb-8 flex flex-col md:flex-row items-center gap-4"
          role="note"
        >
          <div
            className="w-11 h-11 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--color-gold-100)', color: 'var(--color-gold-700)' }}
            aria-hidden="true"
          >
            <Star size={20} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="font-semibold text-sm text-[var(--text-on-light)]">
              Cara Mendapatkan Poin
            </p>
            <p className="text-xs text-[var(--text-muted-on-light)]">
              Unggah materi (+50), materi diunduh (+5/unduhan), materi disukai (+10/suka), jawab pertanyaan (+20)
            </p>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {peringkatPlaceholder.slice(0, 3).map((user, idx) => {
            const urutan = [1, 0, 2][idx];
            const data = peringkatPlaceholder[urutan];
            const isJuara1 = data.peringkat === 1;

            return (
              <div
                key={data.peringkat}
                className={[
                  'card-glass text-center relative',
                  isJuara1 ? 'p-8 md:-mt-4 ring-2' : 'p-6',
                ].join(' ')}
                style={
                  isJuara1
                    ? { ['--tw-ring-color' as string]: 'var(--color-gold-500)', borderColor: 'var(--color-gold-300)' }
                    : undefined
                }
              >
                {/* Badge peringkat */}
                <div
                  className={[
                    'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg',
                    isJuara1 ? 'bg-amber-100 text-amber-700' : '',
                  ].join(' ')}
                  style={
                    !isJuara1
                      ? { background: 'var(--color-cream-300)', color: 'var(--text-on-light)' }
                      : undefined
                  }
                  aria-label={`Peringkat ${data.peringkat}`}
                >
                  {ikonPeringkat[data.peringkat] || data.peringkat}
                </div>

                {/* Avatar placeholder */}
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold"
                  style={{
                    background: isJuara1 ? 'var(--color-gold-200)' : 'var(--color-gold-100)',
                    color: isJuara1 ? 'var(--color-dark-900)' : 'var(--color-gold-800)',
                  }}
                  aria-hidden="true"
                >
                  {data.nama.split(' ').slice(0, 2).map((k) => k[0]).join('')}
                </div>

                <h2
                  className="font-bold text-base mb-1 text-[var(--text-on-light)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {data.nama}
                </h2>
                <p className="text-xs mb-3 text-[var(--text-muted-on-light)]">
                  {data.jurusan}
                </p>

                <p
                  className="text-2xl font-bold mb-1"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: isJuara1 ? 'var(--color-terracotta-600)' : 'var(--color-gold-600)',
                  }}
                >
                  {data.poin.toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-[var(--text-muted-on-light)]">poin</p>

                <div
                  className="flex justify-center gap-4 mt-4 pt-4 border-t text-xs text-[var(--text-muted-on-light)]"
                  style={{ borderColor: 'var(--color-cream-300)' }}
                >
                  <span className="flex items-center gap-1">
                    <Upload size={11} /> {data.kontribusi} materi
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp size={11} /> {data.unduhan.toLocaleString('id-ID')} unduhan
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabel Lengkap */}
        <div className="card-glass overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-cream-300)' }}>
            <h2
              className="font-bold text-base text-[var(--text-on-light)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Peringkat Lengkap
            </h2>
            <Badge varian="cream">Periode Agustus 2026</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Tabel papan peringkat kontributor Lentera">
              <thead>
                <tr style={{ background: 'var(--color-cream-100)' }}>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted-on-light)]">#</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted-on-light)]">Nama</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide hidden md:table-cell text-[var(--text-muted-on-light)]">Jurusan</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted-on-light)]">
                    <span className="flex items-center justify-end gap-1"><Star size={11} /> Poin</span>
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wide hidden sm:table-cell text-[var(--text-muted-on-light)]">
                    <span className="flex items-center justify-end gap-1"><BookOpen size={11} /> Kontribusi</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {peringkatPlaceholder.map((user) => (
                  <tr
                    key={user.peringkat}
                    className="border-b transition-colors hover:bg-[var(--color-cream-100)]"
                    style={{ borderColor: 'var(--color-cream-300)' }}
                  >
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold"
                        style={
                          user.peringkat === 1
                            ? { background: 'linear-gradient(135deg, #fde68a, #fbbf24)', color: '#92400e' }
                            : user.peringkat === 2
                              ? { background: 'linear-gradient(135deg, #e5e7eb, #d1d5db)', color: '#374151' }
                              : user.peringkat === 3
                                ? { background: 'linear-gradient(135deg, #fde68a, #d97706)', color: '#78350f' }
                                : { background: 'var(--color-cream-300)', color: 'var(--text-on-light)' }
                        }
                      >
                        {user.peringkat}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: 'var(--color-gold-100)', color: 'var(--color-dark-900)' }}
                        >
                          {user.nama.split(' ').slice(0, 2).map((k) => k[0]).join('')}
                        </div>
                        <span className="font-semibold text-sm text-[var(--text-on-light)]">
                          {user.nama}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm hidden md:table-cell text-[var(--text-muted-on-light)]">
                      {user.jurusan}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-sm text-[var(--color-gold-600)]">
                        {user.poin.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm hidden sm:table-cell text-[var(--text-muted-on-light)]">
                      {user.kontribusi} materi
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
