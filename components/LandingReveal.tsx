'use client';

import { motion } from 'framer-motion';

interface LandingRevealProps {
  children: React.ReactNode;
  /** Apakah konten boleh ditampilkan (intro sudah selesai) */
  ready: boolean;
}

/**
 * LandingReveal — membungkus seluruh konten landing page
 * dengan animasi reveal yang sinematik setelah intro selesai.
 *
 * Efek: fade-in + blur → normal + translateY 12px → 0
 */
export default function LandingReveal({ children, ready }: LandingRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)', y: 12 }}
      animate={ready
        ? { opacity: 1, filter: 'blur(0px)', y: 0 }
        : { opacity: 0, filter: 'blur(8px)', y: 12 }
      }
      transition={{
        duration: 0.75,
        ease: [0.25, 0.46, 0.45, 0.94],
        // filter blur sedikit lebih lambat untuk kesan sinematik
        filter: { duration: 0.9, ease: 'easeOut' },
      }}
      style={{ willChange: 'opacity, transform, filter' }}
    >
      {children}
    </motion.div>
  );
}
