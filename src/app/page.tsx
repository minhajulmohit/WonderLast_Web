import Hero from "@/components/home/hero/hero";
import Testimonials from "@/components/home/testimonials";
import WhyChoose from "@/components/home/why-choose";
import Cta from "@/components/home/cta";

export default function Home() {
  return (
    <main>
      <Hero />
      <WhyChoose />
      <Testimonials />
      <Cta />
    </main>
  );
}
