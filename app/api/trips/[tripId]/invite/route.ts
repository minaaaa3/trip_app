import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import crypto from "crypto";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await auth();
    const { tripId: id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // オーナーチェック
    const membership = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: {
          tripId: id,
          userId: session.user.id,
        },
      },
    });

    if (!membership || membership.role !== "OWNER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 招待トークンの生成 (再生成も可能)
    const inviteToken = crypto.randomUUID();

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: { inviteToken },
    });

    return NextResponse.json({ inviteToken: updatedTrip.inviteToken }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/trips/[id]/invite] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
