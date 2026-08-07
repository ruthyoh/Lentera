'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import type { Beasiswa } from '@/types';

/** 8 Data Seed Beasiswa Nyata di Indonesia */
const SAMPLE_BEASISWA = [
  {
    nama_beasiswa: 'Beasiswa Unggulan Kemendikbud 2026',
    penyelenggara: 'Kemendikbudristek',
    jenis: 'pemerintah',
    kriteria_jurusan: 'semua',
    kriteria_ipk_min: 3.00,
    kriteria_semester_min: 1,
    kriteria_khusus: 'Mahasiswa berprestasi akademik/non-akademik tingkat nasional atau internasional.',
    deadline_pendaftaran: '2026-10-30',
    link_resmi: 'https://beasiswaunggulan.kemdikbud.go.id',
    deskripsi_singkat: 'Beasiswa penuh mencakup biaya kuliah (UKT) dan uang saku bulanan untuk mahasiswa berprestasi.',
    status: 'aktif',
  },
  {
    nama_beasiswa: 'Beasiswa Bank Indonesia 2026',
    penyelenggara: 'Bank Indonesia',
    jenis: 'swasta',
    kriteria_jurusan: 'Ekonomi, Manajemen, Akuntansi, Teknik Informatika, Sistem Informasi, Hukum',
    kriteria_ipk_min: 3.25,
    kriteria_semester_min: 3,
    kriteria_khusus: 'Aktif dalam organisasi kemahasiswaan dan bersedia menjadi anggota GenBI.',
    deadline_pendaftaran: '2026-11-15',
    link_resmi: 'https://www.bi.go.id',
    deskripsi_singkat: 'Bantuan biaya pendidikan sebesar Rp 1.000.000 per bulan beserta pelatihan kepemimpinan GenBI.',
    status: 'aktif',
  },
  {
    nama_beasiswa: 'Beasiswa Djarum Plus 2026/2027',
    penyelenggara: 'Djarum Foundation',
    jenis: 'prestasi',
    kriteria_jurusan: 'semua',
    kriteria_ipk_min: 3.00,
    kriteria_semester_min: 4,
    kriteria_khusus: 'Sedang menempuh semester 4 di perguruan tinggi mitra Djarum Foundation.',
    deadline_pendaftaran: '2026-11-01',
    link_resmi: 'https://djarumbeasiswaplus.org',
    deskripsi_singkat: 'Tunjangan dana pendidikan Rp 1.000.000/bulan selama 1 tahun dan program pelatihan Character Building.',
    status: 'aktif',
  },
  {
    nama_beasiswa: 'Beasiswa LPDP Reguler S1/S2',
    penyelenggara: 'LPDP - Kementerian Keuangan',
    jenis: 'pemerintah',
    kriteria_jurusan: 'semua',
    kriteria_ipk_min: 3.00,
    kriteria_semester_min: 1,
    kriteria_khusus: 'WNI, berkomitmen kembali ke Indonesia setelah studi selesai.',
    deadline_pendaftaran: '2026-10-31',
    link_resmi: 'https://lpdp.kemenkeu.go.id',
    deskripsi_singkat: 'Beasiswa penuh pemerintah mencakup SPP, biaya hidup, asuransi, dan dana riset.',
    status: 'aktif',
  },
  {
    nama_beasiswa: 'Beasiswa Tanoto Foundation Teladan 2026',
    penyelenggara: 'Tanoto Foundation',
    jenis: 'swasta',
    kriteria_jurusan: 'semua',
    kriteria_ipk_min: 3.00,
    kriteria_semester_min: 1,
    kriteria_khusus: 'Memiliki jiwa kepemimpinan dan komitmen berkontribusi pada masyarakat.',
    deadline_pendaftaran: '2026-09-15',
    link_resmi: 'https://tanotofoundation.org',
    deskripsi_singkat: 'Dukungan biaya kuliah penuh dan tunjangan bulanan hingga semester 8.',
    status: 'aktif',
  },
  {
    nama_beasiswa: 'Beasiswa KIP Kuliah Merdeka 2026',
    penyelenggara: 'Puslapdik Kemendikbudristek',
    jenis: 'kebutuhan',
    kriteria_jurusan: 'semua',
    kriteria_ipk_min: 2.75,
    kriteria_semester_min: 1,
    kriteria_khusus: 'Memiliki potensi akademik baik namun memiliki keterbatasan ekonomi (pemegang KIP/KKS).',
    deadline_pendaftaran: '2026-12-20',
    link_resmi: 'https://kip-kuliah.kemdikbud.go.id',
    deskripsi_singkat: 'Pembebasan biaya pendaftaran dan biaya kuliah penuh serta bantuan biaya hidup bulanan.',
    status: 'aktif',
  },
  {
    nama_beasiswa: 'Beasiswa ASEAN Undergraduate Scholarship',
    penyelenggara: 'Government of Singapore / ASEAN Foundation',
    jenis: 'internasional',
    kriteria_jurusan: 'Sains, Teknologi, Teknik, Matematika, Ekonomi',
    kriteria_ipk_min: 3.50,
    kriteria_semester_min: 1,
    kriteria_khusus: 'Warga negara anggota ASEAN dengan kemampuan Bahasa Inggris mumpuni (IELTS >= 6.5).',
    deadline_pendaftaran: '2026-12-01',
    link_resmi: 'https://www.aseanfoundation.org',
    deskripsi_singkat: 'Beasiswa studi sarjana internasional penuh mencakup paspor, tiket pesawat, biaya kuliah, dan saku.',
    status: 'aktif',
  },
  {
    nama_beasiswa: 'Beasiswa Riset & Inovasi BRIN 2026',
    penyelenggara: 'Badan Riset dan Inovasi Nasional (BRIN)',
    jenis: 'riset',
    kriteria_jurusan: 'Fisika, Biologi, Kimia, Teknik, Ilmu Komputer, Pertanian',
    kriteria_ipk_min: 3.20,
    kriteria_semester_min: 5,
    kriteria_khusus: 'Mahasiswa akhir yang sedang mengerjakan tugas akhir/skripsi riset sains dan teknologi.',
    deadline_pendaftaran: '2026-11-30',
    link_resmi: 'https://brin.go.id',
    deskripsi_singkat: 'Bantuan dana hibah penelitian skripsi/riset hingga Rp 25.000.000 dan akses fasilitas laboratorium BRIN.',
    status: 'aktif',
  },
];

