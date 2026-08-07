'use client';

import { useState } from 'react';
import { Star, CheckCircle, AlertCircle } from 'lucide-react';
import { berikanPenilaian } from '@/lib/actions/materi';

interface FormPenilaianProps {
  materiId: string;
  nilaiSaya?: number | null;
  ratingRataRata: number;
  totalPenilai: number;
}

export default function FormPenilaian({
  materiId,
  nilaiSaya: nilaiSayaAwal,
  ratingRataRata: ratingAwal,
  totalPenilai: totalAwal,
}: FormPenilaianProps) {
  const [nilaiHover, setNilaiHover] = useState<number | null>(null);
  const [nilaiTerpilih, setNilaiTerpilih] = useState<number | null>(nilaiSayaAwal || null);
  const [sedangMengirim, setSedangMengirim] = useState(false);
  const [pesan, setPesan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleBintangClick(nilai: number) {
    setError(null);
    setPesan(null);
    setSedangMengirim(true);

    const res = await berikanPenilaian(materiId, nilai);

    setSedangMengirim(false);

    if (res.sukses) {
      setNilaiTerpilih(nilai);
      setPesan(res.pesan || 'Penilaian berhasil disimpan!');
    } else {
      setError(res.error || 'Gagal menyimpan penilaian.');
    }
  }

  const bintangAktif = nilaiHover !== null ? nilaiHover : nilaiTerpilih || 0;

  return (
    <div className="card-glass p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3
          className="font-bold text-base text-[var(--text-on-light)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Penilaian &amp; Ulasan
        </h3>
        <div className="flex items-center gap-1.5 text-sm font-bold text-[var(--color-gold-600)]">
          <Star size={16} fill="currentColor" />
          <span>{ratingAwal > 0 ? ratingAwal.toFixed(1) : 'Belum ada'}</span>
          <span className="text-xs font-normal text-[var(--text-muted-on-light)]">
            ({totalAwal.toLocaleString('id-ID')} ulasan)
          </span>
        </div>
      </div>

      {pesan && (
        <div
          role="status"
          className="flex items-center gap-2 p-3 rounded-[var(--radius-sm)] text-xs font-semibold"
          style={{
            background: 'var(--color-gold-50)',
            border: '1px solid var(--color-gold-300)',
            color: 'var(--color-gold-900)',
          }}
        >
          <CheckCircle size={14} className="text-[var(--color-gold-600)]" />
          <span>{pesan}</span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 p-3 rounded-[var(--radius-sm)] text-xs font-semibold text-red-700 bg-red-50 border border-red-200"
        >
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-semibold text-[var(--text-on-light)]">
          {nilaiTerpilih ? 'Penilaian Anda saat ini:' : 'Beri nilai untuk materi ini:'}
        </p>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((bintang) => (
            <button
              key={bintang}
              type="button"
              disabled={sedangMengirim}
              onClick={() => handleBintangClick(bintang)}
              onMouseEnter={() => setNilaiHover(bintang)}
              onMouseLeave={() => setNilaiHover(null)}
              className="p-1 rounded-md transition-transform hover:scale-125 focus:outline-none disabled:opacity-50"
              aria-label={`Beri nilai ${bintang} dari 5 bintang`}
            >
              <Star
                size={24}
                className="transition-colors"
                fill={bintang <= bintangAktif ? 'var(--color-gold-500)' : 'transparent'}
                style={{
                  color: bintang <= bintangAktif ? 'var(--color-gold-500)' : 'var(--color-cream-400)',
                }}
              />
            </button>
          ))}
          {nilaiTerpilih && (
            <span className="text-xs font-bold text-[var(--color-gold-700)] ml-2">
              {nilaiTerpilih} / 5 Bintang
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
