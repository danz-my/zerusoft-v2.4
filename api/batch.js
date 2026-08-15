import { fetchUpstream } from "./_lib/upstream.js";

export default async function handler(req, res) {
  const batchId = req.query.batchId || req.query.id;

  if (!batchId) {
    return res.status(400).json({ status: false, message: "Parameter 'batchId' diperlukan." });
  }

  const envelope = await fetchUpstream(req, res, `/batch/${encodeURIComponent(batchId)}`);
  if (!envelope) return;

  const d = envelope.data || {};
  return res.status(200).json({
    status: true,
    result: {
      batchId,
      title: d.title || null,
      animeId: d.animeId || null,
      poster: d.poster || null,
      japanese: d.japanese || null,
      type: d.type || null,
      score: d.score || null,
      episodes: d.episodes ?? null,
      duration: d.duration || null,
      studios: d.studios || null,
      producers: d.producers || null,
      aired: d.aired || null,
      genres: (d.genreList || []).map((g) => g.title),
      downloadUrl: d.downloadUrl || null,
    },
  });
}
