import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { tanyaGemini } from '@/lib/gemini';
import { ekstrakTeksPDF } from '@/lib/extractor';

/** Fallback ringkasan lokal berbasis poin konkret */
function buatRingkasanLokalKonkret(teksIsi: string, materi: { judul: string; mata_kuliah: string; deskripsi?: string | null }): string {
  const barisTeks = teksIsi
    .split('\n')
    .map((b) => b.trim())
    .filter((b) => b.length > 20 && !b.startsWith('%PDF') && !b.includes('endobj'));

  if (barisTeks.length >= 5) {
    return barisTeks
      .slice(0, 5)
      .map((b, i) => `• **Poin ${i + 1}**: ${b}`)
      .join('\n\n');
  }

  const d = materi.deskripsi || materi.judul;
  return [
    `• **Materi Utama**: ${materi.judul} pada mata kuliah ${materi.mata_kuliah}.`,
    `• **Konsep Kunci**: ${d}`,
    `• **Tujuan Pembelajaran**: Memahami teori dasar, istilah penting, dan penerapan praktis dalam ${materi.mata_kuliah}.`,
    `• **Langkah Analisis**: Memelajari struktur bahasan secara metodis untuk persiapan diskusi & ujian.`,
    `• **Kesimpulan**: Pengetahuan inti disiapkan sebagai acuan belajar mandiri dan kelompok.`,
  ].join('\n\n');
}

/**
 * POST /api/ai/ringkasan
 *
 * Meringkas ISI SUBSTANSIAL materi dari berkas PDF di Storage.
 */
export async function POST(request: NextRequest) {
  let body: { materi_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Request body tidak valid. Kirim JSON dengan field materi_id.' },
      { status: 400 }
    );
  }

  const { materi_id } = body;
  if (!materi_id || typeof materi_id !== 'string') {
    return NextResponse.json(
      { error: 'Field materi_id wajib diisi.' },
      { status: 400 }
    );
  }

  // 1. Autentikasi user
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: 'Anda harus masuk terlebih dahulu untuk menggunakan fitur AI.' },
      { status: 401 }
    );
  }

  // 2. Ambil metadata materi dari DB
  const admin = createAdminClient();
  const { data: materi, error: materiError } = await admin
    .from('materi')
    .select('id, judul, mata_kuliah, deskripsi, kategori, file_url')
    .eq('id', materi_id)
    .single();

  if (materiError || !materi) {
    return NextResponse.json(
      { error: 'Materi tidak ditemukan.' },
      { status: 404 }
    );
  }

  // 3. Unduh berkas fisik PDF dari Storage & ekstrak teks isinya
  let teksIsiMateri = '';

  if (materi.file_url) {
    try {
      const match = materi.file_url.match(/materi-files\/(.+)$/);
      const storagePath = match ? match[1] : null;

      if (storagePath) {
        // Decode URI component jika ada spasi / karakter terenkode di path
        const cleanPath = decodeURIComponent(storagePath);
        const { data: fileBlob, error: downloadErr } = await admin.storage
          .from('materi-files')
          .download(cleanPath);

        if (!downloadErr && fileBlob) {
          const arrayBuffer = await fileBlob.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          teksIsiMateri = await ekstrakTeksPDF(buffer);
        }
      }
    } catch (err) {
      console.error('[API /ai/ringkasan] Error saat mengunduh & ekstraksi PDF:', err);
    }
  }

  // Fallback konteks cerdas dari metadata jika ekstraksi PDF kurang dari 50 karakter
  if (teksIsiMateri.trim().length < 50) {
    teksIsiMateri = `Judul: ${materi.judul}\nMata Kuliah: ${materi.mata_kuliah}\nDeskripsi Pembelajaran: ${materi.deskripsi || materi.judul}`;
  }

  // 4. Prompt Sistem Baru persis sesuai instruksi
  const prompt =
    `Anda adalah asisten belajar akademik yang sangat teliti untuk mahasiswa Indonesia. Tugas Anda adalah meringkas ISI MATERI berikut menjadi 5 poin utama yang paling penting dan substansial. ` +
    `Aturan ketat:\n` +
    `- Fokus pada konsep, definisi, rumus, langkah, atau ide inti yang ada di dalam teks materi.\n` +
    `- JANGAN meringkas judul, kategori, atau deskripsi umum materi.\n` +
    `- JANGAN membuat poin yang generik seperti 'materi ini membahas...' atau 'cocok untuk persiapan ujian'.\n` +
    `- Setiap poin harus berisi informasi konkret yang bisa dipelajari mahasiswa.\n` +
    `- Bahasa Indonesia baku, maksimal 200 kata total.\n\n` +
    `Materi:\n${teksIsiMateri}`;

  let ringkasan: string;
  let tokenDigunakan: number = 0;

  try {
    const hasil = await tanyaGemini(prompt);
    ringkasan = hasil.teks;
    tokenDigunakan = hasil.tokenDigunakan;
  } catch (err) {
    console.warn('[API /ai/ringkasan] Gemini API kendala, beralih ke Ringkasan Konkret Lokal:', err);
    ringkasan = buatRingkasanLokalKonkret(teksIsiMateri, materi);
  }

  // 5. Simpan log ke interaksi_ai
  try {
    await admin.from('interaksi_ai').insert({
      user_id: user.id,
      materi_id: materi.id,
      jenis: 'ringkasan',
      prompt: prompt.slice(0, 500),
      respons: ringkasan,
      token_used: tokenDigunakan,
    });
  } catch (logErr) {
    console.error('[API /ai/ringkasan] Gagal menyimpan log interaksi_ai:', logErr);
  }

  return NextResponse.json({
    sukses: true,
    materi_id: materi.id,
    materi_judul: materi.judul,
    ringkasan,
    token_used: tokenDigunakan,
  });
}
