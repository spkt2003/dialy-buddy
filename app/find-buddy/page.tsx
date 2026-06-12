"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Star, ShieldCheck, MapPin, UserX } from "lucide-react";
import { PatientPageShell } from "@/components/layout/PatientPageShell";
import { EmptyState } from "@/components/ui/EmptyState";

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
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(caregivers);

  const handleBooking = (caregiver: typeof caregivers[0]) => {
    const params = new URLSearchParams({
      name: caregiver.name,
      rating: String(caregiver.rating),
      reviews: String(caregiver.reviews),
      rate: caregiver.rate,
      location: caregiver.location,
    });
    router.push(`/booking?${params.toString()}`);
  };

  const handleSearch = () => {
    const results = caregivers.filter((c) =>
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.exp.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(results);
  };

  return (
    <PatientPageShell maxWidth="max-w-5xl">
          <h1 className="text-2xl sm:text-4xl font-extrabold font-headline mb-4 text-on-background">ค้นหาผู้ดูแล (Care Buddy) ของคุณ</h1>
          <p className="text-base sm:text-xl text-on-surface font-body mb-6 sm:mb-8 leading-relaxed">เลือกผู้ดูแลที่ผ่านการตรวจสอบประวัติพร้อมช่วยเหลือคุณตลอดการเดินทางไปฟอกไต</p>

          {/* ส่วนช่องค้นหา */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-ambient ghost-border mb-10">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant h-6 w-6" />
                <input
                  type="text"
                  placeholder="ระบุเขต หรือ โรงพยาบาล (เช่น ศิริราช, พญาไท...)"
                  className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container-low pl-16 pr-4 py-5 text-lg font-body text-on-surface focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  // ให้กด Enter เพื่อค้นหาได้
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-primary text-on-primary px-10 py-5 rounded-2xl font-bold font-label min-w-[150px] shadow-ambient hover:bg-primary-dim transition-colors text-xl"
              >
                ค้นหา
              </button>
            </div>
            {searchTerm && (
              <p className="mt-3 text-sm text-on-surface-variant">
                กำลังแสดงผลลัพธ์สำหรับ: <span className="font-bold text-primary">&quot;{searchTerm}&quot;</span>
              </p>
            )}
          </div>

          <div className="space-y-8">
            {/* 4. แสดงข้อมูลที่ผ่านการกรองแล้ว */}
            {filteredData.length > 0 ? (
              filteredData.map((c, i) => (
                <div key={i} className="bg-surface-container-lowest p-5 sm:p-8 rounded-[2rem] shadow-ambient ghost-border flex flex-col md:flex-row gap-6 sm:gap-8 items-start md:items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-surface-container-lowest shadow-ambient flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-3xl">{c.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg sm:text-2xl font-bold font-headline text-on-background">{c.name}</h3>
                      <ShieldCheck className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-lg">
                      <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-on-background">{c.rating}</span>
                      <span className="text-on-surface-variant">({c.reviews} รีวิว)</span>
                    </div>
                    <p className="text-on-surface font-body text-base sm:text-xl mb-2 leading-relaxed">{c.exp}</p>
                    <p className="text-on-surface-variant font-body flex items-center gap-2 text-sm sm:text-lg mb-4">
                      <MapPin className="h-6 w-6 text-on-surface-variant shrink-0" /> {c.location}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {c.tags.map(tag => (
                        <span key={tag} className="px-4 py-1.5 bg-primary/5 text-primary rounded-full text-base font-label font-bold border border-primary/10">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center md:items-end gap-6 shrink-0 mt-6 md:mt-0 w-full md:w-auto border-t md:border-t-0 md:border-l border-outline-variant/15 pt-6 md:pt-0 md:pl-8">
                    <div className="text-center md:text-right w-full">
                      <div className="text-xl sm:text-3xl font-extrabold font-headline text-primary bg-primary/5 inline-block px-4 py-2 rounded-xl">{c.rate}</div>
                      <div className="text-on-surface-variant text-base mt-2">ยังไม่รวมค่าธรรมเนียมแพลตฟอร์ม</div>
                    </div>
                    <button
                      onClick={() => handleBooking(c)}
                      className="w-full text-center bg-primary text-on-primary px-8 py-4 rounded-xl font-bold font-label shadow-ambient hover:bg-primary-dim transition-colors text-xl"
                    >
                      จองคิวผู้ดูแล
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={<UserX className="w-12 h-12" />}
                message="ไม่พบผู้ดูแลในพื้นที่นี้"
                subMessage="ลองค้นหาด้วยชื่อเขตอื่น หรือชื่อโรงพยาบาลอื่นๆ ดูนะคะ"
                dashed
                action={
                  <button
                    onClick={() => { setSearchTerm(""); setFilteredData(caregivers); }}
                    className="text-primary font-bold hover:underline"
                  >
                    ล้างการค้นหาและแสดงทั้งหมด
                  </button>
                }
              />
            )}
          </div>
    </PatientPageShell>
  );
}