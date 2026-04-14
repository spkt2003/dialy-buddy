export default function StatsSection() {
  return (
    <section className="py-20 bg-surface-container-low">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative shadow-ambient ghost-border">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-on-background leading-tight">เข้าใจถึงผลกระทบระดับประเทศ</h2>
            <p className="text-lg text-on-surface-variant font-body leading-relaxed">ปัญหาสุขภาพไตเป็นเรื่องที่เพิ่มสูงขึ้นอย่างต่อเนื่อง เราอยู่ที่นี่เพื่อช่วยเป็นศูนย์กลางเชื่อมโยงระหว่างการรักษาพยาบาล และการใช้ชีวิตประจำวันของคุณให้ง่ายขึ้น</p>
            <div className="flex items-center gap-4 py-4">
              <div className="h-12 w-1.5 bg-primary rounded-full"></div>
              <span className="text-6xl font-extrabold font-headline text-primary">17.6%</span>
              <span className="text-xl text-on-surface-variant font-medium font-body mt-2">ของประชากรไทย</span>
            </div>
          </div>
          <div className="md:w-1/2 relative flex justify-center">
            <div className="w-72 h-72 rounded-full border-[16px] border-surface-container-high relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[16px] border-primary" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 17.6% 0%)' }}></div>
              <div className="text-center">
                <p className="text-4xl font-extrabold font-headline text-on-background">11.6 ล้าน</p>
                <p className="text-sm font-label uppercase tracking-widest text-on-surface-variant mt-1">ผู้ป่วยโรคไตทั้งหมด</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
