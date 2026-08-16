import { Link } from "react-router-dom";
import { PlayIcon } from "./icons";

function slugFromLink(link) {
  if (!link) return "";
  try {
    return new URL(link).pathname.replace(/^\/|\/$/g, "").split("/").pop();
  } catch {
    return "";
  }
}

export default function AnimeCard({ anime }) {
  const slug = anime.slug || slugFromLink(anime.link || anime.url);

  return (
    <Link
      to={`/anime/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-brut-sm transition hover:-translate-y-1 hover:shadow-brut"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-ink/5">
        {anime.image ? (
          <img
            src={anime.image}
            alt={anime.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-ink/30">
            No image
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-ink/40 opacity-0 transition group-hover:opacity-100">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-cream bg-mint text-ink">
            <PlayIcon />
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1 border-t-2 border-ink p-3">
        <h3
          className="line-clamp-2 min-h-[2.6em] font-display text-sm font-bold leading-snug"
          dangerouslySetInnerHTML={{ __html: anime.title || "Tanpa judul" }}
        />
      </div>
    </Link>
  );
}
