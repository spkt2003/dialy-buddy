import { ShieldCheck, Coins, Map, Lock } from "lucide-react";

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-24 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl font-extrabold font-headline leading-tight text-on-background">ความปลอดภัยและความน่าเชื่อถือ<span className="text-primary">คือรากฐาน</span>ของเรา</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                <ShieldCheck className="text-primary h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold font-headline text-xl text-on-background">ตรวจสอบประวัติ 100%</h4>
                <p className="text-on-surface-variant font-body mt-2 leading-relaxed text-lg">ผู้ดูแลทุกคนผ่านการตรวจสอบประวัติอาชญากรรมและการคัดกรองทางวิชาชีพอย่างเข้มงวด</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                <Coins className="text-primary h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold font-headline text-xl text-on-background">ค่าธรรมเนียมเป็นธรรม (10-15%)</h4>
                <p className="text-on-surface-variant font-body mt-2 leading-relaxed text-lg">ระบบตั้งราคาที่โปร่งใส มั่นใจได้ว่าผู้ดูแลจะได้รับค่าตอบแทนที่เหมาะสมกับความมุ่งมั่นในการดูแล</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                <Map className="text-primary h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold font-headline text-xl text-on-background">ติดตามแบบเรียลไทม์ (Real-time)</h4>
                <p className="text-on-surface-variant font-body mt-2 leading-relaxed text-lg">ระบบตรวจสอบด้วย GPS ช่วยให้ครอบครัวรับรู้สถานะการเดินทางได้ครบถ้วนตลอดการเดินทาง</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                <Lock className="text-primary h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold font-headline text-xl text-on-background">ระบบจ่ายเงินแบบ Escrow</h4>
                <p className="text-on-surface-variant font-body mt-2 leading-relaxed text-lg">เงินของคุณจะถูกเก็บรักษาไว้โดยปลอดภัย จนกว่าการให้บริการจะสำเร็จลุล่วงด้วยดี</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* OVERRIDE: Removed overflow-hidden so the absolute badge stops clipping */}
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 relative shadow-xl">
          <div className="bg-slate-800 rounded-[2rem] p-8 shadow-ambient border border-slate-700 relative z-10">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-16 h-16 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0 border border-blue-800">
                 <ShieldCheck className="h-8 w-8 text-sky-400" />
               </div>
               <div>
                  <p className="font-bold font-headline text-xl text-white flex flex-col">ระบบคัดกรองบุคลากร</p>
                  <p className="text-base text-slate-300 font-body mt-1">เปิดใช้งานระบบติดตามเรียลไทม์แล้ว</p>
               </div>
             </div>
             <div className="space-y-6">
                <div className="h-4 bg-slate-700 rounded-full w-3/4"></div>
                <div className="h-4 bg-slate-700 rounded-full w-full"></div>
                <div className="h-4 bg-slate-700 rounded-full w-1/2"></div>
                <div className="h-4 bg-slate-700 rounded-full w-2/3"></div>
             </div>
          </div>
          
          {/* OVERRIDE: Pushed badge inwards to right-4 or right-0, ensuring w-max/whitespace-nowrap avoids wrap-clipping */}
          <div className="absolute -bottom-4 right-4 md:right-8 lg:-right-4 px-6 py-4 rounded-xl shadow-2xl z-20 bg-slate-800 border border-slate-600 w-max whitespace-nowrap">
             <div className="flex items-center gap-3 text-sky-300 font-bold font-headline text-xl">
               <ShieldCheck className="w-7 h-7" /> ปลอดภัยและเชื่อถือได้
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
