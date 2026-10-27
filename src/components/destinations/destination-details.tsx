"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  MapPin,
} from "lucide-react";
import type { TravelPackage } from "@/types/travel-package";
import {
  getTravelPackageImageUrl,
  isTravelPackage,
} from "@/lib/travel-package";
import DestinationDetailsSkeleton from "@/components/destinations/destination-details-skeleton";
import EditDestinationDialog from "@/components/destinations/edit-destination-dialog";
import DeleteDestinationDialog from "@/components/destinations/delete-destination-dialog";
import { toast } from "@/components/ui/toast";

function formatDepartureDate(date: string): string {
  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(parsedDate);
}

export default function DestinationDetails({ id }: { id: string }) {
  const [destination, setDestination] = useState<TravelPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadDestination() {
      try {
        const response = await fetch(
          `http://localhost:8000/all-package/${encodeURIComponent(id)}`,
        );

        if (!response.ok) {
          const error = await response.text();
          throw new Error(
            error || `Request failed with status ${response.status}`,
          );
        }

        const data: unknown = await response.json();
        if (!isTravelPackage(data)) {
          throw new Error(
            "The server returned destination details in an invalid format.",
          );
        }

        if (isActive) setDestination(data);
      } catch (error) {
        if (isActive) {
          const description =
            error instanceof Error
              ? error.message
              : "Please try again.";
          setErrorMessage(description);
          toast.add({
            title: "Could not load destination",
            description,
            type: "error",
          });
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadDestination();
    return () => {
      isActive = false;
    };
  }, [id]);

  const backLink = (
    <Link
      href="/all-destinations"
      className="inline-flex items-center gap-2 text-xs text-neutral-500 transition-colors hover:text-cyan-700"
    >
      <ArrowLeft aria-hidden="true" size={14} />
      Back to Destinations
    </Link>
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white px-5 pb-16 pt-16 text-neutral-950 sm:px-8">
        <section className="mx-auto max-w-6xl">
          {backLink}
          <div className="mt-4">
            <DestinationDetailsSkeleton />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage || !destination) {
    return (
      <main className="min-h-[65vh] bg-white px-5 pb-16 pt-16 text-neutral-950 sm:px-8">
        <section className="mx-auto max-w-6xl">
          {backLink}
          <div
            className="mt-8 border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-700"
          >
            This destination could not be loaded. Use “Back to Destinations” to
            return to the package list.
          </div>
        </section>
      </main>
    );
  }

  const imageUrl = getTravelPackageImageUrl(destination);
  const highlights = [
    { label: "Destination", value: destination.destinationName },
    { label: "Country", value: destination.country },
    { label: "Category", value: destination.category },
    { label: "Duration", value: destination.duration },
  ];

  return (
    <main className="min-h-screen bg-white px-5 pb-16 pt-16 text-neutral-950 sm:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          {backLink}
          <div className="flex items-center gap-2">
            <EditDestinationDialog
              destination={destination}
              destinationId={id}
              onSaved={setDestination}
            />
            <DeleteDestinationDialog
              destinationId={id}
              destinationName={destination.destinationName}
            />
          </div>
        </div>

        <div
          role={imageUrl ? "img" : undefined}
          aria-label={imageUrl ? destination.destinationName : undefined}
          className="mt-4 aspect-16/7 overflow-hidden bg-linear-to-br from-cyan-100 via-sky-200 to-emerald-100 bg-cover bg-center"
          style={
            imageUrl
              ? { backgroundImage: `url(${JSON.stringify(imageUrl)})` }
              : undefined
          }
        />

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_290px] lg:gap-12">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <MapPin aria-hidden="true" size={13} />
              <span>{destination.country}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{destination.category}</span>
            </div>

            <h1 className="mt-1 font-(family-name:--font-display) text-3xl tracking-tight sm:text-4xl">
              {destination.destinationName}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-600">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays aria-hidden="true" size={13} />
                {destination.duration}
              </span>
              {destination.rating !== undefined && (
                <span className="font-medium text-neutral-800">
                  ★ {destination.rating.toFixed(1)}
                </span>
              )}
            </div>

            <section aria-labelledby="overview-title" className="mt-6">
              <h2
                id="overview-title"
                className="font-(family-name:--font-display) text-xl"
              >
                Overview
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">
                {destination.description}
              </p>
            </section>

            <section aria-labelledby="highlights-title" className="mt-6">
              <h2
                id="highlights-title"
                className="font-(family-name:--font-display) text-xl"
              >
                Highlights
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Explore this {destination.category.toLowerCase()} escape in{" "}
                {destination.country}, with a curated {destination.duration}{" "}
                travel experience.
              </p>
              <ul className="mt-4 grid gap-3 text-xs text-neutral-700 sm:grid-cols-2">
                {highlights.map((highlight) => (
                  <li
                    className="flex items-center gap-2"
                    key={highlight.label}
                  >
                    <Check
                      aria-hidden="true"
                      className="shrink-0 text-emerald-600"
                      size={14}
                    />
                    <span>
                      <span className="font-medium">{highlight.label}:</span>{" "}
                      {highlight.value}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="border border-neutral-200 p-4 shadow-sm">
            <p className="text-[10px] text-neutral-500">Starting from</p>
            <p className="mt-0.5 text-2xl font-semibold text-cyan-700">
              ${Number(destination.price).toLocaleString()}
            </p>
            <p className="text-[10px] text-neutral-500">per person</p>

            <div className="mt-4 flex items-center gap-2 bg-slate-50 px-3 py-2.5 text-xs text-neutral-700">
              <CalendarDays
                aria-hidden="true"
                className="text-neutral-500"
                size={14}
              />
              {formatDepartureDate(destination.departureDate)}
            </div>

            <Link
              href={`/bookings?packageId=${encodeURIComponent(id)}`}
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 bg-cyan-600 px-4 text-xs font-medium text-white transition-colors hover:bg-cyan-700"
            >
              Book Now
              <ArrowRight aria-hidden="true" size={14} />
            </Link>

            <ul className="mt-4 space-y-2 border-t border-neutral-100 pt-4 text-[11px] text-neutral-600">
              <li className="flex items-center gap-2">
                <Check aria-hidden="true" className="text-emerald-600" size={13} />
                Departure date included
              </li>
              <li className="flex items-center gap-2">
                <Check aria-hidden="true" className="text-emerald-600" size={13} />
                {destination.duration} package
              </li>
              <li className="flex items-center gap-2">
                <Check aria-hidden="true" className="text-emerald-600" size={13} />
                {destination.country} destination
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
