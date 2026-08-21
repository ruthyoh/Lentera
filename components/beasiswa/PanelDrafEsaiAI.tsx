'use client';

import { useState } from 'react';
import { Brain, Sparkles, Copy, CheckCheck, RefreshCw, AlertCircle, Lock, PenLine } from 'lucide-react';
import Link from 'next/link';
import Tombol from '@/components/ui/Button';

interface PanelDrafEsaiAIProps {
  beasiswaId: string;
  namaBeasiswa: string;
  /** null jika user belum login */
  userId: string | null;
}

export default function PanelDrafEsaiAI({ beasiswaId, namaBeasiswa, userId }: PanelDrafEsaiAIProps) {
  const [fase, setFase] = useState<'idle' | 'memuat' | 'selesai' | 'error'>('idle');
  const [draftEsai, setDraftEsai] = useState<string | null>(null);
  const [motivasiInput, setMotivasiInput] = useState('');
  const [pesanError, setPesanError] = useState('');
  const [tersalin, setTersalin] = useState(false);

  async function handleBuatDraf() {
    if (!userId) return;

    setFase('memuat');
    setPesanError('');
    setDraftEsai(null);

    try {
      const res = await fetch('/api/ai/draf-esai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beasiswa_id: beasiswaId,
          motivasi_tambahan: motivasiInput.trim() || undefined,
        }),
      });

      const json = await res.json();

      if (res.status === 401) {
        setPesanError('__perlu_login__');
        setFase('error');
        return;
      }

      if (!res.ok || !json.sukses) {
        setPesanError(json.error || 'Gagal membuat draf esai. Coba lagi nanti.');
        setFase('error');
        return;
      }

      setDraftEsai(json.draft_esai);
      setFase('selesai');
    } catch {
      setPesanError('Gagal terhubung ke server. Pastikan koneksi internet Anda lancar.');
      setFase('error');
    }
  }

  async function handleSalin() {
    if (!draftEsai) return;
    try {
      await navigator.clipboard.writeText(draftEsai);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2500);
    } catch {
      /* fallback manual select */
    }
  }

  function handleUlang() {
    setFase('idle');
    setDraftEsai(null);
    setPesanError('');
  }

  // Belum login
  if (!userId) {
    return (
      <div
        className="p-6 rounded-[var(--radius-lg)] text-white"
        style={{ background: 'var(--color-terracotta-600)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Brain size={20} />
          <h3 className="font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Draf Esai AI
          </h3>
        </div>
        <p className="text-sm opacity-85 mb-4">
          Biarkan AI membantu menyusun esai motivasi yang kuat dan sesuai persyaratan beasiswa ini.
        </p>
        <Link href="/login" className="block">
          <button
            className="w-full py-3 rounded-[var(--radius-sm)] text-sm font-semibold transition-all hover:opacity-90 cursor-pointer"
            style={{ background: 'white', color: 'var(--color-terracotta-700)' }}
            id="tombol-mulai-esai-ai"
          >
            Masuk untuk Buat Draf Esai
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-[var(--radius-lg)] space-y-4"
      style={{ background: 'var(--color-dark-800)', border: '1px solid rgba(201,151,30,0.3)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Brain size={20} className="text-[var(--color-gold-400)]" />
        <h3 className="font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Draf Esai AI
        </h3>
        <span className="ml-auto">
          <Sparkles size={14} className="text-[var(--color-gold-400)]" />
        </span>
      </div>

      {/* Error perlu login */}
      {pesanError === '__perlu_login__' && (
        <div className="p-3 rounded-lg bg-amber-950/70 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2">
          <Lock size={14} className="flex-shrink-0 mt-0.5" />
          <span>Sesi Anda telah berakhir. <Link href="/login" className="underline font-bold">Masuk kembali</Link> untuk melanjutkan.</span>
        </div>
      )}

      {/* Error umum */}
      {pesanError && pesanError !== '__perlu_login__' && (
        <div className="p-3 rounded-lg bg-red-950/70 border border-red-500/40 text-xs text-red-200 flex items-start gap-2">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <span>{pesanError}</span>
        </div>
      )}

      {/* Fase: idle — tampilkan form input */}
      {fase === 'idle' && (
        <div className="space-y-3">
          <p className="text-xs text-white/70 leading-relaxed">
            AI akan membuat draf esai motivasi berdasarkan profil akademik Anda dan informasi beasiswa{' '}
            <strong className="text-white">{namaBeasiswa}</strong>.
          </p>
          <div>
            <label className="text-xs text-white/60 block mb-1.5">
              Motivasi personal tambahan <span className="opacity-60">(opsional)</span>
            </label>
            <textarea
              rows={3}
              value={motivasiInput}
              onChange={(e) => setMotivasiInput(e.target.value)}
              placeholder="Contoh: Saya berasal dari keluarga petani dan ingin mengembangkan pertanian berbasis teknologi..."
              className="w-full text-xs p-3 rounded-lg bg-black/40 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-gold-400)] resize-none"
              maxLength={500}
            />
            <p className="text-[10px] text-white/30 text-right mt-0.5">{motivasiInput.length}/500</p>
          </div>
          <Tombol
            varian="primer"
            ukuran="sedang"
            lebarPenuh
            ikonKiri={<PenLine size={15} />}
            onClick={handleBuatDraf}
            id="tombol-buat-draf-esai"
          >
            Buat Draf Esai Sekarang
          </Tombol>
        </div>
      )}

      {/* Fase: memuat */}
      {fase === 'memuat' && (
        <div className="py-8 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--color-gold-400)] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-white/60">AI sedang menyusun draf esai motivasi Anda...</p>
          <p className="text-[10px] text-white/40">Proses ini membutuhkan 10–30 detik</p>
        </div>
      )}

      {/* Fase: selesai — tampilkan draft */}
      {fase === 'selesai' && draftEsai && (
        <div className="space-y-3">
          <div
            className="text-xs text-white/90 leading-relaxed whitespace-pre-line bg-black/30 p-4 rounded-lg border border-gold-500/20 max-h-72 overflow-y-auto"
            style={{ borderColor: 'rgba(201,151,30,0.2)' }}
          >
            {draftEsai}
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSalin}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg font-semibold transition-all"
              style={{ background: 'var(--color-gold-500)', color: 'var(--color-dark-900)' }}
              id="tombol-salin-draf-esai"
            >
              {tersalin ? (
                <>
                  <CheckCheck size={13} />
                  Tersalin!
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Salin Draf
                </>
              )}
            </button>
            <button
              onClick={handleUlang}
              className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg text-white/60 hover:text-white transition-colors"
              id="tombol-ulang-draf-esai"
            >
              <RefreshCw size={12} />
              Buat Ulang
            </button>
          </div>
          <p className="text-[10px] text-white/30 text-center leading-relaxed">
            Draf ini adalah titik awal. Sesuaikan dengan pengalaman nyata Anda sebelum dikirim.
          </p>
        </div>
      )}

      {/* Fase: error — tombol coba lagi */}
      {fase === 'error' && pesanError !== '__perlu_login__' && (
        <Tombol
          varian="outline"
          ukuran="kecil"
          onClick={handleUlang}
          className="w-full"
        >
          Coba Lagi
        </Tombol>
      )}
    </div>
  );
}
