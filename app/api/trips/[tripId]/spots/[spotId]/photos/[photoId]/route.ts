import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string; spotId: string; photoId: string }> }
) {
  const { tripId, spotId, photoId } = await params;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 削除対象の写真を取得
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: {
        spot: {
          include: {
            trip: {
              include: {
                members: {
                  where: { userId: session.user.id }
                }
              }
            }
          }
        }
      }
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    // 権限チェック: アップロードした本人か、旅行のオーナーか
    const myMembership = photo.spot.trip.members[0];
    const isOwner = myMembership?.role === "OWNER";
    const isUploader = photo.userId === session.user.id;

    if (!isOwner && !isUploader) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.photo.delete({
      where: { id: photoId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE photo error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
