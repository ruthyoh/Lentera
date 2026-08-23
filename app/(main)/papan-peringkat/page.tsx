import type { Metadata } from 'next';
import { Trophy, Medal, Star, TrendingUp, Crown, BookOpen, Upload, Award } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { createAdminClient } from '@/lib/supabase/admin';

export const metadata: Metadata = {
  title: 'Papan Peringkat | Lentera',
  description: 'Lihat peringkat kontributor terbaik platform Lentera. Raih poin dengan berbagi materi dan membantu sesama mahasiswa.',
};

const ikonPeringkat: Record<number, React.ReactNode> = {
  1: <Crown size={22} className="text-yellow-400" fill="currentColor" />,
  2: <Medal size={20} className="text-gray-300" />,
  3: <Medal size={20} className="text-amber-500" />,
};

export default async function HalamanPapanPeringkat() {
  const admin = createAdminClient();

  // Query top 20 profiles berdasarkan poin_kontribusi
  const { data: daftarProfil, error } = await admin
    .from('profiles')
    .select('id, nama_lengkap, jurusan, poin_kontribusi, avatar_url')
    .order('poin_kontribusi', { ascending: false })
    .limit(20);

  if (error) {
    console.error('[papan-peringkat] Error mengambil profil:', error);
  }

  // Single aggregate query untuk semua materi
  const profileIds = daftarProfil?.map((p) => p.id) || [];

  const { data: semuaMateri } = await admin
    .from('materi')
    .select('uploader_id, jumlah_unduhan')
    .in('uploader_id', profileIds.length > 0 ? profileIds : ['__none__']);

  const mapKontribusi: Record<string, { jumlahMateri: number; totalUnduhan: number }> = {};
  if (semuaMateri) {
    for (const m of semuaMateri) {
      if (!mapKontribusi[m.uploader_id]) {
        mapKontribusi[m.uploader_id] = { jumlahMateri: 0, totalUnduhan: 0 };
      }
      mapKontribusi[m.uploader_id].jumlahMateri += 1;
      mapKontribusi[m.uploader_id].totalUnduhan += m.jumlah_unduhan || 0;
    }
  }

  type EntriPeringkat = {
    peringkat: number;
    id: string;
    nama: string;
    jurusan: string;
    poin: number;
    kontribusi: number;
    unduhan: number;
  };

  const peringkat: EntriPeringkat[] = (daftarProfil || []).map((p, i) => ({
    peringkat: i + 1,
    id: p.id,
    nama: p.nama_lengkap || 'Pengguna Lentera',
    jurusan: p.jurusan || 'Tidak diisi',
    poin: p.poin_kontribusi || 0,
    kontribusi: mapKontribusi[p.id]?.jumlahMateri || 0,
    unduhan: mapKontribusi[p.id]?.totalUnduhan || 0,
  }));

  const top3 = peringkat.slice(0, 3);
  const urutan = [1, 0, 2];
  const podium = urutan.map((i) => top3[i]).filter(Boolean);

  const bulanTahunIni = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div
      className="min-h-screen pt-16"
      style={{
        background: 'linear-gradient(180deg, #07132a 0%, #0b1d3a 30%, #0d2348 60%, #091830 100%)',
      }}
    >
      {/* ===================================================
          HERO HEADER — Dark Indigo Celestial
          =================================================== */}
      <div className="relative overflow-hidden border-b border-white/10 py-16">
        {/* Ambient Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-25 pointer-events-none blur-3xl"
          style={{ background: 'radial-gradient(circle, #F59E0B 0%, rgba(245, 158, 11, 0.1) 60%, transparent 80%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(251, 191, 36, 0.4) 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
          }}
        />

        <div className="container-lentera relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 bg-amber-500/15 text-amber-300 border border-amber-500/25 backdrop-blur-md">
              <Trophy size={14} className="text-amber-400" />
              Papan Peringkat · Kontributor Terbaik
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 text-white tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Pahlawan{' '}
              <span className="text-[var(--color-gold-400)]">Lentera</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Penghargaan tertinggi bagi mahasiswa yang aktif berbagi ilmu, rangkuman, dan materi akademis untuk menyinari masa depan sesama.
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================
          KONTEN UTAMA — Background Biru Tua (Seragam)
          =================================================== */}
      <div className="container-lentera py-10">

        {/* Banner Cara Mendapat Poin */}
        <div
          className="rounded-2xl p-5 mb-8 flex flex-col md:flex-row items-center gap-4 border border-amber-500/30 backdrop-blur-md"
          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
          role="note"
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-500 text-slate-950 font-bold shadow-md"
            aria-hidden="true"
          >
            <Star size={22} className="fill-slate-950" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="font-bold text-sm text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Bagaimana Cara Mengumpulkan Poin Kontribusi?
            </p>
            <p className="text-xs text-slate-300 mt-0.5">
              Unggah materi baru{' '}
              <strong className="text-amber-300">(+10 poin)</strong> · Aktif berinteraksi dengan fitur AI{' '}
              <strong className="text-amber-300">(dicatat otomatis)</strong>
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-medium">
            <span className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
              📄 Unggah Materi = +10 Poin
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-semibold">
              🤖 Gunakan AI = Poin Bonus
            </span>
          </div>
        </div>

        {peringkat.length === 0 ? (
          <div
            className="p-12 text-center max-w-lg mx-auto space-y-4 rounded-2xl border"
            style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <Trophy size={40} className="mx-auto text-amber-400" />
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              Belum Ada Kontributor
            </h2>
            <p className="text-sm text-slate-400">
              Jadilah yang pertama mengunggah materi dan memuncaki papan peringkat Lentera!
            </p>
          </div>
        ) : (
          <>
            {/* TOP 3 PODIUM */}
            {podium.length >= 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
                {podium.map((data) => {
                  if (!data) return null;
                  const isJuara1 = data.peringkat === 1;
                  const isJuara2 = data.peringkat === 2;
                  const isJuara3 = data.peringkat === 3;
                  const inisial = data.nama.split(' ').slice(0, 2).map((k) => k[0]).join('');

                  return (
                    <div
                      key={data.peringkat}
                      className={[
                        'rounded-3xl text-center relative border transition-all duration-300 backdrop-blur-md',
                        isJuara1
                          ? 'p-8 md:-mt-6 border-amber-400/80 shadow-2xl shadow-amber-500/20 z-10'
                          : 'p-6 border-white/10 hover:border-white/20 hover:-translate-y-1',
                      ].join(' ')}
                      style={{
                        background: isJuara1
                          ? 'linear-gradient(180deg, rgba(251, 191, 36, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)'
                          : 'rgba(255, 255, 255, 0.04)',
                      }}
                    >
                      {/* Badge Peringkat */}
                      <div
                        className={[
                          'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl shadow-md border',
                          isJuara1
                            ? 'bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 border-amber-300'
                            : isJuara2
                            ? 'bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-950 border-slate-300'
                            : 'bg-gradient-to-tr from-amber-700 to-amber-500 text-white border-amber-600',
                        ].join(' ')}
                        aria-label={`Peringkat ${data.peringkat}`}
                      >
                        {ikonPeringkat[data.peringkat] || data.peringkat}
                      </div>

                      {/* Avatar */}
                      <div
                        className={[
                          'w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold border-2',
                          isJuara1 ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-white/10 border-white/20 text-slate-200',
                        ].join(' ')}
                        aria-hidden="true"
                      >
                        {inisial}
                      </div>

                      <h2 className="font-bold text-base mb-1 text-white" style={{ fontFamily: 'var(--font-display)' }}>
                        {data.nama}
                      </h2>
                      <p className="text-xs mb-3 text-slate-400 font-medium">{data.jurusan}</p>

                      <div className="my-3 py-2 px-4 rounded-xl bg-amber-500/10 inline-block border border-amber-500/30">
                        <p className="text-2xl font-extrabold text-amber-400" style={{ fontFamily: 'var(--font-display)' }}>
                          {data.poin.toLocaleString('id-ID')}
                        </p>
                        <p className="text-[11px] font-bold tracking-wider uppercase text-amber-300">Poin Utama</p>
                      </div>

                      <div className="flex justify-center gap-4 mt-3 pt-3 border-t border-white/10 text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-medium">
                          <Upload size={12} className="text-amber-400" /> {data.kontribusi} materi
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <TrendingUp size={12} className="text-cyan-400" /> {data.unduhan.toLocaleString('id-ID')} unduhan
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TABEL LENGKAP */}
            <div
              className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-8 backdrop-blur-md"
              style={{ background: 'rgba(255, 255, 255, 0.04)' }}
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <h2 className="font-bold text-base text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    Peringkat Lengkap Kontributor
                  </h2>
                </div>
                <Badge varian="gold" className="text-xs font-semibold px-3 py-1">
                  Periode {bulanTahunIni}
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full" aria-label="Tabel papan peringkat kontributor Lentera">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">#</th>
                      <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Mahasiswa</th>
                      <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider hidden md:table-cell text-slate-400">Jurusan</th>
                      <th className="text-right px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <span className="flex items-center justify-end gap-1.5">
                          <Star size={12} className="text-amber-400 fill-amber-400" /> Total Poin
                        </span>
                      </th>
                      <th className="text-right px-6 py-3.5 text-xs font-bold uppercase tracking-wider hidden sm:table-cell text-slate-400">
                        <span className="flex items-center justify-end gap-1.5">
                          <BookOpen size={12} className="text-amber-400" /> Kontribusi
                        </span>
                      </th>
                      <th className="text-right px-6 py-3.5 text-xs font-bold uppercase tracking-wider hidden lg:table-cell text-slate-400">
                        Unduhan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {peringkat.map((user) => (
                      <tr key={user.id} className="transition-colors hover:bg-white/5">
                        <td className="px-6 py-4">
                          <span
                            className="inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-extrabold"
                            style={
                              user.peringkat === 1
                                ? { background: 'linear-gradient(135deg, #fde68a, #fbbf24)', color: '#78350f' }
                                : user.peringkat === 2
                                ? { background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)', color: '#334155' }
                                : user.peringkat === 3
                                ? { background: 'linear-gradient(135deg, #fed7aa, #d97706)', color: '#7c2d12' }
                                : { background: 'rgba(255,255,255,0.08)', color: '#cbd5e1' }
                            }
                          >
                            {user.peringkat}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {user.nama.split(' ').slice(0, 2).map((k) => k[0]).join('')}
                            </div>
                            <span className="font-semibold text-sm text-white">{user.nama}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm hidden md:table-cell text-slate-300 font-medium">
                          {user.jurusan}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-extrabold text-sm text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/30">
                            {user.poin.toLocaleString('id-ID')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm hidden sm:table-cell text-slate-300 font-medium">
                          {user.kontribusi} berkas
                        </td>
                        <td className="px-6 py-4 text-right text-sm hidden lg:table-cell text-slate-400 font-medium">
                          {user.unduhan.toLocaleString('id-ID')}×
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA Section */}
            <div className="rounded-3xl p-8 text-center bg-gradient-to-r from-cyan-900/30 via-indigo-900/40 to-blue-900/30 text-white border border-amber-500/30 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(251, 191, 36, 0.4) 1px, transparent 1px)`,
                  backgroundSize: '36px 36px',
                }}
              />
              <div className="relative z-10">
                <Award size={36} className="mx-auto text-amber-400 mb-3" />
                <h3 className="text-xl font-extrabold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Masuk ke Papan Peringkat!
                </h3>
                <p className="text-sm text-slate-300 mb-5 max-w-md mx-auto">
                  Unggah materi belajarmu dan raih poin kontribusi. Setiap unggahan bernilai <strong className="text-amber-400">+10 poin</strong>!
                </p>
                <a
                  href="/jelajah/unggah"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg transition-all active:scale-95"
                >
                  <Upload size={16} /> Unggah Materi Sekarang
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom padding */}
      <div className="pb-16" />
    </div>
  );
}
