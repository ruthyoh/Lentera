import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  User, Mail, GraduationCap, BookMarked, Calculator, Star,
  BookOpen, Award, Upload, Download, Heart, Settings, LogOut,
  Edit3, Calendar, TrendingUp, Brain, MessageSquare, HelpCircle, FileText,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Tombol from '@/components/ui/Button';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { keluarAkun } from '@/lib/actions/auth';

export const metadata: Metadata = {
  title: 'Profil Saya',
  description: 'Lihat dan kelola profil akun Lentera Anda.',
};

const ikonJenisAI: Record<string, React.ReactNode> = {
  ringkasan: <FileText size={14} className="text-[var(--color-gold-600)]" />,
  kuis: <HelpCircle size={14} className="text-[var(--color-terracotta-500)]" />,
  tanya_jawab: <MessageSquare size={14} className="text-[var(--color-gold-600)]" />,
  pencocokan_beasiswa: <Award size={14} className="text-[var(--color-terracotta-500)]" />,
  draf_esai: <Edit3 size={14} className="text-[var(--color-gold-600)]" />,
};

const labelJenisAI: Record<string, string> = {
  ringkasan: 'Meringkas materi',
  kuis: 'Membuat kuis latihan',
  tanya_jawab: 'Tanya jawab materi',
  pencocokan_beasiswa: 'Pencocokan beasiswa AI',
  draf_esai: 'Membuat draf esai',
};

