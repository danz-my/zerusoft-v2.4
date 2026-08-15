import { useState } from "react";
import { ShareIcon, CheckIcon } from "./icons";

// Kumpulan quotes buat ngajakin orang nonton. Dipilih random tiap kali dibagikan.
const QUOTES = [
  "Nemu anime seru nih, sayang kalau kamu nggak nonton juga.",
  "Udah nonton episode ini belum? Gaskeun sebelum kena spoiler!",
  "Ini baru namanya tontonan wajib minggu ini. Cus tonton bareng!",
  "Jangan cuma aku yang nonton sendirian, kuy nonton juga~",
  "Plot twist-nya bikin nagih. Buruan tonton sebelum ketinggalan!",
  "Rekomendasi anime kali ini dijamin nggak nyesel. Cek deh!",
];

function pickQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

export default function ShareButton({ title, className = "" }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const quote = pickQuote();
    const url = window.location.href;
    const text = title ? `${quote}\n\n"${title}"` : quote;

    if (navigator.share) {
      try {
        await navigator.share({ title: title || "Ayo nonton!", text, url });
      } catch {
        // user cancelled share sheet, do nothing
      }
      return;
    }

    // Fallback: copy link + quote ke clipboard
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Salin link ini buat dibagikan:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-mint px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide transition hover:-translate-y-0.5 hover:shadow-brut-sm ${className}`}
    >
      {copied ? (
        <>
          <CheckIcon /> Tersalin!
        </>
      ) : (
        <>
          <ShareIcon /> Bagikan
        </>
      )}
    </button>
  );
}
