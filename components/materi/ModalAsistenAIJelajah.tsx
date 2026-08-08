'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Brain, Sparkles, X, FileText, HelpCircle, MessageSquare, Send, CheckCircle2,
  XCircle, ArrowLeft, RefreshCw, AlertCircle, RotateCcw, Lock, ExternalLink
} from 'lucide-react';
import Tombol from '@/components/ui/Button';

interface ItemMateri {
  id: string;
  judul: string;
  mata_kuliah: string;
}

interface ModalAsistenAIJelajahProps {
  daftarMateri: ItemMateri[];
}

interface SoalKuis {
  soal: string;
  opsi: [string, string, string, string];
  jawaban_benar: number;
}

interface RiwayatQNA {
  q: string;
  a: string;
}

type ModeAksi = 'pilih' | 'ringkasan' | 'kuis' | 'tanya_jawab';

export default function ModalAsistenAIJelajah({ daftarMateri }: ModalAsistenAIJelajahProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [terbuka, setTerbuka] = useState(false);
  const [materiDipilihId, setMateriDipilihId] = useState<string>(daftarMateri[0]?.id || '');
  const [mode, setMode] = useState<ModeAksi>('pilih');
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [errorPesan, setErrorPesan] = useState<string | null>(null);
  const [perluLogin, setPerluLogin] = useState(false);

  // State Hasil AI
  const [ringkasanTeks, setRingkasanTeks] = useState<string | null>(null);
  const [daftarKuis, setDaftarKuis] = useState<SoalKuis[]>([]);
  const [indeksSoal, setIndeksSoal] = useState(0);
  const [jawabanUser, setJawabanUser] = useState<Record<number, number>>({});
  const [kuisSelesai, setKuisSelesai] = useState(false);
  const [pertanyaan, setPertanyaan] = useState('');
  const [riwayatQNA, setRiwayatQNA] = useState<RiwayatQNA[]>([]);

  // Buka modal jika query parameter ?fitur=ai
  useEffect(() => {
    const fitur = searchParams.get('fitur');
    if (fitur === 'ai') {
      setTerbuka(true);
    }
  }, [searchParams]);

  // Handle klik tombol pemicu dari luar modal via custom event / ID
  useEffect(() => {
    function handleBukaModal() {
      setTerbuka(true);
    }
    const tombol = document.getElementById('tombol-asisten-ai');
    if (tombol) {
      tombol.addEventListener('click', (e) => {
        e.preventDefault();
        setTerbuka(true);
      });
    }
    return () => {
      if (tombol) {
        tombol.removeEventListener('click', handleBukaModal);
      }
    };
  }, []);

  const materiSaatIni = daftarMateri.find((m) => m.id === materiDipilihId) || daftarMateri[0];

  // Reset state hasil saat materi ganti
  function handleGantiMateri(id: string) {
    setMateriDipilihId(id);
    setRingkasanTeks(null);
    setDaftarKuis([]);
    setRiwayatQNA([]);
    setMode('pilih');
    setErrorPesan(null);
  }

  function handleTutupModal() {
    setTerbuka(false);
    // Hapus param ?fitur=ai jika ada
    if (searchParams.get('fitur') === 'ai') {
      router.replace('/jelajah', { scroll: false });
    }
  }

  // ─── Aksi 1: Meringkas ────────────────────────────────────────────────
  async function handleRingkas() {
    if (!materiDipilihId) return;
    setMode('ringkasan');
    setErrorPesan(null);
    setPerluLogin(false);

    if (ringkasanTeks) return;

    setSedangMemuat(true);
    try {
      const res = await fetch('/api/ai/ringkasan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materi_id: materiDipilihId }),
      });
      const json = await res.json();

      if (res.status === 401) {
        setPerluLogin(true);
      } else if (!res.ok || !json.sukses) {
        setErrorPesan(json.error || 'Gagal meringkas materi.');
      } else {
        setRingkasanTeks(json.ringkasan);
      }
    } catch (err) {
      console.error(err);
      setErrorPesan('Gagal meringkas materi. Coba lagi nanti.');
    } finally {
      setSedangMemuat(false);
    }
  }

  // ─── Aksi 2: Membuat Kuis ─────────────────────────────────────────────
  async function handleMulaiKuis() {
    if (!materiDipilihId) return;
    setMode('kuis');
    setErrorPesan(null);
    setPerluLogin(false);
    setIndeksSoal(0);
    setJawabanUser({});
    setKuisSelesai(false);

    if (daftarKuis.length > 0) return;

    setSedangMemuat(true);
    try {
      const res = await fetch('/api/ai/kuis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materi_id: materiDipilihId }),
      });
      const json = await res.json();

      if (res.status === 401) {
        setPerluLogin(true);
      } else if (!res.ok || !json.sukses) {
        setErrorPesan(json.error || 'Gagal membuat kuis latihan.');
      } else {
        setDaftarKuis(json.kuis || []);
      }
    } catch (err) {
      console.error(err);
      setErrorPesan('Gagal membuat kuis latihan.');
    } finally {
      setSedangMemuat(false);
    }
  }

  // ─── Aksi 3: Tanya Jawab ──────────────────────────────────────────────
  async function handleKirimPertanyaan(e: React.FormEvent) {
    e.preventDefault();
    if (!pertanyaan.trim() || !materiDipilihId || sedangMemuat) return;

    const q = pertanyaan.trim();
    setPertanyaan('');
    setErrorPesan(null);
    setSedangMemuat(true);

    try {
      const res = await fetch('/api/ai/tanya-jawab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materi_id: materiDipilihId, pertanyaan: q }),
      });
      const json = await res.json();

      if (res.status === 401) {
        setPerluLogin(true);
      } else if (!res.ok || !json.sukses) {
        setErrorPesan(json.error || 'Gagal memproses pertanyaan.');
      } else {
        setRiwayatQNA((prev) => [...prev, { q, a: json.jawaban }]);
      }
    } catch (err) {
      console.error(err);
      setErrorPesan('Gagal memproses pertanyaan.');
    } finally {
      setSedangMemuat(false);
    }
  }

  // Skor kuis
  const totalSoal = daftarKuis.length;
  const totalBenar = Object.entries(jawabanUser).reduce((acc, [idx, ans]) => {
    return daftarKuis[Number(idx)]?.jawaban_benar === ans ? acc + 1 : acc;
  }, 0);

  if (!terbuka) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl rounded-2xl text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ background: 'var(--color-dark-800)', border: '1px solid rgba(201,151,30,0.3)' }}
      >
        {/* Header Modal */}
        <div className="p-5 flex items-center justify-between border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[var(--color-gold-500)] text-[var(--color-dark-900)]">
              <Brain size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Asisten Belajar AI Lentera
              </h2>
              <p className="text-xs text-[var(--text-muted-on-dark)]">
                Analisis substansi, kuis pemahaman, dan tanya jawab materi perkuliahan
              </p>
            </div>
          </div>
          <button
            onClick={handleTutupModal}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup Modal AI"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Pilih Materi Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--color-gold-400)] block">
              Pilih Berkas Materi Belajar:
            </label>
            <select
              value={materiDipilihId}
              onChange={(e) => handleGantiMateri(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg text-xs bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[var(--color-gold-500)]"
            >
              {daftarMateri.map((m) => (
                <option key={m.id} value={m.id} className="bg-[var(--color-dark-900)] text-white">
                  {m.judul} ({m.mata_kuliah})
                </option>
              ))}
            </select>
          </div>

          {/* Alert Login */}
          {perluLogin && (
            <div className="p-4 rounded-lg bg-amber-950/80 border border-amber-500/40 space-y-2 text-xs text-amber-200">
              <p className="font-bold flex items-center gap-1.5">
                <Lock size={14} /> Memerlukan Autentikasi Mahasiswa
              </p>
              <p className="text-amber-100/90">
                Silakan masuk terlebih dahulu untuk menggunakan Asisten Belajar AI.
              </p>
              <Link href={`/login?dari=/jelajah?fitur=ai`}>
                <Tombol varian="primer" ukuran="kecil" className="mt-1">
                  Masuk ke Akun
                </Tombol>
              </Link>
            </div>
          )}

          {/* Alert Error */}
          {errorPesan && !perluLogin && (
            <div className="p-3.5 rounded-lg bg-red-950/80 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0 text-red-400" />
              <span>{errorPesan}</span>
            </div>
          )}

          {/* Navigasi Sub-Mode */}
          {mode !== 'pilih' && (
            <button
              onClick={() => setMode('pilih')}
              className="text-xs text-[var(--color-gold-400)] flex items-center gap-1 hover:underline"
            >
              <ArrowLeft size={13} /> Kembali ke Menu Fitur AI
            </button>
          )}

          {/* =============================================================== */}
          {/* MODE MENU PILIH FITUR */}
          {/* =============================================================== */}
          {mode === 'pilih' && (
            <div className="space-y-3 pt-1">
              <button
                onClick={handleRingkas}
                className="w-full text-left p-4 rounded-xl transition-all border group flex items-center justify-between hover:bg-white/10"
                style={{ background: 'rgba(201,151,30,0.12)', borderColor: 'rgba(201,151,30,0.3)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[var(--color-gold-500)]/20 text-[var(--color-gold-400)]">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[var(--color-gold-400)] transition-colors">
                      💡 Ringkas Materi dalam 5 Poin
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted-on-dark)] mt-0.5">
                      Ekstrak konsep inti, rumus, dan definisi utama dari berkas ini
                    </p>
                  </div>
                </div>
                <Sparkles size={16} className="text-[var(--color-gold-400)] opacity-70 group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={handleMulaiKuis}
                className="w-full text-left p-4 rounded-xl transition-all border group flex items-center justify-between hover:bg-white/10"
                style={{ background: 'rgba(201,151,30,0.12)', borderColor: 'rgba(201,151,30,0.3)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[var(--color-gold-500)]/20 text-[var(--color-gold-400)]">
                    <HelpCircle size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[var(--color-gold-400)] transition-colors">
                      ❓ Buat 5 Kuis Latihan Pemahaman
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted-on-dark)] mt-0.5">
                      Uji pemahaman konsep dengan kuis interaktif A/B/C/D
                    </p>
                  </div>
                </div>
                <Sparkles size={16} className="text-[var(--color-gold-400)] opacity-70 group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={() => setMode('tanya_jawab')}
                className="w-full text-left p-4 rounded-xl transition-all border group flex items-center justify-between hover:bg-white/10"
                style={{ background: 'rgba(201,151,30,0.12)', borderColor: 'rgba(201,151,30,0.3)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[var(--color-gold-500)]/20 text-[var(--color-gold-400)]">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[var(--color-gold-400)] transition-colors">
                      💬 Tanya Jawab Akademik seputar Materi
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted-on-dark)] mt-0.5">
                      Ajukan pertanyaan spesifik dari teks berkas yang dipilih
                    </p>
                  </div>
                </div>
                <Sparkles size={16} className="text-[var(--color-gold-400)] opacity-70 group-hover:scale-110 transition-transform" />
              </button>

              {materiSaatIni && (
                <div className="pt-2 text-right">
                  <Link
                    href={`/materi/${materiSaatIni.id}`}
                    onClick={handleTutupModal}
                    className="text-xs text-[var(--color-gold-400)] hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    Buka Halaman Detail Materi <ExternalLink size={12} />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* =============================================================== */}
          {/* MODE RINGKASAN */}
          {/* =============================================================== */}
          {mode === 'ringkasan' && (
            <div className="space-y-3">
              {sedangMemuat ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-9 h-9 rounded-full border-2 border-[var(--color-gold-400)] border-t-transparent animate-spin mx-auto" />
                  <p className="text-xs text-[var(--text-muted-on-dark)]">
                    Sedang meringkas isi materi...
                  </p>
                </div>
              ) : ringkasanTeks ? (
                <div className="space-y-3">
                  <div className="text-xs text-white/90 leading-relaxed whitespace-pre-line bg-black/40 p-4 rounded-xl border border-white/10 max-h-96 overflow-y-auto">
                    {ringkasanTeks}
                  </div>
                  <button
                    onClick={handleRingkas}
                    className="text-xs flex items-center gap-1 text-[var(--color-gold-400)] hover:underline pt-1"
                  >
                    <RefreshCw size={12} /> Ringkas Ulang
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {/* =============================================================== */}
          {/* MODE KUIS */}
          {/* =============================================================== */}
          {mode === 'kuis' && (
            <div className="space-y-4">
              {sedangMemuat ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-9 h-9 rounded-full border-2 border-[var(--color-gold-400)] border-t-transparent animate-spin mx-auto" />
                  <p className="text-xs text-[var(--text-muted-on-dark)]">
                    Sedang membuat 5 soal kuis dari isi materi...
                  </p>
                </div>
              ) : daftarKuis.length > 0 ? (
                !kuisSelesai ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-[var(--color-gold-400)] font-semibold border-b pb-2 border-white/10">
                      <span>Soal {indeksSoal + 1} dari {totalSoal}</span>
                    </div>

                    <p className="text-xs font-semibold text-white leading-relaxed bg-black/40 p-3.5 rounded-xl border border-white/10">
                      {daftarKuis[indeksSoal]?.soal}
                    </p>

                    <div className="space-y-2">
                      {daftarKuis[indeksSoal]?.opsi.map((opsiTeks, oIdx) => {
                        const dipilih = jawabanUser[indeksSoal] === oIdx;
                        const sudahDijawab = jawabanUser[indeksSoal] !== undefined;
                        const benar = daftarKuis[indeksSoal].jawaban_benar === oIdx;

                        let bgClass = 'bg-white/5 hover:bg-white/10 border-white/10';
                        if (sudahDijawab) {
                          if (dipilih && benar) bgClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                          else if (dipilih && !benar) bgClass = 'bg-red-950/80 border-red-500 text-red-200';
                          else if (benar) bgClass = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300';
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={sudahDijawab}
                            onClick={() => setJawabanUser((prev) => ({ ...prev, [indeksSoal]: oIdx }))}
                            className={`w-full text-left text-xs p-3 rounded-xl border transition-all flex items-start gap-2.5 ${bgClass}`}
                          >
                            <span className="font-bold flex-shrink-0 opacity-70">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            <span className="flex-1 leading-snug">{opsiTeks}</span>
                            {sudahDijawab && dipilih && (
                              benar ? <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" /> : <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        disabled={indeksSoal === 0}
                        onClick={() => setIndeksSoal((prev) => prev - 1)}
                        className="text-xs text-[var(--color-gold-400)] disabled:opacity-30 hover:underline"
                      >
                        ← Sebelumnya
                      </button>

                      {indeksSoal < totalSoal - 1 ? (
                        <Tombol
                          varian="primer"
                          ukuran="kecil"
                          disabled={jawabanUser[indeksSoal] === undefined}
                          onClick={() => setIndeksSoal((prev) => prev + 1)}
                        >
                          Selanjutnya →
                        </Tombol>
                      ) : (
                        <Tombol
                          varian="primer"
                          ukuran="kecil"
                          disabled={jawabanUser[indeksSoal] === undefined}
                          onClick={() => setKuisSelesai(true)}
                        >
                          Lihat Hasil Kuis
                        </Tombol>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center space-y-4 bg-black/40 p-6 rounded-xl border border-white/10">
                    <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-[var(--color-gold-500)] text-[var(--color-dark-900)] font-bold text-2xl">
                      {Math.round((totalBenar / totalSoal) * 100)}%
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white" style={{ fontFamily: 'var(--font-display)' }}>
                        Kuis Latihan Selesai!
                      </h4>
                      <p className="text-xs text-[var(--text-muted-on-dark)] mt-1">
                        Anda menjawab benar <strong>{totalBenar}</strong> dari <strong>{totalSoal}</strong> soal ({Math.round((totalBenar / totalSoal) * 100)}%).
                      </p>
                    </div>
                    <div className="pt-2 flex justify-center gap-3">
                      <button
                        onClick={handleMulaiKuis}
                        className="text-xs px-4 py-2 rounded-lg bg-[var(--color-gold-500)] text-[var(--color-dark-900)] font-bold flex items-center gap-1.5 hover:bg-[var(--color-gold-400)] transition-colors"
                      >
                        <RotateCcw size={14} /> Ulangi Kuis
                      </button>
                    </div>
                  </div>
                )
              ) : null}
            </div>
          )}

          {/* =============================================================== */}
          {/* MODE TANYA JAWAB */}
          {/* =============================================================== */}
          {mode === 'tanya_jawab' && (
            <div className="space-y-4">
              <form onSubmit={handleKirimPertanyaan} className="space-y-2">
                <textarea
                  rows={3}
                  value={pertanyaan}
                  onChange={(e) => setPertanyaan(e.target.value)}
                  placeholder={`Tanyakan konsep atau soal seputar ${materiSaatIni?.judul || 'materi ini'}...`}
                  className="w-full text-xs p-3.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[var(--color-gold-400)] resize-none"
                />
                <div className="flex justify-end">
                  <Tombol
                    type="submit"
                    varian="primer"
                    ukuran="kecil"
                    sedangMemuat={sedangMemuat}
                    ikonKanan={<Send size={13} />}
                    disabled={!pertanyaan.trim() || sedangMemuat}
                  >
                    {sedangMemuat ? 'Memproses...' : 'Kirim Pertanyaan'}
                  </Tombol>
                </div>
              </form>

              {riwayatQNA.length > 0 && (
                <div className="space-y-3 pt-2 max-h-72 overflow-y-auto pr-1">
                  {riwayatQNA.map((item, idx) => (
                    <div key={idx} className="space-y-2 text-xs border-t pt-3 border-white/10">
                      <div className="font-semibold text-[var(--color-gold-400)] flex items-start gap-1.5">
                        <span>Q:</span>
                        <span className="text-white">{item.q}</span>
                      </div>
                      <div className="bg-black/40 p-3.5 rounded-xl text-white/90 leading-relaxed whitespace-pre-line border border-white/10">
                        {item.a}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
