import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchGenres, fetchAnimeByGenre } from "../lib/api";
import AnimeCard from "../components/AnimeCard";
import SkeletonCard from "../components/SkeletonCard";
import { ChevronLeft } from "../components/icons";

const PER_PAGE = 24;

export default function GenrePage() {
  const { id } = useParams();
  const [genreName, setGenreName] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("loading");
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchGenres()
      .then((r) => {
        const found = r.results.find((g) => String(g.id) === String(id));
        setGenreName(found?.name || "");
      })
      .catch(() => {});
  }, [id]);

  const loadPage = useCallback(
    (pageNum) => fetchAnimeByGenre({ genreId: id, page: pageNum }),
    [id]
  );

  useEffect(() => {
    setStatus("loading");
    setItems([]);
    setPage(1);
    loadPage(1)
      .then((r) => {
        setItems(r.results.slice(0, PER_PAGE));
        setTotalPages(r.totalPages || 1);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, [loadPage]);

  function handleLoadMore() {
    setLoadingMore(true);
    const nextPage = page + 1;
    loadPage(nextPage)
      .then((r) => {
        setItems((prev) => [...prev, ...r.results]);
        setPage(nextPage);
      })
      .finally(() => setLoadingMore(false));
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-wide text-ink/60 hover:text-ink"
      >
        <ChevronLeft /> Kembali
      </Link>

      <div className="mb-8 flex flex-col gap-2">
        <span className="inline-block w-fit rounded-full border-2 border-ink bg-cyan px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest">
          Genre
        </span>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">{genreName || "..."}</h1>
      </div>

      {status === "error" && (
        <p className="rounded-xl border-2 border-ink bg-pink/30 px-5 py-4 font-mono text-sm">
          Gagal ambil data. Coba refresh halaman.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {status === "loading"
          ? Array.from({ length: PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
          : items.map((anime) => <AnimeCard key={anime.id} anime={anime} />)}
      </div>

      {status === "ok" && items.length === 0 && (
        <p className="mt-10 text-center font-mono text-sm text-ink/50">
          Nggak ada anime di genre ini.
        </p>
      )}

      {status === "ok" && page < totalPages && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="rounded-full border-2 border-ink bg-mint px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide shadow-brut-sm transition hover:-translate-y-0.5 hover:shadow-brut disabled:opacity-50"
          >
            {loadingMore ? "Memuat..." : "Muat Lebih Banyak"}
          </button>
        </div>
      )}
    </main>
  );
}
