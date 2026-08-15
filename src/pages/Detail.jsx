import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAnimeDetail } from "../lib/api";
import { ChevronLeft, EyeIcon, PlayIcon } from "../components/icons";
import ShareButton from "../components/ShareButton";
import BookmarkButton from "../components/BookmarkButton";
import AnimeCard from "../components/AnimeCard";

export default function Detail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
    setData(null);
    window.scrollTo({ top: 0, behavior: "instant" });
    fetchAnimeDetail(id)
      .then((r) => {
        setData(r);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, [id]);

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
        <p className="font-mono text-sm text-ink/50">Gagal memuat data anime ini.</p>
        <Link to="/" className="mt-4 inline-block font-mono text-sm underline">
          Balik ke beranda
        </Link>
      </main>
    );
  }

  const firstEpisode = data.episodeList?.[0] || null;

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-6">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-wide text-ink/60 hover:text-ink"
      >
        <ChevronLeft /> Kembali
      </Link>

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        {data.poster && (
          <img
            src={data.poster}
            alt={data.title}
            className="aspect-[2/3] w-full rounded-2xl border-2 border-ink object-cover shadow-brut-sm lg:w-[200px]"
          />
        )}

        <div>
          <h1
            className="font-display text-2xl font-bold leading-tight sm:text-3xl"
            dangerouslySetInnerHTML={{ __html: data.title || "Tanpa judul" }}
          />

          <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-xs text-ink/50">
            {data.status && <span>{data.status}</span>}
            {data.score && (
              <span className="flex items-center gap-1">
                <EyeIcon /> {data.score}
              </span>
            )}
            {data.aired && <span>{data.aired}</span>}
            {data.studios && <span>oleh {data.studios}</span>}
          </div>

          {data.genres?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {data.genres.map((g) => (
                <span
                  key={g}
                  className="rounded-full border-2 border-ink bg-cyan px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {data.synopsis && (
            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-ink/75">
              {data.synopsis}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {firstEpisode && (
              <Link
                to={`/episode/${firstEpisode.episodeId}`}
                className="flex items-center gap-2 rounded-full border-2 border-ink bg-mint px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide shadow-brut-sm transition hover:-translate-y-0.5 hover:shadow-brut active:translate-y-0 active:shadow-none"
              >
                <PlayIcon /> Tonton Sekarang
              </Link>
            )}
            <BookmarkButton slug={data.animeId} title={data.title} image={data.poster} />
            <ShareButton title={data.title} />
          </div>
        </div>
      </div>

      {/* ---------- EPISODE LIST ---------- */}
      {data.episodeList?.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 font-display text-xl font-bold">
            Daftar Episode ({data.totalEpisodes})
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6">
            {data.episodeList.map((ep) => (
              <Link
                key={ep.episodeId}
                to={`/episode/${ep.episodeId}`}
                className="truncate rounded-lg border-2 border-ink bg-white px-3 py-2 text-center font-mono text-xs font-semibold transition hover:-translate-y-0.5 hover:shadow-brut-sm"
                title={ep.title}
              >
                {ep.title || `Eps ${ep.eps}`}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ---------- RECOMMENDED ---------- */}
      {data.recommended?.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 font-display text-xl font-bold">Rekomendasi Lainnya</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {data.recommended.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
