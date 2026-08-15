import { useEffect, useState } from "react";
import { toggleBookmark, isBookmarked } from "../lib/watchData";
import { BookmarkIcon } from "./icons";

export default function BookmarkButton({ slug, title, image, className = "" }) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(slug));
  }, [slug]);

  function handleClick() {
    const nowBookmarked = toggleBookmark({ slug, title, image });
    setBookmarked(nowBookmarked);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide transition hover:-translate-y-0.5 hover:shadow-brut-sm ${
        bookmarked ? "bg-amber" : "bg-white"
      } ${className}`}
    >
      <BookmarkIcon fill={bookmarked ? "currentColor" : "none"} />
      {bookmarked ? "Tersimpan" : "Simpan"}
    </button>
  );
}
