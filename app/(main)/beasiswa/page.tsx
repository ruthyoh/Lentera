import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, Filter, Award, Brain, Clock, GraduationCap, ArrowRight, Sparkles, FolderOpen, Star, Heart, Building, Globe, Compass } from 'lucide-react';
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

// Data Kategori Beasiswa Card (Gradient Academy Style)
const daftarKategoriBeasiswaCard = [
  {
    label: 'Semua Beasiswa',
    value: 'semua',
    deskripsi: 'Jelajahi seluruh program beasiswa aktif dari berbagai kategori & penyelenggara',
    ikon: <Award size={24} />,
    gradientBg: 'from-purple-500/20 via-indigo-500/10 to-transparent',
    borderColor: 'rgba(168, 85, 247, 0.3)',
    iconColor: '#c084fc',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    tagText: 'Semua Program',
  },
  {
    label: 'Beasiswa Prestasi',
    value: 'prestasi',
    deskripsi: 'Dukungan finansial berdasarkan capaian IPK tinggi & prestasi non-akademik',
    ikon: <Star size={24} />,
    gradientBg: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    iconColor: '#fbbf24',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    tagText: 'Merit-Based',
  },
  {
    label: 'Beasiswa Kebutuhan',
    value: 'kebutuhan',
    deskripsi: 'Bantuan biaya kuliah & uang saku bagi mahasiswa yang membutuhkan kendala finansial',
    ikon: <Heart size={24} />,
    gradientBg: 'from-rose-500/20 via-pink-500/10 to-transparent',
    borderColor: 'rgba(244, 63, 94, 0.3)',
    iconColor: '#fb7185',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    tagText: 'Bantuan Finansial',
  },
  {
    label: 'Beasiswa Riset',
    value: 'riset',
    deskripsi: 'Hibah penelitian, pengerjaan tugas akhir, tesis, & pendanaan laboratorium',
    ikon: <Brain size={24} />,
    gradientBg: 'from-cyan-500/20 via-teal-500/10 to-transparent',
    borderColor: 'rgba(34, 211, 238, 0.3)',
    iconColor: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.25)',
    tagText: 'Tugas Akhir & Skripsi',
  },
  {
    label: 'Beasiswa Pemerintah',
    value: 'pemerintah',
    deskripsi: 'Program resmi kementerian, KIP Kuliah, LPDP, dan pemerintah daerah',
    ikon: <GraduationCap size={24} />,
    gradientBg: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    iconColor: '#60a5fa',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    tagText: 'KIP-K & LPDP',
  },
  {
    label: 'Beasiswa Swasta',
    value: 'swasta',
    deskripsi: 'Program beasiswa penuh/parsial dari yayasan, BUMN, & korporasi terkemuka',
    ikon: <Building size={24} />,
    gradientBg: 'from-emerald-500/20 via-green-500/10 to-transparent',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    iconColor: '#34d399',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    tagText: 'Corporate Grants',
  },
  {
    label: 'Beasiswa Internasional',
    value: 'internasional',
    deskripsi: 'Peluang exchange, summer school, dan studi lanjut di universitas luar negeri',
    ikon: <Globe size={24} />,
    gradientBg: 'from-violet-500/20 via-fuchsia-500/10 to-transparent',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    iconColor: '#a78bfa',
    glowColor: 'rgba(139, 92, 246, 0.25)',
    tagText: 'Study Abroad',
  },
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

  const kategoriAktifObj = daftarKategoriBeasiswaCard.find((k) => k.value === jenisDipilih) || daftarKategoriBeasiswaCard[0];

  return (
    <div
      className="min-h-screen pt-16"
      style={{
        background: 'linear-gradient(180deg, #0f0a1e 0%, #150d2e 30%, #1a1040 60%, #0f0a1e 100%)',
      }}
    >
      {/* Header Halaman — Purple & Gold Celestial Glow */}
      <div className="py-16 relative overflow-hidden border-b border-white/10">
        {/* Glow halo & pattern */}
        <div
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full opacity-35 pointer-events-none blur-3xl"
          style={{ background: 'radial-gradient(circle, #a855f7 0%, rgba(168, 85, 247, 0.1) 60%, transparent 80%)' }}
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
            backgroundImage: `radial-gradient(circle, rgba(168, 85, 247, 0.4) 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
          }}
        />

        <div className="container-lentera relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border backdrop-blur-md" style={{ background: 'rgba(168,85,247,0.15)', borderColor: 'rgba(168,85,247,0.3)', color: '#c084fc' }}>
                <Award size={13} className="text-purple-400" />
                Modul Beasiswa · Basis Data Terintegrasi
              </div>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 text-white tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Jelajah <span style={{ color: '#c084fc' }}>Beasiswa</span>
              </h1>
              <p className="text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
                Temukan <strong className="text-white font-semibold">{total > 0 ? `${total} peluang beasiswa` : 'berbagai program beasiswa'}</strong> dari pemerintah, swasta, dan donor internasional dengan bantuan rekomendasi AI.
              </p>
            </div>

            <Tombol
              varian="sekunder"
              ukuran="sedang"
              ikonKiri={<Brain size={16} />}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold hover:from-purple-400 hover:to-indigo-400 border-none shadow-lg shrink-0"
              id="tombol-pencocokan-ai"
            >
              <Sparkles size={14} />
              Pencocokan AI
            </Tombol>
          </div>
        </div>
      </div>

      <div className="container-lentera py-10">
        {/* Banner AI Pencocokan Beasiswa Interaktif */}
        <div className="mb-10">
          <PanelPencocokanAI userId={userId} />
        </div>

        {/* ── SEKSI KATEGORI CARD BEASISWA (Gradient Academy Style) ── */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
                <Compass size={14} />
                Pilih Kategori Beasiswa
              </div>
              <h2
                className="text-2xl font-bold text-white tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Kategori Pendanaan &amp; Beasiswa
              </h2>
            </div>
            {jenisDipilih !== 'semua' && (
              <Link
                href="/beasiswa"
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
              >
                Tampilkan Semua Kategori
                <ArrowRight size={13} />
              </Link>
            )}
          </div>

          {/* Grid Kategori Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {daftarKategoriBeasiswaCard.map((kat) => {
              const isAktif = jenisDipilih === kat.value;

              // Preserve search query & ipk
              const searchParamsObj = new URLSearchParams();
              if (kataKunci) searchParamsObj.set('q', kataKunci);
              if (params.ipk) searchParamsObj.set('ipk', params.ipk);
              if (kat.value !== 'semua') searchParamsObj.set('jenis', kat.value);

              const queryString = searchParamsObj.toString();
              const href = `/beasiswa${queryString ? `?${queryString}` : ''}`;

              return (
                <Link
                  key={kat.value}
                  href={href}
                  className="group relative rounded-2xl p-5 block border transition-all duration-300 hover:-translate-y-1.5 overflow-hidden backdrop-blur-md"
                  style={{
                    background: isAktif
                      ? 'rgba(255, 255, 255, 0.09)'
                      : 'rgba(255, 255, 255, 0.04)',
                    borderColor: isAktif ? kat.iconColor : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: isAktif ? `0 0 25px ${kat.glowColor}` : 'none',
                  }}
                  id={`card-beasiswa-kategori-${kat.value}`}
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
                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
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
                        className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border"
                        style={{
                          background: isAktif ? kat.iconColor : 'rgba(255, 255, 255, 0.06)',
                          color: isAktif ? '#0f0a1e' : kat.iconColor,
                          borderColor: kat.borderColor,
                        }}
                      >
                        {isAktif ? 'Aktif' : kat.tagText}
                      </span>
                    </div>

                    <h3
                      className="text-base font-bold text-white mb-1 transition-colors group-hover:text-purple-300"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {kat.label}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">
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

        {/* ── SEKSI LIST BEASISWA HASIL ── */}
        <div className="pt-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2
                className="text-xl font-bold text-white flex items-center gap-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span>Daftar Beasiswa:</span>
                <span className="text-purple-400">{kategoriAktifObj.label}</span>
              </h2>
              <p className="text-xs text-slate-400">
                Menampilkan {total} beasiswa aktif yang dapat Anda lamar
              </p>
            </div>
          </div>

          {/* Search & Filter Form */}
          <form action="/beasiswa" method="GET" className="p-5 mb-8 flex flex-col md:flex-row gap-4 rounded-2xl border border-white/10 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.06)' }}>
            {jenisDipilih !== 'semua' && (
              <input type="hidden" name="jenis" value={jenisDipilih} />
            )}

            <div className="flex-1 relative">
              <input
                type="text"
                name="q"
                defaultValue={kataKunci}
                placeholder="Cari nama beasiswa atau penyelenggara..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                }}
                aria-label="Cari beasiswa"
                id="cari-beasiswa"
              />
              <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
            </div>

            <div className="flex gap-3 flex-wrap">
              <select
                name="ipk"
                defaultValue={params.ipk || ''}
                id="filter-ipk-minimum"
                className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                }}
                aria-label="Filter IPK minimum"
              >
                <option value="" style={{ background: '#1a1040' }}>IPK Minimum</option>
                <option value="2.5" style={{ background: '#1a1040' }}>≥ 2.50</option>
                <option value="3.0" style={{ background: '#1a1040' }}>≥ 3.00</option>
                <option value="3.25" style={{ background: '#1a1040' }}>≥ 3.25</option>
                <option value="3.5" style={{ background: '#1a1040' }}>≥ 3.50</option>
              </select>
              <Tombol
                type="submit"
                varian="sekunder"
                ukuran="sedang"
                ikonKiri={<Filter size={15} />}
                id="tombol-filter-beasiswa"
                className="bg-purple-600! hover:bg-purple-500! text-white! border-none!"
              >
                Cari &amp; Filter
              </Tombol>
              {(kataKunci || params.ipk || jenisDipilih !== 'semua') && (
                <Link href="/beasiswa">
                  <Tombol
                    varian="hantu"
                    ukuran="sedang"
                    className="text-white! border-white/25! hover:bg-white/10!"
                  >
                    Reset
                  </Tombol>
                </Link>
              )}
            </div>
          </form>

          {/* Grid Beasiswa */}
          {beasiswa.length > 0 ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
              role="list"
              aria-label="Daftar beasiswa"
            >
              {beasiswa.map((item) => {
                const statusConfig = labelStatus[item.status] || labelStatus.aktif;

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
                    className="group relative rounded-2xl p-6 block border transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderColor: 'rgba(255,255,255,0.1)',
                    }}
                    role="listitem"
                    aria-label={`Lihat detail: ${item.nama_beasiswa}`}
                  >
                    {/* Hover glow overlay */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(99,102,241,0.08) 100%)', border: '1px solid rgba(168,85,247,0.3)' }}
                    />
                    {/* Accent top gradient highlight on hover */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10">
                      {/* Status & Kategori */}
                      <div className="flex items-center justify-between mb-3.5">
                        <Badge varian={statusConfig.varian}>{statusConfig.label}</Badge>
                        <Badge varian="terracotta" className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5">
                          {labelKategori[item.jenis] || item.jenis}
                        </Badge>
                      </div>

                      {/* Nama Beasiswa */}
                      <h2
                        className="font-bold text-base mb-1 line-clamp-2 transition-colors text-white group-hover:text-purple-300"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {item.nama_beasiswa}
                      </h2>
                      <p className="text-xs mb-4 text-slate-400 font-medium">
                        oleh <span className="text-slate-300 font-semibold">{item.penyelenggara}</span>
                      </p>

                      {/* Info Ringkas */}
                      <div className="space-y-2 mb-4 p-3 rounded-xl border" style={{ background: 'rgba(168,85,247,0.08)', borderColor: 'rgba(168,85,247,0.2)' }}>
                        <div className="flex items-center justify-between text-xs text-slate-300">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <GraduationCap size={13} className="text-purple-400" />
                            IPK Minimum
                          </span>
                          <strong className="text-white font-bold">{item.kriteria_ipk_min ? item.kriteria_ipk_min.toFixed(2) : '3.00'}</strong>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-300">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Clock size={13} className="text-purple-400" />
                            Tenggat
                          </span>
                          <strong className="font-bold" style={{ color: '#fbbf24' }}>{deadlineFormatted}</strong>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-purple-500/20">
                          <span className="flex items-center gap-1.5 text-purple-300 font-semibold truncate">
                            <Award size={13} />
                            {item.kriteria_jurusan || 'Semua Jurusan'}
                          </span>
                        </div>
                      </div>

                      <div
                        className="flex items-center justify-end gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 text-purple-400"
                        aria-hidden="true"
                      >
                        Lihat detail persyaratannya
                        <ArrowRight size={13} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div
              className="p-12 text-center my-10 max-w-lg mx-auto space-y-4 rounded-2xl border"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <div
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                style={{ background: 'rgba(168,85,247,0.15)', color: 'rgba(168,85,247,0.7)' }}
              >
                <FolderOpen size={32} />
              </div>
              <div>
                <h3
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Beasiswa Tidak Ditemukan
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Tidak ada beasiswa yang sesuai dengan kriteria pencarian atau filter Anda.
                </p>
              </div>
              <div className="pt-2 flex justify-center">
                <Link href="/beasiswa">
                  <Tombol
                    varian="sekunder"
                    ukuran="sedang"
                    className="bg-purple-600! hover:bg-purple-500! text-white! border-none!"
                  >
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
                        className="w-10 h-10 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                        style={
                          isAktif
                            ? { background: '#a855f7', color: 'white', boxShadow: '0 0 16px rgba(168,85,247,0.4)' }
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
    </div>
  );
}
