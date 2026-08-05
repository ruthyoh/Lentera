import type { Metadata } from 'next';
import Link from 'next/link';
import {
  User, Mail, GraduationCap, BookMarked, Calculator, Star,
  BookOpen, Award, Upload, Download, Heart, Settings, LogOut,
  Edit3, Calendar, TrendingUp,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Tombol from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Profil Saya',
  description: 'Lihat dan kelola profil akun Lentera Anda.',
};

export default function HalamanProfil() {
  const profil = {
    nama: 'Ahmad Rizky Pratama',
    email: 'ahmad.rizky@email.com',
    jurusan: 'Teknik Informatika',
    semester: 5,
    ipk: 3.72,
    poin: 12450,
    peringkat: 1,
    bergabungSejak: 'Januari 2026',
    statistik: {
      materiDiunggah: 87,
      materiDisukai: 234,
      totalUnduhan: 15420,
      beasiswaDilamar: 12,
    },
  };

  const aktivitasTerbaru = [
    { aksi: 'Mengunggah materi', judul: 'Catatan Kalkulus 1 — Bab 12', waktu: '2 jam lalu', tipe: 'unggah' },
    { aksi: 'Mendapat suka', judul: 'Bank Soal Fisika Dasar', waktu: '5 jam lalu', tipe: 'suka' },
    { aksi: 'Mengunduh materi', judul: 'Rangkuman Algoritma', waktu: '1 hari lalu', tipe: 'unduh' },
    { aksi: 'Melamar beasiswa', judul: 'Beasiswa Unggulan 2026', waktu: '3 hari lalu', tipe: 'beasiswa' },
    { aksi: 'Mengunggah materi', judul: 'Modul Pemrograman Web', waktu: '1 minggu lalu', tipe: 'unggah' },
  ];

  const ikonAktivitas: Record<string, React.ReactNode> = {
    unggah: <Upload size={14} style={{ color: 'var(--color-gold-600)' }} />,
    suka: <Heart size={14} style={{ color: 'var(--color-terracotta-500)' }} />,
    unduh: <Download size={14} style={{ color: 'var(--color-gold-600)' }} />,
    beasiswa: <Award size={14} style={{ color: 'var(--color-terracotta-500)' }} />,
  };

  return (
    <div className="min-h-screen pt-16" style={{ background: 'var(--color-cream-200)' }}>
      {/* Header profil */}
      <div
        className="py-14 relative overflow-hidden"
        style={{ background: 'var(--color-dark-800)' }}
      >
        <div className="absolute inset-0 opacity-5" aria-hidden="true" style={{
          backgroundImage: `linear-gradient(rgba(201,151,30,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,151,30,0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        <div className="container-lentera relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg ring-4 ring-white/20"
              style={{ background: 'var(--color-gold-100)', color: 'var(--color-dark-900)' }}
              aria-hidden="true"
            >
              AR
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
                <h1
                  className="text-2xl md:text-3xl font-bold"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)' }}
                >
                  {profil.nama}
                </h1>
                <Badge varian="aktif" className="text-xs">Peringkat #{profil.peringkat}</Badge>
              </div>
              <p className="text-sm mb-3" style={{ color: 'var(--text-muted-on-dark)' }}>
                {profil.jurusan} · Semester {profil.semester} · IPK {profil.ipk.toFixed(2)}
              </p>
              <div className="flex items-center gap-4 justify-center md:justify-start text-xs" style={{ color: 'var(--text-muted-on-dark)' }}>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  Bergabung sejak {profil.bergabungSejak}
                </span>
                <span className="flex items-center gap-1">
                  <Star size={12} className="text-[var(--color-gold-400)]" fill="currentColor" />
                  {profil.poin.toLocaleString('id-ID')} poin
                </span>
              </div>
            </div>

            {/* Tombol aksi */}
            <div className="flex gap-2">
              <Tombol
                varian="hantu"
                ukuran="sedang"
                ikonKiri={<Edit3 size={14} />}
                className="text-[var(--text-on-dark)]! border border-white/20! hover:bg-white/10!"
                id="tombol-edit-profil"
              >
                Edit Profil
              </Tombol>
              <Tombol
                varian="hantu"
                ukuran="sedang"
                ikonKiri={<Settings size={14} />}
                className="text-[var(--text-on-dark)]! border border-white/20! hover:bg-white/10!"
                id="tombol-pengaturan"
              >
                Pengaturan
              </Tombol>
            </div>
          </div>
        </div>
      </div>

      <div className="container-lentera py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Utama */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistik Kontribusi */}
            <div className="card-glass p-6">
              <h2
                className="font-bold text-base mb-5"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-light)' }}
              >
                Statistik Kontribusi
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Materi Diunggah', angka: profil.statistik.materiDiunggah, ikon: <Upload size={18} />, warna: 'gold' },
                  { label: 'Disukai', angka: profil.statistik.materiDisukai, ikon: <Heart size={18} />, warna: 'terracotta' },
                  { label: 'Total Unduhan', angka: profil.statistik.totalUnduhan, ikon: <Download size={18} />, warna: 'gold' },
                  { label: 'Beasiswa Dilamar', angka: profil.statistik.beasiswaDilamar, ikon: <Award size={18} />, warna: 'terracotta' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-4 rounded-[var(--radius-md)] text-center"
                    style={{ background: stat.warna === 'gold' ? 'var(--color-gold-50)' : 'var(--color-terracotta-50)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
                      style={{
                        background: stat.warna === 'gold' ? 'var(--color-gold-100)' : 'var(--color-terracotta-100)',
                        color: stat.warna === 'gold' ? 'var(--color-gold-700)' : 'var(--color-terracotta-600)',
                      }}
                      aria-hidden="true"
                    >
                      {stat.ikon}
                    </div>
                    <p
                      className="text-xl font-bold mb-0.5"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: stat.warna === 'gold' ? 'var(--color-gold-700)' : 'var(--color-terracotta-600)',
                      }}
                    >
                      {stat.angka.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted-on-light)' }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Aktivitas Terbaru */}
            <div className="card-glass p-6">
              <div className="flex items-center justify-between mb-5">
                <h2
                  className="font-bold text-base"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-light)' }}
                >
                  Aktivitas Terbaru
                </h2>
                <Link
                  href="/profil/aktivitas"
                  className="text-xs font-semibold flex items-center gap-1 transition-colors hover:underline text-[var(--color-gold-600)]"
                >
                  Lihat semua
                  <TrendingUp size={12} />
                </Link>
              </div>
              <div className="space-y-0">
                {aktivitasTerbaru.map((aktivitas, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 py-3.5 border-b last:border-b-0"
                    style={{ borderColor: 'var(--color-cream-300)' }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: aktivitas.tipe === 'beasiswa' || aktivitas.tipe === 'suka' ? 'var(--color-terracotta-50)' : 'var(--color-gold-50)' }}
                      aria-hidden="true"
                    >
                      {ikonAktivitas[aktivitas.tipe]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm" style={{ color: 'var(--text-on-light)' }}>
                        <span className="font-semibold">{aktivitas.aksi}</span>
                        {' — '}
                        <span className="truncate">{aktivitas.judul}</span>
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted-on-light)' }}>
                        {aktivitas.waktu}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Akun */}
            <div className="card-glass p-6">
              <h3
                className="font-bold mb-4"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-light)' }}
              >
                Informasi Akun
              </h3>
              <div className="space-y-4">
                {[
                  { ikon: <Mail size={15} />, label: 'Email', nilai: profil.email },
                  { ikon: <GraduationCap size={15} />, label: 'Jurusan', nilai: profil.jurusan },
                  { ikon: <BookMarked size={15} />, label: 'Semester', nilai: `Semester ${profil.semester}` },
                  { ikon: <Calculator size={15} />, label: 'IPK', nilai: profil.ipk.toFixed(2) },
                ].map((info) => (
                  <div key={info.label} className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--color-cream-300)', color: 'var(--text-muted-on-light)' }}
                    >
                      {info.ikon}
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted-on-light)' }}>
                        {info.label}
                      </p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-on-light)' }}>
                        {info.nilai}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="card-glass p-6">
              <h3
                className="font-bold mb-4"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-light)' }}
              >
                Pintasan
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Materi Saya', href: '/profil/materi', ikon: <BookOpen size={15} /> },
                  { label: 'Beasiswa Tersimpan', href: '/profil/beasiswa', ikon: <Award size={15} /> },
                  { label: 'Riwayat Unduhan', href: '/profil/unduhan', ikon: <Download size={15} /> },
                  { label: 'Pengaturan Akun', href: '/profil/pengaturan', ikon: <Settings size={15} /> },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm transition-all hover:bg-[var(--color-cream-300)]"
                    style={{ color: 'var(--text-on-light)' }}
                  >
                    <span style={{ color: 'var(--color-gold-600)' }}>{link.ikon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Tombol Keluar */}
            <Tombol
              varian="bahaya"
              ukuran="sedang"
              lebarPenuh
              ikonKiri={<LogOut size={15} />}
              className="opacity-80 hover:opacity-100"
              id="tombol-keluar"
            >
              Keluar dari Akun
            </Tombol>
          </div>
        </div>
      </div>
    </div>
  );
}
