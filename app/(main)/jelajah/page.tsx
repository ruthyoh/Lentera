import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  Search, BookOpen, FileText, HelpCircle, Presentation, ArrowRight, Brain, Upload, Layers, FolderOpen, Star, Download, Sparkles, Compass
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

// Data Kategori Card Aesthetic (Gradient Academy Style)
const daftarKategoriCard = [
  {
    label: 'Semua Materi',
    value: 'semua',
    deskripsi: 'Seluruh koleksi catatan, rangkuman, modul, dan bank soal terintegrasi',
    ikon: <BookOpen size={24} />,
    gradientBg: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    borderColor: 'rgba(34, 211, 238, 0.3)',
    iconColor: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.25)',
    tagText: 'Semua Repositori',
  },
  {
    label: 'Catatan Kuliah',
    value: 'catatan',
    deskripsi: 'Catatan rapi harian perkuliahan dari mahasiswa berbagai jurusan',
    ikon: <FileText size={24} />,
    gradientBg: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    iconColor: '#818cf8',
    glowColor: 'rgba(99, 102, 241, 0.25)',
    tagText: 'Catatan Per-Materi',
  },
  {
    label: 'Rangkuman & Summary',
    value: 'rangkuman',
    deskripsi: 'Ringkasan komprehensif poin inti untuk persiapan ujian & UTS/UAS',
    ikon: <Layers size={24} />,
    gradientBg: 'from-purple-500/20 via-fuchsia-500/10 to-transparent',
    borderColor: 'rgba(168, 85, 247, 0.3)',
    iconColor: '#c084fc',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    tagText: 'Intisari Kuliah',
  },
  {
    label: 'Bank Soal & Quiz',
    value: 'bank_soal',
    deskripsi: 'Kumpulan soal latihan, ujian tahun lalu, beserta kunci pembahasan',
    ikon: <HelpCircle size={24} />,
    gradientBg: 'from-amber-500/20 via-orange-500/10 to-transparent',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    iconColor: '#fbbf24',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    tagText: 'Latihan & Lulus Ujian',
  },
  {
    label: 'Modul Belajar',
    value: 'modul',
    deskripsi: 'Panduan studi, lab sheet praktikum, dan petunjuk praktis perkuliahan',
    ikon: <BookOpen size={24} />,
    gradientBg: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    iconColor: '#34d399',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    tagText: 'Panduan Praktikum',
  },
  {
    label: 'Presentasi & Slide',
    value: 'presentasi',
    deskripsi: 'Slide presentasi dosen, draf PPT tugas kelompok & seminar',
    ikon: <Presentation size={24} />,
    gradientBg: 'from-rose-500/20 via-pink-500/10 to-transparent',
    borderColor: 'rgba(244, 63, 94, 0.3)',
    iconColor: '#fb7185',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    tagText: 'Slide & Dek Seminar',
  },
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

  const kategoriAktifObj = daftarKategoriCard.find((k) => k.value === kategoriDipilih) || daftarKategoriCard[0];

  return (
    <div
      className="min-h-screen pt-16"
      style={{
        background: 'linear-gradient(180deg, #07132a 0%, #0b1d3a 30%, #0d2348 60%, #091830 100%)',
      }}
    >
      {/* Header Halaman — Twilight Celestial Glow */}
      <div className="py-16 relative overflow-hidden border-b border-white/10">
        {/* Glow halo & grid dekoratif */}
        <div
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full opacity-30 pointer-events-none blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--color-aurora-400) 0%, rgba(6, 182, 212, 0.1) 60%, transparent 80%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute top-1/3 right-10 w-80 h-80 rounded-full opacity-20 pointer-events-none blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, rgba(99, 102, 241, 0.05) 60%, transparent 80%)' }}
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

      <div className="container-lentera py-10">
        {/* ── SEKSI KATEGORI CARD (Gradient Academy Style) ── */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
                <Compass size={14} />
                Pilih Kategori Belajar
              </div>
              <h2
                className="text-2xl font-bold text-white tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Kategori Materi Akademik
              </h2>
            </div>
            {kategoriDipilih !== 'semua' && (
              <Link
                href="/jelajah"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                Tampilkan Semua Kategori
                <ArrowRight size={13} />
              </Link>
            )}
          </div>

          {/* Grid Kategori Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {daftarKategoriCard.map((kat) => {
              const isAktif = kategoriDipilih === kat.value;

              // Preserve search query & matkul
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
                  className="group relative rounded-2xl p-6 block border transition-all duration-300 hover:-translate-y-1.5 overflow-hidden backdrop-blur-md"
                  style={{
                    background: isAktif
                      ? 'rgba(255, 255, 255, 0.09)'
                      : 'rgba(255, 255, 255, 0.04)',
                    borderColor: isAktif ? kat.iconColor : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: isAktif ? `0 0 25px ${kat.glowColor}` : 'none',
                  }}
                  id={`card-kategori-${kat.value}`}
                >
                  {/* Background Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${kat.gradientBg} opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                  />

                  {/* Top highlight bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: kat.iconColor }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      {/* Icon container */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: kat.iconColor,
                          border: `1px solid ${kat.borderColor}`,
                          boxShadow: `0 0 15px ${kat.glowColor}`,
                        }}
                      >
                        {kat.ikon}
                      </div>

                      <span
                        className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border"
                        style={{
                          background: isAktif ? kat.iconColor : 'rgba(255, 255, 255, 0.06)',
                          color: isAktif ? '#07132a' : kat.iconColor,
                          borderColor: kat.borderColor,
                        }}
                      >
                        {isAktif ? 'Aktif' : kat.tagText}
                      </span>
                    </div>

                    <h3
                      className="text-lg font-bold text-white mb-1.5 transition-colors group-hover:text-cyan-300"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {kat.label}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {kat.deskripsi}
                    </p>

                    <div className="flex items-center text-xs font-bold justify-between pt-3 border-t border-white/10 text-slate-400 group-hover:text-white transition-colors">
                      <span>{isAktif ? 'Sedang Ditampilkan' : 'Buka Kategori'}</span>
                      <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" style={{ color: kat.iconColor }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── SEKSI SEARCH & LIST MATERI HASIL ── */}
        <div id="daftar-materi-section" className="pt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2
                className="text-xl font-bold text-white flex items-center gap-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span>Daftar Materi:</span>
                <span className="text-[var(--color-gold-400)]">{kategoriAktifObj.label}</span>
              </h2>
              <p className="text-xs text-slate-400">
                Menampilkan {total} materi perkuliahan yang siap diunduh
              </p>
            </div>
          </div>

          {/* Search & Filter Form */}
          <form action="/jelajah" method="GET" className="p-5 mb-8 flex flex-col md:flex-row gap-4 rounded-2xl border border-white/10 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.06)' }}>
            {kategoriDipilih !== 'semua' && (
              <input type="hidden" name="kategori" value={kategoriDipilih} />
            )}

            <div className="flex-1 relative">
              <input
                type="text"
                name="q"
                defaultValue={kataKunci}
                placeholder="Cari judul materi, mata kuliah, atau topik..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-aurora-400)]"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                }}
                aria-label="Cari materi belajar"
                id="input-cari-materi"
              />
              <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
            </div>

            <div className="flex gap-3 flex-wrap">
              <input
                type="text"
                name="matkul"
                defaultValue={matkulDipilih}
                placeholder="Filter Mata Kuliah..."
                className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-aurora-400)]"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                }}
                aria-label="Filter mata kuliah"
                id="filter-matkul"
              />
              <Tombol type="submit" varian="primer" ukuran="sedang" id="tombol-cari">
                Cari
              </Tombol>
              {(kataKunci || matkulDipilih || kategoriDipilih !== 'semua') && (
                <Link href="/jelajah">
                  <Tombol
                    varian="hantu"
                    ukuran="sedang"
                    id="tombol-reset-filter"
                    className="text-white! border-white/25! hover:bg-white/10!"
                  >
                    Reset
                  </Tombol>
                </Link>
              )}
            </div>
          </form>

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
                  className="group relative rounded-2xl p-6 block border transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderColor: 'rgba(255,255,255,0.1)',
                  }}
                  role="listitem"
                  aria-label={`Buka materi: ${item.judul}`}
                >
                  {/* Hover glow overlay */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.08) 0%, rgba(99,102,241,0.06) 100%)', border: '1px solid rgba(34,211,238,0.3)' }}
                  />
                  {/* Accent top gradient highlight on hover */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                        style={{ background: 'rgba(34,211,238,0.15)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.3)' }}
                        aria-hidden="true"
                      >
                        <FileText size={19} />
                      </div>

                      <Badge varian="gold" className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5">
                        {labelKategori[item.kategori] || item.kategori}
                      </Badge>
                    </div>

                    <h2
                      className="font-bold text-base mb-1.5 line-clamp-2 transition-colors text-white group-hover:text-[var(--color-aurora-300)]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {item.judul}
                    </h2>

                    <p className="text-xs mb-4 text-slate-400 line-clamp-1">
                      {item.mata_kuliah} · oleh <span className="font-semibold text-slate-300">{item.profiles?.nama_lengkap || 'Mahasiswa'}</span>
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                      {(item.rating_rata_rata || 0) > 0 ? (
                        <span className="flex items-center gap-1.5 font-bold px-2 py-0.5 rounded-md" style={{ color: '#facc15', background: 'rgba(250,204,21,0.12)', border: '1px solid rgba(250,204,21,0.2)' }}>
                          <Star size={13} className="fill-yellow-400 text-yellow-400" />
                          {item.rating_rata_rata!.toFixed(1)}
                          <span className="font-normal text-slate-500">({item.total_penilai || 0} ulasan)</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-500 text-xs">
                          <Star size={13} />
                          Belum ada ulasan
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-medium text-slate-400">
                        <Download size={13} className="text-slate-500" />
                        {(item.jumlah_unduhan || 0).toLocaleString('id-ID')} unduhan
                      </span>
                    </div>

                    <div
                      className="mt-3 flex items-center justify-end gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0"
                      style={{ color: 'var(--color-aurora-400)' }}
                      aria-hidden="true"
                    >
                      Lihat detail &amp; unduh
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div
              className="p-12 text-center my-10 max-w-lg mx-auto space-y-4 rounded-2xl border"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <div
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
              >
                <FolderOpen size={32} />
              </div>
              <div>
                <h3
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Belum Ada Materi
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  {kataKunci || matkulDipilih || kategoriDipilih !== 'semua'
                    ? 'Tidak ada materi yang sesuai dengan pencarian atau filter Anda.'
                    : 'Belum ada materi yang diunggah. Jadilah mahasiswa pertama yang berbagi materi!'}
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                {(kataKunci || matkulDipilih || kategoriDipilih !== 'semua') && (
                  <Link href="/jelajah">
                    <Tombol varian="hantu" ukuran="sedang" className="text-white! border-white/25! hover:bg-white/10!">
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
                        className="w-10 h-10 rounded-xl text-sm font-semibold transition-all"
                        style={
                          isAktif
                            ? { background: 'var(--color-aurora-500)', color: '#fff', boxShadow: '0 0 16px rgba(6,182,212,0.4)' }
                            : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }
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

        {/* Bottom padding */}
        <div className="pb-16" />
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
