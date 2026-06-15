"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, CheckCircle2, FlaskConical, TestTube2 } from "lucide-react";
import { PatientPageShell } from "@/components/layout/PatientPageShell";
import { useAuth } from "@/context/AuthContext";
import type { SampleResult, BloodValue } from "@/lib/sampleResults";

const BLOOD_LABELS: Record<string, string> = {
  potassium: "โพแทสเซียม (Potassium)",
  sodium: "โซเดียม (Sodium)",
  phosphorus: "ฟอสฟอรัส (Phosphorus)",
};

const BLOOD_RANGES: Record<string, string> = {
  potassium: "เกณฑ์ปกติ: 3.5 - 5.0",
  sodium: "เกณฑ์ปกติ: 135 - 145",
  phosphorus: "เกณฑ์ปกติ: 2.5 - 4.5",
};

function getStatusStyle(status: BloodValue["status"]) {
  if (status === "high") return { text: "text-error font-bold", bar: "bg-error/70", pct: "80%" };
  if (status === "low") return { text: "text-primary font-bold", bar: "bg-primary", pct: "25%" };
  return { text: "text-tertiary font-bold", bar: "bg-tertiary", pct: "50%" };
}

export default function DashboardPage() {
  const { userName } = useAuth();
  const [lastBloodTest, setLastBloodTest] = useState<SampleResult | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("lastBloodTest");
      if (raw) setLastBloodTest(JSON.parse(raw));
    } catch { /* ignore parse errors */ }
    setInitialized(true);
  }, []);

  if (!initialized) return null;

  return (
    <PatientPageShell maxWidth="max-w-7xl">
      <h1 className="text-4xl font-extrabold font-headline mb-2 text-on-background">
        สวัสดี, คุณ{userName}
      </h1>
      <p className="text-xl text-on-surface-variant font-body mb-8 leading-relaxed">
        นี่คือสรุปข้อมูลสุขภาพและกำหนดการของคุณในวันนี้
      </p>

      <div className={`grid grid-cols-1 gap-8 ${lastBloodTest ? "lg:grid-cols-3" : ""}`}>

        {/* Appointment card */}
        <div className={lastBloodTest ? "lg:col-span-2 space-y-8" : "space-y-8"}>
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-ambient ghost-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-headline text-on-background">กำหนดการฟอกไตครั้งถัดไป</h2>
              <Link href="/booking" className="text-primary text-lg font-bold hover:underline">ดูทั้งหมด</Link>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-2xl bg-primary/5 shadow-ambient border border-primary/10">
              <div className="w-24 h-24 bg-primary text-on-primary rounded-xl flex flex-col items-center justify-center shrink-0 shadow-ambient">
                <span className="text-base font-bold font-label">พ.ย.</span>
                <span className="text-4xl font-extrabold font-headline">14</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-2xl font-headline text-on-background">โรงพยาบาลศิริราช (ศูนย์ไตเทียม)</h3>
                <p className="text-on-surface font-body mt-2 flex items-center gap-2 text-lg">
                  <Clock className="w-6 h-6 text-primary" /> พรุ่งนี้เวลา 09:00 น. - 13:00 น.
                </p>
                <p className="text-on-surface font-body mt-2 flex items-start gap-2 text-lg leading-relaxed">
                  <CheckCircle2 className="w-6 h-6 text-tertiary shrink-0" /> มีผู้ดูแล (สมศรี พยาบาลวิชาชีพ) เตรียมเดินทางไปพร้อมกับคุณ
                </p>
              </div>
              <Link href="/tracking" className="w-full sm:w-auto text-center px-6 py-4 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-dim transition text-lg shadow-ambient">
                ติดตามสถานะ
              </Link>
            </div>
          </div>
        </div>

        {/* Blood test card — shown only after the user has uploaded a blood test */}
        {lastBloodTest ? (
          <div className="space-y-8">
            <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-ambient ghost-border">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold font-headline text-on-background">ผลตรวจแล็บล่าสุด</h2>
                <FlaskConical className="w-10 h-10 text-primary bg-primary/10 p-2 rounded-xl" />
              </div>
              <div className="space-y-8">
                {(Object.entries(lastBloodTest.bloodValues) as [string, BloodValue][]).map(([key, bv]) => {
                  const s = getStatusStyle(bv.status);
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-lg font-label mb-3">
                        <span className="text-on-surface font-bold">{BLOOD_LABELS[key] ?? key}</span>
                        <span className={s.text}>{bv.value} {bv.unit}</span>
                      </div>
                      <div className="h-3 w-full bg-surface-container-low rounded-full overflow-hidden mb-1">
                        <div className={`h-full ${s.bar} rounded-full shadow-sm`} style={{ width: s.pct }} />
                      </div>
                      <p className="text-sm text-on-surface-variant font-body">
                        {BLOOD_RANGES[key]} ({bv.label})
                      </p>
                    </div>
                  );
                })}
              </div>
              <Link
                href="/ai-planner"
                className="mt-8 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-outline-variant/30 text-sm font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <TestTube2 className="w-4 h-4 text-primary" />
                อัปเดตผลตรวจใหม่
              </Link>
            </div>
          </div>
        ) : (
          /* CTA for users who haven't uploaded yet */
          <Link
            href="/ai-planner"
            className="flex items-center gap-4 p-6 rounded-[2rem] bg-surface-container-lowest shadow-ambient ghost-border hover:bg-surface-container-low transition-colors group"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <TestTube2 className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="font-bold text-on-background text-lg font-headline">อัปโหลดผลตรวจเลือด</p>
              <p className="text-on-surface-variant text-sm font-body mt-1">
                รับแผนโภชนาการส่วนตัวจาก AI เพื่อดูแลสุขภาพไตของคุณ
              </p>
            </div>
          </Link>
        )}

      </div>
    </PatientPageShell>
  );
}
