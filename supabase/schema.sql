-- ============================================================
-- ZeruSoft — Supabase schema (project zerusoft)
-- Versi lengkap dari awal. Aman dijalanin dari kondisi kosong
-- ATAU dari kondisi lama yang berantakan — script ini drop dulu
-- semuanya baru bikin ulang bersih.
--
-- Jalankan seluruh file ini sekali jalan di:
-- Supabase Dashboard (project zerusoft) > SQL Editor > New query > Run
--
-- CATATAN ARSITEKTUR:
-- Login/register/verifikasi email ditangani API terpisah
-- (api-autentication.vercel.app), BUKAN Supabase Auth bawaan.
-- Makanya semua tabel di sini pakai id bebas (gen_random_uuid),
-- bukan foreign key ke auth.users, dan RLS-nya permisif (dijaga
-- di level aplikasi, bukan lewat sesi auth.uid()).
-- ============================================================

-- ---------- Bersihin dulu kalau ada sisa lama ----------
drop table if exists public.history cascade;
drop table if exists public.feedback cascade;
drop table if exists public.announcements cascade;
drop table if exists public.profiles cascade;
drop function if exists public.is_admin();
drop function if exists public.handle_new_user();
drop trigger if exists on_auth_user_created on auth.users;

-- ============================================================
-- TABEL: profiles
-- Satu baris per akun. Dibuat dari client langsung pas Register
-- (lihat src/context/AuthContext.jsx), bukan lewat trigger.
-- ============================================================
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  email text unique not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_all" on public.profiles
  for select using (true);

create policy "profiles_insert_own" on public.profiles
  for insert with check (true);

create policy "profiles_update_own" on public.profiles
  for update using (true) with check (true);

-- ============================================================
-- TABEL: announcements (ikon lonceng notifikasi)
-- ============================================================
create table public.announcements (
  id bigint generated always as identity primary key,
  title text not null,
  message text not null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

create policy "announcements_select_all" on public.announcements
  for select using (true);

create policy "announcements_admin_write" on public.announcements
  for all using (true) with check (true);

-- ============================================================
-- TABEL: feedback (lapor bug / masukan dari halaman profil)
-- ============================================================
create table public.feedback (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles (id) on delete set null,
  username text,
  type text not null default 'bug' check (type in ('bug', 'suggestion')),
  message text not null,
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

create policy "feedback_insert_own" on public.feedback
  for insert with check (true);

create policy "feedback_select_own_or_admin" on public.feedback
  for select using (true);

create policy "feedback_update_admin" on public.feedback
  for update using (true) with check (true);

-- ============================================================
-- TABEL: history (riwayat tontonan, per akun — cuma tampil di /profile)
-- ============================================================
create table public.history (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  anime_slug text not null,
  anime_title text not null,
  anime_image text,
  watched_at timestamptz not null default now()
);

-- Satu anime cuma muncul sekali per user; nonton ulang cuma update jamnya
create unique index history_user_slug_key on public.history (user_id, anime_slug);
create index history_user_watched_idx on public.history (user_id, watched_at desc);

alter table public.history enable row level security;

create policy "history_select" on public.history for select using (true);
create policy "history_insert" on public.history for insert with check (true);
create policy "history_update" on public.history for update using (true) with check (true);
create policy "history_delete" on public.history for delete using (true);

-- ============================================================
-- Cek cepat setelah run (opsional, boleh dijalanin manual):
--   select count(*) from public.profiles;
--   select policyname, cmd from pg_policies where tablename in
--     ('profiles','announcements','feedback','history');
-- ============================================================

-- ============================================================
-- CARA BIKIN AKUN ADMIN:
-- 1. Daftar akun baru lewat /register di web (username, email, password).
-- 2. Cek email, klik link verifikasi.
-- 3. Balik ke SQL Editor ini, jalankan (ganti usernamenya):
--
--    update public.profiles set is_admin = true where username = 'danzz';
--
-- 4. Login lagi -> tombol "Admin Panel" muncul di halaman /profile.
-- ============================================================
