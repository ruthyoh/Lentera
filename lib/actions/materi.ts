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

  if (error) {
    console.error('Error fetching materi:', error);
    return {
      materi: [],
      total: 0,
      halaman: page,
      perHalaman: limit,
      totalHalaman: 0,
    };
  }

  const total = count || 0;
  const totalHalaman = Math.ceil(total / limit);

  return {
    materi: (data as unknown as Materi[]) || [],
    total,
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

  if (error || !materiData) {
    return { materi: null, nilaiSaya: null };
  }

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

  // Cek rating dari user yang sedang login (jika ada)
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
