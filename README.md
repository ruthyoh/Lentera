# 🪔 Lentera — Platform Belajar & Beasiswa Mahasiswa Indonesia

Platform terintegrasi berbasis AI untuk mendukung keberlanjutan akses pendidikan mahasiswa Indonesia — menghubungkan repositori materi belajar dengan katalog beasiswa melalui asisten kecerdasan buatan.

> Dibuat untuk **TCC Vibe Code 2026**

---

## ✨ Fitur Utama

### 📚 Modul Belajar (Jelajah Materi)
- Repositori materi kuliah (catatan, rangkuman, bank soal, modul, slide)
- Pencarian & filter berdasarkan mata kuliah dan kategori
- Sistem penilaian bintang 1–5 per materi
- Upload materi dengan reward **+10 poin kontribusi**
- Unduh materi dengan tracking jumlah unduhan

### 🤖 Asisten Belajar AI (per Materi)
| Fitur | Endpoint | Deskripsi |
|-------|----------|-----------|
| Ringkasan | `POST /api/ai/ringkasan` | Ringkas isi PDF materi menjadi 5 poin utama |
| Kuis Latihan | `POST /api/ai/kuis` | Buat 5 soal pilihan ganda dari isi materi |
| Tanya Jawab | `POST /api/ai/tanya-jawab` | Jawab pertanyaan berdasarkan isi materi |

### 🎓 Modul Beasiswa
- Katalog beasiswa pemerintah, swasta, riset & internasional
- Filter berdasarkan jenis, IPK minimum, dan kata kunci
- Halaman detail setiap beasiswa dengan kriteria lengkap
- Auto-seed 9 data beasiswa riil saat database pertama kali kosong

### 🤖 Asisten Beasiswa AI
| Fitur | Endpoint | Deskripsi |
|-------|----------|-----------|
| Pencocokan | `POST /api/ai/pencocokan-beasiswa` | Cocokkan profil akademik dengan beasiswa yang tersedia |
| Draf Esai | `POST /api/ai/draf-esai` | Buat draf esai motivasi beasiswa yang personal |

### 👤 Profil & Gamifikasi
- Profil akademik (jurusan, semester, IPK, institusi)
- Riwayat interaksi AI
- Papan peringkat kontributor berdasarkan poin

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS v4 |
| Database & Auth | Supabase (PostgreSQL + Row Level Security) |
| Storage | Supabase Storage (bucket `materi-files`) |
| AI | Google Gemini 2.0 Flash (`@google/genai`) |
| PDF Parsing | `pdf-parse` (server-side only) |
| Animasi | Framer Motion |

---

## 🚀 Cara Menjalankan (Setup Lokal)

### Prasyarat
- **Node.js** >= 18.17.0 — cek dengan `node --version`
- **npm** >= 9.x
- Akun **Supabase** (gratis): https://app.supabase.com
- Akun **Google AI Studio** (gratis): https://aistudio.google.com

### 1. Clone & Install

```bash
git clone https://github.com/<username>/Lentera.git
cd Lentera
npm install
```

### 2. Buat File `.env.local`

Salin dari template:
```bash
cp .env.example .env.local
```

Isi nilainya:
```env
# Dari Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Dari https://aistudio.google.com/app/apikey (format: AIzaSy...)
GEMINI_API_KEY=AIzaSy...
```

> ⚠️ **Jangan commit `.env.local` ke git** — sudah ada di `.gitignore`
> ⚠️ Tanpa `GEMINI_API_KEY`, semua fitur AI otomatis menggunakan engine lokal (tetap berfungsi)

### 3. Setup Database Supabase

Di **Supabase Dashboard → SQL Editor**, jalankan seluruh isi file:
```
supabase/migrations/001_schema.sql
```

File ini membuat:
- Tabel: `profiles`, `materi`, `beasiswa`, `interaksi_ai`, `penilaian`
- Storage bucket: `materi-files` (public, max 10MB, PDF & DOCX)
- Row Level Security (RLS) policies
- Trigger otomatis pembuatan profil saat registrasi

### 4. Jalankan Server

```bash
npm run dev
```

Buka: **http://localhost:3000**

---

## 📁 Struktur Proyek

