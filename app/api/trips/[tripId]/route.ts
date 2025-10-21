// /app/api/trips/[tripId]/route.ts

// 1. 'next/server' から 'NextRequest' をインポートする
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@/lib";

export async function GET(
  // 2. request パラメータの型を 'NextRequest' に変更する
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;

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

/**
 * PUT /api/trips/{tripId}
 * 特定の旅行（Trip）のタイトルを更新します。
 */
export async function PUT(
  request: NextRequest,
  // こちらもお客様のスタイルに合わせます
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;

  try {
    // 1. リクエストボディをJSONとしてパース
    const body = await request.json();
    const { title } = body;

    // 2. バリデーション
    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        {
          error:
            "Invalid input. Title is required and must be a non-empty string.",
        },
        { status: 400 }
      );
    }

    // 3. データベースの更新
    // `prisma.trip.update` は、対象が見つからない場合に P2025 エラーをスローします
    const updatedTrip = await prisma.trip.update({
      where: {
        id: tripId,
      },
      data: {
        title: title,
      },
    });

    // 4. 成功レスポンス
    return NextResponse.json(updatedTrip, { status: 200 });
  } catch (error) {
    console.error(`[PUT /api/trips/${tripId}] Error:`, error);

    // 5. エラーハンドリング

    // JSONパース失敗
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format." },
        { status: 400 }
      );
    }

    // Prismaのエラーハンドリング
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025: レコードが見つからない -> 404 Not Found
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Trip not found." }, { status: 404 });
      }
      // P2023: ID形式が無効
      if (error.code === "P2023") {
        return NextResponse.json(
          { error: "Invalid Trip ID format." },
          { status: 400 }
        );
      }
    }

    // その他の予期せぬエラー
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
