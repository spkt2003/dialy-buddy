"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
}

interface JobContextType {
  pendingJobs: Job[];
  activeJob: Job | null;
  completedJobs: Job[];
  acceptJob: (jobId: string) => void;
  updateJobStep: (stepIndex: number) => void;
  completeJob: () => void;
}

const initialPendingJobs: Job[] = [
  {
    id: "j1",
    patientName: "คุณสมหมาย รักดี",
    patientImage: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    destination: "รพ.ศิริราช",
    time: "08:00 - 12:00",
    date: "วันนี้",
    type: "พาไปฟอกไต",
    status: "pending",
    earning: 800,
  },
  {
    id: "j2",
    patientName: "คุณวิไล ใจสู้",
    patientImage: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    destination: "รพ.จุฬาลงกรณ์",
    time: "13:00 - 17:00",
    date: "พรุ่งนี้",
    type: "พาไปฟอกไต",
    status: "pending",
    earning: 650,
  }
];

const initialCompletedJobs: Job[] = [
  {
    id: "c1",
    patientName: "คุณสมปอง ยิ้มแย้ม",
    patientImage: "https://i.pravatar.cc/150?img=33",
    destination: "รพ.รามาธิบดี",
    time: "10:00 - 14:00",
    date: "เมื่อวาน",
    type: "พาไปฟอกไต",
    status: "completed",
    earning: 1200,
  },
  {
    id: "c2",
    patientName: "คุณวิไล ใจดี",
    patientImage: "https://i.pravatar.cc/150?img=47",
    destination: "รพ.จุฬาลงกรณ์",
    time: "13:00 - 17:00",
    date: "3 วันก่อน",
    type: "ดูแลผู้ป่วยหลังการผ่าตัด",
    status: "completed",
    earning: 1500,
  }
];

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: React.ReactNode }) => {
  /**
   * การจัดการ State ของ Job (งานของผู้ดูแล)
   * 
   * 1. pendingJobs: งานที่รอให้ผู้ดูแลกด "รับงาน" (เข้าคิวรออยู่)
   * 2. activeJob: งานปัจจุบันที่ผู้ดูแลกดรับแล้วและกำลังดำเนินการอยู่ (ระบบบังคับว่ารับซ้อนไม่ได้)
   * 3. completedJobs: ประวัติงานทั้งหมดที่ทำเสร็จแล้ว (เพื่อนำไปใช้คำนวณรายได้ หรือแสดงในหน้า History)
   * 4. isInitialized: สถานะการโหลดข้อมูลเริ่มต้น เพื่อป้องกันปัญหา UI กระตุกตอนโหลดหน้า
   */
  const [pendingJobs, setPendingJobs] = useState<Job[]>(initialPendingJobs);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [completedJobs, setCompletedJobs] = useState<Job[]>(initialCompletedJobs);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Business Logic: โหลดและซิงค์ข้อมูล (Load Data on Mount)
   * 
   * useEffect ตัวที่ 1: โหลดข้อมูลงานที่ผู้ใช้ทำค้างไว้จาก Local Storage ขึ้นมา 
   * ทำให้ตอนปิดเบราว์เซอร์แล้วกลับมาใหม่ สถานะการทำงานก็ยังอยู่ที่เดิม
   */
  useEffect(() => {
    // โหลดจาก Local Storage ถ้ามี
    const storedActive = localStorage.getItem("activeJob");
    const storedPending = localStorage.getItem("pendingJobs");
    const storedCompleted = localStorage.getItem("completedJobs");

    if (storedActive) setActiveJob(JSON.parse(storedActive));
    if (storedPending) setPendingJobs(JSON.parse(storedPending));
    if (storedCompleted) setCompletedJobs(JSON.parse(storedCompleted));
    
    setIsInitialized(true);
  }, []);

  /**
   * Business Logic: บันทึกข้อมูลอัตโนมัติ (Auto-save)
   * 
   * useEffect ตัวที่ 2: เมื่อ State ตัวใดตัวหนึ่ง (activeJob, pendingJobs, completedJobs) มีการเปลี่ยนแปลง
   * ระบบจะเซฟข้อมูลเหล่านี้ลง Local Storage โดยอัตโนมัติทันที
   */
  // Sync กับ Local Storage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("activeJob", activeJob ? JSON.stringify(activeJob) : "");
      localStorage.setItem("pendingJobs", JSON.stringify(pendingJobs));
      localStorage.setItem("completedJobs", JSON.stringify(completedJobs));
    }
  }, [activeJob, pendingJobs, completedJobs, isInitialized]);

  /**
   * ฟังก์ชันรับงาน (Accept Job)
   * 
   * - ตรวจสอบก่อนว่ามีงานที่ทำอยู่แล้วหรือไม่ (if activeJob return)
   * - ค้นหางานที่เลือกจากคิว (pendingJobs)
   * - เปลี่ยนสถานะให้เป็น "active" และเริ่มสเต็ปที่ 0
   * - ลบงานนั้นออกจากกระดานงานที่รอ (pendingJobs) เพื่อไม่ให้คนอื่นมารับซ้ำ
   */
  const acceptJob = (jobId: string) => {
    if (activeJob) return; // ไม่สามารถรับซ้อนได้
    
    const jobToAccept = pendingJobs.find(j => j.id === jobId);
    if (jobToAccept) {
      setActiveJob({ ...jobToAccept, status: "active", currentStep: 0 });
      setPendingJobs(prev => prev.filter(j => j.id !== jobId));
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
    }
  };

  /**
   * ฟังก์ชันปิดจบงาน (Complete Job)
   * 
   * - นำงานที่กำลังทำอยู่ (activeJob) เปลี่ยนสถานะเป็น "completed"
   * - ย้ายงานนั้นไปเรียงไว้บนสุดของคิวงานที่ทำเสร็จแล้ว (completedJobs)
   * - เคลียร์ค่า activeJob ให้กลับมาเป็น null ว่างเปล่า เพื่อเตรียมรับงานใหม่
   */
  const completeJob = () => {
    if (activeJob) {
      setCompletedJobs(prev => [{ ...activeJob, status: "completed" }, ...prev]);
      setActiveJob(null);
    }
  };

  if (!isInitialized) return null;

  return (
    <JobContext.Provider value={{ pendingJobs, activeJob, completedJobs, acceptJob, updateJobStep, completeJob }}>
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
