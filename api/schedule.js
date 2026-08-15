import { fetchUpstream } from "./_lib/upstream.js";

export default async function handler(req, res) {
  const envelope = await fetchUpstream(req, res, "/schedule");
  if (!envelope) return;

  return res.status(200).json({
    status: true,
    result: { days: envelope.data || [] },
  });
}
