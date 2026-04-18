"use client";

import { useState } from "react";
import { Spot } from "@/types";
import { MapPin, Utensils, Bed, Train, MoreHorizontal } from "lucide-react";

interface SpotFormProps {
  tripId: string;
  initialData?: Spot;
  onSubmit: (spotData: Partial<Spot>) => Promise<void>;
  onCancel: () => void;
  defaultDay?: number;
  mode?: "add" | "edit";
}

const CATEGORIES = [
  { id: "SIGHTSEEING", label: "観光", icon: MapPin },
  { id: "RESTAURANT", label: "食事", icon: Utensils },
  { id: "HOTEL", label: "宿泊", icon: Bed },
  { id: "TRANSPORT", label: "移動", icon: Train },
  { id: "OTHER", label: "その他", icon: MoreHorizontal },
];

export default function SpotForm({
  tripId,
  initialData,
  onSubmit,
  onCancel,
  defaultDay = 0,
  mode = "add",
}: SpotFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "SIGHTSEEING",
    url: initialData?.url || "",
    memo: initialData?.memo || "",
    day: initialData?.day ?? (mode === "add" ? defaultDay : 0),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      setIsSubmitting(true);
      try {
        await onSubmit({
          name: formData.name,
          category: formData.category,
          url: formData.url || null,
          memo: formData.memo || null,
          day: formData.day,
        });
        if (mode === "add") {
          setFormData({ name: "", category: "SIGHTSEEING", url: "", memo: "", day: defaultDay });
        }
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-md mb-4 border-2 ${mode === "edit" ? "border-indigo-100" : "border-indigo-300"}`}>
      <h3 className="font-bold text-gray-800 mb-4">
        {mode === "edit" ? "予定を編集" : "新しい予定を追加"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">カテゴリー</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                    formData.category === cat.id
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                      : "bg-white border-gray-100 text-gray-400 hover:border-indigo-100"
                  }`}
                >
                  <Icon size={16} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">場所・予定名</label>
          <input
            type="text"
            placeholder="例: 清水寺、リッツカールトン京都"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 text-base"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">予定日（0は未定）</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="30"
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) || 0 })}
                className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 text-base"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 text-base"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">メモ</label>
          <textarea
            placeholder="見どころや予約時間など"
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none bg-white text-gray-900 text-base"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            {isSubmitting ? "保存中..." : mode === "edit" ? "更新する" : "追加する"}
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
