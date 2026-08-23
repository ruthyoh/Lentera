'use client';

import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface HitungMundurDeadlineProps {
  deadline: string | null;
  className?: string;
}

export default function HitungMundurDeadline({ deadline, className = '' }: HitungMundurDeadlineProps) {
  const [sisaHari, setSisaHari] = useState<number | null>(null);

  useEffect(() => {
    if (!deadline) {
      setSisaHari(null);
      return;
    }
    const target = new Date(deadline);
    const now = new Date();
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    setSisaHari(diff);
  }, [deadline]);

  if (!deadline) {
    return (
      <span className={`flex items-center gap-1 text-xs font-medium text-slate-400 ${className}`}>
        <Clock size={12} />
        Segera
      </span>
    );
  }

  const deadlineFormatted = new Date(deadline).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (sisaHari === null) {
    return (
      <span className={`flex items-center gap-1 text-xs font-medium text-slate-400 ${className}`}>
        <Clock size={12} />
        {deadlineFormatted}
      </span>
    );
  }

  if (sisaHari < 0) {
    return (
      <span className={`flex items-center gap-1 text-xs font-bold text-red-400 ${className}`}>
        <AlertTriangle size={12} />
        Sudah Ditutup
      </span>
    );
  }

  if (sisaHari <= 7) {
    return (
      <span className={`flex items-center gap-1 text-xs font-bold text-amber-400 ${className}`}>
        <AlertTriangle size={12} className="animate-pulse" />
        {sisaHari === 0 ? 'Hari Ini!' : `${sisaHari} hari lagi!`}
        <span className="text-slate-400 font-normal">· {deadlineFormatted}</span>
      </span>
    );
  }

  return (
    <span className={`flex items-center gap-1 text-xs font-semibold text-amber-300 ${className}`}>
      <Clock size={12} />
      <span className="text-white font-bold">{sisaHari} hari</span>
      <span className="text-slate-400 font-normal">· {deadlineFormatted}</span>
    </span>
  );
}
