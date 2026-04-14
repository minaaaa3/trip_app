import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * PUT /api/trips/{tripId}/spots/{spotId}
 * 特定のスポットの情報を更新します。
 */
export async function PUT(
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

    const body = await request.json();
    const { name, url, memo, day } = body;

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (url !== undefined) dataToUpdate.url = url;
    if (memo !== undefined) dataToUpdate.memo = memo;
    if (day !== undefined) dataToUpdate.day = day ? parseInt(day) : null;

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updatedSpot = await prisma.spot.update({
      where: {
        id: spotId,
        tripId: tripId, // 安全のためtripIdも条件に含める
      },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedSpot, { status: 200 });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json({ error: "Error updating spot" }, { status: 500 });
  }
}

/**
 * DELETE /api/trips/{tripId}/spots/{spotId}
 * 特定のスポットを削除します。
 */
export async function DELETE(
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

    await prisma.spot.delete({
      where: {
        id: spotId,
        tripId: tripId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json({ error: "Error deleting spot" }, { status: 500 });
  }
}
