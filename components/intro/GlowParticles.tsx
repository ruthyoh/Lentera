'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  /** Target posisi y (ke atas, negatif) — dihitung sekali saat mount */
  yTarget: number;
  /** Drift horizontal — dihitung sekali saat mount */
  xDrift: number;
}

interface GlowParticlesProps {
  /** apakah partikel aktif dan terlihat */
  active?: boolean;
  /** jumlah partikel (default 12) */
  count?: number;
  className?: string;
}

/**
 * Partikel emas kecil yang melayang ke atas dari lentera.
 * Partikel dibuat hanya di client (useEffect) untuk menghindari
 * hydration mismatch akibat Math.random() yang berbeda di SSR vs CSR.
 */
export default function GlowParticles({
  active = false,
  count = 14,
  className = '',
}: GlowParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Buat partikel hanya sekali di client setelah mount
  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 80,
        delay: Math.random() * 2.5,
        duration: 2.8 + Math.random() * 2.2,
        size: 2 + Math.random() * 3.5,
        opacity: 0.25 + Math.random() * 0.55,
        yTarget: -(80 + Math.random() * 60),
        xDrift: (Math.random() - 0.5) * 24,
      }))
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Saat SSR / sebelum mount: render nothing → tidak ada hydration conflict
  if (particles.length === 0) return null;

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `calc(50% + ${p.x}px)`,
            bottom: '0%',
            background: 'radial-gradient(circle, #FDE68A, #F59E0B)',
            boxShadow: `0 0 ${p.size * 2}px #F59E0B, 0 0 ${p.size}px #FCD34D`,
            willChange: 'transform, opacity',
          }}
          animate={
            active
              ? {
                  y: [0, p.yTarget],
                  x: [0, p.xDrift],
                  opacity: [0, p.opacity, p.opacity * 0.6, 0],
                  scale: [0.4, 1, 0.8, 0.3],
                }
              : { opacity: 0 }
          }
          transition={
            active
              ? {
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeOut',
                }
              : {}
          }
        />
      ))}
    </motion.div>
  );
}

