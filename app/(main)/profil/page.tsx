import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import TampilanProfil, { type ProfilData, type MateriUserItem, type RiwayatAIItem } from '@/components/profil/TampilanProfil';

export const metadata: Metadata = {
  title: 'Profil Saya | Lentera',
  description: 'Lihat dan kelola profil akun akademis Lentera Anda.',
};

export default async function HalamanProfil() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login?dari=/profil');
  }

  const admin = createAdminClient();

  // 1. Ambil profil pengguna dari database
  const { data: profilDB } = await admin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const profilData: ProfilData = {
    id: user.id,
    nama_lengkap:
      profilDB?.nama_lengkap ||
      user.user_metadata?.nama_lengkap ||
      user.email?.split('@')[0] ||
      'Pengguna Lentera',
    email: user.email || '',
    asal_institusi: profilDB?.asal_institusi || user.user_metadata?.asal_institusi || null,
    jurusan: profilDB?.jurusan || user.user_metadata?.jurusan || null,
    semester: profilDB?.semester ?? (user.user_metadata?.semester ? Number(user.user_metadata.semester) : null),
    ipk: profilDB?.ipk ?? (user.user_metadata?.ipk ? Number(user.user_metadata.ipk) : null),
    kategori_khusus: profilDB?.kategori_khusus || user.user_metadata?.kategori_khusus || null,
    poin_kontribusi: profilDB?.poin_kontribusi || 0,
    created_at: user.created_at,
  };

  // 2. Ambil statistik materi pengguna
  const { count: jumlahMateriCount } = await admin
    .from('materi')
    .select('*', { count: 'exact', head: true })
    .eq('uploader_id', user.id);

  const { data: materiUserRaw } = await admin
    .from('materi')
    .select('id, judul, mata_kuliah, kategori, jumlah_unduhan, jumlah_suka, created_at')
    .eq('uploader_id', user.id)
    .order('created_at', { ascending: false });

  const materiSaya: MateriUserItem[] = (materiUserRaw as MateriUserItem[]) || [];

  const totalUnduhan = materiSaya.reduce((acc, m) => acc + (m.jumlah_unduhan || 0), 0);
  const totalSuka = materiSaya.reduce((acc, m) => acc + (m.jumlah_suka || 0), 0);

  // 3. Ambil riwayat AI pengguna
  const { data: riwayatAIRaw } = await admin
    .from('interaksi_ai')
    .select('id, jenis, created_at, materi_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  const riwayatAI: RiwayatAIItem[] = (riwayatAIRaw as RiwayatAIItem[]) || [];

  const hitungPerJenis: Record<string, number> = {};
  riwayatAI.forEach((item) => {
    hitungPerJenis[item.jenis] = (hitungPerJenis[item.jenis] || 0) + 1;
  });

  // 4. Hitung peringkat global berdasarkan poin_kontribusi
  const { count: peringkatCount } = await admin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gt('poin_kontribusi', profilData.poin_kontribusi);

  return (
    <TampilanProfil
      profil={profilData}
      jumlahMateri={jumlahMateriCount || materiSaya.length}
      totalUnduhan={totalUnduhan}
      totalSuka={totalSuka}
      peringkat={peringkatCount}
      materiSaya={materiSaya}
      riwayatAI={riwayatAI}
      hitungPerJenis={hitungPerJenis}
    />
  );
}