export default async function HalamanProfil() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login?dari=/profil');
  }

  const admin = createAdminClient();

  // Ambil profil lengkap user
  const { data: profil } = await admin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Hitung jumlah materi yang diunggah
  const { count: jumlahMateri } = await admin
    .from('materi')
    .select('*', { count: 'exact', head: true })
    .eq('uploader_id', user.id);

  // Hitung total unduhan dari materi milik user
  const { data: materiUser } = await admin
    .from('materi')
    .select('jumlah_unduhan, jumlah_suka')
    .eq('uploader_id', user.id);

  const totalUnduhan = materiUser?.reduce((acc, m) => acc + (m.jumlah_unduhan || 0), 0) || 0;
  const totalSuka = materiUser?.reduce((acc, m) => acc + (m.jumlah_suka || 0), 0) || 0;

  // Ambil riwayat interaksi AI terbaru (12 item)
  const { data: riwayatAI } = await admin
    .from('interaksi_ai')
    .select('id, jenis, created_at, materi_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(12);

  // Hitung per-jenis interaksi AI
  const hitungPerJenis: Record<string, number> = {};
  riwayatAI?.forEach((item) => {
    hitungPerJenis[item.jenis] = (hitungPerJenis[item.jenis] || 0) + 1;
  });

  // Hitung peringkat user (berdasarkan poin_kontribusi)
  const { count: peringkat } = await admin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gt('poin_kontribusi', profil?.poin_kontribusi || 0);

  const namaLengkap = profil?.nama_lengkap || user.user_metadata?.nama_lengkap || user.email?.split('@')[0] || 'Pengguna';
  const inisial = namaLengkap.split(' ').slice(0, 2).map((k: string) => k[0]).join('').toUpperCase();
  const bergabungSejak = new Date(user.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  const ikonAktivitasAI: Record<string, React.ReactNode> = {
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
              {inisial}
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
                <h1
                  className="text-2xl md:text-3xl font-bold"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)' }}
                >
                  {namaLengkap}
                </h1>
                {(peringkat !== null && peringkat !== undefined) && (
                  <Badge varian="aktif" className="text-xs">Peringkat #{(peringkat || 0) + 1}</Badge>
                )}
              </div>
              <p className="text-sm mb-3" style={{ color: 'var(--text-muted-on-dark)' }}>
                {profil?.jurusan || 'Belum diisi'}
                {profil?.semester ? ` · Semester ${profil.semester}` : ''}
                {profil?.ipk ? ` · IPK ${Number(profil.ipk).toFixed(2)}` : ''}
              </p>
              <div className="flex items-center gap-4 justify-center md:justify-start text-xs" style={{ color: 'var(--text-muted-on-dark)' }}>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  Bergabung sejak {bergabungSejak}
                </span>
                <span className="flex items-center gap-1">
                  <Star size={12} className="text-[var(--color-gold-400)]" fill="currentColor" />
                  {(profil?.poin_kontribusi || 0).toLocaleString('id-ID')} poin
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
              <form action={keluarAkun}>
                <Tombol
                  type="submit"
                  varian="hantu"
                  ukuran="sedang"
                  ikonKiri={<LogOut size={14} />}
                  className="text-[var(--text-on-dark)]! border border-white/20! hover:bg-white/10!"
                  id="tombol-keluar-header"
                >
                  Keluar
                </Tombol>
              </form>
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
                  { label: 'Materi Diunggah', angka: jumlahMateri || 0, ikon: <Upload size={18} />, warna: 'gold' },
                  { label: 'Total Suka', angka: totalSuka, ikon: <Heart size={18} />, warna: 'terracotta' },
                  { label: 'Total Unduhan', angka: totalUnduhan, ikon: <Download size={18} />, warna: 'gold' },
                  { label: 'Sesi AI', angka: riwayatAI?.length || 0, ikon: <Brain size={18} />, warna: 'terracotta' },
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

            {/* Riwayat Interaksi AI */}
            <div className="card-glass p-6">
              <div className="flex items-center justify-between mb-5">
                <h2
                  className="font-bold text-base"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-light)' }}
                >
                  Riwayat Interaksi AI
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(hitungPerJenis).map(([jenis, count]) => (
                    <span
                      key={jenis}
                      className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{ background: 'var(--color-gold-100)', color: 'var(--color-gold-800)' }}
                    >
                      {labelJenisAI[jenis] || jenis}: {count}×
                    </span>
                  ))}
                </div>
              </div>

              {riwayatAI && riwayatAI.length > 0 ? (
                <div className="space-y-0">
                  {riwayatAI.slice(0, 8).map((item) => {
                    const waktuFormatted = new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    });
                    return (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 py-3.5 border-b last:border-b-0"
                        style={{ borderColor: 'var(--color-cream-300)' }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: 'var(--color-gold-50)' }}
                          aria-hidden="true"
                        >
                          {ikonJenisAI[item.jenis] || <Brain size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm" style={{ color: 'var(--text-on-light)' }}>
                            <span className="font-semibold">{labelJenisAI[item.jenis] || item.jenis}</span>
                            {item.materi_id && (
                              <Link
                                href={`/materi/${item.materi_id}`}
                                className="text-[var(--color-gold-600)] hover:underline ml-1 text-xs"
                              >
                                → lihat materi
                              </Link>
                            )}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted-on-light)' }}>
                            {waktuFormatted}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Brain size={32} className="mx-auto mb-3 text-[var(--text-muted-on-light)]" />
                  <p className="text-sm text-[var(--text-muted-on-light)]">
                    Belum ada riwayat interaksi AI.
                  </p>
                  <Link href="/jelajah" className="text-xs text-[var(--color-gold-600)] hover:underline mt-1 block">
                    Coba Asisten Belajar AI →
                  </Link>
                </div>
              )}
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
                  { ikon: <Mail size={15} />, label: 'Email', nilai: user.email || '-' },
                  { ikon: <GraduationCap size={15} />, label: 'Jurusan', nilai: profil?.jurusan || 'Belum diisi' },
                  { ikon: <BookMarked size={15} />, label: 'Semester', nilai: profil?.semester ? `Semester ${profil.semester}` : 'Belum diisi' },
                  { ikon: <Calculator size={15} />, label: 'IPK', nilai: profil?.ipk ? Number(profil.ipk).toFixed(2) : 'Belum diisi' },
                  { ikon: <Settings size={15} />, label: 'Institusi', nilai: profil?.asal_institusi || 'Belum diisi' },
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
                  { label: 'Jelajah Materi', href: '/jelajah', ikon: <BookOpen size={15} /> },
                  { label: 'Jelajah Beasiswa', href: '/beasiswa', ikon: <Award size={15} /> },
                  { label: 'Unggah Materi Baru', href: '/jelajah/unggah', ikon: <Upload size={15} /> },
                  { label: 'Papan Peringkat', href: '/papan-peringkat', ikon: <TrendingUp size={15} /> },
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
            <form action={keluarAkun}>
              <Tombol
                type="submit"
                varian="bahaya"
                ukuran="sedang"
                lebarPenuh
                ikonKiri={<LogOut size={15} />}
                className="opacity-80 hover:opacity-100"
                id="tombol-keluar"
              >
                Keluar dari Akun
              </Tombol>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
