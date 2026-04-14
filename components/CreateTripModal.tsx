"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // 未作成の場合は自前でスタイル
import { PlaneTakeoff } from "lucide-react";

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tripData: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
  }) => void;
}

export default function CreateTripModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateTripModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, startDate, endDate });
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-indigo-600 p-8 text-white flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
            <PlaneTakeoff size={32} />
          </div>
          <DialogTitle className="text-2xl font-black mb-2">新しい旅を計画</DialogTitle>
          <DialogDescription className="text-indigo-100">
            行き先を決めて、最高のプランを作りましょう。
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                旅行のタイトル
              </Label>
              <Input
                id="title"
                placeholder="例: 京都 食べ歩きの旅"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-indigo-500 transition-all font-bold"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                簡単な説明
              </Label>
              <textarea
                id="description"
                placeholder="どんな旅行にしたいですか？"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[100px] p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium resize-none"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-lg shadow-indigo-100 active:scale-[0.98] transition-all"
            >
              作成を開始する
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
