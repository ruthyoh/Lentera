'use client';

import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const VALUES = [
  'Belajar',
  'Berbagi',
  'Berinovasi',
  'Berkolaborasi',
  'Berkembang',
  'Berdampak',
];

/**
 * AnimatedValues — Komponen ticker kata bertema Lentera.
 * Kata-kata bergerak perlahan secara konstan ke kiri dalam infinite loop 60 FPS
 * menggunakan useAnimationFrame & useMotionValue tanpa jump/stutter.
 * Dilengkapi masking gradient fade-out dan pendaran glow cyan di kedua ujungnya.
 */
export default function AnimatedValues() {
  const baseX = useMotionValue(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [oneSetWidth, setOneSetWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (contentRef.current) {
        // Terdapat 4 set duplikasi kata; lebar 1 set adalah total scrollWidth / 4
        setOneSetWidth(contentRef.current.scrollWidth / 4);
      }
    };

    updateWidth();

    // Pantau perubahan ukuran layar / font
    const resizeObserver = new ResizeObserver(updateWidth);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Animasi pergerakan halus 60 FPS (kecepatan 38px/detik)
  useAnimationFrame((_, delta) => {
    if (oneSetWidth <= 0) return;
    const moveBy = (38 * delta) / 1000;
    let newX = baseX.get() - moveBy;

    // Loop mulus: saat bergeser sejauh 1 set penuh, reset kembali posisi seharga 1 set
    if (newX <= -oneSetWidth) {
      newX += oneSetWidth;
    }
    baseX.set(newX);
  });

  return (
    <div className="relative w-full overflow-hidden select-none py-1 pointer-events-none">
      {/* Glow cyan sangat halus di sisi kiri — hampir tidak nampak */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full pointer-events-none z-10 opacity-20 blur-md bg-cyan-400/15"
        aria-hidden="true"
      />
      {/* Glow cyan sangat halus di sisi kanan */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full pointer-events-none z-10 opacity-20 blur-md bg-cyan-400/15"
        aria-hidden="true"
      />

      {/* Masking container: fade in (kanan) & fade out (kiri) */}
      <div
        className="w-full overflow-hidden"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, transparent 100%)',
        }}
      >
        <motion.div
          ref={contentRef}
          style={{ x: baseX }}
          className="flex whitespace-nowrap gap-8 md:gap-10 items-center will-change-transform"
        >
          {/* 4 set duplikasi kata untuk menjamin kelancaran infinite ticker di semua resolusi */}
          {[...VALUES, ...VALUES, ...VALUES, ...VALUES].map((word, idx) => (
            <span
              key={`${word}-${idx}`}
              className="text-sm font-semibold text-white/90 tracking-wide shrink-0"
              style={{ fontFamily: 'var(--font-display, inherit)' }}
            >
              {word}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
