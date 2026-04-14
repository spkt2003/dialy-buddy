import { Apple } from "lucide-react";

export default function AIPlannerPage() {
  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-blue-700">
            <Apple className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-extrabold font-headline text-slate-900 mb-4">ระบบ AI จัดการโภชนาการสำหรับโรคไต</h1>
          <p className="text-slate-600 font-body max-w-2xl mx-auto text-xl leading-relaxed">มื้ออาหารส่วนบุคคล ออกแบบพิเศษให้ตรงตามผลเลือดของคุณ เพื่อควบคุมระดับโพแทสเซียม โซเดียม และฟอสฟอรัสอย่างปลอดภัย</p>
        </div>
        
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 min-h-[400px] flex items-center justify-center">
          <p className="text-slate-400 font-body text-lg">รออัพโหลด: กรุณาสแกนหรือถ่ายรูปเอกสารผลเลือดล่าสุดของคุณ เพื่อสร้างตารางอาหารใหม่...</p>
        </div>
      </div>
    </div>
  );
}
