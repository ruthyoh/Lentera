'use client';

import { useState } from 'react';
import { Brain, Sparkles, AlertTriangle, RefreshCw, ChevronRight, Lock } from 'lucide-react';

interface PanelRingkasanAIProps {
  materiId: string;
  materiJudul?: string;
}

type Status = 'idle' | 'memuat' | 'sukses' | 'error' | 'unauthenticated';

interface HasilRingkasan {
  ringkasan: string;
  materi_judul?: string;
}

/** Parsing teks ringkasan → array bullet points */
function parseRingkasanMenjadiPoin(teks: string): string[] {
  const baris = teks.split('\n').map((b) => b.trim()).filter(Boolean);
  const hasBullet = baris.some((b) => b.startsWith('•') || b.startsWith('-') || /^\d+\./.test(b));

  if (hasBullet) {
    return baris
      .filter((b) => b.startsWith('•') || b.startsWith('-') || /^\d+\./.test(b))
      .map((b) => b.replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '').trim())
      .filter((b) => b.length > 0);
  }

  // Jika tidak ada bullet, pecah per baris yang cukup panjang
  const filtered = baris.filter((b) => b.length > 20);
  if (filtered.length >= 3) return filtered.slice(0, 6);

  // Fallback: pecah per titik
  return teks
    .split(/\.\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20)
    .slice(0, 6)
    .map((s) => (s.endsWith('.') ? s : s + '.'));
}

/** Hapus markdown bold (**teks**) menjadi teks biasa untuk tampilan */
function hapusBold(teks: string): string {
  return teks.replace(/\*\*(.*?)\*\*/g, '$1');
}

