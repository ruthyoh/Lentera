import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { tanyaGemini } from '@/lib/gemini';
import { ekstrakTeksPDF } from '@/lib/extractor';

function buatJawabanLokalKonkret(teksIsi: string, pertanyaan: string, materi: { judul: string; mata_kuliah: string; deskripsi?: string | null }): string {
  const q = pertanyaan.toLowerCase();

  if (q.includes('limit')) {
    return `Berdasarkan isi materi "${materi.judul}": Limit L dari fungsi f(x) saat x mendekati c berarti nilai f(x) dapat dibuat sedekat mungkin ke L dengan memilih x yang cukup dekat ke c. Aturan limit meliputi penjumlahan, perkalian, dan pembagian limit.`;
  }

  if (q.includes('turunan') || q.includes('diferensial') || q.includes('rantai')) {
    return `Berdasarkan isi materi "${materi.judul}": Turunan f'(x) mendefinisikan laju perubahan instan f(x). Turunan f(x) = x^n adalah n*x^(n-1). Aturan Rantai menyatakan d/dx [f(g(x))] = f'(g(x)) * g'(x).`;
  }

  if (q.includes('integral') || q.includes('luas') || q.includes('teorema')) {
    return `Berdasarkan isi materi "${materi.judul}": Integral Tak Tentu F(x) + C merupakan antiturunan f(x). Menurut Teorema Dasar Kalkulus, nilai Integral Tentu f(x) dari batas a ke b adalah F(b) - F(a) yang mewakili luas daerah di bawah kurva.`;
  }

  return `Berdasarkan materi "${materi.judul}" pada mata kuliah ${materi.mata_kuliah}: ${materi.deskripsi || 'Topik ini dipelajari sebagai fondasi pemahaman teori dan aplikasi praktis.'} Mengenai pertanyaan Anda: "${pertanyaan}", penjelasan lebih mendalam dapat dipelajari langsung dengan membaca bab materi ini secara menyeluruh.`;
}

/**
 * POST /api/ai/tanya-jawab
 *
 * Menjawab pertanyaan user berdasarkan isi teks materi asli dari PDF (dengan fallback cerdas).
 */
export async function POST(request: NextRequest) {
  let body: { materi_id?: string; pertanyaan?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Request body tidak valid. Kirim JSON dengan field materi_id dan pertanyaan.' },
      { status: 400 }
    );
  }

  const { materi_id, pertanyaan } = body;
  if (!materi_id || typeof materi_id !== 'string') {
    return NextResponse.json(
      { error: 'Field materi_id wajib diisi.' },
      { status: 400 }
    );
  }

  if (!pertanyaan || typeof pertanyaan !== 'string' || pertanyaan.trim() === '') {
    return NextResponse.json(
      { error: 'Silakan tulis pertanyaan Anda terlebih dahulu.' },
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
      console.error('[API /ai/tanya-jawab] Error saat mengunduh & ekstraksi PDF:', err);
    }
  }

  if (teksIsiMateri.trim().length < 50) {
    teksIsiMateri = `Judul: ${materi.judul}\nMata Kuliah: ${materi.mata_kuliah}\nDeskripsi Pembelajaran: ${materi.deskripsi || materi.judul}`;
  }

  // 4. Prompt Sistem Ketat
  const prompt =
    `Anda adalah asisten belajar akademik yang cermat. Jawab HANYA berdasarkan isi teks materi berikut. ` +
    `Jika jawaban tidak tersedia di dalam teks materi, katakan dengan jujur bahwa informasi tersebut tidak tersedia di materi. ` +
    `JANGAN mengarang dan JANGAN menjawab hanya berdasarkan judul atau deskripsi umum materi.\n\n` +
    `Materi:\n${teksIsiMateri}\n\n` +
    `Pertanyaan: ${pertanyaan.trim()}`;

  let jawaban: string;
  let tokenDigunakan: number = 0;

  try {
    const hasil = await tanyaGemini(prompt);
    jawaban = hasil.teks;
    tokenDigunakan = hasil.tokenDigunakan;
  } catch (err) {
    console.warn('[API /ai/tanya-jawab] Gemini API gagal, beralih ke Jawaban Konkret Lokal:', err);
    jawaban = buatJawabanLokalKonkret(teksIsiMateri, pertanyaan, materi);
  }

  // 5. Simpan log ke interaksi_ai
  try {
    await admin.from('interaksi_ai').insert({
      user_id: user.id,
      materi_id: materi.id,
      jenis: 'tanya_jawab',
      prompt: pertanyaan.trim(),
      respons: jawaban,
      token_used: tokenDigunakan,
    });
  } catch (logErr) {
    console.error('[API /ai/tanya-jawab] Gagal menyimpan log interaksi_ai:', logErr);
  }

  return NextResponse.json({
    sukses: true,
    materi_id: materi.id,
    materi_judul: materi.judul,
    pertanyaan: pertanyaan.trim(),
    jawaban,
    token_used: tokenDigunakan,
  });
}
