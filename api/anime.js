import { fetchUpstream, mapAnimeList } from "./_lib/upstream.js";

export default async function handler(req, res) {
  const animeId = req.query.animeId || req.query.slug || req.query.id;

  if (!animeId) {
    return res.status(400).json({ status: false, message: "Parameter 'animeId' diperlukan." });
  }

  const envelope = await fetchUpstream(req, res, `/anime/${encodeURIComponent(animeId)}`);
  if (!envelope) return;

  const d = envelope.data || {};
  return res.status(200).json({
    status: true,
    result: {
      animeId,
      title: d.title || null,
      poster: d.poster || null,
      japanese: d.japanese || null,
      score: d.score || null,
      producers: d.producers || null,
      type: d.type || null,
      status: d.status || null,
      episodes: d.episodes ?? null,
      duration: d.duration || null,
      aired: d.aired || null,
      studios: d.studios || null,
      views: d.views ?? null,
      batchId: d.batch?.batchId || null,
      synopsis: (d.synopsis?.paragraphs || []).join("\n\n"),
      genres: (d.genreList || []).map((g) => g.title),
      totalEpisodes: d.episodeList?.length || 0,
      episodeList: (d.episodeList || []).map((ep) => ({
        title: ep.title,
        episodeId: ep.episodeId,
        eps: ep.eps,
        date: ep.date || null,
        views: ep.views ?? null,
      })),
      recommended: mapAnimeList(d.recommendedAnimeList),
    },
  });
}
