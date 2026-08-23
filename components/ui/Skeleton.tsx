import React from 'react';

// Skeleton for a Materi card
export function SkeletonMateriCard() {
  return (
    <div className="rounded-2xl p-6 border border-white/10 bg-white/5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/10" />
        <div className="w-16 h-5 rounded-full bg-white/10" />
      </div>
      <div className="h-4 bg-white/10 rounded-lg mb-2 w-full" />
      <div className="h-4 bg-white/10 rounded-lg mb-4 w-3/4" />
      <div className="h-3 bg-white/10 rounded-lg mb-6 w-1/2" />
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <div className="w-16 h-4 rounded-lg bg-white/10" />
        <div className="w-20 h-4 rounded-lg bg-white/10" />
      </div>
    </div>
  );
}

// Skeleton for a Beasiswa card (dark theme)
export function SkeletonBeasiswaCard() {
  return (
    <div className="rounded-2xl p-6 border border-white/10 bg-white/5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-16 h-5 rounded-full bg-white/10" />
        <div className="w-20 h-5 rounded-full bg-white/10" />
      </div>
      <div className="h-5 bg-white/10 rounded-lg mb-1 w-full" />
      <div className="h-5 bg-white/10 rounded-lg mb-4 w-2/3" />
      <div className="h-3 bg-white/10 rounded-lg mb-6 w-1/3" />
      <div className="space-y-2 mb-4 p-3 rounded-xl border border-white/5 bg-white/5">
        <div className="h-3 bg-white/10 rounded w-full" />
        <div className="h-3 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
      </div>
    </div>
  );
}

// Skeleton for light-theme card (detail page, leaderboard)
export function SkeletonLightCard() {
  return (
    <div className="rounded-2xl p-6 border border-slate-200 bg-white animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-2/3" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-3 bg-slate-200 rounded w-4/5" />
      </div>
    </div>
  );
}

// Grid of skeletons for dark pages
export function SkeletonGridGelap({ jumlah = 6 }: { jumlah?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: jumlah }).map((_, i) => (
        <SkeletonBeasiswaCard key={i} />
      ))}
    </div>
  );
}
