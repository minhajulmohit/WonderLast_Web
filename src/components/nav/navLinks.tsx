"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getAuthToken } from "@/lib/auth-token";
import { serverApi } from "@/lib/server-url";
import { toast } from "@/components/ui/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function isLinkActive(pathname: string, href: string): boolean {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

const NavLinksLeft = () => {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const email = session?.user?.email;
  const [bookingCountState, setBookingCountState] = useState({
    email: "",
    count: 0,
  });

  useEffect(() => {
    const currentEmail: string = email ?? "";
    if (!currentEmail) return;

    let isActive = true;
    async function loadBookingCount() {
      try {
        const token = await getAuthToken();
        const response = await fetch(
          serverApi(`/my-bookings/${encodeURIComponent(currentEmail)}`),
          {
            cache: "no-store",
            headers: { Authorization: ["Bearer", token].join(" ") },
          },
        );
        if (!response.ok) {
          throw new Error(`Booking server responded with ${response.status}.`);
        }

        const bookings: unknown = await response.json();
        if (!Array.isArray(bookings)) {
          throw new Error("Booking server returned an invalid response.");
        }

        if (isActive) {
          setBookingCountState({ email: currentEmail, count: bookings.length });
        }
      } catch (error) {
        if (isActive) {
          console.error("Could not load booking count:", error);
        }
      }
    }

    const handleBookingsUpdated = () => {
      void loadBookingCount();
    };

    void loadBookingCount();
    window.addEventListener("wanderlast:bookings-updated", handleBookingsUpdated);
    return () => {
      isActive = false;
      window.removeEventListener(
        "wanderlast:bookings-updated",
        handleBookingsUpdated,
      );
    };
  }, [email]);

  const bookingCount =
    email && bookingCountState.email === email ? bookingCountState.count : 0;
  const links = [
    { href: "/", label: "Home" },
    { href: "/all-destinations", label: "Destinations" },
    { href: "/mybookings", label: "My Bookings" },
    ...(session?.user?.role === "admin"
      ? [{ href: "/add-new-package", label: "Admin" }]
      : []),
  ];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Open navigation menu"
          className="inline-flex size-9 items-center justify-center text-neutral-800 outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-cyan-600 md:hidden"
        >
          <Menu aria-hidden="true" size={19} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-52 rounded-sm bg-white p-2 md:hidden"
        >
          {links.map(({ href, label }) => (
            <DropdownMenuItem
              aria-current={isLinkActive(pathname, href) ? "page" : undefined}
              className="cursor-pointer text-xs"
              key={href}
              render={<Link href={href} />}
            >
              <span>{label}</span>
              {href === "/mybookings" && (
                <span className="ml-auto inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-cyan-600 px-1 text-[10px] font-semibold text-white">
                  {bookingCount}
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ul className="hidden items-center gap-5 text-[12px] text-neutral-900 md:flex">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              aria-current={isLinkActive(pathname, href) ? "page" : undefined}
              className={
                isLinkActive(pathname, href)
                  ? "font-semibold text-cyan-600"
                  : "transition-colors hover:text-cyan-600"
              }
              href={href}
            >
              {label === "My Bookings" ? (
                <span className="relative inline-flex">
                  {label}
                  <span className="absolute -right-3 -top-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-cyan-600 px-1 text-[9px] font-semibold leading-none text-white">
                    {bookingCount}
                  </span>
                </span>
              ) : (
                label
              )}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

const NavLinksRight = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    const { error } = await authClient.signOut();
    if (error) {
      toast.add({
        title: "Could not sign out",
        description: error.message || "Please try again.",
        type: "error",
      });
      return;
    }

    toast.add({
      title: "Signed out",
      description: "You have been signed out successfully.",
      type: "success",
    });
    router.replace("/");
    router.refresh();
  }

  const user = session?.user;
  const initial = Array.from(user?.name?.trim() || "")[0]?.toUpperCase() || "?";

  return (
    <ul className="flex items-center gap-3 text-[12px] text-neutral-900 sm:gap-5">
      {user ? (
        <li>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Open account menu"
              className="rounded-full outline-none ring-cyan-600 focus-visible:ring-2"
            >
              <Avatar className="size-8 bg-cyan-600 text-white">
                {user.image && (
                  <AvatarImage
                    src={user.image}
                    alt={`${user.name}'s profile`}
                  />
                )}
                <AvatarFallback className="bg-cyan-600 text-xs font-medium text-white">
                  {initial}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-60 rounded-sm bg-white p-2"
            >
              <div className="flex items-center gap-3 px-2 py-2">
                <Avatar className="size-9 bg-cyan-600 text-white">
                  {user.image && (
                    <AvatarImage
                      src={user.image}
                      alt={`${user.name}'s profile`}
                    />
                  )}
                  <AvatarFallback className="bg-cyan-600 text-xs font-medium text-white">
                    {initial}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-neutral-900">
                    {user.name}
                  </p>
                  <p className="truncate text-[10px] text-neutral-500">
                    {user.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={<Link href="/profile" />}
                className="cursor-pointer text-xs"
                aria-current={
                  isLinkActive(pathname, "/profile") ? "page" : undefined
                }
              >
                <UserRound aria-hidden="true" size={14} />
                Go to Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => void handleSignOut()}
                className="cursor-pointer text-xs text-red-600"
              >
                <LogOut aria-hidden="true" size={14} />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      ) : (
        <>
          {!isPending && (
            <>
              <li>
                <Link
                  aria-current={
                    isLinkActive(pathname, "/signin") ? "page" : undefined
                  }
                  className={
                    isLinkActive(pathname, "/signin")
                      ? "font-semibold text-cyan-600"
                      : "transition-colors hover:text-cyan-600"
                  }
                  href="/signin"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  aria-current={
                    isLinkActive(pathname, "/signup") ? "page" : undefined
                  }
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
            </>
          )}
        </>
      )}
    </ul>
  );
};

export { NavLinksLeft, NavLinksRight };
