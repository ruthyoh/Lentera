import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft, Award, Clock, GraduationCap, Globe, Brain,
  CheckCircle, AlertCircle, PenTool, BookOpen, ArrowRight
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Tombol from '@/components/ui/Button';

interface HalamanDetailBeasiswaProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: HalamanDetailBeasiswaProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Detail Beasiswa — ${id}`,
    description: 'Lihat persyaratan lengkap dan daftar beasiswa di Lentera.',
  };
}

export default async function HalamanDetailBeasiswa({ params }: HalamanDetailBeasiswaProps) {
  const { id } = await params;

  const beasiswa = {
    id,
    nama: 'Beasiswa Unggulan Kemendikbud 2026',
    penyelenggara: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
    kategori: 'Pemerintah',
    status: 'aktif',
    deskripsi:
      'Beasiswa Unggulan merupakan program beasiswa yang diberikan kepada putra-putri terbaik bangsa Indonesia yang berprestasi dan berpotensi mengembangkan diri. Program ini bertujuan mendorong akses pendidikan tinggi berkualitas bagi mahasiswa berprestasi dari seluruh Indonesia.',
    persyaratan: [
      'WNI aktif sebagai mahasiswa S1/D4/S2/S3',
      'IPK minimal 3.00 untuk S1, 3.25 untuk S2/S3',
      'Tidak sedang menerima beasiswa lain dari pemerintah',
      'Usia maksimal 35 tahun (S1), 40 tahun (S2), 45 tahun (S3)',
      'Tidak melebihi semester 4 untuk S1',
      'Memiliki sertifikat bahasa Inggris (TOEFL/IELTS) untuk jenjang S2/S3',
    ],
    benefit: [
      'Biaya Pendidikan (SPP/Tuition Fee)',
      'Biaya Hidup Rp 2.500.000/bulan',
      'Biaya Buku & Penelitian',
      'Biaya Seminar/Konferensi',
    ],
    nominal: 2500000,
    tenggat: '30 September 2026',
    tautanResmi: 'https://beasiswaunggulan.kemdikbud.go.id',
    ipkMinimum: 3.0,
    jurusanTersedia: 'Semua Jurusan',
    semesterMaksimum: 4,
  };

  const statusConfig = {
    aktif: { label: 'Aktif', varian: 'aktif' as const },
    segera_ditutup: { label: 'Segera Ditutup', varian: 'peringatan' as const },
    ditutup: { label: 'Ditutup', varian: 'bahaya' as const },
  };

  const statusInfo = statusConfig[beasiswa.status as keyof typeof statusConfig];

  return (
    <div className="min-h-screen pt-16" style={{ background: 'var(--color-cream-200)' }}>
      {/* Breadcrumb */}
      <div className="border-b py-3" style={{ borderColor: 'var(--color-cream-300)', background: 'white' }}>
        <div className="container-lentera">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
            <Link href="/beasiswa" className="flex items-center gap-1.5 hover:text-[var(--color-terracotta-600)] transition-colors text-[var(--text-muted-on-light)]">
              <ArrowLeft size={14} />
              Jelajah Beasiswa
            </Link>
            <span style={{ color: 'var(--text-muted-on-light)' }}>/</span>
            <span className="font-medium truncate text-[var(--text-on-light)]">
              {beasiswa.nama}
            </span>
          </nav>
        </div>
      </div>

      <div className="container-lentera py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Utama */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="card-glass p-8">
              <div className="flex flex-wrap gap-2 mb-5">
                <Badge varian={statusInfo.varian}>{statusInfo.label}</Badge>
                <Badge varian="terracotta">{beasiswa.kategori}</Badge>
              </div>

              <div className="flex items-start gap-4 mb-5">
                <div
                  className="w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--color-terracotta-100)' }}
                  aria-hidden="true"
                >
                  <Award size={26} style={{ color: 'var(--color-terracotta-600)' }} />
                </div>
                <div>
                  <h1
                    className="text-2xl md:text-3xl font-bold mb-1 text-[var(--text-on-light)]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {beasiswa.nama}
                  </h1>
                  <p className="text-sm text-[var(--text-muted-on-light)]">
                    {beasiswa.penyelenggara}
                  </p>
                </div>
              </div>

              <p className="leading-relaxed mb-6 text-[var(--text-on-light)]">
                {beasiswa.deskripsi}
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={beasiswa.tautanResmi}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="tombol-daftar-beasiswa"
                >
                  <Tombol
                    varian="sekunder"
                    ukuran="besar"
                    ikonKiri={<Globe size={16} />}
                    ikonKanan={<ArrowRight size={14} />}
                  >
                    Daftar Sekarang
                  </Tombol>
                </a>
                <Tombol varian="outline" ukuran="sedang" ikonKiri={<PenTool size={15} />} id="tombol-draf-esai">
                  Buat Draf Esai AI
                </Tombol>
              </div>
            </div>

            {/* Persyaratan */}
            <div className="card-glass p-8">
              <h2
                className="text-xl font-bold mb-5 flex items-center gap-2 text-[var(--text-on-light)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <AlertCircle size={20} style={{ color: 'var(--color-terracotta-500)' }} />
                Persyaratan Pendaftaran
              </h2>
              <ul className="space-y-3">
                {beasiswa.persyaratan.map((syarat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-on-light)]">
                    <CheckCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-gold-600)' }} />
                    {syarat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefit */}
            <div className="card-glass p-8">
              <h2
                className="text-xl font-bold mb-5 flex items-center gap-2 text-[var(--text-on-light)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <Award size={20} style={{ color: 'var(--color-terracotta-500)' }} />
                Manfaat Beasiswa
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {beasiswa.benefit.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-[var(--radius-sm)]"
                    style={{ background: 'var(--color-terracotta-50)', border: '1px solid var(--color-terracotta-200)' }}
                  >
                    <CheckCircle size={14} style={{ color: 'var(--color-terracotta-500)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--color-terracotta-800)' }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Ringkas */}
            <div className="card-glass p-6">
              <h3 className="font-bold mb-4 text-[var(--text-on-light)]" style={{ fontFamily: 'var(--font-display)' }}>
                Informasi Singkat
              </h3>
              <div className="space-y-4">
                {[
                  { ikon: <Clock size={16} />, label: 'Tenggat Waktu', nilai: beasiswa.tenggat },
                  { ikon: <Award size={16} />, label: 'Nominal', nilai: `Rp ${beasiswa.nominal.toLocaleString('id-ID')}/bulan` },
                  { ikon: <GraduationCap size={16} />, label: 'IPK Minimum', nilai: beasiswa.ipkMinimum.toFixed(2) },
                  { ikon: <BookOpen size={16} />, label: 'Jurusan', nilai: beasiswa.jurusanTersedia },
                ].map((info) => (
                  <div key={info.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-terracotta-100)', color: 'var(--color-terracotta-600)' }}>
                      {info.ikon}
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted-on-light)]">{info.label}</p>
                      <p className="text-sm font-semibold text-[var(--text-on-light)]">{info.nilai}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Draf Esai */}
            <div
              className="p-6 rounded-[var(--radius-lg)] text-white"
              style={{ background: 'var(--color-terracotta-600)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Brain size={20} />
                <h3 className="font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  Draf Esai AI
                </h3>
              </div>
              <p className="text-sm opacity-85 mb-4">
                Biarkan AI membantu menyusun esai motivasi yang kuat dan sesuai persyaratan beasiswa ini.
              </p>
              <Link href="/login" className="block">
                <button
                  className="w-full py-3 rounded-[var(--radius-sm)] text-sm font-semibold transition-all hover:opacity-90 cursor-pointer"
                  style={{ background: 'white', color: 'var(--color-terracotta-700)' }}
                  id="tombol-mulai-esai-ai"
                >
                  Mulai Draf Esai
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
