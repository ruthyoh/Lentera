'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Search, Award, Brain, Clock, GraduationCap, ArrowRight, Sparkles,
  AlertCircle, CheckCircle2, RefreshCw, UserCheck, Lock, ExternalLink,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Tombol from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';
import type { Beasiswa } from '@/types';

interface KomponenBeasiswaProps {
  daftarBeasiswaAwal: Beasiswa[];
}

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

const pilihanKategori = [
  { label: 'Semua Kategori', value: 'semua' },
  { label: 'Pemerintah', value: 'pemerintah' },
  { label: 'Swasta', value: 'swasta' },
  { label: 'Prestasi', value: 'prestasi' },
  { label: 'Kebutuhan', value: 'kebutuhan' },
  { label: 'Riset', value: 'riset' },
  { label: 'Internasional', value: 'internasional' },
];

export default function KomponenBeasiswa({ daftarBeasiswaAwal }: KomponenBeasiswaProps) {
  const seksiAIRef = useRef<HTMLDivElement>(null);

  const [kataKunci, setKataKunci] = useState('');
  const [kategoriDipilih, setKategoriDipilih] = useState('semua');
  const [ipkMin, setIpkMin] = useState<string>('');

  // State AI Matching
  const [sedangCocokkan, setSedangCocokkan] = useState(false);
  const [hasilAI, setHasilAI] = useState<{
    rekomendasi: string;
    profil_digunakan?: {
      jurusan?: string;
      semester?: number;
      ipk?: number;
      kategori_khusus?: string;
    };
    jumlah_beasiswa_diperiksa?: number;
  } | null>(null);
  const [errorAI, setErrorAI] = useState<string | null>(null);
  const [perluLogin, setPerluLogin] = useState(false);
  const [profilBelumLengkap, setProfilBelumLengkap] = useState(false);

  // Handler utama pencocokan AI
  async function handleMulaiPencocokanAI() {
    setErrorAI(null);
    setPerluLogin(false);
    setProfilBelumLengkap(false);
    setSedangCocokkan(true);

    // Scroll halus ke seksi AI
    if (seksiAIRef.current) {
      seksiAIRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setPerluLogin(true);
        setSedangCocokkan(false);
        return;
      }

      // Panggil API backend /api/ai/pencocokan-beasiswa
      const response = await fetch('/api/ai/pencocokan-beasiswa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });

      const json = await response.json();

      if (response.status === 401) {
        setPerluLogin(true);
      } else if (response.status === 422) {
        setProfilBelumLengkap(true);
        setErrorAI(json.error);
      } else if (!response.ok || !json.sukses) {
        setErrorAI(json.error || 'Terjadi kesalahan saat memproses pencocokan beasiswa.');
      } else {
        setHasilAI({
          rekomendasi: json.rekomendasi,
          profil_digunakan: json.profil_digunakan,
          jumlah_beasiswa_diperiksa: json.jumlah_beasiswa_diperiksa,
        });
      }
    } catch (err) {
      console.error('Error pencocokan AI:', err);
      setErrorAI('Terjadi kesalahan jaringan saat menghubungkan ke Asisten AI.');
    } finally {
      setSedangCocokkan(false);
    }
  }

  // Filter daftar beasiswa
  const beasiswaTersaring = daftarBeasiswaAwal.filter((b) => {
    const cocokKategori = kategoriDipilih === 'semua' || b.jenis === kategoriDipilih;
    const cocokKataKunci =
      !kataKunci ||
      b.nama_beasiswa.toLowerCase().includes(kataKunci.toLowerCase()) ||
      b.penyelenggara.toLowerCase().includes(kataKunci.toLowerCase());
    const cocokIPK = !ipkMin || (b.kriteria_ipk_min || 0) <= parseFloat(ipkMin);

    return cocokKategori && cocokKataKunci && cocokIPK;
  });

  return (
    <div className="min-h-screen pt-16" style={{ background: 'var(--color-cream-200)' }}>
      {/* Header Halaman Beasiswa */}
      <div
        className="py-14 relative overflow-hidden"
        style={{ background: 'var(--color-terracotta-600)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          aria-hidden="true"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
        <div className="container-lentera relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-2"
                style={{ color: 'var(--text-muted-on-dark)' }}
              >
                Modul Beasiswa
              </p>
              <h1
                className="text-3xl md:text-4xl font-bold mb-3 text-[var(--text-on-dark)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Jelajah Beasiswa
              </h1>
              <p className="text-sm text-[var(--text-muted-on-dark)]">
                Temukan beasiswa pendidikan terbaik dengan rekomendasi kecerdasan buatan.
              </p>
            </div>
            <Tombol
              varian="sekunder"
              ukuran="sedang"
              ikonKiri={<Brain size={16} />}
              onClick={handleMulaiPencocokanAI}
              className="bg-white! text-[var(--color-terracotta-700)]! hover:bg-[var(--color-cream-200)]! font-bold shadow-md"
              id="tombol-pencocokan-ai-header"
            >
              <Sparkles size={14} className="text-[var(--color-terracotta-500)]" />
              Pencocokan AI
            </Tombol>
          </div>
        </div>
      </div>

      <div className="container-lentera py-8 space-y-8">
        {/* Banner Asisten AI & Hasil Interactive Section */}
        <div
          ref={seksiAIRef}
          id="seksi-pencocokan-ai"
          className="rounded-[var(--radius-lg)] p-6 transition-all duration-300 shadow-md relative overflow-hidden"
          style={{
            background: 'var(--color-terracotta-50)',
            border: '1.5px solid var(--color-terracotta-300)',
          }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4 mb-4" style={{ borderColor: 'var(--color-terracotta-200)' }}>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--color-terracotta-500)' }}
              >
                <Brain size={24} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3
                    className="font-bold text-base text-[var(--color-terracotta-900)]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Asisten Pencocokan AI Beasiswa
                  </h3>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--color-terracotta-500)] text-white">
                    gemini-2.0-flash
                  </span>
                </div>
                <p className="text-xs text-[var(--color-terracotta-700)] mt-0.5">
                  AI menganalisis profil akademikmu dan mencocokkannya secara otomatis dengan database beasiswa Lentera.
                </p>
              </div>
            </div>

            <Tombol
              varian="sekunder"
              ukuran="sedang"
              sedangMemuat={sedangCocokkan}
              ikonKiri={<Sparkles size={15} />}
              onClick={handleMulaiPencocokanAI}
              className="bg-[var(--color-terracotta-600)]! text-white! hover:bg-[var(--color-terracotta-700)]! font-semibold flex-shrink-0"
              id="cta-coba-ai-beasiswa"
            >
              {sedangCocokkan ? 'Mencocokkan Beasiswa...' : hasilAI ? 'Cocokkan Ulang' : 'Coba Pencocokan AI'}
            </Tombol>
          </div>

          {/* Alert State: Perlu Login */}
          {perluLogin && (
            <div
              className="p-5 rounded-[var(--radius-md)] space-y-3"
              style={{
                background: 'white',
                border: '1px solid var(--color-gold-300)',
              }}
            >
              <div className="flex items-center gap-2.5 text-sm font-bold text-[var(--color-dark-800)]">
                <Lock size={18} className="text-[var(--color-gold-600)]" />
                Masuk ke Akun untuk Fitur Pencocokan AI
              </div>
              <p className="text-xs text-[var(--text-on-light)] leading-relaxed">
                Asisten AI memerlukan data jurusan, IPK, dan semester dari profil Anda untuk mencocokkan beasiswa yang paling relevan secara akurat.
              </p>
              <div className="pt-1 flex gap-3">
                <Link href="/login?dari=/beasiswa">
                  <Tombol varian="primer" ukuran="sedang" id="tombol-login-ai-beasiswa">
                    Masuk Sekarang
                  </Tombol>
                </Link>
                <Link href="/register?dari=/beasiswa">
                  <Tombol varian="outline" ukuran="sedang">
                    Daftar Gratis
                  </Tombol>
                </Link>
              </div>
            </div>
          )}

          {/* Alert State: Profil Belum Lengkap */}
          {profilBelumLengkap && (
            <div
              className="p-5 rounded-[var(--radius-md)] space-y-3"
              style={{
                background: 'white',
                border: '1px solid var(--color-gold-300)',
              }}
            >
              <div className="flex items-center gap-2.5 text-sm font-bold text-[var(--color-dark-800)]">
                <UserCheck size={18} className="text-[var(--color-gold-600)]" />
                Lengkapi Profil Akademik Anda
              </div>
              <p className="text-xs text-[var(--text-on-light)] leading-relaxed">
                {errorAI || 'Profil Anda belum lengkap. Silakan isi jurusan, semester, dan IPK di halaman profil.'}
              </p>
              <div className="pt-1">
                <Link href="/profil">
                  <Tombol varian="primer" ukuran="sedang" ikonKanan={<ArrowRight size={14} />}>
                    Lengkapi Profil Saya
                  </Tombol>
                </Link>
              </div>
            </div>
          )}

          {/* Alert State: General Error */}
          {errorAI && !perluLogin && !profilBelumLengkap && (
            <div
              className="p-4 rounded-[var(--radius-sm)] flex items-center gap-3 text-xs font-semibold text-red-700 bg-red-50 border border-red-200"
            >
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{errorAI}</span>
            </div>
          )}

          {/* Loading State Animation */}
          {sedangCocokkan && (
            <div className="p-8 text-center space-y-4 bg-white rounded-[var(--radius-md)] border border-[var(--color-terracotta-200)]">
              <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-600)] animate-bounce">
                <Brain size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-on-light)]" style={{ fontFamily: 'var(--font-display)' }}>
                  Sedang Menganalisis Profil & Mencocokkan Beasiswa...
                </p>
                <p className="text-xs text-[var(--text-muted-on-light)] mt-1">
                  Gemini AI sedang memeriksa syarat IPK, jurusan, dan tenggat waktu beasiswa untukmu.
                </p>
              </div>
            </div>
          )}

          {/* Hasil Rekomendasi AI */}
          {hasilAI && !sedangCocokkan && (
            <div className="space-y-4 bg-white p-6 rounded-[var(--radius-md)] border border-[var(--color-terracotta-300)] shadow-sm">
              {/* Header Hasil */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3" style={{ borderColor: 'var(--color-cream-300)' }}>
                <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-terracotta-800)]">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  Rekomendasi Beasiswa AI Personal
                </div>

                {hasilAI.profil_digunakan && (
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {hasilAI.profil_digunakan.jurusan && (
                      <Badge varian="cream">Jurusan: {hasilAI.profil_digunakan.jurusan}</Badge>
                    )}
                    {hasilAI.profil_digunakan.ipk && (
                      <Badge varian="gold">IPK: {hasilAI.profil_digunakan.ipk.toFixed(2)}</Badge>
                    )}
                    {hasilAI.profil_digunakan.semester && (
                      <Badge varian="terracotta">Semester {hasilAI.profil_digunakan.semester}</Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Teks Hasil Rekomendasi AI */}
              <div className="text-xs md:text-sm text-[var(--text-on-light)] leading-relaxed whitespace-pre-line bg-[var(--color-cream-100)] p-5 rounded-[var(--radius-sm)] border border-[var(--color-cream-300)]">
                {hasilAI.rekomendasi}
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--text-muted-on-light)] pt-1">
                <span>
                  Diperiksa dari <strong>{hasilAI.jumlah_beasiswa_diperiksa || 0}</strong> beasiswa aktif di database Lentera
                </span>
                <button
                  onClick={handleMulaiPencocokanAI}
                  className="flex items-center gap-1 font-semibold text-[var(--color-terracotta-600)] hover:underline"
                >
                  <RefreshCw size={12} />
                  Analisis Ulang
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Form Filter & Search */}
        <div className="card-glass p-5 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              id="cari-beasiswa"
              placeholder="Cari nama beasiswa atau penyelenggara..."
              ikonKiri={<Search size={16} />}
              value={kataKunci}
              onChange={(e) => setKataKunci(e.target.value)}
              aria-label="Cari beasiswa"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <select
              id="filter-kategori-beasiswa"
              value={kategoriDipilih}
              onChange={(e) => setKategoriDipilih(e.target.value)}
              className="px-4 py-3 rounded-[var(--radius-sm)] border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-500)] font-medium"
              style={{ borderColor: 'var(--color-cream-400)', color: 'var(--text-on-light)' }}
              aria-label="Filter jenis beasiswa"
            >
              {pilihanKategori.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>

            <select
              id="filter-ipk-minimum"
              value={ipkMin}
              onChange={(e) => setIpkMin(e.target.value)}
              className="px-4 py-3 rounded-[var(--radius-sm)] border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-500)] font-medium"
              style={{ borderColor: 'var(--color-cream-400)', color: 'var(--text-on-light)' }}
              aria-label="Filter IPK minimum"
            >
              <option value="">Semua IPK</option>
              <option value="2.5">IPK Min ≤ 2.50</option>
              <option value="3.0">IPK Min ≤ 3.00</option>
              <option value="3.25">IPK Min ≤ 3.25</option>
              <option value="3.5">IPK Min ≤ 3.50</option>
            </select>
          </div>
        </div>

        {/* Tab Kategori Quick Select */}
        <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Filter kategori beasiswa">
          {pilihanKategori.map((kat) => {
            const isAktif = kategoriDipilih === kat.value;
            return (
              <button
                key={kat.value}
                onClick={() => setKategoriDipilih(kat.value)}
                role="tab"
                aria-selected={isAktif}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200"
                style={
                  isAktif
                    ? { background: 'var(--color-terracotta-500)', color: 'white' }
                    : { background: 'white', color: 'var(--text-on-light)' }
                }
                id={`tab-beasiswa-${kat.value}`}
              >
                {kat.label}
              </button>
            );
          })}
        </div>

        {/* Grid Daftar Beasiswa */}
        {beasiswaTersaring.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
            aria-label="Daftar beasiswa"
          >
            {beasiswaTersaring.map((beasiswa) => {
              const statusConfig = labelStatus[beasiswa.status] || labelStatus.aktif;
              return (
                <div
                  key={beasiswa.id}
                  className="card-glass p-6 flex flex-col justify-between group hover:border-[var(--color-terracotta-400)] transition-all"
                  role="listitem"
                >
                  <div>
                    {/* Status & Kategori */}
                    <div className="flex items-center justify-between mb-3">
                      <Badge varian={statusConfig.varian}>{statusConfig.label}</Badge>
                      <Badge varian="terracotta">
                        {labelKategori[beasiswa.jenis] || beasiswa.jenis}
                      </Badge>
                    </div>

                    {/* Nama Beasiswa */}
                    <h2
                      className="font-bold text-base mb-1 line-clamp-2 transition-colors text-[var(--text-on-light)] group-hover:text-[var(--color-terracotta-600)]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {beasiswa.nama_beasiswa}
                    </h2>
                    <p className="text-xs mb-4 text-[var(--text-muted-on-light)] font-medium">
                      oleh {beasiswa.penyelenggara}
                    </p>

                    {/* Deskripsi */}
                    {beasiswa.deskripsi_singkat && (
                      <p className="text-xs text-[var(--text-on-light)] mb-4 line-clamp-2 leading-relaxed">
                        {beasiswa.deskripsi_singkat}
                      </p>
                    )}

                    {/* Info Syarat & Tenggat */}
                    <div className="space-y-2 mb-4 pt-3 border-t" style={{ borderColor: 'var(--color-cream-300)' }}>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted-on-light)]">
                        <GraduationCap size={13} className="text-[var(--color-terracotta-600)]" />
                        IPK Min: <strong>{beasiswa.kriteria_ipk_min ? beasiswa.kriteria_ipk_min.toFixed(2) : 'Tidak ada'}</strong>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted-on-light)]">
                        <Clock size={13} className="text-[var(--color-terracotta-600)]" />
                        Deadline: <strong>{beasiswa.deadline_pendaftaran || 'Secepatnya'}</strong>
                      </div>
                      {beasiswa.kriteria_jurusan && (
                        <div className="flex items-center gap-2 text-xs text-[var(--text-muted-on-light)]">
                          <Award size={13} className="text-[var(--color-terracotta-600)]" />
                          Jurusan: <strong>{beasiswa.kriteria_jurusan}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {beasiswa.link_resmi && (
                    <a
                      href={beasiswa.link_resmi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pt-2 border-t flex items-center justify-between text-xs font-bold text-[var(--color-terracotta-600)] hover:underline"
                      style={{ borderColor: 'var(--color-cream-300)' }}
                    >
                      <span>Detail & Pendaftaran Resmi</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card-glass p-12 text-center my-10 max-w-lg mx-auto space-y-3">
            <Award size={36} className="mx-auto text-[var(--text-muted-on-light)]" />
            <h3 className="text-base font-bold text-[var(--text-on-light)]">Tidak Ada Beasiswa Ditemukan</h3>
            <p className="text-xs text-[var(--text-muted-on-light)]">
              Tidak ada beasiswa yang sesuai dengan kata kunci atau filter yang Anda pilih.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
