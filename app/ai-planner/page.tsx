// TODO: Upload flow sends image to /api/analyze-blood which matches a QR code,
// not a real medical analysis. Replace with full Gemini vision analysis in production.
// Result displayed is always one of 3 hardcoded sets regardless of actual blood values.

"use client";

import React, { useState } from "react";
import {
  Apple,
  Upload,
  Loader2,
  CheckCircle2,
  FileText,
  Soup,
  Coffee,
  Moon,
  AlertCircle,
} from "lucide-react";
import { PatientPageShell } from "@/components/layout/PatientPageShell";
import type { SampleResult, BloodValue } from "@/lib/sampleResults";

// Maps BloodValue.status to a consistent set of Tailwind color tokens for card, label, value, and badge.
function getValueStyle(status: BloodValue["status"]) {
  switch (status) {
    case "high":
      return {
        card: "bg-orange-50 border-orange-100",
        label: "text-orange-600",
        value: "text-orange-700",
        badge: "bg-orange-200 text-orange-800",
      };
    case "low":
      return {
        card: "bg-blue-50 border-blue-100",
        label: "text-blue-600",
        value: "text-blue-700",
        badge: "bg-blue-200 text-blue-800",
      };
    default:
      return {
        card: "bg-emerald-50 border-emerald-100",
        label: "text-emerald-600",
        value: "text-emerald-700",
        badge: "bg-emerald-200 text-emerald-800",
      };
  }
}

// Thai UI labels for each blood mineral key — kept here so sampleResults.ts stays language-agnostic.
const BLOOD_LABELS: Record<string, string> = {
  potassium: "โพแทสเซียม (Potassium)",
  sodium: "โซเดียม (Sodium)",
  phosphorus: "ฟอสฟอรัส (Phosphorus)",
};

