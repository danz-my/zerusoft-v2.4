import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as authApi from "../lib/authApi";
import PasswordStrengthMeter, { getPasswordStrength } from "../components/PasswordStrengthMeter";
import { MailIcon, CheckIcon } from "../components/icons";

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-xs font-semibold uppercase tracking-wide text-ink/60">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-xl border-2 border-ink bg-white px-3 py-2 font-mono text-sm outline-none focus:bg-mint/10"
      />
    </label>
  );
}

export default function Register() {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | ok
  const [resendStatus, setResendStatus] = useState("idle"); // idle | loading | sent

  async function handleResend() {
    setResendStatus("loading");
    try {
      await authApi.resendVerification(form.email.trim());
      setResendStatus("sent");
    } catch (err) {
      setError(err.message || "Gagal kirim ulang email verifikasi.");
      setResendStatus("idle");
    }
  }

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Konfirmasi password nggak cocok.");
      return;
    }
    if (getPasswordStrength(form.password).label === "Lemah") {
      setError("Password terlalu lemah. Pakai minimal 8 karakter + kombinasi huruf besar/angka/simbol.");
      return;
    }

    setStatus("loading");
    try {
      await signUp({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setStatus("ok");
    } catch (err) {
      setError(err.message || "Gagal daftar. Coba lagi.");
      setStatus("idle");
    }
  }

  if (status === "ok") {
    return (
      <main className="mx-auto max-w-md px-6 py-16 text-center">
        <MailIcon className="mx-auto text-ink/70" width={32} height={32} />
        <h1 className="mt-3 font-display text-2xl font-bold">Cek email kamu</h1>
        <p className="mt-2 font-mono text-sm text-ink/60">
          Link konfirmasi udah dikirim ke <strong>{form.email}</strong>. Klik link itu buat aktifin akun,
          baru bisa login.
        </p>

        {error && (
          <p className="mt-4 rounded-lg border-2 border-ink bg-pink/30 px-3 py-2 font-mono text-xs">{error}</p>
        )}

        <button
          type="button"
          onClick={handleResend}
          disabled={resendStatus === "loading" || resendStatus === "sent"}
          className="mt-4 rounded-full border-2 border-ink bg-white px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wide shadow-brut-sm transition hover:-translate-y-0.5 disabled:opacity-50"
        >
          {resendStatus === "sent" ? (
            <span className="inline-flex items-center gap-1.5">
              <CheckIcon width={14} height={14} /> Email verifikasi dikirim ulang
            </span>
          ) : resendStatus === "loading" ? (
            "Mengirim..."
          ) : (
            "Kirim ulang email verifikasi"
          )}
        </button>

        <div>
          <Link to="/login" className="mt-6 inline-block font-mono text-sm underline">
            Balik ke halaman login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-2xl font-bold">Daftar Akun</h1>
      <p className="mt-1 font-mono text-xs text-ink/50">Simpen watchlist &amp; ikutan diskusi.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Field label="Username" value={form.username} onChange={update("username")} required minLength={3} />
        <Field label="Email" type="email" value={form.email} onChange={update("email")} required />
        <div>
          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={update("password")}
            required
            minLength={8}
          />
          <PasswordStrengthMeter password={form.password} />
        </div>
        <Field
          label="Konfirmasi Password"
          type="password"
          value={form.confirm}
          onChange={update("confirm")}
          required
        />

        {error && (
          <p className="rounded-lg border-2 border-ink bg-pink/30 px-3 py-2 font-mono text-xs">{error}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-2 rounded-full border-2 border-ink bg-mint px-4 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide shadow-brut-sm transition hover:-translate-y-0.5 disabled:opacity-50"
        >
          {status === "loading" ? "Memproses..." : "Daftar"}
        </button>
      </form>

      <p className="mt-4 font-mono text-xs text-ink/60">
        Udah punya akun?{" "}
        <Link to="/login" className="underline">
          Login di sini
        </Link>
      </p>
    </main>
  );
}
