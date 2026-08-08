'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'lentera_intro_shown';

/**
 * Hook untuk mengatur apakah intro screen perlu ditampilkan.
 * Menggunakan sessionStorage — intro muncul sekali per sesi browser.
 */
export function useIntro() {
  // Mulai dgn `true` (menampilkan intro) sampai kita bisa cek storage.
  const [showIntro, setShowIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(STORAGE_KEY);
    if (alreadyShown) {
      // Sesi sudah melihat intro, langsung skip
      setShowIntro(false);
      setIntroComplete(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem(STORAGE_KEY, 'true');
    setIntroComplete(true);
    // Beri sedikit jeda sebelum unmount intro
    setTimeout(() => setShowIntro(false), 100);
  };

  return { showIntro, introComplete, handleIntroComplete };
}
