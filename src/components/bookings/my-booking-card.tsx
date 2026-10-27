"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Eye, LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/toast";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type MyBooking = {
  id: string;
  destinationName: string;
  departureDate: string;
  price: number;
  status: string;
  imageUrl?: string;
  image?: string;
};

function formatDepartureDate(value: string): string {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function isSafeImageUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export default function MyBookingCard({ booking }: { booking: MyBooking }) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const isConfirmed = booking.status.toLowerCase() === "confirmed";
  const image = isSafeImageUrl(booking.imageUrl)
    ? booking.imageUrl
    : isSafeImageUrl(booking.image)
      ? booking.image
      : undefined;

  async function handleCancelBooking() {
    if (isCancelling) return;
    setIsCancelling(true);

    try {
      const response = await fetch(
        `http://localhost:8000/my-bookings/${encodeURIComponent(booking.id)}`,
        { method: "DELETE" },
      );
      const result = (await response.json()) as {
        error?: string;
        deletedCount?: number;
      };

      if (!response.ok) {
        throw new Error(result.error || "Could not cancel this booking.");
      }
      if (result.deletedCount !== 1) {
        throw new Error("This booking was not found or was already cancelled.");
      }

      setIsConfirmOpen(false);
      toast.add({
        title: "Booking cancelled",
        description: `${booking.destinationName} booking was cancelled.`,
        type: "success",
      });
      router.refresh();
    } catch (error) {
      toast.add({
        title: "Could not cancel booking",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <AlertDialog
      open={isConfirmOpen}
      onOpenChange={(open) => {
        if (!isCancelling) setIsConfirmOpen(open);
      }}
    >
      <article className="grid gap-4 border border-neutral-200 p-3 sm:grid-cols-[230px_minmax(0,1fr)] sm:items-center sm:p-4">
        {image ? (
          <div
            aria-label={booking.destinationName}
            className="h-40 bg-cover bg-center sm:h-32"
            role="img"
            style={{ backgroundImage: `url("${image}")` }}
          />
        ) : (
          <div
            aria-label={`${booking.destinationName} image unavailable`}
            className="h-40 bg-slate-100 sm:h-32"
            role="img"
          />
        )}

        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] font-medium ${
                isConfirmed
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-orange-50 text-orange-700"
              }`}
            >
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-current"
              />
              {isConfirmed ? "Confirmed" : "Pending"}
            </span>
            <h2 className="mt-1 truncate font-(family-name:--font-display) text-3xl leading-tight">
              {booking.destinationName}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-[12px] text-neutral-500">
              <CalendarDays aria-hidden="true" size={12} />
              Departure: {formatDepartureDate(booking.departureDate)}
            </p>
            <p className="mt-1 text-[12px] text-neutral-500">
              Booking ID: {booking.id}
            </p>
            <p className="mt-1 text-2xl font-semibold text-cyan-600">
              ${Number(booking.price).toLocaleString("en-US")}
            </p>
          </div>

          <div className="flex shrink-0 justify-end gap-2">
            <button
              onClick={() => setIsConfirmOpen(true)}
              className="inline-flex h-8 items-center gap-1.5 border border-red-300 px-3 text-[12px] text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isCancelling}
              type="button"
            >
              {isCancelling ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="animate-spin"
                  size={12}
                />
              ) : (
                <Trash2 aria-hidden="true" size={12} />
              )}
              {isCancelling ? "Cancelling..." : "Cancel"}
            </button>
            <button
              className="inline-flex h-8 items-center gap-1.5 bg-cyan-600 px-3 text-[12px] text-white transition-colors hover:bg-cyan-700"
              type="button"
            >
              <Eye aria-hidden="true" size={12} />
              View
            </button>
          </div>
        </div>
      </article>
      <AlertDialogContent className="rounded-none">
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel your booking for{" "}
            {booking.destinationName}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isCancelling}>
            Keep booking
          </AlertDialogCancel>
          <button
            className="inline-flex h-8 items-center justify-center gap-1.5 bg-red-600 px-3  font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isCancelling}
            onClick={() => void handleCancelBooking()}
            type="button"
          >
            {isCancelling ? (
              <LoaderCircle
                aria-hidden="true"
                className="animate-spin"
                size={14}
              />
            ) : (
              <Trash2 aria-hidden="true" size={14} />
            )}
            {isCancelling ? "Cancelling..." : "Yes, cancel booking"}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
