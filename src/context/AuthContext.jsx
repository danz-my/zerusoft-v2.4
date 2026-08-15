import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import * as authApi from "../lib/authApi";

const AuthContext = createContext(null);
const STORAGE_KEY = "zerusoft_auth"; // { email }

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredAuth(value) {
  if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  else localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { email }
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(email) {
    if (!email) {
      setProfile(null);
      return null;
    }
    const { data } = await supabase.from("profiles").select("*").eq("email", email).maybeSingle();
    setProfile(data || null);
    return data || null;
  }

  useEffect(() => {
    let mounted = true;

    (async () => {
      const stored = readStoredAuth();
      if (stored?.email) {
        setUser({ email: stored.email });
        await loadProfile(stored.email);
      }
      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function signUp({ username, email, password }) {
    const result = await authApi.register({ email, password });

    // Auth API cuma nyimpen email + password. Username disimpan di tabel
    // profiles Supabase secara terpisah, dibuat langsung pas daftar.
    const { error } = await supabase
      .from("profiles")
      .upsert({ username, email }, { onConflict: "email" });
    if (error) throw error;

    return result;
  }

  async function signIn({ email, password }) {
    // Auth API cuma verifikasi email+password, balikin { id, email } (bukan token).
    // Sesi login diatur sendiri di sini lewat localStorage.
    await authApi.login({ email, password });

    writeStoredAuth({ email });
    setUser({ email });
    await loadProfile(email);
  }

  async function signOut() {
    writeStoredAuth(null);
    setUser(null);
    setProfile(null);
  }

  const value = {
    user,
    profile,
    loading,
    isAdmin: !!profile?.is_admin,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
