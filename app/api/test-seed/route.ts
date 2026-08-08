import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { buatPDFDenganTeks } from '@/lib/pdf-builder';

/**
 * GET /api/test-seed
 * Endpoint untuk seed 3 data materi uji dan verifikasi end-to-end.
 * HANYA untuk environment development/testing.
 *
 * Langkah:
 * 1. Buat user uji (atau gunakan yang sudah ada)
 * 2. Insert 3 baris materi dengan data nyata
 * 3. Tambah poin kontribusi uploader
 * 4. Verifikasi query ambilDaftarMateri berjalan
 * 5. Simulasi increment_unduhan
 * 6. Insert penilaian dari user yang sama
 */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Endpoint ini hanya tersedia di development.' }, { status: 403 });
  }

  const log: string[] = [];
  const admin = createAdminClient();

  try {
    // ─── Step 1: Pastikan user uji ada ───────────────────────────────────
    log.push('📌 Step 1: Memeriksa/membuat user uji...');

    const EMAIL_UJI = 'test.seed@lentera.dev';
    const KATA_SANDI_UJI = 'LenteraTest2026!';

    let userId: string;

    // Cek apakah user sudah ada
    const { data: existingUsers } = await admin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u) => u.email === EMAIL_UJI);

    if (existingUser) {
      userId = existingUser.id;
      log.push(`✅ User uji sudah ada: ${userId}`);
    } else {
      // Buat user baru dengan auto-confirm
      const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
        email: EMAIL_UJI,
        password: KATA_SANDI_UJI,
        email_confirm: true,
        user_metadata: {
          nama_lengkap: 'Mahasiswa Uji Lentera',
          asal_institusi: 'Universitas Indonesia',
          jurusan: 'Teknik Informatika',
          semester: '5',
          ipk: '3.75',
        },
      });

      if (createErr || !newUser.user) {
        return NextResponse.json({
          error: `Gagal membuat user uji: ${createErr?.message}`,
          log,
        }, { status: 500 });
      }

      userId = newUser.user.id;
      log.push(`✅ User uji baru dibuat: ${userId}`);
    }

    // Pastikan profil ada (trigger harusnya sudah membuat)
    const { data: profileCheck } = await admin
      .from('profiles')
      .select('id, nama_lengkap, poin_kontribusi')
      .eq('id', userId)
      .single();

    if (!profileCheck) {
      // Buat manual jika trigger tidak jalan
      await admin.from('profiles').insert({
        id: userId,
        nama_lengkap: 'Mahasiswa Uji Lentera',
        asal_institusi: 'Universitas Indonesia',
        jurusan: 'Teknik Informatika',
        semester: 5,
        ipk: 3.75,
        poin_kontribusi: 0,
      });
      log.push('✅ Profil dibuat manual (trigger tidak berjalan).');
    } else {
      log.push(`✅ Profil ditemukan: ${profileCheck.nama_lengkap}, Poin: ${profileCheck.poin_kontribusi}`);
    }

    // ─── Step 2: Hapus data uji lama (idempoten) ─────────────────────────
    log.push('📌 Step 2: Membersihkan data uji lama...');
    await admin.from('materi').delete().eq('uploader_id', userId);
    log.push('✅ Data materi lama dihapus.');

    // ─── Step 3: Upload berkas PDF fisik ke Storage & insert 3 materi nyata ───
    log.push('📌 Step 3: Mengunggah berkas PDF ke Storage (materi-files) & menyisipkan data...');

    const sampleFiles = [
      {
        path: 'sample/kalkulus1.pdf',
        content: buatPDFDenganTeks(
          'KALKULUS 1 - LIMIT, TURUNAN, DAN INTEGRAL\n\n' +
          'BAB 1: LIMIT FUNGSI\n' +
          'Limit adalah nilai yang didekati oleh fungsi f(x) saat x mendekati nilai c tertentu.\n' +
          'Notasi: lim(x->c) f(x) = L berarti f(x) mendekati L ketika x mendekati c.\n' +
          'Teorema Limit: lim[f(x)+g(x)] = lim f(x) + lim g(x)\n' +
          'Limit kiri dan kanan harus sama agar limit ada: lim(x->c-) = lim(x->c+)\n' +
          'Limit tak terhingga: lim(x->0) 1/x^2 = tak terhingga\n\n' +
          'BAB 2: TURUNAN (DIFERENSIAL)\n' +
          'Turunan f\x27(x) = lim(h->0) [f(x+h) - f(x)] / h\n' +
          'Aturan turunan dasar: f(x) = x^n maka f\x27(x) = n*x^(n-1)\n' +
          'Aturan Rantai: d/dx[f(g(x))] = f\x27(g(x)) * g\x27(x)\n' +
          'Aturan Produk: d/dx[u*v] = u\x27v + uv\x27\n' +
          'Aturan Quotient: d/dx[u/v] = (u\x27v - uv\x27) / v^2\n' +
          'Turunan fungsi trigonometri: d/dx[sin x] = cos x, d/dx[cos x] = -sin x\n' +
          'Turunan fungsi eksponensial: d/dx[e^x] = e^x, d/dx[ln x] = 1/x\n\n' +
          'BAB 3: INTEGRAL\n' +
          'Integral tak tentu: antiturunan F(x) + C di mana F\x27(x) = f(x)\n' +
          'Rumus integral dasar: integral x^n dx = x^(n+1)/(n+1) + C (n tidak sama dengan -1)\n' +
          'Integral sin x dx = -cos x + C; integral cos x dx = sin x + C\n' +
          'Teorema Dasar Kalkulus: integral(a ke b) f(x) dx = F(b) - F(a)\n' +
          'Integral menghitung luas daerah di bawah kurva f(x) antara x=a dan x=b\n' +
          'Teknik substitusi: jika u = g(x) maka integral f(g(x))g\x27(x)dx = integral f(u)du\n' +
          'Teknik integral parsial: integral u dv = uv - integral v du'
        ),
        judul: 'Catatan Lengkap Kalkulus 1 — Limit, Turunan & Integral',
        mata_kuliah: 'Kalkulus 1',
        kategori: 'catatan',
        deskripsi:
          'Catatan kuliah komprehensif mencakup materi Limit fungsi, Turunan (diferensial) beserta aturannya, dan Integral dasar. Dilengkapi contoh soal dan pembahasan langkah demi langkah.',
        jumlah_unduhan: 47,
        jumlah_suka: 12,
      },
      {
        path: 'sample/struktur-data.pdf',
        content: buatPDFDenganTeks(
          'RANGKUMAN STRUKTUR DATA DAN ALGORITMA\n\n' +
          'BAB 1: STACK (TUMPUKAN)\n' +
          'Stack adalah struktur data LIFO (Last In First Out) - elemen terakhir masuk, pertama keluar.\n' +
          'Operasi Stack: push() menambah elemen ke atas, pop() menghapus elemen teratas.\n' +
          'peek() melihat elemen teratas tanpa menghapus. isEmpty() memeriksa apakah stack kosong.\n' +
          'Aplikasi: evaluasi ekspresi aritmatika, backtracking, manajemen memori rekursi.\n\n' +
          'BAB 2: QUEUE (ANTRIAN)\n' +
          'Queue adalah struktur data FIFO (First In First Out) - elemen pertama masuk, pertama keluar.\n' +
          'Operasi: enqueue() menambah elemen di belakang, dequeue() menghapus elemen di depan.\n' +
          'front() melihat elemen terdepan. rear() melihat elemen terakhir.\n' +
          'Aplikasi: penjadwalan proses CPU, buffer data, BFS (Breadth First Search).\n\n' +
          'BAB 3: BINARY SEARCH TREE (BST)\n' +
          'BST adalah pohon biner di mana tiap node kiri lebih kecil dari root, kanan lebih besar.\n' +
          'Operasi: insert, delete, search dengan kompleksitas rata-rata O(log n).\n' +
          'Traversal: Inorder (kiri-root-kanan) menghasilkan urutan terurut ascending.\n' +
          'Preorder (root-kiri-kanan) dan Postorder (kiri-kanan-root) untuk keperluan lain.\n\n' +
          'BAB 4: GRAPH\n' +
          'Graph terdiri dari vertex (simpul) dan edge (sisi). Bisa berarah (directed) atau tidak.\n' +
          'Representasi: Adjacency Matrix O(V^2) ruang, Adjacency List O(V+E) ruang.\n' +
          'Algoritma BFS: menjelajah graph lapis per lapis menggunakan queue.\n' +
          'Algoritma DFS: menjelajah graph sedalam mungkin dulu menggunakan stack/rekursi.'
        ),
        judul: 'Rangkuman Struktur Data — Stack, Queue, Tree & Graph',
        mata_kuliah: 'Struktur Data dan Algoritma',
        kategori: 'rangkuman',
        deskripsi:
          'Ringkasan padat untuk UTS/UAS mencakup operasi dasar Stack (LIFO), Queue (FIFO), Binary Search Tree, dan representasi Graph. Cocok untuk review cepat sebelum ujian.',
        jumlah_unduhan: 83,
        jumlah_suka: 29,
      },
      {
        path: 'sample/statistika-bisnis.pdf',
        content: buatPDFDenganTeks(
          'STATISTIKA BISNIS — UJI HIPOTESIS DAN REGRESI\n\n' +
          'BAB 1: UJI HIPOTESIS\n' +
          'Hipotesis Nol (H0) menyatakan tidak ada perbedaan/pengaruh yang signifikan.\n' +
          'Hipotesis Alternatif (H1) menyatakan ada perbedaan/pengaruh yang signifikan.\n' +
          'Langkah uji hipotesis: tentukan H0 dan H1, pilih tingkat signifikansi alpha (0.05 atau 0.01).\n' +
          'Hitung statistik uji (t-test, z-test, chi-square), bandingkan dengan nilai kritis.\n' +
          'Jika p-value < alpha: tolak H0. Jika p-value >= alpha: gagal tolak H0.\n' +
          'Uji t satu sampel: t = (x_bar - mu) / (s / sqrt(n))\n\n' +
          'BAB 2: REGRESI LINEAR\n' +
          'Regresi linear sederhana: Y = a + bX + epsilon\n' +
          'Koefisien b = [n*sum(XY) - sum(X)*sum(Y)] / [n*sum(X^2) - (sum(X))^2]\n' +
          'Koefisien determinasi R^2 mengukur proporsi variasi Y yang dijelaskan oleh X (0 hingga 1).\n' +
          'Regresi linear berganda: Y = b0 + b1*X1 + b2*X2 + ... + bk*Xk\n\n' +
          'BAB 3: ANOVA (ANALISIS VARIANS)\n' +
          'ANOVA menguji apakah rata-rata tiga atau lebih kelompok berbeda secara signifikan.\n' +
          'F-statistik = MSB/MSW di mana MSB adalah Mean Square Between Groups.\n' +
          'Asumsi ANOVA: normalitas, homogenitas varians, independensi sampel.\n\n' +
          'BAB 4: KORELASI PEARSON\n' +
          'Korelasi Pearson r mengukur kekuatan hubungan linear antara dua variabel kontinu.\n' +
          'r = sum[(Xi - X_bar)(Yi - Y_bar)] / sqrt[sum(Xi-X_bar)^2 * sum(Yi-Y_bar)^2]\n' +
          'r = +1 korelasi positif sempurna, r = -1 negatif sempurna, r = 0 tidak ada korelasi.'
        ),
        judul: 'Bank Soal Statistika Bisnis dengan Pembahasan SPSS',
        mata_kuliah: 'Statistika Bisnis',
        kategori: 'bank_soal',
        deskripsi:
          'Kumpulan 50 soal latihan statistika bisnis beserta pembahasan lengkap menggunakan SPSS. Materi meliputi uji hipotesis, regresi linear, ANOVA, dan analisis korelasi Pearson.',
        jumlah_unduhan: 134,
        jumlah_suka: 41,
      },
    ];

    const dataMateriToInsert = [];

    for (const f of sampleFiles) {
      // Upload PDF fisik ke Supabase Storage
      const { error: uploadErr } = await admin.storage
        .from('materi-files')
        .upload(f.path, f.content, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (uploadErr) {
        log.push(`⚠️ Warning saat upload ${f.path}: ${uploadErr.message}`);
      } else {
        log.push(`  ✓ Berkas Storage berhasil diunggah: ${f.path}`);
      }

      const { data: pubUrlData } = admin.storage.from('materi-files').getPublicUrl(f.path);

      dataMateriToInsert.push({
        uploader_id: userId,
        judul: f.judul,
        mata_kuliah: f.mata_kuliah,
        kategori: f.kategori,
        deskripsi: f.deskripsi,
        file_url: pubUrlData.publicUrl,
        jumlah_unduhan: f.jumlah_unduhan,
        jumlah_suka: f.jumlah_suka,
      });
    }

    const { data: insertedMateri, error: insertErr } = await admin
      .from('materi')
      .insert(dataMateriToInsert)
      .select('id, judul, kategori, file_url');

    if (insertErr || !insertedMateri) {
      return NextResponse.json({
        error: `Gagal insert materi: ${insertErr?.message}`,
        log,
      }, { status: 500 });
    }

    log.push(`✅ 3 materi berhasil diinsert:`);
    insertedMateri.forEach((m, i) => {
      log.push(`   [${i + 1}] ${m.judul} (id: ${m.id})`);
    });

    // ─── Step 4: Update poin_kontribusi uploader (+30 untuk 3 materi) ────
    log.push('📌 Step 4: Update poin_kontribusi uploader...');
    const { data: profil } = await admin
      .from('profiles')
      .select('poin_kontribusi')
      .eq('id', userId)
      .single();

    const poinBaru = (profil?.poin_kontribusi || 0) + 30;
    await admin.from('profiles').update({ poin_kontribusi: poinBaru }).eq('id', userId);
    log.push(`✅ Poin kontribusi diperbarui menjadi: ${poinBaru}`);

    // ─── Step 5: Simulasi increment_unduhan pada materi pertama ──────────
    log.push('📌 Step 5: Simulasi increment_unduhan...');
    const materiId1 = insertedMateri[0].id;
    const { data: currentMateri } = await admin
      .from('materi')
      .select('jumlah_unduhan')
      .eq('id', materiId1)
      .single();

    const unduhanBaru = (currentMateri?.jumlah_unduhan || 0) + 1;
    const { error: updateErr } = await admin
      .from('materi')
      .update({ jumlah_unduhan: unduhanBaru })
      .eq('id', materiId1);

    if (updateErr) {
      log.push(`⚠️ Gagal update unduhan: ${updateErr.message}`);
    } else {
      log.push(`✅ jumlah_unduhan materi pertama → ${unduhanBaru}`);
    }

    // ─── Step 6: Insert penilaian (bintang 5) untuk materi kedua ─────────
    log.push('📌 Step 6: Insert penilaian bintang 5...');
    const materiId2 = insertedMateri[1].id;
    const { error: penilaianErr } = await admin.from('penilaian').upsert(
      {
        materi_id: materiId2,
        user_id: userId,
        nilai: 5,
      },
      { onConflict: 'materi_id,user_id' }
    );

    if (penilaianErr) {
      log.push(`⚠️ Gagal insert penilaian: ${penilaianErr.message}`);
    } else {
      log.push('✅ Penilaian bintang 5 berhasil disimpan.');
    }

    // ─── Step 7: Verifikasi query ambilDaftarMateri (baca ulang DB) ───────
    log.push('📌 Step 7: Verifikasi query listing materi...');
    const { data: daftarMateri, count, error: queryErr } = await admin
      .from('materi')
      .select(
        `
        id, judul, mata_kuliah, kategori, jumlah_unduhan,
        profiles:uploader_id ( id, nama_lengkap )
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(0, 8);

    if (queryErr) {
      log.push(`⚠️ Query listing error: ${queryErr.message}`);
    } else {
      log.push(`✅ Query listing sukses. Total materi di DB: ${count}`);
      daftarMateri?.forEach((m, i) => {
        log.push(`   [${i + 1}] ${m.judul} · ${m.mata_kuliah} · ${m.jumlah_unduhan} unduhan`);
      });
    }

    // ─── Step 8: Verifikasi query filter kategori ─────────────────────────
    log.push('📌 Step 8: Verifikasi filter kategori = "catatan"...');
    const { data: filtrasi, count: countFilter } = await admin
      .from('materi')
      .select('id, judul, kategori', { count: 'exact' })
      .eq('kategori', 'catatan');

    log.push(`✅ Materi berkategori "catatan": ${countFilter}`);
    filtrasi?.forEach((m) => log.push(`   → ${m.judul}`));

    // ─── Step 9: Verifikasi detail materi + rating ────────────────────────
    log.push('📌 Step 9: Verifikasi detail materi + kalkulasi rating...');
    const { data: penilaianData } = await admin
      .from('penilaian')
      .select('nilai')
      .eq('materi_id', materiId2);

    const total_penilai = penilaianData?.length || 0;
    const rating_rata_rata =
      total_penilai > 0
        ? Math.round(penilaianData!.reduce((acc, p) => acc + p.nilai, 0) / total_penilai * 10) / 10
        : 0;
    log.push(`✅ Materi ke-2 — Total penilai: ${total_penilai}, Rating rata-rata: ${rating_rata_rata}`);

    // ─── Ringkasan Hasil ─────────────────────────────────────────────────
    const result = {
      status: 'success',
      timestamp: new Date().toISOString(),
      user_uji: { id: userId, email: EMAIL_UJI },
      materi_dibuat: insertedMateri.map((m) => ({ id: m.id, judul: m.judul })),
      poin_kontribusi_akhir: poinBaru,
      total_materi_db: count,
      rating_materi2: { total_penilai, rating_rata_rata },
      log,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        status: 'error',
        error: err instanceof Error ? err.message : String(err),
        log,
      },
      { status: 500 }
    );
  }
}
