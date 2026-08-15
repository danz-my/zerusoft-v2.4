import { fetchUpstream, mapAnimeList } from "./_lib/upstream.js";

export default async function handler(req, res) {
  const envelope = await fetchUpstream(req, res, "/home");
  if (!envelope) return;

  const data = envelope.data || {};
  return res.status(200).json({
    status: true,
    result: {
      ongoing: mapAnimeList(data.ongoing?.animeList),
      completed: mapAnimeList(data.completed?.animeList),
    },
  });
}
