import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { tanyaGemini } from '@/lib/gemini';
import { ekstrakTeksPDF } from '@/lib/extractor';

export interface SoalKuis {
  soal: string;
  opsi: [string, string, string, string];
  jawaban_benar: number;
}

/** Fallback kuis berbasis konsep lokal jika Gemini API tidak tersedia */
function buatKuisKonkretLokal(materi: { judul: string; mata_kuliah: string; deskripsi?: string | null }): SoalKuis[] {
  const judulLower = materi.judul.toLowerCase();

  if (judulLower.includes('kalkulus') || judulLower.includes('turunan') || judulLower.includes('limit')) {
    return [
      {
        soal: 'Manakah pernyataan yang benar mengenai konsep Limit fungsi saat x mendekati c?',
        opsi: [
          'Nilai fungsi f(x) mendekati nilai L tertentu saat x semakin dekat ke c',
          'Nilai x harus persis sama dengan c agar limit dapat dihitung',
          'Limit fungsi selalu bernilai nol untuk semua fungsi kontinu',
          'Turunan pertama dari fungsi selalu sama dengan nilai limitnya',
        ],
        jawaban_benar: 0,
      },
      {
        soal: 'Apa turunan pertama f\'(x) dari fungsi f(x) = 3x^3 + 2x^2 - 5x + 7?',
        opsi: [
          'f\'(x) = 9x^2 + 4x - 5',
          'f\'(x) = 3x^2 + 2x - 5',
          'f\'(x) = 9x^3 + 4x^2 - 5',
          'f\'(x) = 6x^2 + 2x + 7',
        ],
        jawaban_benar: 0,
      },
      {
        soal: 'Bagaimanakah rumus Aturan Rantai (Chain Rule) untuk turunan fungsi komposit f(g(x))?',
        opsi: [
          'd/dx [f(g(x))] = f\'(g(x)) * g\'(x)',
          'd/dx [f(g(x))] = f\'(x) + g\'(x)',
          'd/dx [f(g(x))] = f\'(x) / g\'(x)',
          'd/dx [f(g(x))] = f(g\'(x)) * f\'(x)',
        ],
        jawaban_benar: 0,
      },
      {
        soal: 'Apakah hubungan antara Antiturunan (Integral Tak Tentu) dengan Turunan?',
        opsi: [
          'Integral Tak Tentu F(x) + C merupakan kebalikan dari operasi diferensial sehingga F\'(x) = f(x)',
          'Integral selalu menghasilkan nilai numerik konstan tanpa variabel x',
          'Integral dan turunan adalah dua operasi yang tidak memiliki keterkaitan',
          'Integral Tak Tentu hanya berlaku untuk fungsi kuadratik',
        ],
        jawaban_benar: 0,
      },
      {
        soal: 'Menurut Teorema Dasar Kalkulus, bagaimana cara menghitung nilai Integral Tentu f(x) dari batas a ke b?',
        opsi: [
          'Menghitung F(b) - F(a) di mana F(x) adalah antiturunan dari f(x)',
          'Menghitung f\'(b) * f\'(a)',
          'Membagi nilai b dengan nilai a lalu dikalikan f(x)',
          'Menjumlahkan batas a dan b lalu diturunkan',
        ],
        jawaban_benar: 0,
      },
    ];
  }

  return [
    {
      soal: `Dalam konteks ${materi.mata_kuliah}, apa tujuan utama dari pembahasan topik ${materi.judul}?`,
      opsi: [
        `Memahami konsep dasar dan kerangka teori untuk memecahkan permasalahan bidang ${materi.mata_kuliah}`,
        `Menghafalkan istilah tanpa memahami penerapannya`,
        `Mengabaikan prinsip dasar dan langsung membuat kesimpulan`,
        `Hanya untuk memenuhi syarat dokumen fisik`,
      ],
      jawaban_benar: 0,
    },
    {
      soal: `Manakah dari berikut yang merupakan pendekatan paling efektif dalam mempelajari ${materi.judul}?`,
      opsi: [
        `Memahami teori inti dan mencoba soal-soal latihan secara terstruktur`,
        `Membaca judul saja tanpa memelajari isi materi`,
        `Menghindari pertanyaan saat mengalami kesulitan`,
        `Menyalin materi tanpa memahaminya`,
      ],
      jawaban_benar: 0,
    },
    {
      soal: `Apa fungsi dari analisis berurutan dalam pemecahan masalah pada ${materi.mata_kuliah}?`,
      opsi: [
        `Memastikan langkah penyelesaian sistematis dan mengurangi potensi kesalahan`,
        `Membuat proses pengerjaan menjadi rumit`,
        `Menghilangkan data penting dalam analisis`,
        `Menghindari verifikasi hasil akhir`,
      ],
      jawaban_benar: 0,
    },
    {
      soal: `Bagaimana prinsip dasar dalam materi ${materi.judul} diterapkan pada kasus nyata?`,
      opsi: [
        `Menggunakan rumus dan konsep teori untuk memodelkan persoalan konkret`,
        `Membuat teori baru yang tidak teruji`,
        `Menggunakan estimasi acak tanpa data acuan`,
        `Menolak penggunaan metode ilmiah`,
      ],
      jawaban_benar: 0,
    },
    {
      soal: `Indikator utama bahwa Anda telah menguasai materi ${materi.judul} adalah...`,
      opsi: [
        `Mampu menjelaskan konsep inti dan menyelesaikan kuis pemahaman dengan tepat`,
        `Lupa akan poin utama setelah membaca`,
        `Tidak mampu menjawab pertanyaan dasar seputar materi`,
        `Menyimpan materi tanpa pernah mempelajarinya`,
      ],
      jawaban_benar: 0,
    },
  ];
}

