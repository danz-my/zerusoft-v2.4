export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-brut-sm">
      <div className="aspect-[2/3] animate-pulse bg-ink/10" />
      <div className="border-t-2 border-ink p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-ink/10" />
      </div>
    </div>
  );
}
