import { Link } from "react-router-dom";
import { PlayIcon } from "./icons";

function stripHtml(html = "") {
  return html.replace(/<[^>]+>/g, "");
}

export default function HeroBanner({ anime }) {
  if (!anime) return null;

  return (
    <section className="mt-8 stripes rounded-3xl border-2 border-ink bg-white/40 p-1 shadow-brut-lg sm:mt-12">
      <div className="grain-lines grid gap-8 rounded-[1.3rem] border-2 border-ink bg-ink px-6 py-10 text-cream sm:px-10 sm:py-12 lg:grid-cols-[220px_1fr] lg:items-center lg:py-14">
        {anime.image && (
          <img
            src={anime.image}
            alt={stripHtml(anime.title)}
            className="mx-auto hidden aspect-[2/3] w-44 rounded-2xl border-2 border-cream/70 object-cover shadow-brut lg:block"
          />
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-mint px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink">
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-600" />
              SEDANG TAYANG
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-amber px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink">
              SUB INDO
            </span>
          </div>

          <h1
            className="font-display text-3xl font-bold leading-tight sm:text-5xl"
            dangerouslySetInnerHTML={{ __html: anime.title || "" }}
          />

          {anime.excerpt && (
            <p className="line-clamp-3 max-w-2xl text-sm leading-relaxed text-cream/75 sm:text-base">
              {stripHtml(anime.excerpt)}
            </p>
          )}

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <Link
              to={`/anime/${anime.slug}`}
              className="flex items-center gap-2 rounded-full border-2 border-cream bg-mint px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-ink shadow-[4px_4px_0px_0px_rgba(250,247,236,1)] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(250,247,236,1)] active:translate-y-0 active:shadow-none"
            >
              <PlayIcon /> Tonton Sekarang
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
