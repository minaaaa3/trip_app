import { notFound } from "next/navigation";
import TripDetailClient from "./TripDetailClient";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

interface PageProps {
  params: Promise<{
    tripId: string;
  }>;
}

export default async function TripDetailPage({ params }: PageProps) {
  try {
    const session = await auth();
    const { tripId } = await params;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        members: {
          include: { user: true },
        },
      },
    });

    if (!trip) {
      notFound();
    }

    const initialSpots = await prisma.spot.findMany({
      where: { tripId: tripId },
      include: {
        photos: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: [
        { day: "asc" },
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    const initialExpenses = await prisma.expense.findMany({
      where: { tripId: tripId },
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

    // DateオブジェクトをISO文字列に変換
    const serializedTrip = JSON.parse(JSON.stringify(trip));
    const serializedSpots = JSON.parse(JSON.stringify(initialSpots));
    const serializedExpenses = JSON.parse(JSON.stringify(initialExpenses));

    return (
      <TripDetailClient
        trip={serializedTrip}
        initialSpots={serializedSpots}
        initialExpenses={serializedExpenses}
        session={session}
      />
    );
  } catch (error) {
    console.error("Error in TripDetailPage:", error);
    notFound();
  }
}
