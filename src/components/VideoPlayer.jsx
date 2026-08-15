import { useEffect, useRef, useState } from "react";

function isSafeUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function detectKind(url) {
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".m3u8")) return "hls";
  if (clean.endsWith(".mp4") || clean.endsWith(".webm") || clean.endsWith(".mkv")) return "video";
  return "embed";
}

export default function VideoPlayer({ url, title }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [error, setError] = useState(false);

  const safe = isSafeUrl(url);
  const kind = safe ? detectKind(url) : null;

  useEffect(() => {
    setError(false);
    if (kind !== "hls" || !videoRef.current) return;

    let cancelled = false;
    const video = videoRef.current;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      return;
    }

    import("hls.js").then(({ default: Hls }) => {
      if (cancelled) return;
      if (!Hls.isSupported()) {
        setError(true);
        return;
      }
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (data.fatal) setError(true);
      });
    });

    return () => {
      cancelled = true;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url, kind]);

  if (!safe) {
    return (
      <div className="flex aspect-video items-center justify-center font-mono text-sm text-cream/50">
        Player nggak tersedia buat episode ini.
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex aspect-video items-center justify-center font-mono text-sm text-cream/50">
        Gagal memuat video. Coba pilih server lain.
      </div>
    );
  }

  if (kind === "hls" || kind === "video") {
    return (
      <div className="aspect-video w-full">
        <video
          ref={videoRef}
          src={kind === "video" ? url : undefined}
          controls
          playsInline
          className="h-full w-full bg-ink"
          title={title || "Player"}
          onError={() => setError(true)}
        />
      </div>
    );
  }

  return (
    <div className="aspect-video w-full">
      <iframe
        src={url}
        title={title || "Player"}
        allow="autoplay; fullscreen; encrypted-media"
        allowFullScreen
        className="h-full w-full"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-presentation"
      />
    </div>
  );
}
