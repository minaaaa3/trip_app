"use client";

import { Plus, Plane } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import TripCard from "@/components/TripCard";
import CreateTripModal from "@/components/CreateTripModal";
import { Trip } from "@/types";
import { Session } from "next-auth";
import { Card } from "@/components/ui/card";

interface HomePageClientProps {
  initialTrips: Trip[];
  session: Session | null;
}

export default function HomePageClient({
  initialTrips,
  session,
}: HomePageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trips, setTrips] = useState<Trip[]>(initialTrips);

  const fetchTrips = async () => {
    try {
      const response = await fetch("/api/trips");
      const data = await response.json();

      if (Array.isArray(data)) {
        setTrips(data);
      } else if (data && Array.isArray(data.trips)) {
        setTrips(data.trips);
      } else {
        setTrips([]);
      }
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    }
  };

  const handleCreateTrip = async (tripData: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
  }) => {
    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        await fetchTrips();
      }
    } catch (error) {
      console.error("Failed to create trip:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ready for Adventure</span>
            </div>
            
            <div className="relative">
              <h1 className="text-6xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.9]">
                Trip<br />
                <span className="text-indigo-600 inline-flex items-center gap-4">
                  Weaver
                  <div className="h-1.5 w-20 md:w-32 bg-indigo-600/20 rounded-full hidden md:block" />
                </span>
              </h1>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-100/30 rounded-full blur-3xl -z-10" />
            </div>
            
            <p className="text-lg md:text-xl text-gray-500 font-medium max-w-xl leading-relaxed">
              忘れられない思い出を、大切な仲間と共に。<br className="hidden md:block" />
              最高の旅の計画を、ここから始めましょう。
            </p>
          </div>

          {session && (
            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="w-full md:w-auto px-8 py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 font-bold text-lg flex items-center justify-center whitespace-nowrap"
            >
              <Plus size={24} className="mr-2 shrink-0" />
              新しい旅行を計画する
            </Button>
          )}
        </div>

        {!session ? (
          <Card className="p-12 text-center border-2 border-dashed border-gray-200 bg-white/50 backdrop-blur-sm rounded-3xl">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Plane size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">ログインして始めましょう</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              ログインすると、旅行プランの作成、友人への共有、費用の割り勘などができるようになります。
            </p>
            <div className="inline-flex items-center p-1 bg-gray-100 rounded-xl">
              <p className="px-4 py-2 text-sm font-bold text-gray-500 uppercase tracking-widest">
                Get Started Above
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(trips) && trips.length > 0 ? (
              trips.map((trip) => <TripCard key={trip.id} trip={trip} />)
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-sm">
                <p className="text-xl font-bold text-gray-300">旅行プランがまだありません</p>
                <Button 
                  variant="link" 
                  onClick={() => setIsModalOpen(true)}
                  className="text-indigo-500 font-bold mt-2"
                >
                  最初のプランを作成しましょう →
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTrip}
      />
    </div>
  );
}
