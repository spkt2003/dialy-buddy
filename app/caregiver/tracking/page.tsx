"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJobContext } from "../../../context/JobContext";
import { ArrowLeft, MapPin, Clock, CheckCircle2, User, Phone, Check } from "lucide-react";
import ChatBox from "../../../components/caregiver/ChatBox";

const trackingSteps = [
  "กำลังเดินทางไปรับผู้ป่วย",
  "ถึงที่พักผู้ป่วยแล้ว",
  "กำลังเดินทางไปโรงพยาบาล",
  "ถึงโรงพยาบาล / กำลังฟอกไต",
  "ส่งผู้ป่วยกลับถึงบ้านเรียบร้อย"
];

export default function TrackingPage() {
  const { activeJob, updateJobStep, completeJob } = useJobContext();
  const router = useRouter();

  // If no active job, redirect back to dashboard
  useEffect(() => {
    if (!activeJob) {
      router.push("/caregiver/dashboard");
    }
  }, [activeJob, router]);

  if (!activeJob) return null; // Or a loading spinner

  const currentStepIndex = activeJob.currentStep ?? 0;
  const isFinished = currentStepIndex === trackingSteps.length - 1;

  const handleNextStep = () => {
    if (currentStepIndex < trackingSteps.length - 1) {
      updateJobStep(currentStepIndex + 1);
    }
  };

  const handleComplete = () => {
    completeJob();
    router.push("/caregiver/dashboard");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Job Info & Tracking */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <button 
            onClick={() => router.push("/caregiver/dashboard")}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold font-headline text-slate-900">ติดตามสถานะงาน</h1>
        </div>

        {/* Job Details Card */}
        <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-slate-100 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <img 
                src={activeJob.patientImage} 
                alt={activeJob.patientName} 
                className="w-16 h-16 rounded-full object-cover shadow-sm"
              />
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-headline">{activeJob.patientName}</h2>
                <p className="text-blue-600 font-medium">{activeJob.type}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
               <a href="tel:0800000000" className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors font-medium text-sm">
                 <Phone className="w-4 h-4 text-blue-600" />
                 โทรติดต่อญาติ
               </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-0.5">สถานที่</p>
                <p className="font-bold text-slate-900">{activeJob.destination}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-0.5">เวลานัดหมาย</p>
                <p className="font-bold text-slate-900">{activeJob.time} ({activeJob.date})</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tracking Progress Section */}
        <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold font-headline text-slate-900 mb-8">สถานะการดำเนินการ</h2>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200">
            {trackingSteps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isPast = index < currentStepIndex;
              
              return (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-colors ${isPast ? 'bg-emerald-500' : isActive ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-200'}`}>
                    {isPast ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-white' : 'bg-transparent'}`}></span>
                    )}
                  </div>
                  
                  {/* Text Container */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm transition-all">
                    <p className={`font-bold ${isPast ? 'text-emerald-700' : isActive ? 'text-blue-700' : 'text-slate-500'}`}>
                      {step}
                    </p>
                    {isActive && (
                      <p className="text-sm text-blue-500 mt-1">กำลังดำเนินการอยู่ในขั้นตอนนี้</p>
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
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md active:scale-95 text-lg"
              >
                อัปเดตสถานะถัดไป
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md active:scale-95 text-lg"
              >
                <CheckCircle2 className="w-6 h-6" />
                จบงานและบันทึกประวัติ
              </button>
            )}
          </div>
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
