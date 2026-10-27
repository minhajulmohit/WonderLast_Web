export default function DestinationDetailsSkeleton() {
  return (
    <div aria-label="Loading destination details" aria-busy="true">
      <div className="h-5 w-36 animate-pulse rounded bg-neutral-200" />
      <div className="mt-4 aspect-[16/7] w-full animate-pulse rounded-sm bg-neutral-200" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="space-y-4">
          <div className="h-4 w-28 animate-pulse rounded bg-neutral-200" />
          <div className="h-9 w-2/3 animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-200" />
          <div className="mt-8 h-5 w-24 animate-pulse rounded bg-neutral-200" />
          <div className="h-20 animate-pulse rounded bg-neutral-100" />
          <div className="h-5 w-28 animate-pulse rounded bg-neutral-200" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-4 animate-pulse rounded bg-neutral-100" />
            <div className="h-4 animate-pulse rounded bg-neutral-100" />
            <div className="h-4 animate-pulse rounded bg-neutral-100" />
            <div className="h-4 animate-pulse rounded bg-neutral-100" />
          </div>
        </div>
        <div className="h-64 animate-pulse rounded-sm bg-neutral-100" />
      </div>
    </div>
  );
}
