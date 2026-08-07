import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  Search, BookOpen, FileText, HelpCircle, Presentation, ArrowRight, Brain, Upload, Layers, FolderOpen
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Tombol from '@/components/ui/Button';
import { ambilDaftarMateri } from '@/lib/actions/materi';
import ModalAsistenAIJelajah from '@/components/materi/ModalAsistenAIJelajah';

export const metadata: Metadata = {
  title: 'Jelajah Materi Belajar',
  description: 'Temukan ribuan catatan kuliah, rangkuman, dan bank soal dari mahasiswa seluruh Indonesia.',
};

interface HalamanJelajahProps {
  searchParams: Promise<{
    q?: string;
    kategori?: string;
    matkul?: string;
    halaman?: string;
    fitur?: string;
  }>;
}

const kategoriFilter = [
  { label: 'Semua', value: 'semua', ikon: <BookOpen size={14} /> },
  { label: 'Catatan', value: 'catatan', ikon: <FileText size={14} /> },
  { label: 'Rangkuman', value: 'rangkuman', ikon: <FileText size={14} /> },
  { label: 'Bank Soal', value: 'bank_soal', ikon: <HelpCircle size={14} /> },
  { label: 'Modul', value: 'modul', ikon: <Layers size={14} /> },
  { label: 'Presentasi', value: 'presentasi', ikon: <Presentation size={14} /> },
];

const labelKategori: Record<string, string> = {
  catatan: 'Catatan',
  rangkuman: 'Rangkuman',
  bank_soal: 'Bank Soal',
  modul: 'Modul',
  presentasi: 'Presentasi',
  lainnya: 'Lainnya',
};

