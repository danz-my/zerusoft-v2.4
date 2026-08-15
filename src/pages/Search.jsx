import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchAnime } from "../lib/api";
import useDebouncedValue from "../lib/useDebounce";
import AnimeCard from "../components/AnimeCard";
import SkeletonCard from "../components/SkeletonCard";
import { SearchIcon } from "../components/icons";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") || "";
  const [input, setInput] = useState(initialQ);
  const debouncedInput = useDebouncedValue(input, 350);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState(initialQ ? "loading" : "idle");

  // sync URL setiap kali debounced value berubah, tanpa reload halaman
  useEffect(() => {
    const query = debouncedInput.trim();
    if (query) {
      setParams({ q: query }, { replace: true });
    } else {
      setParams({}, { replace: true });
    }
  }, [debouncedInput, setParams]);

  useEffect(() => {
    const query = debouncedInput.trim();
    if (!query) {
      setItems([]);
      setStatus("idle");
      return;
    }
    setStatus("loading");
    searchAnime(query)
      .then((r) => {
        setItems(r.results);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, [debouncedInput]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-3">
        <span className="inline-block w-fit rounded-full border-2 border-ink bg-cyan px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest">
          Cari Anime
        </span>

        <div className="relative max-w-md">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Ketik judul anime..."
            className="w-full rounded-full border-2 border-ink bg-white py-2.5 pl-10 pr-4 font-mono text-sm outline-none focus:bg-mint/10"
          />
        </div>

        {debouncedInput.trim() && (
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Hasil untuk "{debouncedInput.trim()}"
          </h1>
        )}
      </div>

      {status === "error" && (
        <p className="rounded-xl border-2 border-ink bg-pink/30 px-5 py-4 font-mono text-sm">
          Gagal mencari. Coba lagi.
        </p>
      )}

      {status === "idle" && (
        <p className="rounded-xl border-2 border-dashed border-ink/30 px-5 py-10 text-center font-mono text-sm text-ink/40">
          Mulai ketik buat cari anime.
        </p>
      )}

      {(status === "loading" || status === "ok") && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {status === "loading"
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : items.map((anime) => <AnimeCard key={anime.id} anime={anime} />)}
        </div>
      )}

      {status === "ok" && items.length === 0 && (
        <p className="mt-10 text-center font-mono text-sm text-ink/50">
          Nggak ketemu hasil buat "{debouncedInput.trim()}".
        </p>
      )}
    </main>
  );
}
