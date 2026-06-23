import { Trophy, Star, Medal } from "lucide-react";
import { PatientPageShell } from "@/components/layout/PatientPageShell";
import { MOCK_PATIENT_TRANSACTIONS, MOCK_CAREGIVERS, getCaregiverTier } from "@/lib/mockData";
import { TierBadge } from "@/components/ui/TierBadge";
import { formatBaht } from "@/lib/utils";

type RankEntry = {
  rank: number;
  name: string;
  jobs: number;
  earnings: number;
  rating: number;
  reviews: number;
  tier: ReturnType<typeof getCaregiverTier>;
};

// MOCK: computed from MOCK_PATIENT_TRANSACTIONS — replace with real DB query when backend exists
function buildRankings(): RankEntry[] {
  const map = new Map<string, { jobs: number; earnings: number }>();
  for (const tx of MOCK_PATIENT_TRANSACTIONS) {
    const cur = map.get(tx.caregiverName) ?? { jobs: 0, earnings: 0 };
    map.set(tx.caregiverName, { jobs: cur.jobs + 1, earnings: cur.earnings + tx.basePay });
  }
  return Array.from(map.entries())
    .map(([name, stats]) => {
      const info = MOCK_CAREGIVERS.find((c) => c.name === name);
      return { name, ...stats, rating: info?.rating ?? 4.5, reviews: info?.reviews ?? 0, tier: getCaregiverTier(name) };
    })
    .sort((a, b) => b.earnings - a.earnings)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}

const RANKINGS = buildRankings();

const MEDAL_ICON_COLOR = ["text-yellow-500", "text-slate-400", "text-amber-700"];
const TOP3_CARD = [
  "bg-yellow-50 border border-yellow-200 shadow-ambient",
  "bg-slate-50 border border-slate-200 shadow-ambient",
  "bg-amber-50 border border-amber-200 shadow-ambient",
];

export default function RankingPage() {
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
            จัดอันดับจากรายได้สะสมและจำนวนงานที่สำเร็จ — อัปเดตทุกเดือน
          </p>
        </div>

        {/* Period note */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl px-6 py-4 text-sm font-body text-primary">
          <span className="font-bold">ช่วงเวลา:</span> เมษายน – มิถุนายน 2569 (ข้อมูลตัวอย่าง)
        </div>

        {/* Ranking list */}
        <div className="space-y-4">
          {RANKINGS.map((entry) => {
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
                  <div className="flex items-center gap-4 text-sm text-on-surface-variant flex-wrap">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-on-background">{entry.rating.toFixed(1)}</span>
                      <span>({entry.reviews} รีวิว)</span>
                    </span>
                    <span className="font-medium">{entry.jobs} งาน</span>
                  </div>
                </div>

                {/* Earnings */}
                <div className="text-right shrink-0">
                  <div className="text-xl sm:text-2xl font-extrabold text-on-background">
                    ฿ {formatBaht(entry.earnings)}
                  </div>
                  <div className="text-xs text-on-surface-variant mt-0.5">รายได้รวม</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PatientPageShell>
  );
}
