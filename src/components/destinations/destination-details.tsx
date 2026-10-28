"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Check, MapPin } from "lucide-react";
import type { TravelPackage } from "@/types/travel-package";
import {
  getTravelPackageImageUrl,
  isTravelPackage,
} from "@/lib/travel-package";
import DestinationDetailsSkeleton from "@/components/destinations/destination-details-skeleton";
import EditDestinationDialog from "@/components/destinations/edit-destination-dialog";
import DeleteDestinationDialog from "@/components/destinations/delete-destination-dialog";
import BookingCard from "../bookings/bookingcard";
import CachedRemoteImage from "@/components/ui/cached-remote-image";
import { getAuthToken } from "@/lib/auth-token";
import { authClient } from "@/lib/auth-client";

export default function DestinationDetails({ id }: { id: string }) {
  const [destination, setDestination] = useState<TravelPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    let isActive = true;

    async function loadDestination() {
      try {
        const token = await getAuthToken();
        const response = await fetch(
          `http://localhost:8000/all-package/${encodeURIComponent(id)}`,
          { headers: { Authorization: ["Bearer", token].join(" ") } },
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
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Could not load destination details. Please try again.",
          );
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
            role="alert"
            className="mt-8 border border-red-100 bg-red-50 p-5 text-sm text-red-700"
          >
            Could not load this destination
            {errorMessage ? `: ${errorMessage}` : "."}
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
          {isAdmin && (
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
          )}
        </div>

        <div className="relative mt-4 aspect-16/7 overflow-hidden bg-linear-to-br from-cyan-100 via-sky-200 to-emerald-100">
          <CachedRemoteImage
            alt={destination.destinationName}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 66vw"
            src={imageUrl}
          />
        </div>

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
                  <li className="flex items-center gap-2" key={highlight.label}>
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

          <BookingCard
            destination={{ ...destination, id: destination.id ?? id }}
          />
        </div>
      </section>
    </main>
  );
}
