'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Brain, Sparkles, RefreshCw, Send, CheckCircle2, XCircle, ArrowLeft,
  HelpCircle, FileText, MessageSquare, AlertCircle, RotateCcw, Lock
} from 'lucide-react';
import Tombol from '@/components/ui/Button';

interface PanelAsistenAIProps {
  materiId: string;
  judulMateri: string;
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

type ModePanel = 'menu' | 'ringkasan' | 'kuis' | 'tanya_jawab';

export default function PanelAsistenAI({ materiId, judulMateri }: PanelAsistenAIProps) {
  const [mode, setMode] = useState<ModePanel>('menu');
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [errorPesan, setErrorPesan] = useState<string | null>(null);
  const [perluLogin, setPerluLogin] = useState(false);

  // State Ringkasan
  const [ringkasanTeks, setRingkasanTeks] = useState<string | null>(null);

  // State Kuis
  const [daftarKuis, setDaftarKuis] = useState<SoalKuis[]>([]);
  const [indeksSoal, setIndeksSoal] = useState(0);
  const [jawabanUser, setJawabanUser] = useState<Record<number, number>>({});
  const [kuisSelesai, setKuisSelesai] = useState(false);

  // State Tanya Jawab
  const [pertanyaan, setPertanyaan] = useState('');
  const [riwayatQNA, setRiwayatQNA] = useState<RiwayatQNA[]>([]);

  // ─── Handler 1: Meringkas Materi ──────────────────────────────────────
  async function handleMulaiRingkasan(pakaiCache = true) {
    setMode('ringkasan');
    setErrorPesan(null);
    setPerluLogin(false);

    if (pakaiCache && ringkasanTeks) return; // Gunakan cache yang sudah dimuat

    setSedangMemuat(true);

    try {
      const res = await fetch('/api/ai/ringkasan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materi_id: materiId }),
      });

      const json = await res.json();

      if (res.status === 401) {
        setPerluLogin(true);
      } else if (!res.ok || !json.sukses) {
        setErrorPesan(json.error || 'Gagal meringkas materi. Coba lagi nanti.');
      } else {
        setRingkasanTeks(json.ringkasan);
      }
    } catch (err) {
      console.error('Error ringkasan:', err);
      setErrorPesan('Gagal meringkas materi. Pastikan koneksi internet Anda lancar.');
    } finally {
      setSedangMemuat(false);
    }
  }

  // ─── Handler 1b: Ringkas Ulang (clear cache lalu re-fetch) ──────────────
  function handleRingkasUlang() {
    setRingkasanTeks(null);
    // Setelah state ter-clear, panggil dengan pakaiCache=false
    setTimeout(() => handleMulaiRingkasan(false), 0);
  }

