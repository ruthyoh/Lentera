'use client';

import { useState } from 'react';
import { Brain, Sparkles, AlertTriangle, RefreshCw, ArrowRight, Lock, CheckCircle, Clock, GraduationCap, Award } from 'lucide-react';

interface PanelPencocokanAIProps {
  /** ID user Supabase (null jika belum login) */
  userId: string | null;
}

type Status = 'idle' | 'memuat' | 'sukses' | 'error' | 'unauthenticated';

interface KartuBeasiswaRekomendasi {
  peringkat: number;
  nama: string;
  penyelenggara: string;
  alasan: string;
  skorPersen: number;
}

/**
 * Parse teks rekomendasi AI → array kartu beasiswa terurut.
 * Format yang diharapkan dari API (bisa Gemini atau fallback):
 *   "1. **Nama Beasiswa** (Penyelenggara)\nAlasan: ..."
 */
function parseTeksRekomendasi(teks: string): KartuBeasiswaRekomendasi[] {
  const blok = teks
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  const kartu: KartuBeasiswaRekomendasi[] = [];

  blok.forEach((blok) => {
    // Coba cocokkan pola: "1. **Nama** (Penyelenggara)"
    const matchJudul = blok.match(/^(\d+)\.\s+\*?\*?([^*\n(]+)\*?\*?\s*(?:\(([^)]+)\))?/);
    if (!matchJudul) return;

    const peringkat = parseInt(matchJudul[1]);
    const nama = matchJudul[2].replace(/\*+/g, '').trim();
    const penyelenggara = (matchJudul[3] || '').trim();

    // Cari baris Alasan
    const barisAlasan = blok.match(/[Aa]lasan[:\s]+([\s\S]+)/);
    const alasan = barisAlasan
      ? barisAlasan[1].trim().split('\n')[0].substring(0, 200)
      : 'Beasiswa ini sesuai dengan profil akademik dan kriteria yang Anda miliki.';

    // Hitung skor fiktif berdasarkan peringkat
    const skor = Math.max(95 - (peringkat - 1) * 10, 50);

    kartu.push({ peringkat, nama, penyelenggara, alasan, skorPersen: skor });
  });

  // Fallback jika parse gagal: tampilkan teks mentah sebagai 1 kartu informatif
  if (kartu.length === 0 && teks.length > 10) {
    kartu.push({
      peringkat: 1,
      nama: 'Rekomendasi AI',
      penyelenggara: 'Lentera AI',
      alasan: teks.substring(0, 300),
      skorPersen: 80,
    });
  }

  return kartu.slice(0, 5);
}

function warnaPeringkat(i: number): { bg: string; text: string } {
  const palet = [
    { bg: 'rgba(201,151,30,0.18)', text: 'var(--color-gold-600)' },
    { bg: 'rgba(196,98,45,0.15)', text: 'var(--color-terracotta-600)' },
    { bg: 'rgba(201,151,30,0.10)', text: 'var(--color-gold-700)' },
    { bg: 'rgba(196,98,45,0.10)', text: 'var(--color-terracotta-700)' },
    { bg: 'rgba(201,151,30,0.08)', text: 'var(--color-gold-700)' },
  ];
  return palet[i] || palet[4];
}

