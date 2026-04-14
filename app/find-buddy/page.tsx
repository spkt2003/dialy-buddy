import { Search, Star, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";

const caregivers = [
  {
    name: "สมศรี ใจดี (พยาบาลวิชาชีพ)",
    rating: 4.9,
    reviews: 124,
    exp: "เชี่ยวชาญการดูแลผู้ป่วยฟอกไต 5 ปี",
    location: "เขตบางกอกน้อย (ใกล้ รพ. ศิริราช)",
    rate: "350 บาท/ชม.",
    tags: ["ฉีดยาเบื้องต้นได้", "ขับรถยนต์ส่วนตัว"],
  },
  {
    name: "วิภา รักษ์สุขภาพ (ผู้ช่วยพยาบาล)",
    rating: 4.8,
    reviews: 89,
    exp: "ประสบการณ์ดูแลผู้สูงอายุติดเตียง 3 ปี",
    location: "เขตดุสิต",
    rate: "250 บาท/ชม.",
    tags: ["ดูแลให้อาหารทางสายยาง", "ใจเย็น"],
  },
  {
    name: "ธนา มีสุข (พยาบาลวิชาชีพ)",
    rating: 5.0,
    reviews: 210,
    exp: "อดีตพยาบาลศูนย์ไตเทียม 8 ปี",
    location: "เขตพญาไท",
    rate: "400 บาท/ชม.",
    tags: ["วิเคราะห์ผลงดน้ำ", "เชี่ยวชาญไตวายเรื้อรัง"],
  },
  {
    name: "มาลี ศรีเมือง (ผู้ดูแลผ่านการอบรม)",
    rating: 4.7,
    reviews: 45,
    exp: "ผ่านการอบรมดูแลผู้ป่วยโรคไต (120 ชม.)",
    location: "เขตภาษีเจริญ",
    rate: "200 บาท/ชม.",
    tags: ["ทำอาหารคุมเค็ม", "ช่วยพยุงเดิน"],
  }
];

export default function FindBuddyPage() {
  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] pt-12 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold font-headline mb-4 text-slate-900">ค้นหาผู้ดูแล (Care Buddy) ของคุณ</h1>
        <p className="text-xl text-slate-700 font-body mb-8 leading-relaxed">เลือกผู้ดูแลที่ผ่านการตรวจสอบประวัติพร้อมช่วยเหลือคุณตลอดการเดินทางไปฟอกไต</p>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 h-6 w-6" />
              <input type="text" placeholder="ระบุตำแหน่ง หรือ โรงพยาบาลที่ต้องการไป..." className="w-full rounded-2xl border border-slate-300 bg-slate-50 pl-16 pr-4 py-5 text-lg font-body text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-700/20 transition-all placeholder:text-slate-500" />
            </div>
            <button className="bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold font-label min-w-[150px] shadow-lg hover:bg-blue-800 transition-colors text-xl">ค้นหา</button>
          </div>
        </div>

        <div className="space-y-8">
          {caregivers.map((c, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-white shadow-sm flex items-center justify-center shrink-0">
                <span className="text-blue-700 font-bold text-3xl">{c.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold font-headline text-slate-900">{c.name}</h3>
                  <ShieldCheck className="h-7 w-7 text-blue-600" />
                </div>
                <div className="flex items-center gap-2 mb-3 text-lg">
                  <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-slate-900">{c.rating}</span>
                  <span className="text-slate-600">({c.reviews} รีวิว)</span>
                </div>
                <p className="text-slate-800 font-body text-xl mb-2 leading-relaxed">{c.exp}</p>
                <p className="text-slate-600 font-body flex items-center gap-2 text-lg mb-4">
                  <MapPin className="h-6 w-6 text-slate-400 shrink-0" /> {c.location}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {c.tags.map(tag => (
                    <span key={tag} className="px-4 py-1.5 bg-blue-50 text-blue-800 rounded-full text-base font-label font-bold border border-blue-100">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end gap-6 shrink-0 mt-6 md:mt-0 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                <div className="text-center md:text-right w-full">
                  <div className="text-3xl font-extrabold font-headline text-blue-700 bg-blue-50/50 inline-block px-4 py-2 rounded-xl">{c.rate}</div>
                  <div className="text-slate-500 text-base mt-2">ยังไม่รวมค่าธรรมเนียมแพลตฟอร์ม</div>
                </div>
                <Link href="/booking" className="w-full text-center bg-blue-700 text-white px-8 py-4 rounded-xl font-bold font-label shadow-lg hover:bg-blue-800 transition-colors text-xl">
                  จองคิวผู้ดูแล
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
