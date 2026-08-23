'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User, Mail, GraduationCap, BookMarked, Calculator, Star,
  BookOpen, Award, Upload, Download, Heart, Settings, LogOut,
  Edit3, Calendar, TrendingUp, Brain, MessageSquare, HelpCircle, FileText,
  X, CheckCircle2, ShieldCheck, Sparkles, AlertCircle, Eye, ArrowRight,
  Plus, Check, ChevronRight, Layers, Trophy
} from 'lucide-react';

import Badge from '@/components/ui/Badge';
import Tombol from '@/components/ui/Button';
import { perbaruiProfil, type ProfileFormState } from '@/lib/actions/profil';
import { keluarAkun } from '@/lib/actions/auth';

export interface ProfilData {
  id: string;
  nama_lengkap: string;
  email: string;
  asal_institusi?: string | null;
  jurusan?: string | null;
  semester?: number | null;
  ipk?: number | null;
  kategori_khusus?: string | null;
  poin_kontribusi: number;
  created_at: string;
}

export interface MateriUserItem {
  id: string;
  judul: string;
  mata_kuliah: string;
  kategori: string;
  jumlah_unduhan: number;
  jumlah_suka: number;
  created_at: string;
}

export interface RiwayatAIItem {
  id: string;
  jenis: string;
  created_at: string;
  materi_id?: string | null;
}

interface Props {
  profil: ProfilData;
  jumlahMateri: number;
  totalUnduhan: number;
  totalSuka: number;
  peringkat: number | null;
  materiSaya: MateriUserItem[];
  riwayatAI: RiwayatAIItem[];
  hitungPerJenis: Record<string, number>;
}

const labelJenisAI: Record<string, string> = {
  ringkasan: 'Meringkas Materi',
  kuis: 'Latihan Kuis AI',
  tanya_jawab: 'Tanya Jawab AI',
  pencocokan_beasiswa: 'Pencocokan Beasiswa AI',
  draf_esai: 'Pembuat Draf Esai',
};

const ikonJenisAI: Record<string, React.ReactNode> = {
  ringkasan: <FileText size={16} className="text-cyan-400" />,
  kuis: <HelpCircle size={16} className="text-rose-400" />,
  tanya_jawab: <MessageSquare size={16} className="text-amber-400" />,
  pencocokan_beasiswa: <Award size={16} className="text-emerald-400" />,
  draf_esai: <Edit3 size={16} className="text-purple-400" />,
};

const labelKategoriMateri: Record<string, string> = {
  catatan: 'Catatan',
  rangkuman: 'Rangkuman',
  bank_soal: 'Bank Soal',
  modul: 'Modul',
  presentasi: 'Presentasi',
  lainnya: 'Lainnya',
};

