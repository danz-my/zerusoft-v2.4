import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { BugIcon, LightbulbIcon } from "../components/icons";

export default function Admin() {
  const { user, profile, loading } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [form, setForm] = useState({ title: "", message: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile?.is_admin) {
      loadAnnouncements();
      loadFeedback();
    }
  }, [profile]);

  async function loadAnnouncements() {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    setAnnouncements(data || []);
  }

  async function loadFeedback() {
    const { data } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });
    setFeedbackList(data || []);
  }

  async function addAnnouncement(e) {
    e.preventDefault();
    setBusy(true);
    await supabase.from("announcements").insert({
      title: form.title,
      message: form.message,
      created_by: profile?.id,
    });
    setForm({ title: "", message: "" });
    await loadAnnouncements();
    setBusy(false);
  }

  async function deleteAnnouncement(id) {
    await supabase.from("announcements").delete().eq("id", id);
    loadAnnouncements();
  }

  async function toggleFeedbackStatus(id, current) {
    await supabase
      .from("feedback")
      .update({ status: current === "open" ? "resolved" : "open" })
      .eq("id", id);
    loadFeedback();
  }

  if (loading) {
    return <main className="px-6 py-16 text-center font-mono text-sm text-ink/50">Memuat...</main>;
  }

  // Bukan admin? Tendang balik ke home. Ini pengecekan di sisi klien untuk UX;
  // keamanan aslinya ditegakkan oleh RLS policy di Supabase (lihat supabase/schema.sql).
  if (!user || !profile?.is_admin) return <Navigate to="/" replace />;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
      <p className="mt-1 font-mono text-xs text-ink/50">Login sebagai {profile.username}</p>

      {/* Pemberitahuan */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-bold">Tambah Pemberitahuan</h2>
        <p className="mt-1 font-mono text-xs text-ink/50">
          Muncul di ikon lonceng semua pengguna.
        </p>

        <form
          onSubmit={addAnnouncement}
          className="mt-3 flex flex-col gap-3 rounded-2xl border-2 border-ink bg-white p-4 shadow-brut-sm"
        >
          <input
            required
            placeholder="Judul"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="rounded-xl border-2 border-ink px-3 py-2 font-mono text-sm outline-none focus:bg-mint/10"
          />
          <textarea
            required
            placeholder="Isi pemberitahuan"
            rows={3}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="rounded-xl border-2 border-ink px-3 py-2 font-mono text-sm outline-none focus:bg-mint/10"
          />
          <button
            disabled={busy}
            className="w-fit rounded-full border-2 border-ink bg-mint px-4 py-2 font-mono text-xs font-semibold uppercase shadow-brut-sm transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {busy ? "Menyimpan..." : "Kirim Pemberitahuan"}
          </button>
        </form>

        <ul className="mt-4 flex flex-col gap-2">
          {announcements.map((a) => (
            <li
              key={a.id}
              className="flex items-start justify-between gap-3 rounded-xl border-2 border-ink bg-cream px-4 py-3"
            >
              <div>
                <p className="font-display text-sm font-bold">{a.title}</p>
                <p className="font-mono text-xs text-ink/60">{a.message}</p>
              </div>
              <button
                onClick={() => deleteAnnouncement(a.id)}
                className="shrink-0 font-mono text-xs underline"
              >
                Hapus
              </button>
            </li>
          ))}
          {announcements.length === 0 && (
            <p className="font-mono text-xs text-ink/50">Belum ada pemberitahuan.</p>
          )}
        </ul>
      </section>

      {/* Laporan & Masukan */}
      <section className="mt-10">
        <h2 className="font-display text-lg font-bold">Laporan &amp; Masukan Pengguna</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {feedbackList.map((f) => (
            <li key={f.id} className="rounded-xl border-2 border-ink bg-white px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1 font-mono text-[11px] font-semibold uppercase text-ink/50">
                  {f.type === "bug" ? <BugIcon /> : <LightbulbIcon />}
                  {f.type === "bug" ? "Bug" : "Masukan"} · {f.username || "anon"}
                </span>
                <button
                  onClick={() => toggleFeedbackStatus(f.id, f.status)}
                  className={`rounded-full border-2 border-ink px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                    f.status === "open" ? "bg-amber" : "bg-mint"
                  }`}
                >
                  {f.status}
                </button>
              </div>
              <p className="mt-1 font-mono text-sm">{f.message}</p>
              <p className="mt-1 font-mono text-[10px] text-ink/35">
                {new Date(f.created_at).toLocaleString("id-ID")}
              </p>
            </li>
          ))}
          {feedbackList.length === 0 && (
            <p className="font-mono text-xs text-ink/50">Belum ada laporan.</p>
          )}
        </ul>
      </section>
    </main>
  );
}
