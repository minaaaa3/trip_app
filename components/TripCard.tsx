import Link from "next/link";
import { Calendar } from "lucide-react";
import { Trip } from "@/types";

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  // 日付文字列をDateオブジェクトに変換
  const createdDate = new Date(trip.createdAt);

  return (
    <Link href={`/trip/${trip.id}`}>
      <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-indigo-300">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{trip.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{createdDate.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
