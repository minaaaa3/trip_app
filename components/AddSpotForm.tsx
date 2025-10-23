"use client";

import { useState } from "react";
import { Spot } from "@/types";

interface AddSpotFormProps {
  tripId: number;
  onAdd: (
    spot: Omit<Spot, "id" | "created_by" | "created_at" | "updated_at">
  ) => void;
  onCancel: () => void;
}

export default function AddSpotForm({
  tripId,
  onAdd,
  onCancel,
}: AddSpotFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    memo: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onAdd({
        trip_id: tripId,
        name: formData.name,
        url: formData.url || undefined,
        memo: formData.memo || undefined,
      });
      setFormData({ name: "", url: "", memo: "" });
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md mb-4 border-2 border-indigo-300">
      <h3 className="font-bold text-gray-800 mb-4">新しい場所を追加</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="場所名"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="url"
          placeholder="URL（Google Maps、食べログなど）"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          placeholder="メモ"
          value={formData.memo}
          onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            追加
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
