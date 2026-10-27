export default function DestinationCardSkeleton() {
  return (
    <article
      aria-hidden="true"
      className="min-w-0 animate-pulse rounded-sm"
    >
      <div className="relative aspect-video overflow-hidden bg-neutral-200">
        <div className="absolute right-2 top-2 h-6 w-16 rounded-sm bg-white/70" />
      </div>

      <div className="space-y-2 p-1">
        <div className="mt-1 h-3 w-20 rounded-sm bg-neutral-200" />

        <div className="flex items-center justify-between gap-3">
          <div className="h-4 w-2/5 rounded-sm bg-neutral-200" />
          <div className="h-3 w-1/4 rounded-sm bg-neutral-200" />
        </div>

        <div className="h-3 w-1/3 rounded-sm bg-neutral-200" />
        <div className="h-3 w-16 rounded-sm bg-cyan-100" />
      </div>
    </article>
  );
}
