import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import HomePageClient from "@/components/HomePageClient";

export default async function HomePage() {
  const session = await auth();

  let initialTrips: any[] = [];

  if (session?.user?.id) {
    // 自分がメンバーである旅行を直接取得し、作成日順にソート
    initialTrips = await prisma.trip.findMany({
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
  }

  // Trip型への変換
  const trips = JSON.parse(JSON.stringify(initialTrips));

  return <HomePageClient initialTrips={trips} session={session} />;
}
