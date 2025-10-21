import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { Prisma } from "@prisma/client";

/**
 * PUT /api/trips/{tripId}/spots/{spotId}
 * 特定のスポットの情報を更新します。
 */
export async function PUT(
  request: NextRequest,
  // お客様のスタイルに合わせて params の型定義を変更
  { params }: { params: Promise<{ tripId: string; spotId: string }> }
) {
  // await を使って値を取り出す
  const { tripId, spotId } = await params;

  try {
    const body = await request.json();
    const { name, url, memo } = body;

    // 更新するデータを入れるオブジェクト
    const dataToUpdate: { name?: string; url?: string; memo?: string } = {};

    // リクエストボディに 'name' が含まれていれば、更新対象に加える
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim() === "") {
        return NextResponse.json(
          { error: "Name must be a non-empty string." },
          { status: 400 }
        );
      }
      dataToUpdate.name = name;
    }

    // リクエストボディに 'url' が含まれていれば、更新対象に加える
    if (url !== undefined) {
      // urlは空文字列を許容する場合
      if (typeof url !== "string") {
        return NextResponse.json(
          { error: "URL must be a string." },
          { status: 400 }
        );
      }
      dataToUpdate.url = url;
    }

    // リクエストボディに 'memo' が含まれていれば、更新対象に加える
    if (memo !== undefined) {
      if (typeof memo !== "string") {
        return NextResponse.json(
          { error: "Memo must be a string." },
          { status: 400 }
        );
      }
      dataToUpdate.memo = memo;
    }

    // 更新するフィールドが何もない場合はエラー
    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { error: "No fields to update provided." },
        { status: 400 }
      );
    }

    // データベースを更新
    // `updateMany` を使い、spotId と tripId の両方が一致するレコードのみを対象とすることで、
    // 他の旅行に属するスポットを誤って更新することを防ぎます。
    const result = await prisma.spot.updateMany({
      where: {
        id: spotId,
        tripId: tripId,
      },
      data: dataToUpdate,
    });

    // `result.count` は更新されたレコード数。0の場合は対象が見つからなかったことを意味する。
    if (result.count === 0) {
      return NextResponse.json(
        { error: "Spot not found or does not belong to the specified trip." },
        { status: 404 }
      );
    }

    // クライアントに更新後のデータを返すために、更新されたスポットを再取得
    const updatedSpot = await prisma.spot.findUnique({
      where: {
        id: spotId,
      },
    });

    return NextResponse.json(updatedSpot, { status: 200 });
  } catch (error) {
    console.error(`[PUT /api/trips/${tripId}/spots/${spotId}] Error:`, error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format." },
        { status: 400 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // IDの形式が不正な場合など
      if (error.code === "P2023") {
        return NextResponse.json(
          { error: "Invalid ID format." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
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
    // `deleteMany` を使い、spotId と tripId の両方が一致するレコードのみを削除対象とします。
    // これにより、他の旅行に属するスポットを誤って削除することを防ぎます。
    const deleteResult = await prisma.spot.deleteMany({
      where: {
        id: spotId,
        tripId: tripId,
      },
    });

    // `deleteResult.count` は削除されたレコード数です。
    // 0の場合は対象が見つからなかったことを意味します。
    if (deleteResult.count === 0) {
      return NextResponse.json(
        { error: "Spot not found or does not belong to the specified trip." },
        { status: 404 }
      );
    }

    // 成功した場合、204 No Content ステータスを返すのがRESTful APIの慣例です。
    // 204レスポンスはボディを含みません。
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(
      `[DELETE /api/trips/${tripId}/spots/${spotId}] Error:`,
      error
    );

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // IDの形式が不正な場合など
      if (error.code === "P2023") {
        return NextResponse.json(
          { error: "Invalid ID format." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
