# Panduan Teknis Fitur AI — Lentera

Dokumen ini menjelaskan semua endpoint AI, model yang digunakan, prompt sistem, dan keputusan desain yang diambil pada platform Lentera.

---

## Model AI yang Digunakan

| Properti | Nilai |
|----------|-------|
| **Provider** | Google AI (Gemini) |
| **Model Utama** | `gemini-2.0-flash` |
| **Model Fallback** | `gemini-2.0-flash-lite` |
| **SDK** | `@google/genai` v2+ |
| **Runtime** | Server-side only (Node.js API Routes) |
| **Konfigurasi** | `GEMINI_API_KEY` di `.env.local` |

### Sistem Fallback Berlapis

Jika Gemini API tidak tersedia (kuota habis, key tidak valid, error jaringan), sistem **tidak menampilkan error ke pengguna** — melainkan otomatis beralih ke engine lokal berbasis aturan yang tetap memberikan hasil yang berguna.

---

## Fitur 1: Ringkasan Materi

**Endpoint:** `POST /api/ai/ringkasan`  
**File:** [`app/api/ai/ringkasan/route.ts`](../app/api/ai/ringkasan/route.ts)

### Request & Response

```jsonc
// Request Body
{ "materi_id": "uuid-materi" }

// Response (sukses)
{
  "sukses": true,
  "materi_id": "uuid",
  "materi_judul": "Catatan Kalkulus 1",
  "ringkasan": "• Limit adalah konsep...\n• Turunan merupakan...",
  "token_used": 312
}
```

### Alur Kerja
1. Autentikasi user (401 jika belum login)
2. Ambil metadata materi dari tabel `materi`
3. Download file PDF dari Supabase Storage → ekstrak teks dengan `pdf-parse`
4. Kirim teks ke Gemini dengan prompt meringkas 5 poin utama
5. Fallback: ekstrak baris bermakna langsung dari teks PDF
6. Simpan log ke `interaksi_ai`

---

## Fitur 2: Kuis Latihan

**Endpoint:** `POST /api/ai/kuis`  
**File:** [`app/api/ai/kuis/route.ts`](../app/api/ai/kuis/route.ts)

### Request & Response

```jsonc
// Request Body
{ "materi_id": "uuid-materi" }

// Response (sukses)
{
  "sukses": true,
  "materi_id": "uuid",
  "materi_judul": "Catatan Kalkulus 1",
  "kuis": [
    {
      "soal": "Apa yang dimaksud dengan limit fungsi?",
      "opsi": ["Nilai pendekatan", "Nilai turunan", "Nilai integral", "Nilai batas atas"],
      "jawaban_benar": 0
    }
  ],
  "token_used": 580
}
```

### Alur Kerja
1. Autentikasi + ambil metadata materi
2. Download PDF → ekstrak teks
3. Prompt Gemini untuk buat 5 soal pilihan ganda berbasis isi teks (bukan meta-info)
4. Parse JSON dari respons Gemini dengan pembersihan markdown code fence
5. Fallback: template soal konkret berbasis judul & mata kuliah
6. Simpan log ke `interaksi_ai`

---

## Fitur 3: Tanya Jawab Materi

**Endpoint:** `POST /api/ai/tanya-jawab`  
**File:** [`app/api/ai/tanya-jawab/route.ts`](../app/api/ai/tanya-jawab/route.ts)

### Request & Response

```jsonc
// Request Body
{ "materi_id": "uuid-materi", "pertanyaan": "Apa itu turunan parsial?" }

// Response (sukses)
{
  "sukses": true,
  "materi_id": "uuid",
  "materi_judul": "Catatan Kalkulus 1",
  "pertanyaan": "Apa itu turunan parsial?",
  "jawaban": "Berdasarkan materi...",
  "token_used": 420
}
```

### Catatan Penting
AI diperintahkan untuk **hanya menjawab berdasarkan isi teks materi** — tidak boleh mengarang dari pengetahuan umum. Jika jawaban tidak tersedia di materi, AI menyatakan hal tersebut dengan jujur.

---

## Fitur 4: Pencocokan Beasiswa AI

**Endpoint:** `POST /api/ai/pencocokan-beasiswa`  
**File:** [`app/api/ai/pencocokan-beasiswa/route.ts`](../app/api/ai/pencocokan-beasiswa/route.ts)

