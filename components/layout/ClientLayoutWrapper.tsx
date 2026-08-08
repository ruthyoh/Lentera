'use client';

import { useIntro } from '@/hooks/useIntro';
import IntroScreen from '@/components/IntroScreen';
import LandingReveal from '@/components/LandingReveal';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { ProfilRingkas } from '@/types';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
  profil: ProfilRingkas | null;
}

/**
 * ClientLayoutWrapper — orchestrator utama layout.
 *
 * Tanggung jawab:
 * 1. Mengelola state intro (via useIntro)
 * 2. Menyembunyikan navbar selama intro berjalan
 * 3. Membungkus konten dengan LandingReveal
 * 4. Menampilkan IntroScreen saat dibutuhkan
 */
export default function ClientLayoutWrapper({
  children,
  profil,
}: ClientLayoutWrapperProps) {
  const { showIntro, introComplete, handleIntroComplete } = useIntro();

  return (
    <>
      {/* Intro Screen — hanya muncul saat showIntro = true */}
      {showIntro && (
        <IntroScreen onComplete={handleIntroComplete} />
      )}

      {/* Navbar — disembunyikan selama intro */}
      <div
        style={{
          opacity: introComplete ? 1 : 0,
          transition: 'opacity 0.5s ease 0.2s',
          pointerEvents: introComplete ? 'auto' : 'none',
        }}
        aria-hidden={!introComplete}
      >
        <Navbar profil={profil} />
      </div>

      {/* Konten utama dengan reveal animation */}
      <LandingReveal ready={introComplete}>
        <main id="konten-utama" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </LandingReveal>
    </>
  );
}

