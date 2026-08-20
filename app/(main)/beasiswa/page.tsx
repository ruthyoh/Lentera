import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, Filter, Award, Brain, Clock, GraduationCap, ArrowRight, Sparkles, FolderOpen } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Tombol from '@/components/ui/Button';
import { ambilDaftarBeasiswa } from '@/lib/actions/beasiswa';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import PanelPencocokanAI from '@/components/beasiswa/PanelPencocokanAI';

export const metadata: Metadata = {
  title: 'Jelajah Beasiswa',
  description: 'Temukan ratusan beasiswa dari pemerintah, swasta, dan internasional. Pencocokan cerdas dengan profil akademikmu.',
};

interface HalamanBeasiswaProps {
  searchParams: Promise<{
    q?: string;
    jenis?: string;
    ipk?: string;
    halaman?: string;
  }>;
}

const kategoriBeasiswa = [
  { label: 'Semua', value: 'semua' },
  { label: 'Prestasi', value: 'prestasi' },
  { label: 'Kebutuhan', value: 'kebutuhan' },
  { label: 'Riset', value: 'riset' },
  { label: 'Pemerintah', value: 'pemerintah' },
  { label: 'Swasta', value: 'swasta' },
  { label: 'Internasional', value: 'internasional' },
];

const labelStatus: Record<string, { label: string; varian: 'aktif' | 'peringatan' | 'bahaya' }> = {
  aktif: { label: 'Aktif', varian: 'aktif' },
  segera_ditutup: { label: 'Segera Ditutup', varian: 'peringatan' },
  ditutup: { label: 'Ditutup', varian: 'bahaya' },
};

const labelKategori: Record<string, string> = {
  pemerintah: 'Pemerintah',
  swasta: 'Swasta',
  prestasi: 'Prestasi',
  kebutuhan: 'Kebutuhan',
  riset: 'Riset',
  internasional: 'Internasional',
};

