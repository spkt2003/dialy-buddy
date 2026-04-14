import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-tertiary/10 rounded-full blur-[100px]" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center rounded-full bg-tertiary-container px-4 py-1.5 text-xs font-bold tracking-wider uppercase font-label text-on-tertiary-container">
              <ShieldCheck className="mr-2 h-4 w-4" />
              การดูแลเฉพาะทางสำหรับผู้ป่วย
            </span>
          </div>
          <h1 className="mb-6 text-5xl md:text-7xl font-extrabold font-headline leading-[1.1] tracking-tight text-on-background">
            ค้นหาผู้ดูแลที่สมบูรณ์แบบ สำหรับพาคุณไป<span className="text-primary">ฟอกไต</span>
          </h1>
          <p className="mb-10 text-xl leading-relaxed text-on-surface-variant font-light sm:text-2xl transform">
            ออกแบบเฉพาะสำหรับผู้ป่วยโรคไต เพื่อให้คุณใช้ชีวิตได้อย่างมีความสุข และทานอาหารได้อย่างปลอดภัยด้วยระบบ AI จัดมื้ออาหารของเรา
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/find-buddy"
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-xl text-lg font-bold shadow-ambient hover:scale-95 duration-200 ease-in-out flex items-center justify-center gap-2 font-label"
            >
              ค้นหาผู้ดูแล
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/ai-planner"
              className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-xl text-lg font-bold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 font-label"
            >
              ทดลองใช้ AI จัดโภชนาการ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
