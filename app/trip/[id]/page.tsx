import { notFound } from "next/navigation";
import TripDetailClient from "./TripDetailClient";
import { getTripById, getSpotsByTripId } from "@/lib/data";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function TripDetailPage({ params }: PageProps) {
  const tripId = parseInt(params.id);

  if (isNaN(tripId)) {
    notFound();
  }

  const trip = await getTripById(tripId);

  if (!trip) {
    notFound();
  }

  const initialSpots = await getSpotsByTripId(tripId);

  return <TripDetailClient trip={trip} initialSpots={initialSpots} />;
}
