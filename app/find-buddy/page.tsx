"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Star, ShieldCheck, MapPin, UserX, Calendar, Clock, ChevronDown } from "lucide-react";
import { PatientPageShell } from "@/components/layout/PatientPageShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { supabase } from "@/lib/supabaseClient";
import { MOCK_CAREGIVERS, type CaregiverCard } from "@/lib/mockData";

type Caregiver = CaregiverCard;

type CaregiverProfileRow = {
  id: string;
  name: string;
  service_area: string;
  certifications: string[];
  rating: number;
  reviews: number;
};

function profileToCaregiver(p: CaregiverProfileRow): Caregiver {
  const exp =
    p.certifications.length > 0
      ? p.certifications.slice(0, 2).join(" · ")
      : "ผู้ดูแลที่ผ่านการตรวจสอบจาก DialyBuddy";
  return {
    name: p.name,
    rating: Number(p.rating),
    reviews: p.reviews,
    exp,
    location: p.service_area,
    rate: "350 บาท/ชม.",
    tags: p.certifications,
  };
}

const HARDCODED_CAREGIVERS: Caregiver[] = MOCK_CAREGIVERS;

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
  "เขตบางกอกน้อย": "โรงพยาบาลศิริราช (ศูนย์ไตเทียม)",
  "เขตดุสิต (ใกล้ รพ. วชิรพยาบาล)": "โรงพยาบาลวชิรพยาบาล",
  "เขตดุสิต": "โรงพยาบาลวชิรพยาบาล",
  "เขตพญาไท (ใกล้ รพ. รามาธิบดี)": "โรงพยาบาลรามาธิบดี",
  "เขตพญาไท": "โรงพยาบาลรามาธิบดี",
  "เขตภาษีเจริญ (ใกล้ รพ. ธนบุรี 2)": "โรงพยาบาลธนบุรี 2",
  "เขตภาษีเจริญ": "โรงพยาบาลธนบุรี 2",
  "เขตบางรัก": "โรงพยาบาลจุฬาลงกรณ์",
  "เขตปทุมวัน": "โรงพยาบาลจุฬาลงกรณ์",
  "เขตสาทร": "โรงพยาบาลจุฬาลงกรณ์",
};

function StatusBadge({ name, onlineNames, busyNames, statusLoaded }: {
  name: string;
  onlineNames: Set<string>;
  busyNames: Set<string>;
  statusLoaded: boolean;
}) {
  if (!statusLoaded) return null;
  if (busyNames.has(name)) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        กำลังรับงาน
      </span>
    );
  }
  if (onlineNames.has(name)) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        ว่างรับงาน
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
      <span className="w-2 h-2 rounded-full bg-slate-400" />
      ออฟไลน์
    </span>
  );
}

