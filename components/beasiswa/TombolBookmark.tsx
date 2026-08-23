'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface TombolBookmarkProps {
  beasiswaId: string;
  namaBeasiswa: string;
}

const STORAGE_KEY = 'lentera_bookmarked_beasiswa';

export function getBookmarkedBeasiswa(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function setBookmarkedBeasiswa(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export default function TombolBookmark({ beasiswaId, namaBeasiswa }: TombolBookmarkProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const list = getBookmarkedBeasiswa();
    setIsBookmarked(list.includes(beasiswaId));
  }, [beasiswaId]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const list = getBookmarkedBeasiswa();
    let updated: string[];

    if (isBookmarked) {
      updated = list.filter((id) => id !== beasiswaId);
      setToastMsg(`"${namaBeasiswa}" dihapus dari simpanan`);
    } else {
      updated = [...list, beasiswaId];
      setToastMsg(`"${namaBeasiswa}" disimpan!`);
    }

    setBookmarkedBeasiswa(updated);
    setIsBookmarked(!isBookmarked);

    // Show toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <>
      <button
        onClick={toggleBookmark}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border"
        style={
          isBookmarked
            ? { background: 'rgba(168,85,247,0.15)', borderColor: 'rgba(168,85,247,0.4)', color: '#a855f7' }
            : { background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }
        }
        title={isBookmarked ? 'Hapus dari simpanan' : 'Simpan beasiswa ini'}
        aria-label={isBookmarked ? 'Hapus simpanan beasiswa' : 'Simpan beasiswa'}
      >
        {isBookmarked ? (
          <BookmarkCheck size={14} className="fill-purple-400 text-purple-400" />
        ) : (
          <Bookmark size={14} />
        )}
        {isBookmarked ? 'Tersimpan' : 'Simpan'}
      </button>

      {/* Toast Notification */}
      {showToast && (
        <div
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-xs font-bold text-white shadow-2xl animate-fade-in-up"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)', border: '1px solid rgba(168,85,247,0.4)' }}
          role="alert"
          aria-live="polite"
        >
          <span className="mr-2">🔖</span>
          {toastMsg}
        </div>
      )}
    </>
  );
}
