"use client";

import { useEffect } from "react";
import { CalendarDays, Compass, MapPin, Plane, Wallet } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileEditDialog from "@/components/profile/profile-edit-dialog";

function formatMemberSince(value: Date | string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function ProfilePage() {
  const { data: session, isPending, error, refetch } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (error) {
      toast.add({
        title: "Could not load profile",
        description: error.message || "Please sign in and try again.",
        type: "error",
      });
    }
  }, [error]);

  if (isPending) {
    return (
      <main className="min-h-[65vh] bg-white px-5 pb-16 pt-16 sm:px-8">
        <section className="mx-auto max-w-6xl animate-pulse">
          <div className="h-10 w-48 rounded bg-neutral-100" />
          <div className="mt-8 grid gap-5 md:grid-cols-[230px_minmax(0,1fr)]">
            <div className="h-64 rounded-sm bg-neutral-100" />
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <div className="h-20 rounded-sm bg-neutral-100" key={index} />
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-white px-5 py-16">
        <div className="text-center">
          <h1 className="font-(family-name:--font-display) text-4xl">
            Sign in to view your profile
          </h1>
          <a
            className="mt-4 inline-flex h-9 items-center bg-cyan-600 px-5 text-xs font-medium text-white hover:bg-cyan-700"
            href="/signin"
          >
            Sign In
          </a>
        </div>
      </main>
    );
  }

  const initial = Array.from(user.name.trim())[0]?.toUpperCase() || "?";
  const profileUser = {
    name: user.name,
    email: user.email,
    image: user.image,
    nationality: user.nationality,
    location: user.location,
    phone: user.phone,
  };
  const stats = [
    {
      label: "Total Bookings",
      value: "0",
      icon: Plane,
      color: "bg-sky-50 text-sky-600",
    },
    {
      label: "Countries Visited",
      value: "0",
      icon: Compass,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Upcoming Trips",
      value: "0",
      icon: CalendarDays,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Total Spent",
      value: "$0",
      icon: Wallet,
      color: "bg-fuchsia-50 text-fuchsia-600",
    },
  ];

  return (
    <main className="min-h-screen bg-white px-5 pb-16 pt-16 text-neutral-950 sm:px-8">
      <section className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="font-(family-name:--font-display) text-3xl tracking-tight sm:text-5xl">
            My Profile
          </h1>
          <p className="mt-1 text-s text-neutral-500">
            Manage your account settings and travel preferences
          </p>
        </header>

        <div className="grid items-start gap-5 md:grid-cols-[230px_minmax(0,1fr)]">
          <section className="border border-neutral-200 p-4 shadow-sm">
            <div className="flex flex-col items-center border-b border-neutral-100 pb-4 text-center">
              <Avatar className="size-20 bg-cyan-100 text-cyan-800">
                {user.image && (
                  <AvatarImage
                    src={user.image}
                    alt={`${user.name}'s profile`}
                  />
                )}
                <AvatarFallback className="bg-cyan-100 text-4xl font-medium text-cyan-800">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-2 text-3xl font-semibold">{user.name}</h2>
              <p className="mt-1 max-w-full truncate text-[14px] text-neutral-500">
                {user.email}
              </p>
              {user.location && (
                <p className="mt-1 inline-flex items-center gap-1 text-[12px] text-neutral-500">
                  <MapPin aria-hidden="true" size={11} />
                  {user.location}
                </p>
              )}
            </div>

            <dl className="space-y-2 py-3 text-[12px]">
              <div className="flex items-start justify-between gap-2">
                <dt className="text-neutral-500">Member since</dt>
                <dd className="text-right font-[12px]">
                  {formatMemberSince(user.createdAt)}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-2">
                <dt className="text-neutral-500">Nationality</dt>
                <dd className="text-right font-[12px]">
                  {user.nationality || "Not added yet"}
                </dd>
              </div>
              {user.phone && (
                <div className="flex items-start justify-between gap-2">
                  <dt className="text-neutral-500">Phone</dt>
                  <dd className="text-right font-[12px]">{user.phone}</dd>
                </div>
              )}
            </dl>

            <ProfileEditDialog user={profileUser} onUpdated={() => refetch()} />
          </section>

          <section aria-labelledby="travel-statistics-title">
            <h2
              id="travel-statistics-title"
              className="mb-2 font-(family-name:--font-display) text-2xl"
            >
              Travel Statistics
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {stats.map(({ label, value, icon: Icon, color }) => (
                <article
                  className="flex min-h-17 items-center justify-between border border-neutral-100 px-3 py-2.5"
                  key={label}
                >
                  <div>
                    <h3 className="text-[14px] text-neutral-500">{label}</h3>
                    <p className="mt-1 text-xl font-semibold">{value}</p>
                  </div>
                  <span
                    className={`flex size-8 items-center justify-center rounded-full ${color}`}
                  >
                    <Icon aria-hidden="true" size={15} />
                  </span>
                </article>
              ))}
            </div>
            <p className="mt-2 text-[14px] text-neutral-400">
              Travel statistics will update as booking history becomes
              available.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
