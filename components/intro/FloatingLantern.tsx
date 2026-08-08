'use client';

import { motion } from 'framer-motion';

interface FloatingLanternProps {
  /** 0–1: intensitas glow di sekitar lentera */
  glowIntensity?: number;
  /** apakah api sudah mulai hidup */
  flameActive?: boolean;
  className?: string;
}

/**
 * SVG lentera emas premium yang bisa mengambang.
 * Komponen ini hanya menangani visual lentera itu sendiri.
 * Animasi floating dikendalikan oleh parent (IntroScreen).
 */
export default function FloatingLantern({
  glowIntensity = 0,
  flameActive = false,
  className = '',
}: FloatingLanternProps) {
  return (
    <div className={`relative select-none ${className}`} style={{ willChange: 'transform' }}>
      {/* Warm radial glow di balik lentera */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 55%, #F59E0B, #D97706, transparent 65%)',
          filter: 'blur(32px)',
          transform: 'scale(1.8)',
          willChange: 'opacity',
        }}
        animate={{ opacity: glowIntensity * 0.7 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      {/* Outer bloom — lebih besar, lebih lembut */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #FDE68A, transparent 70%)',
          filter: 'blur(60px)',
          transform: 'scale(2.6)',
          willChange: 'opacity',
        }}
        animate={{ opacity: glowIntensity * 0.45 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      {/* SVG Lentera Emas Premium */}
      <svg
        width="180"
        height="240"
        viewBox="0 0 180 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Logo lentera emas Lentera platform"
      >
        <defs>
          {/* Gradient badan lentera */}
          <linearGradient id="lanternBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          {/* Gradient cincin emas */}
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Gradient pita/daun ungu */}
          <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#5B21B6" />
          </linearGradient>

          {/* Gradient cahaya dalam */}
          <radialGradient id="innerGlow" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.2" />
          </radialGradient>

          {/* Gradient highlight kaca lentera */}
          <linearGradient id="glassShine" x1="15%" y1="0%" x2="35%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.35" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* Filter glow untuk api */}
          <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip path badan lentera */}
          <clipPath id="lanternClip">
            <path d="M55 65 C48 75 40 100 42 130 C44 158 62 178 90 180 C118 178 136 158 138 130 C140 100 132 75 125 65 Z" />
          </clipPath>
        </defs>

        {/* ── Cincin emas belakang (decorative ring) ── */}
        <ellipse cx="90" cy="118" rx="72" ry="72" stroke="url(#ringGrad)" strokeWidth="3.5" fill="none" opacity="0.8" />
        <ellipse cx="90" cy="118" rx="62" ry="62" stroke="url(#ringGrad)" strokeWidth="1.5" fill="none" opacity="0.4" />

        {/* ── Tali gantung ── */}
        <line x1="90" y1="14" x2="90" y2="38" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="90" cy="12" rx="7" ry="4" fill="url(#ringGrad)" />

        {/* ── Mahkota / tutup atas lentera ── */}
        <path
          d="M60 65 L68 50 L80 58 L90 44 L100 58 L112 50 L120 65 Z"
          fill="url(#lanternBody)"
          stroke="#B45309"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path d="M58 67 H122" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />

        {/* ── Badan lentera — layer dasar ── */}
        <path
          d="M58 67 C50 80 42 108 44 132 C46 162 64 182 90 183 C116 182 134 162 136 132 C138 108 130 80 122 67 Z"
          fill="url(#lanternBody)"
        />

        {/* ── Cahaya dalam (flame glow) ── */}
        <motion.path
          d="M58 67 C50 80 42 108 44 132 C46 162 64 182 90 183 C116 182 134 162 136 132 C138 108 130 80 122 67 Z"
          fill="url(#innerGlow)"
          animate={flameActive ? { opacity: [0.5, 0.85, 0.6, 0.9, 0.7] } : { opacity: 0.3 }}
          transition={flameActive
            ? { duration: 2.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
            : { duration: 0.5 }
          }
        />

        {/* ── Highlight kaca (shine) ── */}
        <path
          d="M65 80 C60 90 57 110 58 130 C60 145 68 160 80 168"
          stroke="url(#glassShine)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Rusuk / bingkai vertikal lentera ── */}
        {[70, 90, 110].map((x) => (
          <motion.path
            key={x}
            d={`M${x} 67 C${x - 2} 110 ${x - 2} 145 ${x + 2} 183`}
            stroke="#B45309"
            strokeWidth="1.2"
            strokeOpacity="0.5"
            fill="none"
          />
        ))}

        {/* ── Api / flame utama ── */}
        <motion.g
          filter="url(#flameGlow)"
          animate={flameActive
            ? {
                scaleY: [1, 1.12, 0.92, 1.08, 1],
                scaleX: [1, 0.95, 1.04, 0.97, 1],
                translateY: [0, -1, 1, -0.5, 0],
              }
            : {}}
          transition={flameActive
            ? { duration: 1.8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
            : {}}
          style={{ originX: '90px', originY: '120px' }}
        >
          {/* Api luar — tepi keemasan */}
          <path
            d="M90 95 C84 100 80 108 80 115 C80 124 84 130 90 132 C96 130 100 124 100 115 C100 108 96 100 90 95Z"
            fill="#F59E0B"
            opacity="0.9"
          />
          {/* Api tengah — lebih terang */}
          <path
            d="M90 100 C86 105 84 111 84 116 C84 123 86 128 90 130 C94 128 96 123 96 116 C96 111 94 105 90 100Z"
            fill="#FDE68A"
          />
          {/* Api inti — putih bersih */}
          <path
            d="M90 108 C88 112 87 116 87 119 C87 124 88 127 90 128 C92 127 93 124 93 119 C93 116 92 112 90 108Z"
            fill="white"
            opacity="0.95"
          />
        </motion.g>

        {/* ── Dasar lentera ── */}
        <path d="M66 183 L72 192 H108 L114 183 Z" fill="url(#lanternBody)" stroke="#B45309" strokeWidth="1" />
        <ellipse cx="90" cy="192" rx="18" ry="5" fill="#B45309" />

        {/* ── Pita / daun ungu di bawah ── */}
        <path
          d="M75 198 C70 206 68 216 72 222 C76 228 84 226 90 220 C96 226 104 228 108 222 C112 216 110 206 105 198 Z"
          fill="url(#ribbonGrad)"
          opacity="0.9"
        />
        <path
          d="M90 198 L90 225"
          stroke="#7C3AED"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="3 2"
        />

        {/* ── Kilap/sparkle kecil di tepi cincin ── */}
        {flameActive && (
          <>
            <motion.circle
              cx="24" cy="80" r="3"
              fill="#FDE68A"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 0.3 }}
            />
            <motion.circle
              cx="158" cy="140" r="2.5"
              fill="#FCD34D"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.9 }}
            />
            <motion.circle
              cx="35" cy="155" r="2"
              fill="#F59E0B"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
            />
          </>
        )}
      </svg>
    </div>
  );
}
