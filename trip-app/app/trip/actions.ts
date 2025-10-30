// filepath: /trip-app/trip-app/app/trip/actions.ts
"use server"
import { TripInput } from "@/types/types";

export async function addTrip(tripData: TripInput) {
  try {
    const response = await fetch('/api/trips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripData),
    });

    if (!response.ok) {
      throw new Error('Failed to add trip');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding trip:", error);
    throw error;
  }
}