interface FilterBeasiswaParams {
  jenis?: string;
  q?: string;
}

/** Ambil daftar beasiswa dari Supabase (dengan auto-seed 8 data jika kurang/kosong) */
export async function ambilDaftarBeasiswa(params?: FilterBeasiswaParams): Promise<Beasiswa[]> {
  const admin = createAdminClient();

  let query = admin.from('beasiswa').select('*');

  if (params?.jenis && params.jenis !== 'semua') {
    query = query.eq('jenis', params.jenis);
  }

  if (params?.q && params.q.trim() !== '') {
    query = query.ilike('nama_beasiswa', `%${params.q.trim()}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    // Jika tidak ada data atau filter kosong karena DB belum di-seed, lakukan seed 8 data beasiswa
    try {
      const { data: existingAll } = await admin.from('beasiswa').select('id');
      if (!existingAll || existingAll.length < 8) {
        // Hapus data lama yang kurang dari 8 dan seed 8 beasiswa lengkap
        await admin.from('beasiswa').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        const { data: seeded } = await admin.from('beasiswa').insert(SAMPLE_BEASISWA).select('*');
        return (seeded as Beasiswa[]) || [];
      }
    } catch (seedErr) {
      console.error('Seed beasiswa error:', seedErr);
    }
  }

  return (data as Beasiswa[]) || [];
}
