"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getAuthToken } from "@/lib/auth-token";
import { serverApi } from "@/lib/server-url";
import MyBookingCard, {
  type MyBooking,
} from "@/components/bookings/my-booking-card";

type BookingResponse = Omit<MyBooking, "id"> & {
  _id?: string | { $oid?: string };
  id?: string;
};

function getBookingId(booking: BookingResponse): string {
  if (booking.id) return booking.id;
  if (typeof booking._id === "string") return booking._id;
  return booking._id?.$oid ?? "";
}

function MyBookingsPageContent() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    const email = session?.user?.email;
    if (!email) {
      router.replace("/signin?callbackURL=%2Fmybookings");
      return;
    }

    const currentEmail = email;
    let isActive = true;
    async function loadBookings() {
      try {
        const token = await getAuthToken();
        const response = await fetch(
          serverApi(`/my-bookings/${encodeURIComponent(currentEmail)}`),
          {
            cache: "no-store",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!response.ok) {
          throw new Error(`Booking server responded with ${response.status}.`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Booking server returned an invalid response.");
        }

        const loadedBookings = (data as BookingResponse[])
          .map((booking) => ({
            id: getBookingId(booking),
            destinationName: booking.destinationName,
            departureDate: booking.departureDate,
            price: Number(booking.price),
            status: booking.status || "pending",
            imageUrl: booking.imageUrl,
            image: booking.image,
          }))
          .filter(
            (booking) =>
              booking.id &&
              typeof booking.destinationName === "string" &&
              typeof booking.departureDate === "string" &&
              Number.isFinite(booking.price),
          );

        if (isActive) setBookings(loadedBookings);
      } catch (error) {
        if (isActive) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Could not load your bookings. Please try again.",
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadBookings();
    return () => {
      isActive = false;
    };
  }, [isPending, router, session?.user?.email]);

  return (
    <main className="min-h-screen bg-white px-5 pb-16 pt-12 text-neutral-950 sm:px-8 sm:pt-16">
      <section className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="font-(family-name:--font-display) text-4xl tracking-tight sm:text-5xl">
            My Bookings
          </h1>
          <p className="mt-1 text-xs text-neutral-500">
            Manage and view your upcoming travel plans
          </p>
        </header>

        {isLoading ? (
          <div className="space-y-3" aria-label="Loading bookings">
            <div className="h-40 animate-pulse border border-neutral-100 bg-neutral-50" />
            <div className="h-40 animate-pulse border border-neutral-100 bg-neutral-50" />
          </div>
        ) : errorMessage ? (
          <p
            className="border border-red-100 bg-red-50 p-4 text-sm text-red-700"
            role="alert"
          >
            Could not load bookings: {errorMessage}
          </p>
        ) : bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <MyBookingCard
                booking={booking}
                key={booking.id}
                onCancelled={(bookingId) =>
                  setBookings((current) =>
                    current.filter((item) => item.id !== bookingId),
                  )
                }
              />
            ))}
          </div>
        ) : (
          <p className="border border-neutral-200 p-6 text-sm text-neutral-500">
            You do not have any bookings yet.
          </p>
        )}
      </section>
    </main>
  );
}

export default function MyBookingsPage() {
  return <MyBookingsPageContent />;
}
