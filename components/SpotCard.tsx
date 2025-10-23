"use client";

import { MapPin, ExternalLink, Trash2 } from "lucide-react";
import { Spot } from "@/types";

interface SpotCardProps {
  spot: Spot;
  onDelete: (spotId: number) => void;
}

export default function SpotCard({ spot, onDelete }: SpotCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3 flex-1">
          <MapPin size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {spot.name}
            </h3>
            {spot.memo && <p className="text-gray-600 mb-3">{spot.memo}</p>}
            {spot.url && (
              <a
                href={spot.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm"
              >
                <ExternalLink size={14} />
                リンクを開く
              </a>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(spot.id)}
          className="text-red-500 hover:text-red-700 p-2"
          aria-label="削除"
        >
          <Trash2 size={18} />
        </button>
      </div>
      <div className="text-xs text-gray-400 mt-2">
        追加日: {spot.created_at}
      </div>
    </div>
  );
}