export default function FindBuddyPage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [searchTerm, setSearchTerm] = useState("");
  const [allCaregivers, setAllCaregivers] = useState<Caregiver[]>([]);
  const [filteredData, setFilteredData] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(true);

  // Index of the card currently showing the booking mini-form; null = none expanded.
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [bookDate, setBookDate] = useState("");
  const [bookSlot, setBookSlot] = useState("");
  const [bookHospital, setBookHospital] = useState("");

  // ชื่อผู้ดูแลที่ online อยู่ (จาก Supabase Realtime Presence)
  const [onlineNames, setOnlineNames] = useState<Set<string>>(new Set());
  // ชื่อผู้ดูแลที่กำลังรับงานอยู่ (จาก active_jobs JOIN caregiver_profiles)
  const [busyNames, setBusyNames] = useState<Set<string>>(new Set());
  const [statusLoaded, setStatusLoaded] = useState(false);

  useEffect(() => {
    async function loadCaregivers() {
      const { data } = await supabase
        .from("caregiver_profiles")
        .select("id, name, service_area, certifications, rating, reviews")
        .order("created_at", { ascending: false });

      const real = (data ?? []).map((row) => profileToCaregiver(row as CaregiverProfileRow));
      const merged = [...real, ...HARDCODED_CAREGIVERS];
      setAllCaregivers(merged);
      setFilteredData(merged);
      setLoading(false);
    }
    loadCaregivers();
  }, []);

  // Subscribe to Supabase Realtime Presence — อัปเดต onlineNames ทุกครั้งที่ผู้ดูแลเข้า/ออกระบบ
  useEffect(() => {
    const channel = supabase.channel("caregiver-presence")
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<{ name: string }>();
        const names = new Set(
          Object.values(state).flat().map((p) => p.name).filter(Boolean)
        );
        setOnlineNames(names);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // ดึงและ subscribe realtime เพื่อรู้ว่าผู้ดูแลคนไหนกำลังรับงานอยู่
  useEffect(() => {
    const fetchBusy = async () => {
      const { data: activeJobsData } = await supabase
        .from("active_jobs")
        .select("caregiver_id")
        .not("caregiver_id", "is", null);

      const ids = (activeJobsData ?? [])
        .map((j: { caregiver_id: string }) => j.caregiver_id)
        .filter(Boolean);

      if (ids.length > 0) {
        const { data: profiles } = await supabase
          .from("caregiver_profiles")
          .select("name")
          .in("id", ids);
        setBusyNames(new Set((profiles ?? []).map((p: { name: string }) => p.name)));
      } else {
        setBusyNames(new Set());
      }
      setStatusLoaded(true);
    };

    fetchBusy();

    const realtimeChannel = supabase
      .channel("active_jobs_find_buddy")
      .on("postgres_changes", { event: "*", schema: "public", table: "active_jobs" }, fetchBusy)
      .subscribe();

    return () => { supabase.removeChannel(realtimeChannel); };
  }, []);

  const openForm = (idx: number) => {
    if (expandedIdx === idx) {
      setExpandedIdx(null);
      return;
    }
    setExpandedIdx(idx);
    setBookDate("");
    setBookSlot("");
    setBookHospital(HOSPITAL_FROM_LOCATION[filteredData[idx].location] ?? "");
  };

  const handleBooking = (caregiver: Caregiver) => {
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
    const q = searchTerm.toLowerCase();
    setFilteredData(
      allCaregivers.filter(
        (c) =>
          c.location.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.exp.toLowerCase().includes(q)
      )
    );
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredData(allCaregivers);
    setExpandedIdx(null);
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
              onClick={clearSearch}
              className="text-sm font-bold text-on-surface-variant hover:text-error flex items-center gap-1 transition-colors"
            >
              ✕ ล้างการค้นหา
            </button>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {loading ? (
          // Skeleton placeholders while fetching
          [1, 2, 3].map((n) => (
            <div key={n} className="bg-surface-container-lowest rounded-[2rem] shadow-ambient ghost-border p-8 animate-pulse">
              <div className="flex gap-8 items-center">
                <div className="w-24 h-24 rounded-full bg-surface-container-high shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-surface-container-high rounded-xl w-1/2" />
                  <div className="h-4 bg-surface-container-high rounded-xl w-1/3" />
                  <div className="h-4 bg-surface-container-high rounded-xl w-3/4" />
                </div>
              </div>
            </div>
          ))
        ) : filteredData.length > 0 ? (
          filteredData.map((c, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-[2rem] shadow-ambient ghost-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Caregiver info row */}
              <div className="p-5 sm:p-8 flex flex-col md:flex-row gap-6 sm:gap-8 items-start md:items-center">
                <div className="relative w-24 h-24 shrink-0">
                  <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-surface-container-lowest shadow-ambient flex items-center justify-center">
                    <span className="text-primary font-bold text-3xl">{c.name.charAt(0)}</span>
                  </div>
                  {statusLoaded && (
                    <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-surface-container-lowest ${
                      busyNames.has(c.name) ? "bg-amber-500" :
                      onlineNames.has(c.name) ? "bg-green-500" :
                      "bg-slate-400"
                    }`} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg sm:text-2xl font-bold font-headline text-on-background">{c.name}</h3>
                    <ShieldCheck className="h-7 w-7 text-primary" />
                    <StatusBadge name={c.name} onlineNames={onlineNames} busyNames={busyNames} statusLoaded={statusLoaded} />
                  </div>
                  <div className="flex items-center gap-2 mb-3 text-lg">
                    <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-on-background">{c.rating.toFixed(1)}</span>
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
                onClick={clearSearch}
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
