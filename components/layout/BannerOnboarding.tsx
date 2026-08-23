'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, BookOpen, Award, Brain, ChevronRight } from 'lucide-react';

const STORAGE_KEY = 'lentera_onboarding_dismissed';

const LANGKAH_ONBOARDING = [
  {
    no: '01',
    ikon: <BookOpen size={18} className="text-cyan-400" />,
    judul: 'Lengkapi Profil Akademis',
    deskripsi: 'Isi jurusan, IPK, dan semester agar rekomendasi AI makin akurat.',
    href: '/profil',
    warna: 'from-cyan-500/20 to-blue-500/10',
    border: 'border-cyan-500/30',
  },
  {
    no: '02',
    ikon: <Brain size={18} className="text-purple-400" />,
    judul: 'Coba AI Pencocokan Beasiswa',
    deskripsi: 'Biarkan AI mencari beasiswa yang paling cocok denganmu.',
    href: '/beasiswa',
    warna: 'from-purple-500/20 to-indigo-500/10',
    border: 'border-purple-500/30',
  },
  {
    no: '03',
    ikon: <Award size={18} className="text-amber-400" />,
    judul: 'Unggah Materi & Raih Poin',
    deskripsi: 'Setiap unggahan memberimu +10 poin kontribusi.',
    href: '/jelajah/unggah',
    warna: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/30',
  },
];

export default function BannerOnboarding({ namaUser }: { namaUser: string }) {
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setTampil(true);
    }
  }, []);

  const tutup = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setTampil(false);
  };

  if (!tampil) return null;

  const firstName = namaUser.split(' ')[0];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl animate-fade-in-up">
      <div
        className="relative rounded-2xl shadow-2xl border backdrop-blur-lg overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0e1635 0%, #1a1a4e 50%, #0d1b2e 100%)',
          borderColor: 'rgba(99,102,241,0.4)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.15)',
        }}
      >
        {/* Glow effect */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full blur-2xl opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
        />

        <div className="relative z-10 p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Selamat Datang di Lentera! 🎉
                </span>
              </div>
              <p className="text-sm text-white font-semibold">
                Hai <span className="text-cyan-300">{firstName}</span>! Ini 3 langkah untuk memulai:
              </p>
            </div>
            <button
              onClick={tutup}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 mt-0.5"
              aria-label="Tutup panduan onboarding"
            >
              <X size={16} />
            </button>
          </div>

          {/* Langkah-langkah */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
            {LANGKAH_ONBOARDING.map((step) => (
              <Link
                key={step.no}
                href={step.href}
                onClick={tutup}
                className={`group p-3 rounded-xl border bg-gradient-to-br ${step.warna} ${step.border} hover:brightness-110 transition-all`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-xs font-black text-white/30">{step.no}</span>
                  {step.ikon}
                </div>
                <p className="text-xs font-bold text-white mb-0.5">{step.judul}</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">{step.deskripsi}</p>
                <div className="flex items-center gap-0.5 text-[11px] font-bold text-white/50 group-hover:text-white/80 mt-1.5 transition-colors">
                  Mulai <ChevronRight size={11} />
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={tutup}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium"
          >
            Saya sudah paham, sembunyikan panduan ini
          </button>
        </div>
      </div>
    </div>
  );
}
