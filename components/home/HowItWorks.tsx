import { FileEdit, CalendarCheck, MapPin, CheckCircle } from "lucide-react";

const steps = [
  {
    title: "ขั้นตอนที่ 1: สร้างโปรไฟล์ส่วนตัว",
    description: "กำหนดโปรไฟล์สุขภาพและความต้องการเฉพาะของคุณได้ในไม่กี่นาที",
    icon: FileEdit,
  },
  {
    title: "ขั้นตอนที่ 2: วางแผนการดูแล",
    description: "จองผู้ดูแลที่คุณเลือก หรือเริ่มต้นทดลองใช้งาน AI จัดการโภชนาการ",
    icon: CalendarCheck,
  },
  {
    title: "ขั้นตอนที่ 3: ติดตามสถานะเรียลไทม์",
    description: "ครอบครัวสามารถติดตามสถานะการเดินทางและความปลอดภัยได้ตลอดเวลา",
    icon: MapPin,
  },
  {
    title: "ขั้นตอนที่ 4: ชำระเงินเมื่อสำเร็จ",
    description: "ด้วยระบบ Escrow เงินของคุณจะถูกโอนเมื่อบริการเสร็จสิ้นและคุณพึงพอใจแล้วเท่านั้น",
    icon: CheckCircle,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-surface-container-low border-t ghost-border">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold font-headline mb-16 text-center text-on-background">วิธีการใช้งาน</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              <div className="w-20 h-20 bg-surface-container-lowest rounded-full flex items-center justify-center mx-auto mb-6 shadow-ambient border border-outline-variant/15 group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300 text-on-background">
                <step.icon className="h-8 w-8" />
              </div>
              <h4 className="font-bold font-headline text-xl mb-3 text-on-background">{step.title}</h4>
              <p className="text-sm md:text-base text-on-surface-variant px-4 font-body leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
