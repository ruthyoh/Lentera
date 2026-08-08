# Panduan Penggunaan Fitur AI Lentera

Dokumen ini menjelaskan implementasi fitur kecerdasan buatan (AI) pada platform Lentera, mencakup model yang digunakan, prompt sistem, dan keputusan desain yang diambil.

---

## Model AI yang Digunakan

| Properti | Nilai |
|----------|-------|
| **Provider** | Google AI (Gemini) |
| **Model** | `gemini-2.0-flash` |
| **SDK** | `@google/genai` (npm) |
| **Runtime** | Server-side only (Node.js) |
| **Konfigurasi** | `GEMINI_API_KEY` di `.env.local` |

### Mengapa `gemini-2.0-flash`?

- **Latensi rendah** — ideal untuk respons API real-time di halaman web
- **Efisiensi token** — biaya operasional lebih rendah dibanding model full-size
- **Kualitas Bahasa Indonesia** — performa tinggi untuk teks akademik bahasa Indonesia
- **Bebas batas konteks** yang cukup untuk memuat seluruh daftar beasiswa dalam satu prompt

---

## Fitur 1: Ringkasan Materi

**Endpoint:** `POST /api/ai/ringkasan`

**File:** [`app/api/ai/ringkasan/route.ts`](../app/api/ai/ringkasan/route.ts)

### Input & Output

```jsonc
// Request Body
{ "materi_id": "uuid-materi" }

// Response (sukses)
{
  "sukses": true,
  "materi_id": "uuid",
  "materi_judul": "Catatan Kalkulus 1",
  "ringkasan": "• Limit adalah ...\n• Turunan merupakan ...",
  "token_used": 312
}
```

### Prompt Sistem (persis sesuai spesifikasi)

```
Anda adalah asisten belajar akademik untuk mahasiswa Indonesia. Ringkas materi berikut menjadi poin-poin utama, Bahasa Indonesia, maksimal 200 kata, fokus konsep kunci. Materi: {teks_materi}
```

Di mana `{teks_materi}` diisi dengan gabungan metadata materi dari database:
- `Judul: <judul>`
- `Mata Kuliah: <mata_kuliah>`
- `Kategori: <kategori>`
- `Deskripsi: <deskripsi>` *(jika tersedia)*

### Catatan Implementasi

Karena ekstraksi teks langsung dari file PDF/DOCX memerlukan library tambahan (seperti `pdf-parse` atau layanan eksternal) yang berpotensi menambah latensi dan kompleksitas signifikan, implementasi saat ini menggunakan **metadata materi dari database** (judul, mata kuliah, deskripsi) sebagai teks konteks. Pendekatan ini:
- Lebih ringan dan cepat
- Tetap memberikan ringkasan yang relevan berdasarkan informasi yang diisi uploader
- Dapat ditingkatkan di iterasi berikutnya dengan menambahkan ekstraksi PDF nyata

---

## Fitur 2: Pencocokan Beasiswa

**Endpoint:** `POST /api/ai/pencocokan-beasiswa`

**File:** [`app/api/ai/pencocokan-beasiswa/route.ts`](../app/api/ai/pencocokan-beasiswa/route.ts)

