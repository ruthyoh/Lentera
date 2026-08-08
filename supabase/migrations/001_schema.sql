-- =====================================================
-- LENTERA — Platform Belajar & Beasiswa Mahasiswa
-- File Migration Utama: 001_schema.sql
-- Siap dijalankan di: Supabase Dashboard → SQL Editor
-- =====================================================

-- -------------------------------------------------------
-- 0. EXTENSIONS & HELPER FUNCTIONS
-- -------------------------------------------------------
create extension if not exists "uuid-ossp";

-- Function otomatis update timestamp updated_at
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =====================================================
-- TABEL 1: profiles
-- Extends auth.users — menyimpan informasi akademik mahasiswa
-- =====================================================
create table if not exists public.profiles (
  id                uuid        references auth.users on delete cascade not null primary key,
  nama_lengkap      text        not null,
  asal_institusi    text,
  jurusan           text,
  semester          integer     check (semester >= 1 and semester <= 12),
  ipk               numeric(3,2) check (ipk >= 0.00 and ipk <= 4.00),
  kategori_khusus   text,       -- contoh: "Penerima KIP-K", "Mahasiswa Berprestasi"
  poin_kontribusi   integer     not null default 0 check (poin_kontribusi >= 0),
  avatar_url        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.profiles is 'Profil akademik mahasiswa Lentera yang terhubung dengan auth.users';
comment on column public.profiles.poin_kontribusi is 'Poin apresiasi berkontribusi materi di platform';

-- Trigger updated_at profil
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();

-- =====================================================
-- TABEL 2: materi
-- Repositori berkas & konten akademik mahasiswa
-- =====================================================
create table if not exists public.materi (
  id                uuid        primary key default gen_random_uuid(),
  uploader_id       uuid        references public.profiles(id) on delete cascade not null,
  judul             text        not null,
  mata_kuliah       text        not null,
  deskripsi         text,
  kategori          text        not null check (
                                  kategori in ('catatan', 'rangkuman', 'bank_soal', 'modul', 'presentasi', 'lainnya')
                                ),
  file_url          text,
  thumbnail_url     text,
  jumlah_unduhan    integer     not null default 0 check (jumlah_unduhan >= 0),
  jumlah_suka       integer     not null default 0 check (jumlah_suka >= 0),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.materi is 'Repositori materi akademik yang dibagikan mahasiswa';

-- Trigger updated_at materi
drop trigger if exists set_materi_updated_at on public.materi;
create trigger set_materi_updated_at
  before update on public.materi
  for each row
  execute function public.update_updated_at_column();

-- =====================================================
-- TABEL 3: beasiswa
-- Informasi & katalog beasiswa pendidikan
-- =====================================================
create table if not exists public.beasiswa (
  id                      uuid        primary key default gen_random_uuid(),
  nama_beasiswa           text        not null,
  penyelenggara           text        not null,
  jenis                   text        not null check (
                                        jenis in ('prestasi', 'kebutuhan', 'riset', 'pemerintah', 'swasta', 'internasional')
                                      ),
  kriteria_jurusan        text        not null default 'semua',
  kriteria_ipk_min        numeric(3,2) check (kriteria_ipk_min >= 0.00 and kriteria_ipk_min <= 4.00),
  kriteria_semester_min   integer     check (kriteria_semester_min >= 1 and kriteria_semester_min <= 12),
  kriteria_khusus         text,
  deadline_pendaftaran    date,
  link_resmi              text,
  deskripsi_singkat       text,
  status                  text        not null default 'aktif' check (
                                        status in ('aktif', 'segera_ditutup', 'ditutup')
                                      ),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

comment on table public.beasiswa is 'Database beasiswa dan bantuan biaya pendidikan';

-- Trigger updated_at beasiswa
drop trigger if exists set_beasiswa_updated_at on public.beasiswa;
create trigger set_beasiswa_updated_at
  before update on public.beasiswa
  for each row
  execute function public.update_updated_at_column();

-- =====================================================
-- TABEL 4: interaksi_ai
-- Riwayat & log penggunaan asisten pintar AI
-- =====================================================
create table if not exists public.interaksi_ai (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        references public.profiles(id) on delete cascade not null,
  materi_id     uuid        references public.materi(id) on delete set null,
  beasiswa_id   uuid        references public.beasiswa(id) on delete set null,
  jenis         text        not null check (
                              jenis in ('ringkasan', 'kuis', 'tanya_jawab', 'pencocokan_beasiswa', 'draf_esai')
                            ),
  prompt        text,
  respons       text,
  token_used    integer     check (token_used >= 0),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.interaksi_ai is 'Log aktivitas dan percakapan pengguna dengan fitur Asisten AI';

-- Trigger updated_at interaksi_ai
drop trigger if exists set_interaksi_ai_updated_at on public.interaksi_ai;
create trigger set_interaksi_ai_updated_at
  before update on public.interaksi_ai
  for each row
  execute function public.update_updated_at_column();

-- =====================================================
-- TABEL 5: penilaian
-- Penilaian & ulasan materi (1-5), unik per (materi_id, user_id)
-- =====================================================
create table if not exists public.penilaian (
  id          uuid        primary key default gen_random_uuid(),
  materi_id   uuid        references public.materi(id) on delete cascade not null,
  user_id     uuid        references public.profiles(id) on delete cascade not null,
  nilai       integer     not null check (nilai >= 1 and nilai <= 5),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint uq_penilaian_materi_user unique (materi_id, user_id)
);

comment on table public.penilaian is 'Rating bintang (1-5) dari mahasiswa untuk materi tertentu';

-- Trigger updated_at penilaian
drop trigger if exists set_penilaian_updated_at on public.penilaian;
create trigger set_penilaian_updated_at
  before update on public.penilaian
  for each row
  execute function public.update_updated_at_column();

-- =====================================================
-- INDEKS OPTIMASI QUERY
-- =====================================================
create index if not exists idx_profiles_jurusan       on public.profiles(jurusan);
create index if not exists idx_materi_uploader         on public.materi(uploader_id);
create index if not exists idx_materi_kategori         on public.materi(kategori);
create index if not exists idx_materi_mata_kuliah      on public.materi(mata_kuliah);
create index if not exists idx_materi_created_at      on public.materi(created_at desc);
create index if not exists idx_beasiswa_status        on public.beasiswa(status);
create index if not exists idx_beasiswa_deadline      on public.beasiswa(deadline_pendaftaran);
create index if not exists idx_interaksi_ai_user      on public.interaksi_ai(user_id);
create index if not exists idx_penilaian_materi       on public.penilaian(materi_id);
create index if not exists idx_penilaian_user         on public.penilaian(user_id);

-- =====================================================
-- TRIGGER AUTH: Otomatis buat baris di public.profiles
-- dipicu saat pendaftaran akun baru di auth.users
-- =====================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    nama_lengkap,
    asal_institusi,
    jurusan,
    semester,
    ipk,
    kategori_khusus
  )
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'nama_lengkap'), ''), 'Pengguna Baru'),
    nullif(trim(new.raw_user_meta_data->>'asal_institusi'), ''),
    nullif(trim(new.raw_user_meta_data->>'jurusan'), ''),
    case
      when new.raw_user_meta_data->>'semester' is not null
        and new.raw_user_meta_data->>'semester' != ''
      then (new.raw_user_meta_data->>'semester')::integer
      else null
    end,
    case
      when new.raw_user_meta_data->>'ipk' is not null
        and new.raw_user_meta_data->>'ipk' != ''
      then (new.raw_user_meta_data->>'ipk')::numeric(3,2)
      else null
    end,
    nullif(trim(new.raw_user_meta_data->>'kategori_khusus'), '')
  );
  return new;
