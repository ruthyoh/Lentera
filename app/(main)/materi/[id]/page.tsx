import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, User, Calendar, FileText, FolderOpen, Download, Star, Upload, Brain } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Tombol from '@/components/ui/Button';
import { ambilDetailMateri } from '@/lib/actions/materi';
import TombolUnduh from '@/components/materi/TombolUnduh';
import FormPenilaian from '@/components/materi/FormPenilaian';
import PanelAsistenAI from '@/components/materi/PanelAsistenAI';

interface HalamanDetailMateriProps {
  params: Promise<{ id: string }>;
}

const labelKategori: Record<string, string> = {
  catatan: 'Catatan Kuliah',
  rangkuman: 'Rangkuman Materi',
  bank_soal: 'Bank Soal',
  modul: 'Modul',
  presentasi: 'Slide Presentasi',
  lainnya: 'Lainnya',
};

const warnaBadgeKategori: Record<string, string> = {
  catatan: 'bg-blue-100 text-blue-800 border-blue-200',
  rangkuman: 'bg-purple-100 text-purple-800 border-purple-200',
  bank_soal: 'bg-amber-100 text-amber-800 border-amber-200',
  modul: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  presentasi: 'bg-rose-100 text-rose-800 border-rose-200',
  lainnya: 'bg-slate-100 text-slate-800 border-slate-200',
};

export async function generateMetadata({ params }: HalamanDetailMateriProps): Promise<Metadata> {
  const { id } = await params;
  const { materi } = await ambilDetailMateri(id);

  if (!materi) {
    return {
      title: 'Materi Tidak Ditemukan | Lentera',
    };
  }

  return {
    title: `${materi.judul} | Lentera`,
    description: materi.deskripsi || `Unduh ${materi.judul} — Mata Kuliah ${materi.mata_kuliah} di platform Lentera.`,
  };
}

