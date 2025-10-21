import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // 先ほど作成したPrisma Clientをインポート

export async function GET() {
  try {
    // データベースからすべてのTripレコードを取得
    const trips = await prisma.trip.findMany({
      // 作成日が新しい順に並び替え
      orderBy: {
        createdAt: "desc",
      },
    });

    // 取得したデータをJSON形式で返す
    return NextResponse.json(trips, { status: 200 });
  } catch (error) {
    // エラーが発生した場合は、エラーメッセージを返す
    console.error("Error fetching trips:", error);
    return NextResponse.json(
      { message: "Something went wrong while fetching trips." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/trips
 * 新しい旅行（Trip）を作成します。
 */
export async function POST(request: NextRequest) {
  try {
    // 1. リクエストボディをJSONとしてパース
    const body = await request.json();
    const { title } = body;

    // 2. バリデーション (OpenAPI: 400 Bad Request)
    // titleが存在し、文字列であることを確認
    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        {
          error:
            "Invalid input. Title is required and must be a non-empty string.",
        },
        { status: 400 }
      );
    }

    // 3. データベースへの書き込み
    const newTrip = await prisma.trip.create({
      data: {
        title: title,
      },
    });

    // 4. 成功レスポンス (OpenAPI: 201 Created)
    return NextResponse.json(newTrip, { status: 201 });
  } catch (error) {
    // 5. エラーハンドリング
    console.error("[POST /api/trips] Error:", error);

    // JSONパース失敗などもここにキャッチされる
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format." },
        { status: 400 }
      );
    }

    // 500 Internal Server Error
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
