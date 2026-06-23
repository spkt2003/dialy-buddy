"use client";

import { useState, useEffect } from "react";
import { Crown, Check, Zap, Clock, Star, Headphones, Percent, X } from "lucide-react";
import { PatientPageShell } from "@/components/layout/PatientPageShell";

const FREE_FEATURES = [
  "จับคู่ผู้ดูแลผ่านระบบอัตโนมัติ",
  "AI วิเคราะห์โภชนาการจากผลตรวจเลือด",
  "ติดตามงานแบบ real-time",
  "แชทในแอปกับผู้ดูแล",
  "ค่าธรรมเนียมแพลตฟอร์ม 15%",
];

const PREMIUM_FEATURES = [
  { icon: Percent, text: "ค่าธรรมเนียมแพลตฟอร์มลดเหลือ 10% (ประหยัด 5%)" },
  { icon: Clock, text: "จองล่วงหน้าได้สูงสุด 3 เดือน (ปกติ 2 สัปดาห์)" },
  { icon: Star, text: "รับแต้ม Rewards สะสม 2 เท่าในทุกการจอง" },
  { icon: Crown, text: "แสดงสัญลักษณ์ Premium ให้ผู้ดูแลเห็น — เพิ่มความน่าเชื่อถือ" },
  { icon: Zap, text: "สิทธิ์จองก่อนในช่วงเวลาพีค" },
  { icon: Headphones, text: "สายด่วนช่วยเหลือ 24/7 (ช่องทางพิเศษ)" },
];