function bersihkanJSONString(rawText: string): string {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }
  return cleaned;
}

/**
 * POST /api/ai/kuis
 *
 * Membuat 5 soal kuis pilihan ganda berbasis PEMAHAMAN KONSEP DARI ISI FILE PDF.
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
      console.error('[API /ai/kuis] Error saat mengunduh & ekstraksi PDF:', err);
    }
  }

  if (teksIsiMateri.trim().length < 50) {
    teksIsiMateri = `Judul: ${materi.judul}\nMata Kuliah: ${materi.mata_kuliah}\nDeskripsi Pembelajaran: ${materi.deskripsi || materi.judul}`;
  }

  // 4. Prompt Sistem Baru persis sesuai instruksi
  const prompt =
    `Anda adalah pembuat soal ujian yang ketat untuk mahasiswa Indonesia. Berdasarkan ISI MATERI berikut, buat 5 soal pilihan ganda yang menguji PEMAHAMAN KONSEP, bukan sekadar mengingat judul atau deskripsi.\n` +
    `Aturan ketat:\n` +
    `- Soal harus menanyakan definisi, penerapan, perbedaan konsep, langkah perhitungan, atau pemahaman mendalam dari isi materi.\n` +
    `- JANGAN membuat soal tentang 'apa fokus utama materi ini', 'kategori materi', atau meta-informasi lainnya.\n` +
    `- Setiap soal harus punya 4 opsi yang masuk akal, hanya 1 yang benar.\n` +
    `- Tingkat kesulitan menengah (bukan terlalu mudah).\n` +
    `- Kembalikan HANYA JSON valid tanpa teks tambahan: [{"soal": string, "opsi": [string, string, string, string], "jawaban_benar": number (0-3)}]\n\n` +
    `Materi:\n${teksIsiMateri}`;

  let kuis: SoalKuis[];
  let tokenDigunakan: number = 0;

  try {
    const hasil = await tanyaGemini(prompt);
    tokenDigunakan = hasil.tokenDigunakan;
    const jsonStr = bersihkanJSONString(hasil.teks);
    const parsed = JSON.parse(jsonStr);

    if (Array.isArray(parsed) && parsed.length > 0) {
      kuis = parsed.slice(0, 5).map((q: any) => ({
        soal: String(q.soal || 'Soal latihan pemahaman konsep'),
        opsi: [
          String(q.opsi?.[0] || 'Opsi A'),
          String(q.opsi?.[1] || 'Opsi B'),
          String(q.opsi?.[2] || 'Opsi C'),
          String(q.opsi?.[3] || 'Opsi D'),
        ] as [string, string, string, string],
        jawaban_benar: typeof q.jawaban_benar === 'number' ? Math.min(Math.max(q.jawaban_benar, 0), 3) : 0,
      }));
    } else {
      kuis = buatKuisKonkretLokal(materi);
    }
  } catch (err) {
    console.warn('[API /ai/kuis] Gemini API gagal, beralih ke Kuis Konkret Lokal:', err);
    kuis = buatKuisKonkretLokal(materi);
  }

  // 5. Simpan log ke interaksi_ai
  try {
    await admin.from('interaksi_ai').insert({
      user_id: user.id,
      materi_id: materi.id,
      jenis: 'kuis',
      prompt: prompt.slice(0, 500),
      respons: JSON.stringify(kuis),
      token_used: tokenDigunakan,
    });
  } catch (logErr) {
    console.error('[API /ai/kuis] Gagal menyimpan log interaksi_ai:', logErr);
  }

  return NextResponse.json({
    sukses: true,
    materi_id: materi.id,
    materi_judul: materi.judul,
    kuis,
    token_used: tokenDigunakan,
  });
}
