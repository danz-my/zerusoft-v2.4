export function getPasswordStrength(password = "") {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (!password) return { label: "", color: "bg-transparent", width: "0%" };
  if (score <= 1) return { label: "Lemah", color: "bg-pink", width: "20%" };
  if (score === 2) return { label: "Cukup", color: "bg-amber", width: "45%" };
  if (score === 3 || score === 4) return { label: "Baik", color: "bg-cyan", width: "70%" };
  return { label: "Sangat Baik", color: "bg-mint", width: "100%" };
}

export default function PasswordStrengthMeter({ password }) {
  if (!password) return null;
  const { label, color, width } = getPasswordStrength(password);

  return (
    <div className="mt-2">
      <div className="h-2 w-full overflow-hidden rounded-full border-2 border-ink bg-white">
        <div className={`h-full ${color} transition-all duration-300`} style={{ width }} />
      </div>
      <p className="mt-1 font-mono text-[11px] text-ink/60">Kekuatan password: {label}</p>
    </div>
  );
}
