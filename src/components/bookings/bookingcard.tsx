"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { getAuthToken } from "@/lib/auth-token";
import { serverApi } from "@/lib/server-url";

const BookingCard = ({
  destination,
}: {
  destination: {
    id: string | number;
    price: string | number;
    destinationName: string;
    category: string;
    departureDate: string;
    duration: string;
    country: string;
    image?: string;
    imageUrl?: string;
    description: string;
  };
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = authClient.useSession();
  const localToday = new Date();
  const today = new Date(
    localToday.getTime() - localToday.getTimezoneOffset() * 60_000,
  )
    .toISOString()
    .slice(0, 10);

  async function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const departureDate = formData.get("departureDate")?.toString() ?? "";
    if (!session?.user) {
      toast.add({
        title: "Sign in to book",
        description: "Please sign in before booking a trip.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await getAuthToken();
      const response = await fetch(serverApi("/booking"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ["Bearer", token].join(" "),
        },
        body: JSON.stringify({
          email: session.user.email,
          packageId: String(destination.id),
          destinationName: destination.destinationName,
          price: destination.price,
          category: destination.category,
          duration: destination.duration,
          country: destination.country,
          image: destination.image,
          imageUrl: destination.imageUrl,
          description: destination.description,
          departureDate,
          bookingDate: new Date(),
        }),
      });
      const responseBody = await response.text();
      let result: { error?: string; message?: string } = {};
      if (responseBody) {
        try {
          result = JSON.parse(responseBody) as typeof result;
        } catch {
          if (!response.ok) {
            throw new Error(responseBody || "Could not create your booking.");
          }
        }
      }

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Could not create your booking.",
        );
      }

      toast.add({
        title: "Booking saved",
        description: `Your trip to ${destination.destinationName} is booked for ${departureDate}.`,
        type: "success",
      });
      window.dispatchEvent(new Event("wanderlast:bookings-updated"));
    } catch (error) {
      toast.add({
        title: "Could not create booking",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className="border border-neutral-200 p-4 shadow-sm">
      <p className="text-[12px] text-neutral-500">Starting from</p>
      <p className="mt-0.5 text-3xl font-semibold text-cyan-700">
        ${Number(destination.price).toLocaleString()}
      </p>
      <p className="text-[12px] text-neutral-500">per person</p>

      <form onSubmit={handleBooking}>
        <label
          className="mt-4 block text-xs font-medium text-neutral-700"
          htmlFor={`booking-date-${destination.id}`}
        >
          Choose your departure date
        </label>
        <input
          className="mt-1 h-10 w-full border border-neutral-200 bg-slate-50 px-3 text-sm text-neutral-700 outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
          id={`booking-date-${destination.id}`}
          min={today}
          name="departureDate"
          required
          type="date"
        />

        <button
          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 bg-cyan-600 px-4 text-xl font-medium text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle
                aria-hidden="true"
                className="animate-spin"
                size={14}
              />
              Booking...
            </>
          ) : (
            <>
              Book Now
              <ArrowRight aria-hidden="true" size={14} />
            </>
          )}
        </button>
      </form>

      <ul className="mt-4 space-y-2 border-t border-neutral-100 pt-4 text-[13px] text-neutral-600">
        <li className="flex items-center gap-2">
          <Check aria-hidden="true" className="text-emerald-600" size={13} />
          Select your departure date
        </li>
        <li className="flex items-center gap-2">
          <Check aria-hidden="true" className="text-emerald-600" size={13} />
          {destination.duration} package
        </li>
        <li className="flex items-center gap-2">
          <Check aria-hidden="true" className="text-emerald-600" size={13} />
          {destination.country} destination
        </li>
      </ul>
    </aside>
  );
};

export default BookingCard;
