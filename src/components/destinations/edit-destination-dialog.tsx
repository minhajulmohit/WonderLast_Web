"use client";

import { useState, type FormEvent } from "react";
import { Pencil, Save, Trash2, X } from "lucide-react";
import type { TravelPackage } from "@/types/travel-package";
import { getTravelPackageImageUrl } from "@/lib/travel-package";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

const categories = [
  "Adventure",
  "Beach",
  "City",
  "Cruise",
  "Cultural",
  "Mountain",
];

const inputClassName =
  "mt-1 h-9 w-full border-0 bg-slate-100 px-3 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:ring-1 focus:ring-cyan-500";
const labelClassName = "block text-[11px] font-medium text-neutral-900";

export default function EditDestinationDialog({
  destination,
  destinationId,
  onSaved,
}: {
  destination: TravelPackage;
  destinationId: string;
  onSaved: (destination: TravelPackage) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const updatedDestination: TravelPackage = {
      ...destination,
      destinationName: formData.get("destinationName")?.toString().trim() ?? "",
      country: formData.get("country")?.toString().trim() ?? "",
      category: formData.get("category")?.toString() ?? "",
      price: Number(formData.get("price")),
      duration: formData.get("duration")?.toString().trim() ?? "",
      departureDate: formData.get("departureDate")?.toString() ?? "",
      image: undefined,
      imageUrl: formData.get("imageUrl")?.toString().trim() ?? "",
      description: formData.get("description")?.toString().trim() ?? "",
    };

    try {
      const response = await fetch(
        `http://localhost:8000/all-package/${encodeURIComponent(destinationId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            destinationName: updatedDestination.destinationName,
            country: updatedDestination.country,
            category: updatedDestination.category,
            price: updatedDestination.price,
            duration: updatedDestination.duration,
            departureDate: updatedDestination.departureDate,
            imageUrl: updatedDestination.imageUrl,
            description: updatedDestination.description,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Request failed with status ${response.status}`);
      }

      onSaved(updatedDestination);
      setIsOpen(false);
      toast.add({
        title: "Travel package updated",
        description: "Your changes have been saved.",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Could not update travel package",
        description:
          error instanceof Error
            ? error.message
            : "Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const categoryOptions = categories.includes(destination.category)
    ? categories
    : [...categories, destination.category].sort((a, b) => a.localeCompare(b));

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
        }}
        className="inline-flex h-8 items-center gap-1.5 border border-neutral-300 px-3 text-xs text-neutral-800 transition-colors hover:border-neutral-500 hover:bg-neutral-50"
      >
        <Pencil aria-hidden="true" size={12} />
        Edit
      </button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!isSaving) setIsOpen(open);
        }}
      >
        <DialogContent
          className="max-h-[90vh] max-w-md overflow-y-auto rounded-none p-5 sm:p-6"
          showCloseButton={false}
        >
          <DialogHeader className="pr-7">
            <DialogTitle className="text-sm font-medium">
              Update Travel Package
            </DialogTitle>
            <DialogDescription className="text-[10px]">
              Make changes to the travel package details below
            </DialogDescription>
          </DialogHeader>

          <button
            type="button"
            aria-label="Close edit dialog"
            onClick={() => setIsOpen(false)}
            disabled={isSaving}
            className="absolute right-4 top-4 text-neutral-400 transition-colors hover:text-neutral-800 disabled:opacity-50"
          >
            <X aria-hidden="true" size={15} />
          </button>

          <form
            key={JSON.stringify(destination)}
            onSubmit={handleSubmit}
            className="mt-2 space-y-3"
          >
            <div>
              <label className={labelClassName} htmlFor="edit-destination-name">
                Destination Name
              </label>
              <input
                autoFocus
                className={inputClassName}
                id="edit-destination-name"
                name="destinationName"
                defaultValue={destination.destinationName}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClassName} htmlFor="edit-country">
                  Country
                </label>
                <input
                  className={inputClassName}
                  id="edit-country"
                  name="country"
                  defaultValue={destination.country}
                  required
                />
              </div>
              <div>
                <label className={labelClassName} htmlFor="edit-category">
                  Category
                </label>
                <select
                  className={`${inputClassName} appearance-none`}
                  id="edit-category"
                  name="category"
                  defaultValue={destination.category}
                  required
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClassName} htmlFor="edit-price">
                  Price (USD)
                </label>
                <input
                  className={inputClassName}
                  id="edit-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={destination.price}
                  required
                />
              </div>
              <div>
                <label className={labelClassName} htmlFor="edit-duration">
                  Duration
                </label>
                <input
                  className={inputClassName}
                  id="edit-duration"
                  name="duration"
                  defaultValue={destination.duration}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClassName} htmlFor="edit-departure-date">
                Departure Date
              </label>
              <input
                className={inputClassName}
                id="edit-departure-date"
                name="departureDate"
                type="date"
                defaultValue={destination.departureDate}
                required
              />
            </div>

            <div>
              <label className={labelClassName} htmlFor="edit-image-url">
                Image URL
              </label>
              <input
                className={inputClassName}
                id="edit-image-url"
                name="imageUrl"
                type="url"
                defaultValue={getTravelPackageImageUrl(destination) ?? ""}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div>
              <label className={labelClassName} htmlFor="edit-description">
                Description
              </label>
              <textarea
                className="mt-1 min-h-24 w-full resize-y border-0 bg-slate-100 px-3 py-2 text-xs text-neutral-700 outline-none placeholder:text-neutral-400 focus:ring-1 focus:ring-cyan-500"
                id="edit-description"
                name="description"
                defaultValue={destination.description}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isSaving}
                className="inline-flex h-9 items-center gap-1.5 border border-red-300 px-3 text-xs text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 aria-hidden="true" size={12} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex h-9 items-center gap-1.5 bg-cyan-600 px-3 text-xs text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save aria-hidden="true" size={12} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
