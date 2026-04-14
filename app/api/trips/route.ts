import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json([], { status: 200 });
    }

    const trips = await prisma.trip.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(trips, { status: 200 });
  } catch (error) {
    console.error("Error fetching trips:", error);
    return NextResponse.json(
      { message: "Something went wrong while fetching trips." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title } = body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        {
          error:
            "Invalid input. Title is required and must be a non-empty string.",
        },
        { status: 400 }
      );
    }

    const newTrip = await prisma.trip.create({
      data: {
        title: title,
        members: {
          create: {
            userId: session.user.id,
            role: "OWNER",
          },
        },
      },
    });

    return NextResponse.json(newTrip, { status: 201 });
  } catch (error) {
    console.error("[POST /api/trips] Error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
