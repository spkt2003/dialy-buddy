"use client";

// หน้าแสดงตัวอย่างใบผลตรวจเลือด 3 ชุด พร้อม QR Code สำหรับทดสอบ AI Planner
// แต่ละ card encode sample ID ที่ route.ts ใช้ whitelist เช็ค strict equality
// ผู้ใช้พิมพ์ card แล้วถ่ายรูปขึ้น AI Planner เพื่อ simulate การสแกนผลเลือด

import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import { ArrowLeft, Printer, TestTube2, AlertTriangle, CheckCircle2, Beaker } from "lucide-react";
import { PatientPageShell } from "@/components/layout/PatientPageShell";
import { SAMPLE_RESULTS } from "@/lib/sampleResults";
import type { SampleResult } from "@/lib/sampleResults";

// สีและ icon ตาม condition ของแต่ละ sample — ไม่ใช้ gray-* หรือ hex โดยตรง
function getSampleMeta(sampleId: string): {
  conditionTh: string;
  conditionEn: string;
  icon: React.ReactNode;
  badgeClass: string;
  borderClass: string;
  headerClass: string;
} {
  switch (sampleId) {
    case "SAMPLE_001":
      return {
        conditionTh: "โพแทสเซียมสูง",
        conditionEn: "Hyperkalemia",
        icon: <AlertTriangle className="w-5 h-5" />,
        badgeClass: "bg-error/15 text-error",
        borderClass: "border-error/30",
        headerClass: "bg-error/8",
      };
    case "SAMPLE_002":
      return {
        conditionTh: "ฟอสฟอรัสสูงมาก",
        conditionEn: "Hyperphosphatemia",
        icon: <AlertTriangle className="w-5 h-5" />,
        badgeClass: "bg-secondary/15 text-secondary",
        borderClass: "border-secondary/30",
        headerClass: "bg-secondary/8",
      };
    case "SAMPLE_003":
      return {
        conditionTh: "ค่าทุกตัวปกติ",
        conditionEn: "Well-controlled",
        icon: <CheckCircle2 className="w-5 h-5" />,
        badgeClass: "bg-tertiary/15 text-tertiary",
        borderClass: "border-tertiary/30",
        headerClass: "bg-tertiary/8",
      };
    default:
      return {
        conditionTh: "ผลเลือด",
        conditionEn: "Sample",
        icon: <Beaker className="w-5 h-5" />,
        badgeClass: "bg-surface-container text-on-surface-variant",
        borderClass: "border-outline-variant/30",
        headerClass: "bg-surface-container-low",
      };
  }
}

// label ภาษาไทยสำหรับแต่ละ mineral
const MINERAL_LABELS: Record<string, string> = {
  potassium: "โพแทสเซียม",
  sodium: "โซเดียม",
  phosphorus: "ฟอสฟอรัส",
};

function SampleCard({ sample }: { sample: SampleResult }) {
  const meta = getSampleMeta(sample.sampleId);

  return (
    <div
      className={`bg-surface-container-lowest rounded-[2rem] border-2 ${meta.borderClass} shadow-ambient flex flex-col print:shadow-none print:break-inside-avoid`}
    >
      {/* Card Header */}
      <div className={`${meta.headerClass} rounded-t-[1.875rem] px-6 pt-6 pb-5`}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-xs font-bold text-on-surface-variant tracking-widest uppercase mb-1">
              ตัวอย่างผลตรวจเลือด
            </p>
            <h2 className="text-xl font-extrabold text-on-background tracking-tight">
              {sample.sampleId}
            </h2>
          </div>
          <span
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 ${meta.badgeClass}`}
          >
            {meta.icon}
            {meta.conditionTh}
          </span>
        </div>
        <p className="text-sm text-on-surface-variant">{meta.conditionEn}</p>
      </div>

      {/* Blood Values */}
      <div className="px-6 py-4 grid grid-cols-3 gap-3 border-b border-outline-variant/20">
        {(
          Object.entries(sample.bloodValues) as [
            keyof typeof sample.bloodValues,
            (typeof sample.bloodValues)[keyof typeof sample.bloodValues],
          ][]
        ).map(([key, bv]) => {
          const isHigh = bv.status === "high";
          const isLow = bv.status === "low";
          return (
            <div key={key} className="text-center">
              <p className="text-[10px] font-bold text-on-surface-variant mb-1">
                {MINERAL_LABELS[key] ?? key}
              </p>
              <p
                className={`text-base font-extrabold ${
                  isHigh ? "text-error" : isLow ? "text-primary" : "text-tertiary"
                }`}
              >
                {bv.value}
              </p>
              <p className="text-[10px] text-on-surface-variant">{bv.unit}</p>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-1 ${
                  isHigh
                    ? "bg-error/15 text-error"
                    : isLow
                      ? "bg-primary/15 text-primary"
                      : "bg-tertiary/15 text-tertiary"
                }`}
              >
                {bv.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* QR Code + Instructions */}
      <div className="px-6 py-5 flex items-center gap-5">
        <div className="shrink-0 p-2.5 bg-white rounded-2xl border border-outline-variant/20 shadow-ambient/50">
          <QRCodeSVG
            value={sample.sampleId}
            size={96}
            level="M"
            marginSize={1}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-on-surface-variant mb-1">วิธีใช้งาน</p>
          <ol className="text-xs text-on-surface-variant space-y-1 list-decimal list-inside">
            <li>พิมพ์ card นี้ออกมา</li>
            <li>เปิดหน้า AI โภชนาการโรคไต</li>
            <li>ถ่ายรูป card แล้วอัพโหลด</li>
            <li>ดูแผนอาหารที่ AI แนะนำ</li>
          </ol>
        </div>
      </div>

      {/* Warning preview */}
      <div className="px-6 pb-4">
        <div className="bg-error/8 border border-error/20 rounded-2xl px-4 py-3">
          <p className="text-[10px] font-bold text-error mb-1">⚠ คำเตือนด้านอาหาร</p>
          <p className="text-[10px] text-on-surface-variant leading-relaxed line-clamp-2">
            {sample.warning}
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-6 pb-5">
        <p className="text-[10px] text-center text-on-surface-variant/60 italic">
          card นี้ใช้สำหรับทดสอบระบบเท่านั้น — ไม่ใช่ใบผลตรวจเลือดจริง
        </p>
      </div>
    </div>
  );
}

