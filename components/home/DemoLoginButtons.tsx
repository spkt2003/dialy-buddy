// TODO: Demo login buttons expose hardcoded credentials in client-side code.
// Remove this component entirely before any real user-facing deployment.

"use client";

import { useRouter } from "next/navigation";
import { UserCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DemoLoginButtons() {
  const { login, logout } = useAuth();
  const router = useRouter();

  const loginAsPatient = () => {
    logout();
    login("patient", "user");
    router.push("/ai-planner");
  };

  const loginAsCaregiver = () => {
    logout();
    login("caregiver", "admin");
    router.push("/caregiver/dashboard");
  };

  return (
    <div className="mt-8 flex flex-col items-center gap-4 w-full">
      <div className="flex items-center gap-3 w-full max-w-xs">
        <div className="flex-1 h-px bg-outline-variant/40" />
        <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">ทดลองเดโม</span>
        <div className="flex-1 h-px bg-outline-variant/40" />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button
          onClick={loginAsPatient}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface-container-lowest ghost-border text-primary font-bold font-label text-sm hover:bg-primary/5 transition-colors shadow-ambient"
        >
          <UserCircle className="h-4 w-4 shrink-0" />
          ทดลองในฐานะผู้ป่วย
        </button>
        <button
          onClick={loginAsCaregiver}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface-container-lowest ghost-border text-tertiary font-bold font-label text-sm hover:bg-tertiary-container/30 transition-colors shadow-ambient"
        >
          <ShieldCheck className="h-4 w-4 shrink-0" />
          ทดลองในฐานะผู้ดูแล
        </button>
      </div>
    </div>
  );
}