```
Lentera/
├── app/
│   ├── (auth)/              # Halaman login & register
│   │   ├── login/
│   │   └── register/
│   ├── (main)/              # Halaman utama (butuh autentikasi)
│   │   ├── beasiswa/        # Katalog & detail beasiswa + AI
│   │   ├── jelajah/         # Repositori materi + AI modal
│   │   ├── materi/[id]/     # Detail materi + Asisten AI
│   │   ├── papan-peringkat/
│   │   └── profil/          # Profil & riwayat AI user
│   ├── api/
│   │   ├── ai/              # Semua endpoint AI
│   │   │   ├── ringkasan/       → POST: Ringkas materi PDF
│   │   │   ├── kuis/            → POST: Buat kuis dari materi
│   │   │   ├── tanya-jawab/     → POST: Tanya jawab materi
│   │   │   ├── pencocokan-beasiswa/ → POST: Cocokkan profil & beasiswa
│   │   │   └── draf-esai/       → POST: Buat draf esai motivasi
│   │   └── health/          # GET: Cek status koneksi Supabase
│   ├── layout.tsx           # Root layout + Navbar + Footer
│   ├── page.tsx             # Landing page
│   └── globals.css          # Design system & CSS variables
│
├── components/
│   ├── beasiswa/
│   │   ├── PanelPencocokanAI.tsx  # Panel AI pencocokan beasiswa
│   │   └── PanelDrafEsaiAI.tsx    # Panel AI draf esai
│   ├── materi/
│   │   ├── PanelAsistenAI.tsx     # Panel AI (ringkasan/kuis/Q&A)
│   │   ├── ModalAsistenAIJelajah.tsx # Modal AI di halaman jelajah
│   │   ├── FormUnggahMateri.tsx
│   │   ├── FormPenilaian.tsx      # Rating bintang
│   │   └── TombolUnduh.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ClientLayoutWrapper.tsx
│   └── ui/                        # Button, Badge, Input, Card, Logo
│
├── lib/
│   ├── actions/             # Server Actions
│   │   ├── auth.ts          → masukAkun, daftarAkun, keluarAkun
│   │   ├── materi.ts        → unggahMateri, ambilDaftarMateri, dll.
│   │   └── beasiswa.ts      → ambilDaftarBeasiswa, ambilDetailBeasiswa
│   ├── supabase/
│   │   ├── client.ts        → Client-side Supabase
│   │   ├── server.ts        → Server-side (cookie-based)
│   │   └── admin.ts         → Admin client (bypass RLS)
│   ├── gemini.ts            → Wrapper Gemini AI + fallback model
│   ├── extractor.ts         → Ekstraksi teks dari buffer PDF
│   └── pdf-builder.ts       → Membuat PDF valid secara programatik
│
├── types/index.ts           # TypeScript types global
├── hooks/useIntro.ts        # Custom hook animasi intro
├── proxy.ts                 # Proteksi rute & refresh session (Next.js 16)
├── supabase/migrations/
│   └── 001_schema.sql       # Schema database lengkap (jalankan sekali)
├── docs/
│   └── PENGGUNAAN-AI.md     # Dokumentasi teknis fitur AI
└── .env.example             # Template environment variables
```

---

## 🔌 API Endpoints

Semua endpoint AI memerlukan **session cookie** Supabase yang valid (user harus login).

| Method | Endpoint | Body | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/api/health` | — | Cek status koneksi Supabase |
| `POST` | `/api/ai/ringkasan` | `{ materi_id }` | Ringkasan PDF materi |
| `POST` | `/api/ai/kuis` | `{ materi_id }` | Kuis 5 soal dari materi |
| `POST` | `/api/ai/tanya-jawab` | `{ materi_id, pertanyaan }` | Q&A berbasis isi materi |
| `POST` | `/api/ai/pencocokan-beasiswa` | `{ user_id }` | Rekomendasi beasiswa |
| `POST` | `/api/ai/draf-esai` | `{ beasiswa_id, motivasi_tambahan? }` | Draf esai motivasi |

---

## 🤖 Sistem Fallback AI

Jika Gemini API tidak tersedia, sistem otomatis beralih ke engine lokal tanpa menampilkan error:

| Fitur | Fallback |
|-------|----------|
| Ringkasan | Ekstrak poin dari teks PDF langsung |
| Kuis | Template soal berbasis judul & mata kuliah |
| Tanya Jawab | Jawaban kontekstual dari metadata materi |
| Pencocokan Beasiswa | Rule-based engine (skor IPK + semester + jurusan) |
| Draf Esai | Template esai profesional berbasis profil user |

---

## 🗄️ Database Schema

Lihat [`supabase/migrations/001_schema.sql`](supabase/migrations/001_schema.sql) untuk schema lengkap.

| Tabel | Deskripsi |
|-------|-----------|
| `profiles` | Profil akademik mahasiswa (extend `auth.users`) |
| `materi` | Repositori berkas materi kuliah |
| `beasiswa` | Katalog beasiswa pendidikan |
| `interaksi_ai` | Log semua interaksi dengan AI |
| `penilaian` | Rating bintang 1–5 per materi |

---

## 🔐 Keamanan

- `GEMINI_API_KEY` dan `SUPABASE_SERVICE_ROLE_KEY` **tidak pernah dikirim ke browser** (tidak ada prefix `NEXT_PUBLIC_`)
- Row Level Security (RLS) aktif di semua tabel
- Setiap API route memvalidasi sesi user sebelum memanggil AI
- Middleware merefresh cookie session otomatis di setiap request

---

## 📜 Lisensi

MIT License — lihat file `LICENSE` untuk detail.