export default function SamplesPage() {
  const samples = Object.values(SAMPLE_RESULTS);

  return (
    <>
      {/* Print CSS: ซ่อน UI อื่น แสดงแค่ cards — @media print ต้องอยู่ใน <style> ใน client component */}
      <style>{`
        @media print {
          body > *:not(#print-area) { display: none !important; }
          #print-area { display: block !important; }
          .no-print { display: none !important; }
          @page { margin: 1.5cm; size: A4; }
        }
      `}</style>

      <PatientPageShell maxWidth="max-w-5xl" pt="pt-8 md:pt-12" outerClass="no-print font-body">
        {/* Back link + Print button */}
        <div className="flex items-center justify-between mb-8 no-print">
          <Link
            href="/ai-planner"
            className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-sm font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับไป AI Planner
          </Link>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-2xl text-sm font-bold shadow-ambient hover:bg-primary/90 active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            พิมพ์ทุก Card
          </button>
        </div>

        {/* Page Header */}
        <div className="text-center mb-10 no-print">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-on-primary shadow-ambient">
            <TestTube2 className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-on-background mb-3 tracking-tight">
            ใบผลตรวจเลือดตัวอย่าง
          </h1>
          <p className="text-on-surface-variant max-w-xl mx-auto text-base leading-relaxed">
            พิมพ์ card ด้านล่าง แล้วถ่ายรูปอัพโหลดใน AI Planner เพื่อทดสอบการวิเคราะห์ผลเลือด
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full text-xs font-bold text-on-surface-variant ghost-border">
            <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span>
            QR Code encode: SAMPLE_001 · SAMPLE_002 · SAMPLE_003
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {samples.map((sample) => (
            <SampleCard key={sample.sampleId} sample={sample} />
          ))}
        </div>

      </PatientPageShell>

      {/* Print area — hidden on screen, shown when printing */}
      <div id="print-area" style={{ display: "none" }} className="p-8">
        <p className="text-center text-sm font-bold mb-6 text-gray-500">
          DialyBuddy — ใบผลตรวจเลือดตัวอย่างสำหรับทดสอบ AI Planner
        </p>
        <div className="grid grid-cols-3 gap-6">
          {samples.map((sample) => {
            const meta = getSampleMeta(sample.sampleId);
            return (
              <div
                key={sample.sampleId}
                className="border-2 border-gray-300 rounded-2xl p-4 break-inside-avoid"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">ตัวอย่างผลตรวจเลือด</p>
                    <p className="text-base font-extrabold text-gray-900">{sample.sampleId}</p>
                  </div>
                </div>
                <p className="text-xs font-bold text-gray-600 mb-1">{meta.conditionTh} ({meta.conditionEn})</p>
                <div className="grid grid-cols-3 gap-1 mb-3 text-center">
                  {(Object.entries(sample.bloodValues) as [string, typeof sample.bloodValues.potassium][]).map(([k, bv]) => (
                    <div key={k} className="bg-gray-50 rounded-lg p-1">
                      <p className="text-[9px] text-gray-400">{MINERAL_LABELS[k]}</p>
                      <p className="text-xs font-extrabold text-gray-800">{bv.value}</p>
                      <p className="text-[8px] text-gray-400">{bv.unit}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center my-3">
                  <QRCodeSVG value={sample.sampleId} size={100} level="M" marginSize={2} />
                </div>
                <p className="text-[9px] text-center text-gray-400">สแกน QR แล้วอัพโหลดใน AI Planner</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
