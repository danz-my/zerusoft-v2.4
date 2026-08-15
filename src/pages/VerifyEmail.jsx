import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import * as authApi from "../lib/authApi";
import { CheckIcon } from "../components/icons";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Link nggak valid, token nggak ketemu.");
      return;
    }
    authApi
      .verifyEmail(token)
      .then(() => setStatus("ok"))
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Token tidak valid atau udah kedaluwarsa.");
      });
  }, [token]);

  return (
    <main className="mx-auto max-w-md px-6 py-16 text-center">
      {status === "loading" && (
        <p className="font-mono text-sm text-ink/60">Memverifikasi email...</p>
      )}

      {status === "ok" && (
        <>
          <CheckIcon className="mx-auto text-ink/70" width={32} height={32} />
          <h1 className="mt-3 font-display text-2xl font-bold">Email terverifikasi</h1>
          <p className="mt-2 font-mono text-sm text-ink/60">Akun kamu udah aktif, sekarang bisa login.</p>
          <Link to="/login" className="mt-6 inline-block font-mono text-sm underline">
            Ke halaman login
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <h1 className="font-display text-2xl font-bold">Verifikasi gagal</h1>
          <p className="mt-2 rounded-lg border-2 border-ink bg-pink/30 px-3 py-2 font-mono text-xs">
            {message}
          </p>
          <Link to="/register" className="mt-6 inline-block font-mono text-sm underline">
            Balik ke halaman daftar
          </Link>
        </>
      )}
    </main>
  );
}
