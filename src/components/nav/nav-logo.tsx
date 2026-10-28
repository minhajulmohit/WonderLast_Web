import Link from "next/link";

const NavLogo = () => {
  return (
    <Link
      href="/"
      aria-label="Wanderlast home"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <span
        aria-hidden="true"
        className="inline-flex size-8 items-center justify-center rounded-full border border-cyan-600 font-(family-name:--font-display) text-2xl font-semibold leading-none text-cyan-700 sm:size-9"
      >
        W
      </span>
    </Link>
  );
};

export default NavLogo;
