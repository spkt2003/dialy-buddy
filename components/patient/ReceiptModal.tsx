"use client";

import { X, Printer, ShieldCheck, MapPin, Clock, CalendarDays, ReceiptText } from "lucide-react";
import type { PatientTransaction } from "@/types";
import { formatBaht } from "@/lib/utils";

interface ReceiptModalProps {
  transaction: PatientTransaction | null;
  onClose: () => void;
}

export function ReceiptModal({ transaction, onClose }: ReceiptModalProps) {
  if (!transaction) return null;

  const txShort = transaction.id.startsWith("mock-")
    ? `DBT-${transaction.id.toUpperCase()}`
    : `DBT-${transaction.id.slice(0, 8).toUpperCase()}`;

  const handlePrint = () => {
    const el = document.getElementById("receipt-printable");
    if (!el) return;
    const w = window.open("", "", "width=640,height=900");
    if (!w) return;
    w.document.write(`
      <html><head><title>ใบเสร็จรับเงิน ${txShort}</title>
      <meta charset="utf-8"/>
      <style>
        body { font-family: sans-serif; padding: 32px; color: #111; }
        .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 15px; }
        .divider { border-top: 1px solid #e5e7eb; margin: 12px 0; }
        .total { font-size: 22px; font-weight: 800; }
        .label { color: #6b7280; }
        h2 { font-size: 20px; margin-bottom: 4px; }
        .txid { font-size: 13px; color: #6b7280; margin-bottom: 20px; }
      </style>
      </head><body>${el.innerHTML}</body></html>
    `);
    w.document.close();
    w.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-[2rem] shadow-xl ghost-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <ReceiptText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-headline text-on-background">ใบเสร็จรับเงิน</h2>
              <p className="text-xs text-on-surface-variant font-mono">{txShort}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-container-low text-on-surface-variant transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt body (printable) */}
        <div id="receipt-printable" className="px-8 pb-4 space-y-4">
          {/* Trip info */}
          <div className="bg-surface-container-low rounded-2xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-on-surface-variant font-body">ผู้ดูแล</p>
                <p className="text-sm font-bold text-on-background">{transaction.caregiverName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-on-surface-variant font-body">สถานที่</p>
                <p className="text-sm font-bold text-on-background">{transaction.destination}</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex items-start gap-3">
                <CalendarDays className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-on-surface-variant font-body">วันที่</p>
                  <p className="text-sm font-bold text-on-background">{transaction.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-on-surface-variant font-body">เวลา</p>
                  <p className="text-sm font-bold text-on-background">{transaction.timeSlot}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fee breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-on-surface">
              <span>ค่าบริการผู้ดูแล (4 ชม.)</span>
              <span className="font-bold text-on-background">{formatBaht(transaction.basePay)} ฿</span>
            </div>
            <div className="flex justify-between text-on-surface">
              <span>ค่าธรรมเนียมแพลตฟอร์ม ({Math.round(transaction.platformFee / transaction.basePay * 100)}%)</span>
              <span className="font-bold text-on-background">{formatBaht(transaction.platformFee)} ฿</span>
            </div>
            {transaction.discount > 0 && (
              <div className="flex justify-between text-tertiary">
                <span>ส่วนลดสมาชิกใหม่</span>
                <span className="font-bold">-{formatBaht(transaction.discount)} ฿</span>
              </div>
            )}
          </div>

          <div className="border-t-2 border-outline-variant/20 pt-3 flex justify-between items-center">
            <span className="text-base font-bold text-on-background">ยอดชำระสุทธิ</span>
            <span className="text-3xl font-extrabold text-primary">{formatBaht(transaction.totalPaid)} ฿</span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 pt-2 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-3 rounded-xl font-bold font-label text-sm hover:bg-primary/15 transition-colors"
          >
            <Printer className="w-4 h-4" />
            พิมพ์ใบเสร็จ
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-primary text-on-primary px-4 py-3 rounded-xl font-bold font-label text-sm hover:brightness-105 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
