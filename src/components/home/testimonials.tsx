"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote:
      '"The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable."',
    name: "Michael Chen",
    location: "Singapore",
    image: "/assets/person2.png",
  },
  {
    quote:
      '"Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!"',
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "/assets/person1.png",
  },
  {
    quote:
      '"The Bali Trip Was Absolutely Magical! The local experiences and thoughtful planning made every day special. I cannot wait to travel with Wanderlust again."',
    name: "Michael Chen",
    location: "Singapore",
    image: "/assets/person2.png",
  },
  {
    quote:
      '"The Swiss Alps were even more beautiful than I imagined. Our guide was wonderful, and the whole adventure was seamless from start to finish."',
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "/assets/person1.png",
  },
];

export default function Testimonials() {
  return (
    <section
      aria-labelledby="testimonials-title"
      className="bg-white px-5 py-14 sm:px-8 md:py-16"
    >
      <div className="mx-auto max-w-5xl">
        <Carousel
          opts={{ align: "start", loop: true }}
          aria-label="Traveler testimonials"
        >
          <header className="mb-7 flex items-center justify-between gap-4">
            <div>
              <h2
                id="testimonials-title"
                className="font-(family-name:--font-display) text-3xl font-medium leading-tight tracking-tight text-neutral-950 sm:text-5xl"
              >
                What Travelers Say
              </h2>
              <p className="mt-1 text-xs text-neutral-500">
                Real experiences from our happy travelers
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <CarouselPrevious className="static my-0 size-10 translate-y-0 rounded-full border-neutral-300 bg-transparent text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900" />
              <CarouselNext className="static my-0 size-10 translate-y-0 rounded-full border-neutral-300 bg-transparent text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900" />
            </div>
          </header>

          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={`${testimonial.name}-${testimonial.quote}`}
                className="basis-full pl-4 md:basis-1/2"
              >
                <article className="flex h-57.5 items-stretch gap-3 border border-neutral-200 p-3 sm:gap-4 sm:p-4">
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <p className="font-(family-name:--font-display) text-base leading-[1.05] text-neutral-900 sm:text-lg">
                      {testimonial.quote}
                    </p>
                    <div>
                      <p className="text-xs text-cyan-600">
                        — {testimonial.name}
                      </p>
                      <p className="mt-0.5 pl-4 text-[10px] text-neutral-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <Image
                    src={testimonial.image}
                    alt={`${testimonial.name}, traveler`}
                    width={280}
                    height={340}
                    className="h-full w-[36%] shrink-0 object-cover"
                  />
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
