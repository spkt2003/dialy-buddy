// app/caregiver/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Star, CheckCircle2, Clock, MapPin, Activity, AlertCircle, ArrowRight } from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import { useJobContext } from "../../../context/JobContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CaregiverDashboard() {
  // All job state lives in JobContext — this page is purely presentational.
  const { pendingJobs, activeJob, completedJobs, acceptJob } = useJobContext();
  const { userName } = useAuth();
  const router = useRouter();
  const [acceptingJobId, setAcceptingJobId] = useState<string | null>(null);

  // Navigate only after context confirms activeJob is set — avoids the race where
  // tracking page mounts before setActiveJob commits and immediately redirects back.
  useEffect(() => {
    if (acceptingJobId && activeJob?.id === acceptingJobId) {
      setAcceptingJobId(null);
      router.push("/caregiver/tracking");
    }
  }, [acceptingJobId, activeJob, router]);

  const handleAcceptJob = (jobId: string) => {
    acceptJob(jobId, userName);
    setAcceptingJobId(jobId);
  };

  return (
    // Two-column on lg+: job list takes 2/3, chat widget takes 1/3.
    <div className="grid grid-cols-1 gap-6 md:gap-8">
      {/* Left Column: Profile & Jobs */}
      <div className="lg:col-span-2 space-y-6 md:space-y-8">

        {/* Welcome & Profile Section */}
        <section className="bg-surface-container-lowest rounded-[2rem] p-6 md:p-8 shadow-ambient ghost-border flex flex-col md:flex-row items-center gap-6">
          {/* shrink-0 keeps the avatar circle from collapsing if the caregiver name is long. */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-primary-dim flex items-center justify-center text-on-primary text-3xl font-bold shadow-md shrink-0">
            {userName.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold font-headline text-on-background mb-2">ยินดีต้อนรับ, {userName}</h1>
            <p className="text-lg text-on-surface-variant font-body">พยาบาลวิชาชีพ • ผู้ดูแลระดับพรีเมียม</p>

            {/* flex-wrap lets rating/jobs badges stack on mobile, then align inline on md+. */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 text-primary">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-bold">4.9</span>
                <span className="text-sm">(128 รีวิว)</span>
              </div>
              <div className="flex items-center gap-2 bg-tertiary-container px-4 py-2 rounded-xl border border-tertiary-container text-on-tertiary-container">
                <Activity className="w-5 h-5" />
                <span className="font-bold">42</span>
                <span className="text-sm">งานสำเร็จ</span>
              </div>
            </div>
          </div>
        </section>

        {/* Active Job Banner — only shown when a job has been accepted. */}
        {activeJob && (
          <section className="bg-surface-container-low border border-primary/20 rounded-[2rem] p-6 md:p-8 shadow-ambient flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-background font-headline">คุณมีงานที่กำลังดำเนินการอยู่</h2>
                <p className="text-primary-dim font-medium mt-1">
                  กำลังให้บริการ: {activeJob.patientName} ({activeJob.type})
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/caregiver/tracking")}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-dim text-on-primary px-8 py-4 rounded-xl font-bold transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              ไปที่หน้าติดตามสถานะ
              <ArrowRight className="w-5 h-5" />
            </button>
          </section>
        )}

        {/* Job List Section — visually locked while an active job is in progress. */}
        {/* opacity-50 + pointer-events-none enforces the single-job constraint from JobContext. */}
        <section className={activeJob ? "opacity-50 pointer-events-none transition-opacity" : ""}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-headline text-on-background">งานที่รอรับ</h2>
            <span className="bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-full">
              {pendingJobs.length} งาน
            </span>
          </div>

          {pendingJobs.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 className="w-8 h-8" />}
              message="ไม่มีงานที่รอรับในขณะนี้"
            />
          ) : (
            <div className="space-y-4">
              {pendingJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-surface-container-lowest rounded-2xl p-6 ghost-border shadow-ambient hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-on-background">{job.type} {job.destination}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-on-surface-variant text-sm font-medium">
                      <span className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-lg">
                        <MapPin className="w-4 h-4 text-primary" />
                        {job.patientName}
                      </span>
                      <span className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-lg">
                        <Clock className="w-4 h-4 text-primary" />
                        {job.time}
                      </span>
                    </div>
                  </div>

                  {/* disabled={!!activeJob} is redundant with pointer-events-none above, but keeps the button semantically correct for screen readers. */}
                  <button
                    className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold transition-all active:scale-95 bg-primary hover:bg-primary-dim text-on-primary shadow-md whitespace-nowrap"
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
          {/* mt-10 adds extra vertical separation between the job list above and the history list. */}
          <h2 className="text-2xl font-bold font-headline text-on-background mb-6 mt-10">ประวัติการทำงาน</h2>
          {completedJobs.length === 0 ? (
             <p className="text-on-surface-variant bg-surface-container-lowest p-6 rounded-2xl ghost-border shadow-ambient">ยังไม่มีงานที่เสร็จสิ้น</p>
          ) : (
            <div className="bg-surface-container-lowest rounded-2xl ghost-border shadow-ambient overflow-hidden">
              <div className="divide-y divide-outline-variant/20">
                {completedJobs.map((job) => (
                  <div key={job.id} className="flex items-center gap-4 p-5">
                    <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-tertiary" />
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{job.type} {job.destination}</p>
                      <p className="text-sm text-on-surface-variant">สำเร็จแล้ว • {job.patientName} • {job.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>



    </div>
  );
}
