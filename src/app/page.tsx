import Hero from "@/components/home/hero/hero";
import Testimonials from "@/components/home/testimonials";
import WhyChoose from "@/components/home/why-choose";
import Cta from "@/components/home/cta";
import FeaturedDestinations from "@/components/home/featured-destinations";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedDestinations />
      <WhyChoose />
      <Testimonials />
      <Cta />
    </main>
  );
}
