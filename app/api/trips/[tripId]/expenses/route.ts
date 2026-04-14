import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;

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

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      include: {
        paidBy: {
          select: { id: true, email: true, name: true }
        },
        participants: {
          include: {
            user: {
              select: { id: true, email: true, name: true }
            }
          }
        }
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error("GET /api/trips/[tripId]/expenses error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;

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
    const { amount, description, paidById, participantIds } = body;

    if (!amount || !description || !paidById || !participantIds || participantIds.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newExpense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        description,
        tripId,
        paidById,
        participants: {
          create: participantIds.map((userId: string) => ({
            userId
          }))
        }
      },
      include: {
        paidBy: {
          select: { id: true, email: true, name: true }
        },
        participants: {
          include: {
            user: {
              select: { id: true, email: true, name: true }
            }
          }
        }
      }
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("POST /api/trips/[tripId]/expenses error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
