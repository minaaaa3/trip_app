// /app/api/trips/[tripId]/spots/route.ts

// 1. 'next/server' から 'NextRequest' をインポートします
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET: 特定の旅行に紐づく全てのスポットを取得
 */
export async function GET(
  // 2. requestの型を'NextRequest'に変更します
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  const tripId = params.tripId;

  try {
    const tripExists = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!tripExists) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const spots = await prisma.spot.findMany({
      where: {
        tripId: tripId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(spots, { status: 200 });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json(
      { error: "Error fetching spots" },
      { status: 500 }
    );
  }
}

/**
 * POST: 特定の旅行に新しいスポットを追加
 */
export async function POST(
  // 2. こちらもrequestの型を'NextRequest'に変更します
  request: NextRequest,
  { params }: { params: { tripId: string } }
) {
  const tripId = params.tripId;

  try {
    const body = await request.json();
    const { name, url, memo } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const tripExists = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!tripExists) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const newSpot = await prisma.spot.create({
      data: {
        name,
        url,
        memo,
        tripId: tripId,
      },
    });

    return NextResponse.json(newSpot, { status: 201 });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json({ error: "Error creating spot" }, { status: 500 });
  }
}
