import Image from "next/image";
import Link from "next/link";

const NavLogo = () => {
  return (
    <Link
      href="/"
      aria-label="Wanderlast home"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <Image
        src="/assets/Wanderlast.png"
        alt="Wanderlast"
        width={135}
        height={20}
        priority
        className="h-auto w-26.25 sm:w-33.75"
      />
    </Link>
  );
};

export default NavLogo;