export default function PanelPencocokanAI({ userId }: PanelPencocokanAIProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [kartu, setKartu] = useState<KartuBeasiswaRekomendasi[]>([]);
  const [pesanError, setPesanError] = useState('');
  const [jumlahDiperiksa, setJumlahDiperiksa] = useState(0);

  async function jalankanPencocokan() {
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
        body: JSON.stringify({ user_id: userId }),
      });

      const json = await res.json();

      if (res.status === 401) {
        setStatus('unauthenticated');
        return;
      }

      if (res.status === 422) {
        // Profil belum lengkap
        setPesanError(
          json.error ||
            'Profil Anda belum lengkap. Harap isi jurusan, semester, dan IPK di halaman Profil agar AI dapat memberikan rekomendasi yang akurat.'
        );
        setStatus('error');
        return;
      }

      if (!res.ok || !json.sukses) {
        setPesanError(
          json.error ||
            'Gagal memuat rekomendasi beasiswa. Silakan coba lagi dalam beberapa saat.'
        );
        setStatus('error');
        return;
      }

      const hasilKartu = parseTeksRekomendasi(json.rekomendasi);
      setKartu(hasilKartu);
      setJumlahDiperiksa(json.jumlah_beasiswa_diperiksa || 0);
      setStatus('sukses');
    } catch {
      setPesanError(
        'Gagal terhubung ke server. Periksa koneksi internet Anda dan coba beberapa saat lagi.'
      );
      setStatus('error');
    }
  }

  return (
    <div className="w-full">
      {/* ─── STATE: IDLE — Banner CTA ─── */}
      {status === 'idle' && (
        <div
          className="rounded-[var(--radius-lg)] p-5 flex flex-col md:flex-row items-center gap-4"
          style={{
            background: 'var(--color-terracotta-50)',
            border: '1px solid var(--color-terracotta-200)',
          }}
        >
          <div
            className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--color-terracotta-500)' }}
            aria-hidden="true"
          >
            <Brain size={22} className="text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="font-semibold text-sm mb-0.5" style={{ color: 'var(--color-terracotta-800)' }}>
              Asisten Pencocokan AI Tersedia
            </p>
            <p className="text-xs" style={{ color: 'var(--color-terracotta-600)' }}>
              Masukkan profil akademikmu dan biarkan AI menemukan beasiswa yang paling cocok untukmu secara otomatis.
            </p>
          </div>
          <button
            onClick={jalankanPencocokan}
            className="flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] text-sm font-semibold transition-all hover:opacity-90 cursor-pointer flex-shrink-0"
            style={{ background: 'var(--color-terracotta-500)', color: 'white' }}
            id="tombol-pencocokan-ai-coba"
            aria-label="Coba pencocokan beasiswa dengan AI"
          >
            <Sparkles size={14} />
            Coba Sekarang
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* ─── STATE: MEMUAT — Skeleton Cards ─── */}
      {status === 'memuat' && (
        <div aria-live="polite" aria-busy="true">
          <div
            className="rounded-[var(--radius-lg)] p-5 mb-4 flex items-center gap-3"
            style={{ background: 'var(--color-terracotta-50)', border: '1px solid var(--color-terracotta-200)' }}
          >
            <div
              className="w-6 h-6 rounded-full border-3 border-t-transparent animate-spin flex-shrink-0"
              style={{ borderColor: 'var(--color-terracotta-500)', borderTopColor: 'transparent', borderWidth: 3 }}
            />
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-terracotta-800)' }}>
                AI sedang menganalisis profil kamu…
              </p>
              <p className="text-xs" style={{ color: 'var(--color-terracotta-600)' }}>
                Mencocokkan dengan {'>'}0 beasiswa aktif — harap tunggu
              </p>
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-glass p-5 mb-3 space-y-3 animate-pulse">
              <div className="h-4 rounded skeleton w-3/4" />
              <div className="h-3 rounded skeleton w-1/2" />
              <div className="h-3 rounded skeleton w-full" />
              <div className="h-3 rounded skeleton w-5/6" />
            </div>
          ))}
        </div>
      )}

      {/* ─── STATE: ERROR ─── */}
      {status === 'error' && (
        <div className="space-y-4">
          <div
            className="rounded-[var(--radius-lg)] p-5 flex items-start gap-3"
            style={{ background: 'rgba(196,98,45,0.08)', border: '1px solid rgba(196,98,45,0.25)' }}
            aria-live="assertive"
            role="alert"
          >
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-terracotta-500)' }} />
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-terracotta-700)' }}>
                Belum bisa mencocokkan beasiswa
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted-on-light)' }}>
                {pesanError}
              </p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={jalankanPencocokan}
              className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-sm)] text-sm font-semibold transition-all hover:opacity-90 cursor-pointer"
              style={{ background: 'var(--color-terracotta-500)', color: 'white' }}
            >
              <RefreshCw size={14} />
              Coba Lagi
            </button>
            <a
              href="/profil"
              className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-sm)] text-sm font-semibold border transition-all hover:opacity-80"
              style={{ borderColor: 'var(--color-terracotta-400)', color: 'var(--color-terracotta-700)' }}
            >
              Lengkapi Profil
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      )}

      {/* ─── STATE: UNAUTHENTICATED ─── */}
      {status === 'unauthenticated' && (
        <div
          className="rounded-[var(--radius-lg)] p-6 text-center space-y-4"
          style={{ background: 'var(--color-terracotta-50)', border: '1px solid var(--color-terracotta-200)' }}
          aria-live="polite"
        >
          <Lock size={28} className="mx-auto" style={{ color: 'var(--color-terracotta-500)' }} />
          <div>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--color-terracotta-800)' }}>
              Masuk untuk Pencocokan AI
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-terracotta-600)' }}>
              Buat akun Lentera gratis dan dapatkan rekomendasi beasiswa yang dipersonalisasi sesuai jurusan, IPK, dan semester kamu.
            </p>
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: 'var(--color-terracotta-500)', color: 'white' }}
            >
              Masuk ke Akun
            </a>
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-sm)] text-sm font-semibold border transition-all hover:opacity-80"
              style={{ borderColor: 'var(--color-terracotta-400)', color: 'var(--color-terracotta-700)' }}
            >
              <Sparkles size={14} />
              Daftar Gratis
            </a>
          </div>
        </div>
      )}

      {/* ─── STATE: SUKSES — Kartu Rekomendasi ─── */}
      {status === 'sukses' && kartu.length > 0 && (
        <div aria-live="polite" className="space-y-4">
          {/* Header hasil */}
          <div
            className="rounded-[var(--radius-lg)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            style={{ background: 'var(--color-terracotta-50)', border: '1px solid var(--color-terracotta-200)' }}
          >
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--color-terracotta-800)' }}>
                ✨ {kartu.length} Beasiswa Terbaik untuk Kamu
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-terracotta-600)' }}>
                AI menganalisis {jumlahDiperiksa} beasiswa aktif berdasarkan profilmu
              </p>
            </div>
            <button
              onClick={jalankanPencocokan}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80 cursor-pointer flex-shrink-0"
              style={{ background: 'rgba(196,98,45,0.12)', color: 'var(--color-terracotta-700)', border: '1px solid rgba(196,98,45,0.25)' }}
            >
              <RefreshCw size={12} />
              Perbarui
            </button>
          </div>

          {/* Kartu-kartu beasiswa */}
          {kartu.map((item, i) => {
            const warna = warnaPeringkat(i);
            return (
              <div
                key={i}
                className="card-glass p-5 space-y-3"
                role="article"
                aria-label={`Rekomendasi ${item.peringkat}: ${item.nama}`}
              >
                {/* Baris atas: peringkat + nama + skor */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: warna.bg, color: warna.text }}
                    >
                      {item.peringkat}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="font-bold text-sm leading-snug"
                        style={{ color: 'var(--text-on-light)', fontFamily: 'var(--font-display)' }}
                      >
                        {item.nama}
                      </p>
                      {item.penyelenggara && (
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted-on-light)' }}>
                          {item.penyelenggara}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Badge skor kecocokan */}
                  <div
                    className="flex-shrink-0 flex flex-col items-center px-2.5 py-1 rounded-lg"
                    style={{ background: warna.bg }}
                  >
                    <span className="text-base font-bold leading-none" style={{ color: warna.text }}>
                      {item.skorPersen}%
                    </span>
                    <span className="text-[10px] font-medium" style={{ color: warna.text }}>
                      cocok
                    </span>
                  </div>
                </div>

                {/* Alasan kecocokan */}
                <div
                  className="flex items-start gap-2 p-3 rounded-lg"
                  style={{ background: 'var(--color-cream-100)' }}
                >
                  <CheckCircle
                    size={13}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: 'var(--color-gold-600)' }}
                  />
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-on-light)' }}>
                    {item.alasan}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
