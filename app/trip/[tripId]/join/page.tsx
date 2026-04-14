import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MapPin, UserPlus } from "lucide-react";
import Link from "next/link";

interface JoinPageProps {
  params: Promise<{ tripId: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function JoinTripPage({ params, searchParams }: JoinPageProps) {
  const session = await auth();
  const { tripId } = await params;
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <p className="text-red-500 font-bold">招待トークンが見つかりません</p>
          <Link href="/" className="mt-4 inline-block text-indigo-600 hover:underline">
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      members: {
        include: { user: true },
      },
    },
  });

  if (!trip || trip.inviteToken !== token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <p className="text-red-500 font-bold">この招待リンクは無効か期限切れです</p>
          <Link href="/" className="mt-4 inline-block text-indigo-600 hover:underline">
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  // すでにメンバーか確認
  const isMember = session?.user?.id 
    ? trip.members.some(m => m.userId === session.user.id)
    : false;

  if (isMember) {
    redirect(`/trip/${tripId}`);
  }

  async function handleJoin() {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;

    await prisma.tripMember.create({
      data: {
        tripId: tripId,
        userId: session.user.id,
        role: "MEMBER",
      },
    });

    redirect(`/trip/${tripId}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl border border-white">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <UserPlus size={32} />
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          旅行に招待されました
        </h1>
        <p className="text-center text-gray-600 mb-8">
          「<span className="font-bold text-gray-900">{trip.title}</span>」の計画に一緒に参加しませんか？
        </p>

        <div className="bg-gray-50 p-4 rounded-xl mb-8 flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <MapPin size={20} className="text-indigo-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">共有者</p>
            <p className="text-sm font-medium text-gray-700">
              {trip.members.find(m => m.role === "OWNER")?.user.email || "ユーザー"}
            </p>
          </div>
        </div>

        {!session ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-gray-500">参加するにはログインが必要です</p>
            <Link href={`/login?callbackUrl=/trip/${tripId}/join?token=${token}`}>
              <Button className="w-full py-6 text-lg rounded-2xl bg-indigo-600 hover:bg-indigo-700">
                ログインして参加する
              </Button>
            </Link>
          </div>
        ) : (
          <form action={handleJoin}>
            <Button type="submit" className="w-full py-6 text-lg rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">
              この旅行に参加する
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
