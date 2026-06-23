"use client";

import { useState, useEffect } from "react";
import { Trophy, Star, Medal } from "lucide-react";
import { PatientPageShell } from "@/components/layout/PatientPageShell";
import { TierBadge } from "@/components/ui/TierBadge";
import { supabase } from "@/lib/supabaseClient";
import { getCaregiverTier } from "@/lib/mockData";

type RankEntry = {
  rank: number;
  name: string;
  rating: number;
  reviews: number;
  tier: ReturnType<typeof getCaregiverTier>;
  certifications: string[];
};

const MEDAL_ICON_COLOR = ["text-yellow-500", "text-slate-400", "text-amber-700"];
const TOP3_CARD = [
  "bg-yellow-50 border border-yellow-200 shadow-ambient",
  "bg-slate-50 border border-slate-200 shadow-ambient",
  "bg-amber-50 border border-amber-200 shadow-ambient",
];

export default function RankingPage() {
  const [rankings, setRankings] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("caregiver_profiles")
      .select("name, rating, reviews, certifications")
      .order("rating", { ascending: false })
      .order("reviews", { ascending: false })
      .then(({ data }) => {
        const entries: RankEntry[] = (data ?? []).map((row, i) => ({
          rank: i + 1,
          name: row.name as string,
          rating: Number(row.rating),
          reviews: row.reviews as number,
          certifications: (row.certifications as string[]) ?? [],
          tier: getCaregiverTier(row.name as string, (row.certifications as string[]) ?? []),
        }));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRankings(entries);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(false);
      });
  }, []);

  return (
    <PatientPageShell maxWidth="max-w-3xl">
      <div className="space-y-8 pb-16">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-extrabold font-headline text-on-background">อันดับผู้ดูแลยอดเยี่ยม</h1>
          </div>
          <p className="text-lg text-on-surface-variant font-body">
            จัดอันดับจากคะแนนรีวิวและจำนวนผู้ประเมิน — ข้อมูลจริงจากระบบ
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-surface-container-lowest rounded-[2rem] ghost-border p-6 animate-pulse flex items-center gap-5">
                <div className="w-10 h-10 bg-surface-container-high rounded-full shrink-0" />
                <div className="w-14 h-14 bg-surface-container-high rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-container-high rounded-xl w-1/3" />
                  <div className="h-3 bg-surface-container-high rounded-xl w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {rankings.map((entry) => {
              const isTop3 = entry.rank <= 3;
              return (
                <div
                  key={entry.name}
                  className={`rounded-[2rem] p-6 sm:p-8 flex items-center gap-5 sm:gap-6 ${
                    isTop3 ? TOP3_CARD[entry.rank - 1] : "bg-surface-container-lowest ghost-border shadow-ambient"
                  }`}
                >
                  {/* Rank indicator */}
                  <div className="shrink-0 w-10 text-center">
                    {isTop3 ? (
                      <Medal className={`w-9 h-9 mx-auto ${MEDAL_ICON_COLOR[entry.rank - 1]}`} />
                    ) : (
                      <span className="text-xl font-extrabold text-on-surface-variant">{entry.rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-2xl">{entry.name.charAt(0)}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <h3 className="font-bold text-on-background text-base sm:text-lg leading-tight">{entry.name}</h3>
                      <TierBadge tier={entry.tier} size="xs" />
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-on-background">{entry.rating.toFixed(1)}</span>
                      <span>จาก {entry.reviews} รีวิว</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0">
                    <div className="text-xl sm:text-2xl font-extrabold text-on-background">
                      {entry.rating.toFixed(1)}
                    </div>
                    <div className="text-xs text-on-surface-variant mt-0.5">คะแนน</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PatientPageShell>
  );
}
