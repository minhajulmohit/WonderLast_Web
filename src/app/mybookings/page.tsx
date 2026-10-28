import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
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

async function MyBookingsContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  if (!user) {
    redirect("/signin?callbackURL=%2Fmybookings");
  }

  let bookings: MyBooking[] = [];
  let errorMessage = "";

  try {
    const token = await auth.api.getToken({ headers: await headers() });
    if (!token?.token) {
      throw new Error("Could not get an authentication token.");
    }

    const response = await fetch(
      `http://localhost:8000/my-bookings/${encodeURIComponent(user.email)}`,
      {
        cache: "no-store",
        headers: { Authorization: ["Bearer", token.token].join(" ") },
      },
    );
    if (!response.ok) {
      throw new Error(`Booking server responded with ${response.status}.`);
    }

    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Booking server returned an invalid response.");
    }

    bookings = (data as BookingResponse[])
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
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Could not load your bookings. Please try again.";
  }

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

        {errorMessage ? (
          <p
            className="border border-red-100 bg-red-50 p-4 text-sm text-red-700"
            role="alert"
          >
            Could not load bookings: {errorMessage}
          </p>
        ) : bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <MyBookingCard booking={booking} key={booking.id} />
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
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white px-5 pb-16 pt-12 text-neutral-950 sm:px-8 sm:pt-16">
          <section className="mx-auto max-w-6xl animate-pulse">
            <div className="h-12 w-64 rounded bg-neutral-100" />
            <div className="mt-2 h-4 w-80 rounded bg-neutral-100" />
            <div className="mt-6 space-y-3">
              <div className="h-40 border border-neutral-100 bg-neutral-50" />
              <div className="h-40 border border-neutral-100 bg-neutral-50" />
            </div>
          </section>
        </main>
      }
    >
      <MyBookingsContent />
    </Suspense>
  );
}