exception
  when others then
    raise warning 'Gagal membuat profil otomatis untuk user %: %', new.id, sqlerrm;
    return new;
end;
$$;

-- Pasang trigger pada auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES
-- =====================================================

-- 1. Aktifkan RLS pada semua tabel
alter table public.profiles      enable row level security;
alter table public.materi        enable row level security;
alter table public.beasiswa      enable row level security;
alter table public.interaksi_ai  enable row level security;
alter table public.penilaian     enable row level security;

-- -------------------------------------------------------
-- POLICIES: profiles
-- -------------------------------------------------------
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
  on public.profiles for delete
  to authenticated
  using (auth.uid() = id);

-- -------------------------------------------------------
-- POLICIES: materi
-- -------------------------------------------------------
drop policy if exists "materi_select_all" on public.materi;
create policy "materi_select_all"
  on public.materi for select
  using (true);

drop policy if exists "materi_insert_authenticated" on public.materi;
create policy "materi_insert_authenticated"
  on public.materi for insert
  to authenticated
  with check (auth.uid() = uploader_id);

drop policy if exists "materi_update_own" on public.materi;
create policy "materi_update_own"
  on public.materi for update
  to authenticated
  using (auth.uid() = uploader_id)
  with check (auth.uid() = uploader_id);

drop policy if exists "materi_delete_own" on public.materi;
create policy "materi_delete_own"
  on public.materi for delete
  to authenticated
  using (auth.uid() = uploader_id);

