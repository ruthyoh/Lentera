import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, Filter, BookOpen, FileText, HelpCircle, Presentation, ArrowRight, Brain, Upload } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Tombol from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export const metadata: Metadata = {
  title: 'Jelajah Materi Belajar',
  description: 'Temukan ribuan catatan kuliah, rangkuman, dan bank soal dari mahasiswa seluruh Indonesia.',
};

const kategoriFilter = [
  { label: 'Semua', value: 'semua', ikon: <BookOpen size={14} /> },
  { label: 'Catatan', value: 'catatan', ikon: <FileText size={14} /> },
  { label: 'Rangkuman', value: 'rangkuman', ikon: <FileText size={14} /> },
  { label: 'Bank Soal', value: 'bank_soal', ikon: <HelpCircle size={14} /> },
  { label: 'Presentasi', value: 'presentasi', ikon: <Presentation size={14} /> },
];

// Data placeholder materi
const materiPlaceholder = Array.from({ length: 9 }, (_, i) => ({
  id: `materi-${i + 1}`,
  judul: [
    'Catatan Lengkap Kalkulus 1 — UTS & UAS',
    'Rangkuman Algoritma dan Struktur Data',
    'Bank Soal Fisika Dasar 200 Soal',
    'Modul Praktikum Pemrograman Web',
    'Catatan Ekonomi Mikro Semester 3',
    'Rangkuman Manajemen Keuangan',
    'Bank Soal Statistika dengan Pembahasan',
    'Catatan Kimia Organik Lengkap',
    'Presentasi Sistem Operasi Komputer',
  ][i],
  kategori: ['catatan', 'rangkuman', 'bank_soal', 'modul', 'catatan', 'rangkuman', 'bank_soal', 'catatan', 'presentasi'][i] as string,
  matkul: ['Kalkulus 1', 'Algoritma', 'Fisika Dasar', 'Pemweb', 'Eko Mikro', 'Manajemen', 'Statistika', 'Kimia Organik', 'SO'][i],
  pengunggah: ['Ahmad R.', 'Siti N.', 'Budi P.', 'Rina M.', 'Doni A.', 'Lestari', 'Fajar K.', 'Dewi S.', 'Rizky F.'][i],
  unduhan: [1243, 876, 2341, 543, 987, 432, 1876, 765, 654][i],
  suka: [234, 156, 432, 98, 187, 76, 321, 143, 112][i],
}));

const labelKategori: Record<string, string> = {
  catatan: 'Catatan',
  rangkuman: 'Rangkuman',
  bank_soal: 'Bank Soal',
  modul: 'Modul',
  presentasi: 'Presentasi',
};

