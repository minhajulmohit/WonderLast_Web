import { Suspense } from "react";
import NavLogo from "./nav-logo";
import { NavLinksLeft, NavLinksRight } from "./navLinks";

const NavBar = () => {
  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 mx-4 flex h-10 max-w-400 items-center justify-between bg-white px-3 sm:absolute sm:left-[1%] sm:right-[1%] sm:top-3 sm:mx-auto sm:px-4"
    >
      <Suspense
        fallback={<div aria-hidden="true" className="hidden h-4 w-56 md:block" />}
      >
        <NavLinksLeft />
      </Suspense>
      <NavLogo />
      <Suspense fallback={<div aria-hidden="true" className="h-4 w-24" />}>
        <NavLinksRight />
      </Suspense>
    </nav>
  );
};

export default NavBar;
