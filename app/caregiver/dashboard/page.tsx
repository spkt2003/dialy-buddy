// app/caregiver/dashboard/page.tsx
"use client";

import { useState } from "react";
import { Star, Check, Clock, Send } from "lucide-react";
import ChatBox from "../../../components/caregiver/ChatBox";

export default function CaregiverDashboard() {
  // Mock job data
  const initialJobs = [
    { id: 1, title: "พาผู้ป่วยไปฟอกไต รพ.ศิริราช", status: "pending" },
    { id: 2, title: "ดูแลผู้ป่วยหลังการผ่าตัด", status: "pending" },
    { id: 3, title: "ตรวจสุขภาพประจำเดือน", status: "pending" },
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
    pending: "bg-emerald-600 hover:bg-emerald-700",
    inProgress: "bg-amber-600 hover:bg-amber-700",
    completed: "bg-gray-600 hover:bg-gray-700",
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
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left side: profile, jobs, history */}
      <div className="flex-1 space-y-10">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-slate-900">แผงควบคุมผู้ดูแล</h1>

        {/* Profile Card */}
        <section className="max-w-md rounded-xl bg-blue-50 p-6 shadow-md border border-blue-200">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-teal-300 flex items-center justify-center text-white text-xl font-semibold">
              ส
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">พยาบาลวิชาชีพ สมศรี</h2>
              <div className="flex items-center text-sm text-slate-700 mt-1 space-x-2">
                <Star className="h-4 w-4 text-amber-500" />
                <span>คะแนน 4.9</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                งานที่สำเร็จ: <strong>42</strong> ครั้ง
              </p>
            </div>
          </div>
        </section>

        {/* Job List */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">รายการงาน</h2>
          {jobs.length === 0 ? (
            <p className="text-slate-600">ไม่มีงานที่รออยู่</p>
          ) : (
            <ul className="space-y-4">
              {jobs.map((job) => (
                <li
                  key={job.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
                >
                  <span className="text-slate-800">{job.title}</span>
                  <button
                    className={`${statusColors[job.status]} text-white px-3 py-1 rounded-md text-sm font-medium transition-colors`}
                    onClick={() => handleToggle(job.id)}
                  >
                    {statusLabels[job.status]}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Job History */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">ประวัติการทำงาน</h2>
          {history.length === 0 ? (
            <p className="text-slate-600">ยังไม่มีประวัติการทำงาน</p>
          ) : (
            <ul className="space-y-2">
              {history.map((job) => (
                <li key={job.id} className="flex items-center p-2 border-b border-slate-200">
                  <Check className="h-5 w-5 text-emerald-600 mr-2" />
                  <span className="text-slate-800">{job.title}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Right side: Chat */}
      <div className="flex-1 max-w-md">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">แชทกับผู้ป่วย/ญาติ</h2>
        <ChatBox />
      </div>
    </div>
  );
}
