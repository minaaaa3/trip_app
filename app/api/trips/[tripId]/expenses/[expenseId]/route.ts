import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string; expenseId: string }> }
) {
  const { tripId, expenseId } = await params;

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

    await prisma.expense.delete({
      where: {
        id: expenseId,
        tripId: tripId, // 安全のためtripIdも条件に含める
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/trips/[tripId]/expenses/[expenseId] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string; expenseId: string }> }
) {
  const { tripId, expenseId } = await params;

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
    const { amount, description, paidById, participantIds } = body;

    // トランザクションで更新
    const updatedExpense = await prisma.$transaction(async (tx) => {
      // 既存の参加者を削除
      await tx.expenseParticipant.deleteMany({
        where: { expenseId: expenseId },
      });

      // 費用本体を更新
      return await tx.expense.update({
        where: { id: expenseId },
        data: {
          amount: parseFloat(amount),
          description,
          paidById,
          participants: {
            create: participantIds.map((userId: string) => ({
              userId,
            })),
          },
        },
        include: {
          paidBy: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    });

    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error("PUT /api/trips/[tripId]/expenses/[expenseId] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
