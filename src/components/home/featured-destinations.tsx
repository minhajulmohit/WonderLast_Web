"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import DestinationCard from "@/components/destinations/destination-card";
import DestinationCardSkeleton from "@/components/destinations/destination-card-skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { isTravelPackage } from "@/lib/travel-package";
import type { TravelPackage } from "@/types/travel-package";

export default function FeaturedDestinations() {
  const [destinations, setDestinations] = useState<TravelPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadFeaturedPackages() {
      try {
        const response = await fetch("http://localhost:8000/featured-package", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Could not load featured packages.");

        const data: unknown = await response.json();
        if (!Array.isArray(data) || !data.every(isTravelPackage)) {
          throw new Error("Featured packages returned an invalid response.");
        }

        if (isActive) setDestinations(data);
      } catch {
        if (isActive) setDestinations([]);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadFeaturedPackages();
    return () => {
      isActive = false;
    };
  }, []);

  function handleApi(api?: CarouselApi) {
    if (!api) return;
    setSlideCount(api.scrollSnapList().length);
    setSelectedIndex(api.selectedScrollSnap());
    api.on("select", () => setSelectedIndex(api.selectedScrollSnap()));
  }

  return (
    <section aria-labelledby="featured-destinations-title" className="bg-white px-5 py-14 sm:px-8 md:py-16">
      <Carousel
        className="mx-auto max-w-5xl"
        opts={{ align: "start", loop: true }}
        setApi={handleApi}
      >
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 id="featured-destinations-title" className="font-(family-name:--font-display) text-3xl font-medium leading-tight tracking-tight text-neutral-950 sm:text-5xl">
              Featured Destinations
            </h2>
            <p className="mt-1 text-xs text-neutral-500">Handpicked travel experiences for the adventure seekers</p>
          </div>
          <Link
            href="/all-destinations"
            className="inline-flex h-9 shrink-0 items-center gap-3 border border-cyan-300 px-4 text-[10px] font-medium text-cyan-700 transition-colors hover:bg-cyan-50"
          >
            ALL DESTINATIONS
            <ArrowRight aria-hidden="true" size={13} />
          </Link>
        </header>

        <CarouselContent className="-ml-4">
          {isLoading
            ? [0, 1].map((item) => (
                <CarouselItem key={item} className="pl-4 basis-full md:basis-1/2">
                  <DestinationCardSkeleton />
                </CarouselItem>
              ))
            : destinations.map((destination) => {
                const id = destination._id ?? destination.id ?? destination.destinationName;
                return (
                  <CarouselItem key={String(id)} className="pl-4 basis-full md:basis-1/2">
                    <DestinationCard destination={destination} />
                  </CarouselItem>
                );
              })}
        </CarouselContent>

        {!isLoading && destinations.length > 0 && (
          <footer className="mt-8 flex items-center justify-between">
            <p className="text-xs text-neutral-600">
              {Math.min(selectedIndex + 1, slideCount || 1)} / {slideCount || destinations.length}
            </p>
            <div className="flex gap-2">
              <CarouselPrevious className="static size-10 translate-y-0 rounded-full bg-transparent text-neutral-500" aria-label="Previous featured destination">
                <ArrowLeft aria-hidden="true" size={16} />
              </CarouselPrevious>
              <CarouselNext className="static size-10 translate-y-0 rounded-full bg-transparent text-neutral-500" aria-label="Next featured destination">
                <ArrowRight aria-hidden="true" size={16} />
              </CarouselNext>
            </div>
          </footer>
        )}
      </Carousel>
    </section>
  );
}