export default async function HalamanBeasiswa({ searchParams }: HalamanBeasiswaProps) {
  const params = await searchParams;
  const kataKunci = params.q || '';
  const jenisDipilih = params.jenis || 'semua';
  const ipkMinFilter = params.ipk ? parseFloat(params.ipk) : undefined;
  const halamanSaatIni = params.halaman ? parseInt(params.halaman, 10) : 1;

  // Ambil data beasiswa dan user ID secara paralel
  const [beasiswaResult, supabase] = await Promise.all([
    ambilDaftarBeasiswa({
      q: kataKunci,
      jenis: jenisDipilih,
      ipkMin: ipkMinFilter,
      halaman: halamanSaatIni,
      perHalaman: 9,
    }),
    createServerSupabaseClient(),
  ]);

  const { beasiswa, total, halaman, totalHalaman } = beasiswaResult;

  // Cek user yang sedang login
  let userId: string | null = null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    userId = null;
  }

  return (
    <div className="min-h-screen pt-16" style={{ background: 'var(--color-cream-200)' }}>
      {/* Header Halaman — Terracotta & Gold Celestial Glow */}
      <div
        className="py-16 relative overflow-hidden bg-gradient-to-b from-[#1C140B] via-[#2A1D0F] to-[#382413] border-b border-amber-500/15"
      >
        {/* Glow halo & pattern */}
        <div
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full opacity-35 pointer-events-none blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--color-terracotta-500) 0%, rgba(225, 112, 85, 0.1) 60%, transparent 80%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute top-1/3 right-10 w-80 h-80 rounded-full opacity-25 pointer-events-none blur-3xl"
          style={{ background: 'radial-gradient(circle, #F59E0B 0%, rgba(245, 158, 11, 0.05) 60%, transparent 80%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255, 220, 150, 0.4) 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
          }}
        />

        <div className="container-lentera relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3 bg-amber-500/15 text-amber-300 border border-amber-500/25 backdrop-blur-md">
                <Award size={13} className="text-amber-400" />
                Modul Beasiswa · Basis Data Terintegrasi
              </div>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 text-white tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Jelajah <span className="text-[var(--color-terracotta-400)]">Beasiswa</span>
              </h1>
              <p className="text-sm md:text-base text-amber-100/80 max-w-xl leading-relaxed">
                Temukan <strong className="text-white font-semibold">{total > 0 ? `${total} peluang beasiswa` : 'berbagai program beasiswa'}</strong> dari pemerintah, swasta, dan donor internasional dengan bantuan rekomendasi AI.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-lentera py-8">
        {/* Banner AI Pencocokan Beasiswa Interaktif */}
        <div className="mb-8">
          <PanelPencocokanAI userId={userId} />
        </div>

        {/* Search & Filter Form */}
        <form action="/beasiswa" method="GET" className="card-glass p-5 mb-8 flex flex-col md:flex-row gap-4">
          {jenisDipilih !== 'semua' && (
            <input type="hidden" name="jenis" value={jenisDipilih} />
          )}

          <div className="flex-1 relative">
            <input
              type="text"
              name="q"
              defaultValue={kataKunci}
              placeholder="Cari nama beasiswa atau penyelenggara..."
              className="w-full pl-11 pr-4 py-3 rounded-[var(--radius-sm)] border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-500)]"
              style={{ borderColor: 'var(--color-cream-400)', color: 'var(--text-on-light)' }}
              aria-label="Cari beasiswa"
              id="cari-beasiswa"
            />
            <Search size={18} className="absolute left-3.5 top-3.5 text-[var(--text-muted-on-light)]" />
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              name="ipk"
              defaultValue={params.ipk || ''}
              id="filter-ipk-minimum"
              className="px-4 py-3 rounded-[var(--radius-sm)] border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-500)] cursor-pointer"
              style={{ borderColor: 'var(--color-cream-400)', color: 'var(--text-on-light)' }}
              aria-label="Filter IPK minimum"
            >
              <option value="">IPK Minimum</option>
              <option value="2.5">≥ 2.50</option>
              <option value="3.0">≥ 3.00</option>
              <option value="3.25">≥ 3.25</option>
              <option value="3.5">≥ 3.50</option>
            </select>
            <Tombol type="submit" varian="sekunder" ukuran="sedang" ikonKiri={<Filter size={15} />} id="tombol-filter-beasiswa">
              Cari &amp; Filter
            </Tombol>
            {(kataKunci || params.ipk || jenisDipilih !== 'semua') && (
              <Link href="/beasiswa">
                <Tombol varian="outline" ukuran="sedang">
                  Reset
                </Tombol>
              </Link>
            )}
          </div>
        </form>

        {/* Tab Kategori */}
        <div className="flex gap-2 flex-wrap mb-8" role="tablist" aria-label="Filter kategori beasiswa">
          {kategoriBeasiswa.map((kat) => {
            const isAktif = jenisDipilih === kat.value;

            // Preserve search query and ipk filter when changing tabs
            const searchParamsObj = new URLSearchParams();
            if (kataKunci) searchParamsObj.set('q', kataKunci);
            if (params.ipk) searchParamsObj.set('ipk', params.ipk);
            if (kat.value !== 'semua') searchParamsObj.set('jenis', kat.value);

            const queryString = searchParamsObj.toString();
            const href = `/beasiswa${queryString ? `?${queryString}` : ''}`;

            return (
              <Link key={kat.value} href={href}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isAktif}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
                  style={
                    isAktif
                      ? { background: 'var(--color-terracotta-500)', color: 'white' }
                      : { background: 'white', color: 'var(--text-on-light)' }
                  }
                  id={`tab-beasiswa-${kat.value}`}
                >
                  {kat.label}
                </button>
              </Link>
            );
          })}
        </div>

        {/* Grid Beasiswa */}
        {beasiswa.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
            role="list"
            aria-label="Daftar beasiswa"
          >
            {beasiswa.map((item) => {
              const statusConfig = labelStatus[item.status] || labelStatus.aktif;

              // Format date nicely if deadline exists
              let deadlineFormatted = 'Segera';
              if (item.deadline_pendaftaran) {
                const dateObj = new Date(item.deadline_pendaftaran);
                deadlineFormatted = dateObj.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });
              }

              return (
                <Link
                  key={item.id}
                  href={`/beasiswa/${item.id}`}
                  className="bg-white/80 hover:bg-white backdrop-blur-md rounded-2xl p-6 block group border border-orange-200/60 hover:border-orange-400/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
                  role="listitem"
                  aria-label={`Lihat detail: ${item.nama_beasiswa}`}
                >
                  {/* Accent top gradient highlight on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Status & Kategori */}
                  <div className="flex items-center justify-between mb-3.5">
                    <Badge varian={statusConfig.varian}>{statusConfig.label}</Badge>
                    <Badge varian="terracotta" className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5">
                      {labelKategori[item.jenis] || item.jenis}
                    </Badge>
                  </div>

                  {/* Nama Beasiswa */}
                  <h2
                    className="font-bold text-base mb-1 line-clamp-2 transition-colors text-[var(--text-on-light)] group-hover:text-[var(--color-terracotta-600)]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {item.nama_beasiswa}
                  </h2>
                  <p className="text-xs mb-4 text-[var(--text-muted-on-light)] font-medium">
                    oleh <span className="text-slate-700 font-semibold">{item.penyelenggara}</span>
                  </p>

                  {/* Info Ringkas */}
                  <div className="space-y-2 mb-4 bg-amber-50/50 p-3 rounded-xl border border-amber-100/60">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <GraduationCap size={13} className="text-amber-600" />
                        IPK Minimum
                      </span>
                      <strong className="text-slate-800 font-bold">{item.kriteria_ipk_min ? item.kriteria_ipk_min.toFixed(2) : '3.00'}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Clock size={13} className="text-amber-600" />
                        Tenggat
                      </span>
                      <strong className="text-amber-700 font-bold">{deadlineFormatted}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-amber-200/40">
                      <span className="flex items-center gap-1.5 text-[var(--color-terracotta-600)] font-semibold truncate">
                        <Award size={13} />
                        {item.kriteria_jurusan || 'Semua Jurusan'}
                      </span>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-end gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 text-[var(--color-terracotta-600)]"
                    aria-hidden="true"
                  >
                    Lihat detail persyaratannya
                    <ArrowRight size={13} />
                  </div>
                </Link>
              );
            })}
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
                Beasiswa Tidak Ditemukan
              </h3>
              <p className="text-sm text-[var(--text-muted-on-light)] mt-1">
                Tidak ada beasiswa yang sesuai dengan kriteria pencarian atau filter Anda.
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <Link href="/beasiswa">
                <Tombol varian="sekunder" ukuran="sedang">
                  Lihat Semua Beasiswa
                </Tombol>
              </Link>
            </div>
          </div>
        )}

        {/* Pagination Nav */}
        {totalHalaman > 1 && (
          <div className="flex justify-center">
            <nav aria-label="Navigasi halaman beasiswa" className="flex gap-2">
              {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((hal) => {
                const searchParamsObj = new URLSearchParams();
                if (kataKunci) searchParamsObj.set('q', kataKunci);
                if (params.ipk) searchParamsObj.set('ipk', params.ipk);
                if (jenisDipilih !== 'semua') searchParamsObj.set('jenis', jenisDipilih);
                searchParamsObj.set('halaman', String(hal));

                const isAktif = hal === halaman;

                return (
                  <Link key={hal} href={`/beasiswa?${searchParamsObj.toString()}`}>
                    <button
                      className="w-10 h-10 rounded-[var(--radius-sm)] text-sm font-semibold transition-all cursor-pointer"
                      style={
                        isAktif
                          ? { background: 'var(--color-terracotta-500)', color: 'white' }
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
    </div>
  );
}
