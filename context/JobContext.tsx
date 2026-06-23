"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export type JobStatus = "pending" | "active" | "completed";

export interface Job {
  id: string;
  patientName: string;
  patientImage: string;
  destination: string;
  time: string;
  date: string;
  type: string;
  status: JobStatus;
  currentStep?: number;
  earning?: number;
  completedAt?: number;
}

interface JobContextType {
  isInitialized: boolean;
  pendingJobs: Job[];
  activeJob: Job | null;
  completedJobs: Job[];
  acceptJob: (jobId: string, caregiverName?: string) => Promise<void>;
  updateJobStep: (stepIndex: number) => void;
  completeJob: () => Promise<boolean>;
}

// Row shape returned by Supabase for the pending_jobs table
type PendingJobRow = {
  id: string;
  patient_name: string;
  patient_image: string | null;
  destination: string;
  time_slot: string;
  date: string;
  type: string;
  status: string;
  earning: number | null;
};

// Row shape returned by Supabase for the active_jobs table
type ActiveJobRow = {
  id: string;
  patient_name: string;
  patient_image: string | null;
  destination: string;
  time_slot: string;
  date: string;
  type: string;
  current_step: number;
};

function rowToJob(row: PendingJobRow): Job {
  return {
    id: row.id,
    patientName: row.patient_name,
    patientImage: row.patient_image ?? "https://i.pravatar.cc/150?u=default",
    destination: row.destination,
    time: row.time_slot,
    date: row.date,
    type: row.type,
    status: "pending",
    earning: row.earning ?? 500,
  };
}

function activeRowToJob(row: ActiveJobRow): Job {
  return {
    id: row.id,
    patientName: row.patient_name,
    patientImage: row.patient_image ?? "https://i.pravatar.cc/150?u=default",
    destination: row.destination,
    time: row.time_slot,
    date: row.date,
    type: row.type,
    status: "active",
    currentStep: row.current_step,
    earning: 500,
  };
}

// Row shape returned by Supabase for the completed_jobs table
type CompletedJobRow = {
  id: string;
  patient_name: string;
  patient_image: string | null;
  destination: string;
  time_slot: string;
  date: string;
  type: string;
  earning: number;
  completed_at: string | null;
};