export default function PanelRingkasanAI({ materiId, materiJudul }: PanelRingkasanAIProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [hasil, setHasil] = useState<HasilRingkasan | null>(null);
  const [pesanError, setPesanError] = useState('');

  async function jalankanRingkasan() {
    setStatus('memuat');
    setHasil(null);
    setPesanError('');

    try {
      const res = await fetch('/api/ai/ringkasan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materi_id: materiId }),
      });

      const json = await res.json();

      if (res.status === 401) {
        setStatus('unauthenticated');
        return;
      }

      if (!res.ok || !json.sukses) {
        setPesanError(
          json.error ||
            'Terjadi kesalahan saat memproses ringkasan. Silakan coba lagi.'
        );
        setStatus('error');
        return;
      }

      setHasil({ ringkasan: json.ringkasan, materi_judul: json.materi_judul });
      setStatus('sukses');
    } catch {
      setPesanError('Gagal terhubung ke server. Periksa koneksi internet Anda dan coba lagi.');
      setStatus('error');
    }
  }

  const poin = hasil ? parseRingkasanMenjadiPoin(hasil.ringkasan) : [];

  return (
    <div
      className="p-6 rounded-[var(--radius-lg)] text-white shadow-lg relative overflow-hidden"
      style={{ background: 'var(--color-dark-800)' }}
    >
      {/* Dekorasi latar */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5"
        style={{ background: 'var(--color-gold-400)', transform: 'translate(30%, -30%)' }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <Brain size={22} style={{ color: 'var(--color-gold-400)' }} />
        <h3
          className="font-bold text-base"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)' }}
        >
          Asisten Belajar AI
        </h3>
      </div>

      {/* Deskripsi fitur */}
      {status === 'idle' && (
        <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--text-muted-on-dark)' }}>
          Ringkas isi materi ini menjadi{' '}
          <strong style={{ color: 'var(--color-gold-300)' }}>5 poin utama</strong> menggunakan
          kecerdasan buatan — hemat waktu belajarmu!
        </p>
      )}

      {/* ─── STATE: MEMUAT ─── */}
      {status === 'memuat' && (
        <div className="py-6 flex flex-col items-center gap-3" aria-live="polite" aria-busy="true">
          <div
            className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--color-gold-600)', borderTopColor: 'transparent' }}
          />
          <p className="text-xs text-center" style={{ color: 'var(--text-muted-on-dark)' }}>
            Sedang menganalisis dan meringkas materi…
          </p>
          <p className="text-xs text-center opacity-60" style={{ color: 'var(--text-muted-on-dark)' }}>
            Proses ini memakan waktu 5–15 detik
          </p>
        </div>
      )}

      {/* ─── STATE: SUKSES — daftar bullet point ─── */}
      {status === 'sukses' && poin.length > 0 && (
        <div className="space-y-3 mb-4" aria-live="polite">
          <p className="text-xs font-semibold" style={{ color: 'var(--color-gold-400)' }}>
            ✨ Ringkasan 5 Poin Utama
          </p>
          <ul className="space-y-2.5">
            {poin.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                  style={{ background: 'var(--color-gold-600)', color: 'var(--color-dark-900)' }}
                >
                  {i + 1}
                </span>
                <span
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--text-on-dark)' }}
                >
                  {hapusBold(p)}
                </span>
              </li>
            ))}
          </ul>
          <button
            onClick={jalankanRingkasan}
            className="w-full flex items-center justify-center gap-2 mt-2 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80 cursor-pointer"
            style={{ background: 'rgba(201,151,30,0.15)', color: 'var(--color-gold-300)', border: '1px solid rgba(201,151,30,0.25)' }}
          >
            <RefreshCw size={12} />
            Perbarui Ringkasan
          </button>
        </div>
      )}

      {/* ─── STATE: ERROR ─── */}
      {status === 'error' && (
        <div
          className="p-4 rounded-lg mb-4 flex items-start gap-3"
          style={{ background: 'rgba(196,98,45,0.15)', border: '1px solid rgba(196,98,45,0.3)' }}
          aria-live="assertive"
          role="alert"
        >
          <AlertTriangle
            size={16}
            className="flex-shrink-0 mt-0.5"
            style={{ color: 'var(--color-terracotta-400)' }}
          />
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-terracotta-300)' }}>
              Gagal memuat ringkasan
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted-on-dark)' }}>
              {pesanError}
            </p>
          </div>
        </div>
      )}

      {/* ─── STATE: UNAUTHENTICATED ─── */}
      {status === 'unauthenticated' && (
        <div className="py-4 text-center space-y-3" aria-live="polite">
          <Lock size={24} className="mx-auto" style={{ color: 'var(--color-gold-400)' }} />
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted-on-dark)' }}>
            Masuk ke akun Lentera untuk menggunakan fitur Asisten Belajar AI.
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
            style={{ background: 'var(--color-gold-500)', color: 'var(--color-dark-900)' }}
          >
            <Sparkles size={12} />
            Masuk Sekarang
          </a>
        </div>
      )}

      {/* ─── TOMBOL UTAMA (idle + error + unauthenticated) ─── */}
      {(status === 'idle' || status === 'error') && (
        <button
          onClick={jalankanRingkasan}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-[var(--radius-sm)] text-sm font-semibold transition-all hover:opacity-90 cursor-pointer"
          style={{ background: 'var(--color-gold-500)', color: 'var(--color-dark-900)' }}
          id="tombol-ringkas-ai"
          aria-label={`Ringkas materi ${materiJudul || ''} dengan AI`}
        >
          <Sparkles size={15} />
          {status === 'error' ? 'Coba Lagi' : 'Ringkas dengan AI'}
          <ChevronRight size={14} />
        </button>
      )}

      {/* Aksi sekunder lain */}
      {status === 'idle' && (
        <div className="mt-3 space-y-2">
          {[
            { label: '❓ Buat 5 kuis latihan', href: null },
            { label: '💬 Tanya jawab materi', href: null },
          ].map((aksi, idx) => (
            <div
              key={idx}
              className="w-full text-left text-xs px-3.5 py-2.5 rounded-lg flex items-center justify-between"
              style={{ background: 'rgba(201,151,30,0.08)', border: '1px solid rgba(201,151,30,0.18)' }}
            >
              <span style={{ color: 'var(--text-muted-on-dark)' }}>{aksi.label}</span>
              <span
                className="text-[10px] uppercase font-bold px-2 py-0.5 rounded"
                style={{ background: 'rgba(201,151,30,0.25)', color: 'var(--color-gold-400)' }}
              >
                Segera
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
