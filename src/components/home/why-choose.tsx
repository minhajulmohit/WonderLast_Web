import { Headset, Map, ShieldCheck } from "lucide-react";

const benefits = [
  {
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
    icon: ShieldCheck,
  },
  {
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
    icon: Map,
  },
  {
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
    icon: Headset,
  },
];

export default function WhyChoose() {
  return (
    <section
      aria-labelledby="why-choose-title"
      className="bg-[#eefbfe] my-20 px-5 py-14 sm:px-8 md:py-16"
    >
      <div className="mx-auto max-w-5xl">
        <header className="text-center">
          <h2
            id="why-choose-title"
            className="font-(family-name:--font-display) text-3xl font-medium leading-tight tracking-tight text-neutral-950 sm:text-5xl"
          >
            Why Choose Wanderlast
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Your trusted partner for exceptional travel experiences
          </p>
        </header>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {benefits.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="min-h-31.25 border border-neutral-100 bg-white px-5 py-5"
            >
              <Icon
                aria-hidden="true"
                className="mb-3 size-10 text-cyan-600"
                strokeWidth={2}
              />
              <h3 className="font-(family-name:--font-display) text-2xl leading-5 text-neutral-900">
                {title}
              </h3>
              <p className="mt-1.5 text-[12px] leading-[1.45] text-neutral-500">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
