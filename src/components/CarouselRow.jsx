import { useRef } from "react";
import { Link } from "react-router-dom";
import AnimeCard from "./AnimeCard";
import SkeletonCard from "./SkeletonCard";

const ARROW = {
  left: "M15 18l-6-6 6-6",
  right: "M9 18l6-6-6-6",
};

function ScrollButton({ direction, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll kiri" : "Scroll kanan"}
      className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white shadow-brut-sm transition hover:-translate-y-0.5 hover:shadow-brut active:translate-y-0 active:shadow-none sm:flex"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={ARROW[direction]} />
      </svg>
    </button>
  );
}

export default function CarouselRow({ title, tone = "mint", items, loading, genreId }) {
  const scrollerRef = useRef(null);

  function scrollBy(amount) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  const toneClass = {
    mint: "bg-mint",
    cyan: "bg-cyan",
    pink: "bg-pink",
    amber: "bg-amber",
  }[tone];

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full border-2 border-ink ${toneClass}`} />
        <h2 className="font-display text-lg font-bold sm:text-xl">{title}</h2>
        <span className="h-px flex-1 bg-ink/15" />
        {genreId && (
          <Link
            to={`/genre/${genreId}`}
            className="shrink-0 font-mono text-[11px] font-semibold uppercase tracking-wide text-ink/50 hover:text-ink"
          >
            Lihat semua
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ScrollButton direction="left" onClick={() => scrollBy(-600)} />

        <div
          ref={scrollerRef}
          className="flex flex-1 gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:thin]"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-32 shrink-0 sm:w-40">
                  <SkeletonCard />
                </div>
              ))
            : items.map((anime) => (
                <div key={anime.id} className="w-32 shrink-0 sm:w-40">
                  <AnimeCard anime={anime} />
                </div>
              ))}

          {!loading && items.length === 0 && (
            <p className="py-6 font-mono text-xs text-ink/40">Belum ada anime di sini.</p>
          )}
        </div>

        <ScrollButton direction="right" onClick={() => scrollBy(600)} />
      </div>
    </div>
  );
}
