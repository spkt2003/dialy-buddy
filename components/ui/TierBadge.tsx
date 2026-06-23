import { Stethoscope, Heart, GraduationCap } from "lucide-react";
import type { CaregiverTier } from "@/lib/mockData";

export function TierBadge({ tier, size = "sm" }: { tier: CaregiverTier; size?: "sm" | "xs" }) {
  const sizeClass = size === "xs" ? "text-xs px-2 py-0.5 gap-1" : "text-sm px-3 py-1 gap-1.5";
  const iconSize = size === "xs" ? "w-3 h-3" : "w-4 h-4";

  const cls =
    tier === "พยาบาลวิชาชีพ" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
    tier === "ผช.พยาบาล"       ? "bg-sky-50 text-sky-700 border-sky-200" :
                                 "bg-emerald-50 text-emerald-700 border-emerald-200";

  const Icon =
    tier === "พยาบาลวิชาชีพ" ? Stethoscope :
    tier === "ผช.พยาบาล"       ? Heart :
                                 GraduationCap;

  return (
    <span className={`inline-flex items-center rounded-full border font-bold ${cls} ${sizeClass}`}>
      <Icon className={iconSize} />
      {tier}
    </span>
  );
}
