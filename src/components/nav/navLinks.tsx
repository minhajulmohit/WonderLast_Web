"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound } from "lucide-react";

function isLinkActive(pathname: string, href: string): boolean {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

const NavLinksLeft = () => {
  const pathname = usePathname();

  return (
    <ul className="hidden items-center gap-5 text-[12px] text-neutral-900 md:flex">
      <li>
        <Link
          aria-current={isLinkActive(pathname, "/") ? "page" : undefined}
          className={
            isLinkActive(pathname, "/")
              ? "font-semibold text-cyan-600"
              : "transition-colors hover:text-cyan-600"
          }
          href="/"
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          aria-current={
            isLinkActive(pathname, "/all-destinations") ? "page" : undefined
          }
          className={
            isLinkActive(pathname, "/all-destinations")
              ? "font-semibold text-cyan-600"
              : "transition-colors hover:text-cyan-600"
          }
          href="/all-destinations"
        >
          Destinations
        </Link>
      </li>
      <li>
        <Link
          aria-current={
            isLinkActive(pathname, "/bookings") ? "page" : undefined
          }
          className={
            isLinkActive(pathname, "/bookings")
              ? "font-semibold text-cyan-600"
              : "transition-colors hover:text-cyan-600"
          }
          href="/bookings"
        >
          My Bookings
        </Link>
      </li>
      <li>
        <Link
          aria-current={
            isLinkActive(pathname, "/add-new-package") ? "page" : undefined
          }
          className={
            isLinkActive(pathname, "/add-new-package")
              ? "font-semibold text-cyan-600"
              : "transition-colors hover:text-cyan-600"
          }
          href="/add-new-package"
        >
          Admin
        </Link>
      </li>
    </ul>
  );
};

const NavLinksRight = () => {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-3 text-[12px] text-neutral-900 sm:gap-5">
      <li className="hidden sm:block">
        <Link
          aria-current={isLinkActive(pathname, "/profile") ? "page" : undefined}
          className={`flex items-center gap-1 transition-colors hover:text-cyan-600 ${
            isLinkActive(pathname, "/profile")
              ? "font-semibold text-cyan-600"
              : ""
          }`}
          href="/profile"
        >
          <UserRound size={13} />
          Profile
        </Link>
      </li>
      <li>
        <Link
          aria-current={isLinkActive(pathname, "/login") ? "page" : undefined}
          className={
            isLinkActive(pathname, "/login")
              ? "font-semibold text-cyan-600"
              : "transition-colors hover:text-cyan-600"
          }
          href="/login"
        >
          Login
        </Link>
      </li>
      <li>
        <Link
          aria-current={isLinkActive(pathname, "/signup") ? "page" : undefined}
          className={
            isLinkActive(pathname, "/signup")
              ? "font-semibold text-cyan-600"
              : "transition-colors hover:text-cyan-600"
          }
          href="/signup"
        >
          Sign Up
        </Link>
      </li>
    </ul>
  );
};

export { NavLinksLeft, NavLinksRight };