### Input & Output

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
  "jumlah_beasiswa_diperiksa": 12,
  "rekomendasi": "1. **Beasiswa Bidikmisi** (Kemendikbud)...",
  "token_used": 840
}
```

### Prompt Sistem (persis sesuai spesifikasi)

```
Anda adalah asisten pencocokan beasiswa untuk mahasiswa Indonesia. HANYA boleh merekomendasikan beasiswa dari daftar yang diberikan — DILARANG mengarang beasiswa lain. Berdasarkan profil (jurusan: {jurusan}, semester: {semester}, IPK: {ipk}), urutkan beasiswa dari paling relevan, jelaskan alasan tiap kecocokan (maks 2 kalimat, maksimal 5 teratas). Daftar beasiswa (JSON): {daftar_beasiswa}
```

Di mana placeholder diisi dengan data nyata dari database Supabase:
- `{jurusan}`, `{semester}`, `{ipk}` — dari tabel `profiles`
- `{daftar_beasiswa}` — JSON array dari tabel `beasiswa` (hanya yang `status = 'aktif'`)

---

## Mengapa Pencocokan Dibatasi Hanya pada Data yang Di-retrieve?

### Masalah: Halusinasi AI

Model bahasa besar (LLM) seperti Gemini memiliki kecenderungan untuk **"mengarang" informasi** yang terdengar masuk akal tetapi tidak akurat — fenomena yang disebut *hallucination*. Dalam konteks beasiswa, ini sangat berbahaya:

- AI bisa menyebut beasiswa fiktif dengan nama dan deadline yang terlihat nyata
- Mahasiswa bisa membuang waktu mencari beasiswa yang tidak ada
- Platform kehilangan kepercayaan jika rekomendasi tidak bisa diverifikasi

### Solusi: Retrieval-Augmented Generation (RAG)

Implementasi Lentera menggunakan pendekatan **RAG sederhana**:

1. **Retrieve** — Ambil SEMUA beasiswa aktif dari tabel `beasiswa` di Supabase
2. **Augment** — Sertakan data tersebut secara eksplisit dalam prompt sebagai JSON
3. **Generate** — Instruksikan Gemini untuk HANYA memilih dari daftar yang diberikan

Dengan mengirimkan daftar beasiswa yang sudah diverifikasi dalam prompt, AI tidak perlu "mengingat" dari data training-nya yang mungkin sudah usang atau tidak akurat. Setiap rekomendasi yang muncul **bisa langsung diverifikasi** karena berasal dari database Lentera sendiri.

### Manfaat Tambahan

- **Data selalu terkini** — beasiswa yang sudah ditutup tidak akan direkomendasikan karena difilter `status = 'aktif'`
- **Auditabilitas** — setiap interaksi dicatat di tabel `interaksi_ai` beserta data input yang digunakan
- **Tidak bergantung training data** — AI tidak perlu tahu soal beasiswa Indonesia dari masa lalu; yang penting adalah data yang kita berikan saat ini

---

## Keamanan & Logging

### Keamanan

| Aspek | Implementasi |
|-------|-------------|
| API Key | `GEMINI_API_KEY` — tidak ada prefix `NEXT_PUBLIC_`, tidak pernah terekspos ke browser |
| Autentikasi | Setiap endpoint memeriksa sesi Supabase via `getUser()` sebelum memanggil Gemini |
| Otorisasi | `/api/ai/pencocokan-beasiswa` hanya izinkan user melihat rekomendasi profil sendiri |
| Rate limiting | Dapat ditambahkan via proxy.ts jika diperlukan |

### Logging Interaksi

Setiap panggilan AI yang berhasil dicatat ke tabel `interaksi_ai`:

| Field | Isi |
|-------|-----|
| `user_id` | UUID user yang meminta |
| `materi_id` | UUID materi (hanya untuk ringkasan) |
| `jenis` | `'ringkasan'` atau `'pencocokan_beasiswa'` |
| `prompt` | Teks konteks/data yang dikirim (bukan prompt instruksi) |
| `respons` | Output mentah dari Gemini |
| `token_used` | Jumlah token yang dikonsumsi |

Log ini berguna untuk: audit penggunaan, analisis kualitas respons, dan kalkulasi biaya API.

---

## Cara Mengaktifkan

1. Dapatkan API key di [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Isi `GEMINI_API_KEY=<api-key-anda>` di file `.env.local`
3. Restart server development (`npm run dev`)
4. Test endpoint dengan curl atau fetch dari UI

```bash
# Test ringkasan
curl -X POST http://localhost:3000/api/ai/ringkasan \
  -H "Content-Type: application/json" \
  -d '{"materi_id": "uuid-materi-anda"}'

# Test pencocokan beasiswa
curl -X POST http://localhost:3000/api/ai/pencocokan-beasiswa \
  -H "Content-Type: application/json" \
  -d '{"user_id": "uuid-user-anda"}'
```

> **Catatan:** Kedua endpoint memerlukan session cookie autentikasi Supabase yang valid.
