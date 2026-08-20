import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, User, Calendar, FileText, FolderOpen } from 'lucide-react';
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
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center" style={{ background: 'var(--color-cream-200)' }}>
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
    );
  }

  const tanggalFormatted = new Date(materi.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      className="min-h-screen pt-16"
      style={{ background: 'var(--color-cream-200)' }}
    >
      {/* Breadcrumb */}
      <div
        className="border-b py-3"
        style={{ borderColor: 'var(--color-cream-300)', background: 'white' }}
      >
        <div className="container-lentera">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
            <Link href="/jelajah" className="flex items-center gap-1.5 transition-colors hover:underline text-[var(--color-gold-600)] font-medium">
              <ArrowLeft size={14} />
              Jelajah Materi
            </Link>
            <span style={{ color: 'var(--text-muted-on-light)' }}>/</span>
            <span className="font-medium truncate text-[var(--text-on-light)]">
              {materi.judul}
            </span>
          </nav>
        </div>
      </div>

      <div className="container-lentera py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Utama */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card Materi */}
            <div className="card-glass p-8 space-y-5">
              <div className="flex flex-wrap gap-2">
                <Badge varian="gold">{labelKategori[materi.kategori] || materi.kategori}</Badge>
                <Badge varian="cream">{materi.mata_kuliah}</Badge>
              </div>

              <h1
                className="text-2xl md:text-3xl font-bold text-[var(--text-on-light)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {materi.judul}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-5 text-xs md:text-sm text-[var(--text-muted-on-light)] border-y py-3" style={{ borderColor: 'var(--color-cream-300)' }}>
                <span className="flex items-center gap-1.5 font-medium">
                  <User size={15} className="text-[var(--color-gold-600)]" />
                  {materi.profiles?.nama_lengkap || 'Pengguna Lentera'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={15} />
                  {tanggalFormatted}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen size={15} />
                  Mata Kuliah: {materi.mata_kuliah}
                </span>
              </div>

              {/* Deskripsi */}
              <div>
                <h3 className="text-sm font-bold text-[var(--text-on-light)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Deskripsi Materi:
                </h3>
                <p className="leading-relaxed text-sm text-[var(--text-on-light)] whitespace-pre-line">
                  {materi.deskripsi || 'Tidak ada deskripsi tambahan untuk materi ini.'}
                </p>
              </div>

              {/* Tombol Unduh Component */}
              <div className="pt-4">
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
              totalPenilai={materi.total_penilai || 0}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Panel Asisten AI — terkoneksi ke /api/ai/ringkasan, /api/ai/kuis, /api/ai/tanya-jawab */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
