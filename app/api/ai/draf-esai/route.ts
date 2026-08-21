import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { tanyaGemini } from '@/lib/gemini';

/**
 * Fallback draf esai lokal apabila Gemini API tidak tersedia.
 * Menghasilkan esai motivasi berbasis template yang profesional.
 */
function buatDrafEsaiLokal(data: {
  namaBeasiswa: string;
  penyelenggara: string;
  namaUser: string;
  jurusan: string;
  semester: string | number;
  ipk: string | number;
  motivasiTambahan: string;
}): string {
  const { namaBeasiswa, penyelenggara, namaUser, jurusan, semester, ipk, motivasiTambahan } = data;

  return `**DRAF ESAI MOTIVASI — ${namaBeasiswa.toUpperCase()}**

---

**Perkenalan**

Saya, ${namaUser}, mahasiswa Program Studi ${jurusan} yang saat ini menempuh semester ${semester} dengan IPK ${ipk}, mengajukan diri sebagai calon penerima ${namaBeasiswa} yang diselenggarakan oleh ${penyelenggara}. Melalui esai ini, saya ingin menyampaikan latar belakang, motivasi, serta komitmen saya dalam memanfaatkan beasiswa ini sebaik-baiknya demi kemajuan diri dan kontribusi nyata bagi bangsa.

**Latar Belakang & Motivasi**

Perjalanan akademik saya tidak selalu berjalan mulus. Namun setiap tantangan justru memperkuat tekad saya untuk terus belajar dan berkembang. ${motivasiTambahan ? `${motivasiTambahan} ` : ''}Ketertarikan saya pada bidang ${jurusan} bukan sekadar pilihan studi, melainkan sebuah panggilan untuk memberikan kontribusi yang berarti di industri dan masyarakat Indonesia.

**Prestasi & Rekam Jejak**

Selama menempuh pendidikan, saya senantiasa berupaya menjaga konsistensi akademik dengan meraih IPK ${ipk}. Selain itu, saya aktif dalam kegiatan kemahasiswaan, organisasi, dan proyek-proyek yang relevan dengan bidang studi saya. Pengalaman ini membentuk karakter kepemimpinan, kemampuan kerja tim, dan kepekaan sosial yang saya yakini sangat diperlukan bagi penerima ${namaBeasiswa}.

**Rencana Pemanfaatan Beasiswa**

Apabila dipercaya menjadi penerima ${namaBeasiswa}, saya berkomitmen untuk:
1. Mempertahankan dan meningkatkan prestasi akademik secara konsisten
2. Aktif berkontribusi dalam kegiatan sosial dan komunitas yang berdampak
3. Memanfaatkan fasilitas dan jaringan yang diberikan untuk mengembangkan kompetensi
4. Berbagi ilmu dan pengalaman kepada rekan-rekan mahasiswa lain yang membutuhkan

**Kontribusi Jangka Panjang**

Visi saya ke depan adalah menjadi profesional yang tidak hanya unggul secara teknis, tetapi juga memiliki integritas dan kepedulian sosial yang tinggi. Dengan dukungan ${penyelenggara} melalui ${namaBeasiswa}, saya optimis dapat mewujudkan cita-cita tersebut dan memberikan kontribusi nyata bagi kemajuan Indonesia.

**Penutup**

Saya menyadari bahwa ${namaBeasiswa} adalah kesempatan emas yang sangat berharga. Oleh karena itu, saya berkomitmen penuh untuk mengemban amanah ini dengan segenap kemampuan dan dedikasi. Terima kasih atas kepercayaan dan kesempatan yang diberikan.

Hormat saya,
${namaUser}

---
*Draf ini dibuat oleh Asisten AI Lentera. Silakan disesuaikan dengan pengalaman dan kondisi pribadi Anda sebelum dikirim.*`;
}

/**
 * POST /api/ai/draf-esai
 *
 * Membuat draf esai motivasi beasiswa menggunakan Gemini AI
 * (dengan fallback template cerdas jika AI tidak tersedia).
 *
 * Body: {
 *   beasiswa_id: string          — ID beasiswa dari DB
 *   motivasi_tambahan?: string   — Konteks/motivasi personal dari user (opsional)
 * }
 */
