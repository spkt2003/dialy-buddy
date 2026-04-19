"use client";

import { useJobContext } from "../../../context/JobContext";
import { Wallet, CheckCircle2, Clock, MapPin, CalendarDays, Coins } from "lucide-react";

export default function CaregiverJobsPage() {
  const { completedJobs } = useJobContext();

  // Calculate total earnings, defaulting to 500 if earning is not defined
  const totalEarnings = completedJobs.reduce((sum, job) => sum + (job.earning || 500), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-headline text-slate-900 mb-2">งานของฉัน</h1>
        <p className="text-lg text-slate-500 font-body">ประวัติการทำงานและยอดรายได้สะสมของคุณ</p>
      </div>

      {/* Earnings Summary Card */}
      <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-6 justify-between relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -right-10 -bottom-10 opacity-5">
          <Coins className="w-64 h-64 text-emerald-600" />
        </div>
        
        <div className="flex items-center gap-6 z-10 w-full sm:w-auto">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm">
            <Wallet className="w-10 h-10 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-600 font-headline mb-1">ยอดรายได้สะสม</h2>
            <div className="text-5xl font-extrabold text-slate-900 tracking-tight">
              ฿ {totalEarnings.toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="z-10 w-full sm:w-auto">
          <button className="w-full sm:w-auto bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl transition-colors shadow-sm">
            ดูรายละเอียดการโอนเงิน
          </button>
        </div>
      </section>

      {/* Completed Jobs List */}
      <section>
        <h2 className="text-2xl font-bold font-headline text-slate-900 mb-6">ประวัติงานที่เสร็จสิ้น</h2>
        
        {completedJobs.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarDays className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-xl text-slate-500 font-medium">คุณยังไม่มีประวัติการทำงาน</p>
          </div>
        ) : (
          <div className="space-y-5">
            {completedJobs.map((job) => {
              const earning = job.earning || 500;
              return (
                <div 
                  key={job.id} 
                  className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  {/* Job Details */}
                  <div className="flex-1 w-full space-y-3">
                    <div className="flex items-start md:items-center justify-between gap-4">
                      <h3 className="text-xl font-bold text-slate-900">{job.type} {job.destination}</h3>
                      {/* Mobile Badge */}
                      <span className="md:hidden flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-lg text-sm shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                        เสร็จสิ้น
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-slate-600 font-medium text-lg">
                      <span className="flex items-center gap-2">
                        <img 
                          src={job.patientImage} 
                          alt={job.patientName} 
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <span className="text-slate-700">{job.patientName}</span>
                      </span>
                      <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-500" />
                        {job.time}
                      </span>
                      <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                        <CalendarDays className="w-5 h-5 text-blue-500" />
                        {job.date}
                      </span>
                    </div>
                  </div>

                  {/* Earnings & Status Badge */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 gap-4">
                    <div className="text-2xl font-bold text-emerald-600">
                      + ฿ {earning.toLocaleString()}
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
