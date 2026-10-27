"use client";

import { useEffect, useMemo, useState } from "react";
import type { TravelPackage } from "@/types/travel-package";
import DestinationCard from "@/components/destinations/destination-card";
import DestinationCardSkeleton from "@/components/destinations/destination-card-skeleton";

type SortOption = "featured" | "price-low" | "price-high" | "name";
type PriceRange = "all" | "under-500" | "500-1000" | "1000-2000" | "over-2000";

const priceRanges: { value: PriceRange; label: string }[] = [
  { value: "all", label: "All prices" },
  { value: "under-500", label: "Under $500" },
  { value: "500-1000", label: "$500 - $1,000" },
  { value: "1000-2000", label: "$1,000 - $2,000" },
  { value: "over-2000", label: "Over $2,000" },
];

function isTravelPackage(value: unknown): value is TravelPackage {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;
  return (
    typeof item.destinationName === "string" &&
    typeof item.country === "string" &&
    typeof item.category === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    typeof item.duration === "string" &&
    typeof item.departureDate === "string" &&
    typeof item.description === "string" &&
    (item.image === undefined || typeof item.image === "string") &&
    (item.imageUrl === undefined || typeof item.imageUrl === "string") &&
    (item.rating === undefined ||
      (typeof item.rating === "number" && Number.isFinite(item.rating)))
  );
}

function isInPriceRange(price: number, range: PriceRange): boolean {
  switch (range) {
    case "under-500":
      return price < 500;
    case "500-1000":
      return price >= 500 && price <= 1000;
    case "1000-2000":
      return price > 1000 && price <= 2000;
    case "over-2000":
      return price > 2000;
    default:
      return true;
  }
}

export default function AllDestinationsPage() {
  const [destinations, setDestinations] = useState<TravelPackage[]>([]);
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDestinations() {
      try {
        const response = await fetch("http://localhost:8000/all-package", {
          signal: controller.signal,
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(
            error || `Request failed with status ${response.status}`,
          );
        }

        const data: unknown = await response.json();
        const packages: unknown[] = Array.isArray(data) ? data : [data];
        const validPackages = packages.filter(isTravelPackage);
        if (validPackages.length !== packages.length) {
          throw new Error(
            "The server returned travel packages in an invalid format.",
          );
        }

        setDestinations(validPackages);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setErrorMessage(
          error instanceof Error
            ? `Could not load destinations: ${error.message}`
            : "Could not load destinations. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadDestinations();
    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () =>
      [...new Set(destinations.map((destination) => destination.category))].sort(
        (a, b) => a.localeCompare(b),
      ),
    [destinations],
  );

  const filteredDestinations = useMemo(() => {
    const filtered = destinations.filter((destination) => {
      const matchesCategory =
        category === "all" ||
        destination.category.toLocaleLowerCase() === category.toLocaleLowerCase();
      return (
        matchesCategory &&
        isInPriceRange(Number(destination.price), priceRange)
      );
    });

    switch (sortBy) {
      case "price-low":
        return filtered.sort((a, b) => Number(a.price) - Number(b.price));
      case "price-high":
        return filtered.sort((a, b) => Number(b.price) - Number(a.price));
      case "name":
        return filtered.sort((a, b) =>
          a.destinationName.localeCompare(b.destinationName),
        );
      default:
        return filtered;
    }
  }, [category, destinations, priceRange, sortBy]);

  return (
    <main className="min-h-screen bg-white px-5 py-12 text-neutral-950 sm:px-8 sm:py-16">
      <section className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="font-(family-name:--font-display) text-3xl tracking-tight sm:text-5xl">
            Explore All Destinations
          </h1>
          <p className="mt-1 text-[12px] text-neutral-500">
            Find your perfect travel experience from our curated collection
          </p>
        </header>

        <div className="grid grid-cols-3 border border-neutral-200">
          <label className="flex h-10 min-w-0 items-center gap-1 border-r border-neutral-200 px-2 text-[9px] uppercase tracking-wide text-neutral-500 sm:gap-2 sm:px-4 sm:text-[11px]">
            <span className="sr-only">Filter by category</span>
            <select
              aria-label="Filter by category"
              className="h-full min-w-0 w-full appearance-none bg-transparent outline-none"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option className="px-3 py-1" value="all">
                Category
              </option>
              {categories.map((option) => (
                <option className="px-3 py-1" key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span aria-hidden="true">⌄</span>
          </label>

          <label className="flex h-10 min-w-0 items-center gap-1 border-r border-neutral-200 px-2 text-[9px] uppercase tracking-wide text-neutral-500 sm:gap-2 sm:px-4 sm:text-[11px]">
            <span className="sr-only">Filter by price range</span>
            <select
              aria-label="Filter by price range"
              className="h-full min-w-0 w-full appearance-none bg-transparent outline-none"
              value={priceRange}
              onChange={(event) =>
                setPriceRange(event.target.value as PriceRange)
              }
            >
              {priceRanges.map((range) => (
                <option
                  className="px-3 py-1"
                  key={range.value}
                  value={range.value}
                >
                  {range.value === "all" ? "Price Range" : range.label}
                </option>
              ))}
            </select>
            <span aria-hidden="true">⌄</span>
          </label>

          <label className="flex h-10 min-w-0 items-center gap-1 px-2 text-[9px] uppercase tracking-wide text-neutral-500 sm:gap-2 sm:px-4 sm:text-[11px]">
            <span className="sr-only">Sort destinations</span>
            <select
              aria-label="Sort destinations"
              className="h-full min-w-0 w-full appearance-none bg-transparent outline-none"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as SortOption)
              }
            >
              <option className="px-3 py-1" value="featured">
                Sort by
              </option>
              <option className="px-3 py-1" value="price-low">
                Price: Low to High
              </option>
              <option className="px-3 py-1" value="price-high">
                Price: High to Low
              </option>
              <option className="px-3 py-1" value="name">
                Name: A to Z
              </option>
            </select>
            <span aria-hidden="true">⌄</span>
          </label>
        </div>

        <p aria-live="polite" className="mt-3 text-[11px] text-neutral-500">
          {isLoading ? (
            <span className="sr-only">Loading destinations...</span>
          ) : (
            `${filteredDestinations.length} destination${filteredDestinations.length === 1 ? "" : "s"} shown`
          )}
        </p>

        {errorMessage && (
          <p role="alert" className="mt-6 text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        {!isLoading && !errorMessage && filteredDestinations.length === 0 && (
          <p className="py-12 text-center text-sm text-neutral-500">
            No destinations match these filters.
          </p>
        )}

        <div className="mt-3 grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }, (_, index) => (
                <DestinationCardSkeleton key={index} />
              ))
            : filteredDestinations.map((destination, index) => {
                const key =
                  destination._id ??
                  destination.id ??
                  `${destination.destinationName}-${index}`;

                return (
                  <DestinationCard key={key} destination={destination} />
                );
              })}
        </div>
      </section>
    </main>
  );
}
