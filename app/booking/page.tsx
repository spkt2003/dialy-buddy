import { Calendar, Clock, MapPin, ShieldCheck, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function BookingPage() {
  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold font-headline text-slate-900 mb-8">สรุปการจองและชำระเงิน</h1>
        <p className="text-xl text-slate-700 mb-8">กรุณาตรวจสอบข้อมูลการจองและยอดชำระ Escrow ให้ถูกต้อง</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold font-headline text-slate-900 mb-8 pb-4 border-b border-slate-100">รายละเอียดการเดินทาง (ฟอกไต)</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">วันที่ต้องการจอง</h3>
                    <p className="text-lg text-slate-700">วันพฤหัสบดีที่ 14 พฤศจิกายน 2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                    <Clock className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">ระยะเวลาบริบาล</h3>
                    <p className="text-lg text-slate-700">09:00 น. - 13:00 น. (รวม 4 ชั่วโมง)</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">สถานที่นัดหมายรับ-ส่ง</h3>
                    <p className="text-lg text-slate-700 leading-relaxed">รับที่: ซอยจรัญสนิทวงศ์ 45<br/>ส่งที่: โรงพยาบาลศิริราช (ศูนย์ไตเทียม อาคาร 100 ปี)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold font-headline text-slate-900 mb-6 pb-4 border-b border-slate-100">ผู้ดูแลที่คุณเลือก</h2>
              <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="w-20 h-20 bg-blue-700 text-white rounded-full flex items-center justify-center shadow-md">
                  <span className="font-bold text-3xl">ส</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">สมศรี ใจดี <ShieldCheck className="text-blue-600 w-6 h-6" /></h3>
                  <p className="text-lg text-slate-700 mt-2">พยาบาลวิชาชีพ (รีวิว 4.9 ดาว)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2rem] shadow-md border border-slate-200 sticky top-28 xl:w-[400px]">
              <h2 className="text-2xl font-bold font-headline text-slate-900 mb-6 border-b border-slate-100 pb-4">สรุปยอดชำระ Escrow</h2>
              
              <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-800 mb-8 border border-blue-100">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <p className="text-sm leading-relaxed">เงินของคุณจะถูกพักไว้ในระบบอย่างปลอดภัย และจะถูกโอนให้ผู้ดูแลเมื่อการบริการเสร็จสิ้นเท่านั้น</p>
              </div>

              <div className="space-y-5 mb-8 text-lg">
                <div className="flex justify-between items-center text-slate-700">
                  <span>ค่าบริการผู้ดูแล (4 ชม. x 350)</span>
                  <span className="font-bold text-slate-900">1,400 ฿</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>ค่าธรรมเนียมแพลตฟอร์ม (Fair GP 15%)</span>
                  <span className="font-bold text-slate-900">210 ฿</span>
                </div>
                <div className="flex justify-between items-center text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                  <span>ส่วนลดสมาชิกใหม่</span>
                  <span className="font-bold">-200 ฿</span>
                </div>
              </div>

              <div className="border-t-2 border-slate-900 py-6 mb-6">
                <div className="flex justify-between items-end">
                  <span className="block text-slate-900 text-xl font-bold">ยอดชำระสุทธิ</span>
                  <span className="text-4xl font-extrabold text-blue-700">1,410 ฿</span>
                </div>
              </div>

              <Link href="/tracking" className="w-full flex items-center justify-center gap-3 bg-blue-700 text-white px-6 py-5 rounded-xl font-bold font-label shadow-lg hover:bg-blue-800 transition-colors text-xl">
                <ShieldCheck className="w-6 h-6" /> ชำระเงินเพื่อพักยอด
              </Link>
              
              <div className="mt-6 text-center text-slate-600 text-sm">
                <p>การทำธุรกรรมปลอดภัยด้วย 256-bit SSL Encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
