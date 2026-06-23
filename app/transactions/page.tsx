"use client";

import { useState, useEffect } from "react";
import { History, CalendarDays, Clock, MapPin, ShieldCheck, FileText, Receipt } from "lucide-react";
import { PatientPageShell } from "@/components/layout/PatientPageShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { ReceiptModal } from "@/components/patient/ReceiptModal";
import { TaxInvoiceModal } from "@/components/patient/TaxInvoiceModal";
import { MOCK_PATIENT_TRANSACTIONS } from "@/lib/mockData";
import type { PatientTransaction } from "@/types";
import { formatBaht } from "@/lib/utils";

function formatBookedDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function loadTransactions(): PatientTransaction[] {
  const stored = localStorage.getItem("patientTransactions");
  if (!stored) return MOCK_PATIENT_TRANSACTIONS;
  try {
    const parsed = JSON.parse(stored) as PatientTransaction[];
    return parsed.length > 0 ? parsed : MOCK_PATIENT_TRANSACTIONS;
  } catch {
    return MOCK_PATIENT_TRANSACTIONS;
  }
}

export default function TransactionsPage() {
  const [pageState, setPageState] = useState<{
    transactions: PatientTransaction[];
    initialized: boolean;
  }>({ transactions: [], initialized: false });

  const [selected, setSelected] = useState<PatientTransaction | null>(null);
  const [taxSelected, setTaxSelected] = useState<PatientTransaction | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPageState({ transactions: loadTransactions(), initialized: true });
  }, []);

  if (!pageState.initialized) return null;

  const { transactions } = pageState;
  const totalSpent = transactions.reduce((s, t) => s + t.totalPaid, 0);

  return (
    <PatientPageShell maxWidth="max-w-4xl">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
          <History className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold font-headline text-on-background">ประวัติธุรกรรม</h1>
          <p className="text-base text-on-surface-variant font-body">รายการจองและชำระเงินทั้งหมดของคุณ</p>
        </div>
      </div>

      {/* Summary strip */}
      <div className="mt-8 mb-8 bg-primary/5 border border-primary/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-on-surface-variant font-body">ยอดใช้จ่ายสะสมทั้งหมด</p>
          <p className="text-4xl font-extrabold text-primary mt-1">฿ {formatBaht(totalSpent)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-on-surface-variant font-body">จำนวนการจอง</p>
          <p className="text-2xl font-bold text-on-background mt-1">{transactions.length} ครั้ง</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          icon={<History className="w-10 h-10" />}
          message="คุณยังไม่มีประวัติการจอง"
        />
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-surface-container-lowest rounded-2xl p-6 ghost-border shadow-ambient hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Trip info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-bold text-on-background text-base">{tx.caregiverName}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-on-surface-variant">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      {tx.destination}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4 text-primary" />
                      {tx.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary" />
                      {tx.timeSlot}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    จองเมื่อ {formatBookedDate(tx.bookedAt)}
                  </p>
                </div>

                {/* Amount + action */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:gap-3 border-t md:border-t-0 border-outline-variant/15 pt-3 md:pt-0 gap-4">
                  <div className="text-right">
                    <p className="text-xs text-on-surface-variant font-body">ชำระแล้ว</p>
                    <p className="text-2xl font-extrabold text-primary">฿ {formatBaht(tx.totalPaid)}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelected(tx)}
                      className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 text-on-surface font-bold text-sm px-4 py-2.5 rounded-xl transition-colors shrink-0"
                    >
                      <FileText className="w-4 h-4" />
                      ดูใบเสร็จ
                    </button>
                    <button
                      onClick={() => setTaxSelected(tx)}
                      className="flex items-center gap-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary font-bold text-sm px-4 py-2.5 rounded-xl transition-colors shrink-0"
                    >
                      <Receipt className="w-4 h-4" />
                      ใบกำกับภาษี
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ReceiptModal transaction={selected} onClose={() => setSelected(null)} />
      <TaxInvoiceModal transaction={taxSelected} onClose={() => setTaxSelected(null)} />
    </PatientPageShell>
  );
}
