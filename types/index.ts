// =====================================================
// Tipe data global platform Lentera
// =====================================================

// -------------------------------------------------------
// Tipe Supabase Database (sesuai skema 001_schema.sql)
// -------------------------------------------------------

export interface Profil {
  id: string;
  nama_lengkap: string;
  asal_institusi?: string | null;
  jurusan?: string | null;
  semester?: number | null;
  ipk?: number | null;
  kategori_khusus?: string | null;
  poin_kontribusi: number;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Materi {
  id: string;
  uploader_id: string;
  judul: string;
  mata_kuliah: string;
  deskripsi?: string | null;
  kategori: KategoriMateri;
  file_url?: string | null;
  thumbnail_url?: string | null;
  jumlah_unduhan: number;
  jumlah_suka: number;
  created_at: string;
  updated_at: string;
  // Join fields
  profiles?: Pick<Profil, 'id' | 'nama_lengkap' | 'avatar_url' | 'jurusan' | 'asal_institusi'> | null;
}

export type KategoriMateri =
  | 'catatan'
  | 'rangkuman'
  | 'bank_soal'
  | 'modul'
  | 'presentasi'
  | 'lainnya';

export interface Beasiswa {
  id: string;
  nama_beasiswa: string;
  penyelenggara: string;
  jenis: JenisBeasiswa;
  kriteria_jurusan: string;
  kriteria_ipk_min?: number | null;
  kriteria_semester_min?: number | null;
  kriteria_khusus?: string | null;
  deadline_pendaftaran?: string | null;
  link_resmi?: string | null;
  deskripsi_singkat?: string | null;
  status: StatusBeasiswa;
  created_at: string;
}

export type JenisBeasiswa =
  | 'prestasi'
  | 'kebutuhan'
  | 'riset'
  | 'pemerintah'
  | 'swasta'
  | 'internasional';

export type StatusBeasiswa = 'aktif' | 'segera_ditutup' | 'ditutup';

export interface InteraksiAI {
  id: string;
  user_id: string;
  materi_id?: string | null;
  beasiswa_id?: string | null;
  jenis: JenisInteraksiAI;
  prompt?: string | null;
  respons?: string | null;
  token_used?: number | null;
  created_at: string;
}

export type JenisInteraksiAI =
  | 'ringkasan'
  | 'kuis'
  | 'tanya_jawab'
  | 'pencocokan_beasiswa'
  | 'draf_esai';

export interface Penilaian {
  id: string;
  materi_id: string;
  user_id: string;
  nilai: 1 | 2 | 3 | 4 | 5;
  created_at: string;
}

// -------------------------------------------------------
// Tipe Auth & State
// -------------------------------------------------------

/** Profil ringkas untuk ditampilkan di Navbar */
export interface ProfilRingkas {
  id: string;
  nama_lengkap: string;
  poin_kontribusi: number;
  avatar_url?: string | null;
}

/** Hasil Server Action autentikasi */
export interface AuthState {
  error?: string;
  fieldErrors?: {
    email?: string;
    kata_sandi?: string;
    nama_lengkap?: string;
    asal_institusi?: string;
    jurusan?: string;
    semester?: string;
    ipk?: string;
  };
  sukses?: boolean;
  pesan?: string;
}

// -------------------------------------------------------
// Tipe UI & Navigasi
// -------------------------------------------------------

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  modul?: 'belajar' | 'beasiswa';
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  pesan?: string;
}

export interface PapanPeringkat {
  peringkat: number;
  profil: Profil;
  total_poin: number;
  total_kontribusi: number;
}

// -------------------------------------------------------
// Label tampilan (UI helpers)
// -------------------------------------------------------

export const LABEL_KATEGORI_MATERI: Record<KategoriMateri, string> = {
  catatan: 'Catatan',
  rangkuman: 'Rangkuman',
  bank_soal: 'Bank Soal',
  modul: 'Modul',
  presentasi: 'Presentasi',
  lainnya: 'Lainnya',
};

export const LABEL_JENIS_BEASISWA: Record<JenisBeasiswa, string> = {
  prestasi: 'Prestasi',
  kebutuhan: 'Kebutuhan',
  riset: 'Riset',
  pemerintah: 'Pemerintah',
  swasta: 'Swasta',
  internasional: 'Internasional',
};

export const LABEL_STATUS_BEASISWA: Record<StatusBeasiswa, string> = {
  aktif: 'Aktif',
  segera_ditutup: 'Segera Ditutup',
  ditutup: 'Ditutup',
};
