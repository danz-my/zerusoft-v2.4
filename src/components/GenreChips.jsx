export default function GenreChips({ genres, active, onSelect }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full border-2 border-ink px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide transition ${
          !active ? "bg-ink text-cream" : "bg-white hover:bg-mint/20"
        }`}
      >
        Semua
      </button>
      {genres.map((g) => (
        <button
          key={g.id}
          onClick={() => onSelect(g.id)}
          className={`rounded-full border-2 border-ink px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide transition ${
            active === g.id ? "bg-ink text-cream" : "bg-white hover:bg-mint/20"
          }`}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