function completedRowToJob(row: CompletedJobRow): Job {
  return {
    id: row.id,
    patientName: row.patient_name,
    patientImage: row.patient_image ?? "https://i.pravatar.cc/150?u=default",
    destination: row.destination,
    time: row.time_slot,
    date: row.date,
    type: row.type,
    status: "completed",
    earning: row.earning,
    completedAt: row.completed_at ? new Date(row.completed_at).getTime() : undefined,
  };
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: React.ReactNode }) => {
  /**
   * การจัดการ State ของ Job (งานของผู้ดูแล)
   *
   * 1. pendingJobs: งานที่รอให้ผู้ดูแลกด "รับงาน" — โหลดจาก Supabase pending_jobs และ subscribe realtime
   * 2. activeJob: งานปัจจุบันที่ผู้ดูแลกดรับแล้วและกำลังดำเนินการอยู่ (ระบบบังคับว่ารับซ้อนไม่ได้)
   * 3. completedJobs: ประวัติงานทั้งหมดที่ทำเสร็จแล้ว (เพื่อนำไปใช้คำนวณรายได้ หรือแสดงในหน้า History)
   * 4. isInitialized: สถานะการโหลดข้อมูลเริ่มต้น เพื่อป้องกันปัญหา UI กระตุกตอนโหลดหน้า
   */
  const [pendingJobs, setPendingJobs] = useState<Job[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Business Logic: โหลดและซิงค์ข้อมูล (Load Data on Mount)
   *
   * - activeJob: โหลดจาก Supabase active_jobs โดยใช้ activeJobId ที่เก็บไว้ใน localStorage
   * - completedJobs: โหลดจาก Supabase completed_jobs (source of truth แล้ว)
   * - pendingJobs: โหลดจาก Supabase pending_jobs และ subscribe realtime INSERT/DELETE
   */
  useEffect(() => {
    // ย้าย key เก่า (activeJob full JSON) ไปเป็น activeJobId
    const oldActiveJson = localStorage.getItem("activeJob");
    let activeJobId = localStorage.getItem("activeJobId");
    if (!activeJobId && oldActiveJson) {
      try {
        const parsed = JSON.parse(oldActiveJson) as { id?: string };
        if (parsed?.id) {
          activeJobId = parsed.id;
          localStorage.setItem("activeJobId", activeJobId);
        }
      } catch { /* ignore */ }
    }
    localStorage.removeItem("activeJob");       // ล้าง key เก่า
    localStorage.removeItem("completedJobs");   // ย้ายไป Supabase แล้ว
    localStorage.removeItem("pendingJobs");     // Supabase เป็น source of truth แล้ว

    const loadData = async () => {
      // ลบ orphaned active_jobs rows ที่ DELETE ล้มเหลวตอน completeJob ครั้งก่อน
      const pendingDeletes = JSON.parse(localStorage.getItem("pendingActiveJobDeletes") || "[]") as string[];
      if (pendingDeletes.length > 0) {
        localStorage.removeItem("pendingActiveJobDeletes");
        pendingDeletes.forEach(id => {
          supabase.from("active_jobs").delete().eq("id", id)
            .then(({ error }) => {
              if (error) console.error("Supabase cleanup orphan active_jobs:", error.message);
            });
        });
      }

      // ลบ pending_jobs ที่ค้างเกิน 24 ชั่วโมงโดยไม่มีใครรับ
      // Realtime DELETE event จะ propagate ให้ caregiver ทุกคนที่ออนไลน์อยู่อัตโนมัติ
      const expiredCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      supabase.from("pending_jobs")
        .delete()
        .lt("created_at", expiredCutoff)
        .then(({ error }) => {
          if (error) console.error("Supabase cleanup expired pending_jobs:", error.message);
        });

      // ลบ completed_jobs ที่เก่าเกิน 365 วัน
      const completedCutoff = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
      supabase.from("completed_jobs")
        .delete()
        .lt("completed_at", completedCutoff)
        .then(({ error }) => {
          if (error) console.error("Supabase cleanup old completed_jobs:", error.message);
        });

      // โหลด activeJob จาก Supabase ด้วย ID ที่เก็บไว้
      if (activeJobId) {
        const { data, error } = await supabase
          .from("active_jobs")
          .select("id, patient_name, patient_image, destination, time_slot, date, type, current_step")
          .eq("id", activeJobId)
          .maybeSingle();
        if (!error && data) {
          setActiveJob(activeRowToJob(data as ActiveJobRow));
        } else {
          // แถวถูกลบไปแล้ว (งานเสร็จ/ยกเลิก) — ล้าง ID ออก
          localStorage.removeItem("activeJobId");
        }
      }

      // โหลด completedJobs จาก Supabase — เรียงล่าสุดก่อน
      const { data: completedData, error: completedError } = await supabase
        .from("completed_jobs")
        .select("id, patient_name, patient_image, destination, time_slot, date, type, earning, completed_at")
        .order("completed_at", { ascending: false });
      if (completedError) console.error("Supabase load completed_jobs:", completedError.message);
      if (completedData) setCompletedJobs(completedData.map(completedRowToJob));

      setIsInitialized(true);

      // โหลด pending jobs จาก Supabase (ไม่ block isInitialized)
      const { data: pendingData, error: pendingError } = await supabase
        .from("pending_jobs")
        .select("id, patient_name, patient_image, destination, time_slot, date, type, status, earning")
        .eq("status", "pending");
      if (pendingError) console.error("Supabase load pending_jobs:", pendingError.message);
      if (pendingData) setPendingJobs(pendingData.map(rowToJob));
    };

    loadData();

    // Realtime: เมื่อ patient กด "ชำระเงิน" (INSERT) หรือ caregiver รับงาน (DELETE)
    const channel = supabase
      .channel("pending_jobs_caregiver_view")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "pending_jobs" },
        (payload) => {
          setPendingJobs(prev => [...prev, rowToJob(payload.new as PendingJobRow)]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "pending_jobs" },
        (payload) => {
          const deleted = payload.old as { id: string };
          setPendingJobs(prev => prev.filter(j => j.id !== deleted.id));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  /**
   * Business Logic: บันทึก activeJobId ลง localStorage (Auto-save)
   *
   * - activeJob: เก็บแค่ ID — ข้อมูลจริงอยู่ใน Supabase active_jobs
   * - completedJobs / pendingJobs: Supabase เป็น source of truth ทั้งคู่ ไม่ต้อง save localStorage
   */
  useEffect(() => {
    if (!isInitialized) return;
    if (activeJob) {
      localStorage.setItem("activeJobId", activeJob.id);
    } else {
      localStorage.removeItem("activeJobId");
    }
  }, [activeJob, isInitialized]);

  /**
   * ฟังก์ชันรับงาน (Accept Job)
   *
   * - ตรวจสอบก่อนว่ามีงานที่ทำอยู่แล้วหรือไม่ (if activeJob return)
   * - ลบงานออกจาก pending_jobs ใน Supabase ก่อน — ป้องกัน caregiver อื่นรับซ้ำ
   * - เปลี่ยนสถานะให้เป็น "active" และเริ่มสเต็ปที่ 0
   * - Upsert ไปที่ active_jobs เพื่อให้ patient tracking page เห็น realtime
   */
  const acceptJob = async (jobId: string, caregiverName?: string) => {
    if (activeJob) return; // ไม่สามารถรับซ้อนได้

    const jobToAccept = pendingJobs.find(j => j.id === jobId);
    if (jobToAccept) {
      const newActive = { ...jobToAccept, status: "active" as JobStatus, currentStep: 0 };
      setActiveJob(newActive);
      setPendingJobs(prev => prev.filter(j => j.id !== jobId));

      // ดึง caregiver_id จาก Supabase session หรือ fallback หา UUID จาก caregiver_profiles by name
      const { data: { user } } = await supabase.auth.getUser();
      let caregiverId = user?.id ?? null;
      if (!caregiverId && caregiverName) {
        const { data: profile } = await supabase
          .from("caregiver_profiles")
          .select("id")
          .eq("name", caregiverName)
          .maybeSingle();
        caregiverId = profile?.id ?? null;
      }

      // ลบออกจาก pending_jobs — realtime DELETE จะส่งไปยัง caregiver คนอื่นให้ซ่อนงานนี้ด้วย
      supabase.from("pending_jobs")
        .delete()
        .eq("id", jobId)
        .then(({ error }) => {
          if (error) console.error("Supabase delete pending_jobs:", error.message);
        });

      // Sync to active_jobs so patient tracking page can see this job live
      // caregiver_id ใช้สำหรับ patient rating หลังจบงาน
      supabase.from("active_jobs").upsert({
        id: newActive.id,
        patient_name: newActive.patientName,
        patient_image: newActive.patientImage,
        destination: newActive.destination,
        time_slot: newActive.time,
        date: newActive.date,
        type: newActive.type,
        current_step: 0,
        caregiver_id: caregiverId,
        updated_at: new Date().toISOString(),
      }).then(({ error }) => {
        if (error) console.error("Supabase acceptJob:", error.message);
      });
    }
  };

  /**
   * ฟังก์ชันอัปเดตขั้นตอนการทำงาน (Update Job Step)
   *
   * - ใช้สำหรับ Tracking สถานะแบบเรียลไทม์ เช่น จากขั้นตอน "กำลังไปรับ" เปลี่ยนเป็น "ถึงโรงพยาบาลแล้ว"
   * - อัปเดต property `currentStep` เข้าไปในข้อมูล `activeJob` เดิม
   */
  const updateJobStep = (stepIndex: number) => {
    if (activeJob) {
      setActiveJob({ ...activeJob, currentStep: stepIndex });
      // Push step update to Supabase — patient page receives this via realtime
      supabase.from("active_jobs")
        .update({ current_step: stepIndex, updated_at: new Date().toISOString() })
        .eq("id", activeJob.id)
        .then(({ error }) => {
          if (error) console.error("Supabase updateJobStep:", error.message);
        });
    }
  };

  /**
   * ฟังก์ชันปิดจบงาน (Complete Job)
   *
   * - นำงานที่กำลังทำอยู่ (activeJob) เปลี่ยนสถานะเป็น "completed"
   * - ย้ายงานนั้นไปเรียงไว้บนสุดของคิวงานที่ทำเสร็จแล้ว (completedJobs)
   * - เคลียร์ค่า activeJob ให้กลับมาเป็น null ว่างเปล่า เพื่อเตรียมรับงานใหม่
   */
  const completeJob = async (): Promise<boolean> => {
    if (!activeJob) return false;

    const completed = { ...activeJob, status: "completed" as JobStatus };

    // บันทึกลง completed_jobs ก่อน — ถ้าล้มเหลวต้องไม่ล้าง state เพราะจะสูญเสียข้อมูลรายได้
    const { error } = await supabase.from("completed_jobs").insert({
      id: completed.id,
      patient_name: completed.patientName,
      patient_image: completed.patientImage,
      destination: completed.destination,
      time_slot: completed.time,
      date: completed.date,
      type: completed.type,
      earning: completed.earning ?? 500,
    });

    if (error) {
      console.error("Supabase insert completed_jobs:", error.message);
      return false;
    }

    setCompletedJobs(prev => [completed, ...prev]);
    setActiveJob(null);

    // ลบออกจาก active_jobs — non-blocking เพื่อไม่ให้ UI ค้าง
    // ถ้าล้มเหลว: queue ไว้ใน localStorage สำหรับ cleanup ตอน mount ครั้งถัดไป
    supabase.from("active_jobs")
      .delete()
      .eq("id", completed.id)
      .then(({ error: delError }) => {
        if (delError) {
          console.error("Supabase delete active_jobs:", delError.message);
          const pending = JSON.parse(localStorage.getItem("pendingActiveJobDeletes") || "[]") as string[];
          localStorage.setItem("pendingActiveJobDeletes", JSON.stringify([...pending, completed.id]));
        }
      });

    return true;
  };

  if (!isInitialized) return null;

  return (
    <JobContext.Provider value={{ isInitialized, pendingJobs, activeJob, completedJobs, acceptJob, updateJobStep, completeJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error("useJobContext must be used within a JobProvider");
  }
  return context;
};
