"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, MapPin, Share2, Copy, RefreshCw, Clock, Wallet, ArrowRight, Trash2, ChevronLeft, Edit2 } from "lucide-react";
import { Trip, Spot, Expense } from "@/types";
import SpotCard from "@/components/SpotCard";
import SpotForm from "@/components/SpotForm";
import ExpenseForm from "@/components/ExpenseForm";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TripDetailClientProps {
  trip: Trip & {
    members: { userId: string; role: string; user: { email: string; name?: string | null } }[];
    inviteToken?: string;
  };
  initialSpots: Spot[];
  initialExpenses: Expense[];
  session: Session | null;
}

export default function TripDetailClient({
  trip: initialTrip,
  initialSpots,
  initialExpenses,
  session,
}: TripDetailClientProps) {
  const [trip, setTrip] = useState(initialTrip);
  const [spots, setSpots] = useState<Spot[]>(initialSpots);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isAddingSpot, setIsAddingSpot] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(initialTrip.title);
  
  // スケジュール管理用のステート
  const [activeDay, setActiveDay] = useState<number | "all">(0); // 0は未定

  const myMembership = trip.members.find((m) => m.userId === session?.user?.id);
  const isOwner = myMembership?.role === "OWNER";
  const isMember = !!myMembership;

  const handleUpdateTripTitle = async () => {
    if (!editedTitle.trim() || editedTitle === trip.title) {
      setIsEditingTitle(false);
      setEditedTitle(trip.title);
      return;
    }

    try {
      const res = await fetch(`/api/trips/${trip.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editedTitle }),
      });
      if (res.ok) {
        const updatedTrip = await res.json();
        setTrip(prev => ({ ...prev, title: updatedTrip.title }));
        setIsEditingTitle(false);
      }
    } catch (error) {
      console.error(error);
      alert("タイトルの更新に失敗しました。");
    }
  };

  // 精算アルゴリズム
  const settlements = useMemo(() => {
    const balances: Record<string, number> = {};
    trip.members.forEach(m => balances[m.userId] = 0);

    expenses.forEach(exp => {
      const perPersonAmount = exp.amount / exp.participants.length;
      if (balances[exp.paidById] !== undefined) balances[exp.paidById] += exp.amount;
      exp.participants.forEach(p => {
        if (balances[p.userId] !== undefined) balances[p.userId] -= perPersonAmount;
      });
    });

    const creditors = Object.entries(balances)
      .filter(([, bal]) => bal > 0.01)
      .sort(([, a], [, b]) => b - a);
    const debtors = Object.entries(balances)
      .filter(([, bal]) => bal < -0.01)
      .map(([id, bal]) => [id, Math.abs(bal)] as [string, number])
      .sort(([, a], [, b]) => b - a);

    const results: { from: string; to: string; amount: number }[] = [];
    
    let cIdx = 0;
    let dIdx = 0;

    while (cIdx < creditors.length && dIdx < debtors.length) {
      const [cId, cAmount] = creditors[cIdx];
      const [dId, dAmount] = debtors[dIdx];
      
      const settlementAmount = Math.min(cAmount, dAmount);
      results.push({
        from: dId,
        to: cId,
        amount: Math.round(settlementAmount)
      });

      creditors[cIdx][1] -= settlementAmount;
      debtors[dIdx][1] -= settlementAmount;

      if (creditors[cIdx][1] < 0.01) cIdx++;
      if (debtors[dIdx][1] < 0.01) dIdx++;
    }
    return results;
  }, [expenses, trip.members]);

  const maxDay = useMemo(() => {
    const daysInSpots = spots.map(s => s.day || 0);
    return Math.max(3, ...daysInSpots);
  }, [spots]);

  const days = useMemo(() => {
    const d = [];
    for (let i = 1; i <= maxDay; i++) d.push(i);
    return d;
  }, [maxDay]);

  const filteredSpots = useMemo(() => {
    if (activeDay === "all") return spots;
    return spots.filter(s => (s.day || 0) === (activeDay === 0 ? 0 : activeDay));
  }, [spots, activeDay]);

  const handleAddSpot = async (
    newSpotData: Partial<Spot>
  ) => {
    try {
      const res = await fetch(`/api/trips/${trip.id}/spots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newSpotData, tripId: trip.id }),
      });
      if (res.ok) {
        const savedSpot = await res.json();
        setSpots(prev => [...prev, savedSpot].sort((a, b) => {
          if ((a.day || 0) !== (b.day || 0)) return (a.day || 0) - (b.day || 0);
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }));
        setIsAddingSpot(false);
      } else {
        const errorData = await res.json();
        alert(`追加に失敗しました: ${errorData.error || "不明なエラー"}`);
      }
    } catch (error) { 
      console.error(error);
      alert("通信エラーが発生しました。");
    }
  };

  const handleUpdateSpot = async (spotId: string, updatedData: Partial<Spot>) => {
    try {
      const res = await fetch(`/api/trips/${trip.id}/spots/${spotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        const updatedSpot = await res.json();
        setSpots(prev => prev.map(s => s.id === spotId ? updatedSpot : s).sort((a, b) => {
          if ((a.day || 0) !== (b.day || 0)) return (a.day || 0) - (b.day || 0);
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddExpense = async (data: {
    amount: number;
    description: string;
    paidById: string;
    participantIds: string[];
  }) => {
    try {
      const res = await fetch(`/api/trips/${trip.id}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const savedExpense = await res.json();
        setExpenses(prev => [savedExpense, ...prev]);
        setIsAddingExpense(false);
      }
    } catch (error) { console.error(error); }
  };

  const handleUpdateExpense = async (expenseId: string, data: {
    amount: number;
    description: string;
    paidById: string;
    participantIds: string[];
  }) => {
    try {
      const res = await fetch(`/api/trips/${trip.id}/expenses/${expenseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updatedExpense = await res.json();
        setExpenses(prev => prev.map(e => e.id === expenseId ? updatedExpense : e));
        setEditingExpenseId(null);
      }
    } catch (error) { console.error(error); }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm("削除しますか？")) return;
    try {
      const res = await fetch(`/api/trips/${trip.id}/expenses/${expenseId}`, { method: "DELETE" });
      if (res.ok) setExpenses(expenses.filter(e => e.id !== expenseId));
    } catch (error) { console.error(error); }
  };

  const handleDeleteSpot = async (spotId: string) => {
    if (!confirm("削除しますか？")) return;
    try {
      const res = await fetch(`/api/trips/${trip.id}/spots/${spotId}`, { method: "DELETE" });
      if (res.ok) setSpots(spots.filter((s) => s.id !== spotId));
    } catch (error) { console.error(error); }
  };

  const generateInviteLink = async () => {
    setIsGeneratingToken(true);
    try {
      const res = await fetch(`/api/trips/${trip.id}/invite`, { method: "POST" });
      const data = await res.json();
      if (data.inviteToken) setTrip({ ...trip, inviteToken: data.inviteToken });
    } catch (error) { console.error(error); } finally { setIsGeneratingToken(false); }
  };

  const copyInviteLink = () => {
    if (!trip.inviteToken) return;
    const url = `${window.location.origin}/trip/${trip.id}/join?token=${trip.inviteToken}`;
    navigator.clipboard.writeText(url);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* ヒーローヘッダー */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-indigo-600 mb-6 hover:translate-x-1 transition-transform">
            <ChevronLeft size={16} /> 旅行一覧に戻る
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="amber" className="px-3 py-1 text-[10px] uppercase font-black tracking-widest">
                  Trip Plan
                </Badge>
                <span className="text-xs font-bold text-gray-400">
                  {new Date(trip.createdAt).toLocaleDateString("ja-JP")} 作成
                </span>
              </div>
              
              {isEditingTitle ? (
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight bg-white border-b-2 border-indigo-500 focus:outline-none w-full max-w-xl py-1"
                    autoFocus
                    onBlur={handleUpdateTripTitle}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdateTripTitle()}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 mb-4 group">
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                    {trip.title}
                  </h1>
                  {isMember && (
                    <button 
                      onClick={() => setIsEditingTitle(true)}
                      className="text-gray-300 hover:text-indigo-500 transition-colors p-1"
                    >
                      <Edit2 size={24} />
                    </button>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 mr-2">
                  {trip.members.map((m) => (
                    <Avatar key={m.userId} className="border-2 border-white w-8 h-8">
                      <AvatarFallback className="bg-indigo-100 text-indigo-600 text-[10px] font-bold">
                        {(m.user.name || m.user.email)[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-500">
                  {trip.members.length}人のメンバーが参加中
                </span>
              </div>
            </div>

            {isOwner && (
              <div className="flex flex-col items-end gap-3 max-w-xs text-right">
                {!trip.inviteToken ? (
                  <>
                    <p className="text-xs font-bold text-gray-400">
                      友だちを招待して一緒に計画を立てましょう
                    </p>
                    <Button onClick={generateInviteLink} disabled={isGeneratingToken} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold px-6 shadow-md whitespace-nowrap">
                      <Share2 size={18} className="mr-2" /> 招待リンクを発行
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-bold text-indigo-500 leading-relaxed">
                      招待URLを発行しました！<br />
                      コピーしたURLを友だちに送って招待しましょう
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={copyInviteLink} variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-xl font-bold px-6 shadow-sm whitespace-nowrap h-12">
                        {isCopying ? "URLをコピーしました！" : <><Copy size={18} className="mr-2" /> 招待URLをコピー</>}
                      </Button>
                      <Button 
                        onClick={generateInviteLink} 
                        variant="ghost" 
                        size="icon"
                        disabled={isGeneratingToken}
                        className="h-12 w-12 rounded-xl text-gray-300 hover:text-indigo-600 hover:bg-white"
                        title="URLを再生成（古いURLは無効になります）"
                      >
                        <RefreshCw size={18} className={isGeneratingToken ? "animate-spin" : ""} />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-gray-100/50 rounded-2xl mb-10">
            <TabsTrigger value="schedule" className="rounded-xl font-black text-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Clock size={20} className="mr-2" /> スケジュール
            </TabsTrigger>
            <TabsTrigger value="expenses" className="rounded-xl font-black text-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Wallet size={20} className="mr-2" /> 精算・割り勘
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full no-scrollbar">
                <Button 
                  variant={activeDay === "all" ? "default" : "ghost"}
                  onClick={() => setActiveDay("all")}
                  className={`rounded-xl font-bold ${activeDay === "all" ? "bg-indigo-600 shadow-lg shadow-indigo-100" : "text-gray-500"}`}
                >
                  すべて
                </Button>
                <Button 
                  variant={activeDay === 0 ? "default" : "ghost"}
                  onClick={() => setActiveDay(0)}
                  className={`rounded-xl font-bold ${activeDay === 0 ? "bg-indigo-600 shadow-lg shadow-indigo-100" : "text-gray-500"}`}
                >
                  未定
                </Button>
                {days.map(d => (
                  <Button 
                    key={d}
                    variant={activeDay === d ? "default" : "ghost"}
                    onClick={() => setActiveDay(d)}
                    className={`rounded-xl font-bold ${activeDay === d ? "bg-indigo-600 shadow-lg shadow-indigo-100" : "text-gray-500"}`}
                  >
                    {d}日目
                  </Button>
                ))}
              </div>
              {isMember && (
                <Button 
                  onClick={() => setIsAddingSpot(true)} 
                  size="lg" 
                  className="w-full md:w-auto px-8 py-6 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center whitespace-nowrap text-lg"
                >
                  <Plus size={24} className="mr-2 shrink-0" /> 場所を追加
                </Button>
              )}
            </div>

            {isAddingSpot && (
              <div className="mb-8">
                <SpotForm tripId={trip.id} onSubmit={handleAddSpot} onCancel={() => setIsAddingSpot(false)} defaultDay={activeDay === "all" ? 0 : activeDay} />
              </div>
            )}

            <div className="grid grid-cols-1 gap-6">
              {filteredSpots.length === 0 ? (
                <Card className="p-20 text-center border-2 border-dashed border-gray-100 bg-transparent rounded-3xl">
                  <MapPin size={48} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-lg font-bold text-gray-300">この日の予定はまだありません</p>
                </Card>
              ) : (
                filteredSpots.map((spot) => (
                  <SpotCard key={spot.id} spot={spot} onDelete={handleDeleteSpot} onUpdate={handleUpdateSpot} isMember={isMember} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">費用の管理</h2>
              {isMember && (
                <Button onClick={() => setIsAddingExpense(true)} size="lg" className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black shadow-xl shadow-indigo-100 transition-all active:scale-95">
                  <Plus size={24} className="mr-2" /> 費用を追加
                </Button>
              )}
            </div>

            {isAddingExpense && (
              <ExpenseForm members={trip.members} currentUserId={session?.user?.id} onSubmit={handleAddExpense} onCancel={() => setIsAddingExpense(false)} />
            )}

            {settlements.length > 0 && (
              <Card className="bg-gray-900 border-none rounded-[2rem] shadow-2xl overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-white text-xl font-black flex items-center gap-2">
                    <Wallet className="text-indigo-400" /> 最終的な精算リスト
                  </CardTitle>
                  <CardDescription className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                    Minimal Transactions
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-4">
                  {settlements.map((s, i) => {
                    const fromName = trip.members.find(m => m.userId === s.from)?.user.name || "メンバー";
                    const toName = trip.members.find(m => m.userId === s.to)?.user.name || "メンバー";
                    return (
                      <div key={i} className="flex items-center justify-between bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="font-black text-white">{fromName}</span>
                          <ArrowRight size={16} className="text-indigo-500" />
                          <span className="font-black text-white">{toName}</span>
                        </div>
                        <div className="text-2xl font-black text-indigo-400 tracking-tighter">
                          ¥{s.amount.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] px-2">Expense History</h3>
              {expenses.length === 0 ? (
                <Card className="p-20 text-center border-2 border-dashed border-gray-100 bg-transparent rounded-3xl">
                  <p className="text-lg font-bold text-gray-300">まだ費用の記録がありません</p>
                </Card>
              ) : (
                expenses.map((exp) => (
                  <div key={exp.id}>
                    {editingExpenseId === exp.id ? (
                      <ExpenseForm
                        members={trip.members}
                        currentUserId={session?.user?.id}
                        initialData={exp}
                        mode="edit"
                        onSubmit={(data) => handleUpdateExpense(exp.id, data)}
                        onCancel={() => setEditingExpenseId(null)}
                      />
                    ) : (
                      <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl group overflow-hidden">
                        <CardContent className="p-0 flex flex-row items-stretch">
                          <div className="bg-indigo-50 p-3 md:p-6 flex flex-col items-center justify-center min-w-[70px] md:min-w-[100px]">
                            <span className="text-[10px] font-black text-indigo-400 uppercase">{new Date(exp.date).toLocaleDateString("ja-JP", { month: "short" })}</span>
                            <span className="text-lg md:text-xl font-black text-indigo-600">{new Date(exp.date).getDate()}</span>
                          </div>
                          <div className="flex-1 p-4 md:p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-black text-gray-800 text-base md:text-lg mb-1 truncate">{exp.description}</h4>
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className="text-[10px] font-bold py-0 h-5 border-gray-200 text-gray-500 max-w-[150px] truncate">
                                  支払者: {exp.paidBy?.name || exp.paidBy?.email.split('@')[0]}
                                </Badge>
                                <span className="text-[10px] font-bold text-gray-300">{exp.participants.length}人の割り勘</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-4">
                              <div className="text-left md:text-right">
                                <div className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter">¥{exp.amount.toLocaleString()}</div>
                                <div className="text-[10px] font-bold text-gray-400">一人あたり ¥{Math.round(exp.amount / exp.participants.length).toLocaleString()}</div>
                              </div>
                              {isMember && (
                                <div className="flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all">
                                  <Button onClick={() => setEditingExpenseId(exp.id)} variant="ghost" size="icon" className="h-10 w-10 text-gray-500 md:text-gray-200 hover:text-indigo-500 hover:bg-indigo-50">
                                    <Edit2 className="h-5 w-5 md:h-[18px] md:w-[18px]" />
                                  </Button>
                                  <Button onClick={() => handleDeleteExpense(exp.id)} variant="ghost" size="icon" className="h-10 w-10 text-gray-500 md:text-gray-200 hover:text-red-500 hover:bg-red-50">
                                    <Trash2 className="h-5 w-5 md:h-[18px] md:w-[18px]" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
