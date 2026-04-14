import { MapPin, Navigation, Phone, ShieldAlert } from "lucide-react";

export default function TrackingPage() {
  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] pt-12 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold font-headline text-slate-900">ติดตามสถานะการเดินทางแบบเรียลไทม์</h1>
            <p className="text-xl text-slate-600 mt-2 font-body">ระบบ GPS เพื่อความอุ่นใจของญาติ</p>
          </div>
          <span className="flex items-center gap-3 px-6 py-4 bg-emerald-100 text-emerald-900 rounded-full font-bold font-label text-lg border-2 border-emerald-300 shadow-sm">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-600"></span>
            </span>
            สถานะ: กำลังเดินทางไปโรงพยาบาล
          </span>
        </div>
        
        <div className="bg-white rounded-[2rem] shadow-lg border border-slate-200 overflow-hidden relative flex flex-col">
          {/* Mock Map Visual styled for High Contrast */}
          <div className="h-[500px] bg-slate-200 flex items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/ignasi-pattern.png')]">
            <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
            {/* Active Route Line */}
            <svg className="absolute w-full h-full opacity-70" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M 25,75 Q 50,40 75,25" fill="none" stroke="#1d4ed8" strokeWidth="3" strokeDasharray="6,6" />
            </svg>
            <div className="relative z-10 bg-white px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center border-2 border-blue-200">
              <Navigation className="text-blue-700 w-16 h-16 mb-4 animate-bounce" />
              <p className="text-4xl font-extrabold text-blue-900 tracking-tight">อีก 15 นาที</p>
              <p className="text-slate-700 text-xl mt-3 font-bold">เวลาถึงที่หมายโดยประมาณ: 08:45 น.</p>
            </div>
            
            {/* Map markers high contrast */}
            <div className="absolute bottom-[20%] left-[20%] w-8 h-8 bg-slate-900 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white"><MapPin className="w-4 h-4"/></div>
            <div className="absolute top-[20%] right-[20%] w-10 h-10 bg-emerald-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white"><MapPin className="w-5 h-5"/></div>
          </div>
          
          <div className="p-8 md:p-10 border-t-4 border-slate-100 bg-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-blue-700 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-4xl">ส</span>
                </div>
                <div>
                  <h3 className="font-bold font-headline text-3xl text-slate-900">สมศรี ใจดี</h3>
                  <p className="text-blue-700 font-bold text-lg mt-1">ผู้ดูแล (พยาบาลวิชาชีพ)</p>
                  <p className="text-slate-600 font-body text-lg mt-2 p-2 bg-slate-50 rounded-lg border border-slate-200 inline-block">กท 1234 กทม. (ฮอนด้า ซิตี้ สีขาว)</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-5 rounded-xl bg-orange-100 text-orange-900 font-bold text-xl hover:bg-orange-200 transition border border-orange-200 shadow-sm">
                  <ShieldAlert className="w-7 h-7 text-orange-700" /> แจ้งเหตุฉุกเฉิน
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-5 rounded-xl bg-blue-700 text-white font-bold text-xl hover:bg-blue-800 transition shadow-xl">
                  <Phone className="w-7 h-7" /> โทรหาผู้ดูแล
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
