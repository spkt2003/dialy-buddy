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
  }
];

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: React.ReactNode }) => {
  const [pendingJobs, setPendingJobs] = useState<Job[]>(initialPendingJobs);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [completedJobs, setCompletedJobs] = useState<Job[]>(initialCompletedJobs);
  const [isInitialized, setIsInitialized] = useState(false);

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

  // Sync กับ Local Storage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("activeJob", activeJob ? JSON.stringify(activeJob) : "");
      localStorage.setItem("pendingJobs", JSON.stringify(pendingJobs));
      localStorage.setItem("completedJobs", JSON.stringify(completedJobs));
    }
  }, [activeJob, pendingJobs, completedJobs, isInitialized]);

  const acceptJob = (jobId: string) => {
    if (activeJob) return; // ไม่สามารถรับซ้อนได้
    
    const jobToAccept = pendingJobs.find(j => j.id === jobId);
    if (jobToAccept) {
      setActiveJob({ ...jobToAccept, status: "active", currentStep: 0 });
      setPendingJobs(prev => prev.filter(j => j.id !== jobId));
    }
  };

  const updateJobStep = (stepIndex: number) => {
    if (activeJob) {
      setActiveJob({ ...activeJob, currentStep: stepIndex });
    }
  };

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
