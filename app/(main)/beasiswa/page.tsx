import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, Filter, Award, Brain, Clock, GraduationCap, ArrowRight, Sparkles, FolderOpen } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Tombol from '@/components/ui/Button';
import { ambilDaftarBeasiswa } from '@/lib/actions/beasiswa';

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

  const { beasiswa, total, halaman, totalHalaman } = await ambilDaftarBeasiswa({
    q: kataKunci,
    jenis: jenisDipilih,
    ipkMin: ipkMinFilter,
    halaman: halamanSaatIni,
    perHalaman: 9,
  });

  return (
    <div className="min-h-screen pt-16" style={{ background: 'var(--color-cream-200)' }}>
      {/* Header */}
      <div
        className="py-14 relative overflow-hidden"
        style={{ background: 'var(--color-terracotta-600)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          aria-hidden="true"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
        <div className="container-lentera relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted-on-dark)' }}>
                Modul Beasiswa
              </p>
              <h1
                className="text-3xl md:text-4xl font-bold mb-3 text-[var(--text-on-dark)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Jelajah Beasiswa
              </h1>
              <p className="text-sm text-[var(--text-muted-on-dark)]">
                {total > 0 ? `${total} beasiswa tersedia di Supabase` : 'Temukan beasiswa sesuai dengan profilmu'}
              </p>
            </div>
            <Tombol
              varian="sekunder"
              ukuran="sedang"
              ikonKiri={<Brain size={16} />}
              className="bg-white! text-[var(--color-terracotta-700)]! hover:bg-[var(--color-cream-200)]!"
              id="tombol-pencocokan-ai"
            >
              <Sparkles size={14} />
              Pencocokan AI
            </Tombol>
          </div>
        </div>
      </div>

      <div className="container-lentera py-8">
        {/* Banner AI */}
        <div
          className="rounded-[var(--radius-lg)] p-5 mb-8 flex flex-col md:flex-row items-center gap-4"
          style={{ background: 'var(--color-terracotta-50)', border: '1px solid var(--color-terracotta-200)' }}
        >
          <div
            className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--color-terracotta-500)' }}
            aria-hidden="true"
          >
            <Brain size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--color-terracotta-800)' }}>
              Asisten Pencocokan AI Tersedia
            </p>
            <p className="text-xs" style={{ color: 'var(--color-terracotta-600)' }}>
              Masukkan profil akademikmu dan biarkan AI menemukan beasiswa yang paling cocok untukmu secara otomatis.
            </p>
          </div>
          <Link href="/login" id="cta-coba-ai-beasiswa">
            <Tombol varian="sekunder" ukuran="sedang" ikonKanan={<ArrowRight size={14} />}>
              Coba Sekarang
            </Tombol>
          </Link>
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
                  className="card-glass p-6 block group"
                  role="listitem"
                  aria-label={`Lihat detail: ${item.nama_beasiswa}`}
                >
                  {/* Status & Kategori */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge varian={statusConfig.varian}>{statusConfig.label}</Badge>
                    <Badge varian="terracotta">{labelKategori[item.jenis] || item.jenis}</Badge>
                  </div>

                  {/* Nama Beasiswa */}
                  <h2
                    className="font-bold text-base mb-1 line-clamp-2 transition-colors text-[var(--text-on-light)] group-hover:text-[var(--color-terracotta-600)]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {item.nama_beasiswa}
                  </h2>
                  <p className="text-xs mb-4 text-[var(--text-muted-on-light)]">
                    oleh {item.penyelenggara}
                  </p>

                  {/* Info Ringkas */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted-on-light)]">
                      <GraduationCap size={13} />
                      IPK Minimum: <strong>{item.kriteria_ipk_min ? item.kriteria_ipk_min.toFixed(2) : '3.00'}</strong>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted-on-light)]">
                      <Clock size={13} />
                      Tenggat: <strong>{deadlineFormatted}</strong>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-terracotta-600)]">
                      <Award size={13} />
                      <strong>{item.kriteria_jurusan || 'Semua Jurusan'}</strong>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-terracotta-600)]"
                    aria-hidden="true"
                  >
                    Lihat detail persyaratannya
                    <ArrowRight size={12} />
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
