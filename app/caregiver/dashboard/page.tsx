// app/caregiver/dashboard/page.tsx
"use client";

import { Star, CheckCircle2, Clock, MapPin, Activity, AlertCircle, ArrowRight } from "lucide-react";
import ChatBox from "../../../components/caregiver/ChatBox";
import { useJobContext } from "../../../context/JobContext";
import { useRouter } from "next/navigation";

export default function CaregiverDashboard() {
  const { pendingJobs, activeJob, completedJobs, acceptJob } = useJobContext();
  const router = useRouter();

  const handleAcceptJob = (jobId: string) => {
    acceptJob(jobId);
    router.push("/caregiver/tracking");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Profile & Jobs */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Welcome & Profile Section */}
        <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-3xl font-bold shadow-md shrink-0">
            ส
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold font-headline text-slate-900 mb-2">ยินดีต้อนรับ, สมศรี</h1>
            <p className="text-lg text-slate-500 font-body">พยาบาลวิชาชีพ • ผู้ดูแลระดับพรีเมียม</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 text-amber-700">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-bold">4.9</span>
                <span className="text-sm">(128 รีวิว)</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 text-emerald-700">
                <Activity className="w-5 h-5" />
                <span className="font-bold">42</span>
                <span className="text-sm">งานสำเร็จ</span>
              </div>
            </div>
          </div>
        </section>

        {/* Active Job Banner */}
        {activeJob && (
          <section className="bg-blue-50 border border-blue-200 rounded-[2rem] p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-900 font-headline">คุณมีงานที่กำลังดำเนินการอยู่</h2>
                <p className="text-blue-700 font-medium mt-1">
                  กำลังให้บริการ: {activeJob.patientName} ({activeJob.type})
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/caregiver/tracking")}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              ไปที่หน้าติดตามสถานะ
              <ArrowRight className="w-5 h-5" />
            </button>
          </section>
        )}

        {/* Job List Section */}
        <section className={activeJob ? "opacity-50 pointer-events-none transition-opacity" : ""}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-headline text-slate-900">งานที่รอรับ</h2>
            <span className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">
              {pendingJobs.length} งาน
            </span>
          </div>

          {pendingJobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-xl text-slate-500 font-medium">ไม่มีงานที่รอรับในขณะนี้</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">{job.type} {job.destination}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-slate-600 text-sm font-medium">
                      <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        {job.patientName}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg">
                        <Clock className="w-4 h-4 text-blue-500" />
                        {job.time}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold transition-all active:scale-95 bg-blue-600 hover:bg-blue-700 text-white shadow-md whitespace-nowrap"
                    onClick={() => handleAcceptJob(job.id)}
                    disabled={!!activeJob}
                  >
                    รับงาน
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* History Section */}
        <section>
          <h2 className="text-2xl font-bold font-headline text-slate-900 mb-6 mt-10">ประวัติการทำงาน</h2>
          {completedJobs.length === 0 ? (
             <p className="text-slate-500 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">ยังไม่มีงานที่เสร็จสิ้น</p>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {completedJobs.map((job) => (
                  <div key={job.id} className="flex items-center gap-4 p-5">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{job.type} {job.destination}</p>
                      <p className="text-sm text-slate-500">สำเร็จแล้ว • {job.patientName} • {job.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Right Column: Chat Widget */}
      <div className="lg:col-span-1">
        <div className="sticky top-28 h-[calc(100vh-140px)] min-h-[500px]">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}