export default function AIPlannerPage() {
  // Three-state machine: only one panel renders at a time, preventing partial / mixed UI states.
  const [status, setStatus] = useState<"idle" | "analyzing" | "success">("idle");
  // Object URL of the uploaded file — shown as a faded thumbnail during analysis.
  const [preview, setPreview] = useState<string | null>(null);
  // Populated once the API responds; null until then so the success panel never renders stale data.
  const [analysisResult, setAnalysisResult] = useState<SampleResult | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Switch to "analyzing" immediately so the UI responds before the async chain begins.
    setPreview(URL.createObjectURL(file));
    setStatus("analyzing");

    const reader = new FileReader();

    reader.onerror = () => {
      alert("เกิดข้อผิดพลาดในการวิเคราะห์ กรุณาลองใหม่อีกครั้ง");
      setStatus("idle");
    };

    reader.onload = async () => {
      try {
        // Strip the "data:image/jpeg;base64," prefix added by readAsDataURL — API expects raw base64.
        const base64 = (reader.result as string).split(",")[1];

        const res = await fetch("/api/analyze-blood", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 }),
        });

        const data = await res.json();

        // Treat API-level error responses the same as network failures — both fall to the catch block.
        if (data.error) throw new Error(data.error);

        setAnalysisResult(data);
        setStatus("success");
      } catch {
        alert("เกิดข้อผิดพลาดในการวิเคราะห์ กรุณาลองใหม่อีกครั้ง");
        setStatus("idle");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <PatientPageShell maxWidth="max-w-4xl" pt="pt-8 md:pt-12" outerClass="font-sans">

          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="mx-auto mb-4 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <Apple className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 md:mb-4 tracking-tight">
              AI โภชนาการโรคไต
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              สแกนผลเลือดเพื่อวิเคราะห์ค่าแร่ธาตุ และรับตารางอาหารที่ออกแบบมาเพื่อคุณโดยเฉพาะ
            </p>
          </div>

          <div className="grid gap-6 md:gap-8">

            {/* Step 1: Upload — dashed border signals a drop/pick-file affordance */}
            {status === "idle" && (
              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border-2 border-dashed border-slate-200 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 md:mb-6">
                  <Upload className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                  อัพโหลดใบตรวจเลือด
                </h3>
                <p className="text-slate-500 mb-6 md:mb-8 max-w-md text-sm md:text-base">
                  รองรับไฟล์ JPG, PNG หรือ PDF (กรุณาให้ข้อมูลชัดเจน เพื่อการวิเคราะห์ที่แม่นยำ)
                </p>
                {/* <label> wraps the hidden input so the styled button triggers the file picker. */}
                <label className="bg-blue-600 hover:bg-blue-700 text-white px-8 md:px-10 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all cursor-pointer active:scale-95 text-base md:text-lg">
                  เลือกรูปภาพหรือไฟล์
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleUpload}
                    accept="image/*"
                  />
                </label>
              </div>
            )}

            {/* Step 2: Analyzing — faded preview reassures the user their image was received */}
            {status === "analyzing" && (
              <div className="bg-white p-12 md:p-16 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center animate-in fade-in duration-500">
                <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-blue-600 animate-spin mb-5 md:mb-6" />
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                  กำลังวิเคราะห์ข้อมูล...
                </h3>
                <p className="text-slate-500 text-sm md:text-base">
                  AI กำลังอ่านค่าสารอาหารและประมวลผลความเสี่ยง
                </p>
                {preview && (
                  <div className="mt-6 md:mt-8 relative w-32 h-44 md:w-40 md:h-52 border border-slate-200 rounded-xl overflow-hidden opacity-50">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Success — guarded by analysisResult to prevent rendering before data arrives */}
            {status === "success" && analysisResult && (
              <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-8 duration-700">

                {/* Blood Value Cards */}
                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <CheckCircle2 className="w-7 h-7 md:w-8 md:h-8 text-emerald-500 shrink-0" />
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                      สรุปการวิเคราะห์ผลเลือด
                    </h3>
                  </div>

                  {/* Object.entries renders all minerals dynamically — adding a 4th requires no JSX changes. */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    {(
                      Object.entries(analysisResult.bloodValues) as [
                        string,
                        BloodValue
                      ][]
                    ).map(([key, bv]) => {
                      const s = getValueStyle(bv.status);
                      return (
                        <div
                          key={key}
                          className={`p-5 rounded-2xl border ${s.card}`}
                        >
                          <p className={`text-sm font-bold mb-1 ${s.label}`}>
                            {/* Falls back to the raw key if a new mineral is added without a Thai label. */}
                            {BLOOD_LABELS[key] ?? key}
                          </p>
                          <p className={`text-3xl font-black ${s.value}`}>
                            {bv.value}{" "}
                            <span className="text-lg font-bold">{bv.unit}</span>
                          </p>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full mt-2 inline-block ${s.badge}`}
                          >
                            {bv.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Meal Plan */}
                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-6 md:mb-8">
                    <div className="flex items-center gap-3">
                      <FileText className="w-7 h-7 md:w-8 md:h-8 text-blue-600 shrink-0" />
                      <h3 className="text-lg md:text-2xl font-bold text-slate-900">
                        ตารางอาหารที่ AI แนะนำวันนี้
                      </h3>
                    </div>
                    {/* Resets to idle so the user can scan another blood test without a full page reload. */}
                    <button
                      onClick={() => setStatus("idle")}
                      className="text-sm font-bold text-blue-600 hover:underline whitespace-nowrap ml-2"
                    >
                      วิเคราะห์ใหม่
                    </button>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <MealRow
                      icon={<Coffee className="w-7 h-7" />}
                      iconColor="text-orange-500"
                      time="มื้อเช้า (07:00 - 08:30)"
                      title={analysisResult.meals.breakfast.title}
                      note={analysisResult.meals.breakfast.note}
                    />
                    <MealRow
                      icon={<Soup className="w-7 h-7" />}
                      iconColor="text-blue-600"
                      time="มื้อเที่ยง (12:00 - 13:00)"
                      title={analysisResult.meals.lunch.title}
                      note={analysisResult.meals.lunch.note}
                    />
                    <MealRow
                      icon={<Moon className="w-7 h-7" />}
                      iconColor="text-purple-500"
                      time="มื้อเย็น (18:00 - 19:00)"
                      title={analysisResult.meals.dinner.title}
                      note={analysisResult.meals.dinner.note}
                    />
                  </div>

                  {/* Warning box: rendered in red because it contains actionable dietary restrictions. */}
                  <div className="mt-6 md:mt-8 flex items-start gap-3 p-4 md:p-5 rounded-2xl bg-red-50 text-red-700">
                    <AlertCircle className="w-5 h-5 md:w-6 md:h-6 shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed">
                      <strong>หมายเหตุจาก AI:</strong> {analysisResult.warning}
                    </p>
                  </div>
                </div>

              </div>
            )}

          </div>
    </PatientPageShell>
  );
}

// Extracted as a component because the three meal rows share identical structure and spacing.
function MealRow({
  icon,
  iconColor,
  time,
  title,
  note,
}: {
  icon: React.ReactNode;
  iconColor: string;
  time: string;
  title: string;
  note: string;
}) {
  return (
    <div className="flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-3xl bg-slate-50 border border-slate-100">
      {/* shrink-0 prevents the icon square from collapsing when meal text wraps on narrow screens. */}
      <div
        className={`w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${iconColor}`}
      >
        {icon}
      </div>
      {/* min-w-0 allows the text block to shrink and wrap rather than overflowing its flex container. */}
      <div className="flex-1 min-w-0">
        <p className="text-xs md:text-sm font-bold text-slate-400">{time}</p>
        <h4 className="text-base md:text-lg font-bold text-slate-800">{title}</h4>
        <p className="text-xs md:text-sm text-slate-500">{note}</p>
      </div>
    </div>
  );
}