export default async function HalamanDetailMateri({ params }: HalamanDetailMateriProps) {
  const { id } = await params;
  const { materi, nilaiSaya } = await ambilDetailMateri(id);

  if (!materi) {
    return (
      <div className="min-h-screen pt-16 bg-[var(--color-cream-200)]">
        {/* Dark mini-header bahkan untuk error state */}
        <div className="bg-gradient-to-b from-[#07132a] to-[#0b1d3a] py-8 border-b border-white/10">
          <div className="container-lentera">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
              <Link href="/jelajah" className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                <ArrowLeft size={14} />
                Jelajah Materi
              </Link>
              <span className="text-white/30">/</span>
              <span className="text-white/50">Tidak Ditemukan</span>
            </nav>
          </div>
        </div>
        <div className="container-lentera py-16 flex items-center justify-center">
          <div className="card-glass p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-[var(--color-cream-300)] text-[var(--text-muted-on-light)]">
              <FolderOpen size={32} />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-on-light)]" style={{ fontFamily: 'var(--font-display)' }}>
              Materi Tidak Ditemukan
            </h1>
            <p className="text-sm text-[var(--text-muted-on-light)]">
              Berkas materi yang Anda cari tidak ditemukan atau telah dihapus.
            </p>
            <Link href="/jelajah">
              <Tombol varian="primer" ukuran="sedang" className="mt-2">
                Kembali ke Jelajah Materi
              </Tombol>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tanggalFormatted = new Date(materi.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Fix: hanya tampilkan rating jika benar-benar ada data
  const ratingValid = (materi.rating_rata_rata || 0) > 0;
  const totalPenilaiValid = materi.total_penilai || 0;

  return (
    <div className="min-h-screen pt-16">
      {/* ==============================================
          HERO HEADER — Dark Navy Celestial (konsisten)
          ============================================== */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#07132a] via-[#0d1f3c] to-[#0f2444] border-b border-white/10">
        {/* Ambient Glow */}
        <div
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full opacity-20 pointer-events-none blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--color-aurora-400) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        <div className="container-lentera relative z-10 py-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm mb-6">
            <Link href="/jelajah" className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              <ArrowLeft size={14} />
              Jelajah Materi
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-white/50 truncate max-w-xs">{materi.judul}</span>
          </nav>

          {/* Hero Content */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8">
            <div className="max-w-2xl">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${warnaBadgeKategori[materi.kategori] || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                  {labelKategori[materi.kategori] || materi.kategori}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/15">
                  📚 {materi.mata_kuliah}
                </span>
              </div>

              <h1
                className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight leading-snug"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {materi.judul}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <User size={14} className="text-cyan-400" />
                  {materi.profiles?.nama_lengkap || 'Pengguna Lentera'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" />
                  {tanggalFormatted}
                </span>
                <span className="flex items-center gap-1.5">
                  <Download size={14} className="text-slate-400" />
                  {(materi.jumlah_unduhan || 0).toLocaleString('id-ID')} unduhan
                </span>
                {/* Rating — hanya tampil jika ada data nyata */}
                {ratingValid && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    {materi.rating_rata_rata!.toFixed(1)}
                    <span className="font-normal text-slate-400">({totalPenilaiValid} ulasan)</span>
                  </span>
                )}
                {!ratingValid && (
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Star size={12} />
                    Belum ada ulasan
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================
          KONTEN UTAMA — Background Gelap Celestial
          ============================================== */}
      <div className="bg-gradient-to-b from-[#0f2444] via-[#0b1d3a] to-[#07132a]">
        <div className="container-lentera py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom Utama */}
            <div className="lg:col-span-2 space-y-6">
              {/* Kartu Detail & Unduh */}
              <div className="card-glass p-8 space-y-5">
                <h2 className="text-base font-bold text-[var(--text-on-light)] flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                  <FileText size={18} className="text-cyan-600" />
                  Deskripsi Materi
                </h2>
                <p className="leading-relaxed text-sm text-[var(--text-on-light)] whitespace-pre-line">
                  {materi.deskripsi || 'Tidak ada deskripsi tambahan untuk materi ini.'}
                </p>

                {/* Tombol Unduh Component */}
                <div className="pt-4 border-t" style={{ borderColor: 'var(--color-cream-300)' }}>
                  <TombolUnduh
                    materiId={materi.id}
                    fileUrl={materi.file_url || null}
                    jumlahUnduhanAwal={materi.jumlah_unduhan || 0}
                  />
                </div>
              </div>

              {/* Component Penilaian / Rating */}
              <FormPenilaian
                materiId={materi.id}
                nilaiSaya={nilaiSaya}
                ratingRataRata={materi.rating_rata_rata || 0}
                totalPenilai={totalPenilaiValid}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Panel Asisten AI */}
              <PanelAsistenAI
                materiId={materi.id}
                judulMateri={materi.judul}
              />

              {/* Kartu Informasi Pengunggah */}
              <div className="card-glass p-6 space-y-4">
                <h3
                  className="font-bold text-sm text-[var(--text-on-light)] border-b pb-2"
                  style={{ fontFamily: 'var(--font-display)', borderColor: 'var(--color-cream-300)' }}
                >
                  Informasi Kontributor
                </h3>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'var(--color-gold-100)', color: 'var(--color-gold-800)' }}
                  >
                    {materi.profiles?.nama_lengkap?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-on-light)]">
                      {materi.profiles?.nama_lengkap || 'Pengguna Lentera'}
                    </p>
                    {materi.profiles?.jurusan && (
                      <p className="text-xs text-[var(--text-muted-on-light)]">
                        {materi.profiles.jurusan}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Statistik Card */}
              <div className="card-glass p-5 space-y-3">
                <h3 className="font-bold text-sm text-[var(--text-on-light)]" style={{ fontFamily: 'var(--font-display)' }}>
                  Statistik Materi
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-100 text-center">
                    <p className="text-xl font-extrabold text-cyan-700">{(materi.jumlah_unduhan || 0).toLocaleString('id-ID')}</p>
                    <p className="text-[10px] text-cyan-600 font-semibold uppercase tracking-wide mt-0.5">Unduhan</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-center">
                    {ratingValid ? (
                      <>
                        <p className="text-xl font-extrabold text-amber-700">{materi.rating_rata_rata!.toFixed(1)}</p>
                        <p className="text-[10px] text-amber-600 font-semibold uppercase tracking-wide mt-0.5">{totalPenilaiValid} Ulasan</p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-extrabold text-slate-400">—</p>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mt-0.5">Belum ada ulasan</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pb-16" />
      </div>
    </div>
  );
}
