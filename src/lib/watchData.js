import { supabase } from "./supabase";

// Bookmark/watchlist masih di localStorage browser pengguna.
const BOOKMARK_KEY = "zerusoft_bookmarks";

function readList(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function writeList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // storage penuh / diblokir, diamkan saja
  }
}

// ---------- Bookmark / Watchlist ----------

export function getBookmarks() {
  return readList(BOOKMARK_KEY);
}

export function isBookmarked(slug) {
  return getBookmarks().some((b) => b.slug === slug);
}

export function toggleBookmark({ slug, title, image }) {
  const list = getBookmarks();
  const exists = list.some((b) => b.slug === slug);
  const next = exists
    ? list.filter((b) => b.slug !== slug)
    : [{ slug, title, image, addedAt: Date.now() }, ...list];
  writeList(BOOKMARK_KEY, next);
  return !exists; // true = baru ditambahkan, false = baru dihapus
}

export function removeBookmark(slug) {
  writeList(BOOKMARK_KEY, getBookmarks().filter((b) => b.slug !== slug));
}

// ---------- Riwayat Tontonan (disimpan di Supabase, per akun) ----------

const HISTORY_LIMIT = 30;

export async function getHistory(userId) {
  if (!userId) return [];
  const { data } = await supabase
    .from("history")
    .select("anime_slug, anime_title, anime_image, watched_at")
    .eq("user_id", userId)
    .order("watched_at", { ascending: false })
    .limit(HISTORY_LIMIT);
  return (data || []).map((h) => ({
    slug: h.anime_slug,
    title: h.anime_title,
    image: h.anime_image,
    watchedAt: h.watched_at,
  }));
}

export async function addToHistory({ userId, slug, title, image }) {
  if (!userId) return; // cuma dicatat buat user yang login
  await supabase.from("history").upsert(
    {
      user_id: userId,
      anime_slug: slug,
      anime_title: title,
      anime_image: image,
      watched_at: new Date().toISOString(),
    },
    { onConflict: "user_id,anime_slug" }
  );
}

export async function clearHistory(userId) {
  if (!userId) return;
  await supabase.from("history").delete().eq("user_id", userId);
}
