'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export interface ProfileFormState {
  error?: string;
  fieldErrors?: {
    nama_lengkap?: string;
    jurusan?: string;
    semester?: string;
    ipk?: string;
    asal_institusi?: string;
    avatar?: string;
  };
  sukses?: boolean;
  pesan?: string;
}

export async function perbaruiProfil(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: 'Anda harus masuk terlebih dahulu.' };
  }

  const nama_lengkap = (formData.get('nama_lengkap') as string)?.trim();
  const asal_institusi = (formData.get('asal_institusi') as string)?.trim() || null;
  const jurusan = (formData.get('jurusan') as string)?.trim() || null;
  const semesterStr = (formData.get('semester') as string)?.trim() || '';
  const ipkStr = (formData.get('ipk') as string)?.trim() || '';
  const kategori_khusus = (formData.get('kategori_khusus') as string)?.trim() || null;

  let avatar_url = (formData.get('avatar_url') as string)?.trim() || null;
  const avatarFile = formData.get('avatar_file') as File | null;
  const hapusAvatar = formData.get('hapus_avatar') === 'true';

  const fieldErrors: ProfileFormState['fieldErrors'] = {};

  if (!nama_lengkap || nama_lengkap.length < 2) {
    fieldErrors.nama_lengkap = 'Nama lengkap minimal 2 karakter.';
  }

  const semester = semesterStr ? parseInt(semesterStr, 10) : null;
  if (semesterStr && (isNaN(semester!) || semester! < 1 || semester! > 12)) {
    fieldErrors.semester = 'Semester harus antara 1 hingga 12.';
  }

  let ipk: number | null = null;
  if (ipkStr) {
    const parsedIPK = parseFloat(ipkStr.replace(',', '.'));
    if (isNaN(parsedIPK) || parsedIPK < 0 || parsedIPK > 4) {
      fieldErrors.ipk = 'IPK harus antara 0.00 hingga 4.00.';
    } else {
      ipk = parsedIPK;
    }
  }

  // Handle foto profil
  if (hapusAvatar) {
    avatar_url = null;
  } else if (avatarFile && avatarFile.size > 0) {
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB limit
    if (avatarFile.size > MAX_SIZE) {
      fieldErrors.avatar = 'Ukuran foto maksimal 5 MB.';
    } else {
      try {
        const fileExt = avatarFile.name.split('.').pop() || 'png';
        const fileName = `${user.id}/avatar_${Date.now()}.${fileExt}`;
        const arrayBuffer = await avatarFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const admin = createAdminClient();

        // Step 1: Upload ke Supabase Storage
        const { error: uploadError } = await admin.storage
          .from('materi-files')
          .upload(fileName, buffer, {
            contentType: avatarFile.type || 'image/png',
            upsert: true,
          });

        if (!uploadError) {
          const {
            data: { publicUrl },
          } = admin.storage.from('materi-files').getPublicUrl(fileName);
          avatar_url = publicUrl;
        } else {
          // Fallback to Data URL base64 jika storage bucket mengalami error
          const base64Str = buffer.toString('base64');
          avatar_url = `data:${avatarFile.type || 'image/png'};base64,${base64Str}`;
        }
      } catch (err) {
        console.error('Upload avatar error:', err);
        fieldErrors.avatar = 'Gagal memproses file foto profil.';
      }
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  try {
    const admin = createAdminClient();

    const updatePayload: Record<string, unknown> = {
      id: user.id,
      nama_lengkap,
      asal_institusi,
      jurusan,
      semester,
      ipk,
      kategori_khusus,
      updated_at: new Date().toISOString(),
    };

    // Update avatar_url jika diubah / diunggah / dihapus
    if (avatar_url !== undefined) {
      updatePayload.avatar_url = avatar_url;
    }

    // Upsert ke tabel profiles
    const { error: profileErr } = await admin
      .from('profiles')
      .upsert(updatePayload, { onConflict: 'id' });

    if (profileErr) {
      console.error('Error updating profile table:', profileErr);
      return { error: `Gagal memperbarui profil: ${profileErr.message}` };
    }

    // Update Auth user_metadata
    await supabase.auth.updateUser({
      data: {
        nama_lengkap,
        asal_institusi,
        jurusan,
        semester: semester ? String(semester) : '',
        ipk: ipkStr || '',
        kategori_khusus,
        avatar_url: avatar_url || '',
      },
    });

    revalidatePath('/profil');
    return { sukses: true, pesan: 'Profil berhasil diperbarui!' };
  } catch (err) {
    console.error('perbaruiProfil exception:', err);
    return { error: 'Terjadi kesalahan sistem saat memperbarui profil.' };
  }
}
