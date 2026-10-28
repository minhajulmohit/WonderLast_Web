"use client";

import Link from "next/link";
import { PackagePlus, X } from "lucide-react";
import { useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { getAuthToken } from "@/lib/auth-token";
import { authClient } from "@/lib/auth-client";

const inputClassName =
  "mt-1 h-9 w-full border-0 bg-slate-100 px-3 text-xs text-neutral-800 outline-none placeholder:text-neutral-400 focus:ring-1 focus:ring-cyan-500";

const labelClassName = "block text-xs font-medium text-neutral-900";

export default function AddNewPackagePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    if (!isPending && !isAdmin) router.replace("/");
  }, [isAdmin, isPending, router]);

  if (isPending || !isAdmin) return null;

  const handleAddBtn = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const packageData = {
      destinationName: formData.get("destinationName")?.toString() ?? "",
      country: formData.get("country")?.toString() ?? "",
      category: formData.get("category")?.toString() ?? "",
      price: Number(formData.get("price")),
      duration: formData.get("duration")?.toString() ?? "",
      departureDate: formData.get("departureDate")?.toString() ?? "",
      imageUrl: formData.get("imageUrl")?.toString() ?? "",
      description: formData.get("description")?.toString() ?? "",
    };

    try {
      const token = await getAuthToken();
      const res = await fetch("http://localhost:8000/add-new-package", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ["Bearer", token].join(" "),
        },
        body: JSON.stringify(packageData),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(
          errorMessage || `Request failed with status ${res.status}`,
        );
      }

      toast.add({
        title: "Travel package added",
        description: "The new travel package is ready.",
        type: "success",
      });
      form.reset();
    } catch (error) {
      toast.add({
        title: "Could not add travel package",
        description:
          error instanceof Error
            ? error.message
            : "Please try again.",
        type: "error",
      });
    }
  };

  return (
    <main className="min-h-screen bg-white px-5 pb-16 pt-16 text-neutral-950 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-(family-name:--font-display) text-3xl tracking-tight sm:text-5xl">
          Add New Travel Package
        </h1>

        <form
          onSubmit={handleAddBtn}
          className="mx-auto mt-7 max-w-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div>
            <label className={labelClassName} htmlFor="destination-name">
              Destination Name
            </label>
            <input
              className={inputClassName}
              id="destination-name"
              name="destinationName"
              placeholder="Bali Paradise"
              required
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className={labelClassName} htmlFor="country">
                Country
              </label>
              <input
                className={inputClassName}
                id="country"
                name="country"
                placeholder="Indonesia"
                required
              />
            </div>
            <div>
              <label className={labelClassName} htmlFor="category">
                Category
              </label>
              <select
                className={`${inputClassName} appearance-none`}
                id="category"
                name="category"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select category
                </option>
                <option value="adventure">Adventure</option>
                <option value="beach">Beach</option>
                <option value="city">City</option>
                <option value="city">Cruise</option>
                <option value="cultural">Cultural</option>
                <option value="city">Mountain</option>
              </select>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className={labelClassName} htmlFor="price">
                Price (USD)
              </label>
              <input
                className={inputClassName}
                id="price"
                name="price"
                type="number"
                min="0"
                placeholder="e.g., 1299"
                required
              />
            </div>
            <div>
              <label className={labelClassName} htmlFor="duration">
                Duration
              </label>
              <input
                className={inputClassName}
                id="duration"
                name="duration"
                placeholder="e.g., 7 Days/6 Nights"
                required
              />
            </div>
          </div>

          <div className="mt-3">
            <label className={labelClassName} htmlFor="departure-date">
              Departure Date
            </label>
            <input
              className={inputClassName}
              id="departure-date"
              name="departureDate"
              type="date"
              required
            />
          </div>

          <div className="mt-3">
            <label className={labelClassName} htmlFor="image-url">
              Image URL
            </label>
            <input
              className={inputClassName}
              id="image-url"
              name="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="mt-3">
            <label className={labelClassName} htmlFor="description">
              Description
            </label>
            <textarea
              className="mt-1 min-h-24 w-full resize-y border-0 bg-slate-50 px-3 py-2 text-xs text-neutral-800 outline-none placeholder:text-neutral-400 focus:ring-1 focus:ring-cyan-500"
              id="description"
              name="description"
              placeholder="Describe the travel experience..."
              required
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Link
              href="/"
              className="inline-flex h-9 items-center gap-1.5 border border-red-300 px-3 text-xs text-red-500 transition-colors hover:bg-red-50"
            >
              <X aria-hidden="true" size={13} />
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex h-9 items-center gap-1.5 bg-cyan-600 px-3 text-xs text-white transition-colors hover:bg-cyan-700"
            >
              <PackagePlus aria-hidden="true" size={13} />
              Add Travel Package
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
