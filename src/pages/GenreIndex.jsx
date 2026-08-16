import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchGenres } from "../lib/api";
import { GridIcon } from "../components/icons";

const TONES = ["bg-mint", "bg-cyan", "bg-pink", "bg-amber"];

export default function GenreIndex() {
  const [genres, setGenres] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetchGenres()
      .then((r) => {
        setGenres(r.results);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-mint shadow-brut-sm">
          <GridIcon />
        </span>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Semua Genre</h1>
      </div>

      {status === "loading" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-2xl border-2 border-ink bg-ink/5" />
          ))}
        </div>
      )}

      {status === "error" && (
        <p className="rounded-xl border-2 border-ink bg-pink/30 px-5 py-4 font-mono text-sm">
          Gagal ambil daftar genre. Coba refresh halaman.
        </p>
      )}

      {status === "ok" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {genres.map((g, i) => (
            <Link
              key={g.id}
              to={`/genre/${g.id}`}
              className={`flex items-center justify-center rounded-2xl border-2 border-ink px-4 py-4 text-center font-display text-sm font-bold shadow-brut-sm transition hover:-translate-y-0.5 hover:shadow-brut ${TONES[i % TONES.length]}`}
            >
              {g.name}
            </Link>
          ))}
        </div>
      )}

      {status === "ok" && genres.length === 0 && (
        <p className="text-center font-mono text-sm text-ink/50">Belum ada genre.</p>
      )}
    </main>
  );
}
