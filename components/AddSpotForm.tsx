"use client";

import { useState } from "react";
import { Spot } from "@/types";

interface AddSpotFormProps {
  tripId: string;
  onAdd: (spot: Pick<Spot, "tripId" | "name" | "url" | "memo" | "day">) => void;
  onCancel: () => void;
  defaultDay?: number;
}

export default function AddSpotForm({
  tripId,
  onAdd,
  onCancel,
  defaultDay = 0,
}: AddSpotFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    memo: "",
    day: defaultDay,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onAdd({
        tripId,
        name: formData.name,
        url: formData.url || undefined,
        memo: formData.memo || undefined,
        day: formData.day > 0 ? formData.day : undefined,
      });
      // フォームをリセット（ただし日数は維持してもいいかもしれないが、一旦リセット）
      setFormData({ ...formData, name: "", url: "", memo: "" });
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md mb-4 border-2 border-indigo-300">
      <h3 className="font-bold text-gray-800 mb-4">新しい場所を追加</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">場所名</label>
          <input
            type="text"
            placeholder="例: 清水寺"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">予定日（0は未定）</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="30"
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) || 0 })}
              className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-500">
              {formData.day === 0 ? "未定" : `${formData.day}日目`}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">URL</label>
          <input
            type="url"
            placeholder="Google Mapsなど"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">メモ</label>
          <textarea
            placeholder="見どころや予約時間など"
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
          >
            追加する
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
