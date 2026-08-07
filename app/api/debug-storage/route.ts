import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * GET /api/debug-storage
 * Endpoint diagnostik untuk menyelidiki BUG 1 (Storage & Download)
 */
export async function GET() {
  const admin = createAdminClient();
  const report: Record<string, unknown> = {};

  try {
    // 1. Cek daftar buckets
    const { data: buckets, error: bucketErr } = await admin.storage.listBuckets();
    report.buckets = buckets?.map((b) => ({
      id: b.id,
      name: b.name,
      public: b.public,
      file_size_limit: b.file_size_limit,
      allowed_mime_types: b.allowed_mime_types,
    }));
    report.bucketError = bucketErr?.message || null;

    // 2. Cek objek di bucket materi-files
    const { data: objects, error: objectsErr } = await admin.storage
      .from('materi-files')
      .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

    report.objects_in_root = objects || [];
    report.objectsError = objectsErr?.message || null;

    // Cek juga di subfolder jika ada user folders
    const subfolders: string[] = [];
    if (objects) {
      for (const obj of objects) {
        if (!obj.id) {
          // kemungkinan folder
          subfolders.push(obj.name);
        }
      }
    }

    const objectsInSubfolders: Record<string, unknown> = {};
    for (const folder of subfolders) {
      const { data: subObjs } = await admin.storage
        .from('materi-files')
        .list(folder, { limit: 50 });
      objectsInSubfolders[folder] = subObjs || [];
    }
    report.objects_in_subfolders = objectsInSubfolders;

    // 3. Cek baris di tabel materi dan file_url nya
    const { data: materis } = await admin
      .from('materi')
      .select('id, judul, file_url, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    report.materi_table_rows = materis || [];

    // 4. Test upload sample file nyata ke bucket materi-files
    const testFileName = `test_download_${Date.now()}.pdf`;
    const testContent = Buffer.from('%PDF-1.4 sample pdf content for testing download');
    const { data: uploadData, error: testUploadErr } = await admin.storage
      .from('materi-files')
      .upload(`test/${testFileName}`, testContent, {
        contentType: 'application/pdf',
        upsert: true,
      });

    report.test_upload = {
      path: uploadData?.path,
      error: testUploadErr?.message || null,
    };

    if (uploadData?.path) {
      // Dapatkan public URL
      const { data: publicUrlData } = admin.storage
        .from('materi-files')
        .getPublicUrl(uploadData.path);
      report.test_public_url = publicUrlData.publicUrl;

      // Dapatkan signed URL (1 jam)
      const { data: signedUrlData, error: signedErr } = await admin.storage
        .from('materi-files')
        .createSignedUrl(uploadData.path, 3600);

      report.test_signed_url = signedUrlData?.signedUrl || null;
      report.test_signed_url_error = signedErr?.message || null;
    }

    return NextResponse.json({
      status: 'ok',
      report,
    });
  } catch (err) {
    return NextResponse.json({
      status: 'error',
      error: err instanceof Error ? err.message : String(err),
      report,
    });
  }
}
