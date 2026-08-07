import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { tanyaGemini } from '@/lib/gemini';

/**
 * Fallback Lokal — Pencocokan Berbasis Aturan (Rule-Based Engine)
 * Dipanggil secara otomatis apabila Gemini API mengalami kendala (kuota 429, API key belum diisi, dsb).
 * Memastikan fitur SELALU BERJALAN 100% tanpa pernah menampilkan error merah ke mahasiswa.
 */
function buatPencocokanBeasiswaLokal(
  profil: { jurusan: string; semester: number | string; ipk: number | string; kategori_khusus: string },
  daftarBeasiswa: any[]
): string {
  const ipkUser = typeof profil.ipk === 'number' ? profil.ipk : parseFloat(String(profil.ipk)) || 0;
  const semesterUser = typeof profil.semester === 'number' ? profil.semester : parseInt(String(profil.semester), 10) || 1;
  const jurusanUser = (profil.jurusan || '').toLowerCase();

  // Hitung skor kecocokan tiap beasiswa
  const beasiswaTerskor = daftarBeasiswa.map((b) => {
    let skor = 0;
    const ipkMin = b.kriteria_ipk_min || 0;
    const semMin = b.kriteria_semester_min || 1;
    const jur = (b.kriteria_jurusan || 'semua').toLowerCase();

    // Syarat IPK
    if (ipkUser >= ipkMin) {
      skor += 40;
      if (ipkUser >= ipkMin + 0.3) skor += 10;
    } else {
      skor -= 30; // Kurang IPK
    }

    // Syarat Semester
    if (semesterUser >= semMin) {
      skor += 30;
    } else {
      skor -= 20;
    }

    // Syarat Jurusan
    if (jur === 'semua' || jur.includes(jurusanUser) || jurusanUser.includes(jur)) {
      skor += 20;
    }

    return { beasiswa: b, skor, ipkMin, semMin };
  });

  // Urutkan dari skor tertinggi
  beasiswaTerskor.sort((a, b) => b.skor - a.skor);

  // Ambil maksimal 5 teratas
  const teratas = beasiswaTerskor.slice(0, 5);

  if (teratas.length === 0) {
    return 'Belum ada beasiswa yang cocok dengan profil Anda saat ini. Silakan periksa kembali kriteria di halaman profil.';
  }

  const hasilBaris = teratas.map((item, index) => {
    const b = item.beasiswa;
    const alasanParts: string[] = [];

    if (ipkUser >= item.ipkMin) {
      alasanParts.push(`IPK Anda (${ipkUser.toFixed(2)}) memenuhi kriteria minimum (${item.ipkMin.toFixed(2)}).`);
    } else {
      alasanParts.push(`IPK minimum yang disyaratkan adalah ${item.ipkMin.toFixed(2)}.`);
    }

    if (semesterUser >= item.semMin) {
      alasanParts.push(`Terbuka untuk mahasiswa semester ${semesterUser} (syarat min. semester ${item.semMin}).`);
    }

    return `${index + 1}. **${b.nama_beasiswa}** (${b.penyelenggara})\nAlasan: ${alasanParts.join(' ')}`;
  });

  return hasilBaris.join('\n\n');
}

/**
 * POST /api/ai/pencocokan-beasiswa
 *
 * Mencocokkan profil mahasiswa dengan beasiswa yang tersedia di DB
 * menggunakan Gemini gemini-2.0-flash (dengan Fallback Cerdas Sistem Aturan).
 */
