"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Users, MapPin } from "lucide-react";
import { Trip, Spot } from "@/types";
import SpotCard from "@/components/SpotCard";
import AddSpotForm from "@/components/AddSpotForm";

interface TripDetailClientProps {
  trip: Trip;
  initialSpots: Spot[];
}

export default function TripDetailClient({
  trip,
  initialSpots,
}: TripDetailClientProps) {
  const [spots, setSpots] = useState<Spot[]>(initialSpots);
  const [isAddingSpot, setIsAddingSpot] = useState(false);

  const handleAddSpot = (
    newSpotData: Omit<Spot, "id" | "created_by" | "created_at" | "updated_at">
  ) => {
    // TODO: APIを呼び出してデータベースに保存
    const newSpot: Spot = {
      ...newSpotData,
      id: Math.max(0, ...spots.map((s) => s.id)) + 1,
      created_by: 1, // TODO: 実際のユーザーIDを使用
      created_at: new Date().toISOString().split("T")[0],
    };
    setSpots([...spots, newSpot]);
    setIsAddingSpot(false);
  };

  const handleDeleteSpot = (spotId: number) => {
    // TODO: APIを呼び出してデータベースから削除
    setSpots(spots.filter((s) => s.id !== spotId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="mb-4 text-indigo-600 hover:text-indigo-800  items-center gap-1 inline-block"
        >
          ← 旅行一覧に戻る
        </Link>

        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {trip.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <Users size={18} />
            <span>{trip.member_count || 0}人のメンバー</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              行きたい場所リスト
            </h2>
            <button
              onClick={() => setIsAddingSpot(!isAddingSpot)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
            >
              <Plus size={18} />
              場所を追加
            </button>
          </div>

          {isAddingSpot && (
            <AddSpotForm
              tripId={trip.id}
              onAdd={handleAddSpot}
              onCancel={() => setIsAddingSpot(false)}
            />
          )}

          <div className="space-y-4">
            {spots.length === 0 ? (
              <div className="bg-white rounded-xl p-12 shadow-md text-center text-gray-500">
                <MapPin size={48} className="mx-auto mb-3 opacity-30" />
                <p>まだ場所が登録されていません</p>
                <p className="text-sm">
                  「場所を追加」ボタンから追加してください
                </p>
              </div>
            ) : (
              spots.map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  onDelete={handleDeleteSpot}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
