"use client";
import { useState } from "react";
import {
  Lock, LayoutDashboard, Users, Briefcase, Coins,
  TrendingUp, Star, Trophy,
} from "lucide-react";
import { MOCK_PATIENT_TRANSACTIONS, MOCK_CAREGIVERS, getCaregiverTier } from "@/lib/mockData";
import { TierBadge } from "@/components/ui/TierBadge";
import { formatBaht } from "@/lib/utils";

const ADMIN_PIN = "db2025";

// MOCK: computed from mock transaction data
const PLATFORM_FEE_TOTAL = MOCK_PATIENT_TRANSACTIONS.reduce((s, tx) => s + tx.platformFee, 0);
const JOBS_TOTAL = MOCK_PATIENT_TRANSACTIONS.length;

function buildTopCaregivers() {
  const map = new Map<string, { jobs: number; earnings: number }>();
  for (const tx of MOCK_PATIENT_TRANSACTIONS) {
    const cur = map.get(tx.caregiverName) ?? { jobs: 0, earnings: 0 };
    map.set(tx.caregiverName, { jobs: cur.jobs + 1, earnings: cur.earnings + tx.basePay });
  }
  return Array.from(map.entries())
    .map(([name, stats]) => {
      const info = MOCK_CAREGIVERS.find((c) => c.name === name);
      return { name, ...stats, rating: info?.rating ?? 4.5, tier: getCaregiverTier(name) };
    })
    .sort((a, b) => b.earnings - a.earnings)
    .slice(0, 5);
}

const TOP_CAREGIVERS = buildTopCaregivers();
const RECENT_TRANSACTIONS = MOCK_PATIENT_TRANSACTIONS.slice(0, 5);

function StatCard({
  icon, label, value, subLabel, color,
}: {
  icon: React.ReactNode; label: string; value: string; subLabel?: string; color: string;
}) {
  return (
    <div className={`rounded-2xl p-5 border shadow-ambient ${color}`}>
      <div className="mb-3">{icon}</div>
      <div className="text-2xl font-extrabold text-on-background mb-0.5">{value}</div>
      <div className="text-sm font-body text-on-surface-variant">{label}</div>
      {subLabel && <div className="text-xs text-on-surface-variant mt-0.5">{subLabel}</div>}
    </div>
  );
}

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setUnlocked(true);
    } else {
      setPinError(true);
      setPin("");
      setTimeout(() => setPinError(false), 1600);
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-surface-container-lowest rounded-[2rem] p-10 shadow-ambient ghost-border w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold font-headline text-on-background mb-1">Admin Dashboard</h1>
          <p className="text-on-surface-variant font-body mb-8 text-sm">กรอก PIN เพื่อเข้าใช้งาน</p>
          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••"
              autoFocus
              className={`w-full text-center text-2xl tracking-[0.4em] rounded-xl border px-4 py-4 bg-surface-container-low focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all ${
                pinError ? "border-error ring-4 ring-error/20" : "border-outline-variant/20"
              }`}
            />
            {pinError && <p className="text-error text-sm font-bold">PIN ไม่ถูกต้อง</p>}
            <button
              type="submit"
              className="w-full bg-primary text-on-primary font-bold rounded-xl py-4 hover:bg-primary-dim transition-colors"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Sticky header */}
      <div className="bg-surface-container-lowest shadow-ambient ghost-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <span className="font-extrabold font-headline text-on-background">DialyBuddy — Admin</span>
          </div>
          <span className="text-xs text-on-surface-variant font-body bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant/20">
            ข้อมูลตัวอย่าง
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8 space-y-10">
        {/* Platform overview stats */}
        <section>
          <h2 className="text-xl font-bold font-headline text-on-background mb-4">ภาพรวมแพลตฟอร์ม</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Users className="w-6 h-6 text-blue-600" />}
              label="ผู้ดูแลที่ลงทะเบียน"
              value={`${MOCK_CAREGIVERS.length} คน`}
              color="bg-blue-50 border-blue-200"
            />
            <StatCard
              icon={<Briefcase className="w-6 h-6 text-emerald-600" />}
              label="งานที่สำเร็จ"
              value={`${JOBS_TOTAL} ครั้ง`}
              subLabel="จากข้อมูลตัวอย่าง"
              color="bg-emerald-50 border-emerald-200"
            />
            <StatCard
              icon={<Coins className="w-6 h-6 text-amber-600" />}
              label="รายได้แพลตฟอร์ม (15%)"
              value={`฿ ${formatBaht(PLATFORM_FEE_TOTAL)}`}
              color="bg-amber-50 border-amber-200"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6 text-indigo-600" />}
              label="ค่าเฉลี่ยต่องาน"
              value={`฿ ${formatBaht(Math.round(PLATFORM_FEE_TOTAL / JOBS_TOTAL))}`}
              color="bg-indigo-50 border-indigo-200"
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top 5 caregivers */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-bold font-headline text-on-background">ผู้ดูแลยอดเยี่ยม (Top 5)</h2>
            </div>
            <div className="space-y-3">
              {TOP_CAREGIVERS.map((cg, i) => (
                <div
                  key={cg.name}
                  className="bg-surface-container-lowest rounded-2xl px-5 py-4 ghost-border shadow-ambient flex items-center gap-4"
                >
                  <span className="w-7 text-center font-extrabold text-on-surface-variant shrink-0">{i + 1}</span>
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-sm">{cg.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-background truncate">{cg.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <TierBadge tier={cg.tier} size="xs" />
                      <span className="text-xs text-on-surface-variant">{cg.jobs} งาน</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-on-background">฿ {formatBaht(cg.earnings)}</div>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-on-surface-variant">{cg.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent transactions */}
          <section>
            <h2 className="text-xl font-bold font-headline text-on-background mb-4">ธุรกรรมล่าสุด</h2>
            <div className="space-y-3">
              {RECENT_TRANSACTIONS.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-surface-container-lowest rounded-2xl px-5 py-4 ghost-border shadow-ambient"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-background truncate">{tx.caregiverName}</p>
                      <p className="text-xs text-on-surface-variant truncate mt-0.5">{tx.destination}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{tx.date}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-extrabold text-emerald-600">฿ {formatBaht(tx.totalPaid)}</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">
                        ค่าธรรมเนียม ฿ {formatBaht(tx.platformFee)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
