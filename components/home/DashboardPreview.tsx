import { Stethoscope, Apple, CheckCircle } from "lucide-react";

export default function DashboardPreview() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold font-headline mb-4 text-on-background">ความอุ่นใจ <span className="text-tertiary">ส่งตรงถึงคุณทุกวัน</span></h2>
        <p className="text-on-surface-variant text-lg font-body max-w-2xl mx-auto leading-relaxed">การดูแลที่ง่ายขึ้นด้วยเทคโนโลยีและการใส่ใจจากเพื่อนมนุษย์</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-container-lowest p-10 rounded-[2rem] space-y-6 transition-transform hover:-translate-y-1 shadow-ambient ghost-border">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Stethoscope className="text-primary w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold font-headline text-on-background">ผู้ดูแลส่วนตัว (Escort Buddy)</h3>
          <p className="text-lg text-on-surface-variant font-body leading-relaxed">
            คุณไม่ต้องเดินเข้าโรงพยาบาลเพียงลำพังอีกต่อไป ผู้ดูแลของเราพร้อมเป็นเพื่อนร่วมเดินทาง ช่วยจัดการเรื่องลงทะเบียน และดูแลสุขภาพของคุณอย่างใกล้ชิดระหว่างฟอกไต
          </p>
          <ul className="space-y-4 pt-4">
            <li className="flex items-center gap-3 text-on-surface font-body"><span className="p-1 rounded-full bg-primary/10 text-primary"><CheckCircle className="w-5 h-5" /></span> บริการช่วยเหลือหน้าจุดลงทะเบียน</li>
            <li className="flex items-center gap-3 text-on-surface font-body"><span className="p-1 rounded-full bg-primary/10 text-primary"><CheckCircle className="w-5 h-5" /></span> ช่วยบันทึกและเตือนการรับประทานยา</li>
          </ul>
        </div>
        <div className="bg-surface-container-lowest p-10 rounded-[2rem] space-y-6 transition-transform hover:-translate-y-1 shadow-ambient ghost-border">
          <div className="w-16 h-16 bg-tertiary-container/30 rounded-2xl flex items-center justify-center">
            <Apple className="text-tertiary w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold font-headline text-on-background">AI จัดโภชนาการสำหรับโรคไต</h3>
          <p className="text-lg text-on-surface-variant font-body leading-relaxed">
            รับประทานอาหารได้อย่างสบายใจ AI ของเราจะช่วยวิเคราะห์โภชนาการให้ตรงกับระยะโรคของคุณ แนะนำสูตรอาหารปลอดภัยแสนอร่อยโดยไม่ทำลายสุขภาพ
          </p>
          <ul className="space-y-4 pt-4">
            <li className="flex items-center gap-3 text-on-surface font-body"><span className="p-1 rounded-full bg-tertiary-container text-tertiary-dim"><CheckCircle className="w-5 h-5" /></span> ตัวช่วยติดตามโซเดียมและโพแทสเซียม</li>
            <li className="flex items-center gap-3 text-on-surface font-body"><span className="p-1 rounded-full bg-tertiary-container text-tertiary-dim"><CheckCircle className="w-5 h-5" /></span> บันทึกมื้ออาหารส่วนบุคคลเฉพาะคุณ</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
