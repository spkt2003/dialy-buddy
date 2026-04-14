import Link from "next/link";
import { Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full rounded-t-[3rem] mt-20 bg-slate-950 border-t border-slate-900 shadow-[0_-12px_32px_-4px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-16 max-w-7xl mx-auto relative z-10">
        <div className="space-y-4">
          <span className="text-3xl font-bold text-white font-headline">Dialybuddy</span>
          <p className="text-slate-300 text-base font-body leading-relaxed max-w-xs">
            ออกแบบด้วยใจ เพื่อดูแลผู้ป่วยโรคไต ทำให้การดูแลรักษาเข้าถึงง่ายและเป็นมิตรกับผู้ป่วยทุกคน
          </p>
        </div>
        <div className="flex flex-col gap-4 pt-2">
          <p className="font-bold text-sky-300 font-headline text-lg">บริการของเรา</p>
          <Link href="/find-buddy" className="text-slate-300 hover:text-white transition-all text-base font-body">ค้นหาผู้ดูแล</Link>
          <Link href="/ai-planner" className="text-slate-300 hover:text-white transition-all text-base font-body">AI จัดโภชนาการ</Link>
        </div>
        <div className="flex flex-col gap-4 pt-2">
          <p className="font-bold text-sky-300 font-headline text-lg">กฎหมายและความปลอดภัย</p>
          <Link href="#" className="text-slate-300 hover:text-white transition-all text-base font-body">ศูนย์รักษาความปลอดภัย</Link>
          <Link href="#" className="text-slate-300 hover:text-white transition-all text-base font-body">นโยบายความเป็นส่วนตัว</Link>
        </div>
        <div className="space-y-4 pt-2">
          <p className="font-bold text-sky-300 font-headline text-lg">ติดตามข่าวสาร</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="ที่อยู่อีเมลของคุณ"
              className="bg-slate-800 border bg-opacity-50 border-slate-700 rounded-xl text-base font-body w-full focus:ring-2 focus:ring-sky-500 text-white placeholder-slate-400 focus:outline-none px-4 py-3" 
            />
            <button className="bg-sky-600 text-white px-4 rounded-xl hover:bg-sky-500 transition-colors flex items-center justify-center shadow-lg">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="px-8 py-6 border-t border-slate-800 text-center text-slate-400 text-sm font-label tracking-widest uppercase relative z-10">
        © {new Date().getFullYear()} Dialybuddy. สงวนลิขสิทธิ์
      </div>
    </footer>
  );
}
