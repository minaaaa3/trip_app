import { Trip, Spot } from "@/types";

// baseURLの設定
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getTrips(): Promise<Trip[]> {
  const response = await fetch(`${baseURL}/api/trips`);
  if (!response.ok) {
    throw new Error("Failed to fetch trips");
  }
  return response.json();
}

export async function getTripById(id: number): Promise<Trip | undefined> {
  const response = await fetch(`${baseURL}/api/trips/${id}`);
  if (response.status === 404) {
    return undefined;
  }
  if (!response.ok) {
    throw new Error("Failed to fetch trip");
  }
  return response.json();
}

export async function getSpotsByTripId(tripId: number): Promise<Spot[]> {
  const response = await fetch(`${baseURL}/api/trips/${tripId}/spots`);
  if (!response.ok) {
    throw new Error("Failed to fetch spots");
  }
  return response.json();
}

export async function createTrip(title: string): Promise<Trip> {
  const response = await fetch(`${baseURL}/api/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    throw new Error("Failed to create trip");
  }
  return response.json();
}

export async function createSpot(
  tripId: number,
  data: { name: string; url?: string; memo?: string }
): Promise<Spot> {
  const response = await fetch(`${baseURL}/api/trips/${tripId}/spots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create spot");
  }
  return response.json();
}

export async function updateSpot(
  tripId: number,
  spotId: number,
  data: { name?: string; url?: string; memo?: string }
): Promise<Spot> {
  const response = await fetch(
    `${baseURL}/api/trips/${tripId}/spots/${spotId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update spot");
  }
  return response.json();
}

export async function deleteSpot(
  tripId: number,
  spotId: number
): Promise<void> {
  const response = await fetch(
    `${baseURL}/api/trips/${tripId}/spots/${spotId}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete spot");
  }
}
