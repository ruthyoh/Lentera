'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import FloatingLantern from './intro/FloatingLantern';
import GlowParticles from './intro/GlowParticles';

interface IntroScreenProps {
  onComplete: () => void;
}

/** Bintang-bintang kecil yang muncul di akhir intro */
interface StarConfig {
  top: string;
  left?: string;
  right?: string;
  size: number;
  delay: number;
}

const STARS: StarConfig[] = [
  { top: '18%', left: '12%', size: 3, delay: 0.1 },
  { top: '25%', right: '15%', size: 2.5, delay: 0.3 },
  { top: '70%', left: '18%', size: 2, delay: 0.2 },
  { top: '65%', right: '12%', size: 3, delay: 0.5 },
  { top: '38%', left: '6%', size: 2, delay: 0.4 },
  { top: '45%', right: '8%', size: 2.5, delay: 0.25 },
  { top: '82%', left: '40%', size: 2, delay: 0.6 },
];


/**
 * IntroScreen — cinematic splash screen.
 *
 * Urutan animasi:
 *   0.0–0.5s  → Background muncul (opacity 0→1 pada mount)
 *   0.5–1.0s  → Logo fade-in + scale 0.8→1
 *   1.0–1.6s  → Api lentera mulai hidup
 *   1.6–2.2s  → Floating loop dimulai (naik-turun + rotasi tipis)
 *   2.0–2.6s  → Partikel emas & warm glow muncul
 *   2.5–3.0s  → Glow membesar, bintang muncul
 *   3.0–3.4s  → Intro fade-out + blur, landing page reveal
 */
export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [flameActive, setFlameActive] = useState(false);
  const [floatActive, setFloatActive] = useState(false);
  const [particlesActive, setParticlesActive] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [starsVisible, setStarsVisible] = useState(false);
  const [visible, setVisible] = useState(true);

  const handleComplete = useCallback(() => {
    document.body.style.overflow = '';
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    // Kunci scroll selama intro
    document.body.style.overflow = 'hidden';

    const timers = [
      // 1.0s → Api mulai hidup
      setTimeout(() => setFlameActive(true), 1000),
      // 1.3s → Glow tumbuh pertama
      setTimeout(() => setGlowIntensity(0.55), 1300),
      // 1.6s → Floating loop dimulai
      setTimeout(() => setFloatActive(true), 1600),
      // 2.0s → Partikel + glow penuh
      setTimeout(() => {
        setParticlesActive(true);
        setGlowIntensity(1);
      }, 2000),
      // 2.5s → Bintang muncul
      setTimeout(() => setStarsVisible(true), 2500),
      // 3.0s → Mulai exit (unmount dengan AnimatePresence)
      setTimeout(() => setVisible(false), 3000),
      // 3.5s → Beri waktu exit animation, lalu selesai
      setTimeout(handleComplete, 3500),
    ];

    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = '';
    };
  }, [handleComplete]);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="intro-screen"
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: '#081B3A' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(14px)', scale: 0.96 }}
          transition={{
            opacity: { duration: 0.3, ease: 'easeOut' },
            filter: { duration: 0.42, ease: 'easeInOut' },
            scale: { duration: 0.42, ease: 'easeInOut' },
          }}
        >
          {/* ── Film-grain noise tipis untuk kedalaman ── */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }}
            aria-hidden="true"
          />

          {/* ── Ambient warm glow — inner (di sekitar lentera) ── */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: '520px',
              height: '520px',
              background:
                'radial-gradient(circle, rgba(245,158,11,0.22) 0%, rgba(217,119,6,0.10) 40%, transparent 70%)',
              filter: 'blur(48px)',
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: glowIntensity,
              scale: glowIntensity > 0.5 ? 1.12 : 0.95,
            }}
            transition={{ duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            aria-hidden="true"
          />

          {/* ── Bloom luar (halo lembut) ── */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: '860px',
              height: '860px',
              background:
                'radial-gradient(circle, rgba(253,230,138,0.06) 0%, transparent 65%)',
              filter: 'blur(72px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: glowIntensity * 0.7 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            aria-hidden="true"
          />

          {/* ── Bintang-bintang kecil ── */}
          {STARS.map((star, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                top: star.top,
                left: star.left,
                right: star.right,
                width: star.size,
                height: star.size,
                background: '#FDE68A',
                boxShadow: `0 0 ${star.size * 3}px #F59E0B, 0 0 ${star.size * 7}px rgba(245,158,11,0.35)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={
                starsVisible
                  ? { opacity: [0, 1, 0.75, 1], scale: [0, 1.3, 0.85, 1] }
                  : { opacity: 0, scale: 0 }
              }
              transition={{
                delay: star.delay,
                duration: 0.55,
                ease: 'easeOut',
              }}
              aria-hidden="true"
            />
          ))}

          {/* ── Area tengah: Lentera + Partikel ── */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: 300, height: 380 }}
          >
            {/* Partikel emas */}
            <GlowParticles
              active={particlesActive}
              count={14}
              className="bottom-[10%] left-0 right-0"
            />

            {/* Fase 1 — Logo muncul: opacity + scale */}
            <motion.div
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                opacity: { duration: 0.65, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                scale: { duration: 0.65, delay: 0.5, ease: [0.34, 1.3, 0.64, 1] },
              }}
              style={{ willChange: 'opacity, transform' }}
            >
              {/* Fase 2 — Floating loop: muncul setelah 1.6s, sangat halus */}
              <motion.div
                animate={
                  floatActive
                    ? {
                        y: [0, -5, 0, 5, 0],
                        rotate: [0, -0.7, 0, 0.7, 0],
                      }
                    : {}
                }
                transition={
                  floatActive
                    ? {
                        y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                        rotate: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                      }
                    : {}
                }
                style={{ willChange: 'transform' }}
              >
                <FloatingLantern
                  flameActive={flameActive}
                  glowIntensity={glowIntensity}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* ── Tagline bawah ── */}
          <motion.div
            className="absolute bottom-[10%] text-center select-none px-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: glowIntensity > 0.5 ? 1 : 0,
              y: glowIntensity > 0.5 ? 0 : 12,
            }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p
              className="text-sm font-light tracking-[0.28em] uppercase"
              style={{
                color: 'rgba(253,230,138,0.60)',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                letterSpacing: '0.28em',
              }}
            >
              Cahaya Ilmu untuk Indonesia
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