export default function TampilanProfil({
  profil,
  jumlahMateri,
  totalUnduhan,
  totalSuka,
  peringkat,
  materiSaya,
  riwayatAI,
  hitungPerJenis,
}: Props) {
  const router = useRouter();
  const [tabAktif, setTabAktif] = useState<'ikhtisar' | 'materi' | 'riwayat' | 'pengaturan'>('ikhtisar');
  const [modalEditBuka, setModalEditBuka] = useState(false);
  const [filterJenisAI, setFilterJenisAI] = useState<string>('semua');
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<ProfileFormState>({});
  const [pesanSuksesModal, setPesanSuksesModal] = useState<string | null>(null);

  // Inisial Nama
  const inisial = profil.nama_lengkap
    .split(' ')
    .slice(0, 2)
    .map((k) => k[0])
    .join('')
    .toUpperCase();

  const bergabungSejak = new Date(profil.created_at).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

  // Hitung % Kelengkapan Profil
  const kelengkapanList = [
    { nama: 'Nama Lengkap', terisi: Boolean(profil.nama_lengkap) },
    { nama: 'Email Utama', terisi: Boolean(profil.email) },
    { nama: 'Jurusan / Program Studi', terisi: Boolean(profil.jurusan) },
    { nama: 'Semester', terisi: Boolean(profil.semester) },
    { nama: 'IPK Terkini', terisi: Boolean(profil.ipk) },
    { nama: 'Asal Institusi / Kampus', terisi: Boolean(profil.asal_institusi) },
  ];
  const terisiCount = kelengkapanList.filter((k) => k.terisi).length;
  const persenKelengkapan = Math.round((terisiCount / kelengkapanList.length) * 100);

  // Hitung Tingkat Level Kontributor
  const poin = profil.poin_kontribusi || 0;
  let levelTitle = 'Pelajar Pemula';
  let targetPoin = 50;
  let levelBadgeWarna = 'from-cyan-500 to-blue-600';

  if (poin >= 200) {
    levelTitle = 'Master Kontributor';
    targetPoin = 500;
    levelBadgeWarna = 'from-amber-400 to-yellow-600';
  } else if (poin >= 100) {
    levelTitle = 'Pionir Pembelajar';
    targetPoin = 200;
    levelBadgeWarna = 'from-purple-500 to-indigo-600';
  } else if (poin >= 30) {
    levelTitle = 'Kontributor Aktif';
    targetPoin = 100;
    levelBadgeWarna = 'from-emerald-500 to-teal-600';
  }
  const progressPoin = Math.min(100, Math.round((poin / targetPoin) * 100));

  // Lencana Pencapaian
  const lencanaPencapaian = [
    {
      id: 'profil_lengkap',
      judul: 'Profil Terverifikasi',
      deskripsi: 'Melengkapi data akademis profil',
      didapat: persenKelengkapan >= 80,
      ikon: <ShieldCheck size={20} className="text-emerald-400" />,
    },
    {
      id: 'penyedia_materi',
      judul: 'Penyedia Catatan',
      deskripsi: 'Mengunggah materi belajar pertama',
      didapat: jumlahMateri > 0,
      ikon: <Upload size={20} className="text-cyan-400" />,
    },
    {
      id: 'ai_explorer',
      judul: 'Pionir AI',
      deskripsi: 'Menggunakan fitur asisten AI',
      didapat: riwayatAI.length > 0,
      ikon: <Brain size={20} className="text-purple-400" />,
    },
    {
      id: 'bintang_kontribusi',
      judul: 'Bintang Komunitas',
      deskripsi: 'Meraih 30+ Poin Kontribusi',
      didapat: poin >= 30,
      ikon: <Star size={20} className="text-amber-400" />,
    },
  ];

  // Action simpan edit profil
  const handleSimpanProfil = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPesanSuksesModal(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await perbaruiProfil({}, formData);
      setFormState(res);

      if (res.sukses) {
        setPesanSuksesModal('Profil berhasil diperbarui!');
        setTimeout(() => {
          setModalEditBuka(false);
          setPesanSuksesModal(null);
          router.refresh();
        }, 1200);
      }
    });
  };

  // Filtered Riwayat AI
  const filteredRiwayatAI =
    filterJenisAI === 'semua'
      ? riwayatAI
      : riwayatAI.filter((r) => r.jenis === filterJenisAI);

  return (
    <div className="min-h-screen pt-16 pb-20 bg-[var(--color-mist-200)]">
      {/* =====================================================
          HERO PROFILE BANNER (Twilight Indigo Aesthetic)
          ===================================================== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0d24] via-[#12183b] to-[#1c224f] text-white border-b border-indigo-900/50">
        {/* Glow ambient background */}
        <div
          className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Grid Overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(103, 232, 249, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(103, 232, 249, 0.3) 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
          }}
        />

        <div className="container-lentera relative z-10 py-10 md:py-14">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
            {/* User Info Main */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {/* Avatar Box */}
              <div className="relative group">
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-2xl ring-4 ring-cyan-500/30 transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #1e1b4b 100%)',
                    color: '#ecfeff',
                  }}
                >
                  {inisial}
                </div>
                <div
                  className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md border border-white/20 flex items-center gap-1"
                >
                  <Sparkles size={10} />
                  Level {poin >= 200 ? '4' : poin >= 100 ? '3' : poin >= 30 ? '2' : '1'}
                </div>
              </div>

              {/* Identity Info */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-[var(--font-display)]">
                    {profil.nama_lengkap}
                  </h1>
                  {peringkat !== null && (
                    <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Trophy size={12} className="text-amber-400" />
                      Peringkat #{(peringkat || 0) + 1}
                    </span>
                  )}
                </div>

                <p className="text-indigo-200 text-sm font-medium flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                    <GraduationCap size={15} />
                    {profil.jurusan || 'Jurusan Belum Diisi'}
                  </span>
                  {profil.semester && (
                    <>
                      <span className="text-indigo-400">•</span>
                      <span>Semester {profil.semester}</span>
                    </>
                  )}
                  {profil.ipk && (
                    <>
                      <span className="text-indigo-400">•</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-950/80 text-cyan-300 font-mono text-xs border border-indigo-700/50">
                        IPK {Number(profil.ipk).toFixed(2)}
                      </span>
                    </>
                  )}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-indigo-300 pt-1">
                  <span className="flex items-center gap-1.5">
                    <BuildingIcon className="w-3.5 h-3.5 text-indigo-400" />
                    {profil.asal_institusi || 'Institusi Belum Diisi'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-indigo-400" />
                    Bergabung {bergabungSejak}
                  </span>
                </div>

                {/* Level Title Pill */}
                <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${levelBadgeWarna} text-white shadow-sm flex items-center gap-1.5`}>
                    <Award size={13} />
                    {levelTitle}
                  </span>
                  <span className="text-xs text-indigo-300 font-medium">
                    {poin} / {targetPoin} Poin Kontribusi
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => setModalEditBuka(true)}
                id="tombol-edit-profil-hero"
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md transition-all flex items-center gap-2 shadow-sm active:scale-95"
              >
                <Edit3 size={15} className="text-cyan-300" />
                Edit Profil
              </button>

              <Link
                href="/jelajah/unggah"
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95"
              >
                <Plus size={15} />
                Unggah Materi
              </Link>

              <form action={keluarAkun}>
                <button
                  type="submit"
                  id="tombol-keluar-hero"
                  className="p-2.5 rounded-xl text-indigo-300 hover:text-rose-300 bg-white/5 hover:bg-rose-500/10 border border-white/10 transition-all active:scale-95"
                  title="Keluar Akun"
                >
                  <LogOut size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Profile Completion Bar Banner */}
          {persenKelengkapan < 100 && (
            <div className="mt-8 p-4 rounded-xl bg-indigo-950/60 border border-cyan-500/20 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-cyan-200">
                    Kelengkapan Profil Akademis: {persenKelengkapan}%
                  </p>
                  <p className="text-[11px] text-indigo-300 mt-0.5">
                    Lengkapi data jurusan, semester, dan IPK kamu agar rekomendasi Beasiswa AI makin presisi!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-full sm:w-36 bg-indigo-900/80 rounded-full h-2.5 border border-indigo-700/50 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${persenKelengkapan}%` }}
                  />
                </div>
                <button
                  onClick={() => setModalEditBuka(true)}
                  className="text-xs font-bold text-cyan-300 hover:text-white shrink-0 flex items-center gap-1 underline underline-offset-2"
                >
                  Lengkapi <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT NAVIGATION TABS
          ===================================================== */}
      <div className="container-lentera py-8">
        {/* Navigation Bar Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-indigo-200/60 no-scrollbar">
          {[
            { id: 'ikhtisar', label: 'Ikhtisar & Statistik', ikon: <TrendingUp size={16} /> },
            { id: 'materi', label: `Materi Saya (${jumlahMateri})`, ikon: <BookOpen size={16} /> },
            { id: 'riwayat', label: `Riwayat AI (${riwayatAI.length})`, ikon: <Brain size={16} /> },
            { id: 'pengaturan', label: 'Detail & Akun', ikon: <User size={16} /> },
          ].map((tab) => {
            const aktif = tabAktif === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTabAktif(tab.id as typeof tabAktif)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  aktif
                    ? 'bg-gradient-to-r from-[#1e1b4b] to-[#2e2a72] text-white shadow-md shadow-indigo-900/20'
                    : 'bg-white/80 hover:bg-white text-[var(--color-ink-700)] hover:text-indigo-900 border border-indigo-100'
                }`}
              >
                <span className={aktif ? 'text-cyan-300' : 'text-indigo-500'}>
                  {tab.ikon}
                </span>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* =====================================================
            TAB 1: IKHTISAR & STATISTIK
            ===================================================== */}
        {tabAktif === 'ikhtisar' && (
          <div className="space-y-8 animate-fade-in-up">
            {/* 4 Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-glass p-5 flex flex-col justify-between border-indigo-100 hover:border-cyan-400 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Materi Diunggah
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload size={18} />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-[var(--color-ink-900)] font-[var(--font-display)]">
                    {jumlahMateri.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[11px] text-indigo-600 mt-1 flex items-center gap-1 font-medium">
                    <span className="text-cyan-600 font-bold">+10 Poin</span> / unggah
                  </p>
                </div>
              </div>

              <div className="card-glass p-5 flex flex-col justify-between border-indigo-100 hover:border-rose-400 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Total Suka
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart size={18} />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-[var(--color-ink-900)] font-[var(--font-display)]">
                    {totalSuka.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[11px] text-indigo-600 mt-1 font-medium">
                    Apresiasi pengguna lain
                  </p>
                </div>
              </div>

              <div className="card-glass p-5 flex flex-col justify-between border-indigo-100 hover:border-blue-400 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Total Unduhan
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Download size={18} />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-[var(--color-ink-900)] font-[var(--font-display)]">
                    {totalUnduhan.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[11px] text-indigo-600 mt-1 font-medium">
                    Materi kamu diakses
                  </p>
                </div>
              </div>

              <div className="card-glass p-5 flex flex-col justify-between border-indigo-100 hover:border-amber-400 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Poin Kontribusi
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Star size={18} fill="currentColor" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-[var(--color-ink-900)] font-[var(--font-display)]">
                    {poin.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[11px] text-amber-700 font-semibold mt-1">
                    Level: {levelTitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Layout Main Stats & Badges */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Level Progress & Badges */}
              <div className="lg:col-span-2 space-y-6">
                {/* Level & Rank Progress Card */}
                <div className="card-glass p-6 border-indigo-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base font-bold text-[var(--color-ink-900)] font-[var(--font-display)] flex items-center gap-2">
                        <Trophy size={18} className="text-amber-500" />
                        Tingkat Level Akademis
                      </h2>
                      <p className="text-xs text-indigo-600 mt-0.5">
                        Tingkatkan kontribusi kamu untuk meraih gelar bintang kampus berikutnya.
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
                      {progressPoin}% Tercapai
                    </span>
                  </div>

                  {/* Bar Progress */}
                  <div className="w-full bg-indigo-100 rounded-full h-3 mb-3 p-0.5 border border-indigo-200">
                    <div
                      className={`h-2.5 rounded-full bg-gradient-to-r ${levelBadgeWarna} transition-all duration-700 shadow-sm`}
                      style={{ width: `${progressPoin}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-indigo-700 font-medium">
                    <span>Target Berikutnya: {targetPoin} Poin</span>
                    <Link
                      href="/papan-peringkat"
                      className="text-cyan-700 hover:text-cyan-900 font-bold flex items-center gap-1 hover:underline"
                    >
                      Lihat Papan Peringkat <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* Achievement Badges Grid */}
                <div className="card-glass p-6 border-indigo-100">
                  <h2 className="text-base font-bold text-[var(--color-ink-900)] font-[var(--font-display)] mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-cyan-600" />
                    Lencana & Pencapaian
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {lencanaPencapaian.map((lencana) => (
                      <div
                        key={lencana.id}
                        className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                          lencana.didapat
                            ? 'bg-gradient-to-br from-indigo-950 to-[#181d45] border-cyan-500/40 text-white shadow-md'
                            : 'bg-indigo-50/50 border-indigo-100 text-indigo-400 opacity-60'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            lencana.didapat ? 'bg-cyan-500/20 border border-cyan-400/30' : 'bg-indigo-100'
                          }`}
                        >
                          {lencana.ikon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className={`text-xs font-bold ${lencana.didapat ? 'text-white' : 'text-indigo-700'}`}>
                              {lencana.judul}
                            </h3>
                            {lencana.didapat && (
                              <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                            )}
                          </div>
                          <p className={`text-[11px] mt-0.5 ${lencana.didapat ? 'text-indigo-200' : 'text-indigo-500'}`}>
                            {lencana.deskripsi}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Col: Quick Shortcuts & AI Summary */}
              <div className="space-y-6">
                {/* AI Feature Breakdown */}
                <div className="card-glass p-6 border-indigo-100">
                  <h3 className="text-sm font-bold text-[var(--color-ink-900)] font-[var(--font-display)] mb-4 flex items-center gap-2">
                    <Brain size={16} className="text-purple-600" />
                    Penggunaan Asisten AI
                  </h3>

                  <div className="space-y-3">
                    {Object.keys(labelJenisAI).map((jenis) => {
                      const count = hitungPerJenis[jenis] || 0;
                      return (
                        <div key={jenis} className="flex items-center justify-between text-xs py-1.5 border-b border-indigo-100/70 last:border-0">
                          <span className="text-indigo-800 font-medium flex items-center gap-2">
                            {ikonJenisAI[jenis]}
                            {labelJenisAI[jenis]}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-bold">
                            {count}×
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Shortcuts */}
                <div className="card-glass p-6 border-indigo-100">
                  <h3 className="text-sm font-bold text-[var(--color-ink-900)] font-[var(--font-display)] mb-3">
                    Pintasan Fitur
                  </h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Jelajah Materi Belajar', href: '/jelajah', ikon: <BookOpen size={15} /> },
                      { label: 'Pencocokan Beasiswa AI', href: '/beasiswa', ikon: <Award size={15} /> },
                      { label: 'Papan Peringkat Kampus', href: '/papan-peringkat', ikon: <TrendingUp size={15} /> },
                    ].map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold text-indigo-900 hover:bg-indigo-100/80 transition-all border border-indigo-100"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-cyan-600">{link.ikon}</span>
                          {link.label}
                        </span>
                        <ChevronRight size={14} className="text-indigo-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 2: MATERI SAYA
            ===================================================== */}
        {tabAktif === 'materi' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--color-ink-900)] font-[var(--font-display)]">
                  Materi Yang Kamu Unggah ({materiSaya.length})
                </h2>
                <p className="text-xs text-indigo-600 mt-0.5">
                  Daftar seluruh materi, catatan, dan bank soal yang telah kamu bagikan.
                </p>
              </div>

              <Link
                href="/jelajah/unggah"
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white shadow-md flex items-center gap-2 transition-all"
              >
                <Plus size={15} /> Unggah Materi Baru
              </Link>
            </div>

            {materiSaya.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {materiSaya.map((item) => (
                  <div
                    key={item.id}
                    className="card-glass p-5 border-indigo-100 hover:border-cyan-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-indigo-100 text-indigo-800 tracking-wider">
                          {labelKategoriMateri[item.kategori] || item.kategori}
                        </span>
                        <span className="text-[11px] text-indigo-500 font-medium">
                          {new Date(item.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[var(--color-ink-900)] line-clamp-2 mb-1.5 font-[var(--font-display)]">
                        {item.judul}
                      </h3>

                      <p className="text-xs text-indigo-600 font-medium mb-4">
                        📚 {item.mata_kuliah}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-indigo-100/80 flex items-center justify-between text-xs text-indigo-600">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Download size={13} className="text-cyan-600" />
                          {item.jumlah_unduhan}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={13} className="text-rose-500" />
                          {item.jumlah_suka}
                        </span>
                      </div>

                      <Link
                        href={`/materi/${item.id}`}
                        className="text-xs font-bold text-cyan-700 hover:text-cyan-900 flex items-center gap-1 hover:underline"
                      >
                        Lihat <Eye size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-glass p-12 text-center border-indigo-100 max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto mb-4">
                  <Upload size={28} />
                </div>
                <h3 className="text-base font-bold text-[var(--color-ink-900)] mb-1">
                  Belum ada materi diunggah
                </h3>
                <p className="text-xs text-indigo-600 mb-6">
                  Bagikan catatan kuliah atau rangkumanmu untuk membantu sesama mahasiswa dan dapatkan +10 poin kontribusi!
                </p>
                <Link
                  href="/jelajah/unggah"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md inline-flex items-center gap-2"
                >
                  <Plus size={15} /> Unggah Materi Pertama
                </Link>
              </div>
            )}
          </div>
        )}

        {/* =====================================================
            TAB 3: RIWAYAT AI
            ===================================================== */}
        {tabAktif === 'riwayat' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--color-ink-900)] font-[var(--font-display)] flex items-center gap-2">
                  <Brain size={20} className="text-purple-600" />
                  Riwayat Aktivitas Asisten AI
                </h2>
                <p className="text-xs text-indigo-600 mt-0.5">
                  Daftar sesi konsultasi, kuis, ringkasan, dan pembuatan esai AI yang pernah kamu lakukan.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap bg-white p-1 rounded-xl border border-indigo-100">
                <button
                  onClick={() => setFilterJenisAI('semua')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterJenisAI === 'semua'
                      ? 'bg-indigo-900 text-white'
                      : 'text-indigo-700 hover:bg-indigo-50'
                  }`}
                >
                  Semua ({riwayatAI.length})
                </button>
                {Object.keys(labelJenisAI).map((jenis) => (
                  <button
                    key={jenis}
                    onClick={() => setFilterJenisAI(jenis)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterJenisAI === jenis
                        ? 'bg-indigo-900 text-white'
                        : 'text-indigo-700 hover:bg-indigo-50'
                    }`}
                  >
                    {labelJenisAI[jenis]} ({hitungPerJenis[jenis] || 0})
                  </button>
                ))}
              </div>
            </div>

            {filteredRiwayatAI.length > 0 ? (
              <div className="card-glass p-6 border-indigo-100">
                <div className="divide-y divide-indigo-100/80">
                  {filteredRiwayatAI.map((item) => {
                    const tgl = new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                          {ikonJenisAI[item.jenis] || <Brain size={16} className="text-indigo-600" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-xs sm:text-sm font-bold text-[var(--color-ink-900)]">
                              {labelJenisAI[item.jenis] || item.jenis}
                            </h3>
                            <span className="text-[11px] text-indigo-500 font-medium">
                              {tgl}
                            </span>
                          </div>

                          <p className="text-xs text-indigo-600 mt-0.5">
                            Sesi interaksi AI berhasil disimpan di database akun kamu.
                          </p>

                          {item.materi_id && (
                            <Link
                              href={`/materi/${item.materi_id}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-cyan-700 hover:text-cyan-900 mt-2 hover:underline"
                            >
                              Lihat Terkait Materi <ChevronRight size={13} />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="card-glass p-12 text-center border-indigo-100 max-w-lg mx-auto">
                <Brain size={36} className="mx-auto mb-3 text-indigo-400" />
                <h3 className="text-base font-bold text-[var(--color-ink-900)] mb-1">
                  Tidak ada riwayat AI
                </h3>
                <p className="text-xs text-indigo-600 mb-5">
                  Kamu belum pernah mencoba fitur asisten AI pada kategori ini.
                </p>
                <Link
                  href="/beasiswa"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white shadow-md inline-block"
                >
                  Coba AI Beasiswa Now
                </Link>
              </div>
            )}
          </div>
        )}

        {/* =====================================================
            TAB 4: DETAIL AKUN & PENGATURAN
            ===================================================== */}
        {tabAktif === 'pengaturan' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Account Details Card */}
              <div className="lg:col-span-2 card-glass p-6 border-indigo-100 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-indigo-100">
                  <div>
                    <h2 className="text-base font-bold text-[var(--color-ink-900)] font-[var(--font-display)]">
                      Informasi Akun Akademis
                    </h2>
                    <p className="text-xs text-indigo-600 mt-0.5">
                      Data ini digunakan untuk verifikasi dan optimasi rekomendasi AI.
                    </p>
                  </div>

                  <button
                    onClick={() => setModalEditBuka(true)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-100 hover:bg-indigo-200 text-indigo-900 transition-all flex items-center gap-1.5"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100/80">
                    <span className="text-[11px] text-indigo-500 font-semibold uppercase tracking-wider block mb-1">
                      Nama Lengkap
                    </span>
                    <span className="text-sm font-bold text-[var(--color-ink-900)] flex items-center gap-2">
                      <User size={15} className="text-cyan-600" />
                      {profil.nama_lengkap}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100/80">
                    <span className="text-[11px] text-indigo-500 font-semibold uppercase tracking-wider block mb-1">
                      Alamat Email
                    </span>
                    <span className="text-sm font-bold text-[var(--color-ink-900)] flex items-center gap-2 truncate">
                      <Mail size={15} className="text-cyan-600 shrink-0" />
                      <span className="truncate">{profil.email}</span>
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100/80">
                    <span className="text-[11px] text-indigo-500 font-semibold uppercase tracking-wider block mb-1">
                      Program Studi / Jurusan
                    </span>
                    <span className="text-sm font-bold text-[var(--color-ink-900)] flex items-center gap-2">
                      <GraduationCap size={15} className="text-cyan-600" />
                      {profil.jurusan || 'Belum Diisi'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100/80">
                    <span className="text-[11px] text-indigo-500 font-semibold uppercase tracking-wider block mb-1">
                      Asal Institusi / Kampus
                    </span>
                    <span className="text-sm font-bold text-[var(--color-ink-900)] flex items-center gap-2">
                      <BuildingIcon className="w-4 h-4 text-cyan-600" />
                      {profil.asal_institusi || 'Belum Diisi'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100/80">
                    <span className="text-[11px] text-indigo-500 font-semibold uppercase tracking-wider block mb-1">
                      Semester Saat Ini
                    </span>
                    <span className="text-sm font-bold text-[var(--color-ink-900)] flex items-center gap-2">
                      <BookMarked size={15} className="text-cyan-600" />
                      {profil.semester ? `Semester ${profil.semester}` : 'Belum Diisi'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100/80">
                    <span className="text-[11px] text-indigo-500 font-semibold uppercase tracking-wider block mb-1">
                      Indeks Prestasi Kumulatif (IPK)
                    </span>
                    <span className="text-sm font-bold text-[var(--color-ink-900)] flex items-center gap-2">
                      <Calculator size={15} className="text-cyan-600" />
                      {profil.ipk ? Number(profil.ipk).toFixed(2) : 'Belum Diisi'}
                    </span>
                  </div>
                </div>

                {profil.kategori_khusus && (
                  <div className="p-4 rounded-xl bg-cyan-50/80 border border-cyan-200">
                    <span className="text-[11px] text-cyan-800 font-bold uppercase tracking-wider block mb-1">
                      Kategori Prioritas Akademis
                    </span>
                    <span className="text-sm font-bold text-cyan-900 flex items-center gap-2">
                      <Sparkles size={16} className="text-cyan-600" />
                      {profil.kategori_khusus}
                    </span>
                  </div>
                )}
              </div>

              {/* Account Security & Exit */}
              <div className="space-y-6">
                <div className="card-glass p-6 border-indigo-100 space-y-4">
                  <h3 className="text-sm font-bold text-[var(--color-ink-900)] font-[var(--font-display)]">
                    Keamanan & Akses Akun
                  </h3>
                  <p className="text-xs text-indigo-600">
                    Status autentikasi aktif menggunakan Supabase Auth yang terenkripsi.
                  </p>

                  <form action={keluarAkun} className="pt-2">
                    <button
                      type="submit"
                      id="tombol-keluar-pengaturan"
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut size={15} /> Keluar Dari Akun
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          MODAL DIALOG EDIT PROFIL
          ===================================================== */}
      {modalEditBuka && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in-up">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#0a0d24] to-[#1a1040] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 size={18} className="text-cyan-300" />
                <h3 className="text-base font-bold font-[var(--font-display)]">
                  Edit Profil Akademis
                </h3>
              </div>
              <button
                onClick={() => setModalEditBuka(false)}
                className="text-indigo-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSimpanProfil} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {pesanSuksesModal && (
                <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  {pesanSuksesModal}
                </div>
              )}

              {formState.error && (
                <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-600" />
                  {formState.error}
                </div>
              )}

              {/* Field: Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-indigo-900 mb-1">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama_lengkap"
                  defaultValue={profil.nama_lengkap}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-indigo-200 focus:border-cyan-500 text-xs text-indigo-950 font-medium focus:ring-2 focus:ring-cyan-500/20 outline-none"
                  placeholder="Masukkan nama lengkap kamu"
                />
                {formState.fieldErrors?.nama_lengkap && (
                  <p className="text-[11px] text-rose-600 mt-1 font-semibold">
                    {formState.fieldErrors.nama_lengkap}
                  </p>
                )}
              </div>

              {/* Field: Asal Institusi */}
              <div>
                <label className="block text-xs font-bold text-indigo-900 mb-1">
                  Asal Institusi / Universiats
                </label>
                <input
                  type="text"
                  name="asal_institusi"
                  defaultValue={profil.asal_institusi || ''}
                  className="w-full px-3.5 py-2 rounded-xl border border-indigo-200 focus:border-cyan-500 text-xs text-indigo-950 font-medium focus:ring-2 focus:ring-cyan-500/20 outline-none"
                  placeholder="Contoh: Universitas Indonesia"
                />
              </div>

              {/* Field: Jurusan */}
              <div>
                <label className="block text-xs font-bold text-indigo-900 mb-1">
                  Jurusan / Program Studi
                </label>
                <input
                  type="text"
                  name="jurusan"
                  defaultValue={profil.jurusan || ''}
                  className="w-full px-3.5 py-2 rounded-xl border border-indigo-200 focus:border-cyan-500 text-xs text-indigo-950 font-medium focus:ring-2 focus:ring-cyan-500/20 outline-none"
                  placeholder="Contoh: Teknik Informatika"
                />
              </div>

              {/* Field Grid: Semester & IPK */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-indigo-900 mb-1">
                    Semester
                  </label>
                  <select
                    name="semester"
                    defaultValue={profil.semester ? String(profil.semester) : ''}
                    className="w-full px-3.5 py-2 rounded-xl border border-indigo-200 focus:border-cyan-500 text-xs text-indigo-950 font-medium focus:ring-2 focus:ring-cyan-500/20 outline-none bg-white"
                  >
                    <option value="">Pilih Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-indigo-900 mb-1">
                    IPK Terkini (0.00 - 4.00)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    name="ipk"
                    defaultValue={profil.ipk ? String(profil.ipk) : ''}
                    className="w-full px-3.5 py-2 rounded-xl border border-indigo-200 focus:border-cyan-500 text-xs text-indigo-950 font-medium focus:ring-2 focus:ring-cyan-500/20 outline-none"
                    placeholder="Contoh: 3.85"
                  />
                </div>
              </div>

              {/* Field: Kategori Khusus */}
              <div>
                <label className="block text-xs font-bold text-indigo-900 mb-1">
                  Kategori Prioritas / Kriteria Beasiswa
                </label>
                <select
                  name="kategori_khusus"
                  defaultValue={profil.kategori_khusus || ''}
                  className="w-full px-3.5 py-2 rounded-xl border border-indigo-200 focus:border-cyan-500 text-xs text-indigo-950 font-medium focus:ring-2 focus:ring-cyan-500/20 outline-none bg-white"
                >
                  <option value="">Umum (Tanpa Kategori Khusus)</option>
                  <option value="Daerah 3T (Terdepan, Terluar, Tertinggal)">Daerah 3T</option>
                  <option value="Mahasiswa Disabilitas">Disabilitas</option>
                  <option value="Keluarga Kurang Mampu (KIP-K)">Kurang Mampu / KIP-K</option>
                  <option value="Prestasi Akademik / Non-Akademik">Prestasi Unggulan</option>
                </select>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-indigo-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalEditBuka(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}
