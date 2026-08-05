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
        style={{ background: 'var(--color-dark-800)' }}
      >
        <div className="absolute inset-0 opacity-5" aria-hidden="true" style={{
          backgroundImage: `linear-gradient(rgba(201,151,30,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,151,30,0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        <div className="container-lentera relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--color-gold-400)' }}>
                Modul Belajar
              </p>
              <h1
                className="text-3xl md:text-4xl font-bold mb-3 text-[var(--text-on-dark)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Jelajah Materi
              </h1>
              <p className="text-sm text-[var(--text-muted-on-dark)]">
                12.000+ materi dari mahasiswa seluruh Indonesia
              </p>
            </div>
            <div className="flex gap-3">
              <Tombol
                varian="primer"
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
                  className="text-[var(--text-on-dark)]! hover:bg-white/10! border border-white/20!"
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
              className="px-4 py-3 rounded-[var(--radius-sm)] border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
              style={{ borderColor: 'var(--color-cream-400)', color: 'var(--text-on-light)' }}
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={
                kat.value === 'semua'
                  ? { background: 'var(--color-gold-500)', color: 'var(--color-dark-900)' }
                  : { color: 'var(--text-on-light)', background: 'white' }
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
                style={{ background: 'var(--color-gold-100)', color: 'var(--color-gold-700)' }}
                aria-hidden="true"
              >
                <FileText size={20} />
              </div>

              <Badge varian="gold" className="mb-3 text-xs">
                {labelKategori[materi.kategori] || materi.kategori}
              </Badge>

              <h2
                className="font-bold text-base mb-1 line-clamp-2 transition-colors text-[var(--text-on-light)] group-hover:text-[var(--color-gold-600)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {materi.judul}
              </h2>
              <p className="text-xs mb-4 text-[var(--text-muted-on-light)]">
                {materi.matkul} · oleh {materi.pengunggah}
              </p>

              <div className="flex items-center justify-between text-xs text-[var(--text-muted-on-light)]">
                <span>{materi.unduhan.toLocaleString('id-ID')} unduhan</span>
                <span className="flex items-center gap-1">
                  ❤️ {materi.suka}
                </span>
              </div>

              <div
                className="mt-4 pt-4 border-t flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-gold-600)]"
                style={{ borderColor: 'var(--color-cream-300)' }}
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
                className="w-10 h-10 rounded-[var(--radius-sm)] text-sm font-medium transition-all"
                style={
                  hal === 1
                    ? { background: 'var(--color-gold-500)', color: 'var(--color-dark-900)' }
                    : { background: 'white', color: 'var(--text-on-light)' }
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
