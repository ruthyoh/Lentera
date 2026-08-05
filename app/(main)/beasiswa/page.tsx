import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, Filter, Award, Brain, Clock, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Tombol from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export const metadata: Metadata = {
  title: 'Jelajah Beasiswa',
  description: 'Temukan ratusan beasiswa dari pemerintah, swasta, dan internasional. Pencocokan cerdas dengan profil akademikmu.',
};

const kategoriBeasiswa = [
  { label: 'Semua', value: 'semua' },
  { label: 'Prestasi', value: 'prestasi' },
  { label: 'Kebutuhan', value: 'kebutuhan' },
  { label: 'Riset', value: 'riset' },
  { label: 'Pemerintah', value: 'pemerintah' },
  { label: 'Swasta', value: 'swasta' },
  { label: 'Internasional', value: 'internasional' },
];

const beasiswaPlaceholder = Array.from({ length: 9 }, (_, i) => ({
  id: `beasiswa-${i + 1}`,
  nama: [
    'Beasiswa Unggulan Kemendikbud 2026',
    'Beasiswa Bank Indonesia 2026',
    'Beasiswa Djarum Plus 2026/2027',
    'Beasiswa LPDP Reguler',
    'Beasiswa PPA (Peningkatan Prestasi Akademik)',
    'Beasiswa Tanoto Foundation',
    'Beasiswa Yayasan Bakti Pendidikan',
    'Beasiswa Prestasi Telkom Indonesia',
    'Beasiswa BAZNAS Pusat',
  ][i],
  penyelenggara: [
    'Kemendikbudristek',
    'Bank Indonesia',
    'Djarum Foundation',
    'LPDP - Kemenkeu',
    'Dikti',
    'Tanoto Foundation',
    'Yayasan Bakti',
    'Telkom Indonesia',
    'BAZNAS',
  ][i],
  kategori: ['pemerintah', 'swasta', 'swasta', 'pemerintah', 'pemerintah', 'swasta', 'swasta', 'swasta', 'kebutuhan'][i],
  ipk: [3.0, 3.25, 3.0, 3.0, 3.0, 3.0, 2.75, 3.0, 2.5][i],
  tenggat: ['30 Sep 2026', '15 Okt 2026', '1 Nov 2026', '31 Okt 2026', '30 Ags 2026', '15 Sep 2026', '1 Okt 2026', '30 Sep 2026', '15 Nov 2026'][i],
  status: ['aktif', 'aktif', 'aktif', 'aktif', 'segera_ditutup', 'aktif', 'aktif', 'segera_ditutup', 'aktif'][i],
  nominal: [2500000, 1000000, 750000, null, 500000, 1500000, 800000, 1200000, 700000][i],
}));

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

export default function HalamanBeasiswa() {
  return (
    <div className="min-h-screen pt-16" style={{ background: 'var(--color-cream-200)' }}>
      {/* Header */}
      <div
        className="py-14 relative overflow-hidden"
        style={{ background: 'var(--color-terracotta-600)' }}
      >
        <div className="absolute inset-0 opacity-10" aria-hidden="true" style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
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
                300+ beasiswa diperbarui setiap minggu
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

        {/* Search & Filter */}
        <div className="card-glass p-5 mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              id="cari-beasiswa"
              placeholder="Cari nama beasiswa atau penyelenggara..."
              ikonKiri={<Search size={16} />}
              aria-label="Cari beasiswa"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <select
              id="filter-ipk-minimum"
              className="px-4 py-3 rounded-[var(--radius-sm)] border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-500)]"
              style={{ borderColor: 'var(--color-cream-400)', color: 'var(--text-on-light)' }}
              aria-label="Filter IPK minimum"
            >
              <option value="">IPK Minimum</option>
              <option value="2.5">≥ 2.50</option>
              <option value="3.0">≥ 3.00</option>
              <option value="3.25">≥ 3.25</option>
              <option value="3.5">≥ 3.50</option>
            </select>
            <Tombol varian="outline" ukuran="sedang" ikonKiri={<Filter size={15} />} id="tombol-filter-beasiswa">
              Filter
            </Tombol>
          </div>
        </div>

        {/* Tab Kategori */}
        <div className="flex gap-2 flex-wrap mb-8" role="tablist" aria-label="Filter kategori beasiswa">
          {kategoriBeasiswa.map((kat) => (
            <button
              key={kat.value}
              role="tab"
              aria-selected={kat.value === 'semua'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={
                kat.value === 'semua'
                  ? { background: 'var(--color-terracotta-500)', color: 'white' }
                  : { background: 'white', color: 'var(--text-on-light)' }
              }
              id={`tab-beasiswa-${kat.value}`}
            >
              {kat.label}
            </button>
          ))}
        </div>

        {/* Grid Beasiswa */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
          role="list"
          aria-label="Daftar beasiswa"
        >
          {beasiswaPlaceholder.map((beasiswa) => {
            const statusConfig = labelStatus[beasiswa.status] || labelStatus.aktif;
            return (
              <Link
                key={beasiswa.id}
                href={`/beasiswa/${beasiswa.id}`}
                className="card-glass p-6 block group"
                role="listitem"
                aria-label={`Lihat detail: ${beasiswa.nama}`}
              >
                {/* Status & Kategori */}
                <div className="flex items-center justify-between mb-4">
                  <Badge varian={statusConfig.varian}>{statusConfig.label}</Badge>
                  <Badge varian="terracotta">{labelKategori[beasiswa.kategori] || beasiswa.kategori}</Badge>
                </div>

                {/* Nama */}
                <h2
                  className="font-bold text-base mb-1 line-clamp-2 transition-colors text-[var(--text-on-light)] group-hover:text-[var(--color-terracotta-600)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {beasiswa.nama}
                </h2>
                <p className="text-xs mb-4 text-[var(--text-muted-on-light)]">
                  oleh {beasiswa.penyelenggara}
                </p>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted-on-light)]">
                    <GraduationCap size={13} />
                    IPK Minimum: <strong>{beasiswa.ipk.toFixed(2)}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted-on-light)]">
                    <Clock size={13} />
                    Tenggat: <strong>{beasiswa.tenggat}</strong>
                  </div>
                  {beasiswa.nominal && (
                    <div className="flex items-center gap-2 text-xs text-[var(--color-terracotta-600)]">
                      <Award size={13} />
                      <strong>Rp {beasiswa.nominal.toLocaleString('id-ID')}/bulan</strong>
                    </div>
                  )}
                </div>

                <div
                  className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-terracotta-600)]"
                  aria-hidden="true"
                >
                  Lihat detail
                  <ArrowRight size={12} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-center">
          <nav aria-label="Navigasi halaman beasiswa" className="flex gap-2">
            {[1, 2, 3, '...', 12].map((hal, i) => (
              <button
                key={i}
                className="w-10 h-10 rounded-[var(--radius-sm)] text-sm font-medium transition-all"
                style={
                  hal === 1
                    ? { background: 'var(--color-terracotta-500)', color: 'white' }
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
