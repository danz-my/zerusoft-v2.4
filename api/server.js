import { fetchUpstream } from "./_lib/upstream.js";

export default async function handler(req, res) {
  const serverId = req.query.serverId || req.query.id;

  if (!serverId) {
    return res.status(400).json({ status: false, message: "Parameter 'serverId' diperlukan." });
  }

  const envelope = await fetchUpstream(req, res, `/server/${encodeURIComponent(serverId)}`);
  if (!envelope) return;

  return res.status(200).json({
    status: true,
    result: { url: envelope.data?.url || null },
  });
}
