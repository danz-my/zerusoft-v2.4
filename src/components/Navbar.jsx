import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../config";
import { searchAnime } from "../lib/api";
import useDebouncedValue from "../lib/useDebounce";
import { SearchIcon } from "./icons";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, profile } = useAuth();
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | ok
  const [open, setOpen] = useState(false);
  const debouncedQ = useDebouncedValue(q, 350);
  const navigate = useNavigate();
  const boxRef = useRef(null);

  useEffect(() => {
    const query = debouncedQ.trim();
    if (!query) {
      setResults([]);
      setStatus("idle");
      return;
    }
    setStatus("loading");
    searchAnime(query, 1)
      .then((r) => {
        setResults(r.results.slice(0, 6));
        setStatus("ok");
      })
      .catch(() => setStatus("ok"));
  }, [debouncedQ]);

  useEffect(() => {
    function onClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function goToFullResults() {
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      setOpen(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") goToFullResults();
    if (e.key === "Escape") setOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b-2 border-ink bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-mint font-display text-base font-bold shadow-brut-sm">
            Z
          </span>
          <span className="hidden font-display text-lg font-bold sm:inline">
            {config.name}
          </span>
        </Link>

        <div ref={boxRef} className="relative ml-auto w-full max-w-md">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="Cari anime..."
              className="w-full rounded-full border-2 border-ink bg-white py-2 pl-10 pr-4 font-mono text-sm outline-none focus:bg-mint/10"
            />
          </div>

          {/* ---- dropdown auto-search ---- */}
          {open && q.trim() && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-brut-lg">
              {status === "loading" && (
                <p className="px-4 py-4 font-mono text-xs text-ink/50">Mencari...</p>
              )}

              {status === "ok" && results.length === 0 && (
                <p className="px-4 py-4 font-mono text-xs text-ink/50">
                  Nggak ketemu hasil buat "{q}".
                </p>
              )}

              {status === "ok" && results.length > 0 && (
                <ul className="max-h-96 overflow-y-auto">
                  {results.map((anime) => (
                    <li key={anime.id} className="border-b border-ink/10 last:border-none">
                      <Link
                        to={`/anime/${anime.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-mint/15"
                      >
                        <div className="h-14 w-10 shrink-0 overflow-hidden rounded-md border-2 border-ink bg-ink/5">
                          {anime.image && (
                            <img src={anime.image} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <span
                          className="line-clamp-2 font-display text-sm font-semibold leading-snug"
                          dangerouslySetInnerHTML={{ __html: anime.title || "Tanpa judul" }}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {status === "ok" && results.length > 0 && (
                <button
                  onClick={goToFullResults}
                  className="w-full border-t-2 border-ink bg-cream px-4 py-2.5 text-center font-mono text-xs font-semibold uppercase tracking-wide hover:bg-mint/20"
                >
                  Lihat semua hasil untuk "{q}"
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <NotificationBell />
          {user ? (
            <Link
              to="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-mint font-mono text-xs font-bold uppercase shadow-brut-sm"
              title={profile?.username || "Profil"}
            >
              {(profile?.username || "?").slice(0, 1).toUpperCase()}
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-full border-2 border-ink bg-white px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide hover:bg-mint/20"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
