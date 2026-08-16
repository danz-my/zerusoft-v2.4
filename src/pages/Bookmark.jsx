import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBookmarks, removeBookmark } from "../lib/watchData";
import { BookmarkIcon } from "../components/icons";

export default function Bookmarks() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getBookmarks());
  }, []);

  function handleRemove(slug) {
    removeBookmark(slug);
    setItems(getBookmarks());
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-pink shadow-brut-sm">
          <BookmarkIcon />
        </span>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Anime Tersimpan</h1>
      </div>

      {items.length === 0 && (
        <div className="rounded-2xl border-2 border-ink bg-white px-6 py-10 text-center">
          <p className="font-mono text-sm text-ink/50">
            Belum ada anime yang disimpan. Tap ikon bookmark di halaman detail anime buat nyimpen.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-full border-2 border-ink bg-mint px-5 py-2 font-mono text-xs font-semibold uppercase tracking-wide shadow-brut-sm"
          >
            Jelajahi Anime
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((anime) => (
            <div key={anime.slug} className="group relative">
              <Link
                to={`/anime/${anime.slug}`}
                className="block overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-brut-sm transition hover:-translate-y-1 hover:shadow-brut"
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
              <button
                onClick={() => handleRemove(anime.slug)}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-cream font-mono text-xs font-bold shadow-brut-sm"
                title="Hapus dari simpanan"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
