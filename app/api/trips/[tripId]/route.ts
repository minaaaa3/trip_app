// /app/api/trips/[tripId]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  const tripId = params.tripId;

  // tripIdが取得できているか確認 (デバッグ用)
  if (!tripId) {
    return NextResponse.json({ error: "Trip ID is missing" }, { status: 400 });
  }

  try {
    const trip = await prisma.trip.findUnique({
      // where句を含むオブジェクトは1つだけにする
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
    // PrismaClientValidationErrorの場合、クライアント側のリクエストが不正である可能性が高い
    if (
      error instanceof Error &&
      error.name === "PrismaClientValidationError"
    ) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Error fetching trip" }, { status: 500 });
  }
}
