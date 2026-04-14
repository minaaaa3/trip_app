import { Trip, Spot } from "@/types";
import prisma from "@/lib/prisma";

/**
 * すべての旅行を取得（サーバーサイド専用）
 */
export async function getTrips(): Promise<Trip[]> {
  const initialTrips = await prisma.trip.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return JSON.parse(JSON.stringify(initialTrips));
}

/**
 * ID指定で旅行を取得（サーバーサイド専用）
 */
export async function getTripById(id: string): Promise<Trip | null> {
  const trip = await prisma.trip.findUnique({
    where: { id },
  });
  if (!trip) return null;
  return JSON.parse(JSON.stringify(trip));
}

/**
 * 旅行に紐づくスポットを取得（サーバーサイド専用）
 */
export async function getSpotsByTripId(tripId: string): Promise<Spot[]> {
  const spots = await prisma.spot.findMany({
    where: { tripId },
    include: {
      photos: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: [
      { day: "asc" },
      { order: "asc" },
      { createdAt: "desc" },
    ],
  });
  return JSON.parse(JSON.stringify(spots));
}
