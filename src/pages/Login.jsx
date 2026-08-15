import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");

  async function resolveEmail(value) {
    if (value.includes("@")) return value;
    const { data } = await supabase.from("profiles").select("email").eq("username", value).maybeSingle();
    return data?.email || value;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setStatus("loading");
    try {
      const email = await resolveEmail(identifier.trim());
      await signIn({ email, password });
      navigate("/profile");
    } catch {
      setError("Username/email atau password salah.");
      setStatus("idle");
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-2xl font-bold">Login</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="block">
          <span className="mb-1 block font-mono text-xs font-semibold uppercase tracking-wide text-ink/60">
            Username atau Email
          </span>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="w-full rounded-xl border-2 border-ink bg-white px-3 py-2 font-mono text-sm outline-none focus:bg-mint/10"
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-mono text-xs font-semibold uppercase tracking-wide text-ink/60">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border-2 border-ink bg-white px-3 py-2 font-mono text-sm outline-none focus:bg-mint/10"
          />
        </label>

        {error && (
          <p className="rounded-lg border-2 border-ink bg-pink/30 px-3 py-2 font-mono text-xs">{error}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-2 rounded-full border-2 border-ink bg-mint px-4 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide shadow-brut-sm transition hover:-translate-y-0.5 disabled:opacity-50"
        >
          {status === "loading" ? "Memproses..." : "Login"}
        </button>
      </form>

      <p className="mt-4 font-mono text-xs text-ink/60">
        Belum punya akun?{" "}
        <Link to="/register" className="underline">
          Daftar di sini
        </Link>
      </p>
      <p className="mt-1 font-mono text-xs text-ink/60">
        <Link to="/forgot-password" className="underline">
          Lupa password?
        </Link>
      </p>
    </main>
  );
}
