import { Activity, Apple, HeartPulse, Clock, Calendar, CheckCircle2, FlaskConical } from "lucide-react";
import Link from "next/link";
import { PatientPageShell } from "@/components/layout/PatientPageShell";

export default function DashboardPage() {
  return (
    <PatientPageShell maxWidth="max-w-7xl">
          <h1 className="text-4xl font-extrabold font-headline mb-2 text-on-background">สวัสดี, คุณสมหมาย</h1>
          <p className="text-xl text-on-surface-variant font-body mb-8 leading-relaxed">นี่คือสรุปข้อมูลสุขภาพและกำหนดการของคุณในวันนี้</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
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

            <div className="space-y-8">
              <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-ambient ghost-border">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold font-headline text-on-background">ผลตรวจแล็บล่าสุด</h2>
                  <FlaskConical className="w-10 h-10 text-primary bg-primary/10 p-2 rounded-xl" />
                </div>
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between text-lg font-label mb-3">
                      <span className="text-on-surface font-bold">โพแทสเซียม (Potassium)</span>
                      <span className="font-bold text-tertiary">3.5 mEq/L</span>
                    </div>
                    <div className="h-3 w-full bg-surface-container-low rounded-full overflow-hidden mb-1">
                      <div className="h-full bg-tertiary w-[45%] rounded-full shadow-sm"></div>
                    </div>
                    <p className="text-sm text-on-surface-variant font-body">เกณฑ์ปกติ: 3.5 - 5.0 (อยู่ในเกณฑ์ดี)</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-lg font-label mb-3">
                      <span className="text-on-surface font-bold">โซเดียม (Sodium)</span>
                      <span className="font-bold text-error">146 mEq/L</span>
                    </div>
                    <div className="h-3 w-full bg-surface-container-low rounded-full overflow-hidden mb-1">
                      <div className="h-full bg-error/70 w-[80%] rounded-full shadow-sm"></div>
                    </div>
                    <p className="text-sm text-on-surface-variant font-body">เกณฑ์ปกติ: 135 - 145 (สูงเล็กน้อย โปรดเลี่ยงอาหารเค็ม)</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-lg font-label mb-3">
                      <span className="text-on-surface font-bold">ฟอสฟอรัส (Phosphorus)</span>
                      <span className="font-bold text-tertiary">4.1 mg/dL</span>
                    </div>
                    <div className="h-3 w-full bg-surface-container-low rounded-full overflow-hidden mb-1">
                      <div className="h-full bg-tertiary w-[55%] rounded-full shadow-sm"></div>
                    </div>
                    <p className="text-sm text-on-surface-variant font-body">เกณฑ์ปกติ: 2.5 - 4.5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </PatientPageShell>
  );
}
