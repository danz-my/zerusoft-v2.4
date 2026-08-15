import { fetchUpstream } from "./_lib/upstream.js";

export default async function handler(req, res) {
  const episodeId = req.query.episodeId || req.query.id;

  if (!episodeId) {
    return res.status(400).json({ status: false, message: "Parameter 'episodeId' diperlukan." });
  }

  const envelope = await fetchUpstream(req, res, `/episode/${encodeURIComponent(episodeId)}`);
  if (!envelope) return;

  const d = envelope.data || {};
  return res.status(200).json({
    status: true,
    result: {
      episodeId,
      title: d.title || null,
      animeId: d.animeId || null,
      releaseTime: d.releaseTime || null,
      defaultStreamingUrl: d.defaultStreamingUrl || null,
      hasPrevEpisode: Boolean(d.hasPrevEpisode),
      prevEpisodeId: d.prevEpisode?.episodeId || null,
      hasNextEpisode: Boolean(d.hasNextEpisode),
      nextEpisodeId: d.nextEpisode?.episodeId || null,
      qualities: (d.server?.qualities || []).map((q) => ({
        title: q.title,
        servers: (q.serverList || []).map((s) => ({ title: s.title, serverId: s.serverId })),
      })),
      downloadUrl: d.downloadUrl || null,
    },
  });
}
