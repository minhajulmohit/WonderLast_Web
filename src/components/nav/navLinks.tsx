"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
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
            isLinkActive(pathname, "/mybookings") ? "page" : undefined
          }
          className={
            isLinkActive(pathname, "/mybookings")
              ? "font-semibold text-cyan-600"
              : "transition-colors hover:text-cyan-600"
          }
          href="/mybookings"
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