-- -------------------------------------------------------
-- POLICIES: beasiswa
-- -------------------------------------------------------
drop policy if exists "beasiswa_select_all" on public.beasiswa;
create policy "beasiswa_select_all"
  on public.beasiswa for select
  using (true);

drop policy if exists "beasiswa_insert_authenticated" on public.beasiswa;
create policy "beasiswa_insert_authenticated"
  on public.beasiswa for insert
  to authenticated
  with check (true);

drop policy if exists "beasiswa_update_authenticated" on public.beasiswa;
create policy "beasiswa_update_authenticated"
  on public.beasiswa for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "beasiswa_delete_authenticated" on public.beasiswa;
create policy "beasiswa_delete_authenticated"
  on public.beasiswa for delete
  to authenticated
  using (true);

-- -------------------------------------------------------
-- POLICIES: interaksi_ai
-- -------------------------------------------------------
drop policy if exists "interaksi_ai_select_own" on public.interaksi_ai;
create policy "interaksi_ai_select_own"
  on public.interaksi_ai for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "interaksi_ai_insert_own" on public.interaksi_ai;
create policy "interaksi_ai_insert_own"
  on public.interaksi_ai for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "interaksi_ai_update_own" on public.interaksi_ai;
create policy "interaksi_ai_update_own"
  on public.interaksi_ai for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "interaksi_ai_delete_own" on public.interaksi_ai;
create policy "interaksi_ai_delete_own"
  on public.interaksi_ai for delete
  to authenticated
  using (auth.uid() = user_id);

-- -------------------------------------------------------
-- POLICIES: penilaian
-- -------------------------------------------------------
drop policy if exists "penilaian_select_all" on public.penilaian;
create policy "penilaian_select_all"
  on public.penilaian for select
  using (true);

drop policy if exists "penilaian_insert_authenticated" on public.penilaian;
create policy "penilaian_insert_authenticated"
  on public.penilaian for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "penilaian_update_own" on public.penilaian;
create policy "penilaian_update_own"
  on public.penilaian for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "penilaian_delete_own" on public.penilaian;
create policy "penilaian_delete_own"
  on public.penilaian for delete
  to authenticated
  using (auth.uid() = user_id);

-- =====================================================
-- STORAGE BUCKET & POLICIES: materi-files
-- Max file size: 10MB (10485760 bytes)
-- Format diizinkan: PDF, DOCX
-- =====================================================

-- 1. Inisialisasi bucket storage materi-files jika belum ada
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'materi-files',
  'materi-files',
  true,
  10485760,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

-- 2. Storage Policies
drop policy if exists "Storage Read Materi Files Public" on storage.objects;
create policy "Storage Read Materi Files Public"
  on storage.objects for select
  using (bucket_id = 'materi-files');

drop policy if exists "Storage Insert Materi Files Authenticated" on storage.objects;
create policy "Storage Insert Materi Files Authenticated"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'materi-files');

drop policy if exists "Storage Update Materi Files Owner" on storage.objects;
create policy "Storage Update Materi Files Owner"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'materi-files' and auth.uid() = owner)
  with check (bucket_id = 'materi-files' and auth.uid() = owner);

drop policy if exists "Storage Delete Materi Files Owner" on storage.objects;
create policy "Storage Delete Materi Files Owner"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'materi-files' and auth.uid() = owner);

-- =====================================================
-- SELESAI — Fondasi Database Lentera Siap Digunakan
-- =====================================================
