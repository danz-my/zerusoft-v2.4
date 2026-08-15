import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { getBookmarks, getHistory, clearHistory } from "../lib/watchData";
import { HomeIcon } from "../components/icons";

export default function Profile() {
  const { user, profile, loading, signOut } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState({ type: "bug", message: "" });
  const [feedbackStatus, setFeedbackStatus] = useState("idle"); // idle | loading | ok | error

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  useEffect(() => {
    if (profile?.id) {
      getHistory(profile.id).then(setHistory);
    }
  }, [profile?.id]);

  if (loading) {
    return <main className="px-6 py-16 text-center font-mono text-sm text-ink/50">Memuat...</main>;
  }

  if (!user) return <Navigate to="/login" replace />;

  async function submitFeedback(e) {
    e.preventDefault();
    setFeedbackStatus("loading");
    try {
      const { error } = await supabase.from("feedback").insert({
        user_id: profile?.id,
        username: profile?.username,
        type: feedback.type,
        message: feedback.message,
      });
      if (error) throw error;
      setFeedback({ type: "bug", message: "" });
      setFeedbackStatus("ok");
    } catch {
      setFeedbackStatus("error");
    }
  }

  async function handleClearHistory() {
    await clearHistory(profile?.id);
    setHistory([]);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">{profile?.username || "Profil"}</h1>
          <p className="font-mono text-xs text-ink/50">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3 py-1.5 font-mono text-xs font-semibold uppercase hover:bg-mint/20"
          >
            <HomeIcon /> Home
          </Link>
          {profile?.is_admin && (
            <Link
              to="/admin"
              className="rounded-full border-2 border-ink bg-amber px-3 py-1.5 font-mono text-xs font-semibold uppercase shadow-brut-sm"
            >
              Admin Panel
            </Link>
          )}
          <button
            onClick={signOut}
            className="rounded-full border-2 border-ink bg-white px-3 py-1.5 font-mono text-xs font-semibold uppercase hover:bg-pink/20"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Watchlist */}
      <section className="mt-10">
        <h2 className="font-display text-lg font-bold">Watchlist Kamu</h2>
        {bookmarks.length === 0 ? (
          <p className="mt-2 font-mono text-xs text-ink/50">Belum ada anime yang disimpan.</p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {bookmarks.map((b) => (
              <Link
                key={b.slug}
                to={`/anime/${b.slug}`}
                className="rounded-xl border-2 border-ink bg-white p-2 font-mono text-xs transition hover:-translate-y-0.5 hover:shadow-brut-sm"
              >
                <span className="line-clamp-2">{b.title}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* History */}
      <section className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">Riwayat Tontonan</h2>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="font-mono text-[11px] uppercase text-ink/50 underline hover:text-ink"
            >
              Hapus Riwayat
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="mt-2 font-mono text-xs text-ink/50">Belum ada riwayat.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {history.map((h) => (
              <li key={h.slug + h.watchedAt} className="flex items-center justify-between gap-3">
                <Link to={`/anime/${h.slug}`} className="font-mono text-xs underline">
                  {h.title}
                </Link>
                <span className="shrink-0 font-mono text-[10px] text-ink/40">
                  {new Date(h.watchedAt).toLocaleString("id-ID")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Feedback */}
      <section className="mt-10">
        <h2 className="font-display text-lg font-bold">Lapor Bug / Kasih Masukan</h2>
        <p className="mt-1 font-mono text-xs text-ink/50">Laporan kamu langsung masuk ke admin.</p>

        <form onSubmit={submitFeedback} className="mt-3 flex flex-col gap-3">
          <select
            value={feedback.type}
            onChange={(e) => setFeedback((f) => ({ ...f, type: e.target.value }))}
            className="w-fit rounded-xl border-2 border-ink bg-white px-3 py-2 font-mono text-xs"
          >
            <option value="bug">Lapor Bug</option>
            <option value="suggestion">Kasih Masukan</option>
          </select>
          <textarea
            required
            value={feedback.message}
            onChange={(e) => setFeedback((f) => ({ ...f, message: e.target.value }))}
            rows={4}
            placeholder="Ceritain masalah atau ide kamu..."
            className="w-full rounded-xl border-2 border-ink bg-white px-3 py-2 font-mono text-sm outline-none focus:bg-mint/10"
          />
          <button
            type="submit"
            disabled={feedbackStatus === "loading"}
            className="w-fit rounded-full border-2 border-ink bg-cyan px-4 py-2 font-mono text-xs font-semibold uppercase shadow-brut-sm transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {feedbackStatus === "loading" ? "Mengirim..." : "Kirim"}
          </button>
          {feedbackStatus === "ok" && (
            <p className="font-mono text-xs text-ink/70">Makasih! Masukan kamu udah terkirim ke admin.</p>
          )}
          {feedbackStatus === "error" && (
            <p className="font-mono text-xs text-ink/70">Gagal kirim, coba lagi ya.</p>
          )}
        </form>
      </section>
    </main>
  );
}
