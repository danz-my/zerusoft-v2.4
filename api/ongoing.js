import { fetchUpstream, mapAnimeList } from "./_lib/upstream.js";

export default async function handler(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const envelope = await fetchUpstream(req, res, `/ongoing-anime?page=${page}`);
  if (!envelope) return;

  const pagination = envelope.pagination || null;
  return res.status(200).json({
    status: true,
    result: {
      page,
      totalPages: pagination?.totalPages || page,
      hasNextPage: pagination?.hasNextPage ?? false,
      results: mapAnimeList(envelope.data?.animeList),
    },
  });
}
