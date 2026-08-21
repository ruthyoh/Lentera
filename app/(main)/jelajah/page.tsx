import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  Search, BookOpen, FileText, HelpCircle, Presentation, ArrowRight, Brain, Upload, Layers, FolderOpen, Star, Download
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

  return (
    <div
      className="min-h-screen pt-16"
      style={{ background: 'var(--color-cream-200)' }}
    >
      {/* Header Halaman — Twilight Celestial Glow */}
      <div
        className="py-16 relative overflow-hidden bg-gradient-to-b from-[#081B3A] via-[#0b244d] to-[#0d2a58] border-b border-white/10"
      >
        {/* Glow halo & grid dekoratif */}
        <div
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full opacity-30 pointer-events-none blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--color-aurora-400) 0%, rgba(6, 182, 212, 0.1) 60%, transparent 80%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute top-1/3 right-10 w-80 h-80 rounded-full opacity-20 pointer-events-none blur-3xl"
          style={{ background: 'radial-gradient(circle, #F59E0B 0%, rgba(245, 158, 11, 0.05) 60%, transparent 80%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        <div className="container-lentera relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3 bg-white/10 text-[var(--color-gold-400)] border border-white/15 backdrop-blur-md">
                <BookOpen size={13} className="text-[var(--color-gold-400)]" />
                Modul Belajar · Repositori Akademik
              </div>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 text-white tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Jelajah <span className="text-[var(--color-gold-400)]">Materi</span>
              </h1>
              <p className="text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
                Temukan <strong className="text-white font-semibold">{total.toLocaleString('id-ID')} berkas materi</strong> berkualitas yang dibagikan oleh mahasiswa dari berbagai perguruan tinggi se-Indonesia.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link href="/jelajah?fitur=ai">
                <Tombol
                  varian="primer"
                  ukuran="sedang"
                  ikonKiri={<Brain size={16} />}
                  className="shadow-lg hover:shadow-cyan-500/20"
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
                  className="text-white! bg-white/10! hover:bg-white/20! border border-white/25! backdrop-blur-md"
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
          {/* Preset Kategori Hidden Query */}
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
            // Build URL query params preserving search & matkul
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
                className="bg-white/80 hover:bg-white backdrop-blur-md rounded-2xl p-6 block group border border-amber-200/60 hover:border-amber-400/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
                role="listitem"
                aria-label={`Buka materi: ${item.judul}`}
              >
                {/* Accent top gradient highlight on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-teal-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 bg-amber-50 text-amber-700 border border-amber-200/60 group-hover:bg-amber-500 group-hover:text-white group-hover:shadow-md"
                    aria-hidden="true"
                  >
                    <FileText size={19} />
                  </div>

                  <Badge varian="gold" className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5">
                    {labelKategori[item.kategori] || item.kategori}
                  </Badge>
                </div>

                <h2
                  className="font-bold text-base mb-1.5 line-clamp-2 transition-colors text-[var(--text-on-light)] group-hover:text-[var(--color-gold-600)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item.judul}
                </h2>

                <p className="text-xs mb-4 text-[var(--text-muted-on-light)] line-clamp-1">
                  {item.mata_kuliah} · oleh <span className="font-semibold text-slate-700">{item.profiles?.nama_lengkap || 'Mahasiswa'}</span>
                </p>

                <div className="flex items-center justify-between text-xs text-[var(--text-muted-on-light)] pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    {item.rating_rata_rata ? item.rating_rata_rata.toFixed(1) : '4.8'}
                    <span className="font-normal text-slate-400">({item.total_penilai || 24})</span>
                  </span>
                  <span className="flex items-center gap-1 font-medium text-slate-500">
                    <Download size={13} className="text-slate-400" />
                    {(item.jumlah_unduhan || 0).toLocaleString('id-ID')} unduhan
                  </span>
                </div>

                <div
                  className="mt-3 flex items-center justify-end gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 text-[var(--color-gold-600)]"
                  aria-hidden="true"
                >
                  Lihat detail &amp; unduh
                  <ArrowRight size={13} />
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

      {/* Modal Asisten AI — memerlukan Suspense karena menggunakan useSearchParams() */}
      <Suspense fallback={null}>
        <ModalAsistenAIJelajah
          daftarMateri={materi.map((m) => ({ id: m.id, judul: m.judul, mata_kuliah: m.mata_kuliah }))}
        />
      </Suspense>
    </div>
  );
}
