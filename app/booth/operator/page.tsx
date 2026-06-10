// TODO: PIN (2505) is hardcoded. Replace with Supabase auth or
// Next.js middleware-based session before any real deployment.
// RLS policy currently allows public read — restrict to authenticated users in production.

"use client";

import { useState, useEffect } from "react";
import { Lock, Users, Activity, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Only the 4 columns this page needs — avoids pulling analysis_result/meal_plan JSON for every row.
type Visit = {
  id: string;
  visitor_number: number;
  sample_id: string;
  created_at: string;
};

// Human-readable Thai condition names — booth-UI-specific, kept separate from sampleResults.ts.
const SAMPLE_LABELS: Record<string, string> = {
  SAMPLE_001: "โพแทสเซียมสูง",
  SAMPLE_002: "ฟอสฟอรัสสูง",
  SAMPLE_003: "ค่าปกติ",
};

// /20 opacity tint + /30 border gives readable contrast on the slate-800 dark background.
const SAMPLE_BADGE_STYLES: Record<string, string> = {
  SAMPLE_001: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  SAMPLE_002: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  SAMPLE_003: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
};

// Same /20 tint pattern for stat cards — keeps the dark-theme palette consistent.
const STAT_COLORS: Record<string, string> = {
  blue: "bg-blue-500/20 border-blue-500/30 text-blue-400",
  orange: "bg-orange-500/20 border-orange-500/30 text-orange-400",
  purple: "bg-purple-500/20 border-purple-500/30 text-purple-400",
  emerald: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
};

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${STAT_COLORS[color]}`}>
      <div className="flex items-center gap-2 mb-2 opacity-80">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-4xl font-black">{value}</p>
    </div>
  );
}

export default function BoothOperatorPage() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  // Flash state: turns the lock icon red for 2 seconds on a wrong PIN, then resets.
  const [pinError, setPinError] = useState(false);
  // Ordered newest-first so new real-time arrivals can be prepended at index 0.
  const [visits, setVisits] = useState<Visit[]>([]);

  const handlePinSubmit = () => {
    if (pin === "2505") {
      setUnlocked(true);
    } else {
      setPinError(true);
      setPin("");
      setTimeout(() => setPinError(false), 2000);
    }
  };

  useEffect(() => {
    // Guard: do nothing until the PIN has been validated.
    if (!unlocked) return;

    // Initial fetch: loads existing rows immediately so the operator sees history, not just future events.
    supabase
      .from("demo_uploads")
      .select("id, visitor_number, sample_id, created_at")
      .order("created_at", { ascending: false })
      // 100-row cap is safe; a single demo session won't generate more visits than this.
      .limit(100)
      .then(({ data }) => {
        if (data) setVisits(data as Visit[]);
      });

    // Real-time subscription — INSERT only, since updates/deletes are irrelevant for this display.
    const channel = supabase
      .channel("demo_uploads_live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "demo_uploads" },
        (payload) => {
          // Prepend so the newest visit always appears at the top of the list.
          setVisits((prev) => [payload.new as Visit, ...prev]);
        }
      )
      .subscribe();

    // Cleanup removes the Postgres listener when the component unmounts to prevent memory leaks.
    return () => {
      supabase.removeChannel(channel);
    };
  // [unlocked]: runs exactly once when the PIN is validated — never before, never again.
  }, [unlocked]);

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-[2rem] p-10 w-full max-w-sm text-center shadow-2xl border border-slate-700">
          {/* Lock icon flashes red on a wrong PIN attempt via pinError state. */}
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors ${
              pinError ? "bg-red-500" : "bg-blue-600"
            }`}
          >
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">บูธผู้ดำเนินงาน</h1>
          <p className="text-slate-400 mb-8 text-sm">กรอก PIN 4 หลักเพื่อเข้าถึงระบบ</p>

          {/* inputMode="numeric" shows a numeric keyboard on mobile without restricting desktop input. */}
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            // Replace non-digits client-side so the PIN field only ever contains numbers.
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
            className={`w-full text-center text-3xl font-bold tracking-[1rem] bg-slate-700 text-white rounded-xl p-4 border-2 mb-4 outline-none transition-colors ${
              pinError
                ? "border-red-500"
                : "border-slate-600 focus:border-blue-500"
            }`}
            placeholder="····"
            autoFocus
          />

          {pinError && (
            <p className="text-red-400 text-sm mb-4">PIN ไม่ถูกต้อง กรุณาลองใหม่</p>
          )}

          {/* Disabled until exactly 4 digits are entered — prevents premature submissions. */}
          <button
            onClick={handlePinSubmit}
            disabled={pin.length !== 4}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-4 rounded-xl transition-all active:scale-95"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  // Stats derived client-side from the visits array — avoids extra Supabase queries.
  const total = visits.length;
  const highKCount = visits.filter((v) => v.sample_id === "SAMPLE_001").length;
  const highPCount = visits.filter((v) => v.sample_id === "SAMPLE_002").length;
  const normalCount = visits.filter((v) => v.sample_id === "SAMPLE_003").length;

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              DialyBuddy Demo Booth
            </h1>
            <p className="text-slate-400 text-sm mt-1">บูธสาธิตสด · อัปเดตแบบ Real-time</p>
          </div>
          {/* self-start prevents the badge from stretching full-width when it stacks on mobile. */}
          <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-2 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold text-sm">LIVE</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <StatCard
            label="ผู้เยี่ยมชมทั้งหมด"
            value={total}
            icon={<Users className="w-4 h-4" />}
            color="blue"
          />
          <StatCard
            label="โพแทสเซียมสูง"
            value={highKCount}
            icon={<AlertCircle className="w-4 h-4" />}
            color="orange"
          />
          <StatCard
            label="ฟอสฟอรัสสูง"
            value={highPCount}
            icon={<Activity className="w-4 h-4" />}
            color="purple"
          />
          <StatCard
            label="ค่าปกติ"
            value={normalCount}
            icon={<CheckCircle className="w-4 h-4" />}
            color="emerald"
          />
        </div>

        {/* Visit Log */}
        <div className="bg-slate-800 rounded-[2rem] overflow-hidden border border-slate-700">
          <div className="p-5 md:p-6 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-bold text-white">ประวัติการเยี่ยมชม</h2>
            <span className="text-slate-500 text-sm">{total} รายการ</span>
          </div>

          {visits.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              ยังไม่มีผู้เยี่ยมชม รอสักครู่...
            </div>
          ) : (
            // max-h-[60vh]: caps list height so the stat cards always stay visible above the fold.
            <div className="divide-y divide-slate-700/50 max-h-[60vh] overflow-y-auto">
              {visits.map((visit, index) => (
                <div
                  key={visit.id}
                  // index === 0 highlights the most recent arrival without storing extra state.
                  className={`flex items-center gap-4 p-4 md:p-5 transition-colors ${
                    index === 0 ? "bg-blue-500/10" : "hover:bg-slate-700/30"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm shrink-0">
                    #{visit.visitor_number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm">
                      {SAMPLE_LABELS[visit.sample_id] ?? visit.sample_id}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(visit.created_at).toLocaleTimeString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 ${
                      SAMPLE_BADGE_STYLES[visit.sample_id] ??
                      "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {visit.sample_id}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