### Request & Response

```jsonc
// Request Body
{ "user_id": "uuid-user" }

// Response (sukses)
{
  "sukses": true,
  "profil_digunakan": {
    "jurusan": "Teknik Informatika",
    "semester": 5,
    "ipk": 3.75,
    "kategori_khusus": "Penerima KIP-K"
  },
  "jumlah_beasiswa_diperiksa": 9,
  "rekomendasi": "1. **Beasiswa LPDP** (Kemenkeu)...",
  "token_used": 840
}
```

### Pendekatan RAG (Retrieval-Augmented Generation)

Untuk mencegah halusinasi AI (beasiswa fiktif), sistem menggunakan:
1. **Retrieve** — Ambil SEMUA beasiswa aktif (`status = 'aktif'`) dari Supabase
2. **Augment** — Sertakan data JSON dalam prompt secara eksplisit
3. **Generate** — Gemini HANYA boleh merekomendasikan dari daftar yang diberikan

### Fallback Rule-Based Engine

Jika Gemini tidak tersedia, sistem menghitung skor kecocokan berdasarkan:
- **+40 poin** — IPK memenuhi syarat minimum
- **+30 poin** — Semester memenuhi syarat minimum  
- **+20 poin** — Jurusan cocok
- Urutkan dari skor tertinggi, tampilkan 5 teratas

---

## Fitur 5: Draf Esai Beasiswa

**Endpoint:** `POST /api/ai/draf-esai`  
**File:** [`app/api/ai/draf-esai/route.ts`](../app/api/ai/draf-esai/route.ts)

### Request & Response

```jsonc
// Request Body
{
  "beasiswa_id": "uuid-beasiswa",
  "motivasi_tambahan": "Saya berasal dari keluarga petani..." // opsional
}

// Response (sukses)
{
  "sukses": true,
  "beasiswa_id": "uuid",
  "nama_beasiswa": "Beasiswa LPDP Reguler 2026",
  "draft_esai": "**DRAF ESAI MOTIVASI**\n\nSaya, Budi Santoso...",
  "token_used": 920
}
```

### Personalisasi

Esai dibuat berdasarkan kombinasi:
- Data beasiswa (nama, penyelenggara, jenis, persyaratan, deskripsi)
- Profil akademik user (nama, jurusan, semester, IPK, institusi, kategori khusus)
- Motivasi tambahan yang diketik user (opsional, max 500 karakter)

---

## Keamanan & Logging

### Keamanan

| Aspek | Implementasi |
|-------|-------------|
| API Key | `GEMINI_API_KEY` tanpa prefix `NEXT_PUBLIC_` — tidak pernah ke browser |
| Autentikasi | Setiap endpoint cek sesi Supabase via `getUser()` sebelum memanggil AI |
| Otorisasi | `/api/ai/pencocokan-beasiswa` hanya izinkan user akses profil sendiri |

### Log Interaksi (`interaksi_ai`)

Setiap panggilan AI yang berhasil dicatat ke tabel `interaksi_ai`:

| Field | Isi |
|-------|-----|
| `user_id` | UUID user yang meminta |
| `materi_id` | UUID materi (untuk fitur berbasis materi) |
| `beasiswa_id` | UUID beasiswa (untuk fitur berbasis beasiswa) |
| `jenis` | `ringkasan` / `kuis` / `tanya_jawab` / `pencocokan_beasiswa` / `draf_esai` |
| `prompt` | Ringkasan konteks yang dikirim |
| `respons` | Output dari Gemini atau fallback |
| `token_used` | Jumlah token yang dikonsumsi |

---

## Cara Mengaktifkan

1. Dapatkan API key di [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Isi `GEMINI_API_KEY=AIzaSy...` di file `.env.local`
3. Restart server: `npm run dev`

```bash
# Test cepat health check
curl http://localhost:3000/api/health

# Test ringkasan (butuh cookie session dari browser)
curl -X POST http://localhost:3000/api/ai/ringkasan \
  -H "Content-Type: application/json" \
  -b "sb-<project>-auth-token=<token>" \
  -d '{"materi_id": "uuid-materi-anda"}'
```

> Semua endpoint AI memerlukan session cookie autentikasi Supabase yang valid.
