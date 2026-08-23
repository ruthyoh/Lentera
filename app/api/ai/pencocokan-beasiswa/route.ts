import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { tanyaGemini } from '@/lib/gemini';

interface JawabanTambahan {
  jurusan?: string;
  semester?: number | string;
  ipk?: number | string;
  minat?: string[];
  bakat_prestasi?: string[];
  kebutuhan_prioritas?: string;
  catatan_khusus?: string;
}

/**
 * Fallback Lokal — Pencocokan Berbasis Aturan (Rule-Based Engine)
 * Dipanggil secara otomatis apabila Gemini API mengalami kendala (kuota 429, API key belum diisi, dsb).
 * Memastikan fitur SELALU BERJALAN 100% tanpa pernah menampilkan error ke mahasiswa.
 */
function buatPencocokanBeasiswaLokal(
  profil: {
    jurusan: string;
    semester: number | string;
    ipk: number | string;
    kategori_khusus?: string;
    minat?: string;
    bakat_prestasi?: string;
    kebutuhan_prioritas?: string;
    catatan_khusus?: string;
  },
  daftarBeasiswa: any[]
): string {
  const ipkUser = typeof profil.ipk === 'number' ? profil.ipk : parseFloat(String(profil.ipk)) || 0;
  const semesterUser = typeof profil.semester === 'number' ? profil.semester : parseInt(String(profil.semester), 10) || 1;
  const jurusanUser = (profil.jurusan || '').toLowerCase();
  const minatUser = (profil.minat || '').toLowerCase();
  const kebutuhanUser = (profil.kebutuhan_prioritas || '').toLowerCase();

  // Hitung skor kecocokan tiap beasiswa
  const beasiswaTerskor = daftarBeasiswa.map((b) => {
    let skor = 0;
    const ipkMin = b.kriteria_ipk_min || 0;
    const semMin = b.kriteria_semester_min || 1;
    const jur = (b.kriteria_jurusan || 'semua').toLowerCase();
    const jenisBeasiswa = (b.jenis || '').toLowerCase();

    // Syarat IPK
    if (ipkUser >= ipkMin) {
      skor += 35;
      if (ipkUser >= ipkMin + 0.3) skor += 10;
    } else {
      skor -= 30; // Kurang IPK
    }

    // Syarat Semester
    if (semesterUser >= semMin) {
      skor += 25;
    } else {
      skor -= 20;
    }

    // Syarat Jurusan
    if (jur === 'semua' || jur.includes(jurusanUser) || jurusanUser.includes(jur)) {
      skor += 20;
    }

    // Kesesuaian Minat & Jenis Beasiswa
    if (minatUser && (minatUser.includes(jenisBeasiswa) || jenisBeasiswa.includes(minatUser))) {
      skor += 15;
    }
    if (kebutuhanUser && kebutuhanUser.includes(jenisBeasiswa)) {
      skor += 15;
    }

    return { beasiswa: b, skor, ipkMin, semMin };
  });

  // Urutkan dari skor tertinggi
  beasiswaTerskor.sort((a, b) => b.skor - a.skor);

  // Ambil maksimal 5 teratas
  const teratas = beasiswaTerskor.slice(0, 5);

  if (teratas.length === 0) {
    return 'Belum ada beasiswa yang cocok dengan profil & jawaban kuesioner Anda saat ini.';
  }

  const hasilBaris = teratas.map((item, index) => {
    const b = item.beasiswa;
    const alasanParts: string[] = [];

    if (ipkUser >= item.ipkMin) {
      alasanParts.push(`IPK Anda (${ipkUser.toFixed(2)}) memenuhi kriteria minimum (${item.ipkMin.toFixed(2)}).`);
    } else {
      alasanParts.push(`Sesuai dengan kriteria akademik dan minat bidang yang Anda pilih.`);
    }

    if (profil.minat && profil.minat !== 'Umum / Akademik') {
      alasanParts.push(`Mendukung pengembangan minat pada bidang ${profil.minat}.`);
    }

    return `${index + 1}. **${b.nama_beasiswa}** (${b.penyelenggara})\nAlasan: ${alasanParts.join(' ')}`;
  });

  return hasilBaris.join('\n\n');
}

/**
 * POST /api/ai/pencocokan-beasiswa
 *
 * Mencocokkan profil & kuesioner mahasiswa dengan beasiswa yang tersedia di DB
 * menggunakan Gemini gemini-2.0-flash (dengan Fallback Cerdas Sistem Aturan).
 */
