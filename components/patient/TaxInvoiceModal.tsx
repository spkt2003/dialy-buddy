"use client";

import { useState } from "react";
import { X, FileText, Printer, Building2, Hash, MapPin, ArrowLeft } from "lucide-react";
import type { PatientTransaction } from "@/types";
import { formatBaht } from "@/lib/utils";
import { VAT_RATE, VAT_PCT } from "@/lib/config";

interface TaxInvoiceModalProps {
  transaction: PatientTransaction | null;
  onClose: () => void;
}

interface TaxpayerInfo {
  name: string;
  taxId: string;
  address: string;
}

export function TaxInvoiceModal({ transaction, onClose }: TaxInvoiceModalProps) {
  const [step, setStep] = useState<"form" | "preview">("form");
  const [info, setInfo] = useState<TaxpayerInfo>({ name: "", taxId: "", address: "" });
  const [errors, setErrors] = useState<Partial<TaxpayerInfo>>({});

  if (!transaction) return null;

  const txShort = transaction.id.startsWith("mock-")
    ? `DBTV-${transaction.id.toUpperCase()}`
    : `DBTV-${transaction.id.slice(0, 8).toUpperCase()}`;

  // VAT-inclusive breakdown: totalPaid already includes VAT
  const preTax = Math.round(transaction.totalPaid / (1 + VAT_RATE));
  const vat = transaction.totalPaid - preTax;

  const validate = (): boolean => {
    const e: Partial<TaxpayerInfo> = {};
    if (!info.name.trim()) e.name = "กรุณากรอกชื่อผู้เสียภาษี";
    if (info.taxId.replace(/\D/g, "").length !== 13) e.taxId = "เลขประจำตัวผู้เสียภาษีต้องมี 13 หลัก";
    if (!info.address.trim()) e.address = "กรุณากรอกที่อยู่";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePrint = () => {
    const el = document.getElementById("tax-invoice-printable");
    if (!el) return;
    const w = window.open("", "", "width=700,height=1000");
    if (!w) return;
    w.document.write(`
      <html><head><title>ใบกำกับภาษี ${txShort}</title>
      <meta charset="utf-8"/>
      <style>
        body { font-family: sans-serif; padding: 40px; color: #111; }
        .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 15px; }
        .divider { border-top: 1px solid #e5e7eb; margin: 12px 0; }
        .total { font-size: 22px; font-weight: 800; }
        .label { color: #6b7280; }
        h2 { font-size: 22px; margin-bottom: 4px; }
        .txid { font-size: 13px; color: #6b7280; margin-bottom: 20px; }
        .header { text-align: center; margin-bottom: 32px; }
        .company { font-size: 18px; font-weight: 700; }
        .vat-badge { display: inline-block; background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; padding: 2px 8px; border-radius: 6px; font-size: 12px; margin-left: 8px; }
      </style>
      </head><body>${el.innerHTML}</body></html>
    `);
    w.document.close();
    w.print();
  };

  const inputClass =
    "w-full bg-surface-container-high border-none rounded-xl py-3.5 pl-11 pr-4 text-on-surface font-body focus:ring-2 focus:ring-primary/50 focus:outline-none text-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-[2rem] shadow-xl ghost-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div className="flex items-center gap-3">
            {step === "preview" && (
              <button onClick={() => setStep("form")} className="p-1.5 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors mr-1">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-headline text-on-background">ใบกำกับภาษีเต็มรูปแบบ</h2>
              <p className="text-xs text-on-surface-variant font-mono">{txShort}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-container-low text-on-surface-variant transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === "form" ? (
          <>
            <div className="px-8 pb-4 space-y-4">
              <p className="text-sm text-on-surface-variant font-body">กรอกข้อมูลผู้เสียภาษีเพื่อออกใบกำกับภาษี</p>

              {/* ชื่อ */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold font-label text-on-surface block">ชื่อ / ชื่อบริษัท</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant" />
                  <input
                    type="text"
                    value={info.name}
                    onChange={(e) => setInfo((p) => ({ ...p, name: e.target.value }))}
                    placeholder="ชื่อ-นามสกุล หรือชื่อนิติบุคคล"
                    className={inputClass}
                  />
                </div>
                {errors.name && <p className="text-xs text-error pl-1">{errors.name}</p>}
              </div>

              {/* เลขผู้เสียภาษี */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold font-label text-on-surface block">เลขประจำตัวผู้เสียภาษี</label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={13}
                    value={info.taxId}
                    onChange={(e) => setInfo((p) => ({ ...p, taxId: e.target.value.replace(/\D/g, "") }))}
                    placeholder="13 หลัก"
                    className={inputClass}
                  />
                </div>
                {errors.taxId && <p className="text-xs text-error pl-1">{errors.taxId}</p>}
              </div>

              {/* ที่อยู่ */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold font-label text-on-surface block">ที่อยู่สำหรับออกใบกำกับ</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-outline-variant" />
                  <textarea
                    value={info.address}
                    onChange={(e) => setInfo((p) => ({ ...p, address: e.target.value }))}
                    placeholder="บ้านเลขที่ ถนน แขวง เขต จังหวัด รหัสไปรษณีย์"
                    rows={3}
                    className="w-full bg-surface-container-high border-none rounded-xl py-3.5 pl-11 pr-4 text-on-surface font-body focus:ring-2 focus:ring-primary/50 focus:outline-none text-sm resize-none"
                  />
                </div>
                {errors.address && <p className="text-xs text-error pl-1">{errors.address}</p>}
              </div>
            </div>
            <div className="px-8 pb-8 flex gap-3">
              <button
                onClick={() => { if (validate()) setStep("preview"); }}
                className="flex-1 bg-primary text-on-primary font-bold font-label py-3 rounded-xl hover:brightness-105 transition-colors"
              >
                ดูตัวอย่างใบกำกับ
              </button>
              <button onClick={onClose} className="px-5 bg-surface-container-high text-on-surface font-bold font-label py-3 rounded-xl hover:bg-surface-container transition-colors">
                ยกเลิก
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Preview */}
            <div id="tax-invoice-printable" className="px-8 pb-4 space-y-4 text-sm">
              {/* Issuer */}
              <div className="text-center pb-3 border-b border-outline-variant/20">
                <p className="text-lg font-extrabold text-on-background font-headline">Dialybuddy Platform</p>
                <p className="text-xs text-on-surface-variant">เลขประจำตัวผู้เสียภาษี: 0105566123456</p>
                <p className="text-xs text-on-surface-variant mt-0.5">99/9 ถ.พหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900</p>
                <span className="mt-2 inline-block text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">ใบกำกับภาษีเต็มรูปแบบ (VAT Invoice)</span>
              </div>

              {/* Recipient */}
              <div className="bg-surface-container-low rounded-2xl p-4 space-y-1.5">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">ผู้รับใบกำกับภาษี</p>
                <p className="font-bold text-on-background">{info.name}</p>
                <p className="text-xs text-on-surface-variant">เลขผู้เสียภาษี: {info.taxId}</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">{info.address}</p>
              </div>

              {/* Service row */}
              <div className="space-y-2">
                <div className="flex justify-between text-on-surface">
                  <span>บริการรับส่งผู้ป่วยไตวาย — {transaction.caregiverName}</span>
                  <span className="font-bold text-on-background shrink-0 ml-2">{formatBaht(preTax)} ฿</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>ภาษีมูลค่าเพิ่ม (VAT {VAT_PCT}%)</span>
                  <span className="font-bold shrink-0 ml-2">{formatBaht(vat)} ฿</span>
                </div>
              </div>

              <div className="border-t-2 border-outline-variant/20 pt-3 flex justify-between items-center">
                <span className="text-base font-bold text-on-background">รวมทั้งสิ้น (รวม VAT)</span>
                <span className="text-3xl font-extrabold text-primary">{formatBaht(transaction.totalPaid)} ฿</span>
              </div>

              <p className="text-center text-xs text-on-surface-variant pt-1">
                วันที่ออกเอกสาร: {new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            <div className="px-8 pb-8 pt-2 flex gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-3 rounded-xl font-bold font-label text-sm hover:bg-primary/15 transition-colors"
              >
                <Printer className="w-4 h-4" />
                พิมพ์ใบกำกับ
              </button>
              <button onClick={onClose} className="flex-1 bg-primary text-on-primary px-4 py-3 rounded-xl font-bold font-label text-sm hover:brightness-105 transition-colors">
                ปิด
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