export async function POST(request: NextRequest) {
  // ─── 1. Parse request body ────────────────────────────────────────────
  let body: { user_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Request body tidak valid. Kirim JSON dengan field user_id.' },
      { status: 400 }
    );
  }

  const { user_id } = body;
  if (!user_id || typeof user_id !== 'string') {
    return NextResponse.json(
      { error: 'Field user_id wajib diisi.' },
      { status: 400 }
    );
  }

  // ─── 2. Autentikasi & otorisasi ───────────────────────────────────────
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

  if (user.id !== user_id) {
    return NextResponse.json(
      { error: 'Anda hanya dapat melihat rekomendasi beasiswa untuk profil Anda sendiri.' },
      { status: 403 }
    );
  }

  // ─── 3. Ambil profil user dari DB ────────────────────────────────────
  const admin = createAdminClient();
  const { data: profil, error: profilError } = await admin
    .from('profiles')
    .select('id, nama_lengkap, jurusan, semester, ipk, kategori_khusus, asal_institusi')
    .eq('id', user_id)
    .single();

  if (profilError || !profil) {
    return NextResponse.json(
      { error: 'Profil pengguna tidak ditemukan. Pastikan profil sudah dilengkapi.' },
      { status: 404 }
    );
  }

  if (!profil.jurusan && !profil.semester && !profil.ipk) {
    return NextResponse.json(
      {
        error:
          'Profil Anda belum lengkap. Harap isi jurusan, semester, dan IPK di halaman profil untuk mendapatkan rekomendasi beasiswa yang akurat.',
      },
      { status: 422 }
    );
  }

  // ─── 4. Query semua beasiswa aktif dari DB ────────────────────────────
  const { data: daftarBeasiswa, error: beasiswaError } = await admin
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
      deadline_pendaftaran,
      link_resmi,
      deskripsi_singkat,
      status
    `
    )
    .eq('status', 'aktif')
    .order('deadline_pendaftaran', { ascending: true });

  if (beasiswaError) {
    console.error('[API /ai/pencocokan-beasiswa] Error query beasiswa:', beasiswaError);
    return NextResponse.json(
      { error: 'Gagal memuat data beasiswa dari database.' },
      { status: 500 }
    );
  }

  if (!daftarBeasiswa || daftarBeasiswa.length === 0) {
    return NextResponse.json({
      sukses: true,
      rekomendasi:
        'Saat ini belum ada beasiswa aktif yang tersedia di platform Lentera. Silakan cek kembali secara berkala.',
      profil_digunakan: {
        jurusan: profil.jurusan,
        semester: profil.semester,
        ipk: profil.ipk,
      },
      jumlah_beasiswa_diperiksa: 0,
    });
  }

  // ─── 5. Susun data prompt ──────────────────────────────────────────────
  const profilRingkas = {
    jurusan: profil.jurusan ?? 'Tidak diketahui',
    semester: profil.semester ?? 'Tidak diketahui',
    ipk: profil.ipk ?? 'Tidak diketahui',
    kategori_khusus: profil.kategori_khusus ?? 'Umum',
    asal_institusi: profil.asal_institusi ?? 'Tidak diketahui',
  };

  const beasiswaUntukPrompt = daftarBeasiswa.map((b) => ({
    id: b.id,
    nama: b.nama_beasiswa,
    penyelenggara: b.penyelenggara,
    jenis: b.jenis,
    kriteria_jurusan: b.kriteria_jurusan,
    kriteria_ipk_min: b.kriteria_ipk_min,
    kriteria_semester_min: b.kriteria_semester_min,
    kriteria_khusus: b.kriteria_khusus,
    deadline: b.deadline_pendaftaran,
    deskripsi: b.deskripsi_singkat,
  }));

  const prompt =
    `Anda adalah asisten pencocokan beasiswa untuk mahasiswa Indonesia. ` +
    `HANYA boleh merekomendasikan beasiswa dari daftar yang diberikan — ` +
    `DILARANG mengarang beasiswa lain. ` +
    `Berdasarkan profil (jurusan: ${profilRingkas.jurusan}, semester: ${profilRingkas.semester}, IPK: ${profilRingkas.ipk}), ` +
    `urutkan beasiswa dari paling relevan, jelaskan alasan tiap kecocokan (maks 2 kalimat, maksimal 5 teratas). ` +
    `Daftar beasiswa (JSON): ${JSON.stringify(beasiswaUntukPrompt)}`;

  // ─── 6. Panggil AI dengan Fallback Cerdas ──────────────────────────────
  let rekomendasi: string;
  let tokenDigunakan: number = 0;

  try {
    const hasil = await tanyaGemini(prompt);
    rekomendasi = hasil.teks;
    tokenDigunakan = hasil.tokenDigunakan;
  } catch (err) {
    // Jika Gemini API kendala (kuota habis / API Key / Network), gunakan Engine Pencocokan Cerdas Lokal!
    console.warn('[API /ai/pencocokan-beasiswa] Gemini API tidak tersedia, beralih ke Rule-Based Engine lokal:', err);
    rekomendasi = buatPencocokanBeasiswaLokal(profilRingkas, daftarBeasiswa);
  }

  // ─── 7. Simpan log ke interaksi_ai (best-effort) ─────────────────────
  try {
    await admin.from('interaksi_ai').insert({
      user_id: user.id,
      jenis: 'pencocokan_beasiswa',
      prompt: JSON.stringify({
        profil: profilRingkas,
        jumlah_beasiswa: daftarBeasiswa.length,
      }),
      respons: rekomendasi,
      token_used: tokenDigunakan,
    });
  } catch (logErr) {
    console.error('[API /ai/pencocokan-beasiswa] Gagal menyimpan log interaksi_ai:', logErr);
  }

  // ─── 8. Kembalikan respons ────────────────────────────────────────────
  return NextResponse.json({
    sukses: true,
    profil_digunakan: profilRingkas,
    jumlah_beasiswa_diperiksa: daftarBeasiswa.length,
    rekomendasi,
    token_used: tokenDigunakan,
  });
}
