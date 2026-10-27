import Link from "next/link";
import { UserRound } from "lucide-react";

const NavLinksLeft = () => {
  return (
    <ul className="hidden items-center gap-5 text-[12px] text-neutral-900 md:flex">
      <li>
        <Link className="text-cyan-600" href="/">
          Home
        </Link>
      </li>
      <li>
        <Link
          className="transition-colors hover:text-cyan-600"
          href="/all-destinations"
        >
          Destinations
        </Link>
      </li>
      <li>
        <Link
          className="transition-colors hover:text-cyan-600"
          href="/bookings"
        >
          My Bookings
        </Link>
      </li>
      <li>
        <Link
          className="transition-colors hover:text-cyan-600"
          href="/add-new-package"
        >
          Admin
        </Link>
      </li>
    </ul>
  );
};

const NavLinksRight = () => {
  return (
    <ul className="flex items-center gap-3 text-[12px] text-neutral-900 sm:gap-5">
      <li className="hidden sm:block">
        <Link
          className="flex items-center gap-1 transition-colors hover:text-cyan-600"
          href="/profile"
        >
          <UserRound size={13} />
          Profile
        </Link>
      </li>
      <li>
        <Link className="transition-colors hover:text-cyan-600" href="/login">
          Login
        </Link>
      </li>
      <li>
        <Link className="transition-colors hover:text-cyan-600" href="/signup">
          Sign Up
        </Link>
      </li>
    </ul>
  );
};

export { NavLinksLeft, NavLinksRight };
