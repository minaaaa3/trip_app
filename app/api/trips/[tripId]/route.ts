// /app/api/trips/[tripId]/route.ts

// 1. 'next/server' から 'NextRequest' をインポートする
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  // 2. request パラメータの型を 'NextRequest' に変更する
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  const tripId = params.tripId;

  if (!tripId) {
    return NextResponse.json({ error: "Trip ID is missing" }, { status: 400 });
  }

  try {
    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json(trip, { status: 200 });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json({ error: "Error fetching trip" }, { status: 500 });
  }
}
