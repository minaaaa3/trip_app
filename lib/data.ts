import { Trip, Spot } from "@/types";

export const mockTrips: Trip[] = [
  {
    id: 1,
    title: "韓国旅行2025",
    created_by: 1,
    created_at: "2025-01-15",
    member_count: 3,
  },
  {
    id: 2,
    title: "沖縄夏休み",
    created_by: 1,
    created_at: "2025-02-01",
    member_count: 5,
  },
];

export const mockSpots: Record<number, Spot[]> = {
  1: [
    {
      id: 1,
      trip_id: 1,
      name: "景福宮",
      url: "https://maps.google.com",
      memo: "朝一番に訪問したい。チマチョゴリレンタルも検討",
      created_by: 1,
      created_at: "2025-01-16",
    },
    {
      id: 2,
      trip_id: 1,
      name: "ホンデのサムギョプサル店",
      url: "https://tabelog.com",
      memo: "友達おすすめのお店。予約必須らしい",
      created_by: 2,
      created_at: "2025-01-17",
    },
  ],
  2: [],
};

export async function getTrips(): Promise<Trip[]> {
  // TODO: データベースから取得
  return mockTrips;
}

export async function getTripById(id: number): Promise<Trip | undefined> {
  // TODO: データベースから取得
  return mockTrips.find((t) => t.id === id);
}

export async function getSpotsByTripId(tripId: number): Promise<Spot[]> {
  // TODO: データベースから取得
  return mockSpots[tripId] || [];
}
