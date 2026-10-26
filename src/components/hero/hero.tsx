import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import SearchBar from "./search-bar";

const Hero = () => {
  return (
    <div
      className="flex h-screen flex-col justify-between bg-cover bg-center pt-45 text-white"
      style={{ backgroundImage: "url('/assets/Banner.png')" }}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <h1 className="font-(family-name:--font-display) text-5xl font-semibold tracking-tight md:text-7xl">
          Discover Your
        </h1>
        <h1 className="font-(family-name:--font-display) text-5xl font-semibold tracking-tight md:text-7xl">
          Next Adventure
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-5">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            variant="default"
            className="h-9 rounded-none bg-cyan-500 px-5 text-xs text-white hover:bg-cyan-600"
          >
            EXPLORE NOW
            <ArrowRight className="transition-transform duration-200 ease-out group-hover/button:translate-x-1" />
          </Button>
          <Button
            variant="outline"
            className="h-9 rounded-none border-white/30 bg-white/30 px-5 text-xs text-white hover:bg-white/40 hover:text-white"
          >
            VIEW DESTINATION
          </Button>
        </div>
      </div>

      <SearchBar />
    </div>
  );
};

export default Hero;