export default function SubscriptionPage() {
  const [isPremium, setIsPremium] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsPremium(localStorage.getItem("isPremium") === "true");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInitialized(true);
  }, []);

  if (!initialized) return null;

  const handleSubscribe = () => {
    localStorage.setItem("isPremium", "true");
    setIsPremium(true);
    setShowConfirm(false);
  };

  const handleCancel = () => {
    localStorage.removeItem("isPremium");
    setIsPremium(false);
  };

  return (
    <PatientPageShell maxWidth="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-amber-400/20 rounded-2xl flex items-center justify-center">
          <Crown className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold font-headline text-on-background">สมาชิก Dialybuddy</h1>
          <p className="text-base text-on-surface-variant font-body">เลือกแผนที่เหมาะกับคุณ</p>
        </div>
      </div>

      {isPremium && (
        <div className="mt-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4">
          <Crown className="w-5 h-5 text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-amber-800 text-sm">คุณเป็นสมาชิก Premium อยู่แล้ว</p>
            <p className="text-xs text-amber-700">สิทธิพิเศษทั้งหมดพร้อมใช้งาน ขอบคุณที่ไว้วางใจ Dialybuddy</p>
          </div>
          <button onClick={handleCancel} className="text-xs text-amber-700 underline hover:no-underline shrink-0">
            ยกเลิก
          </button>
        </div>
      )}

      <div className="mt-8 grid sm:grid-cols-2 gap-6">
        {/* Free Card */}
        <div className="bg-surface-container-lowest rounded-[2rem] ghost-border shadow-ambient p-8 flex flex-col">
          <div className="mb-6">
            <span className="text-xs font-bold font-label text-on-surface-variant uppercase tracking-widest">ฟรี</span>
            <div className="mt-2 flex items-end gap-1">
              <span className="text-5xl font-extrabold font-headline text-on-background">฿0</span>
              <span className="text-on-surface-variant font-body mb-2">/เดือน</span>
            </div>
            <p className="text-sm text-on-surface-variant mt-1 font-body">เริ่มต้นใช้งานได้ทันที ไม่ต้องชำระ</p>
          </div>

          <ul className="space-y-3 flex-1">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-on-surface font-body">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8 w-full bg-surface-container-high text-on-surface-variant font-bold font-label py-3 rounded-xl text-center text-sm">
            {isPremium ? "แผนปัจจุบันของคุณ (หลังยกเลิก Premium)" : "แผนปัจจุบันของคุณ"}
          </div>
        </div>

        {/* Premium Card */}
        <div className={`relative rounded-[2rem] p-8 flex flex-col overflow-hidden shadow-xl ${isPremium ? "bg-gradient-to-br from-amber-400 to-amber-500" : "bg-gradient-to-br from-amber-400 to-amber-500"}`}>
          {/* Glow */}
          <div className="absolute inset-0 bg-white/10 rounded-[2rem]" />

          <div className="relative z-10 mb-6">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-white" />
              <span className="text-xs font-bold font-label text-white/80 uppercase tracking-widest">Premium</span>
            </div>
            <div className="mt-2 flex items-end gap-1">
              <span className="text-5xl font-extrabold font-headline text-white">฿299</span>
              <span className="text-white/70 font-body mb-2">/เดือน</span>
            </div>
            <p className="text-sm text-white/80 mt-1 font-body">ประหยัดค่าธรรมเนียมตั้งแต่การจองแรก</p>
          </div>

          <ul className="space-y-3 flex-1 relative z-10">
            {PREMIUM_FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2.5 text-sm text-white font-body">
                <Icon className="w-4 h-4 text-white/80 mt-0.5 shrink-0" />
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-8 relative z-10">
            {isPremium ? (
              <div className="w-full bg-white text-amber-600 font-extrabold font-label py-3.5 rounded-xl text-center text-sm flex items-center justify-center gap-2">
                <Crown className="w-4 h-4" />
                กำลังใช้งาน Premium
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full bg-white text-amber-600 font-extrabold font-label py-3.5 rounded-xl hover:bg-amber-50 transition-colors text-sm"
              >
                สมัครสมาชิก Premium
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-10 space-y-4">
        <h2 className="text-xl font-bold font-headline text-on-background">คำถามที่พบบ่อย</h2>
        {[
          { q: "ชำระเงินอย่างไร?", a: "ในเวอร์ชัน prototype นี้การสมัครสมาชิกไม่มีการชำระเงินจริง เพื่อทดสอบฟีเจอร์ระบบ" },
          { q: "ยกเลิกได้ตลอดเวลาหรือไม่?", a: "ใช่ คุณสามารถยกเลิกได้ตลอดเวลา สิทธิ์ Premium จะยังคงอยู่จนถึงสิ้นรอบบิล" },
          { q: "ค่าธรรมเนียม 10% คำนวณอย่างไร?", a: "เฉพาะการจองที่เกิดขึ้นหลังจากสมัคร Premium เท่านั้นที่ได้อัตรา 10% แทน 15%" },
        ].map(({ q, a }) => (
          <div key={q} className="bg-surface-container-lowest rounded-2xl ghost-border p-5">
            <p className="font-bold text-on-background text-sm">{q}</p>
            <p className="text-sm text-on-surface-variant mt-1 font-body">{a}</p>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative z-10 w-full max-w-sm bg-surface-container-lowest rounded-[2rem] shadow-xl ghost-border p-8">
            <button onClick={() => setShowConfirm(false)} className="absolute top-5 right-5 p-2 rounded-xl hover:bg-surface-container-low text-on-surface-variant">
              <X className="w-4 h-4" />
            </button>
            <div className="w-14 h-14 bg-amber-400/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Crown className="w-7 h-7 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold font-headline text-on-background text-center mb-2">ยืนยันสมัคร Premium</h3>
            <p className="text-sm text-on-surface-variant text-center font-body mb-6">
              ฿299/เดือน • ยกเลิกได้ตลอดเวลา<br />สิทธิพิเศษทั้งหมดจะเริ่มทันที
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleSubscribe}
                className="flex-1 bg-amber-400 text-white font-bold font-label py-3 rounded-xl hover:bg-amber-500 transition-colors"
              >
                ยืนยัน
              </button>
              <button onClick={() => setShowConfirm(false)} className="px-5 bg-surface-container-high text-on-surface font-bold font-label py-3 rounded-xl hover:bg-surface-container transition-colors">
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </PatientPageShell>
  );
}
