import { fetchUpstream } from "./_lib/upstream.js";

export default async function handler(req, res) {
  const envelope = await fetchUpstream(req, res, "/genre");
  if (!envelope) return;

  const genreList = envelope.data?.genreList || [];
  return res.status(200).json({
    status: true,
    result: {
      results: genreList.map((g) => ({ id: g.genreId, name: g.title })),
    },
  });
}
