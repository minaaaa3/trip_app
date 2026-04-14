"use client";

import { useState } from "react";
import { User, Edit2, Check, X, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface UserProfileHeaderProps {
  initialName?: string | null;
  email: string;
}

export default function UserProfileHeader({ initialName, email }: UserProfileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(initialName || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdateName = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (res.ok) {
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update name:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-100 transition-all cursor-pointer group"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
          <User size={16} />
        </div>
        <div className="flex flex-col items-start pr-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight leading-none mb-1">
            User Name
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-gray-700 leading-none">
              {initialName || "名前を設定"}
            </span>
            {!initialName && (
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
        </div>
        <Settings size={14} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
      </div>

      {/* 編集モーダル */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <User size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">プロフィール設定</h3>
              <p className="text-sm text-gray-500 mb-8">
                旅行メンバーに表示される名前を設定しましょう。<br />
                <span className="text-xs text-gray-400">{email}</span>
              </p>

              <div className="space-y-4">
                <div className="text-left">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
                    表示名
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-lg"
                    placeholder="例: たろう"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleUpdateName}
                    disabled={loading || !name.trim()}
                    className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl shadow-lg shadow-indigo-100"
                  >
                    保存する
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="h-12 px-6 rounded-xl border-gray-200 text-gray-500"
                  >
                    キャンセル
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
