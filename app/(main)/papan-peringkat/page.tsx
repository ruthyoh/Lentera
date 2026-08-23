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
  2: <Medal size={20} className="text-gray-400" />,
  3: <Medal size={20} className="text-amber-600" />,
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

  // FIX N+1: Single aggregate query untuk semua materi
  const profileIds = daftarProfil?.map((p) => p.id) || [];

  // Ambil semua materi dari user-user ini sekaligus
  const { data: semuaMateri } = await admin
    .from('materi')
    .select('uploader_id, jumlah_unduhan')
    .in('uploader_id', profileIds.length > 0 ? profileIds : ['__none__']);

  // Buat map aggregasi dari hasil query tunggal
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
    <div className="min-h-screen pt-16">
      {/* ===================================================
          HERO HEADER — Dark Indigo Celestial (seperti dashboard)
          =================================================== */}
      <div className="relative overflow-hidden border-b border-amber-500/20 bg-gradient-to-b from-[#0B1528] via-[#10203D] to-[#142647]">
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

        <div className="container-lentera relative z-10 py-16">
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
          KONTEN UTAMA — Background Cream/White (Terang)
          =================================================== */}
      <div style={{ background: 'var(--color-cream-200)' }}>
        <div className="container-lentera py-10">

          {/* Banner Cara Mendapat Poin */}
          <div
            className="bg-white/90 backdrop-blur-md rounded-2xl p-5 mb-8 flex flex-col md:flex-row items-center gap-4 border border-amber-200/80 shadow-xs"
            role="note"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-500 text-slate-900 font-bold shadow-md"
              aria-hidden="true"
            >
              <Star size={22} className="fill-slate-900" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="font-bold text-sm text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
                Bagaimana Cara Mengumpulkan Poin Kontribusi?
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Unggah materi baru{' '}
                <strong className="text-amber-700">(+10 poin)</strong> · Aktif berinteraksi dengan fitur AI{' '}
                <strong className="text-amber-700">(dicatat otomatis)</strong>
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-600 font-medium">
              <span className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-semibold">
                📄 Unggah Materi = +10 Poin
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 font-semibold">
                🤖 Gunakan AI = Poin Bonus
              </span>
            </div>
          </div>

          {peringkat.length === 0 ? (
            <div className="card-glass p-12 text-center max-w-lg mx-auto space-y-4">
              <Trophy size={40} className="mx-auto text-amber-400" />
              <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
                Belum Ada Kontributor
              </h2>
              <p className="text-sm text-slate-500">
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
                          'bg-white/90 backdrop-blur-md rounded-3xl text-center relative border transition-all duration-300',
                          isJuara1
                            ? 'p-8 md:-mt-6 border-amber-400 ring-4 ring-amber-400/40 shadow-2xl shadow-amber-500/20 z-10 bg-gradient-to-b from-amber-50/90 via-white/95 to-white'
                            : 'p-6 border-slate-200/80 shadow-lg hover:shadow-xl hover:-translate-y-1',
                        ].join(' ')}
                      >
                        {/* Badge Peringkat */}
                        <div
                          className={[
                            'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl shadow-md border',
                            isJuara1
                              ? 'bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-900 border-amber-300'
                              : isJuara2
                              ? 'bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-800 border-slate-300'
                              : 'bg-gradient-to-tr from-amber-700 to-amber-500 text-white border-amber-600',
                          ].join(' ')}
                          aria-label={`Peringkat ${data.peringkat}`}
                        >
                          {ikonPeringkat[data.peringkat] || data.peringkat}
                        </div>

                        {/* Avatar */}
                        <div
                          className={[
                            'w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold shadow-inner border-2',
                            isJuara1 ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-slate-100 border-slate-200 text-slate-700',
                          ].join(' ')}
                          aria-hidden="true"
                        >
                          {inisial}
                        </div>

                        <h2 className="font-bold text-base mb-1 text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
                          {data.nama}
                        </h2>
                        <p className="text-xs mb-3 text-slate-500 font-medium">{data.jurusan}</p>

                        <div className="my-3 py-2 px-4 rounded-xl bg-amber-50/80 inline-block border border-amber-200/50">
                          <p className="text-2xl font-extrabold text-amber-600" style={{ fontFamily: 'var(--font-display)' }}>
                            {data.poin.toLocaleString('id-ID')}
                          </p>
                          <p className="text-[11px] font-bold tracking-wider uppercase text-amber-700">Poin Utama</p>
                        </div>

                        <div className="flex justify-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                          <span className="flex items-center gap-1 font-medium">
                            <Upload size={12} className="text-amber-600" /> {data.kontribusi} materi
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <TrendingUp size={12} className="text-teal-600" /> {data.unduhan.toLocaleString('id-ID')} unduhan
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TABEL LENGKAP */}
              <div className="bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl mb-8">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/50 via-white to-white">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <h2 className="font-bold text-base text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
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
                      <tr className="bg-slate-50/80 border-b border-slate-100">
                        <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">#</th>
                        <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">Mahasiswa</th>
                        <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider hidden md:table-cell text-slate-500">Jurusan</th>
                        <th className="text-right px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                          <span className="flex items-center justify-end gap-1.5">
                            <Star size={12} className="text-amber-500 fill-amber-500" /> Total Poin
                          </span>
                        </th>
                        <th className="text-right px-6 py-3.5 text-xs font-bold uppercase tracking-wider hidden sm:table-cell text-slate-500">
                          <span className="flex items-center justify-end gap-1.5">
                            <BookOpen size={12} className="text-amber-600" /> Kontribusi
                          </span>
                        </th>
                        <th className="text-right px-6 py-3.5 text-xs font-bold uppercase tracking-wider hidden lg:table-cell text-slate-500">
                          Unduhan
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {peringkat.map((user) => (
                        <tr key={user.id} className="transition-colors hover:bg-amber-50/40">
                          <td className="px-6 py-4">
                            <span
                              className="inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-extrabold shadow-2xs"
                              style={
                                user.peringkat === 1
                                  ? { background: 'linear-gradient(135deg, #fde68a, #fbbf24)', color: '#78350f' }
                                  : user.peringkat === 2
                                  ? { background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)', color: '#334155' }
                                  : user.peringkat === 3
                                  ? { background: 'linear-gradient(135deg, #fed7aa, #d97706)', color: '#7c2d12' }
                                  : { background: '#f8fafc', color: '#64748b' }
                              }
                            >
                              {user.peringkat}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-amber-100 text-amber-900 border border-amber-200/60">
                                {user.nama.split(' ').slice(0, 2).map((k) => k[0]).join('')}
                              </div>
                              <span className="font-semibold text-sm text-slate-900">{user.nama}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm hidden md:table-cell text-slate-500 font-medium">
                            {user.jurusan}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-extrabold text-sm text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/50">
                              {user.poin.toLocaleString('id-ID')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm hidden sm:table-cell text-slate-500 font-medium">
                            {user.kontribusi} berkas
                          </td>
                          <td className="px-6 py-4 text-right text-sm hidden lg:table-cell text-slate-500 font-medium">
                            {user.unduhan.toLocaleString('id-ID')}×
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CTA Section (seperti dashboard — dark section di bawah) */}
              <div className="rounded-2xl p-8 text-center bg-gradient-to-r from-[#0B1528] to-[#1a1040] text-white border border-amber-500/20 shadow-xl relative overflow-hidden">
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
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-lg transition-all active:scale-95"
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
    </div>
  );
}
