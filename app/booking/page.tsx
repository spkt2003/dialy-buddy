"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, ShieldCheck, AlertCircle, Loader2, ChevronDown } from "lucide-react";
import { PatientPageShell } from "@/components/layout/PatientPageShell";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

type Caregiver = {
  name: string;
  rating: number;
  reviews: number;
  rate: string;
  location: string;
};

const TIME_SLOTS = [
  "08:00 - 12:00 น.",
  "09:00 - 13:00 น.",
  "12:00 - 16:00 น.",
  "13:00 - 17:00 น.",
];

const HOSPITALS = [
  "โรงพยาบาลศิริราช (ศูนย์ไตเทียม)",
  "โรงพยาบาลรามาธิบดี",
  "โรงพยาบาลวชิรพยาบาล",
  "โรงพยาบาลธนบุรี 2",
  "โรงพยาบาลจุฬาลงกรณ์",
];

function parseRatePerHour(rate: string): number {
  return parseInt(rate.split(" ")[0]) || 350;
}

function formatThaiDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const days = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
  const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  return `${days[d.getDay()]}ที่ ${day} ${months[month - 1]} ${year + 543}`;
}

export default function BookingPage() {
  const router = useRouter();
  const { userName } = useAuth();
  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    if (!name) {
      router.replace("/find-buddy");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCaregiver({
      name,
      rating: parseFloat(params.get("rating") ?? "4.9"),
      reviews: parseInt(params.get("reviews") ?? "0"),
      rate: params.get("rate") ?? "350 บาท/ชม.",
      location: params.get("location") ?? "",
    });
    // Pre-fill date/time/hospital if passed from find-buddy
    const date = params.get("date");
    const slot = params.get("slot");
    const hospital = params.get("hospital");
    if (date) setSelectedDate(date);
    if (slot) setSelectedSlot(slot);
    if (hospital) setSelectedHospital(hospital);
  }, [router]);

  if (!caregiver) return null;

  const today = new Date().toISOString().split("T")[0];
  const ratePerHour = parseRatePerHour(caregiver.rate);
  const hours = 4;
  const base = ratePerHour * hours;
  const fee = Math.round(base * 0.15);
  const discount = 200;
  const total = base + fee - discount;

  const canSubmit = !!(selectedDate && selectedSlot && selectedHospital && !submitting);

  const handlePay = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.from("pending_jobs").insert({
      patient_name: userName,
      patient_image: `https://i.pravatar.cc/150?u=${encodeURIComponent(userName)}`,
      destination: selectedHospital,
      time_slot: selectedSlot,
      date: formatThaiDate(selectedDate),
      type: "พาไปฟอกไต",
      status: "pending",
      earning: base,
    });

    if (error) {
      console.error("Booking submission failed:", error.message);
      setSubmitError("ไม่สามารถส่งคำจองได้ กรุณาลองใหม่อีกครั้ง");
      setSubmitting(false);
      return;
    }

    router.push("/tracking");
  };

  return (
    <PatientPageShell maxWidth="max-w-6xl">
      <h1 className="text-4xl font-extrabold font-headline text-on-background mb-8">สรุปการจองและชำระเงิน</h1>
      <p className="text-xl text-on-surface mb-8">กรุณาตรวจสอบข้อมูลการจองและยอดชำระ Escrow ให้ถูกต้อง</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* Travel details form */}
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-ambient ghost-border">
            <h2 className="text-2xl font-bold font-headline text-on-background mb-8 pb-4 border-b border-outline-variant/15">รายละเอียดการเดินทาง (ฟอกไต)</h2>
            <div className="space-y-8">

              {/* Date */}
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-primary/5 text-primary rounded-xl flex items-center justify-center shrink-0 border border-primary/10">
                  <Calendar className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-on-background mb-2">วันที่ต้องการจอง</h3>
                  <input
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-lg text-on-surface focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                  />
                  {selectedDate && (
                    <p className="mt-2 text-base text-primary font-medium">{formatThaiDate(selectedDate)}</p>
                  )}
                </div>
              </div>

              {/* Time slot */}
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-primary/5 text-primary rounded-xl flex items-center justify-center shrink-0 border border-primary/10">
                  <Clock className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-on-background mb-2">ช่วงเวลาบริบาล (4 ชั่วโมง)</h3>
                  <div className="relative">
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-lg text-on-surface focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all pr-10"
                    >
                      <option value="">เลือกช่วงเวลา...</option>
                      {TIME_SLOTS.map((s) => (
                        <option key={s} value={s}>{s} (4 ชม.)</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Hospital */}
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-primary/5 text-primary rounded-xl flex items-center justify-center shrink-0 border border-primary/10">
                  <MapPin className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-on-background mb-2">โรงพยาบาล (ศูนย์ไตเทียม)</h3>
                  <div className="relative">
                    <select
                      value={selectedHospital}
                      onChange={(e) => setSelectedHospital(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-lg text-on-surface focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all pr-10"
                    >
                      <option value="">เลือกโรงพยาบาล...</option>
                      {HOSPITALS.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selected caregiver */}
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-ambient ghost-border">
            <h2 className="text-2xl font-bold font-headline text-on-background mb-6 pb-4 border-b border-outline-variant/15">ผู้ดูแลที่คุณเลือก</h2>
            <div className="flex items-center gap-6 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
              <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-ambient shrink-0">
                <span className="font-bold text-3xl">{caregiver.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-on-background flex items-center gap-2">
                  {caregiver.name} <ShieldCheck className="text-primary w-6 h-6" />
                </h3>
                <p className="text-lg text-on-surface mt-1">รีวิว {caregiver.rating} ดาว · {caregiver.reviews} รีวิว</p>
                <p className="text-base text-primary font-bold mt-1">{caregiver.rate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-ambient ghost-border sticky top-28 xl:w-[400px]">
            <h2 className="text-2xl font-bold font-headline text-on-background mb-6 border-b border-outline-variant/15 pb-4">สรุปยอดชำระ Escrow</h2>

            <div className="bg-primary/5 p-4 rounded-xl flex gap-3 text-primary mb-8 border border-primary/10">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p className="text-sm leading-relaxed">เงินของคุณจะถูกพักไว้ในระบบอย่างปลอดภัย และจะถูกโอนให้ผู้ดูแลเมื่อการบริการเสร็จสิ้นเท่านั้น</p>
            </div>

            <div className="space-y-5 mb-8 text-lg">
              <div className="flex justify-between items-center text-on-surface">
                <span>ค่าบริการผู้ดูแล ({hours} ชม. x {ratePerHour})</span>
                <span className="font-bold text-on-background">{base.toLocaleString()} ฿</span>
              </div>
              <div className="flex justify-between items-center text-on-surface">
                <span>ค่าธรรมเนียมแพลตฟอร์ม (Fair GP 15%)</span>
                <span className="font-bold text-on-background">{fee.toLocaleString()} ฿</span>
              </div>
              <div className="flex justify-between items-center text-tertiary bg-tertiary-container/30 p-2 rounded-lg">
                <span>ส่วนลดสมาชิกใหม่</span>
                <span className="font-bold">-{discount.toLocaleString()} ฿</span>
              </div>
            </div>

            <div className="border-t-2 border-on-background py-6 mb-6">
              <div className="flex justify-between items-end">
                <span className="block text-on-background text-xl font-bold">ยอดชำระสุทธิ</span>
                <span className="text-4xl font-extrabold text-primary">{total.toLocaleString()} ฿</span>
              </div>
            </div>

            {!canSubmit && !submitting && (
              <p className="text-sm text-on-surface-variant mb-4 text-center">กรุณาเลือกวันที่ ช่วงเวลา และโรงพยาบาล</p>
            )}

            {submitError && (
              <p className="text-sm text-error mb-4 text-center">{submitError}</p>
            )}

            <button
              onClick={handlePay}
              disabled={!canSubmit}
              className="w-full flex items-center justify-center gap-3 bg-primary text-on-primary px-6 py-5 rounded-xl font-bold font-label shadow-ambient hover:bg-primary-dim transition-colors text-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  กำลังดำเนินการ...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-6 h-6" />
                  ชำระเงินเพื่อพักยอด
                </>
              )}
            </button>

            <div className="mt-6 text-center text-on-surface-variant text-sm">
              <p>การทำธุรกรรมปลอดภัยด้วย 256-bit SSL Encryption</p>
            </div>
          </div>
        </div>
      </div>
    </PatientPageShell>
  );
}
