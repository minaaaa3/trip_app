import { Plus } from "lucide-react";
import TripCard from "@/components/TripCard";
import { getTrips } from "@/lib/data";

export default async function HomePage() {
  const trips = await getTrips();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            旅行プランナー
          </h1>
          <p className="text-gray-600">行きたい場所をみんなで共有しよう</p>
        </div>

        <button className="mb-6 bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg">
          <Plus size={20} />
          新しい旅行を作成
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </div>
  );
}
