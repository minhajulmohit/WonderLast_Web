import { Button } from "../../ui/button";

const SearchBar = () => {
  return (
    <div className="grid w-full grid-cols-2 overflow-hidden bg-transparent md:grid-cols-[repeat(4,minmax(0,1fr))_128px]">
      <div className="flex h-15 flex-col justify-center border-b border-r border-white/40 bg-white/30 px-4 md:border-b-0">
        <p className="text-sm">Location</p>
        <p className="text-[10px]">Address, City Or Zip</p>
      </div>
      <div className="flex h-15 flex-col justify-center border-b border-white/40 bg-white/30 px-4 md:border-r md:border-b-0">
        <p className="text-sm">Date/Duration</p>
        <p className="text-[10px]">Anytime/3 Days</p>
      </div>
      <div className="flex h-15 flex-col justify-center border-r border-white/40 bg-white/30 px-4">
        <p className="text-sm">Budget</p>
        <p className="text-[10px]">$0-$3000</p>
      </div>
      <div className="flex h-15 flex-col justify-center bg-white/30 px-4">
        <p className="text-sm">People</p>
        <p className="text-[10px]">5-10</p>
      </div>
      <Button
        variant="default"
        className="col-span-2 h-15 rounded-none border-none bg-cyan-600 text-sm text-white hover:bg-cyan-700 md:col-span-1"
      >
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
