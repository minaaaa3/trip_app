import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await auth();
    const { tripId: id } = await params;
    const { token } = await request.json();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    // 旅行情報の取得とトークン検証
    const trip = await prisma.trip.findUnique({
      where: { id },
      select: { inviteToken: true },
    });

    if (!trip || !trip.inviteToken || trip.inviteToken !== token) {
      return NextResponse.json({ error: "Invalid invitation link" }, { status: 400 });
    }

    // 既にメンバーでないか確認
    const existingMember = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: {
          tripId: id,
          userId: session.user.id,
        },
      },
    });

    if (!existingMember) {
      // メンバーとして追加 (Role: MEMBER)
      await prisma.tripMember.create({
        data: {
          tripId: id,
          userId: session.user.id,
          role: "MEMBER",
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/trips/[id]/join] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