export async function POST(request: NextRequest) {
  // ─── 1. Parse request body ─────────────────────────────────────────────
  let body: { beasiswa_id?: string; motivasi_tambahan?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Request body tidak valid. Kirim JSON dengan field beasiswa_id.' },
      { status: 400 }
    );
  }

  const { beasiswa_id, motivasi_tambahan } = body;
  if (!beasiswa_id || typeof beasiswa_id !== 'string') {
    return NextResponse.json(
      { error: 'Field beasiswa_id wajib diisi.' },
      { status: 400 }
    );
  }

  // ─── 2. Autentikasi user ───────────────────────────────────────────────
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

  const admin = createAdminClient();

  // ─── 3. Ambil data beasiswa dari DB ───────────────────────────────────
  const { data: beasiswa, error: beasiswaError } = await admin
    .from('beasiswa')
    .select(
      `
      id,
      nama_beasiswa,
      penyelenggara,
      jenis,
      kriteria_jurusan,
      kriteria_ipk_min,
      kriteria_semester_min,
      kriteria_khusus,
      deskripsi_singkat,
      status
    `
    )
    .eq('id', beasiswa_id)
    .single();

  if (beasiswaError || !beasiswa) {
    return NextResponse.json(
      { error: 'Data beasiswa tidak ditemukan.' },
      { status: 404 }
    );
  }

  // ─── 4. Ambil profil user dari DB ─────────────────────────────────────
  const { data: profil, error: profilError } = await admin
    .from('profiles')
    .select('id, nama_lengkap, jurusan, semester, ipk, kategori_khusus, asal_institusi')
    .eq('id', user.id)
    .single();

  if (profilError || !profil) {
    return NextResponse.json(
      { error: 'Profil pengguna tidak ditemukan. Pastikan profil Anda sudah dilengkapi.' },
      { status: 404 }
    );
  }

  // ─── 5. Susun data untuk prompt ───────────────────────────────────────
  const dataEsai = {
    namaBeasiswa: beasiswa.nama_beasiswa,
    penyelenggara: beasiswa.penyelenggara,
    namaUser: profil.nama_lengkap ?? 'Mahasiswa',
    jurusan: profil.jurusan ?? 'Tidak diketahui',
    semester: profil.semester ?? 'Tidak diketahui',
    ipk: profil.ipk ?? 'Tidak diketahui',
    motivasiTambahan: (motivasi_tambahan ?? '').trim(),
  };

  const prompt =
    `Anda adalah konsultan penulisan esai beasiswa profesional untuk mahasiswa Indonesia. ` +
    `Buatkan DRAF ESAI MOTIVASI yang kuat, autentik, dan personal untuk pendaftaran beasiswa berikut:\n\n` +
    `**Data Beasiswa:**\n` +
    `- Nama: ${dataEsai.namaBeasiswa}\n` +
    `- Penyelenggara: ${dataEsai.penyelenggara}\n` +
    `- Jenis: ${beasiswa.jenis}\n` +
    `- Persyaratan: ${beasiswa.kriteria_khusus || 'Tidak ada persyaratan khusus'}\n` +
    `- Deskripsi: ${beasiswa.deskripsi_singkat || 'Beasiswa pendidikan untuk mahasiswa berprestasi'}\n\n` +
    `**Profil Mahasiswa:**\n` +
    `- Nama: ${dataEsai.namaUser}\n` +
    `- Jurusan: ${dataEsai.jurusan}\n` +
    `- Semester: ${dataEsai.semester}\n` +
    `- IPK: ${dataEsai.ipk}\n` +
    `- Institusi: ${profil.asal_institusi || 'Perguruan Tinggi Indonesia'}\n` +
    `- Kategori Khusus: ${profil.kategori_khusus || 'Mahasiswa Umum'}\n` +
    (dataEsai.motivasiTambahan ? `- Konteks Motivasi Personal: ${dataEsai.motivasiTambahan}\n` : '') +
    `\n**Instruksi Penulisan:**\n` +
    `1. Tulis dalam Bahasa Indonesia yang formal, hangat, dan meyakinkan\n` +
    `2. Panjang: 400-600 kata\n` +
    `3. Struktur: Perkenalan → Latar Belakang & Motivasi → Prestasi → Rencana Pemanfaatan → Komitmen Kontribusi → Penutup\n` +
    `4. Sertakan detail spesifik yang relevan dengan jurusan dan beasiswa\n` +
    `5. Hindari klise berlebihan, buat terasa personal dan genuine\n` +
    `6. Akhiri dengan ajakan yang kuat untuk mempertimbangkan aplikasi ini\n\n` +
    `Hasilkan HANYA teks esai, tanpa judul template atau catatan tambahan.`;

  // ─── 6. Panggil AI dengan fallback ────────────────────────────────────
  let draftEsai: string;
  let tokenDigunakan: number = 0;

  try {
    const hasil = await tanyaGemini(prompt);
    draftEsai = hasil.teks;
    tokenDigunakan = hasil.tokenDigunakan;
  } catch (err) {
    console.warn('[API /ai/draf-esai] Gemini API tidak tersedia, beralih ke template lokal:', err);
    draftEsai = buatDrafEsaiLokal(dataEsai);
  }

  // ─── 7. Simpan log ke interaksi_ai (best-effort) ─────────────────────
  try {
    await admin.from('interaksi_ai').insert({
      user_id: user.id,
      beasiswa_id: beasiswa.id,
      jenis: 'draf_esai',
      prompt: `Draf esai untuk: ${beasiswa.nama_beasiswa} — User: ${profil.nama_lengkap}`,
      respons: draftEsai,
      token_used: tokenDigunakan,
    });
  } catch (logErr) {
    console.error('[API /ai/draf-esai] Gagal menyimpan log interaksi_ai:', logErr);
  }

  // ─── 8. Kembalikan respons ────────────────────────────────────────────
  return NextResponse.json({
    sukses: true,
    beasiswa_id: beasiswa.id,
    nama_beasiswa: beasiswa.nama_beasiswa,
    draft_esai: draftEsai,
    token_used: tokenDigunakan,
  });
}