export default async function HalamanJelajah({ searchParams }: HalamanJelajahProps) {
  const params = await searchParams;
  const kataKunci = params.q || '';
  const kategoriDipilih = params.kategori || 'semua';
  const matkulDipilih = params.matkul || '';
  const halamanSaatIni = params.halaman ? parseInt(params.halaman, 10) : 1;

  const { materi, total, halaman, totalHalaman } = await ambilDaftarMateri({
    q: kataKunci,
    kategori: kategoriDipilih,
    matkul: matkulDipilih,
    halaman: halamanSaatIni,
    perHalaman: 9,
  });

  const daftarMateriRingkas = materi.map((m) => ({
    id: m.id,
    judul: m.judul,
    mata_kuliah: m.mata_kuliah,
  }));

  return (
    <div
      className="min-h-screen pt-16"
      style={{ background: 'var(--color-cream-200)' }}
    >
      {/* Header Halaman */}
      <div
        className="py-14 relative overflow-hidden"
        style={{ background: 'var(--color-dark-800)' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          aria-hidden="true"
          style={{
            backgroundImage: `linear-gradient(rgba(201,151,30,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,151,30,0.3) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
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
                {total.toLocaleString('id-ID')} berkas materi tersedia dari mahasiswa se-Indonesia
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/jelajah?fitur=ai">
                <Tombol
                  varian="primer"
                  ukuran="sedang"
                  ikonKiri={<Brain size={16} />}
                  id="tombol-asisten-ai"
                >
                  Asisten Belajar AI
                </Tombol>
              </Link>
              <Link href="/jelajah/unggah">
                <Tombol
                  varian="hantu"
                  ukuran="sedang"
                  ikonKiri={<Upload size={16} />}
                  className="text-[var(--text-on-dark)]! hover:bg-white/10! border border-white/20!"
                  id="tombol-unggah-materi"
                >
                  Unggah Materi (+10 Poin)
                </Tombol>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-lentera py-8">
        {/* Search & Filter Form */}
        <form action="/jelajah" method="GET" className="card-glass p-5 mb-8 flex flex-col md:flex-row gap-4">
          {kategoriDipilih !== 'semua' && (
            <input type="hidden" name="kategori" value={kategoriDipilih} />
          )}

          <div className="flex-1 relative">
            <input
              type="text"
              name="q"
              defaultValue={kataKunci}
              placeholder="Cari judul materi, mata kuliah, atau topik..."
              className="w-full pl-11 pr-4 py-3 rounded-[var(--radius-sm)] border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
              style={{ borderColor: 'var(--color-cream-400)', color: 'var(--text-on-light)' }}
              aria-label="Cari materi belajar"
              id="input-cari-materi"
            />
            <Search size={18} className="absolute left-3.5 top-3.5 text-[var(--text-muted-on-light)]" />
          </div>

          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              name="matkul"
              defaultValue={matkulDipilih}
              placeholder="Filter Mata Kuliah..."
              className="px-4 py-3 rounded-[var(--radius-sm)] border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-500)]"
              style={{ borderColor: 'var(--color-cream-400)', color: 'var(--text-on-light)' }}
              aria-label="Filter mata kuliah"
              id="filter-matkul"
            />
            <Tombol type="submit" varian="primer" ukuran="sedang" id="tombol-cari">
              Cari
            </Tombol>
            {(kataKunci || matkulDipilih || kategoriDipilih !== 'semua') && (
              <Link href="/jelajah">
                <Tombol varian="outline" ukuran="sedang" id="tombol-reset-filter">
                  Reset
                </Tombol>
              </Link>
            )}
          </div>
        </form>

        {/* Tab Kategori */}
        <div className="flex gap-2 flex-wrap mb-8" role="tablist" aria-label="Filter kategori materi">
          {kategoriFilter.map((kat) => {
            const isAktif = kategoriDipilih === kat.value;
            const searchParamsObj = new URLSearchParams();
            if (kataKunci) searchParamsObj.set('q', kataKunci);
            if (matkulDipilih) searchParamsObj.set('matkul', matkulDipilih);
            if (kat.value !== 'semua') searchParamsObj.set('kategori', kat.value);

            const queryString = searchParamsObj.toString();
            const href = `/jelajah${queryString ? `?${queryString}` : ''}`;

            return (
              <Link
                key={kat.value}
                href={href}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={
                  isAktif
                    ? { background: 'var(--color-gold-500)', color: 'var(--color-dark-900)' }
                    : { color: 'var(--text-on-light)', background: 'white' }
                }
                role="tab"
                aria-selected={isAktif}
                id={`tab-kategori-${kat.value}`}
              >
                {kat.ikon}
                {kat.label}
              </Link>
            );
          })}
        </div>

        {/* Grid Materi */}
        {materi.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
            role="list"
            aria-label="Daftar materi belajar"
          >
            {materi.map((item) => (
              <Link
                key={item.id}
                href={`/materi/${item.id}`}
                className="card-glass p-6 block group"
                role="listitem"
                aria-label={`Buka materi: ${item.judul}`}
              >
                <div
                  className="w-11 h-11 rounded-[var(--radius-sm)] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'var(--color-gold-100)', color: 'var(--color-gold-700)' }}
                  aria-hidden="true"
                >
                  <FileText size={20} />
                </div>

                <Badge varian="gold" className="mb-3 text-xs">
                  {labelKategori[item.kategori] || item.kategori}
                </Badge>

                <h2
                  className="font-bold text-base mb-1 line-clamp-2 transition-colors text-[var(--text-on-light)] group-hover:text-[var(--color-gold-600)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item.judul}
                </h2>

                <p className="text-xs mb-4 text-[var(--text-muted-on-light)]">
                  {item.mata_kuliah} · oleh {item.profiles?.nama_lengkap || 'Mahasiswa'}
                </p>

                <div className="flex items-center justify-between text-xs text-[var(--text-muted-on-light)]">
                  <span>{(item.jumlah_unduhan || 0).toLocaleString('id-ID')} unduhan</span>
                  <span className="flex items-center gap-1">
                    ❤️ {item.jumlah_suka || 0}
                  </span>
                </div>

                <div
                  className="mt-4 pt-4 border-t flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-gold-600)]"
                  style={{ borderColor: 'var(--color-cream-300)' }}
                  aria-hidden="true"
                >
                  Lihat detail &amp; unduh
                  <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="card-glass p-12 text-center my-10 max-w-lg mx-auto space-y-4">
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
              style={{ background: 'var(--color-cream-300)', color: 'var(--text-muted-on-light)' }}
            >
              <FolderOpen size={32} />
            </div>
            <div>
              <h3
                className="text-lg font-bold text-[var(--text-on-light)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Belum Ada Materi
              </h3>
              <p className="text-sm text-[var(--text-muted-on-light)] mt-1">
                {kataKunci || matkulDipilih || kategoriDipilih !== 'semua'
                  ? 'Tidak ada materi yang sesuai dengan pencarian atau filter Anda.'
                  : 'Belum ada materi yang diunggah. Jadilah mahasiswa pertama yang berbagi materi!'}
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              {(kataKunci || matkulDipilih || kategoriDipilih !== 'semua') && (
                <Link href="/jelajah">
                  <Tombol varian="outline" ukuran="sedang">
                    Lihat Semua Materi
                  </Tombol>
                </Link>
              )}
              <Link href="/jelajah/unggah">
                <Tombol varian="primer" ukuran="sedang" ikonKiri={<Upload size={15} />}>
                  Unggah Materi Sekarang
                </Tombol>
              </Link>
            </div>
          </div>
        )}

        {/* Pagination Nav */}
        {totalHalaman > 1 && (
          <div className="flex justify-center">
            <nav aria-label="Navigasi halaman materi" className="flex gap-2">
              {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((hal) => {
                const searchParamsObj = new URLSearchParams();
                if (kataKunci) searchParamsObj.set('q', kataKunci);
                if (matkulDipilih) searchParamsObj.set('matkul', matkulDipilih);
                if (kategoriDipilih !== 'semua') searchParamsObj.set('kategori', kategoriDipilih);
                searchParamsObj.set('halaman', String(hal));

                const isAktif = hal === halaman;

                return (
                  <Link key={hal} href={`/jelajah?${searchParamsObj.toString()}`}>
                    <button
                      className="w-10 h-10 rounded-[var(--radius-sm)] text-sm font-semibold transition-all"
                      style={
                        isAktif
                          ? { background: 'var(--color-gold-500)', color: 'var(--color-dark-900)' }
                          : { background: 'white', color: 'var(--text-on-light)' }
                      }
                      aria-label={`Halaman ${hal}`}
                      aria-current={isAktif ? 'page' : undefined}
                    >
                      {hal}
                    </button>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Modal Asisten AI Jelajah */}
      <Suspense fallback={null}>
        <ModalAsistenAIJelajah daftarMateri={daftarMateriRingkas} />
      </Suspense>
    </div>
  );
}
