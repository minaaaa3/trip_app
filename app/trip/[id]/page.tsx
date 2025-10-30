import { notFound } from "next/navigation";
import TripDetailClient from "./TripDetailClient";
import { getTripById, getSpotsByTripId } from "@/lib/data";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TripDetailPage({ params }: PageProps) {
  try {
    const { id } = await params;
    const tripId = parseInt(id);

    if (isNaN(tripId)) {
      notFound();
    }

    const trip = await getTripById(tripId);

    if (!trip) {
      notFound();
    }

    const initialSpots = await getSpotsByTripId(tripId);

    return <TripDetailClient trip={trip} initialSpots={initialSpots ?? []} />;
  } catch (error) {
    console.error("Error in TripDetailPage:", error);
    notFound();
  }
}
