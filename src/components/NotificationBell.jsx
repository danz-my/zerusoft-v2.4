import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { BellIcon } from "./icons";

const SEEN_KEY = "zerusoft_seen_announcements";

function getSeenIds() {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY)) || [];
  } catch {
    return [];
  }
}

function markSeen(ids) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export default function NotificationBell() {
  const [items, setItems] = useState([]);
  const [seenIds, setSeenIds] = useState(getSeenIds());
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data, error }) => {
        if (!error) setItems(data || []);
      });
  }, []);

  useEffect(() => {
    function onClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const unreadCount = items.filter((i) => !seenIds.includes(i.id)).length;

  function toggleOpen() {
    const next = !open;
    setOpen(next);
    if (next) {
      const ids = items.map((i) => i.id);
      markSeen(ids);
      setSeenIds(ids);
    }
  }

  return (
    <div ref={boxRef} className="relative">
      <button
        onClick={toggleOpen}
        aria-label="Notifikasi"
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white transition hover:-translate-y-0.5 hover:bg-amber/30 hover:shadow-brut-sm"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-ink bg-pink px-0.5 font-mono text-[9px] font-bold leading-none">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-72 overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-brut-lg">
          {items.length === 0 ? (
            <p className="px-4 py-4 font-mono text-xs text-ink/50">Belum ada pemberitahuan.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {items.map((a) => (
                <li key={a.id} className="border-b border-ink/10 px-4 py-3 last:border-none">
                  <p className="font-display text-sm font-bold">{a.title}</p>
                  <p className="mt-0.5 font-mono text-xs text-ink/60">{a.message}</p>
                  <p className="mt-1 font-mono text-[10px] text-ink/35">
                    {new Date(a.created_at).toLocaleString("id-ID")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
