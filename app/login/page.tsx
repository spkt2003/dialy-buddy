"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Stethoscope, Mail, Lock, AlertCircle } from "lucide-react"; // เพิ่ม AlertCircle
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State สำหรับเก็บข้อความ Error

  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ดึงข้อมูลบัญชีที่เพิ่งสมัครไว้จาก Local Storage
    const registeredPhone = localStorage.getItem("registeredPhone");
    const registeredPassword = localStorage.getItem("registeredPassword");
    const registeredName = localStorage.getItem("userName") || "ผู้ใช้งานใหม่";
    const registeredRole = localStorage.getItem("role") || "customer";

    // 1. ตรวจสอบสิทธิ์ Admin (คงไว้เหมือนเดิม)
    if (emailOrPhone === "admin" && password === "admin123") {
      login("caregiver", "ผู้ดูแลระบบ");
      router.push("/caregiver/dashboard");
    }
    // 2. ตรวจสอบกับข้อมูลที่ Register ไว้
    else if (emailOrPhone === registeredPhone && password === registeredPassword) {
      if (registeredRole === "provider" || registeredRole === "caregiver") {
        login("caregiver", registeredName);
        router.push("/caregiver/dashboard");
      } else {
        login("patient", registeredName);
        router.push("/dashboard");
      }
    }
    // 3. Fallback (เผื่อกรณีไม่ได้กดสมัครก่อน แต่มาพิมพ์ user / user123 เลย)
    else if (emailOrPhone === "user" && password === "user123") {
      login("patient", "สมหมาย");
      router.push("/dashboard");
    }
    // 4. กรณีรหัสผ่านผิด
    else {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-[2rem] shadow-ambient ghost-border border border-outline-variant/20 p-8">
        <div className="flex items-center mb-8">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2 mx-auto pr-8">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold font-headline text-primary">Dialybuddy</span>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold font-headline mb-2 text-on-background">ยินดีต้อนรับกลับมา</h1>
        <p className="text-on-surface-variant font-body mb-6 text-lg">เข้าสู่ระบบเพื่อจัดการนัดหมายและข้อมูลสุขภาพของคุณ</p>

        {/* --- ส่วนแสดงข้อความแจ้งเตือนเมื่อกรอกผิด --- */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold font-label text-on-surface w-full block">เบอร์โทรศัพท์ หรือ อีเมล</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="กรุณาระบุข้อมูลเข้าสู่ระบบ"
                required
                className="w-full bg-surface-container-high border-none rounded-xl py-4 pl-12 pr-4 text-on-surface font-body focus:ring-2 focus:ring-primary/50 focus:outline-none text-base"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold font-label text-on-surface">รหัสผ่าน</label>
              <Link href="#" className="text-sm font-bold font-label text-primary hover:text-primary-dim transition-colors">ลืมรหัสผ่าน?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรุณากรอกรหัสผ่านของคุณ"
                required
                className="w-full bg-surface-container-high border-none rounded-xl py-4 pl-12 pr-4 text-on-surface font-body focus:ring-2 focus:ring-primary/50 focus:outline-none text-base"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 flex items-center justify-center bg-blue-700 text-white font-bold font-label py-4 rounded-xl shadow-md hover:bg-blue-800 transition-colors text-lg"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <p className="text-center text-base font-body text-on-surface-variant mt-8">
          คุณยังไม่มีบัญชีผู้ใช้งานใช่ไหม? <Link href="/register" className="text-primary font-bold hover:underline">ลงทะเบียนที่นี่</Link>
        </p>
      </div>
    </div>
  );
}