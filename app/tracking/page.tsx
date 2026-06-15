// app/tracking/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, Navigation, Phone, ShieldAlert, MessageCircle,
  Clock, HeartPulse, Car, AlertTriangle, CheckCircle2, Star, Send,
} from "lucide-react";
import { PatientPageShell } from "@/components/layout/PatientPageShell";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import type { Message } from "@/types";

const STEP_LABELS = [
  "กำลังเดินทางมารับคุณ",
  "ผู้ดูแลมาถึงแล้ว",
  "กำลังเดินทางไปโรงพยาบาล",
  "ถึงโรงพยาบาลแล้ว / กำลังฟอกไต",
  "เสร็จสิ้น — ส่งกลับบ้านเรียบร้อย",
];

type ActiveJobRow = {
  id: string;
  patient_name: string;
  patient_image: string | null;
  destination: string;
  time_slot: string;
  date: string;
  type: string;
  current_step: number;
  caregiver_id: string | null;
};

export default function TrackingPage() {
  const { userName } = useAuth();
  const router = useRouter();
  const [liveJob, setLiveJob] = useState<ActiveJobRow | null>(null);
  const [hasPendingBooking, setHasPendingBooking] = useState(false);
  const [loading, setLoading] = useState(true);

  const hasActiveJobRef = useRef(false);
  const caregiverIdRef = useRef<string | null>(null);
  useEffect(() => {
    hasActiveJobRef.current = liveJob !== null;
    caregiverIdRef.current = liveJob?.caregiver_id ?? null;
  }, [liveJob]);

  const [ratingCaregiverId, setRatingCaregiverId] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [starHover, setStarHover] = useState(0);
  const [starSelected, setStarSelected] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  const [isChatOpen, setChatOpen] = useState(false);
  const [isCallOpen, setCallOpen] = useState(false);
  const [isEmergencyOpen, setEmergencyOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatUnread, setChatUnread] = useState(0);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const isChatOpenRef = useRef(false);
  useEffect(() => { isChatOpenRef.current = isChatOpen; }, [isChatOpen]);

  useEffect(() => {
    Promise.all([
      supabase
        .from("active_jobs")
        .select("id, patient_name, patient_image, destination, time_slot, date, type, current_step, caregiver_id")
        .eq("patient_name", userName)
        .maybeSingle(),
      supabase
        .from("pending_jobs")
        .select("id")
        .eq("patient_name", userName)
        .eq("status", "pending")
        .maybeSingle(),
    ]).then(([{ data: activeData }, { data: pendingData }]) => {
      setLiveJob(activeData ?? null);
      setHasPendingBooking(!!pendingData);
      setLoading(false);
    });

    const activeChannel = supabase
      .channel("active_jobs_patient_view")
      .on("postgres_changes", { event: "*", schema: "public", table: "active_jobs" }, (payload) => {
        if (payload.eventType === "DELETE") {
          if (hasActiveJobRef.current) {
            // payload.old มีแค่ primary key — ใช้ ref ที่เก็บไว้ก่อนหน้าแทน
            setRatingCaregiverId(caregiverIdRef.current);
            setShowRatingModal(true);
          }
        } else if ((payload.new as ActiveJobRow).patient_name === userName) {
          setLiveJob(payload.new as ActiveJobRow);
        }
      })
      .subscribe();

    const pendingChannel = supabase
      .channel("pending_jobs_patient_view")
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "pending_jobs" }, () =>
        setHasPendingBooking(false)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(activeChannel);
      supabase.removeChannel(pendingChannel);
    };
  }, [userName]);

  // โหลดข้อความเก่าเมื่อมี active job
  useEffect(() => {
    if (!liveJob?.id) return;
    supabase
      .from("chat_messages")
      .select("id, sender, text, created_at, read_at")
      .eq("job_id", liveJob.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!data) return;
        setMessages(
          data.map((row) => ({
            id: new Date(row.created_at).getTime(),
            sender: row.sender as Message["sender"],
            text: row.text,
            readAt: row.read_at ? new Date(row.read_at).getTime() : undefined,
          }))
        );
      });
  }, [liveJob?.id]);

  useEffect(() => {
    if (!liveJob?.id) return;
    const jobId = liveJob.id;
    const channel = supabase
      .channel(`chat_patient_${jobId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `job_id=eq.${jobId}` },
        (payload) => {
          const row = payload.new as { id: string; sender: string; text: string; created_at: string; read_at: string | null };
          const ts = new Date(row.created_at).getTime();
          setMessages((prev) => {
            if (prev.some((m) => m.id === ts)) return prev;
            const msg: Message = {
              id: ts,
              sender: row.sender as Message["sender"],
              text: row.text,
              readAt: (row.sender === "caregiver" && isChatOpenRef.current) ? Date.now() : undefined,
            };
            if (row.sender === "caregiver" && !isChatOpenRef.current) {
              setChatUnread((u) => u + 1);
            }
            return [...prev, msg];
          });
          // patient เปิดแชทอยู่ -> mark ข้อความ caregiver เป็นอ่านแล้วทันที
          if (row.sender === "caregiver" && isChatOpenRef.current) {
            supabase
              .from("chat_messages")
              .update({ read_at: new Date().toISOString() })
              .eq("id", row.id)
              .then();
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "chat_messages" },
        (payload) => {
          const row = payload.new as { id: string; job_id: string; sender: string; text: string; created_at: string; read_at: string | null };
          if (row.job_id !== jobId || !row.read_at) return;
          const ts = new Date(row.created_at).getTime();
          setMessages((prev) =>
            prev.map((m) => (m.id === ts ? { ...m, readAt: new Date(row.read_at!).getTime() } : m))
          );
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [liveJob?.id]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatOpen]);

  const handleChatOpen = () => {
    setChatOpen(true);
    setChatUnread(0);
    if (liveJob?.id) {
      // mark ข้อความ caregiver ทั้งหมดที่ยังไม่ได้อ่านเป็นอ่านแล้ว
      supabase
        .from("chat_messages")
        .update({ read_at: new Date().toISOString() })
        .eq("job_id", liveJob.id)
        .eq("sender", "caregiver")
        .is("read_at", null)
        .then();
      setMessages((prev) =>
        prev.map((m) =>
          m.sender === "caregiver" && !m.readAt ? { ...m, readAt: Date.now() } : m
        )
      );
    }
  };

  const handleSend = async () => {
    if (!chatInput.trim() || !liveJob?.id) return;
    const text = chatInput.trim();
    setChatInput("");
    const optimisticId = Date.now();
    setMessages((prev) => [...prev, { id: optimisticId, sender: "patient", text }]);
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({ job_id: liveJob.id, sender: "patient", text })
      .select()
      .single();
    if (error) {
      console.error("patient chat send:", error.message);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
    } else if (data) {
      const realId = new Date((data as { created_at: string }).created_at).getTime();
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticId ? { ...m, id: realId } : m))
      );
    }
  };

  const handleSubmitRating = async (skip = false) => {
    if (!skip && starSelected > 0 && ratingCaregiverId) {
      setRatingSubmitting(true);
      const { data } = await supabase
        .from("caregiver_profiles")
        .select("rating, reviews")
        .eq("id", ratingCaregiverId)
        .maybeSingle();
      if (data) {
        const newReviews = data.reviews + 1;
        const newRating = (data.rating * data.reviews + starSelected) / newReviews;
        await supabase
          .from("caregiver_profiles")
          .update({ rating: Math.round(newRating * 100) / 100, reviews: newReviews })
          .eq("id", ratingCaregiverId);
      }
      setRatingSubmitting(false);
    }
    setShowRatingModal(false);
    router.push("/dashboard");
  };

  const handleEndCall = () => setCallOpen(false);
  const handleConfirmEmergency = () => {
    alert("รายงานเหตุฉุกเฉินสำเร็จ");
    setEmergencyOpen(false);
  };

  const currentStep = liveJob?.current_step ?? 0;
  const chatLastReadIdx = messages.reduce(
    (acc, m, i) => (m.sender === "patient" && m.readAt !== undefined ? i : acc),
    -1
  );

  if (loading) {
    return (
      <PatientPageShell maxWidth="max-w-6xl" pt="pt-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </PatientPageShell>
    );
  }

  if (!liveJob && hasPendingBooking) {
    return (
      <PatientPageShell maxWidth="max-w-6xl" pt="pt-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 py-16">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-on-background mb-2">กำลังรอผู้ดูแลรับงานของคุณ</h2>
            <p className="text-on-surface-variant max-w-sm mx-auto">
              คำจองของคุณถูกส่งแล้ว เมื่อผู้ดูแลรับงาน หน้านี้จะอัปเดตสถานะแบบเรียลไทม์โดยอัตโนมัติ
            </p>
          </div>
        </div>
      </PatientPageShell>
    );
  }

  if (!liveJob) {
    return (
      <PatientPageShell maxWidth="max-w-6xl" pt="pt-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 py-16">
          <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center">
            <Navigation className="w-12 h-12 text-on-surface-variant" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-on-background mb-2">ยังไม่มีการเดินทางที่กำลังดำเนินการ</h2>
            <p className="text-on-surface-variant max-w-sm mx-auto">
              เมื่อผู้ดูแลรับงานของคุณแล้ว สถานะจะปรากฏที่นี่แบบเรียลไทม์โดยอัตโนมัติ
            </p>
          </div>
        </div>
      </PatientPageShell>
    );
  }

  return (
    <>
      <PatientPageShell maxWidth="max-w-6xl" pt="pt-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-primary">
              <HeartPulse className="w-5 h-5" />
              <span className="font-semibold text-sm tracking-wide">DIALYBUDDY TRACKING</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-on-background tracking-tight">ติดตามการเดินทาง</h1>
            <p className="text-on-surface-variant mt-2 text-lg">อัปเดตตำแหน่งและสถานะแบบเรียลไทม์</p>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 bg-tertiary-container/30 text-tertiary rounded-2xl border border-tertiary/10 shadow-ambient w-fit">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-tertiary" />
            </span>
            <span className="font-bold text-sm md:text-base">{STEP_LABELS[currentStep]}</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-[2.5rem] shadow-ambient ghost-border overflow-hidden relative flex flex-col">
          <div className="h-[400px] md:h-[480px] bg-surface-container-low relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
            <svg className="absolute w-full h-full" preserveAspectRatio="none">
              <path d="M 20,80 Q 50,50 80,20" fill="none" stroke="#0c7a8a" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 10" className="opacity-40" />
            </svg>

            <div className="absolute top-4 left-4 right-4 z-20">
              <div className="bg-surface-container-lowest/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-sm border border-outline-variant/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-on-surface-variant">ความคืบหน้า</span>
                  <span className="text-xs font-bold text-primary">{currentStep + 1} / {STEP_LABELS.length}</span>
                </div>
                <div className="flex gap-1">
                  {STEP_LABELS.map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= currentStep ? "bg-primary" : "bg-surface-container-high"}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="bg-surface-container-lowest/90 backdrop-blur-md px-8 py-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-surface-container-lowest flex flex-col items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 text-primary">
                  <Navigation className="w-6 h-6 animate-pulse" />
                </div>
                <p className="text-sm text-on-surface-variant font-medium mb-1">ปลายทาง</p>
                <p className="text-xl font-black text-on-background tracking-tight">{liveJob.destination}</p>
                <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <Clock className="w-4 h-4 text-on-surface-variant" />
                  <span className="text-on-surface-variant font-medium text-sm">{liveJob.time_slot}</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-[20%] left-[20%] z-10 flex flex-col items-center">
              <div className="w-10 h-10 bg-on-background rounded-full border-4 border-surface-container-lowest shadow-lg flex items-center justify-center text-surface-container-lowest">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="mt-2 text-xs font-bold bg-surface-container-lowest px-2 py-1 rounded-md shadow-sm text-on-surface">จุดรับ</span>
            </div>
            <div className="absolute top-[20%] right-[20%] z-10 flex flex-col items-center">
              <div className="w-12 h-12 bg-tertiary rounded-full border-4 border-surface-container-lowest shadow-lg flex items-center justify-center text-on-tertiary">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="mt-2 text-xs font-bold bg-surface-container-lowest px-2 py-1 rounded-md shadow-sm text-on-surface">โรงพยาบาล</span>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-surface-container-lowest z-30">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-5 w-full lg:w-auto">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-tr from-primary to-primary-fixed rounded-full flex items-center justify-center shadow-ambient">
                    <span className="text-on-primary font-bold text-3xl">ส</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-tertiary border-2 border-surface-container-lowest rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-on-background">สมศรี สมหมาย</h3>
                  <p className="text-primary font-medium text-sm md:text-base mb-2">ผู้ดูแล (พยาบาลวิชาชีพ)</p>
                  <div className="flex items-center gap-2 text-on-surface-variant text-sm bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/10 w-fit">
                    <Car className="w-4 h-4 text-on-surface-variant" />
                    <span>ฮอนด้า ซิตี้ สีขาว <span className="font-bold">กท 1234 กรุงเทพมหานคร</span></span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto">
                <button
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-surface-container-lowest text-error font-bold hover:bg-error/5 transition-colors border border-error/20 shadow-ambient group"
                  onClick={() => setEmergencyOpen(true)}
                >
                  <ShieldAlert className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>แจ้งเหตุฉุกเฉิน</span>
                </button>
                <button
                  className="flex-[1_1_45%] lg:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary/5 text-primary font-bold hover:bg-primary/10 transition-colors border border-primary/10"
                  onClick={() => setCallOpen(true)}
                >
                  <Phone className="w-5 h-5" />
                  <span>โทรหาผู้ดูแล</span>
                </button>
                <button
                  className="relative flex-[1_1_45%] lg:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-on-primary font-bold hover:bg-primary-dim transition-colors shadow-ambient"
                  onClick={handleChatOpen}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>แชท</span>
                  {chatUnread > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] bg-error text-on-error text-[11px] font-extrabold rounded-full flex items-center justify-center px-1 shadow-sm">
                      {chatUnread}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-surface-container-lowest rounded-[2rem] p-8 shadow-ambient ghost-border">
          <h2 className="text-xl font-bold text-on-background mb-6">สถานะการดำเนินการ</h2>
          <div className="space-y-3">
            {STEP_LABELS.map((step, i) => {
              const isPast = i < currentStep;
              const isActive = i === currentStep;
              return (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive ? "bg-primary/5 border border-primary/10" : "bg-surface-container-low"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isPast ? "bg-tertiary" : isActive ? "bg-primary" : "bg-surface-container-high"}`}>
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-on-tertiary" />
                    ) : (
                      <span className={`w-2 h-2 rounded-full ${isActive ? "bg-on-primary" : "bg-on-surface-variant/30"}`} />
                    )}
                  </div>
                  <span className={`font-medium transition-colors ${isPast ? "text-tertiary" : isActive ? "text-primary font-bold" : "text-on-surface-variant"}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </PatientPageShell>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50" onClick={() => setChatOpen(false)}>
          <div className="bg-surface-container-lowest w-full max-w-md h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-outline-variant/20 px-5 py-4 bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">ส</div>
                <div>
                  <h2 className="text-base font-bold text-on-background">แชทกับผู้ดูแล</h2>
                  <p className="text-xs text-emerald-600 font-medium">ออนไลน์</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors">X</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 p-5 bg-surface-container-low/40">
              {messages.length === 0 && (
                <p className="text-center text-sm text-on-surface-variant/60 mt-8">ยังไม่มีข้อความ — เริ่มแชทได้เลย</p>
              )}
              {messages.map((msg, idx) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === "patient" ? "items-end" : "items-start"} mb-3`}>
                  <div className={`flex ${msg.sender === "patient" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
                      msg.sender === "patient"
                        ? "bg-primary text-on-primary rounded-br-sm"
                        : "bg-surface-container-lowest border border-outline-variant/15 text-on-surface rounded-bl-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                  {msg.sender === "patient" && idx === chatLastReadIdx && (
                    <span className="text-[11px] text-on-surface-variant/60 mt-0.5 mr-1">อ่านแล้ว</span>
                  )}
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/15">
              <div className="flex items-center gap-2 bg-surface-container-low rounded-full p-1.5 border border-outline-variant/20 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none px-4 py-2 text-[15px] focus:outline-none focus:ring-0 text-on-surface placeholder-on-surface-variant/60"
                  placeholder="พิมพ์ข้อความ..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSend(); } }}
                />
                <button type="button" className="flex items-center justify-center rounded-full bg-primary w-10 h-10 text-on-primary hover:bg-primary-dim transition-colors shrink-0 shadow-sm" onClick={handleSend}>
                  <Send className="h-4 w-4 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Modal */}
      {isCallOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setCallOpen(false)}>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-ambient w-80 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-primary to-primary-fixed rounded-full flex items-center justify-center shadow-ambient mb-4">
              <span className="text-on-primary font-bold text-3xl">ส</span>
            </div>
            <h3 className="text-xl font-semibold text-on-background mb-2">สมศรี สมหมาย</h3>
            <p className="text-on-surface-variant mb-4 animate-pulse">กำลังโทร...</p>
            <button className="px-4 py-2 bg-error text-on-error rounded-md hover:brightness-110" onClick={handleEndCall}>วางสาย</button>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-[2rem] shadow-ambient p-8 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-tertiary/15 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-tertiary" />
            </div>
            <h3 className="text-xl font-extrabold text-on-background mb-1">เดินทางเสร็จสิ้น!</h3>
            <p className="text-on-surface-variant text-sm mb-6">คุณพอใจกับผู้ดูแลครั้งนี้แค่ไหน?</p>

            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="transition-transform active:scale-90"
                  onMouseEnter={() => setStarHover(star)}
                  onMouseLeave={() => setStarHover(0)}
                  onClick={() => setStarSelected(star)}
                >
                  <Star className={`w-10 h-10 transition-colors ${star <= (starHover || starSelected) ? "fill-[#FBBF24] text-[#FBBF24]" : "text-outline-variant"}`} />
                </button>
              ))}
            </div>

            {starSelected > 0 && (
              <p className="text-sm font-bold text-primary mb-4">
                {["", "ไม่ดีเลย", "พอใช้", "ดี", "ดีมาก", "ยอดเยี่ยม!"][starSelected]}
              </p>
            )}

            <textarea
              className="w-full rounded-2xl border border-outline-variant/30 bg-surface-container-low px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 mb-6"
              rows={2}
              placeholder="ความคิดเห็นเพิ่มเติม (ไม่บังคับ)"
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={() => handleSubmitRating(true)}
                className="flex-1 py-3 rounded-2xl border border-outline-variant/30 text-on-surface-variant text-sm font-bold hover:bg-surface-container transition-colors"
              >
                ข้าม
              </button>
              <button
                onClick={() => handleSubmitRating(false)}
                disabled={starSelected === 0 || ratingSubmitting}
                className="flex-[2] py-3 rounded-2xl bg-primary text-on-primary text-sm font-bold shadow-ambient hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {ratingSubmitting ? "กำลังบันทึก..." : "ส่งคะแนน"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Modal */}
      {isEmergencyOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEmergencyOpen(false)}>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-ambient w-96" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center text-error mb-4">
              <AlertTriangle className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">คุณต้องการแจ้งเหตุฉุกเฉินใช่หรือไม่?</h3>
            </div>
            <p className="text-on-surface-variant mb-6">การแจ้งเหตุจะส่งสัญญาณเตือนไปยังโรงพยาบาลและผู้ดูแลของคุณ</p>
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 bg-surface-container text-on-surface rounded-md hover:bg-surface-container-high" onClick={() => setEmergencyOpen(false)}>ยกเลิก</button>
              <button className="px-4 py-2 bg-error text-on-error rounded-md hover:brightness-110" onClick={handleConfirmEmergency}>ยืนยันแจ้งเหตุ</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
