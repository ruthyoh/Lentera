-- =====================================================
-- LENTERA — Migrasi Database Supabase
-- File: 001_schema.sql
-- Jalankan di: Supabase Dashboard → SQL Editor
-- =====================================================

-- Extension UUID
create extension if not exists "uuid-ossp";

-- =====================================================
-- TABEL 1: profiles
-- Extends auth.users — data akademik mahasiswa
-- =====================================================
create table if not exists public.profiles (
  id                uuid        references auth.users on delete cascade not null primary key,
  nama_lengkap      text        not null,
  asal_institusi    text,
  jurusan           text,
  semester          integer     check (semester >= 1 and semester <= 12),
  ipk               numeric(3,2) check (ipk >= 0.00 and ipk <= 4.00),
  kategori_khusus   text,       -- contoh: "Penerima KIP-K", "Mahasiswa Berprestasi"
  poin_kontribusi   integer     not null default 0,
  avatar_url        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.profiles is 'Data profil akademik pengguna Lentera, extends auth.users';
comment on column public.profiles.kategori_khusus is 'Kategori penerima khusus, misal: Penerima KIP-K, Atlet, dll.';
comment on column public.profiles.poin_kontribusi is 'Poin yang dikumpulkan dari aktivitas berkontribusi (unggah, dll.)';

-- =====================================================
-- TABEL 2: materi
-- Konten akademik yang diunggah pengguna
-- =====================================================
create table if not exists public.materi (
  id                uuid        primary key default uuid_generate_v4(),
  uploader_id       uuid        references public.profiles(id) on delete cascade not null,
  judul             text        not null,
  mata_kuliah       text        not null,
  deskripsi         text,
  kategori          text        not null check (
                                  kategori in ('catatan', 'rangkuman', 'bank_soal', 'modul', 'presentasi', 'lainnya')
                                ),
  file_url          text,
  thumbnail_url     text,
  jumlah_unduhan    integer     not null default 0,
  jumlah_suka       integer     not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.materi is 'Repositori materi akademik yang dibagikan oleh mahasiswa';
comment on column public.materi.kategori is 'Jenis materi: catatan, rangkuman, bank_soal, modul, presentasi, lainnya';

-- =====================================================
-- TABEL 3: beasiswa
-- Data beasiswa/bantuan pendidikan
-- =====================================================
create table if not exists public.beasiswa (
  id                      uuid        primary key default uuid_generate_v4(),
  nama_beasiswa           text        not null,
  penyelenggara           text        not null,
  jenis                   text        not null check (
                                        jenis in ('prestasi', 'kebutuhan', 'riset', 'pemerintah', 'swasta', 'internasional')
                                      ),
  kriteria_jurusan        text        not null default 'semua',
  kriteria_ipk_min        numeric(3,2) check (kriteria_ipk_min >= 0 and kriteria_ipk_min <= 4),
  kriteria_semester_min   integer     check (kriteria_semester_min >= 1),
  kriteria_khusus         text,
  deadline_pendaftaran    date,
  link_resmi              text,
  deskripsi_singkat       text,
  status                  text        not null default 'aktif' check (
                                        status in ('aktif', 'segera_ditutup', 'ditutup')
                                      ),
  created_at              timestamptz not null default now()
);

comment on table public.beasiswa is 'Basis data beasiswa dan bantuan pendidikan';
comment on column public.beasiswa.jenis is 'Kategori beasiswa: prestasi, kebutuhan, riset, pemerintah, swasta, internasional';
comment on column public.beasiswa.kriteria_jurusan is 'Jurusan yang berhak, atau ''semua'' untuk semua jurusan';

-- =====================================================
-- TABEL 4: interaksi_ai
-- Log interaksi pengguna dengan fitur AI
-- =====================================================
create table if not exists public.interaksi_ai (
  id            uuid        primary key default uuid_generate_v4(),
  user_id       uuid        references public.profiles(id) on delete cascade not null,
  materi_id     uuid        references public.materi(id) on delete set null,
  beasiswa_id   uuid        references public.beasiswa(id) on delete set null,
  jenis         text        not null check (
                              jenis in ('ringkasan', 'kuis', 'tanya_jawab', 'pencocokan_beasiswa', 'draf_esai')
                            ),
  prompt        text,
  respons       text,
  token_used    integer,
  created_at    timestamptz not null default now()
);

comment on table public.interaksi_ai is 'Log interaksi pengguna dengan fitur Asisten AI (Belajar & Beasiswa)';
comment on column public.interaksi_ai.jenis is 'Jenis interaksi: ringkasan, kuis, tanya_jawab, pencocokan_beasiswa, draf_esai';

-- =====================================================
-- TABEL 5: penilaian
-- Rating materi oleh pengguna (1-5), UNIQUE per user
-- =====================================================
create table if not exists public.penilaian (
  id          uuid        primary key default uuid_generate_v4(),
  materi_id   uuid        references public.materi(id) on delete cascade not null,
  user_id     uuid        references public.profiles(id) on delete cascade not null,
  nilai       integer     not null check (nilai >= 1 and nilai <= 5),
  created_at  timestamptz not null default now(),

  -- Satu pengguna hanya bisa menilai satu materi sekali
  unique (materi_id, user_id)
);

comment on table public.penilaian is 'Penilaian (1-5) materi oleh pengguna, unik per pengguna per materi';

-- =====================================================
-- INDEKS untuk performa query umum
-- =====================================================
create index if not exists materi_uploader_idx     on public.materi(uploader_id);
create index if not exists materi_kategori_idx     on public.materi(kategori);
create index if not exists materi_created_idx      on public.materi(created_at desc);
create index if not exists beasiswa_status_idx     on public.beasiswa(status);
create index if not exists beasiswa_deadline_idx   on public.beasiswa(deadline_pendaftaran);
create index if not exists interaksi_ai_user_idx   on public.interaksi_ai(user_id);
create index if not exists penilaian_materi_idx    on public.penilaian(materi_id);

-- =====================================================
-- TRIGGER: Auto-create profile saat user baru mendaftar
-- Dipicu setelah INSERT ke auth.users
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
    coalesce(new.raw_user_meta_data->>'nama_lengkap', 'Pengguna Baru'),
    new.raw_user_meta_data->>'asal_institusi',
    new.raw_user_meta_data->>'jurusan',
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
    new.raw_user_meta_data->>'kategori_khusus'
  );
  return new;
exception
  when others then
    -- Jangan gagalkan pendaftaran jika insert profil gagal
    raise warning 'handle_new_user error: %', sqlerrm;
    return new;
end;
$$;

-- Pasang trigger ke auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Aktifkan RLS di semua tabel
alter table public.profiles      enable row level security;
alter table public.materi        enable row level security;
alter table public.beasiswa      enable row level security;
alter table public.interaksi_ai  enable row level security;
alter table public.penilaian     enable row level security;

-- -------------------------------------------------------
-- PROFILES policies
-- -------------------------------------------------------
-- Semua user bisa membaca semua profil
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

-- Hanya pemilik yang bisa update profilnya sendiri
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Hanya pemilik yang bisa menghapus akunnya sendiri
create policy "profiles_delete_own"
  on public.profiles for delete
  to authenticated
  using (auth.uid() = id);

-- Tidak ada INSERT manual dari client — hanya via trigger

-- -------------------------------------------------------
-- MATERI policies
-- -------------------------------------------------------
-- Semua orang bisa membaca materi
create policy "materi_select_all"
  on public.materi for select
  using (true);

-- Hanya user login yang bisa mengunggah
create policy "materi_insert_authenticated"
  on public.materi for insert
  to authenticated
  with check (auth.uid() = uploader_id);

-- Hanya pengunggah yang bisa mengubah materinya
create policy "materi_update_own"
  on public.materi for update
  to authenticated
  using (auth.uid() = uploader_id)
  with check (auth.uid() = uploader_id);

-- Hanya pengunggah yang bisa menghapus materinya
create policy "materi_delete_own"
  on public.materi for delete
  to authenticated
  using (auth.uid() = uploader_id);

-- -------------------------------------------------------
-- BEASISWA policies
-- Sementara: semua user login bisa CRUD untuk kemudahan seeding
-- -------------------------------------------------------
create policy "beasiswa_select_all"
  on public.beasiswa for select
  using (true);

create policy "beasiswa_insert_authenticated"
  on public.beasiswa for insert
  to authenticated
  with check (true);

create policy "beasiswa_update_authenticated"
  on public.beasiswa for update
  to authenticated
  using (true)
  with check (true);

create policy "beasiswa_delete_authenticated"
  on public.beasiswa for delete
  to authenticated
  using (true);

-- -------------------------------------------------------
-- INTERAKSI_AI policies
-- -------------------------------------------------------
-- User hanya bisa melihat & membuat interaksi miliknya sendiri
create policy "interaksi_ai_select_own"
  on public.interaksi_ai for select
  to authenticated
  using (auth.uid() = user_id);

create policy "interaksi_ai_insert_own"
  on public.interaksi_ai for insert
  to authenticated
  with check (auth.uid() = user_id);

-- -------------------------------------------------------
-- PENILAIAN policies
-- -------------------------------------------------------
-- Semua orang bisa melihat penilaian (untuk menghitung rata-rata)
create policy "penilaian_select_all"
  on public.penilaian for select
  using (true);

-- User login bisa memberi penilaian
create policy "penilaian_insert_authenticated"
  on public.penilaian for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Hanya pemberi nilai yang bisa mengubah penilaiannya
create policy "penilaian_update_own"
  on public.penilaian for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Hanya pemberi nilai yang bisa menghapus penilaiannya
create policy "penilaian_delete_own"
  on public.penilaian for delete
  to authenticated
  using (auth.uid() = user_id);

-- =====================================================
-- SELESAI — Skema Lentera berhasil dibuat
-- =====================================================
