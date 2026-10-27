import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { TravelPackage } from "@/types/travel-package";
import { getTravelPackageImageUrl } from "@/lib/travel-package";

export default function DestinationCard({
  destination,
}: {
  destination: TravelPackage;
}) {
  const imageUrl = getTravelPackageImageUrl(destination);
  const destinationId = destination._id ?? destination.id;

  return (
    <article className="group min-w-0 rounded-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-linear-to-br from-cyan-100 via-sky-200 to-emerald-100">
        <div
          aria-label={destination.destinationName}
          role="img"
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out group-hover:scale-105"
          style={
            imageUrl
              ? { backgroundImage: `url(${JSON.stringify(imageUrl)})` }
              : undefined
          }
        />
        <span className="absolute right-2 top-2 bg-white/44 px-2 py-1 text-[12px] font-medium capitalize text-neutral-800 shadow-sm">
          {destination.category}
        </span>
      </div>

      <div className="p-1 transition-colors group-hover:bg-neutral-50">
        <div className="mt-1 flex items-center gap-1 text-[12px] text-neutral-500">
          <MapPin aria-hidden="true" size={11} />
          <span>{destination.country}</span>
        </div>

        <div className="mt-1 flex items-start justify-between gap-2">
          <h2 className="truncate text-m font-semibold text-neutral-900">
            {destination.destinationName}
          </h2>
          <p className="shrink-0 text-[12px] font-medium text-neutral-800">
            ${Number(destination.price).toLocaleString()}
            <span className="font-normal text-neutral-500">/Person</span>
          </p>
        </div>

        <p className="mt-1 text-[11px] text-neutral-500">
          {destination.duration}
        </p>

        <Link
          href={
            destinationId
              ? `/all-destinations/${encodeURIComponent(destinationId)}`
              : "/all-destinations"
          }
          className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-cyan-700 transition-colors hover:text-cyan-900"
        >
          BOOK NOW
          <ArrowUpRight aria-hidden="true" size={12} />
        </Link>
      </div>
    </article>
  );
}
