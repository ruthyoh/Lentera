'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Beasiswa, JenisBeasiswa, StatusBeasiswa } from '@/types';

export interface DaftarBeasiswaResult {
  beasiswa: Beasiswa[];
  total: number;
  halaman: number;
  perHalaman: number;
  totalHalaman: number;
}

// -------------------------------------------------------
// Data Seed Beasiswa Riil (Minimal 9 Data)
// -------------------------------------------------------
const SEED_DATA_BEASISWA = [
  {
    nama_beasiswa: 'Beasiswa Unggulan Kemendikbud 2026',
    penyelenggara: 'Kemendikbudristek RI',
    jenis: 'pemerintah' as JenisBeasiswa,
    kriteria_jurusan: 'Semua Jurusan',
    kriteria_ipk_min: 3.0,
    kriteria_semester_min: 1,
    kriteria_khusus: 'Mahasiswa S1/D4/S2/S3 berprestasi, tidak sedang menerima beasiswa lain',
    deadline_pendaftaran: '2026-09-30',
    link_resmi: 'https://beasiswaunggulan.kemdikbud.go.id',
    deskripsi_singkat: 'Program beasiswa pemerintah untuk putra-putri terbaik bangsa yang berprestasi di jenjang D4, S1, S2, dan S3.',
    status: 'aktif' as StatusBeasiswa,
  },
  {
    nama_beasiswa: 'Beasiswa Bank Indonesia 2026',
    penyelenggara: 'Bank Indonesia',
    jenis: 'swasta' as JenisBeasiswa,
    kriteria_jurusan: 'Ekonomi, Manajemen, Akuntansi, TI, Hukum, Komunikasi',
    kriteria_ipk_min: 3.25,
    kriteria_semester_min: 3,
    kriteria_khusus: 'Aktif dalam kegiatan sosial/komunitas GenBI',
    deadline_pendaftaran: '2026-10-15',
    link_resmi: 'https://www.bi.go.id/id/edukasi/beasiswa',
    deskripsi_singkat: 'Beasiswa dan program pengembangan kepemimpinan GenBI untuk mahasiswa PTN dan PTS terpilih.',
    status: 'aktif' as StatusBeasiswa,
  },
  {
    nama_beasiswa: 'Beasiswa Djarum Beasiswa Plus 2026/2027',
    penyelenggara: 'Djarum Foundation',
    jenis: 'swasta' as JenisBeasiswa,
    kriteria_jurusan: 'Semua Jurusan S1/D4',
    kriteria_ipk_min: 3.0,
    kriteria_semester_min: 4,
    kriteria_khusus: 'Sedang menempuh semester 4 di perguruan tinggi mitra',
    deadline_pendaftaran: '2026-11-01',
    link_resmi: 'https://djarumbeasiswaplus.org',
    deskripsi_singkat: 'Bantuan dana pendidikan dan pembekalan soft skills kepemimpinan, karakter, dan wawasan kebangsaan.',
    status: 'aktif' as StatusBeasiswa,
  },
  {
    nama_beasiswa: 'Beasiswa LPDP Reguler 2026',
    penyelenggara: 'LPDP - Kementerian Keuangan RI',
    jenis: 'pemerintah' as JenisBeasiswa,
    kriteria_jurusan: 'Semua Jurusan (Pascasarjana)',
    kriteria_ipk_min: 3.0,
    kriteria_semester_min: 1,
    kriteria_khusus: 'Memiliki sertifikat bahasa Inggris resmi (TOEFL/IELTS)',
    deadline_pendaftaran: '2026-10-31',
    link_resmi: 'https://lpdp.kemenkeu.go.id',
    deskripsi_singkat: 'Beasiswa penuh pemerintah RI untuk jenjang Magister (S2) dan Doktor (S3) di dalam dan luar negeri.',
    status: 'aktif' as StatusBeasiswa,
  },
  {
    nama_beasiswa: 'Beasiswa PPA (Peningkatan Prestasi Akademik)',
    penyelenggara: 'Dikti / LLDIKTI',
    jenis: 'pemerintah' as JenisBeasiswa,
    kriteria_jurusan: 'Semua Jurusan',
    kriteria_ipk_min: 3.0,
    kriteria_semester_min: 2,
    kriteria_khusus: 'Diusulkan oleh perguruan tinggi masing-masing',
    deadline_pendaftaran: '2026-08-30',
    link_resmi: 'https://pembelajaran-kemdikbud.go.id',
    deskripsi_singkat: 'Bantuan biaya belajar dari pemerintah untuk mahasiswa aktif dengan prestasi akademik memuaskan.',
    status: 'segera_ditutup' as StatusBeasiswa,
  },
  {
    nama_beasiswa: 'Beasiswa Tanoto Foundation TELADAN 2026',
    penyelenggara: 'Tanoto Foundation',
    jenis: 'swasta' as JenisBeasiswa,
    kriteria_jurusan: 'Semua Jurusan S1',
    kriteria_ipk_min: 3.0,
    kriteria_semester_min: 1,
    kriteria_khusus: 'Mahasiswa baru di 9 PTN mitra Tanoto Foundation',
    deadline_pendaftaran: '2026-09-15',
    link_resmi: 'https://www.tanotofoundation.org',
    deskripsi_singkat: 'Program kepemimpinan dan beasiswa penuh bagi calon pemimpin masa depan Indonesia.',
    status: 'aktif' as StatusBeasiswa,
  },
  {
    nama_beasiswa: 'Beasiswa Riset & Inovasi BRIN 2026',
    penyelenggara: 'Badan Riset dan Inovasi Nasional',
    jenis: 'riset' as JenisBeasiswa,
    kriteria_jurusan: 'Sains, Teknologi, Teknik, MIPA, Pertanian',
    kriteria_ipk_min: 3.25,
    kriteria_semester_min: 5,
    kriteria_khusus: 'Sedang menyelesaikan tugas akhir / skripsi berbasis riset',
    deadline_pendaftaran: '2026-10-01',
    link_resmi: 'https://beasiswa.brin.go.id',
    deskripsi_singkat: 'Dukungan pendanaan riset tugas akhir bagi mahasiswa S1/S2 yang meneliti topik strategis nasional.',
    status: 'aktif' as StatusBeasiswa,
  },
  {
    nama_beasiswa: 'Beasiswa Young Leaders International 2026',
    penyelenggara: 'Global Leadership Foundation',
    jenis: 'internasional' as JenisBeasiswa,
    kriteria_jurusan: 'Semua Jurusan',
    kriteria_ipk_min: 3.5,
    kriteria_semester_min: 3,
    kriteria_khusus: 'Fasih berbahasa Inggris dan memiliki rekam jejak kepemimpinan',
    deadline_pendaftaran: '2026-09-30',
    link_resmi: 'https://globalyoungleaders.org',
    deskripsi_singkat: 'Program beasiswa pertukaran dan konferensi kepemimpinan pemuda tingkat internasional di Singapura.',
    status: 'segera_ditutup' as StatusBeasiswa,
  },
  {
    nama_beasiswa: 'Beasiswa BAZNAS Pusat Pertukaran Pelajar',
    penyelenggara: 'BAZNAS RI',
    jenis: 'kebutuhan' as JenisBeasiswa,
    kriteria_jurusan: 'Semua Jurusan',
    kriteria_ipk_min: 2.75,
    kriteria_semester_min: 1,
    kriteria_khusus: 'Berasal dari keluarga kurang mampu (Mustahik)',
    deadline_pendaftaran: '2026-11-15',
    link_resmi: 'https://beasiswa.baznas.go.id',
    deskripsi_singkat: 'Bantuan biaya pendidikan dan uang saku bulanan dari BAZNAS untuk mahasiswa kurang mampu.',
    status: 'aktif' as StatusBeasiswa,
  },
];

