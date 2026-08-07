'use server';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { AuthState } from '@/types';

// =====================================================
// Helper: Validasi dan pesan error Bahasa Indonesia
// =====================================================

function validasiEmail(email: string): string | undefined {
  if (!email) return 'Email wajib diisi.';
  const formatEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formatEmail.test(email)) return 'Format email tidak valid.';
  return undefined;
}

function validasiKataSandi(katasandi: string): string | undefined {
  if (!katasandi) return 'Kata sandi wajib diisi.';
  if (katasandi.length < 8) return 'Kata sandi minimal 8 karakter.';
  return undefined;
}

function validasiIPK(ipkStr: string): string | undefined {
  if (!ipkStr || ipkStr.trim() === '') return undefined; // opsional
  const ipk = parseFloat(ipkStr);
  if (isNaN(ipk)) return 'IPK harus berupa angka (contoh: 3.75).';
  if (ipk < 0 || ipk > 4) return 'IPK harus antara 0.00 hingga 4.00.';
  return undefined;
}

/** Terjemahkan kode error Supabase ke Bahasa Indonesia */
function terjemahkanError(message: string): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Email atau kata sandi salah. Silakan periksa kembali.',
    'Email not confirmed': 'Email belum dikonfirmasi. Silakan cek kotak masuk email Anda.',
    'User already registered': 'Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.',
    'Email already in use': 'Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.',
    'Password should be at least 6 characters': 'Kata sandi minimal 8 karakter.',
    'Signup requires a valid password': 'Kata sandi tidak valid. Gunakan minimal 8 karakter.',
    'Unable to validate email address: invalid format': 'Format email tidak valid.',
    'Email rate limit exceeded': 'Terlalu banyak percobaan pendaftaran. Silakan tunggu beberapa menit atau gunakan email lain.',
    'Too many requests': 'Terlalu banyak permintaan. Silakan tunggu sebentar dan coba lagi.',
    'over_email_send_rate_limit': 'Batas pengiriman email sistem tercapai. Silakan coba lagi.',
    'email_address_invalid': 'Alamat email tidak valid. Gunakan email dengan domain aktif (contoh: @gmail.com atau @student.ac.id).',
  };

  for (const [key, val] of Object.entries(errorMap)) {
    if (message.toLowerCase().includes(key.toLowerCase())) return val;
  }

  return 'Terjadi kesalahan. Silakan coba lagi.';
}

// =====================================================
// Action 1: Masuk Akun (/login)
// =====================================================
export async function masukAkun(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const kata_sandi = formData.get('kata_sandi') as string;

  // Validasi form
  const fieldErrors: AuthState['fieldErrors'] = {};
  const errEmail = validasiEmail(email);
  if (errEmail) fieldErrors.email = errEmail;
  const errKataSandi = validasiKataSandi(kata_sandi);
  if (errKataSandi) fieldErrors.kata_sandi = errKataSandi;

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: kata_sandi });

  if (error) {
    return { error: terjemahkanError(error.message) };
  }

  redirect('/jelajah');
}

// =====================================================
// Action 2: Daftar Akun (/register)
// =====================================================
export async function daftarAkun(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const nama_lengkap = (formData.get('nama_lengkap') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const kata_sandi = formData.get('kata_sandi') as string;
  const asal_institusi = (formData.get('asal_institusi') as string)?.trim() || null;
  const jurusan = (formData.get('jurusan') as string)?.trim() || null;
  const semesterStr = formData.get('semester') as string;
  const ipkStr = (formData.get('ipk') as string)?.trim() || '';
  const kategori_khusus = (formData.get('kategori_khusus') as string)?.trim() || null;

  // Validasi
  const fieldErrors: AuthState['fieldErrors'] = {};

  if (!nama_lengkap || nama_lengkap.length < 2) {
    fieldErrors.nama_lengkap = 'Nama lengkap minimal 2 karakter.';
  }
  const errEmail = validasiEmail(email);
  if (errEmail) fieldErrors.email = errEmail;

  const errKataSandi = validasiKataSandi(kata_sandi);
  if (errKataSandi) fieldErrors.kata_sandi = errKataSandi;

  const errIPK = validasiIPK(ipkStr);
  if (errIPK) fieldErrors.ipk = errIPK;

  const semester = semesterStr ? parseInt(semesterStr, 10) : null;
  if (semesterStr && (isNaN(semester!) || semester! < 1 || semester! > 12)) {
    fieldErrors.semester = 'Semester harus antara 1 hingga 12.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const supabase = await createServerSupabaseClient();
  const userMetadata = {
    nama_lengkap,
    asal_institusi,
    jurusan,
    semester: semester ? String(semester) : '',
    ipk: ipkStr || '',
    kategori_khusus,
  };

  // Step 1: Coba pendaftaran standar via Client
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password: kata_sandi,
    options: {
      data: userMetadata,
    },
  });

  // Step 2: Jika terkena rate limit email / error pendaftaran standar, gunakan Admin API (auto-confirm)
  if (
    signUpError &&
    (signUpError.message.includes('rate limit') ||
      signUpError.message.includes('over_email_send_rate_limit') ||
      (signUpError as { status?: number }).status === 429)
  ) {
    try {
      const admin = createAdminClient();
      const { error: adminErr } = await admin.auth.admin.createUser({
        email,
        password: kata_sandi,
        email_confirm: true,
        user_metadata: userMetadata,
      });

      if (adminErr) {
        return { error: terjemahkanError(adminErr.message) };
      }
    } catch {
      return { error: terjemahkanError(signUpError.message) };
    }
  } else if (signUpError) {
    return { error: terjemahkanError(signUpError.message) };
  }

  // Step 3: Langsung login setelah daftar untuk memasang cookie sesi
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password: kata_sandi,
  });

  // Step 4: Jika login gagal karena "Email not confirmed", konfirmasi otomatis via Admin API
  if (loginError) {
    if (loginError.message.includes('Email not confirmed')) {
      try {
        const admin = createAdminClient();
        const { data: usersData } = await admin.auth.admin.listUsers();
        const createdUser = usersData?.users?.find((u) => u.email === email);
        if (createdUser) {
          await admin.auth.admin.updateUserById(createdUser.id, { email_confirm: true });
          const { error: retryLoginError } = await supabase.auth.signInWithPassword({
            email,
            password: kata_sandi,
          });
          if (!retryLoginError) {
            redirect('/jelajah');
          }
        }
      } catch {
        // Abaikan error fallback admin
      }
    }
    return {
      sukses: true,
      pesan: 'Akun berhasil dibuat! Silakan masuk dengan email dan kata sandi Anda.',
    };
  }

  redirect('/jelajah');
}

// =====================================================
// Action 3: Keluar Akun
// =====================================================
export async function keluarAkun(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/login');
}
