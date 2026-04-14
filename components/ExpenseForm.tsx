"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface ExpenseFormProps {
  members: { userId: string; user: { email: string; name?: string | null } }[];
  currentUserId?: string;
  onAdd: (data: {
    amount: number;
    description: string;
    paidById: string;
    participantIds: string[];
  }) => void;
  onCancel: () => void;
}

export default function ExpenseForm({
  members,
  currentUserId,
  onAdd,
  onCancel,
}: ExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paidById, setPaidById] = useState(currentUserId || members[0]?.userId || "");
  const [participantIds, setParticipantIds] = useState<string[]>(
    members.map((m) => m.userId)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !paidById || participantIds.length === 0) return;

    onAdd({
      amount: parseFloat(amount),
      description,
      paidById,
      participantIds,
    });
  };

  const toggleParticipant = (userId: string) => {
    setParticipantIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-indigo-100 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">費用を追加する</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">金額 (円)</label>
            <input
              type="number"
              placeholder="3000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-lg"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">内容</label>
            <input
              type="text"
              placeholder="ランチ代、タクシーなど"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">支払った人</label>
          <select
            value={paidById}
            onChange={(e) => setPaidById(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {members.map((m) => (
              <option key={m.userId} value={m.userId}>
                {m.user.name || m.user.email.split("@")[0]} {m.userId === currentUserId ? "(自分)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
            割り勘の対象 (均等に割ります)
          </label>
          <div className="flex flex-wrap gap-2">
            {members.map((m) => (
              <button
                key={m.userId}
                type="button"
                onClick={() => toggleParticipant(m.userId)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  participantIds.includes(m.userId)
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-gray-200 text-gray-500 hover:border-indigo-300"
                }`}
              >
                <User size={14} />
                {m.user.name || m.user.email.split("@")[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1 py-6 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold">
            追加する
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="px-6 py-6 border-gray-200 rounded-xl">
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  );
}
