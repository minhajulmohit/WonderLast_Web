import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Cta() {
  return (
    <section
      aria-labelledby="cta-title"
      className="relative flex min-h-70 items-center justify-center overflow-hidden px-5 py-12 text-center text-white sm:min-h-75"
    >
      <Image
        src="/assets/CTA.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/45" />

      <div className="relative z-10">
        <h2
          id="cta-title"
          className="font-(family-name:--font-display) text-4xl font-medium leading-tight tracking-tight sm:text-5xl"
        >
          Ready To Start Your Journey?
        </h2>
        <p className="mt-2 text-sm text-white/90">
          Join thousands of travelers who have discovered the world with us
        </p>
        <Link
          href="/destinations"
          className="group/button mt-7 inline-flex h-10 items-center gap-4 bg-white px-5 text-[11px] font-medium text-neutral-900 transition-colors hover:bg-neutral-100"
        >
          BOOK YOUR TRIP TODAY
          <ArrowRight
            className="transition-transform duration-200 ease-out group-hover/button:translate-x-1"
            size={15}
          />
        </Link>
      </div>
    </section>
  );
}
