# ZeruSoft

Website streaming info anime (bukan hosting video — nonton/link tetap lewat sumber lain), dibangun pakai React + Vite. Ada watchlist, riwayat tontonan, dan sistem akun sendiri (bukan numpang Supabase Auth).

## Teknologi

| Bagian | Teknologi |
|---|---|
| Frontend | React + Vite, Tailwind CSS, React Router |
| Data anime | Serverless functions di `/api` (categories, search, detail, list) |
| Database aplikasi | Supabase (Postgres) — profil, watchlist server-side*, riwayat, feedback, pengumuman |
| Autentikasi | API terpisah ([lihat bawah](#autentikasi--kenapa-2-layanan)) — register, login, verifikasi email, lupa password |
| Deploy | Vercel |

\* Watchlist (bookmark) saat ini masih disimpan di localStorage browser, bukan Supabase.

---

## Autentikasi — kenapa 2 layanan?

ZeruSoft **tidak** pakai Supabase Auth bawaan. Ada 2 layanan terpisah yang kerja sama:

1. **Auth API** (`api-autentication.vercel.app`, repo beda) — cuma tugas verifikasi identitas: cek email/password valid, kirim email verifikasi, kirim kode reset password. Nyimpen tabel `users` (email + password_hash) di **project Supabase-nya sendiri**.
2. **ZeruSoft (project ini)** — nyimpen data aplikasi: `profiles` (username, is_admin), `history`, `feedback`, `announcements`, di **project Supabase zerusoft**.

Alurnya: waktu Register, frontend manggil Auth API buat bikin akun (email+password), lalu langsung insert baris `profiles` (username) ke Supabase zerusoft — dua request, dua database, satu alur.

Karena tidak ada sesi Supabase Auth, RLS di semua tabel zerusoft sengaja dibikin permisif (`using (true)`) — "punya siapa" ditegakkan di kode aplikasi (query difilter pakai `profile.id` user yang lagi login), bukan lewat `auth.uid()`. Ini trade-off yang wajar untuk project skala personal; kalau butuh proteksi lebih ketat di level database, tulis endpoint admin yang pakai Supabase **service role key** di server, jangan langsung dari client.

---

## Setup dari Awal

### 1. Supabase (project zerusoft)
1. Bikin project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor**, jalankan seluruh isi `supabase/schema.sql` sekali jalan
   - ⚠️ Script ini `DROP TABLE` dulu sebelum bikin ulang — aman buat setup awal, tapi kalau dijalankan ulang di project yang udah ada datanya, **semua data lama di tabel `profiles`/`history`/`feedback`/`announcements` bakal kehapus**. Jangan run ulang sembarangan di production yang udah ada user.
3. Ambil **Project URL** dan **anon/publishable key** di Settings → API (dipakai di `.env`)

### 2. Auth API
Auth API itu project terpisah (lihat README-nya sendiri). Yang penting buat ZeruSoft:
1. Pastikan Auth API-nya sendiri udah jalan (tabel `users` + RLS-nya udah di-setup di project Supabase auth API — **bukan** project zerusoft)
2. Catat base URL-nya (default: `https://api-autentication.vercel.app`)

### 3. Environment Variables
Copy `.env.example` ke `.env`, isi:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=isi-anon-key-project-zerusoft
VITE_AUTH_API_BASE=https://api-autentication.vercel.app
```

### 4. Jalankan lokal
```bash
npm install
npm run dev
```
Buka `http://localhost:5173`

### 5. Deploy ke Vercel
1. Push repo ke GitHub, hubungkan ke Vercel
2. Di **Project Settings → Environment Variables**, tambahkan 3 variabel di atas (untuk **Production**, dan **Preview** kalau perlu)
3. Deploy. Kalau env var ditambah/diubah setelah deployment pertama, **redeploy manual** — env var baru tidak otomatis kepakai ke deployment lama

### 6. Bikin akun admin
1. Daftar akun biasa lewat `/register`, verifikasi email
2. Di SQL Editor Supabase zerusoft:
   ```sql
   update public.profiles set is_admin = true where username = 'username_kamu';
   ```
3. Login ulang — tombol "Admin Panel" muncul di `/profile`

---

## Struktur Folder

```
zerusoft/
├── api/                    # Serverless functions (data anime)
│   ├── categories.js
│   ├── anime.js
│   ├── detail.js
│   └── search.js
├── src/
│   ├── components/         # Komponen UI (Navbar, CarouselRow, icons, dll)
│   ├── context/
│   │   └── AuthContext.jsx # State login, sesi disimpan di localStorage
│   ├── lib/
│   │   ├── api.js          # Fetch data anime dari /api
│   │   ├── authApi.js      # Fetch ke Auth API (register/login/verify/dll)
│   │   ├── supabase.js     # Klien Supabase (project zerusoft)
│   │   └── watchData.js    # Watchlist (localStorage) + riwayat (Supabase)
│   ├── pages/               # Satu file per halaman/route
│   └── config.js
├── supabase/
│   └── schema.sql          # Skema database lengkap, aman dijalanin dari awal
├── vercel.json              # SPA rewrite + config serverless functions
└── .env.example
```

---

## Fitur

- Cari & jelajah anime per genre
- Watchlist pribadi (localStorage)
- Riwayat tontonan otomatis tercatat per akun (Supabase), tampil di halaman Profil
- Notifikasi lewat pengumuman admin (ikon lonceng)
- Lapor bug / kasih masukan langsung dari halaman Profil
- Panel admin: kelola pengumuman, lihat & tandai selesai laporan masuk

---

## Troubleshooting

| Masalah | Kemungkinan penyebab |
|---|---|
| Halaman blank total | Environment Variables belum di-set di Vercel (khususnya `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`) — nama variabel **harus** diawali `VITE_`, bukan `NEXT_PUBLIC_` |
| Register/login gagal "Gagal menyimpan data" | Cek Auth API — biasanya Service Role Key salah, atau tabel `users`-nya belum di-setup di project Supabase **auth API** (bukan project zerusoft) |
| Riwayat tontonan tidak muncul | Pastikan `supabase/schema.sql` sudah dijalankan di project zerusoft, dan kode terbaru sudah ke-deploy (push ke `main` / redeploy manual) |
| Env var udah diisi tapi masih error | Env var baru cuma kepakai di deployment baru — redeploy manual dari tab Deployments |

---

## Lisensi

MIT — bebas dipakai, dimodifikasi, disebarin.
