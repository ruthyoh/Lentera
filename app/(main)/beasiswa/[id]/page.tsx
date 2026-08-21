import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft, Award, Clock, GraduationCap, Globe,
  CheckCircle, AlertCircle, BookOpen, ArrowRight, FolderOpen
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Tombol from '@/components/ui/Button';
import { ambilDetailBeasiswa } from '@/lib/actions/beasiswa';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import PanelDrafEsaiAI from '@/components/beasiswa/PanelDrafEsaiAI';

interface HalamanDetailBeasiswaProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: HalamanDetailBeasiswaProps): Promise<Metadata> {
  const { id } = await params;
  const beasiswa = await ambilDetailBeasiswa(id);

  if (!beasiswa) {
    return {
      title: 'Beasiswa Tidak Ditemukan | Lentera',
    };
  }

  return {
    title: `${beasiswa.nama_beasiswa} | Lentera`,
    description: beasiswa.deskripsi_singkat || `Informasi pendaftaran ${beasiswa.nama_beasiswa} oleh ${beasiswa.penyelenggara}.`,
  };
}

const statusConfig = {
  aktif: { label: 'Aktif', varian: 'aktif' as const },
  segera_ditutup: { label: 'Segera Ditutup', varian: 'peringatan' as const },
  ditutup: { label: 'Ditutup', varian: 'bahaya' as const },
};

const labelKategori: Record<string, string> = {
  pemerintah: 'Pemerintah',
  swasta: 'Swasta',
  prestasi: 'Prestasi',
  kebutuhan: 'Kebutuhan',
  riset: 'Riset',
  internasional: 'Internasional',
};

export default async function HalamanDetailBeasiswa({ params }: HalamanDetailBeasiswaProps) {
  const { id } = await params;

  const [beasiswa, supabase] = await Promise.all([
    ambilDetailBeasiswa(id),
    createServerSupabaseClient(),
  ]);

  // Ambil userId untuk PanelDrafEsaiAI (null jika belum login)
  let userId: string | null = null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    userId = null;
  }

  if (!beasiswa) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center" style={{ background: 'var(--color-cream-200)' }}>
        <div className="card-glass p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-[var(--color-cream-300)] text-[var(--text-muted-on-light)]">
            <FolderOpen size={32} />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-on-light)]" style={{ fontFamily: 'var(--font-display)' }}>
            Beasiswa Tidak Ditemukan
          </h1>
          <p className="text-sm text-[var(--text-muted-on-light)]">
            Informasi beasiswa yang Anda cari tidak ditemukan atau telah dihapus.
          </p>
          <Link href="/beasiswa">
            <Tombol varian="sekunder" ukuran="sedang" className="mt-2">
              Kembali ke Jelajah Beasiswa
            </Tombol>
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[beasiswa.status as keyof typeof statusConfig] || statusConfig.aktif;

  // Format Date
  let deadlineFormatted = 'Belum ditentukan';
  if (beasiswa.deadline_pendaftaran) {
    const dateObj = new Date(beasiswa.deadline_pendaftaran);
    deadlineFormatted = dateObj.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  // Parse requirements list from kriteria_khusus or generate structured defaults
  const kriteriaKhususList = beasiswa.kriteria_khusus
    ? beasiswa.kriteria_khusus.split(',').map((s) => s.trim())
    : [
        'WNI aktif sebagai mahasiswa S1/D4/S2/S3',
        `IPK minimal ${beasiswa.kriteria_ipk_min ? beasiswa.kriteria_ipk_min.toFixed(2) : '3.00'}`,
        'Tidak sedang menerima beasiswa lain dari pihak ketiga',
        'Memiliki integritas tinggi dan rekam jejak akademik yang baik',
      ];

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
              {beasiswa.nama_beasiswa}
            </span>
          </nav>
        </div>
      </div>

      <div className="container-lentera py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Utama */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="card-glass p-8">
              <div className="flex flex-wrap gap-2 mb-5">
                <Badge varian={statusInfo.varian}>{statusInfo.label}</Badge>
                <Badge varian="terracotta">{labelKategori[beasiswa.jenis] || beasiswa.jenis}</Badge>
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
                    {beasiswa.nama_beasiswa}
                  </h1>
                  <p className="text-sm text-[var(--text-muted-on-light)]">
                    oleh {beasiswa.penyelenggara}
                  </p>
                </div>
              </div>

              <p className="leading-relaxed mb-6 text-[var(--text-on-light)]">
                {beasiswa.deskripsi_singkat || 'Informasi beasiswa ini disediakan resmi oleh penyelenggara untuk mendukung pendidikan tinggi mahasiswa Indonesia.'}
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-3">
                {beasiswa.link_resmi ? (
                  <a
                    href={beasiswa.link_resmi}
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
                      Daftar di Situs Resmi
                    </Tombol>
                  </a>
                ) : (
                  <Tombol
                    varian="sekunder"
                    ukuran="besar"
                    ikonKiri={<Globe size={16} />}
                    ikonKanan={<ArrowRight size={14} />}
                  >
                    Daftar Sekarang
                  </Tombol>
                )}
                <a href="#panel-draf-esai" id="tombol-draf-esai">
                  <Tombol varian="outline" ukuran="sedang" ikonKiri={<BookOpen size={15} />}>
                    Buat Draf Esai AI
                  </Tombol>
                </a>
              </div>
            </div>

            {/* Persyaratan */}
            <div className="card-glass p-8">
              <h2
                className="text-xl font-bold mb-5 flex items-center gap-2 text-[var(--text-on-light)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <AlertCircle size={20} style={{ color: 'var(--color-terracotta-500)' }} />
                Kriteria &amp; Persyaratan Pendaftaran
              </h2>
              <ul className="space-y-3">
                {kriteriaKhususList.map((syarat, i) => (
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
                Manfaat &amp; Fasilitas Beasiswa
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Bantuan Bantuan Biaya Pendidikan (UKT/SPP)',
                  'Uang Saku / Biaya Hidup Bulanan',
                  'Pelatihan Kepemimpinan & Soft Skills',
                  'Networking Komunitas Beasiswa Nasional',
                ].map((b, i) => (
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
                  { ikon: <Clock size={16} />, label: 'Tenggat Waktu', nilai: deadlineFormatted },
                  { ikon: <GraduationCap size={16} />, label: 'IPK Minimum', nilai: beasiswa.kriteria_ipk_min ? beasiswa.kriteria_ipk_min.toFixed(2) : '3.00' },
                  { ikon: <BookOpen size={16} />, label: 'Kriteria Jurusan', nilai: beasiswa.kriteria_jurusan || 'Semua Jurusan' },
                  { ikon: <Award size={16} />, label: 'Semester Min.', nilai: `Semester ${beasiswa.kriteria_semester_min || 1}` },
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

            {/* AI Draf Esai — Panel Fungsional */}
            <div id="panel-draf-esai">
              <PanelDrafEsaiAI
                beasiswaId={id}
                namaBeasiswa={beasiswa.nama_beasiswa}
                userId={userId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
