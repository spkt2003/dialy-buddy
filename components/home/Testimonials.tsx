import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-surface-container-low border-t ghost-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold font-headline mb-4 text-on-background">ฟังเสียงจากผู้รับบริการของเรา</h2>
          <p className="text-on-surface-variant text-lg font-body">ประสบการณ์จริงจากผู้ใช้งาน ผู้ป่วย และครอบครัว</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { tag: "คำบอกเล่า", quote: "การมีผู้ดูแลมืออาชีพไปเป็นเพื่อนคุณพ่อตอนฟอกไต ช่วยแบ่งเบาภาระจิตใจได้มาก ระบบหน้าจอติดตามก็ช่วยให้เรารู้ว่าคุณพ่อปลอดภัยตลอดเวลา", name: "กัญญา ส.", role: "ญาติและลูกสาวของผู้ป่วย" },
            { tag: "คำบอกเล่า", quote: "AI ช่วยจัดตารางอาหารได้วิเศษมาก ภาพอาหารไม่น่าเบื่อเหมือนแต่ก่อน และผลเลือดรอบนี้คุณหมอก็ยังชมว่าคุมอาหารได้ในเกณฑ์ยอดเยี่ยม", name: "วิชัย ต.", role: "ผู้ป่วยโรคไตระยะที่ 4" },
            { tag: "คำบอกเล่า", quote: "Dialybuddy ทำให้คนป่วยอย่างฉันรู้สึกว่าไม่ได้สู้อยู่คนเดียว น้องพยาบาลที่มาดูแลน่ารักมาก ช่วยจัดการจองคิวโรงพยาบาลได้เร็วมากเลยค่ะ", name: "สมหมาย พ.", role: "ผู้ป่วยฟอกไตประจำ" },
          ].map((item, i) => (
            <div key={i} className="bg-surface-container-lowest p-10 rounded-[2rem] shadow-ambient ghost-border relative transition-transform hover:-translate-y-1">
              <Quote className="absolute top-8 right-8 h-12 w-12 text-primary/10" />
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-5 w-5 text-tertiary fill-tertiary" />
                ))}
              </div>
              <p className="text-on-surface-variant font-body mb-8 relative z-10 leading-relaxed text-lg">
                "{item.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/20 border-2 border-surface-container-lowest shadow-sm flex items-center justify-center font-bold text-primary text-xl pb-1">{item.name.charAt(0)}</div>
                <div>
                  <p className="font-bold font-headline text-on-background text-lg">{item.name}</p>
                  <p className="text-sm text-on-surface-variant font-label">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