  // ─── Handler 2: Membuat Kuis ──────────────────────────────────────────
  async function handleMulaiKuis(pakaiCache = true) {
    setMode('kuis');
    setErrorPesan(null);
    setPerluLogin(false);
    setIndeksSoal(0);
    setJawabanUser({});
    setKuisSelesai(false);

    if (pakaiCache && daftarKuis.length > 0) return; // Gunakan kuis yang sudah dibuat jika ada

    setSedangMemuat(true);

    try {
      const res = await fetch('/api/ai/kuis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materi_id: materiId }),
      });

      const json = await res.json();

      if (res.status === 401) {
        setPerluLogin(true);
      } else if (!res.ok || !json.sukses) {
        setErrorPesan(json.error || 'Gagal membuat kuis latihan. Coba lagi nanti.');
      } else {
        setDaftarKuis(json.kuis || []);
      }
    } catch (err) {
      console.error('Error kuis:', err);
      setErrorPesan('Gagal membuat kuis latihan. Coba lagi nanti.');
    } finally {
      setSedangMemuat(false);
    }
  }

  // ─── Handler 3: Tanya Jawab ───────────────────────────────────────────
  function handleBukaTanyaJawab() {
    setMode('tanya_jawab');
    setErrorPesan(null);
    setPerluLogin(false);
  }

  async function handleKirimPertanyaan(e: React.FormEvent) {
    e.preventDefault();
    if (!pertanyaan.trim() || sedangMemuat) return;

    const teksTanya = pertanyaan.trim();
    setPertanyaan('');
    setErrorPesan(null);
    setSedangMemuat(true);

    try {
      const res = await fetch('/api/ai/tanya-jawab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materi_id: materiId, pertanyaan: teksTanya }),
      });

      const json = await res.json();

      if (res.status === 401) {
        setPerluLogin(true);
      } else if (!res.ok || !json.sukses) {
        setErrorPesan(json.error || 'Gagal memproses pertanyaan. Coba lagi nanti.');
      } else {
        setRiwayatQNA((prev) => [...prev, { q: teksTanya, a: json.jawaban }]);
      }
    } catch (err) {
      console.error('Error tanya jawab:', err);
      setErrorPesan('Gagal memproses pertanyaan. Coba lagi nanti.');
    } finally {
      setSedangMemuat(false);
    }
  }

  // Kalkulasi skor kuis
  const totalSoal = daftarKuis.length;
  const totalBenar = Object.entries(jawabanUser).reduce((acc, [idx, ans]) => {
    return daftarKuis[Number(idx)]?.jawaban_benar === ans ? acc + 1 : acc;
  }, 0);

  return (
    <div
      className="p-6 rounded-[var(--radius-lg)] text-white shadow-lg relative overflow-hidden transition-all duration-300"
      style={{ background: 'var(--color-dark-800)', border: '1px solid rgba(201,151,30,0.3)' }}
    >
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-2">
          <Brain size={22} className="text-[var(--color-gold-400)]" />
          <h3 className="font-bold text-base text-[var(--text-on-dark)]" style={{ fontFamily: 'var(--font-display)' }}>
            Asisten Belajar AI
          </h3>
        </div>
        {mode !== 'menu' && (
          <button
            onClick={() => setMode('menu')}
            className="text-xs flex items-center gap-1 text-[var(--color-gold-400)] hover:underline"
          >
            <ArrowLeft size={13} />
            Menu AI
          </button>
        )}
      </div>

      {/* Alert Perlu Login */}
      {perluLogin && (
        <div className="p-4 rounded-lg bg-amber-950/70 border border-amber-500/40 space-y-2 mb-4 text-xs">
          <p className="font-bold text-amber-200 flex items-center gap-1.5">
            <Lock size={14} /> Anda Harus Masuk Terlebih Dahulu
          </p>
          <p className="text-amber-100/90 leading-relaxed">
            Fitur Asisten Belajar AI memerlukan autentikasi akun mahasiswa Lentera.
          </p>
          <div className="pt-1">
            <Link href={`/login?dari=/materi/${materiId}`}>
              <Tombol varian="primer" ukuran="kecil">
                Masuk ke Akun
              </Tombol>
            </Link>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorPesan && !perluLogin && (
        <div className="p-3 rounded-lg bg-red-950/70 border border-red-500/40 text-xs text-red-200 flex items-center gap-2 mb-4">
          <AlertCircle size={15} className="flex-shrink-0 text-red-400" />
          <span>{errorPesan}</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW 1: MENU UTAMA TOMBOL AKSI AI */}
      {/* =================================================================== */}
      {mode === 'menu' && (
        <div className="space-y-3">
          <p className="text-xs mb-4 leading-relaxed text-[var(--text-muted-on-dark)]">
            Pilih fitur kecerdasan buatan untuk membantu proses pemahaman berkas materi ini:
          </p>

          <button
            onClick={() => handleMulaiRingkasan()}
            className="w-full text-left text-xs px-4 py-3.5 rounded-lg transition-all text-white font-medium flex items-center justify-between group hover:bg-[rgba(201,151,30,0.25)]"
            style={{ background: 'rgba(201,151,30,0.15)', border: '1px solid rgba(201,151,30,0.3)' }}
          >
            <span className="flex items-center gap-2.5">
              <FileText size={16} className="text-[var(--color-gold-400)]" />
              💡 Ringkas materi ini dalam 5 poin
            </span>
            <Sparkles size={14} className="text-[var(--color-gold-400)] opacity-80 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => handleMulaiKuis()}
            className="w-full text-left text-xs px-4 py-3.5 rounded-lg transition-all text-white font-medium flex items-center justify-between group hover:bg-[rgba(201,151,30,0.25)]"
            style={{ background: 'rgba(201,151,30,0.15)', border: '1px solid rgba(201,151,30,0.3)' }}
          >
            <span className="flex items-center gap-2.5">
              <HelpCircle size={16} className="text-[var(--color-gold-400)]" />
              ❓ Buat 5 kuis latihan dari materi ini
            </span>
            <Sparkles size={14} className="text-[var(--color-gold-400)] opacity-80 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={handleBukaTanyaJawab}
            className="w-full text-left text-xs px-4 py-3.5 rounded-lg transition-all text-white font-medium flex items-center justify-between group hover:bg-[rgba(201,151,30,0.25)]"
            style={{ background: 'rgba(201,151,30,0.15)', border: '1px solid rgba(201,151,30,0.3)' }}
          >
            <span className="flex items-center gap-2.5">
              <MessageSquare size={16} className="text-[var(--color-gold-400)]" />
              💬 Tanya Jawab seputar materi ini
            </span>
            <Sparkles size={14} className="text-[var(--color-gold-400)] opacity-80 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW 2: RINGKASAN MATERI */}
      {/* =================================================================== */}
      {mode === 'ringkasan' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--color-gold-400)] border-b pb-2" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <span className="flex items-center gap-1.5">
              <FileText size={15} />
              Ringkasan Poin Utama
            </span>
          </div>

          {sedangMemuat ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--color-gold-400)] border-t-transparent animate-spin mx-auto" />
              <p className="text-xs text-[var(--text-muted-on-dark)]">
                Sedang meringkas materi...
              </p>
            </div>
          ) : ringkasanTeks ? (
            <div className="space-y-3">
              <div className="text-xs text-white/90 leading-relaxed whitespace-pre-line bg-black/30 p-4 rounded-lg border border-gold-500/20 max-h-80 overflow-y-auto">
                {ringkasanTeks}
              </div>
              <button
                onClick={handleRingkasUlang}
                className="text-[11px] flex items-center gap-1 text-[var(--color-gold-400)] hover:underline pt-1"
              >
                <RefreshCw size={11} />
                Ringkas Ulang
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW 3: KUIS LATIHAN INTERAKTIF */}
      {/* =================================================================== */}
      {mode === 'kuis' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--color-gold-400)] border-b pb-2" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <span className="flex items-center gap-1.5">
              <HelpCircle size={15} />
              Kuis Latihan Pemahaman
            </span>
            {totalSoal > 0 && !kuisSelesai && (
              <span className="text-[11px] text-[var(--text-muted-on-dark)] font-normal">
                Soal {indeksSoal + 1} dari {totalSoal}
              </span>
            )}
          </div>

          {sedangMemuat ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--color-gold-400)] border-t-transparent animate-spin mx-auto" />
              <p className="text-xs text-[var(--text-muted-on-dark)]">
                Sedang membuat 5 soal kuis dari materi...
              </p>
            </div>
          ) : daftarKuis.length > 0 ? (
            !kuisSelesai ? (
              // Tampilan Soal Per Soal
              <div className="space-y-4">
                <p className="text-xs font-semibold text-white leading-relaxed bg-black/30 p-3 rounded-lg border border-white/10">
                  {daftarKuis[indeksSoal]?.soal}
                </p>

                <div className="space-y-2">
                  {daftarKuis[indeksSoal]?.opsi.map((opsiTeks, oIdx) => {
                    const dipilih = jawabanUser[indeksSoal] === oIdx;
                    const sudahDijawab = jawabanUser[indeksSoal] !== undefined;
                    const benar = daftarKuis[indeksSoal].jawaban_benar === oIdx;

                    let bgClass = 'bg-white/5 hover:bg-white/10 border-white/10';
                    if (sudahDijawab) {
                      if (dipilih && benar) {
                        bgClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                      } else if (dipilih && !benar) {
                        bgClass = 'bg-red-950/80 border-red-500 text-red-200';
                      } else if (benar) {
                        bgClass = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={sudahDijawab}
                        onClick={() => {
                          setJawabanUser((prev) => ({ ...prev, [indeksSoal]: oIdx }));
                        }}
                        className={`w-full text-left text-xs p-3 rounded-lg border transition-all flex items-start gap-2.5 ${bgClass}`}
                      >
                        <span className="font-bold flex-shrink-0 opacity-70">
                          {String.fromCharCode(65 + oIdx)}.
                        </span>
                        <span className="flex-1 leading-snug">{opsiTeks}</span>
                        {sudahDijawab && dipilih && (
                          benar ? <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" /> : <XCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Navigasi Soal */}
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
              // Ringkasan Skor Akhir Kuis
              <div className="py-4 text-center space-y-4 bg-black/30 p-5 rounded-lg border border-gold-500/20">
                <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-[var(--color-gold-500)] text-[var(--color-dark-900)] font-bold text-xl">
                  {Math.round((totalBenar / totalSoal) * 100)}%
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    Kuis Latihan Selesai!
                  </h4>
                  <p className="text-xs text-[var(--text-muted-on-dark)] mt-1">
                    Anda menjawab benar <strong>{totalBenar}</strong> dari <strong>{totalSoal}</strong> soal ({Math.round((totalBenar / totalSoal) * 100)}%).
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setDaftarKuis([]);
                      handleMulaiKuis(false);
                    }}
                    className="text-xs px-4 py-2 rounded-lg bg-[var(--color-gold-500)] text-[var(--color-dark-900)] font-bold flex items-center gap-1.5 hover:bg-[var(--color-gold-400)] transition-colors"
                  >
                    <RotateCcw size={13} />
                    Ulangi Kuis
                  </button>
                </div>
              </div>
            )
          ) : null}
        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW 4: TANYA JAWAB MATERI */}
      {/* =================================================================== */}
      {mode === 'tanya_jawab' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--color-gold-400)] border-b pb-2" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <span className="flex items-center gap-1.5">
              <MessageSquare size={15} />
              Tanya Jawab seputar Materi
            </span>
          </div>

          {/* Form Pertanyaan */}
          <form onSubmit={handleKirimPertanyaan} className="space-y-2">
            <textarea
              rows={2}
              value={pertanyaan}
              onChange={(e) => setPertanyaan(e.target.value)}
              placeholder="Tanyakan konsep yang belum Anda pahami dari materi ini..."
              className="w-full text-xs p-3 rounded-lg bg-black/40 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[var(--color-gold-400)] resize-none"
            />
            <div className="flex justify-end">
              <Tombol
                type="submit"
                varian="primer"
                ukuran="kecil"
                sedangMemuat={sedangMemuat}
                ikonKanan={<Send size={12} />}
                disabled={!pertanyaan.trim() || sedangMemuat}
              >
                {sedangMemuat ? 'Memproses...' : 'Kirim Pertanyaan'}
              </Tombol>
            </div>
          </form>

          {/* Log / Riwayat Q&A */}
          {riwayatQNA.length > 0 && (
            <div className="space-y-3 pt-2 max-h-72 overflow-y-auto pr-1">
              {riwayatQNA.map((item, idx) => (
                <div key={idx} className="space-y-2 text-xs border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <div className="font-semibold text-[var(--color-gold-400)] flex items-start gap-1.5">
                    <span>Q:</span>
                    <span className="text-white">{item.q}</span>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg text-white/90 leading-relaxed whitespace-pre-line border border-white/10">
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
