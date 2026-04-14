import { Trip, Spot } from "@/types";
import prisma from "@/lib/prisma";

export async function getTrips(): Promise<Trip[]> {
  const initialTrips = await prisma.trip.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return JSON.parse(JSON.stringify(initialTrips));
}

export async function getTripById(id: string): Promise<Trip | null> {
  const trip = await prisma.trip.findUnique({
    where: { id },
  });
  if (!trip) return null;
  return JSON.parse(JSON.stringify(trip));
}

export async function getSpotsByTripId(tripId: string): Promise<Spot[]> {
  const spots = await prisma.spot.findMany({
    where: { tripId },
    orderBy: [
      { day: "asc" },
      { order: "asc" },
      { createdAt: "desc" },
    ],
  });
  return JSON.parse(JSON.stringify(spots));
}