export default function HalamanJelajah() {
  return (
    <div
      className="min-h-screen pt-16"
      style={{ background: 'var(--color-cream-200)' }}
    >
      {/* Header halaman */}
      <div
        className="py-14 relative overflow-hidden"
        style={{ background: 'var(--color-forest-700)' }}
      >
        <div className="absolute inset-0 opacity-5" aria-hidden="true" style={{
          backgroundImage: `linear-gradient(var(--color-cream-200) 1px, transparent 1px), linear-gradient(90deg, var(--color-cream-200) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        <div className="container-lentera relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--color-forest-200)' }}>
                Modul Belajar
              </p>
              <h1
                className="text-3xl md:text-4xl font-bold text-white mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Jelajah Materi
              </h1>
              <p className="text-sm" style={{ color: 'rgba(245,240,232,0.75)' }}>
                12.000+ materi dari mahasiswa seluruh Indonesia
              </p>
            </div>
            <div className="flex gap-3">
              <Tombol
                varian="sekunder"
                ukuran="sedang"
                ikonKiri={<Brain size={16} />}
                id="tombol-asisten-ai"
              >
                Asisten Belajar AI
              </Tombol>
              <Link href="/jelajah/unggah">
                <Tombol
                  varian="hantu"
                  ukuran="sedang"
                  ikonKiri={<Upload size={16} />}
                  className="text-white! hover:bg-white/10! border border-white/20!"
                  id="tombol-unggah-materi"
                >
                  Unggah Materi
                </Tombol>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-lentera py-8">
        {/* Search & Filter Bar */}
        <div className="card-glass p-5 mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              id="cari-materi"
              placeholder="Cari materi, mata kuliah, atau topik..."
              ikonKiri={<Search size={16} />}
              aria-label="Cari materi belajar"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <select
              id="filter-jurusan"
              className="px-4 py-3 rounded-[var(--radius-sm)] border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-forest-500)]"
              style={{ borderColor: 'var(--color-cream-400)', color: 'var(--color-charcoal-700)' }}
              aria-label="Filter berdasarkan jurusan"
            >
              <option value="">Semua Jurusan</option>
              <option value="ti">Teknik Informatika</option>
              <option value="si">Sistem Informasi</option>
              <option value="manajemen">Manajemen</option>
            </select>
            <Tombol varian="outline" ukuran="sedang" ikonKiri={<Filter size={15} />} id="tombol-filter-lanjutan">
              Filter
            </Tombol>
          </div>
        </div>

        {/* Tab Kategori */}
        <div className="flex gap-2 flex-wrap mb-8" role="tablist" aria-label="Filter kategori materi">
          {kategoriFilter.map((kat) => (
            <button
              key={kat.value}
              role="tab"
              aria-selected={kat.value === 'semua'}
              className={[
                'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                kat.value === 'semua'
                  ? 'text-[var(--color-cream-100)] shadow-sm'
                  : 'hover:bg-[var(--color-cream-300)]',
              ].join(' ')}
              style={
                kat.value === 'semua'
                  ? { background: 'var(--color-forest-700)', color: 'white' }
                  : { color: 'var(--color-charcoal-600)', background: 'white' }
              }
              id={`tab-${kat.value}`}
            >
              {kat.ikon}
              {kat.label}
            </button>
          ))}
        </div>

        {/* Grid Materi */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
          role="list"
          aria-label="Daftar materi belajar"
        >
          {materiPlaceholder.map((materi) => (
            <Link
              key={materi.id}
              href={`/materi/${materi.id}`}
              className="card-glass p-6 block group"
              role="listitem"
              aria-label={`Buka materi: ${materi.judul}`}
            >
              {/* Ikon format */}
              <div
                className="w-11 h-11 rounded-[var(--radius-sm)] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'var(--color-forest-100)', color: 'var(--color-forest-700)' }}
                aria-hidden="true"
              >
                <FileText size={20} />
              </div>

              <Badge varian="forest" className="mb-3 text-xs">
                {labelKategori[materi.kategori] || materi.kategori}
              </Badge>

              <h2
                className="font-bold text-base mb-1 line-clamp-2 group-hover:text-[var(--color-forest-700)] transition-colors"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-charcoal-900)' }}
              >
                {materi.judul}
              </h2>
              <p className="text-xs mb-4" style={{ color: 'var(--color-charcoal-400)' }}>
                {materi.matkul} · oleh {materi.pengunggah}
              </p>

              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-charcoal-400)' }}>
                <span>{materi.unduhan.toLocaleString('id-ID')} unduhan</span>
                <span className="flex items-center gap-1">
                  ❤️ {materi.suka}
                </span>
              </div>

              <div
                className="mt-4 pt-4 border-t flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ borderColor: 'var(--color-cream-300)', color: 'var(--color-forest-700)' }}
                aria-hidden="true"
              >
                Lihat detail
                <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination placeholder */}
        <div className="flex justify-center">
          <nav aria-label="Navigasi halaman materi" className="flex gap-2">
            {[1, 2, 3, '...', 24].map((hal, i) => (
              <button
                key={i}
                className={[
                  'w-10 h-10 rounded-[var(--radius-sm)] text-sm font-medium transition-all',
                  hal === 1
                    ? 'text-white shadow-sm'
                    : 'hover:bg-[var(--color-cream-300)]',
                ].join(' ')}
                style={
                  hal === 1
                    ? { background: 'var(--color-forest-700)', color: 'white' }
                    : { background: 'white', color: 'var(--color-charcoal-600)' }
                }
                aria-label={hal === '...' ? 'Halaman lainnya' : `Halaman ${hal}`}
                aria-current={hal === 1 ? 'page' : undefined}
              >
                {hal}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