export async function POST(request: NextRequest) {
  // ─── 1. Parse request body ────────────────────────────────────────────
  let body: { user_id?: string; jawaban_tambahan?: JawabanTambahan };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Request body tidak valid. Kirim JSON dengan field user_id.' },
      { status: 400 }
    );
  }

  const { user_id, jawaban_tambahan } = body;
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

  // Gabungkan profil DB dengan jawaban kuesioner interaktif
  const jawaban = jawaban_tambahan || {};
  const jurusanFinal = (jawaban.jurusan || profil.jurusan || '').trim();
  const semesterFinal = jawaban.semester ?? profil.semester ?? '';
  const ipkFinal = jawaban.ipk ?? profil.ipk ?? '';

  if (!jurusanFinal && !semesterFinal && !ipkFinal) {
    return NextResponse.json(
      {
        error:
          'Data akademik (jurusan, semester, dan IPK) belum diisi. Harap isi kuesioner atau lengkapi halaman profil Anda.',
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
        jurusan: jurusanFinal,
        semester: semesterFinal,
        ipk: ipkFinal,
      },
      jumlah_beasiswa_diperiksa: 0,
    });
  }

  // ─── 5. Susun data prompt ──────────────────────────────────────────────
  const minatStr = Array.isArray(jawaban.minat) && jawaban.minat.length > 0 ? jawaban.minat.join(', ') : 'Umum / Akademik';
  const bakatStr = Array.isArray(jawaban.bakat_prestasi) && jawaban.bakat_prestasi.length > 0 ? jawaban.bakat_prestasi.join(', ') : 'Belum diisi spesifik';
  const kebutuhanStr = jawaban.kebutuhan_prioritas || 'Semua Jenis Beasiswa';
  const catatanStr = (jawaban.catatan_khusus || '').trim() || 'Tidak ada';

  const profilRingkas = {
    jurusan: jurusanFinal || 'Tidak diketahui',
    semester: semesterFinal || 'Tidak diketahui',
    ipk: typeof ipkFinal === 'number' ? ipkFinal : parseFloat(String(ipkFinal)) || 'Tidak diketahui',
    kategori_khusus: profil.kategori_khusus ?? 'Umum',
    asal_institusi: profil.asal_institusi ?? 'Tidak diketahui',
    minat: minatStr,
    bakat_prestasi: bakatStr,
    kebutuhan_prioritas: kebutuhanStr,
    catatan_khusus: catatanStr,
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
    `Anda adalah asisten pencocokan beasiswa cerdas untuk mahasiswa di platform Lentera.\n` +
    `HANYA boleh merekomendasikan beasiswa dari daftar JSON yang diberikan (DILARANG MENGARANG BEASISWA DILUAR DAFTAR).\n\n` +
    `DATA AKADEMIK & HASIL KUESIONER MAHASISWA:\n` +
    `- Jurusan / Program Studi: ${profilRingkas.jurusan}\n` +
    `- Semester Saat Ini: ${profilRingkas.semester}\n` +
    `- IPK Kumulatif: ${profilRingkas.ipk}\n` +
    `- Minat Bidang / Focus Passion: ${profilRingkas.minat}\n` +
    `- Bakat, Prestasi & Pengalaman: ${profilRingkas.bakat_prestasi}\n` +
    `- Prioritas Kebutuhan Beasiswa: ${profilRingkas.kebutuhan_prioritas}\n` +
    `- Catatan Khusus / Keinginan Tambahan: ${profilRingkas.catatan_khusus}\n\n` +
    `TUGAS UTAMA:\n` +
    `1. Evaluasi kesesuaian profil mahasiswa dengan kriteria akademik (IPK, Semester, Jurusan) dan preferensi minat/bakat.\n` +
    `2. Pilih maksimal 5 beasiswa paling relevan, urutkan dari yang paling direkomendasikan.\n` +
    `3. Format respons Anda HARUS diawali penomoran persis seperti contoh berikut agar mudah diparse:\n` +
    `1. **Nama Beasiswa** (Penyelenggara)\n` +
    `Alasan: [Jelaskan secara spesifik 1-2 kalimat mengapa beasiswa ini sangat cocok dengan jurusan, IPK, minat bidang, atau bakat/prestasi mahasiswa].\n\n` +
    `Daftar Beasiswa Aktif (JSON): ${JSON.stringify(beasiswaUntukPrompt)}`;

  // ─── 6. Panggil AI dengan Fallback Cerdas ──────────────────────────────
  let rekomendasi: string;
  let tokenDigunakan: number = 0;

  try {
    const hasil = await tanyaGemini(prompt);
    rekomendasi = hasil.teks;
    tokenDigunakan = hasil.tokenDigunakan;
  } catch (err) {
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
