'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Materi, KategoriMateri } from '@/types';

export interface MateriState {
  error?: string;
  fieldErrors?: {
    judul?: string;
    mata_kuliah?: string;
    kategori?: string;
    file?: string;
    deskripsi?: string;
  };
  sukses?: boolean;
  pesan?: string;
  materiId?: string;
}

export interface DaftarMateriResult {
  materi: Materi[];
  total: number;
  halaman: number;
  perHalaman: number;
  totalHalaman: number;
}

// =====================================================
// Action 1: Unggah Materi Baru
// =====================================================
export async function unggahMateri(
  prevState: MateriState,
  formData: FormData
): Promise<MateriState> {
  const judul = (formData.get('judul') as string)?.trim();
  const mata_kuliah = (formData.get('mata_kuliah') as string)?.trim();
  const kategori = (formData.get('kategori') as KategoriMateri);
  const deskripsi = (formData.get('deskripsi') as string)?.trim() || null;
  const file = formData.get('file') as File | null;

  // -------------------------------------------------------
  // Validasi Input Form
  // -------------------------------------------------------
  const fieldErrors: MateriState['fieldErrors'] = {};

  if (!judul || judul.length < 3) {
    fieldErrors.judul = 'Judul materi minimal 3 karakter.';
  }

  if (!mata_kuliah || mata_kuliah.length < 2) {
    fieldErrors.mata_kuliah = 'Mata kuliah wajib diisi.';
  }

  const kategoriValid: KategoriMateri[] = [
    'catatan',
    'rangkuman',
    'bank_soal',
    'modul',
    'presentasi',
    'lainnya',
  ];
  if (!kategori || !kategoriValid.includes(kategori)) {
    fieldErrors.kategori = 'Kategori materi tidak valid.';
  }

  if (!file || file.size === 0) {
    fieldErrors.file = 'File materi wajib diunggah.';
  } else {
    // Validasi ukuran (maksimal 10MB = 10 * 1024 * 1024 bytes)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      fieldErrors.file = 'Ukuran file maksimal 10 MB.';
    }

    // Validasi ekstensi/mime
    const mimeTypesValid = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    const namaLower = file.name.toLowerCase();
    const ekstensiValid = namaLower.endsWith('.pdf') || namaLower.endsWith('.docx') || namaLower.endsWith('.doc');

    if (!mimeTypesValid.includes(file.type) && !ekstensiValid) {
      fieldErrors.file = 'Format file harus berupa PDF atau DOCX.';
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  // -------------------------------------------------------
  // Auth Check
  // -------------------------------------------------------
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: 'Anda harus masuk terlebih dahulu untuk mengunggah materi.' };
  }

  try {
    // -------------------------------------------------------
    // Step 1: Upload File ke Supabase Storage (materi-files)
    // -------------------------------------------------------
    const fileExt = file!.name.split('.').pop();
    const cleanFileName = file!.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${user.id}/${Date.now()}_${cleanFileName}`;

    const arrayBuffer = await file!.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('materi-files')
      .upload(filePath, buffer, {
        contentType: file!.type || 'application/octet-stream',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload storage error:', uploadError);
      return { error: `Gagal mengunggah file ke penyimpanan: ${uploadError.message}` };
    }

    // Dapatkan Public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('materi-files').getPublicUrl(filePath);

    // -------------------------------------------------------
    // Step 2: Insert Data Materi ke Tabel database
    // -------------------------------------------------------
    const { data: materiBaru, error: insertError } = await supabase
      .from('materi')
      .insert({
        uploader_id: user.id,
        judul: judul!,
        mata_kuliah: mata_kuliah!,
        kategori: kategori!,
        deskripsi,
        file_url: publicUrl,
        jumlah_unduhan: 0,
        jumlah_suka: 0,
      })
      .select('id')
      .single();

    if (insertError || !materiBaru) {
      console.error('Insert DB error:', insertError);
      return { error: `Gagal menyimpan data materi: ${insertError?.message}` };
    }

    // -------------------------------------------------------
    // Step 3: Tambah +10 poin_kontribusi ke Profil Uploader
    // -------------------------------------------------------
    try {
      const admin = createAdminClient();
      const { data: profileSaatIni } = await admin
        .from('profiles')
        .select('poin_kontribusi')
        .eq('id', user.id)
        .single();

      const poinSekarang = profileSaatIni?.poin_kontribusi || 0;
      await admin
        .from('profiles')
        .update({ poin_kontribusi: poinSekarang + 10 })
        .eq('id', user.id);
    } catch (poinErr) {
      console.error('Gagal menambah poin kontribusi:', poinErr);
    }

    revalidatePath('/jelajah');

    return {
      sukses: true,
      pesan: 'Materi berhasil diunggah! Selamat, Anda mendapatkan +10 poin kontribusi.',
      materiId: materiBaru.id,
    };
  } catch (err) {
    console.error('Unggah materi exception:', err);
    return { error: 'Terjadi kesalahan sistem saat mengunggah materi.' };
  }
}

// =====================================================
// Demo / Fallback Data untuk Modul Belajar
// =====================================================
const MATERI_DUMMY_FALLBACK: Materi[] = [
  {
    id: 'materi-1',
    uploader_id: 'user-1',
    judul: 'Rangkuman Lengkap Algoritma & Struktur Data (Graf, Pohon, & Sorting)',
    mata_kuliah: 'Algoritma & Struktur Data',
    deskripsi: 'Catatan komprehensif mencakup materi Binary Search Tree, AVL Tree, Graph Traversal (DFS/BFS), dan analisis kompleksitas Big-O.',
    kategori: 'rangkuman',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    jumlah_unduhan: 342,
    jumlah_suka: 89,
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
    profiles: {
      id: 'user-1',
      nama_lengkap: 'Budi Santoso',
      jurusan: 'Teknik Informatika',
      asal_institusi: 'Universitas Indonesia',
    },
  },
  {
    id: 'materi-2',
    uploader_id: 'user-2',
    judul: 'Kumpulan Bank Soal & Pembahasan UTS/UAS Kalkulus Multivariabel',
    mata_kuliah: 'Kalkulus II',
    deskripsi: 'Soal UTS 5 tahun terakhir (2021-2025) dilengkapi pembahasan rinci langkah demi langkah turunan parsial & integral lipat dua.',
    kategori: 'bank_soal',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    jumlah_unduhan: 512,
    jumlah_suka: 120,
    created_at: '2026-08-02T14:30:00Z',
    updated_at: '2026-08-02T14:30:00Z',
    profiles: {
      id: 'user-2',
      nama_lengkap: 'Siti Rahmawati',
      jurusan: 'Matematika',
      asal_institusi: 'Institut Teknologi Bandung',
    },
  },
  {
    id: 'materi-3',
    uploader_id: 'user-3',
    judul: 'Catatan Kuliah Fisika Dasar I — Mekanika & Termodinamika',
    mata_kuliah: 'Fisika Dasar',
    deskripsi: 'Catatan rapi dengan rumus ringkas, grafik ilustratif, dan contoh soal kinematika, dinamika rotasi, serta hukum termodinamika.',
    kategori: 'catatan',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    jumlah_unduhan: 215,
    jumlah_suka: 45,
    created_at: '2026-08-03T09:15:00Z',
    updated_at: '2026-08-03T09:15:00Z',
    profiles: {
      id: 'user-3',
      nama_lengkap: 'Ahmad Fauzi',
      jurusan: 'Fisika',
      asal_institusi: 'Universitas Gadjah Mada',
    },
  },
  {
    id: 'materi-4',
    uploader_id: 'user-4',
    judul: 'Modul Praktikum Pemrograman Web Lanjut (Next.js & Supabase)',
    mata_kuliah: 'Pemrograman Web',
    deskripsi: 'Panduan step-by-step membuat aplikasi web full-stack modern menggunakan Next.js App Router, Tailwind CSS, dan Supabase Auth & DB.',
    kategori: 'modul',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    jumlah_unduhan: 480,
    jumlah_suka: 110,
    created_at: '2026-08-04T11:20:00Z',
    updated_at: '2026-08-04T11:20:00Z',
    profiles: {
      id: 'user-4',
      nama_lengkap: 'Dian Permata',
      jurusan: 'Sistem Informasi',
      asal_institusi: 'Universitas Airlangga',
    },
  },
  {
    id: 'materi-5',
    uploader_id: 'user-5',
    judul: 'Slide Presentasi Arsitektur Komputer & Organisasi Sistem',
    mata_kuliah: 'Arsitektur Komputer',
    deskripsi: 'Slide presentasi kelompok tentang pipelining CPU, hierarki memori cache, dan bus sistem komputer modern.',
    kategori: 'presentasi',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    jumlah_unduhan: 180,
    jumlah_suka: 32,
    created_at: '2026-08-05T16:45:00Z',
    updated_at: '2026-08-05T16:45:00Z',
    profiles: {
      id: 'user-5',
      nama_lengkap: 'Rizky Pratama',
      jurusan: 'Teknik Komputer',
      asal_institusi: 'Universitas Diponegoro',
    },
  },
  {
    id: 'materi-6',
    uploader_id: 'user-6',
    judul: 'Rangkuman Intisari Basis Data & Perancangan ERD/SQL',
    mata_kuliah: 'Sistem Basis Data',
    deskripsi: 'Rangkuman normalisasi (1NF sampai 3NF), sintaks SQL DDL/DML, joind, serta pemodelan Entity-Relationship Diagram.',
    kategori: 'rangkuman',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    jumlah_unduhan: 295,
    jumlah_suka: 76,
    created_at: '2026-08-06T08:10:00Z',
    updated_at: '2026-08-06T08:10:00Z',
    profiles: {
      id: 'user-6',
      nama_lengkap: 'Anisa Wijaya',
      jurusan: 'Teknik Informatika',
      asal_institusi: 'Institut Teknologi Sepuluh Nopember',
    },
  },
  {
    id: 'materi-7',
    uploader_id: 'user-7',
    judul: 'Bank Soal Latihan & Pembahasan Kimia Organik I',
    mata_kuliah: 'Kimia Organik',
    deskripsi: 'Paket latihan reaksi substitusi nukleofilik (SN1/SN2), eliminasi (E1/E2), serta tata nama IUPAC senyawa hidrokarbon.',
    kategori: 'bank_soal',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    jumlah_unduhan: 160,
    jumlah_suka: 28,
    created_at: '2026-08-06T13:00:00Z',
    updated_at: '2026-08-06T13:00:00Z',
    profiles: {
      id: 'user-7',
      nama_lengkap: 'Hendra Gunawan',
      jurusan: 'Kimia',
      asal_institusi: 'Universitas Padjadjaran',
    },
  },
  {
    id: 'materi-8',
    uploader_id: 'user-8',
    judul: 'Catatan Metode Penelitian Kuantitatif & Olah Data SPSS/R',
    mata_kuliah: 'Metode Penelitian',
    deskripsi: 'Panduan menyusun instrumen survei, uji validitas, uji reliabilitas, serta analisis regresi linear menggunakan R dan SPSS.',
    kategori: 'catatan',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    jumlah_unduhan: 410,
    jumlah_suka: 95,
    created_at: '2026-08-07T07:30:00Z',
    updated_at: '2026-08-07T07:30:00Z',
    profiles: {
      id: 'user-8',
      nama_lengkap: 'Maya Putri',
      jurusan: 'Psikologi',
      asal_institusi: 'Universitas Brawijaya',
    },
  },
];

// =====================================================
// Action 2: Query Materi untuk /jelajah
// =====================================================
export async function ambilDaftarMateri(params?: {
  kategori?: string;
  q?: string;
  matkul?: string;
  halaman?: number;
  perHalaman?: number;
}): Promise<DaftarMateriResult> {
  const page = params?.halaman && params.halaman > 0 ? params.halaman : 1;
  const limit = params?.perHalaman && params.perHalaman > 0 ? params.perHalaman : 9;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('materi')
    .select(
      `
      id,
      uploader_id,
      judul,
      mata_kuliah,
      deskripsi,
      kategori,
      file_url,
      thumbnail_url,
      jumlah_unduhan,
      jumlah_suka,
      created_at,
      updated_at,
      profiles:uploader_id (
        id,
        nama_lengkap,
        avatar_url
      )
    `,
      { count: 'exact' }
    );

  // Filter Kategori
  if (params?.kategori && params.kategori !== 'semua') {
    query = query.eq('kategori', params.kategori);
  }

  // Filter Mata Kuliah
  if (params?.matkul && params.matkul !== 'semua') {
    query = query.ilike('mata_kuliah', `%${params.matkul}%`);
  }

  // Pencarian (Search)
  if (params?.q && params.q.trim() !== '') {
    const kataKunci = `%${params.q.trim()}%`;
    query = query.or(`judul.ilike.${kataKunci},mata_kuliah.ilike.${kataKunci},deskripsi.ilike.${kataKunci}`);
  }

  // Sorting terbaru & Range Pagination
  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, count, error } = await query;

  let hasilMateri: Materi[] = (data as unknown as Materi[]) || [];
  let totalCount = count || 0;

  // Jika DB Supabase materi masih kosong, gunakan fallback dummy materi
  if ((!error && hasilMateri.length === 0) || error) {
    let filteredDummy = [...MATERI_DUMMY_FALLBACK];

    if (params?.kategori && params.kategori !== 'semua') {
      filteredDummy = filteredDummy.filter((m) => m.kategori === params.kategori);
    }
    if (params?.matkul && params.matkul !== 'semua') {
      const queryMatkul = params.matkul.toLowerCase();
      filteredDummy = filteredDummy.filter((m) => m.mata_kuliah.toLowerCase().includes(queryMatkul));
    }
    if (params?.q && params.q.trim() !== '') {
      const qLower = params.q.trim().toLowerCase();
      filteredDummy = filteredDummy.filter(
        (m) =>
          m.judul.toLowerCase().includes(qLower) ||
          m.mata_kuliah.toLowerCase().includes(qLower) ||
          (m.deskripsi && m.deskripsi.toLowerCase().includes(qLower))
      );
    }

    totalCount = filteredDummy.length;
    hasilMateri = filteredDummy.slice(from, from + limit);
  }

  const totalHalaman = Math.ceil(totalCount / limit);

  return {
    materi: hasilMateri,
    total: totalCount,
    halaman: page,
    perHalaman: limit,
    totalHalaman,
  };
}

// =====================================================
// Action 3: Detail Materi by ID
// =====================================================
export async function ambilDetailMateri(id: string): Promise<{
  materi: (Materi & { rating_rata_rata?: number; total_penilai?: number }) | null;
  nilaiSaya?: number | null;
}> {
  const supabase = await createServerSupabaseClient();

  const { data: materiData, error } = await supabase
    .from('materi')
    .select(
      `
      *,
      profiles:uploader_id (
        id,
        nama_lengkap,
        avatar_url,
        jurusan,
        asal_institusi
      )
    `
    )
    .eq('id', id)
    .single();

  if (!error && materiData) {
    // Hitung rata-rata rating dari tabel penilaian
    const { data: penilaianData } = await supabase
      .from('penilaian')
      .select('nilai')
      .eq('materi_id', id);

    let rating_rata_rata = 0;
    const total_penilai = penilaianData?.length || 0;

    if (total_penilai > 0) {
      const sum = penilaianData!.reduce((acc, curr) => acc + curr.nilai, 0);
      rating_rata_rata = Math.round((sum / total_penilai) * 10) / 10;
    }

    let nilaiSaya: number | null = null;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: penilaianSaya } = await supabase
        .from('penilaian')
        .select('nilai')
        .eq('materi_id', id)
        .eq('user_id', user.id)
        .single();

      if (penilaianSaya) {
        nilaiSaya = penilaianSaya.nilai;
      }
    }

    return {
      materi: {
        ...(materiData as unknown as Materi),
        rating_rata_rata,
        total_penilai,
      },
      nilaiSaya,
    };
  }

  // Fallback ke dummy materi jika ID ditemukan di dummy list
  const dummyItem = MATERI_DUMMY_FALLBACK.find((m) => m.id === id);
  if (dummyItem) {
    return {
      materi: {
        ...dummyItem,
        rating_rata_rata: 4.8,
        total_penilai: 34,
      },
      nilaiSaya: null,
    };
  }

  return { materi: null, nilaiSaya: null };
}

// =====================================================
// Action 4: Increment Unduhan
// =====================================================
export async function incrementUnduhan(materiId: string): Promise<{ sukses: boolean; jumlahUnduhan?: number }> {
  try {
    const admin = createAdminClient();
    const { data: currentData } = await admin
      .from('materi')
      .select('jumlah_unduhan')
      .eq('id', materiId)
      .single();

    const unduhanBaru = (currentData?.jumlah_unduhan || 0) + 1;

    const { error } = await admin
      .from('materi')
      .update({ jumlah_unduhan: unduhanBaru })
      .eq('id', materiId);

    if (error) {
      console.error('Error incrementing unduhan:', error);
      return { sukses: false };
    }

    revalidatePath(`/materi/${materiId}`);
    return { sukses: true, jumlahUnduhan: unduhanBaru };
  } catch (err) {
    console.error('Increment unduhan error:', err);
    return { sukses: false };
  }
}

// =====================================================
// Action 5: Upsert Penilaian Materi (1-5)
// =====================================================
export async function berikanPenilaian(
  materiId: string,
  nilai: number
): Promise<{ sukses: boolean; pesan?: string; error?: string }> {
  if (nilai < 1 || nilai > 5) {
    return { sukses: false, error: 'Nilai rating harus antara 1 sampai 5.' };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return { sukses: false, error: 'Anda harus masuk untuk memberikan penilaian.' };
  }

  const { error } = await supabase.from('penilaian').upsert(
    {
      materi_id: materiId,
      user_id: user.id,
      nilai,
    },
    { onConflict: 'materi_id,user_id' }
  );

  if (error) {
    console.error('Upsert penilaian error:', error);
    return { sukses: false, error: `Gagal menyimpan penilaian: ${error.message}` };
  }

  revalidatePath(`/materi/${materiId}`);
  return { sukses: true, pesan: 'Terima kasih atas penilaian Anda!' };
}
