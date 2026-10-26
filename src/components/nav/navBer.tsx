
import NavLogo from "./nav-logo";
import { NavLinksLeft, NavLinksRight } from "./navLinks";

const NavBer = () => {
  return (
    <nav
      aria-label="Main navigation"
      className="absolute left-4 right-4 top-5 z-20 mx-auto flex h-10 max-w-400 items-center justify-between bg-white px-3 sm:left-[1%] sm:right-[1%] sm:top-3 sm:px-4"
    >
      <NavLinksLeft />
      <NavLogo />
      <NavLinksRight />
    </nav>
  );
};

export default NavBer;
