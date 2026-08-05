import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Download, Heart, Share2, Brain, BookOpen, User, Calendar, Eye } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Tombol from '@/components/ui/Button';

interface HalamanDetailMateriProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: HalamanDetailMateriProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Detail Materi — ${id}`,
    description: 'Lihat dan unduh materi belajar dari repositori Lentera.',
  };
}

export default async function HalamanDetailMateri({ params }: HalamanDetailMateriProps) {
  const { id } = await params;

  const materi = {
    id,
    judul: 'Catatan Lengkap Kalkulus 1 — UTS & UAS',
    deskripsi:
      'Catatan kuliah Kalkulus 1 yang komprehensif mencakup seluruh materi dari bab 1 hingga bab 12, lengkap dengan contoh soal dan pembahasan. Cocok untuk persiapan UTS dan UAS.',
    kategori: 'Catatan',
    matkul: 'Kalkulus 1',
    jurusan: 'Teknik Informatika',
    semester: 1,
    pengunggah: 'Ahmad Rizky',
    tanggal: '15 Juli 2026',
    unduhan: 1243,
    suka: 234,
    dilihat: 4521,
    halaman: 48,
    format: 'PDF',
    topik: ['Limit', 'Turunan', 'Integral', 'Barisan & Deret', 'Fungsi Transenden'],
  };

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
            <Link href="/jelajah" className="flex items-center gap-1.5 transition-colors hover:underline text-[var(--color-gold-600)]">
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
            {/* Header Materi */}
            <div className="card-glass p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge varian="gold">{materi.kategori}</Badge>
                <Badge varian="cream">{materi.format}</Badge>
                <Badge varian="cream">{materi.halaman} halaman</Badge>
              </div>

              <h1
                className="text-2xl md:text-3xl font-bold mb-4 text-[var(--text-on-light)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {materi.judul}
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap gap-5 text-sm mb-6 text-[var(--text-muted-on-light)]">
                <span className="flex items-center gap-1.5">
                  <User size={14} />
                  {materi.pengunggah}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {materi.tanggal}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye size={14} />
                  {materi.dilihat.toLocaleString('id-ID')} dilihat
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen size={14} />
                  {materi.matkul} · Sem. {materi.semester}
                </span>
              </div>

              {/* Deskripsi */}
              <p className="leading-relaxed mb-6 text-[var(--text-on-light)]">
                {materi.deskripsi}
              </p>

              {/* Topik */}
              <div className="mb-6">
                <p className="text-sm font-semibold mb-3 text-[var(--text-on-light)]">
                  Topik yang Dibahas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {materi.topik.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ background: 'var(--color-gold-100)', color: 'var(--color-gold-900)' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <Tombol varian="primer" ukuran="besar" ikonKiri={<Download size={16} />} id="tombol-unduh-materi">
                  Unduh Materi
                </Tombol>
                <Tombol varian="outline" ukuran="sedang" ikonKiri={<Heart size={15} />} id="tombol-suka-materi">
                  Suka ({materi.suka})
                </Tombol>
                <Tombol varian="hantu" ukuran="sedang" ikonKiri={<Share2 size={15} />} id="tombol-bagikan-materi">
                  Bagikan
                </Tombol>
              </div>
            </div>

            {/* Preview placeholder */}
            <div className="card-glass p-8">
              <h2
                className="text-lg font-bold mb-4 text-[var(--text-on-light)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Pratinjau Materi
              </h2>
              <div
                className="rounded-[var(--radius-md)] flex items-center justify-center h-64"
                style={{ background: 'var(--color-cream-300)' }}
                role="img"
                aria-label="Pratinjau materi belum tersedia"
              >
                <div className="text-center">
                  <BookOpen size={40} className="mx-auto mb-3 text-[var(--text-muted-on-light)]" />
                  <p className="text-sm text-[var(--text-muted-on-light)]">
                    Pratinjau tersedia setelah masuk
                  </p>
                  <Link href="/login">
                    <Tombol varian="primer" ukuran="sedang" className="mt-3" id="tombol-masuk-pratinjau">
                      Masuk untuk Melihat
                    </Tombol>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Asisten AI */}
            <div
              className="p-6 rounded-[var(--radius-lg)] text-white"
              style={{ background: 'var(--color-dark-800)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Brain size={20} style={{ color: 'var(--color-gold-400)' }} />
                <h3 className="font-bold text-[var(--text-on-dark)]" style={{ fontFamily: 'var(--font-display)' }}>
                  Asisten Belajar AI
                </h3>
              </div>
              <p className="text-sm mb-4 text-[var(--text-muted-on-dark)]">
                Gunakan AI untuk meringkas materi ini, membuat kuis, atau tanya jawab seputar topiknya.
              </p>
              <div className="space-y-2">
                {['Ringkas materi ini', 'Buat 5 kuis latihan', 'Jelaskan bab 3'].map((aksi) => (
                  <button
                    key={aksi}
                    className="w-full text-left text-sm px-3 py-2.5 rounded-lg transition-all text-[var(--text-on-dark)]"
                    style={{ background: 'rgba(201,151,30,0.15)', border: '1px solid rgba(201,151,30,0.25)' }}
                    id={`aksi-ai-${aksi.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    &ldquo;{aksi}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* Statistik */}
            <div className="card-glass p-6">
              <h3
                className="font-bold mb-4 text-[var(--text-on-light)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Statistik Materi
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Unduhan', nilai: materi.unduhan.toLocaleString('id-ID') },
                  { label: 'Total Dilihat', nilai: materi.dilihat.toLocaleString('id-ID') },
                  { label: 'Total Suka', nilai: materi.suka },
                  { label: 'Jurusan', nilai: materi.jurusan },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex justify-between text-sm py-2 border-b"
                    style={{ borderColor: 'var(--color-cream-300)' }}
                  >
                    <span className="text-[var(--text-muted-on-light)]">{stat.label}</span>
                    <span className="font-semibold text-[var(--text-on-light)]">
                      {stat.nilai}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
