"use client";

import { useJobContext } from "../../../context/JobContext";
import { Wallet, CheckCircle2, Clock, CalendarDays, Coins, TrendingUp } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatBaht } from "@/lib/utils";

function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const start = new Date(now);
  start.setDate(now.getDate() - diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export default function CaregiverJobsPage() {
  const { completedJobs } = useJobContext();

  const totalEarnings = completedJobs.reduce((sum, job) => sum + (job.earning ?? 0), 0);

  const weekStart = getWeekStart().getTime();
  const monthStart = getMonthStart().getTime();

  const thisWeekJobs = completedJobs.filter(j => j.completedAt && j.completedAt >= weekStart);
  const thisMonthJobs = completedJobs.filter(j => j.completedAt && j.completedAt >= monthStart);
  const weekEarnings = thisWeekJobs.reduce((s, j) => s + (j.earning ?? 0), 0);
  const monthEarnings = thisMonthJobs.reduce((s, j) => s + (j.earning ?? 0), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-headline text-on-background mb-2">งานของฉัน</h1>
        <p className="text-lg text-on-surface-variant font-body">ประวัติการทำงานและยอดรายได้สะสมของคุณ</p>
      </div>

      {/* Period breakdown */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold font-headline text-on-background">รายได้ตามช่วงเวลา</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest rounded-2xl p-5 ghost-border shadow-ambient text-center">
            <p className="text-sm text-on-surface-variant font-body mb-1">สัปดาห์นี้</p>
            <p className="text-2xl font-extrabold text-on-background">฿ {formatBaht(weekEarnings)}</p>
            <p className="text-xs text-on-surface-variant mt-1">{thisWeekJobs.length} งาน</p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-5 ghost-border shadow-ambient text-center">
            <p className="text-sm text-on-surface-variant font-body mb-1">เดือนนี้</p>
            <p className="text-2xl font-extrabold text-on-background">฿ {formatBaht(monthEarnings)}</p>
            <p className="text-xs text-on-surface-variant mt-1">{thisMonthJobs.length} งาน</p>
          </div>
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 text-center">
            <p className="text-sm text-primary font-bold font-body mb-1">1 ปีล่าสุด</p>
            <p className="text-2xl font-extrabold text-primary">฿ {formatBaht(totalEarnings)}</p>
            <p className="text-xs text-primary/70 mt-1">{completedJobs.length} งาน</p>
          </div>
        </div>
      </section>

      {/* Earnings Summary Card */}
      <section className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-ambient ghost-border flex flex-col sm:flex-row items-center gap-6 justify-between relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -right-10 -bottom-10 opacity-5">
          <Coins className="w-64 h-64 text-emerald-600" />
        </div>
        
        <div className="flex items-center gap-6 z-10 w-full sm:w-auto">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm">
            <Wallet className="w-10 h-10 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-on-surface-variant font-headline mb-1">ยอดรายได้สะสม (1 ปีล่าสุด)</h2>
            <div className="text-5xl font-extrabold text-on-background tracking-tight">
              ฿ {formatBaht(totalEarnings)}
            </div>
          </div>
        </div>
        
        <div className="z-10 w-full sm:w-auto">
          <button className="w-full sm:w-auto bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 text-on-surface font-bold px-6 py-3 rounded-xl transition-colors shadow-sm">
            ดูรายละเอียดการโอนเงิน
          </button>
        </div>
      </section>

      {/* Completed Jobs List */}
      <section>
        <h2 className="text-2xl font-bold font-headline text-on-background mb-6">ประวัติงานที่เสร็จสิ้น</h2>
        
        {completedJobs.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="w-10 h-10" />}
            message="คุณยังไม่มีประวัติการทำงาน"
          />
        ) : (
          <div className="space-y-5">
            {completedJobs.map((job) => {
              const earning = job.earning ?? 0;
              return (
                <div 
                  key={job.id} 
                  className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 ghost-border shadow-ambient hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  {/* Job Details */}
                  <div className="flex-1 w-full space-y-3">
                    <div className="flex items-start md:items-center justify-between gap-4">
                      <h3 className="text-xl font-bold text-on-background">{job.type} {job.destination}</h3>
                      {/* Mobile Badge */}
                      <span className="md:hidden flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-lg text-sm shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                        เสร็จสิ้น
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-on-surface-variant font-medium text-lg">
                      <span className="flex items-center gap-2">
                        <img 
                          src={job.patientImage} 
                          alt={job.patientName} 
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <span className="text-on-surface">{job.patientName}</span>
                      </span>
                      <span className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg">
                        <Clock className="w-5 h-5 text-primary" />
                        {job.time}
                      </span>
                      <span className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg">
                        <CalendarDays className="w-5 h-5 text-primary" />
                        {job.date}
                      </span>
                    </div>
                  </div>

                  {/* Earnings & Status Badge */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-outline-variant/15 pt-4 md:pt-0 gap-4">
                    <div className="text-2xl font-bold text-emerald-600">
                      + ฿ {formatBaht(earning)}
                    </div>
                    {/* Desktop Badge */}
                    <span className="hidden md:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold px-4 py-2 rounded-xl text-base shadow-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      เสร็จสิ้น
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
