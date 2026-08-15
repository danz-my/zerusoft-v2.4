import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchEpisode, fetchServer } from "../lib/api";
import { ChevronLeft } from "../components/icons";
import VideoPlayer from "../components/VideoPlayer";
import ShareButton from "../components/ShareButton";
import { addToHistory } from "../lib/watchData";
import { useAuth } from "../context/AuthContext";

export default function Episode() {
  const { episodeId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [activeServerId, setActiveServerId] = useState(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const [streamStatus, setStreamStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
    setData(null);
    setStreamUrl(null);
    window.scrollTo({ top: 0, behavior: "instant" });

    fetchEpisode(episodeId)
      .then((r) => {
        setData(r);
        setStatus("ok");

        const firstServerId = r.qualities?.[0]?.servers?.[0]?.serverId || null;
        setActiveServerId(firstServerId);

        if (r.defaultStreamingUrl) {
          setStreamUrl(r.defaultStreamingUrl);
          setStreamStatus("ok");
        } else if (firstServerId) {
          setStreamStatus("loading");
          fetchServer(firstServerId)
            .then((s) => {
              setStreamUrl(s.url);
              setStreamStatus("ok");
            })
            .catch(() => setStreamStatus("error"));
        } else {
          setStreamStatus("error");
        }

        if (profile?.id && r.animeId) {
          addToHistory({ userId: profile.id, slug: r.animeId, title: r.title, image: null });
        }
      })
      .catch(() => setStatus("error"));
  }, [episodeId, profile?.id]);

  function handlePickServer(serverId) {
    if (serverId === activeServerId) return;
    setActiveServerId(serverId);
    setStreamStatus("loading");
    setStreamUrl(null);
    fetchServer(serverId)
      .then((s) => {
        setStreamUrl(s.url);
        setStreamStatus("ok");
      })
      .catch(() => setStreamStatus("error"));
  }

  if (status === "loading") {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16 text-center font-mono text-sm text-ink/50">
        Memuat...
      </main>
    );
  }

  if (status === "error" || !data) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16 text-center">
        <p className="font-mono text-sm text-ink/50">Gagal memuat episode ini.</p>
        <Link to="/" className="mt-4 inline-block font-mono text-sm underline">
          Balik ke beranda
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-6">
      <Link
        to={data.animeId ? `/anime/${data.animeId}` : "/"}
        className="mb-6 inline-flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-wide text-ink/60 hover:text-ink"
      >
        <ChevronLeft /> Kembali ke detail anime
      </Link>

      {/* ---------- PLAYER ---------- */}
      <div className="overflow-hidden rounded-2xl border-2 border-ink bg-ink shadow-brut-lg">
        {streamStatus === "loading" && (
          <div className="flex aspect-video items-center justify-center font-mono text-sm text-cream/50">
            Memuat player...
          </div>
        )}
        {streamStatus === "error" && (
          <div className="flex aspect-video items-center justify-center font-mono text-sm text-cream/50">
            Player nggak tersedia buat episode ini.
          </div>
        )}
        {streamStatus === "ok" && streamUrl && <VideoPlayer url={streamUrl} title={data.title} />}
      </div>

      {/* ---------- SERVER PICKER ---------- */}
      {data.qualities?.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          {data.qualities.map((q) => (
            <div key={q.title} className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-ink/50">
                {q.title}
              </span>
              {q.servers.map((s) => (
                <button
                  key={s.serverId}
                  onClick={() => handlePickServer(s.serverId)}
                  className={`rounded-full border-2 border-ink px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide transition ${
                    activeServerId === s.serverId ? "bg-ink text-cream" : "bg-white hover:bg-mint/20"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ---------- SHARE / TITLE ---------- */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink pt-4">
        <h1
          className="font-display text-xl font-bold leading-tight"
          dangerouslySetInnerHTML={{ __html: data.title || "Tanpa judul" }}
        />
        <ShareButton title={data.title} />
      </div>

      {/* ---------- PREV / NEXT ---------- */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          disabled={!data.hasPrevEpisode}
          onClick={() => navigate(`/episode/${data.prevEpisodeId}`)}
          className="rounded-full border-2 border-ink bg-white px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide shadow-brut-sm transition hover:-translate-y-0.5 hover:shadow-brut disabled:pointer-events-none disabled:opacity-30"
        >
          Episode Sebelumnya
        </button>
        <button
          disabled={!data.hasNextEpisode}
          onClick={() => navigate(`/episode/${data.nextEpisodeId}`)}
          className="rounded-full border-2 border-ink bg-mint px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide shadow-brut-sm transition hover:-translate-y-0.5 hover:shadow-brut disabled:pointer-events-none disabled:opacity-30"
        >
          Episode Selanjutnya
        </button>
      </div>
    </main>
  );
}
