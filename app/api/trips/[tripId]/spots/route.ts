import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * GET: 特定の旅行に紐づく全てのスポットを取得
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // メンバーチェック
    const membership = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: {
          tripId: tripId,
          userId: session.user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const spots = await prisma.spot.findMany({
      where: {
        tripId: tripId,
      },
      orderBy: [
        { day: "asc" },
        { order: "asc" },
        { createdAt: "desc" },
      ],
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
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, url, memo, day } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // メンバーチェック
    const membership = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: {
          tripId: tripId,
          userId: session.user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const newSpot = await prisma.spot.create({
      data: {
        name,
        url,
        memo,
        day: day ? parseInt(day) : null,
        tripId: tripId,
      },
    });

    return NextResponse.json(newSpot, { status: 201 });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json({ error: "Error creating spot" }, { status: 500 });
  }
}
