import { Suspense } from "react";
import DestinationDetails from "@/components/destinations/destination-details";
import DestinationDetailsSkeleton from "@/components/destinations/destination-details-skeleton";

async function DestinationDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <DestinationDetails id={id} />;
}

export default function DestinationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white px-5 pb-16 pt-16 sm:px-8">
          <section className="mx-auto max-w-6xl">
            <DestinationDetailsSkeleton />
          </section>
        </main>
      }
    >
      <DestinationDetailsContent params={params} />
    </Suspense>
  );
}
