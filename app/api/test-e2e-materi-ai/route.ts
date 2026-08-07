import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { ekstrakTeksPDF } from '@/lib/extractor';

/**
 * GET /api/test-e2e-materi-ai
 * Menguji secara end-to-end ekstraksi PDF nyata dari Supabase Storage
 * untuk materi "Catatan Lengkap Kalkulus 1" dan membuktikan isi substansialnya.
 */
export async function GET() {
  const admin = createAdminClient();
  const report: Record<string, unknown> = {};

  try {
    // 1. Cari materi Kalkulus 1
    const { data: materiList } = await admin
      .from('materi')
      .select('id, judul, mata_kuliah, file_url, deskripsi')
      .ilike('judul', '%Kalkulus%')
      .limit(1);

    if (!materiList || materiList.length === 0) {
      return NextResponse.json({ error: 'Materi Kalkulus tidak ditemukan. Jalankan /api/test-seed terlebih dahulu.' }, { status: 400 });
    }

    const materi = materiList[0];
    report.materi = materi;

    // 2. Unduh PDF dari Storage & ekstrak teks
    let teksIsi = '';
    if (materi.file_url) {
      const match = materi.file_url.match(/materi-files\/(.+)$/);
      const storagePath = match ? match[1] : null;

      if (storagePath) {
        const { data: fileBlob, error: downloadErr } = await admin.storage
          .from('materi-files')
          .download(storagePath);

        if (!downloadErr && fileBlob) {
          const arrayBuffer = await fileBlob.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          teksIsi = await ekstrakTeksPDF(buffer);
        }
      }
    }

    report.ekstraksi = {
      panjang_karakter: teksIsi.length,
      snippet_isi: teksIsi.slice(0, 400),
      is_substansial: teksIsi.length >= 200,
    };

    return NextResponse.json({
      status: 'success',
      report,
    });
  } catch (err) {
    return NextResponse.json({
      status: 'error',
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
