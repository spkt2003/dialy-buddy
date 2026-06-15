"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Star, ShieldCheck, MapPin, UserX, Calendar, Clock, ChevronDown } from "lucide-react";
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

const TIME_SLOTS = [
  "08:00 - 12:00 น.",
  "09:00 - 13:00 น.",
  "12:00 - 16:00 น.",
  "13:00 - 17:00 น.",
];

const HOSPITALS = [
  "โรงพยาบาลศิริราช (ศูนย์ไตเทียม)",
  "โรงพยาบาลรามาธิบดี",
  "โรงพยาบาลวชิรพยาบาล",
  "โรงพยาบาลธนบุรี 2",
  "โรงพยาบาลจุฬาลงกรณ์",
];

// Infer the nearest hospital from the caregiver's listed location.
const HOSPITAL_FROM_LOCATION: Record<string, string> = {
  "เขตบางกอกน้อย (ใกล้ รพ. ศิริราช)": "โรงพยาบาลศิริราช (ศูนย์ไตเทียม)",
  "เขตดุสิต (ใกล้ รพ. วชิรพยาบาล)": "โรงพยาบาลวชิรพยาบาล",
  "เขตพญาไท (ใกล้ รพ. รามาธิบดี)": "โรงพยาบาลรามาธิบดี",
  "เขตภาษีเจริญ (ใกล้ รพ. ธนบุรี 2)": "โรงพยาบาลธนบุรี 2",
};

export default function FindBuddyPage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(caregivers);

  // Index of the card currently showing the booking mini-form; null = none expanded.
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [bookDate, setBookDate] = useState("");
  const [bookSlot, setBookSlot] = useState("");
  const [bookHospital, setBookHospital] = useState("");

  const openForm = (idx: number) => {
    if (expandedIdx === idx) {
      setExpandedIdx(null);
      return;
    }
    setExpandedIdx(idx);
    setBookDate("");
    setBookSlot("");
    // Pre-select the hospital nearest to this caregiver's location.
    setBookHospital(HOSPITAL_FROM_LOCATION[filteredData[idx].location] ?? "");
  };

  const handleBooking = (caregiver: typeof caregivers[0]) => {
    const params = new URLSearchParams({
      name: caregiver.name,
      rating: String(caregiver.rating),
      reviews: String(caregiver.reviews),
      rate: caregiver.rate,
      location: caregiver.location,
      date: bookDate,
      slot: bookSlot,
      hospital: bookHospital,
    });
    router.push(`/booking?${params.toString()}`);
  };

  const handleSearch = () => {
    setExpandedIdx(null);
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

      {/* Search bar */}
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
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-on-surface-variant">
              กำลังแสดงผลลัพธ์สำหรับ: <span className="font-bold text-primary">&quot;{searchTerm}&quot;</span>
            </p>
            <button
              onClick={() => { setSearchTerm(""); setFilteredData(caregivers); setExpandedIdx(null); }}
              className="text-sm font-bold text-on-surface-variant hover:text-error flex items-center gap-1 transition-colors"
            >
              ✕ ล้างการค้นหา
            </button>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {filteredData.length > 0 ? (
          filteredData.map((c, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-[2rem] shadow-ambient ghost-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Caregiver info row */}
              <div className="p-5 sm:p-8 flex flex-col md:flex-row gap-6 sm:gap-8 items-start md:items-center">
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
                    onClick={() => openForm(i)}
                    className={`w-full text-center px-8 py-4 rounded-xl font-bold font-label shadow-ambient transition-colors text-xl ${
                      expandedIdx === i
                        ? "bg-surface-container-high text-on-surface border border-outline-variant/30"
                        : "bg-primary text-on-primary hover:bg-primary-dim"
                    }`}
                  >
                    {expandedIdx === i ? "ยุบ" : "เลือกวันและเวลา"}
                  </button>
                </div>
              </div>

              {/* Booking mini-form — expands inline when the user clicks the button */}
              {expandedIdx === i && (
                <div className="px-5 sm:px-8 pb-8 border-t border-outline-variant/15">
                  <p className="text-base font-bold text-on-surface-variant pt-6 mb-4">เลือกวันที่ เวลา และโรงพยาบาลที่ต้องการ</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

                    {/* Date */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-on-surface mb-2">
                        <Calendar className="w-4 h-4 text-primary" /> วันที่
                      </label>
                      <input
                        type="date"
                        min={today}
                        value={bookDate}
                        onChange={(e) => setBookDate(e.target.value)}
                        className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                    </div>

                    {/* Time slot */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-on-surface mb-2">
                        <Clock className="w-4 h-4 text-primary" /> ช่วงเวลา (4 ชม.)
                      </label>
                      <div className="relative">
                        <select
                          value={bookSlot}
                          onChange={(e) => setBookSlot(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all pr-9"
                        >
                          <option value="">เลือกช่วงเวลา...</option>
                          {TIME_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                      </div>
                    </div>

                    {/* Hospital */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-on-surface mb-2">
                        <MapPin className="w-4 h-4 text-primary" /> โรงพยาบาล
                      </label>
                      <div className="relative">
                        <select
                          value={bookHospital}
                          onChange={(e) => setBookHospital(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all pr-9"
                        >
                          <option value="">เลือกโรงพยาบาล...</option>
                          {HOSPITALS.map((h) => <option key={h} value={h}>{h}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBooking(c)}
                    disabled={!bookDate || !bookSlot || !bookHospital}
                    className="w-full sm:w-auto px-10 py-4 bg-primary text-on-primary font-bold font-label rounded-xl shadow-ambient hover:bg-primary-dim transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ยืนยันและดำเนินการต่อ →
                  </button>
                </div>
              )}
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
