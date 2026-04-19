// app/caregiver/dashboard/page.tsx
"use client";

import { useState } from "react";
import { Star, CheckCircle2, Clock, MapPin, Activity } from "lucide-react";
import ChatBox from "../../../components/caregiver/ChatBox";

export default function CaregiverDashboard() {
  // Mock job data
  const initialJobs = [
    { id: 1, title: "พาผู้ป่วยไปฟอกไต รพ.ศิริราช", patient: "คุณสมหมาย", time: "09:00 น.", status: "pending" },
    { id: 2, title: "ดูแลผู้ป่วยหลังการผ่าตัด", patient: "คุณสมพร", time: "13:30 น.", status: "pending" },
    { id: 3, title: "ตรวจสุขภาพประจำเดือน", patient: "คุณสมศรี", time: "15:00 น.", status: "pending" },
  ];

  const [jobs, setJobs] = useState(initialJobs);
  const [history, setHistory] = useState([] as typeof initialJobs);

  const statusLabels: Record<string, string> = {
    pending: "รับงาน",
    inProgress: "กำลังดำเนินการ",
    completed: "จบงาน",
  };

  const nextStatus: Record<string, string> = {
    pending: "inProgress",
    inProgress: "completed",
    completed: "completed",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-blue-600 hover:bg-blue-700 text-white shadow-md", // Brand primary
    inProgress: "bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-200",
    completed: "bg-slate-100 text-slate-500",
  };

  const handleToggle = (jobId: number) => {
    setJobs((prev) => {
      return prev
        .map((job) => {
          if (job.id !== jobId) return job;
          const newStatus = nextStatus[job.status];
          if (newStatus === "completed") {
            setHistory((h) => [...h, { ...job, status: newStatus }]);
            return null as any;
          }
          return { ...job, status: newStatus };
        })
        .filter(Boolean) as typeof initialJobs;
    });
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

        {/* Job List Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-headline text-slate-900">งานที่รอรับ</h2>
            <span className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">
              {jobs.length} งาน
            </span>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-xl text-slate-500 font-medium">ไม่มีงานที่รอรับในขณะนี้</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-slate-600 text-sm font-medium">
                      <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        {job.patient}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg">
                        <Clock className="w-4 h-4 text-blue-500" />
                        {job.time}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold transition-all active:scale-95 ${statusColors[job.status]}`}
                    onClick={() => handleToggle(job.id)}
                  >
                    {statusLabels[job.status]}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* History Section */}
        <section>
          <h2 className="text-2xl font-bold font-headline text-slate-900 mb-6 mt-10">ประวัติการทำงานวันนี้</h2>
          {history.length === 0 ? (
             <p className="text-slate-500 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">ยังไม่มีงานที่เสร็จสิ้นในวันนี้</p>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {history.map((job) => (
                  <div key={job.id} className="flex items-center gap-4 p-5">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{job.title}</p>
                      <p className="text-sm text-slate-500">สำเร็จแล้ว • {job.patient}</p>
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
