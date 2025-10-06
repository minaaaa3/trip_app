import { NextResponse } from "next/server";
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
