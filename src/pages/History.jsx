import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHistory, clearHistory } from "../lib/watchData";
import { useAuth } from "../context/AuthContext";
import { HistoryIcon } from "../components/icons";

export default function History() {
  const { user, profile } = useAuth();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!profile?.id) {
      setStatus(user ? "loading" : "guest");
      return;
    }
    setStatus("loading");
    getHistory(profile.id)
      .then((r) => {
        setItems(r);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, [profile?.id, user]);

  async function handleClear() {
    if (!profile?.id) return;
    await clearHistory(profile.id);
    setItems([]);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-cyan shadow-brut-sm">
            <HistoryIcon />
          </span>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Riwayat Tontonan</h1>
        </div>
        {status === "ok" && items.length > 0 && (
          <button
            onClick={handleClear}
            className="rounded-full border-2 border-ink bg-white px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide hover:bg-pink/20"
          >
            Hapus Semua
          </button>
        )}
      </div>

      {status === "guest" && (
        <div className="rounded-2xl border-2 border-ink bg-white px-6 py-10 text-center">
          <p className="font-mono text-sm text-ink/50">
            Login dulu buat nyimpen dan liat riwayat tontonan kamu.
          </p>
          <Link
            to="/login"
            className="mt-4 inline-block rounded-full border-2 border-ink bg-mint px-5 py-2 font-mono text-xs font-semibold uppercase tracking-wide shadow-brut-sm"
          >
            Login
          </Link>
        </div>
      )}

      {status === "loading" && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] animate-pulse rounded-2xl border-2 border-ink bg-ink/5" />
          ))}
        </div>
      )}

      {status === "error" && (
        <p className="rounded-xl border-2 border-ink bg-pink/30 px-5 py-4 font-mono text-sm">
          Gagal ambil riwayat. Coba refresh halaman.
        </p>
      )}

      {status === "ok" && items.length === 0 && (
        <div className="rounded-2xl border-2 border-ink bg-white px-6 py-10 text-center">
          <p className="font-mono text-sm text-ink/50">Belum ada riwayat tontonan.</p>
        </div>
      )}

      {status === "ok" && items.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((anime) => (
            <Link
              key={anime.slug}
              to={`/anime/${anime.slug}`}
              className="overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-brut-sm transition hover:-translate-y-1 hover:shadow-brut"
            >
              <div className="aspect-[2/3] w-full overflow-hidden bg-ink/5">
                {anime.image && (
                  <img src={anime.image} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="border-t-2 border-ink p-3">
                <h3
                  className="line-clamp-2 min-h-[2.6em] font-display text-sm font-bold leading-snug"
                  dangerouslySetInnerHTML={{ __html: anime.title || "Tanpa judul" }}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
