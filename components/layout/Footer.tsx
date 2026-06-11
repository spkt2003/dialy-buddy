import Link from "next/link";
import { Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full rounded-t-[3rem] mt-20 bg-surface-container ghost-border shadow-ambient relative z-10 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-16 max-w-7xl mx-auto">
        <div className="space-y-4">
          <span className="text-3xl font-bold text-on-background font-headline">Dialybuddy</span>
          <p className="text-on-surface-variant text-base font-body leading-relaxed max-w-xs">
            ออกแบบด้วยใจ เพื่อดูแลผู้ป่วยโรคไต ทำให้การดูแลรักษาเข้าถึงง่ายและเป็นมิตรกับผู้ป่วยทุกคน
          </p>
        </div>
        <div className="flex flex-col gap-4 pt-2">
          <p className="font-bold text-primary font-headline text-lg">บริการของเรา</p>
          <Link href="/find-buddy" className="text-on-surface-variant hover:text-on-background transition-colors text-base font-body">ค้นหาผู้ดูแล</Link>
          <Link href="/ai-planner" className="text-on-surface-variant hover:text-on-background transition-colors text-base font-body">AI จัดโภชนาการ</Link>
        </div>
        <div className="flex flex-col gap-4 pt-2">
          <p className="font-bold text-primary font-headline text-lg">กฎหมายและความปลอดภัย</p>
          <Link href="#" className="text-on-surface-variant hover:text-on-background transition-colors text-base font-body">ศูนย์รักษาความปลอดภัย</Link>
          <Link href="#" className="text-on-surface-variant hover:text-on-background transition-colors text-base font-body">นโยบายความเป็นส่วนตัว</Link>
        </div>
        <div className="space-y-4 pt-2">
          <p className="font-bold text-primary font-headline text-lg">ติดตามข่าวสาร</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="ที่อยู่อีเมลของคุณ"
              className="bg-surface-container-high ghost-border border rounded-xl text-base font-body w-full focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-on-surface-variant focus:outline-none px-4 py-3"
            />
            <button className="bg-primary text-on-primary px-4 rounded-xl hover:brightness-105 active:scale-95 transition duration-200 flex items-center justify-center shadow-ambient">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="px-8 py-6 border-t border-outline-variant/20 text-center text-on-surface-variant text-sm font-label tracking-widest uppercase">
        © {new Date().getFullYear()} Dialybuddy. สงวนลิขสิทธิ์
      </div>
    </footer>
  );
}
