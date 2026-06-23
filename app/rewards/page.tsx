"use client";

import { useState, useEffect } from "react";
import { Gift, Star, Zap, Crown, ChevronRight, ShieldCheck, CalendarDays } from "lucide-react";
import { PatientPageShell } from "@/components/layout/PatientPageShell";
import { MOCK_PATIENT_TRANSACTIONS } from "@/lib/mockData";
import type { PatientTransaction } from "@/types";
import { formatBaht } from "@/lib/utils";

interface Tier {
  name: string;
  minPoints: number;
  color: string;
  bg: string;
  border: string;
  icon: typeof Star;
}

const TIERS: Tier[] = [
  { name: "Bronze", minPoints: 0, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", icon: Star },
  { name: "Silver", minPoints: 500, color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200", icon: Zap },
  { name: "Gold", minPoints: 1000, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200", icon: Crown },
];

const CATALOG = [
  { points: 200, reward: "ส่วนลด ฿20 สำหรับการจองครั้งถัดไป", badge: "ยอดนิยม" },
  { points: 500, reward: "ส่วนลด ฿50 สำหรับการจองครั้งถัดไป", badge: "" },
  { points: 1000, reward: "ค่าธรรมเนียมฟรี 1 ครั้ง (มูลค่าสูงสุด ฿200)", badge: "สุดคุ้ม" },
  { points: 1500, reward: "อัปเกรด Premium ฟรี 1 เดือน", badge: "" },
];

function loadTransactions(): PatientTransaction[] {
  const stored = localStorage.getItem("patientTransactions");
  if (!stored) return MOCK_PATIENT_TRANSACTIONS;
  try {
    const parsed = JSON.parse(stored) as PatientTransaction[];
    return parsed.length > 0 ? parsed : MOCK_PATIENT_TRANSACTIONS;
  } catch {
    return MOCK_PATIENT_TRANSACTIONS;
  }
}

function getTier(points: number): Tier {
  return [...TIERS].reverse().find((t) => points >= t.minPoints) ?? TIERS[0];
}

function getNextTier(points: number): Tier | null {
  return TIERS.find((t) => t.minPoints > points) ?? null;
}

export default function RewardsPage() {
  const [transactions, setTransactions] = useState<PatientTransaction[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [redeemMsg, setRedeemMsg] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTransactions(loadTransactions());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInitialized(true);
  }, []);

  if (!initialized) return null;

  const totalSpent = transactions.reduce((s, t) => s + t.totalPaid, 0);
  const points = Math.floor(totalSpent / 10); // 1 point per ฿10
  const tier = getTier(points);
  const nextTier = getNextTier(points);
  const progress = nextTier
    ? Math.round(((points - tier.minPoints) / (nextTier.minPoints - tier.minPoints)) * 100)
    : 100;

  const TierIcon = tier.icon;

  const handleRedeem = (item: typeof CATALOG[0]) => {
    if (points < item.points) return;
    setRedeemMsg(`แลกรางวัล "${item.reward}" สำเร็จ! รหัสส่วนลดจะส่งทาง SMS ภายใน 24 ชม.`);
    setTimeout(() => setRedeemMsg(""), 5000);
  };

  return (
    <PatientPageShell maxWidth="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Gift className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold font-headline text-on-background">รางวัลสะสม</h1>
          <p className="text-base text-on-surface-variant font-body">แต้มสะสมจากทุกการจองกับ Dialybuddy</p>
        </div>
      </div>

      {redeemMsg && (
        <div className="mt-4 bg-primary/10 border border-primary/20 rounded-2xl px-5 py-4 text-sm text-primary font-bold">
          {redeemMsg}
        </div>
      )}

      {/* Points hero card */}
      <div className={`mt-8 rounded-[2rem] p-8 ${tier.bg} border ${tier.border} flex flex-col sm:flex-row sm:items-center gap-6`}>
        <div className="flex-1">
          <div className={`flex items-center gap-2 mb-1 ${tier.color}`}>
            <TierIcon className="w-5 h-5" />
            <span className="text-sm font-bold font-label uppercase tracking-wider">{tier.name} Member</span>
          </div>
          <p className="text-6xl font-extrabold font-headline text-on-background">{points.toLocaleString("th-TH")}</p>
          <p className="text-on-surface-variant font-body text-sm mt-1">แต้มสะสม • จากยอดใช้จ่าย ฿{formatBaht(totalSpent)}</p>
        </div>

        {/* Progress to next tier */}
        {nextTier && (
          <div className="sm:w-56 shrink-0">
            <p className="text-xs font-bold font-label text-on-surface-variant mb-2">
              อีก {(nextTier.minPoints - points).toLocaleString("th-TH")} แต้ม → {nextTier.name}
            </p>
            <div className="h-2.5 bg-white/60 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${tier.color.replace("text-", "bg-")}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-on-surface-variant mt-1 text-right">{progress}%</p>
          </div>
        )}
        {!nextTier && (
          <div className="sm:w-56 shrink-0 text-center">
            <Crown className="w-8 h-8 text-amber-500 mx-auto mb-1" />
            <p className="text-xs font-bold text-amber-700">คุณอยู่ระดับสูงสุดแล้ว!</p>
          </div>
        )}
      </div>

      {/* How to earn */}
      <div className="mt-8 bg-surface-container-lowest rounded-2xl ghost-border p-6">
        <h2 className="text-base font-bold font-headline text-on-background mb-4">วิธีสะสมแต้ม</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-on-background">จองผู้ดูแล</p>
              <p className="text-xs text-on-surface-variant">1 แต้ม ต่อทุก ฿10 ที่ชำระ</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-400/20 rounded-xl flex items-center justify-center shrink-0">
              <Crown className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-on-background">สมาชิก Premium</p>
              <p className="text-xs text-on-surface-variant">รับแต้ม 2 เท่าในทุกการจอง</p>
            </div>
          </div>
        </div>
      </div>

      {/* Redemption catalog */}
      <div className="mt-8">
        <h2 className="text-xl font-bold font-headline text-on-background mb-4">แลกของรางวัล</h2>
        <div className="space-y-3">
          {CATALOG.map((item) => {
            const canRedeem = points >= item.points;
            return (
              <div
                key={item.reward}
                className={`flex items-center gap-5 rounded-2xl p-5 border transition-all ${
                  canRedeem
                    ? "bg-surface-container-lowest ghost-border shadow-ambient"
                    : "bg-surface-container-low border-outline-variant/10 opacity-60"
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${canRedeem ? "bg-primary/10" : "bg-surface-container-high"}`}>
                  <Gift className={`w-5 h-5 ${canRedeem ? "text-primary" : "text-on-surface-variant"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-on-background">{item.reward}</p>
                    {item.badge && (
                      <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{item.badge}</span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 font-label font-bold ${canRedeem ? "text-primary" : "text-on-surface-variant"}`}>
                    {item.points.toLocaleString("th-TH")} แต้ม
                  </p>
                </div>
                <button
                  onClick={() => handleRedeem(item)}
                  disabled={!canRedeem}
                  className={`flex items-center gap-1.5 text-sm font-bold font-label px-4 py-2.5 rounded-xl shrink-0 transition-colors ${
                    canRedeem
                      ? "bg-primary text-on-primary hover:brightness-105"
                      : "bg-surface-container text-on-surface-variant cursor-not-allowed"
                  }`}
                >
                  แลก
                  {canRedeem && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction history as points log */}
      <div className="mt-8 mb-4">
        <h2 className="text-xl font-bold font-headline text-on-background mb-4">ประวัติการสะสมแต้ม</h2>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((tx) => {
            const earned = Math.floor(tx.totalPaid / 10);
            return (
              <div key={tx.id} className="flex items-center gap-4 bg-surface-container-lowest rounded-2xl ghost-border px-5 py-4">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <CalendarDays className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-on-background truncate">{tx.caregiverName} — {tx.destination}</p>
                  <p className="text-xs text-on-surface-variant">{tx.date} • ชำระ ฿{formatBaht(tx.totalPaid)}</p>
                </div>
                <span className="text-sm font-extrabold text-primary shrink-0">+{earned} แต้ม</span>
              </div>
            );
          })}
          {transactions.length > 5 && (
            <p className="text-center text-xs text-on-surface-variant pt-1">และอีก {transactions.length - 5} รายการ</p>
          )}
        </div>
      </div>

      {/* Tier table */}
      <div className="mt-8 bg-surface-container-lowest rounded-2xl ghost-border overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/15">
          <h2 className="text-base font-bold font-headline text-on-background">ระดับสมาชิก</h2>
        </div>
        <div className="divide-y divide-outline-variant/10">
          {TIERS.map((t) => {
            const Icon = t.icon;
            const isActive = tier.name === t.name;
            return (
              <div key={t.name} className={`flex items-center gap-4 px-6 py-4 ${isActive ? t.bg : ""}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.bg}`}>
                  <Icon className={`w-4 h-4 ${t.color}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${isActive ? t.color : "text-on-background"}`}>
                    {t.name} {isActive && "← ระดับของคุณ"}
                  </p>
                  <p className="text-xs text-on-surface-variant">{t.minPoints.toLocaleString("th-TH")} แต้มขึ้นไป</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PatientPageShell>
  );
}
