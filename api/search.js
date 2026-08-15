import { fetchUpstream, mapAnimeList } from "./_lib/upstream.js";

export default async function handler(req, res) {
  const query = req.query.q || req.query.query;

  if (!query) {
    return res.status(400).json({ status: false, message: "Parameter 'q' diperlukan." });
  }

  const envelope = await fetchUpstream(req, res, `/search/${encodeURIComponent(query)}`);
  if (!envelope) return;

  return res.status(200).json({
    status: true,
    result: {
      query,
      results: mapAnimeList(envelope.data?.animeList),
    },
  });
}
