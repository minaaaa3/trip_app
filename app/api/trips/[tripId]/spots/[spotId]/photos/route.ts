import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string; spotId: string }> }
) {
  const { tripId, spotId } = await params;

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

    const photos = await prisma.photo.findMany({
      where: { spotId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(photos, { status: 200 });
  } catch (error) {
    console.error("GET photos error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string; spotId: string }> }
) {
  const { tripId, spotId } = await params;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const body = await request.json();
    const { url, caption } = body;

    if (!url) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 });
    }

    const newPhoto = await prisma.photo.create({
      data: {
        url,
        caption,
        spotId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(newPhoto, { status: 201 });
  } catch (error) {
    console.error("POST photo error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
