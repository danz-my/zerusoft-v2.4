import config from "../config";

const base = config.apiBase;

async function getJson(url) {
  const res = await fetch(url);
  const json = await res.json();
  if (!json.status) throw new Error(json.message || "Request gagal.");
  return json.result;
}

export function fetchHome() {
  return getJson(`${base}/api/home`);
}

export function fetchOngoing(page = 1) {
  return getJson(`${base}/api/ongoing?page=${page}`);
}

export function fetchCompleted(page = 1) {
  return getJson(`${base}/api/completed?page=${page}`);
}

export function fetchGenres() {
  return getJson(`${base}/api/genres`);
}

export function fetchAnimeByGenre({ genreId, page = 1 } = {}) {
  return getJson(`${base}/api/genre?genreId=${encodeURIComponent(genreId)}&page=${page}`);
}

export function searchAnime(query) {
  return getJson(`${base}/api/search?q=${encodeURIComponent(query)}`);
}

export function fetchAnimeDetail(animeId) {
  return getJson(`${base}/api/anime?animeId=${encodeURIComponent(animeId)}`);
}

export function fetchEpisode(episodeId) {
  return getJson(`${base}/api/episode?episodeId=${encodeURIComponent(episodeId)}`);
}

export function fetchServer(serverId) {
  return getJson(`${base}/api/server?serverId=${encodeURIComponent(serverId)}`);
}

export function fetchBatch(batchId) {
  return getJson(`${base}/api/batch?batchId=${encodeURIComponent(batchId)}`);
}

export function fetchSchedule() {
  return getJson(`${base}/api/schedule`);
}