// =====================================================
// Helper: Seed Database jika Tabel Beasiswa Kosong
// =====================================================
export async function seedBeasiswaIfEmpty(): Promise<void> {
  try {
    const admin = createAdminClient();
    const { count, error } = await admin.from('beasiswa').select('*', { count: 'exact', head: true });

    if (!error && (count === null || count === 0)) {
      console.log('Tabel beasiswa kosong. Menjalankan auto-seed beasiswa...');
      const { error: seedError } = await admin.from('beasiswa').insert(SEED_DATA_BEASISWA);
      if (seedError) {
        console.error('Gagal melakukan seed beasiswa:', seedError.message);
      } else {
        console.log('Berhasil menambahkan 9 data beasiswa ke database!');
      }
    }
  } catch (err) {
    console.error('Error saat memeriksa/membuat seed beasiswa:', err);
  }
}

// =====================================================
// Action 1: Query Daftar Beasiswa dari Supabase
// =====================================================
export async function ambilDaftarBeasiswa(params?: {
  jenis?: string;
  q?: string;
  ipkMin?: number;
  halaman?: number;
  perHalaman?: number;
}): Promise<DaftarBeasiswaResult> {
  // Pastikan data seed terisi jika tabel masih kosong
  await seedBeasiswaIfEmpty();

  const page = params?.halaman && params.halaman > 0 ? params.halaman : 1;
  const limit = params?.perHalaman && params.perHalaman > 0 ? params.perHalaman : 9;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createServerSupabaseClient();

  let query = supabase.from('beasiswa').select('*', { count: 'exact' });

  // Filter Jenis / Kategori Beasiswa
  if (params?.jenis && params.jenis !== 'semua') {
    query = query.eq('jenis', params.jenis);
  }

  // Filter IPK Minimum
  if (params?.ipkMin && params.ipkMin > 0) {
    query = query.lte('kriteria_ipk_min', params.ipkMin);
  }

  // Pencarian (Search)
  if (params?.q && params.q.trim() !== '') {
    const kataKunci = `%${params.q.trim()}%`;
    query = query.or(
      `nama_beasiswa.ilike.${kataKunci},penyelenggara.ilike.${kataKunci},deskripsi_singkat.ilike.${kataKunci}`
    );
  }

  // Sorting deadline & range pagination
  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching beasiswa:', error);
    return {
      beasiswa: [],
      total: 0,
      halaman: page,
      perHalaman: limit,
      totalHalaman: 0,
    };
  }

  const total = count || 0;
  const totalHalaman = Math.ceil(total / limit);

  return {
    beasiswa: (data as unknown as Beasiswa[]) || [],
    total,
    halaman: page,
    perHalaman: limit,
    totalHalaman,
  };
}

// =====================================================
// Action 2: Detail Beasiswa by ID dari Supabase
// =====================================================
export async function ambilDetailBeasiswa(id: string): Promise<Beasiswa | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('beasiswa')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching detail beasiswa:', error);
    return null;
  }

  return data as unknown as Beasiswa;
}
