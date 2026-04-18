import { MapPin, Navigation, Phone, ShieldAlert, MessageCircle, Clock, HeartPulse, Car } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function TrackingPage() {
  return (
    <>
      <Navbar />
      <div className="bg-slate-50/50 min-h-[calc(100vh-80px)] pt-8 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-blue-600">
                <HeartPulse className="w-5 h-5" />
                <span className="font-semibold text-sm tracking-wide">DIALYBUDDY TRACKING</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">ติดตามการเดินทาง</h1>
              <p className="text-slate-500 mt-2 text-lg">อัปเดตตำแหน่งและสถานะแบบเรียลไทม์</p>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shadow-sm w-fit">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-sm md:text-base">กำลังเดินทางไปโรงพยาบาล</span>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden relative flex flex-col">

            {/* Map Area */}
            <div className="h-[400px] md:h-[480px] bg-slate-100 relative overflow-hidden">
              {/* Decorative Map Pattern */}
              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]"></div>

              {/* Simulated Route */}
              <svg className="absolute w-full h-full" preserveAspectRatio="none">
                <path d="M 20,80 Q 50,50 80,20" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 10" className="opacity-40" />
              </svg>

              {/* Central ETA Card */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="bg-white/90 backdrop-blur-md px-8 py-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-600">
                    <Navigation className="w-6 h-6 animate-pulse" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-1">เวลาถึงที่หมายโดยประมาณ</p>
                  <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">15 <span className="text-2xl text-slate-400 font-bold">นาที</span></p>
                  <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 font-medium text-sm">ถึงประมาณ 08:45 น.</span>
                  </div>
                </div>
              </div>

              {/* Map Markers */}
              <div className="absolute bottom-[20%] left-[20%] z-10 flex flex-col items-center">
                <div className="w-10 h-10 bg-slate-800 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white"><MapPin className="w-4 h-4" /></div>
                <span className="mt-2 text-xs font-bold bg-white px-2 py-1 rounded-md shadow-sm text-slate-700">จุดรับ</span>
              </div>
              <div className="absolute top-[20%] right-[20%] z-10 flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white"><MapPin className="w-5 h-5" /></div>
                <span className="mt-2 text-xs font-bold bg-white px-2 py-1 rounded-md shadow-sm text-slate-700">โรงพยาบาล</span>
              </div>
            </div>

            {/* Caregiver Info & Actions Bottom Bar */}
            <div className="p-6 md:p-8 bg-white z-30">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

                {/* Profile Section */}
                <div className="flex items-center gap-5 w-full lg:w-auto">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-3xl">ส</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-slate-900">สมศรี ใจดี</h3>
                    <p className="text-blue-600 font-medium text-sm md:text-base mb-2">ผู้ดูแล (พยาบาลวิชาชีพ)</p>
                    <div className="flex items-center gap-2 text-slate-600 text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
                      <Car className="w-4 h-4 text-slate-400" />
                      <span>ฮอนด้า ซิตี้ สีขาว • <span className="font-bold">กท 1234 กรุงเทพมหานคร</span></span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto">
                  <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white text-rose-600 font-bold hover:bg-rose-50 transition-colors border border-rose-200 shadow-sm group">
                    <ShieldAlert className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>แจ้งเหตุฉุกเฉิน</span>
                  </button>
                  <button className="flex-[1_1_45%] lg:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition-colors border border-blue-100">
                    <Phone className="w-5 h-5" />
                    <span>โทรหาผู้ดูแล</span>
                  </button>
                  <button className="flex-[1_1_45%] lg:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200/50">
                    <MessageCircle className="w-5 h-5" />
                    <span>แชท</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}