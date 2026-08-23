'use client';

import { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Lock,
  CheckCircle,
  Clock,
  GraduationCap,
  Award,
  BookOpen,
  Compass,
  Star,
  Target,
  Sliders,
  Check,
  Briefcase,
  HelpCircle,
  PenTool,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface PanelPencocokanAIProps {
  /** ID user Supabase (null jika belum login) */
  userId: string | null;
}

type Status = 'idle' | 'kuesioner' | 'memuat' | 'sukses' | 'error' | 'unauthenticated';

interface KartuBeasiswaRekomendasi {
  peringkat: number;
  nama: string;
  penyelenggara: string;
  alasan: string;
  skorPersen: number;
}

interface JawabanKuesioner {
  jurusan: string;
  semester: string;
  ipk: string;
  minat: string[];
  bakat_prestasi: string[];
  kebutuhan_prioritas: string;
  catatan_khusus: string;
}

const daftarPilihanMinat = [
  { id: 'tech', label: 'Teknologi, Coding & AI', ikon: '💻' },
  { id: 'sains', label: 'Riset, Sains & Lab', ikon: '🔬' },
  { id: 'seni', label: 'Seni, Desain & Media Kreatif', ikon: '🎨' },
  { id: 'organisasi', label: 'Kepemimpinan & Organisasi', ikon: '🏛️' },
  { id: 'sosial', label: 'Pengabdian Masyarakat & Social Work', ikon: '🤝' },
  { id: 'bisnis', label: 'Bisnis & Entrepreneurship', ikon: '💼' },
  { id: 'olahraga', label: 'Olahraga & Kesehatan', ikon: '⚽' },
  { id: 'internasional', label: 'Studi Luar Negeri & Bahasa', ikon: '🌐' },
];

const daftarPilihanBakat = [
  { id: 'juara', label: 'Juara Lomba / Kompetisi', ikon: '🏆' },
  { id: 'pengurus', label: 'Pengurus Himpunan / BEM / UKM', ikon: '👥' },
  { id: 'karya', label: 'Publikasi Karya / Jurnal Riset', ikon: '📄' },
  { id: 'volunteer', label: 'Relawan / Volunteer Project', ikon: '🙋' },
  { id: 'magang', label: 'Pengalaman Magang / Kerja', ikon: '💼' },
  { id: 'pemula', label: 'Mahasiswa Baru / Belum Ada Pengalaman', ikon: '🌱' },
];

const daftarPilihanKebutuhan = [
  { id: 'penuh', label: 'Beasiswa Penuh (Full Coverage - UKT + Uang Saku)', ikon: '💰', deskripsi: 'Menutup seluruh biaya kuliah dan biaya hidup bulanan' },
  { id: 'ukt', label: 'Bantuan UKT / Biaya Pendidikan (Parsial)', ikon: '🎓', deskripsi: 'Membantu pemotongan atau subsidi biaya SPP/UKT' },
  { id: 'prestasi', label: 'Beasiswa Prestasi Akademik & Talenta', ikon: '🌟', deskripsi: 'Penghargaan apresiasi atas IPK tinggi atau bakat khusus' },
  { id: 'riset', label: 'Hibah Riset / Tugas Akhir / Skripsi', ikon: '🔬', deskripsi: 'Pendanaan pembuatan skripsi, tugas akhir, atau penelitian' },
  { id: 'exchange', label: 'Pertukaran Pelajar / Study Abroad', ikon: '✈️', deskripsi: 'Program student exchange atau summer school ke luar negeri' },
];

/**
 * Parse teks rekomendasi AI → array kartu beasiswa terurut.
 */
function parseTeksRekomendasi(teks: string): KartuBeasiswaRekomendasi[] {
  const blok = teks
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  const kartu: KartuBeasiswaRekomendasi[] = [];

  blok.forEach((blok) => {
    const matchJudul = blok.match(/^(\d+)\.\s+\*?\*?([^*\n(]+)\*?\*?\s*(?:\(([^)]+)\))?/);
    if (!matchJudul) return;

    const peringkat = parseInt(matchJudul[1]);
    const nama = matchJudul[2].replace(/\*+/g, '').trim();
    const penyelenggara = (matchJudul[3] || '').trim();

    const barisAlasan = blok.match(/[Aa]lasan[:\s]+([\s\S]+)/);
    const alasan = barisAlasan
      ? barisAlasan[1].trim().split('\n')[0].substring(0, 250)
      : 'Beasiswa ini sangat sesuai dengan kombinasi kriteria akademik, minat bidang, dan prioritas kebutuhan Anda.';

    const skor = Math.max(98 - (peringkat - 1) * 8, 65);

    kartu.push({ peringkat, nama, penyelenggara, alasan, skorPersen: skor });
  });

  if (kartu.length === 0 && teks.length > 10) {
    kartu.push({
      peringkat: 1,
      nama: 'Rekomendasi AI Personal',
      penyelenggara: 'Lentera AI',
      alasan: teks.substring(0, 300),
      skorPersen: 88,
    });
  }

  return kartu.slice(0, 5);
}

function warnaPeringkat(i: number): { bg: string; text: string; border: string } {
  const palet = [
    { bg: 'rgba(168, 85, 247, 0.2)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.4)' },
    { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.4)' },
    { bg: 'rgba(34, 211, 238, 0.2)', text: '#38bdf8', border: 'rgba(34, 211, 238, 0.4)' },
    { bg: 'rgba(244, 63, 94, 0.2)', text: '#fb7185', border: 'rgba(244, 63, 94, 0.4)' },
    { bg: 'rgba(52, 211, 153, 0.2)', text: '#34d399', border: 'rgba(52, 211, 153, 0.4)' },
  ];
  return palet[i] || palet[4];
}

export default function PanelPencocokanAI({ userId }: PanelPencocokanAIProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [langkahKuesioner, setLangkahKuesioner] = useState<number>(1);
  const [kartu, setKartu] = useState<KartuBeasiswaRekomendasi[]>([]);
  const [pesanError, setPesanError] = useState('');
  const [jumlahDiperiksa, setJumlahDiperiksa] = useState(0);

  // State kuesioner interaktif
  const [jawaban, setJawaban] = useState<JawabanKuesioner>({
    jurusan: '',
    semester: '4',
    ipk: '3.50',
    minat: ['Teknologi, Coding & AI'],
    bakat_prestasi: ['Pengurus Himpunan / BEM / UKM'],
    kebutuhan_prioritas: 'Beasiswa Penuh (Full Coverage - UKT + Uang Saku)',
    catatan_khusus: '',
  });

  const [profilLoaded, setProfilLoaded] = useState(false);

  // Ambil profil awal dari Supabase bila user login
  useEffect(() => {
    if (!userId || profilLoaded) return;
    async function muatProfil() {
      try {
        const supabase = createClient();
        const { data: profil } = await supabase
          .from('profiles')
          .select('jurusan, semester, ipk')
          .eq('id', userId)
          .single();

        if (profil) {
          setJawaban((prev) => ({
            ...prev,
            jurusan: profil.jurusan || prev.jurusan,
            semester: profil.semester ? String(profil.semester) : prev.semester,
            ipk: profil.ipk ? String(profil.ipk) : prev.ipk,
          }));
        }
      } catch (err) {
        console.warn('Gagal memuat profil awal:', err);
      } finally {
        setProfilLoaded(true);
      }
    }
    muatProfil();
  }, [userId, profilLoaded]);

  function bukaKuesioner() {
    if (!userId) {
      setStatus('unauthenticated');
      return;
    }
    setLangkahKuesioner(1);
    setStatus('kuesioner');
  }

  function toggleMinat(label: string) {
    setJawaban((prev) => {
      const ada = prev.minat.includes(label);
      const minatBaru = ada
        ? prev.minat.filter((item) => item !== label)
        : [...prev.minat, label];
      return { ...prev, minat: minatBaru };
    });
  }

  function toggleBakat(label: string) {
    setJawaban((prev) => {
      const ada = prev.bakat_prestasi.includes(label);
      const bakatBaru = ada
        ? prev.bakat_prestasi.filter((item) => item !== label)
        : [...prev.bakat_prestasi, label];
      return { ...prev, bakat_prestasi: bakatBaru };
    });
  }

  async function handleSubmitPencocokan() {
    if (!userId) {
      setStatus('unauthenticated');
      return;
    }

    setStatus('memuat');
    setKartu([]);
    setPesanError('');

    try {
      const res = await fetch('/api/ai/pencocokan-beasiswa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          jawaban_tambahan: {
            jurusan: jawaban.jurusan,
            semester: parseInt(jawaban.semester, 10) || 1,
            ipk: parseFloat(jawaban.ipk) || 0,
            minat: jawaban.minat,
            bakat_prestasi: jawaban.bakat_prestasi,
            kebutuhan_prioritas: jawaban.kebutuhan_prioritas,
            catatan_khusus: jawaban.catatan_khusus,
          },
        }),
      });

      const json = await res.json();

      if (res.status === 401) {
        setStatus('unauthenticated');
        return;
      }

      if (res.status === 422) {
        setPesanError(json.error || 'Harap lengkapi data kuesioner Anda.');
        setStatus('error');
        return;
      }

      if (!res.ok || !json.sukses) {
        setPesanError(json.error || 'Gagal memuat rekomendasi AI.');
        setStatus('error');
        return;
      }

      const hasilKartu = parseTeksRekomendasi(json.rekomendasi);
      setKartu(hasilKartu);
      setJumlahDiperiksa(json.jumlah_beasiswa_diperiksa || 0);
      setStatus('sukses');
    } catch {
      setPesanError('Gagal terhubung ke server. Periksa koneksi internet Anda.');
      setStatus('error');
    }
  }

  return (
    <div className="w-full">
      {/* ─── STATE: IDLE — Banner Interaktif AI ─── */}
      {status === 'idle' && (
        <div
          className="rounded-2xl p-6 relative overflow-hidden border backdrop-blur-md transition-all duration-300 hover:border-purple-400/50"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
            borderColor: 'rgba(168, 85, 247, 0.3)',
            boxShadow: '0 0 30px rgba(168, 85, 247, 0.15)',
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                  boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
                }}
              >
                <Brain size={28} className="text-white" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-1.5 border" style={{ background: 'rgba(168,85,247,0.2)', borderColor: 'rgba(168,85,247,0.4)', color: '#c084fc' }}>
                  <Sparkles size={12} />
                  Pencocokan Cerdas Terbimbing
                </div>
                <h3 className="font-extrabold text-lg text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  Asisten Pencocokan AI Beasiswa
                </h3>
                <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed mt-1">
                  Jawab beberapa pertanyaan singkat mengenai <strong className="text-purple-300">jurusan, minat bidang, bakat/prestasi,</strong> dan <strong className="text-purple-300">kebutuhan pendanaanmu</strong>. Gemini AI akan menganalisis dan mencocokkan beasiswa yang paling pas untukmu.
                </p>
              </div>
            </div>

            <button
              onClick={bukaKuesioner}
              className="group flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 cursor-pointer shrink-0 shadow-lg text-white"
              style={{ background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', boxShadow: '0 0 25px rgba(168, 85, 247, 0.4)' }}
              id="tombol-mulai-kuesioner-ai"
            >
              <Sliders size={16} />
              <span>Mulai Kuesioner AI</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* ─── STATE: KUESIONER INTERAKTIF (STEP BY STEP) ─── */}
      {status === 'kuesioner' && (
        <div
          className="rounded-2xl p-6 sm:p-8 border backdrop-blur-md space-y-6 relative overflow-hidden"
          style={{
            background: 'rgba(21, 13, 46, 0.85)',
            borderColor: 'rgba(168, 85, 247, 0.35)',
            boxShadow: '0 0 35px rgba(168, 85, 247, 0.2)',
          }}
        >
          {/* Header Wizard & Progress Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-purple-500/20">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest">
                <Compass size={14} />
                Langkah {langkahKuesioner} dari 3
              </div>
              <h3 className="text-xl font-extrabold text-white mt-1" style={{ fontFamily: 'var(--font-display)' }}>
                {langkahKuesioner === 1 && '🎓 1. Data Akademik Mahasiswa'}
                {langkahKuesioner === 2 && '🌟 2. Minat, Bakat & Pengalaman'}
                {langkahKuesioner === 3 && '🎯 3. Target Beasiswa & Catatan'}
              </h3>
            </div>

            <button
              onClick={() => setStatus('idle')}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/10"
            >
              Tutup
            </button>
          </div>

          {/* Progress Indicator Line */}
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 transition-all duration-500 rounded-full"
              style={{ width: `${(langkahKuesioner / 3) * 100}%` }}
            />
          </div>

          {/* ── STEP 1: AKADEMIK ── */}
          {langkahKuesioner === 1 && (
            <div className="space-y-5 animate-fade-in">
              <p className="text-xs text-slate-300">
                Konfirmasi data akademik utama Anda. Nilai ini akan dicocokkan dengan kriteria IPK minimum & jurusan penyelenggara beasiswa.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Jurusan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-purple-400" />
                    Jurusan / Program Studi
                  </label>
                  <input
                    type="text"
                    value={jawaban.jurusan}
                    onChange={(e) => setJawaban({ ...jawaban, jurusan: e.target.value })}
                    placeholder="Contoh: Teknik Informatika, Manajemen"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)' }}
                  />
                </div>

                {/* Semester */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Clock size={14} className="text-purple-400" />
                    Semester Saat Ini
                  </label>
                  <select
                    value={jawaban.semester}
                    onChange={(e) => setJawaban({ ...jawaban, semester: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                    style={{ background: '#1a1040', borderColor: 'rgba(255,255,255,0.15)' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={String(s)}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* IPK */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Award size={14} className="text-purple-400" />
                    IPK Kumulatif (0.00 - 4.00)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.00"
                    value={jawaban.ipk}
                    onChange={(e) => setJawaban({ ...jawaban, ipk: e.target.value })}
                    placeholder="3.50"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: MINAT & BAKAT ── */}
          {langkahKuesioner === 2 && (
            <div className="space-y-6 animate-fade-in">
              {/* Pilihan Minat */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2 block flex items-center gap-1.5">
                  <Star size={14} />
                  Pilih Minat Bidang &amp; Passion Anda (Bisa Pilih Banyak):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {daftarPilihanMinat.map((m) => {
                    const dipilih = jawaban.minat.includes(m.label);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleMinat(m.label)}
                        className="p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer"
                        style={{
                          background: dipilih ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.05)',
                          borderColor: dipilih ? '#c084fc' : 'rgba(255,255,255,0.1)',
                          color: dipilih ? '#fff' : '#cbd5e1',
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <span>{m.ikon}</span>
                          <span>{m.label}</span>
                        </span>
                        {dipilih && <Check size={14} className="text-purple-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pilihan Bakat & Prestasi */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2 block flex items-center gap-1.5">
                  <Award size={14} />
                  Bakat, Prestasi &amp; Pengalaman Utama (Bisa Pilih Banyak):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {daftarPilihanBakat.map((b) => {
                    const dipilih = jawaban.bakat_prestasi.includes(b.label);
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => toggleBakat(b.label)}
                        className="p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer"
                        style={{
                          background: dipilih ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)',
                          borderColor: dipilih ? '#818cf8' : 'rgba(255,255,255,0.1)',
                          color: dipilih ? '#fff' : '#cbd5e1',
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <span>{b.ikon}</span>
                          <span>{b.label}</span>
                        </span>
                        {dipilih && <Check size={14} className="text-indigo-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: KEBUTUHAN & CATATAN ── */}
          {langkahKuesioner === 3 && (
            <div className="space-y-6 animate-fade-in">
              {/* Pilihan Kebutuhan Prioritas */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2 block flex items-center gap-1.5">
                  <Target size={14} />
                  Prioritas Jenis Beasiswa yang Paling Dicari:
                </label>
                <div className="space-y-2.5">
                  {daftarPilihanKebutuhan.map((k) => {
                    const dipilih = jawaban.kebutuhan_prioritas === k.label;
                    return (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => setJawaban({ ...jawaban, kebutuhan_prioritas: k.label })}
                        className="w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer"
                        style={{
                          background: dipilih ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.05)',
                          borderColor: dipilih ? '#c084fc' : 'rgba(255,255,255,0.1)',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{k.ikon}</span>
                          <div>
                            <p className="text-xs font-bold text-white">{k.label}</p>
                            <p className="text-[11px] text-slate-400">{k.deskripsi}</p>
                          </div>
                        </div>
                        {dipilih && <Check size={16} className="text-purple-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Catatan Khusus */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <PenTool size={14} className="text-purple-400" />
                  Catatan Khusus atau Keinginan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={jawaban.catatan_khusus}
                  onChange={(e) => setJawaban({ ...jawaban, catatan_khusus: e.target.value })}
                  placeholder="Misal: Ingin beasiswa dari instansi pemerintah / BUMN, tanpa ikatan dinas..."
                  className="w-full px-4 py-2.5 rounded-xl border text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)' }}
                />
              </div>
            </div>
          )}

          {/* Tombol Navigasi Wizard */}
          <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
            {langkahKuesioner > 1 ? (
              <button
                type="button"
                onClick={() => setLangkahKuesioner(langkahKuesioner - 1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors border border-white/10"
              >
                <ArrowLeft size={14} />
                Kembali
              </button>
            ) : <div />}

            {langkahKuesioner < 3 ? (
              <button
                type="button"
                onClick={() => setLangkahKuesioner(langkahKuesioner + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)' }}
              >
                Lanjut ke Langkah {langkahKuesioner + 1}
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitPencocokan}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold text-white transition-all hover:scale-105 cursor-pointer shadow-lg"
                style={{ background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', boxShadow: '0 0 25px rgba(168, 85, 247, 0.4)' }}
                id="tombol-kirim-kuesioner-ai"
              >
                <Sparkles size={16} />
                Analisis &amp; Cocokkan dengan AI
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── STATE: MEMUAT — Dynamic Loading Screen ─── */}
      {status === 'memuat' && (
        <div
          className="rounded-2xl p-8 text-center border backdrop-blur-md space-y-5"
          style={{ background: 'rgba(21, 13, 46, 0.85)', borderColor: 'rgba(168, 85, 247, 0.35)' }}
          aria-live="polite"
          aria-busy="true"
        >
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-purple-400">
              <Brain size={28} />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Gemini AI Sedang Menganalisis Profil &amp; Jawabanmu...
            </h4>
            <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
              Memeriksa syarat IPK, jurusan, minat ({jawaban.minat.slice(0, 2).join(', ')}), serta target beasiswa yang kamu pilih.
            </p>
          </div>
          <div className="flex justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping delay-100" />
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping delay-200" />
          </div>
        </div>
      )}

      {/* ─── STATE: ERROR ─── */}
      {status === 'error' && (
        <div
          className="rounded-2xl p-6 border backdrop-blur-md space-y-4"
          style={{ background: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-white">Belum Dapat Memberikan Rekomendasi</p>
              <p className="text-xs text-slate-300 mt-1">{pesanError}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={bukaKuesioner}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors"
            >
              Ulangi Kuesioner
            </button>
            <button
              onClick={() => setStatus('idle')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 border border-white/10 hover:text-white"
            >
              Kembali
            </button>
          </div>
        </div>
      )}

      {/* ─── STATE: UNAUTHENTICATED ─── */}
      {status === 'unauthenticated' && (
        <div
          className="rounded-2xl p-8 text-center space-y-4 border backdrop-blur-md"
          style={{ background: 'rgba(168, 85, 247, 0.12)', borderColor: 'rgba(168, 85, 247, 0.3)' }}
        >
          <Lock size={32} className="mx-auto text-purple-400" />
          <div>
            <h4 className="font-bold text-base text-white">Masuk untuk Menggunakan Fitur AI</h4>
            <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
              Silakan masuk ke akun Lentera Anda untuk memulai kuesioner interaktif dan mendapatkan rekomendasi beasiswa presisi.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <a
              href="/login?dari=/beasiswa"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors"
            >
              Masuk Sekarang
            </a>
            <a
              href="/register?dari=/beasiswa"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-purple-300 border border-purple-500/40 hover:bg-purple-500/20 transition-colors"
            >
              Daftar Akun
            </a>
          </div>
        </div>
      )}

      {/* ─── STATE: SUKSES — Kartu Rekomendasi Hasil AI ─── */}
      {status === 'sukses' && kartu.length > 0 && (
        <div className="space-y-5 animate-fade-in">
          {/* Header Ringkasan Kuesioner Hasil AI */}
          <div
            className="rounded-2xl p-5 border backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            style={{ background: 'rgba(168, 85, 247, 0.15)', borderColor: 'rgba(168, 85, 247, 0.35)' }}
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-500/20 border border-purple-500/30 mb-1">
                <CheckCircle size={12} className="text-emerald-400" />
                Hasil Analisis Gemini AI Personal
              </div>
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                ✨ {kartu.length} Beasiswa Paling Cocok Untukmu
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Berdasarkan Jurusan <strong className="text-white">{jawaban.jurusan || 'Anda'}</strong> (IPK {jawaban.ipk}), Minat ({jawaban.minat.join(', ') || 'Umum'}), &amp; Target ({jawaban.kebutuhan_prioritas}).
              </p>
            </div>

            <button
              onClick={bukaKuesioner}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-purple-300 bg-purple-500/20 border border-purple-500/40 hover:bg-purple-500/30 transition-all shrink-0 cursor-pointer"
            >
              <Sliders size={14} />
              Ubah Kuesioner / Analisis Ulang
            </button>
          </div>

          {/* Grid Kartu Beasiswa Rekomendasi */}
          <div className="space-y-4">
            {kartu.map((item, i) => {
              const warna = warnaPeringkat(i);
              return (
                <div
                  key={i}
                  className="rounded-2xl p-5 border backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderColor: warna.border,
                    boxShadow: `0 0 20px ${warna.bg}`,
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0 border"
                        style={{ background: warna.bg, color: warna.text, borderColor: warna.border }}
                      >
                        #{item.peringkat}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base text-white" style={{ fontFamily: 'var(--font-display)' }}>
                          {item.nama}
                        </h4>
                        {item.penyelenggara && (
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">
                            Oleh {item.penyelenggara}
                          </p>
                        )}
                      </div>
                    </div>

                    <div
                      className="px-3 py-1.5 rounded-xl border text-center shrink-0 self-start sm:self-auto"
                      style={{ background: warna.bg, borderColor: warna.border }}
                    >
                      <span className="text-base font-extrabold block leading-none" style={{ color: warna.text }}>
                        {item.skorPersen}%
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: warna.text }}>
                        Kecocokan AI
                      </span>
                    </div>
                  </div>

                  {/* Penjelasan Alasan Kecocokan AI */}
                  <div className="p-3.5 rounded-xl border space-y-1" style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-300">
                      <Brain size={13} />
                      Alasan &amp; Relevansi AI:
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.alasan}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
