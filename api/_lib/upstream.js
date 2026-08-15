const BASE_URL = "https://www.sankavollerei.web.id/anime";

const ALLOWED = [
  /^\/home$/,
  /^\/ongoing-anime\?page=\d{1,4}$/,
  /^\/complete-anime\?page=\d{1,4}$/,
  /^\/search\/[^/]{1,100}$/,
  /^\/genre$/,
  /^\/genre\/[A-Za-z0-9-]{1,60}\?page=\d{1,4}$/,
  /^\/schedule$/,
  /^\/anime\/[A-Za-z0-9-_.]{1,120}$/,
  /^\/episode\/[A-Za-z0-9-_.]{1,120}$/,
  /^\/server\/[A-Za-z0-9-_.]{1,120}$/,
  /^\/batch\/[A-Za-z0-9-_.]{1,120}$/,
];

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;
const buckets = new Map();

function clientKey(req) {
  const forwarded = req.headers["x-forwarded-for"] || "";
  return (
    req.headers["cf-connecting-ip"] ||
    forwarded.split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "anonymous"
  );
}

function withinRateLimit(req) {
  const key = clientKey(req);
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= MAX_REQUESTS;
}

export async function fetchUpstream(req, res, path) {
  if (!ALLOWED.some((pattern) => pattern.test(path))) {
    res.status(400).json({ status: false, message: "Permintaan tidak dikenali." });
    return null;
  }

  if (!withinRateLimit(req)) {
    res.status(429).json({ status: false, message: "Terlalu banyak permintaan. Coba lagi dalam satu menit." });
    return null;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(25_000),
    });
  } catch {
    res.status(502).json({ status: false, message: "Sumber data sedang tidak dapat dihubungi." });
    return null;
  }

  if (!response.ok) {
    res.status(502).json({ status: false, message: "Sumber data sedang bermasalah. Coba lagi nanti." });
    return null;
  }

  const json = await response.json();
  if (json.ok === false || json.data === undefined || json.data === null) {
    res.status(404).json({ status: false, message: (json.message && json.message.trim()) || "Data tidak ditemukan." });
    return null;
  }

  return json;
}

export function mapAnimeCard(item) {
  return {
    id: item.animeId,
    slug: item.animeId,
    title: item.title,
    image: item.poster,
    episodes: item.episodes ?? null,
    status: item.status || null,
    score: item.score || null,
    releaseDay: item.releaseDay || null,
  };
}

export function mapAnimeList(list) {
  return (Array.isArray(list) ? list : []).map(mapAnimeCard);
}
