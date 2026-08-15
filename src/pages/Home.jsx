import { useEffect, useState } from "react";
import { fetchHome, fetchGenres, fetchAnimeByGenre } from "../lib/api";
import HeroBanner from "../components/HeroBanner";
import CarouselRow from "../components/CarouselRow";

const ROW_SIZE = 15;
const MAX_ROWS = 6;
const TONES = ["mint", "cyan", "pink", "amber"];

export default function Home() {
  const [heroAnime, setHeroAnime] = useState(null);
  const [latest, setLatest] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [rows, setRows] = useState([]); // [{ id, name, items, loading }]
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      try {
        const [homeRes, genresRes] = await Promise.all([fetchHome(), fetchGenres()]);
        if (cancelled) return;

        const ongoing = homeRes.ongoing.slice(0, ROW_SIZE);
        setLatest(ongoing);
        setCompleted(homeRes.completed.slice(0, ROW_SIZE));
        setHeroAnime(ongoing[0] || homeRes.completed[0] || null);
        setStatus("ok");

        const topGenres = genresRes.results.slice(0, MAX_ROWS);

        // render row shell dulu (skeleton), baru isi satu-satu
        setRows(topGenres.map((g) => ({ id: g.id, name: g.name, items: [], loading: true })));

        topGenres.forEach((g, idx) => {
          fetchAnimeByGenre({ genreId: g.id, page: 1 })
            .then((r) => {
              if (cancelled) return;
              setRows((prev) => {
                const next = [...prev];
                next[idx] = { ...next[idx], items: r.results.slice(0, ROW_SIZE), loading: false };
                return next;
              });
            })
            .catch(() => {
              if (cancelled) return;
              setRows((prev) => {
                const next = [...prev];
                next[idx] = { ...next[idx], items: [], loading: false };
                return next;
              });
            });
        });
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6">
      {status === "error" && (
        <p className="mt-10 rounded-xl border-2 border-ink bg-pink/30 px-5 py-4 font-mono text-sm">
          Gagal ambil data anime. Coba refresh halaman.
        </p>
      )}

      <HeroBanner anime={heroAnime} />

      <section className="mt-12 flex flex-col gap-10 pb-24 sm:mt-16">
        <CarouselRow title="Sedang Tayang" tone="mint" items={latest} loading={status === "loading"} />

        {rows.map((row, i) => (
          <CarouselRow
            key={row.id}
            title={row.name}
            tone={TONES[i % TONES.length]}
            items={row.items}
            loading={row.loading}
            genreId={row.id}
          />
        ))}

        <CarouselRow title="Sudah Tamat" tone="cyan" items={completed} loading={status === "loading"} />
      </section>
    </main>
  );
}
