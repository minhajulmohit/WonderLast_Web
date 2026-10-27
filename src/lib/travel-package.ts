import type { TravelPackage } from "@/types/travel-package";

export function isTravelPackage(value: unknown): value is TravelPackage {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;
  return (
    typeof item.destinationName === "string" &&
    typeof item.country === "string" &&
    typeof item.category === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    typeof item.duration === "string" &&
    typeof item.departureDate === "string" &&
    typeof item.description === "string" &&
    (item.image === undefined || typeof item.image === "string") &&
    (item.imageUrl === undefined || typeof item.imageUrl === "string") &&
    (item.rating === undefined ||
      (typeof item.rating === "number" && Number.isFinite(item.rating)))
  );
}

export function getTravelPackageImageUrl(
  destination: TravelPackage,
): string | null {
  const image = destination.image ?? destination.imageUrl ?? "";
  const markdownLink = image.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
  const candidate = markdownLink?.[2] ?? image.trim();

  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}
