import { Handshake, Building2, Stethoscope, HeartPulse, Activity } from "lucide-react";

export default function PartnersSection() {
  return (
    <section className="py-20 bg-surface-container-low overflow-hidden border-b ghost-border">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm font-label uppercase tracking-[0.1em] text-on-surface-variant mb-12">สร้างความเชื่อมั่นร่วมกับพันธมิตรเครือข่ายทางการแพทย์</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 hover:opacity-100 transition-all duration-500 text-on-surface-variant hover:text-on-background">
          <div className="flex items-center gap-2 font-bold text-xl font-headline">
            <Building2 className="w-8 h-8 opacity-70" /> โรงพยาบาล
          </div>
          <div className="flex items-center gap-2 font-bold text-xl font-headline">
            <Activity className="w-8 h-8 opacity-70" /> ศูนย์ไตเทียม
          </div>
          <div className="flex items-center gap-2 font-bold text-xl font-headline">
            <Stethoscope className="w-8 h-8 opacity-70" /> นักกำหนดอาหาร
          </div>
          <div className="flex items-center gap-2 font-bold text-xl font-headline">
            <HeartPulse className="w-8 h-8 opacity-70" /> คลินิกเฉพาะทาง
          </div>
          <div className="flex items-center gap-2 font-bold text-xl font-headline">
            <Handshake className="w-8 h-8 opacity-70" /> ประกันสุขภาพ
          </div>
        </div>
      </div>
    </section>
  );
}
