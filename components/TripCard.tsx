import Link from "next/link";
import { Calendar, Users } from "lucide-react";
import { Trip } from "@/types";

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  return (
    <Link href={`/trip/${trip.id}`}>
      <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-indigo-300">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{trip.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{trip.member_count || 0}人</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{trip.created_at}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
