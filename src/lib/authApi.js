import config from "../config";

const base = config.authApiBase;

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  let json = null;
  try {
    json = await res.json();
  } catch {
    // respons kosong / bukan JSON
  }

  // Format response asli API auth: { status: "success" | "error", message, data }
  if (!res.ok || (json && json.status === "error")) {
    const message = json?.message || `Request gagal (${res.status}).`;
    throw new Error(message);
  }

  return json?.data ?? json;
}

export function register({ email, password }) {
  return request("/api/auth/register", { method: "POST", body: { email, password } });
}

export function login({ email, password }) {
  return request("/api/auth/login", { method: "POST", body: { email, password } });
}

export function resendVerification(email) {
  return request("/api/auth/resend", { method: "POST", body: { email } });
}

export function verifyEmail(token) {
  return request(`/api/auth/verify?token=${encodeURIComponent(token)}`);
}

export function checkEmail(email) {
  return request(`/api/auth/check-email/${encodeURIComponent(email)}`);
}

export function forgotPassword(email) {
  return request("/api/auth/forgot-password", { method: "POST", body: { email } });
}

export function verifyResetCode({ email, code }) {
  return request("/api/auth/verify-reset-code", { method: "POST", body: { email, code } });
}

export function resetPassword({ email, code, password }) {
  return request("/api/auth/reset-password", { method: "POST", body: { email, code, password } });
}
