"use client";
import { useState } from "react"; // 1. นำเข้า useState
import { Search, Star, ShieldCheck, MapPin, UserX } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

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
    location: "เขตดุสิต (ใกล้ รพ. วชิรพยาบาล)",
    rate: "250 บาท/ชม.",
    tags: ["ดูแลให้อาหารทางสายยาง", "ใจเย็น"],
  },
  {
    name: "ธนา มีสุข (พยาบาลวิชาชีพ)",
    rating: 5.0,
    reviews: 210,
    exp: "อดีตพยาบาลศูนย์ไตเทียม 8 ปี",
    location: "เขตพญาไท (ใกล้ รพ. รามาธิบดี)",
    rate: "400 บาท/ชม.",
    tags: ["วิเคราะห์ผลงดน้ำ", "เชี่ยวชาญไตวายเรื้อรัง"],
  },
  {
    name: "มาลี ศรีเมือง (ผู้ดูแลผ่านการอบรม)",
    rating: 4.7,
    reviews: 45,
    exp: "ผ่านการอบรมดูแลผู้ป่วยโรคไต (120 ชม.)",
    location: "เขตภาษีเจริญ (ใกล้ รพ. ธนบุรี 2)",
    rate: "200 บาท/ชม.",
    tags: ["ทำอาหารคุมเค็ม", "ช่วยพยุงเดิน"],
  }
];

export default function FindBuddyPage() {
  // 2. สร้าง State สำหรับการค้นหา
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(caregivers);

  // 3. ฟังก์ชันสำหรับการค้นหา
  const handleSearch = () => {
    const results = caregivers.filter((c) =>
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.exp.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(results);
  };

  return (
    <>
      <Navbar />
      <div className="bg-slate-50 min-h-[calc(100vh-80px)] pt-12 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl font-extrabold font-headline mb-4 text-slate-900">ค้นหาผู้ดูแล (Care Buddy) ของคุณ</h1>
          <p className="text-xl text-slate-700 font-body mb-8 leading-relaxed">เลือกผู้ดูแลที่ผ่านการตรวจสอบประวัติพร้อมช่วยเหลือคุณตลอดการเดินทางไปฟอกไต</p>

          {/* ส่วนช่องค้นหา */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-10">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 h-6 w-6" />
                <input
                  type="text"
                  placeholder="ระบุเขต หรือ โรงพยาบาล (เช่น ศิริราช, พญาไท...)"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 pl-16 pr-4 py-5 text-lg font-body text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-700/20 transition-all placeholder:text-slate-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  // ให้กด Enter เพื่อค้นหาได้
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold font-label min-w-[150px] shadow-lg hover:bg-blue-800 transition-colors text-xl"
              >
                ค้นหา
              </button>
            </div>
            {searchTerm && (
              <p className="mt-3 text-sm text-slate-500">
                กำลังแสดงผลลัพธ์สำหรับ: <span className="font-bold text-blue-600">"{searchTerm}"</span>
              </p>
            )}
          </div>

          <div className="space-y-8">
            {/* 4. แสดงข้อมูลที่ผ่านการกรองแล้ว */}
            {filteredData.length > 0 ? (
              filteredData.map((c, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-start md:items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
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
              ))
            ) : (
              // 5. กรณีไม่พบข้อมูลที่ค้นหา
              <div className="bg-white rounded-[2rem] p-16 text-center border-2 border-dashed border-slate-200">
                <div className="inline-flex p-6 bg-slate-50 rounded-full mb-4">
                  <UserX className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">ไม่พบผู้ดูแลในพื้นที่นี้</h3>
                <p className="text-slate-500 mt-2 text-lg">ลองค้นหาด้วยชื่อเขตอื่น หรือชื่อโรงพยาบาลอื่นๆ ดูนะคะ</p>
                <button
                  onClick={() => { setSearchTerm(""); setFilteredData(caregivers); }}
                  className="mt-6 text-blue-600 font-bold hover:underline"
                >
                  ล้างการค้นหาและแสดงทั้งหมด
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}