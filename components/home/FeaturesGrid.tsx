import { ShieldCheck, Coins, Map, Lock } from "lucide-react";

export default function FeaturesGrid() {
  /**
   * FeaturesGrid Component (Presentational Component)
   * 
   * หน้าที่หลัก (Purpose):
   * ใช้สำหรับแสดงจุดเด่น (Features) ด้านความปลอดภัยและความน่าเชื่อถือของแพลตฟอร์ม
   * โดยออกแบบเป็น Grid Layout ที่แบ่งเป็น 2 ฝั่ง (ซ้าย: รายละเอียดข้อความ, ขวา: รูปภาพจำลอง UI)
   * 
   * การจัดการ State (State Management):
   * - เป็น Stateless Component (ไม่มีการใช้ useState หรือ hook ที่จัดการ State) 
   * - ทำหน้าที่เพียงแค่การแสดงผล UI แบบ Static ตามข้อมูลที่กำหนดไว้ในโค้ด (Hardcoded)
   * 
   * Business Logic:
   * - ไม่มีลอจิกทางธุรกิจที่ซับซ้อนหรือการเชื่อมต่อ API เน้นไปที่การจัดวางเลย์เอาต์ (Layout) 
   *   ให้สวยงามและรองรับ Responsive Design (Grid)
   */
  return (
    <section id="features" className="py-16 md:py-24 max-w-7xl mx-auto px-6">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-extrabold font-headline leading-tight text-on-background">เพราะคนที่คุณรักสำคัญที่สุด เราจึงดูแลทุกขั้นตอน<span className="text-primary">เหมือนดูแลคนในครอบครัวเรา</span></h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                <ShieldCheck className="text-primary h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold font-headline text-lg md:text-xl text-on-background">ตรวจสอบประวัติ 100%</h4>
                <p className="text-on-surface-variant font-body mt-2 leading-relaxed text-base md:text-lg">ผู้ดูแลทุกคนผ่านการตรวจสอบประวัติอาชญากรรมและการคัดกรองทางวิชาชีพอย่างเข้มงวด</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                <Coins className="text-primary h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold font-headline text-lg md:text-xl text-on-background">ค่าธรรมเนียมเป็นธรรม (10-15%)</h4>
                <p className="text-on-surface-variant font-body mt-2 leading-relaxed text-base md:text-lg">ระบบตั้งราคาที่โปร่งใส มั่นใจได้ว่าผู้ดูแลจะได้รับค่าตอบแทนที่เหมาะสมกับความมุ่งมั่นในการดูแล</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                <Map className="text-primary h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold font-headline text-lg md:text-xl text-on-background">ติดตามแบบเรียลไทม์ (Real-time)</h4>
                <p className="text-on-surface-variant font-body mt-2 leading-relaxed text-base md:text-lg">ระบบตรวจสอบด้วย GPS ช่วยให้ครอบครัวรับรู้สถานะการเดินทางได้ครบถ้วนตลอดการเดินทาง</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                <Lock className="text-primary h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold font-headline text-lg md:text-xl text-on-background">ระบบจ่ายเงินแบบ Escrow</h4>
                <p className="text-on-surface-variant font-body mt-2 leading-relaxed text-base md:text-lg">เงินของคุณจะถูกเก็บรักษาไว้โดยปลอดภัย จนกว่าการให้บริการจะสำเร็จลุล่วงด้วยดี</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
