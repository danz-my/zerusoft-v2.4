import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authApi from "../lib/authApi";

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

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // email | code | password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSendCode(e) {
    e.preventDefault();
    setError("");
    setStatus("loading");
    try {
      await authApi.forgotPassword(email.trim());
      setStep("code");
      setStatus("idle");
    } catch (err) {
      setError(err.message || "Gagal kirim kode reset.");
      setStatus("idle");
    }
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    setError("");
    setStatus("loading");
    try {
      await authApi.verifyResetCode({ email: email.trim(), code: code.trim() });
      setStep("password");
      setStatus("idle");
    } catch (err) {
      setError(err.message || "Kode salah atau udah kedaluwarsa.");
      setStatus("idle");
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Konfirmasi password nggak cocok.");
      return;
    }
    setStatus("loading");
    try {
      await authApi.resetPassword({ email: email.trim(), code: code.trim(), password });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Gagal reset password.");
      setStatus("idle");
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-2xl font-bold">Lupa Password</h1>
      <p className="mt-1 font-mono text-xs text-ink/50">
        {step === "email" && "Masukin email, nanti dikirimin kode 6 digit."}
        {step === "code" && "Masukin kode yang dikirim ke emailmu (berlaku 5 menit)."}
        {step === "password" && "Kode valid. Bikin password baru."}
      </p>

      {step === "email" && (
        <form onSubmit={handleSendCode} className="mt-6 flex flex-col gap-4">
          <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {error && <p className="rounded-lg border-2 border-ink bg-pink/30 px-3 py-2 font-mono text-xs">{error}</p>}
          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-2 rounded-full border-2 border-ink bg-mint px-4 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide shadow-brut-sm transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {status === "loading" ? "Mengirim..." : "Kirim Kode"}
          </button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={handleVerifyCode} className="mt-6 flex flex-col gap-4">
          <Field label="Kode 6 Digit" value={code} onChange={(e) => setCode(e.target.value)} required maxLength={6} />
          {error && <p className="rounded-lg border-2 border-ink bg-pink/30 px-3 py-2 font-mono text-xs">{error}</p>}
          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-2 rounded-full border-2 border-ink bg-mint px-4 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide shadow-brut-sm transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {status === "loading" ? "Memeriksa..." : "Verifikasi Kode"}
          </button>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={handleResetPassword} className="mt-6 flex flex-col gap-4">
          <Field label="Password Baru" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          <Field label="Konfirmasi Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          {error && <p className="rounded-lg border-2 border-ink bg-pink/30 px-3 py-2 font-mono text-xs">{error}</p>}
          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-2 rounded-full border-2 border-ink bg-mint px-4 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide shadow-brut-sm transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {status === "loading" ? "Menyimpan..." : "Ganti Password"}
          </button>
        </form>
      )}

      <p className="mt-4 font-mono text-xs text-ink/60">
        Inget password?{" "}
        <Link to="/login" className="underline">
          Login di sini
        </Link>
      </p>
    </main>
  );
}
