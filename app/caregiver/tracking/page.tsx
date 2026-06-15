"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useJobContext } from "../../../context/JobContext";
import { ArrowLeft, MapPin, Clock, CheckCircle2, User, Phone, Check } from "lucide-react";
import { ChatColumn } from "@/components/caregiver/ChatColumn";

const trackingSteps = [
  "กำลังเดินทางไปรับผู้ป่วย",
  "ถึงที่พักผู้ป่วยแล้ว",
  "กำลังเดินทางไปโรงพยาบาล",
  "ถึงโรงพยาบาล / กำลังฟอกไต",
  "ส่งผู้ป่วยกลับถึงบ้านเรียบร้อย"
];

export default function TrackingPage() {
  const { isInitialized, activeJob, updateJobStep, completeJob } = useJobContext();
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);

  // Wait for localStorage hydration before redirecting — avoids bouncing the user back
  // to dashboard on the first render when acceptJob state hasn't committed yet.
  useEffect(() => {
    if (isInitialized && !activeJob) {
      router.push("/caregiver/dashboard");
    }
  }, [isInitialized, activeJob, router]);

  if (!activeJob) return null; // Or a loading spinner

  const currentStepIndex = activeJob.currentStep ?? 0;
  const isFinished = currentStepIndex === trackingSteps.length - 1;

  const handleNextStep = () => {
    if (currentStepIndex < trackingSteps.length - 1) {
      updateJobStep(currentStepIndex + 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    const ok = await completeJob();
    setIsCompleting(false);
    if (ok) {
      router.push("/caregiver/dashboard");
    } else {
      alert("บันทึกงานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Job Info & Tracking */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <button 
            onClick={() => router.push("/caregiver/dashboard")}
            className="p-2 -ml-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-on-background"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold font-headline text-on-background">ติดตามสถานะงาน</h1>
        </div>

        {/* Job Details Card */}
        <section className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-ambient ghost-border">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-outline-variant/15 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <img 
                src={activeJob.patientImage} 
                alt={activeJob.patientName} 
                className="w-16 h-16 rounded-full object-cover shadow-sm"
              />
              <div>
                <h2 className="text-xl font-bold text-on-background font-headline">{activeJob.patientName}</h2>
                <p className="text-primary font-medium">{activeJob.type}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
               <a href="tel:0800000000" className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 text-on-surface px-4 py-2 rounded-xl transition-colors font-medium text-sm">
                 <Phone className="w-4 h-4 text-primary" />
                 โทรติดต่อญาติ
               </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-on-surface-variant font-medium mb-0.5">สถานที่</p>
                <p className="font-bold text-on-background">{activeJob.destination}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-on-surface-variant font-medium mb-0.5">เวลานัดหมาย</p>
                <p className="font-bold text-on-background">{activeJob.time} ({activeJob.date})</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tracking Progress Section */}
        <section className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-ambient ghost-border">
          <h2 className="text-2xl font-bold font-headline text-on-background mb-8">สถานะการดำเนินการ</h2>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-outline-variant/30">
            {trackingSteps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isPast = index < currentStepIndex;
              
              return (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-colors ${isPast ? 'bg-emerald-500' : isActive ? 'bg-primary ring-4 ring-primary/20' : 'bg-outline-variant/30'}`}>
                    {isPast ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-white' : 'bg-transparent'}`}></span>
                    )}
                  </div>
                  
                  {/* Text Container */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface-container-low p-4 rounded-xl border border-outline-variant/15 shadow-sm transition-all">
                    <p className={`font-bold ${isPast ? 'text-emerald-700' : isActive ? 'text-primary-dim' : 'text-on-surface-variant'}`}>
                      {step}
                    </p>
                    {isActive && (
                      <p className="text-sm text-primary mt-1">กำลังดำเนินการอยู่ในขั้นตอนนี้</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-end gap-4">
            {!isFinished ? (
              <button
                onClick={handleNextStep}
                className="w-full sm:w-auto bg-primary hover:bg-primary-dim text-on-primary px-8 py-4 rounded-xl font-bold transition-all shadow-md active:scale-95 text-lg"
              >
                อัปเดตสถานะถัดไป
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={isCompleting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md active:scale-95 text-lg disabled:opacity-60"
              >
                <CheckCircle2 className="w-6 h-6" />
                {isCompleting ? "กำลังบันทึก..." : "จบงานและบันทึกประวัติ"}
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Right Column: Chat Widget */}
      <ChatColumn />
    </div>
  );
}
