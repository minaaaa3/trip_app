"use client";

import { useState } from "react";
import { MapPin, Link as LinkIcon, Trash2, Image as ImageIcon, Plus, X } from "lucide-react";
import { Spot, Photo } from "@/types";

interface SpotCardProps {
  spot: Spot;
  onDelete: (id: string) => void;
}

export default function SpotCard({ spot, onDelete }: SpotCardProps) {
  const [photos, setPhotos] = useState<Photo[]>(spot.photos || []);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1MBを超える画像は警告（Base64にするとさらに約1.3倍になるため）
    if (file.size > 1 * 1024 * 1024) {
      alert("画像サイズが大きすぎます。1MB以下の画像を選択してください。");
      return;
    }

    setIsUploading(true);
    try {
      // FileReaderでBase64に変換
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result as string;
        
        const res = await fetch(`/api/trips/${spot.tripId}/spots/${spot.id}/photos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: base64Data }),
        });

        if (res.ok) {
          const newPhoto = await res.json();
          setPhotos([newPhoto, ...photos]);
        }
        setIsUploading(false);
      };
    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    if (!confirm("この写真を削除しますか？")) return;

    try {
      const res = await fetch(`/api/trips/${spot.tripId}/spots/${spot.id}/photos/${photoId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPhotos(photos.filter(p => p.id !== photoId));
      }
    } catch (error) {
      console.error("Delete photo failed:", error);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-md border border-transparent hover:border-indigo-100 transition-all group overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
                <MapPin size={18} />
              </div>
              <h3 className="text-xl font-black text-gray-800">{spot.name}</h3>
            </div>
            {spot.memo && (
              <p className="text-gray-500 text-sm mt-2 ml-1 line-clamp-2">
                {spot.memo}
              </p>
            )}
          </div>
          <button
            onClick={() => onDelete(spot.id)}
            className="text-gray-300 hover:text-red-500 p-2 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {spot.url && (
          <a
            href={spot.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors mb-4"
          >
            <LinkIcon size={12} />
            リンクを開く
          </a>
        )}

        {/* フォトギャラリー */}
        <div className="mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <ImageIcon size={14} />
              Memories
            </h4>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                <Plus size={14} />
                写真を追加
              </div>
            </label>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {isUploading && (
              <div className="min-w-[80px] h-20 bg-gray-50 rounded-xl flex items-center justify-center animate-pulse border-2 border-dashed border-gray-200">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            
            {photos.length === 0 && !isUploading ? (
              <div className="w-full py-4 text-center border-2 border-dashed border-gray-50 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tight">No photos yet</p>
              </div>
            ) : (
              photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative min-w-[80px] h-20 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all group/photo"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => handleDeletePhoto(e, photo.id)}
                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-md opacity-0 group-hover/photo:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 写真拡大プレビュー */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
          />
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 text-white hover:text-indigo-400 transition-colors flex items-center gap-2 font-bold"
            >
              閉じる <X size={24} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPhoto.url}
              alt=""
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300"
            />
            {selectedPhoto.caption && (
              <p className="text-white mt-6 text-lg font-medium">{selectedPhoto.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
