"use client";
import Link from "next/link";
import { ArrowLeft, Stethoscope, User, Lock, Phone, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const [role, setRole] = useState<'patient' | 'buddy'>('patient');
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setIsSubmitting(true);

    const mappedRole = role === 'buddy' ? 'caregiver' : 'patient';

    // สร้าง Supabase Auth user — ใช้ phone@dialybuddy.local เป็น fake email
    // (email confirmation ต้องปิดไว้ใน Supabase Auth settings สำหรับ project นี้)
    const { error } = await supabase.auth.signUp({
      email: `${phone}@dialybuddy.local`,
      password,
      options: { data: { role: mappedRole, userName: name } },
    });

    setIsSubmitting(false);

    if (error) {
      setRegisterError(error.message);
      return;
    }

    // ไม่เรียก login() — onAuthStateChange จะ update React state อัตโนมัติจาก Supabase session
    // (การเรียก login() จะเขียน isLoggedIn ลง localStorage ซึ่ง conflict กับ session expiry)
    router.push(mappedRole === 'caregiver' ? "/caregiver/dashboard" : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex justify-center py-12 px-4">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-[2rem] shadow-ambient ghost-border border border-outline-variant/20 p-8 h-fit">
        <div className="flex items-center mb-8">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2 mx-auto pr-8">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold font-headline text-primary">Dialybuddy</span>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold font-headline mb-2 text-on-background">เข้าร่วมเป็นส่วนหนึ่งกับเรา</h1>
        <p className="text-on-surface-variant font-body mb-8 text-lg">สร้างบัญชีผู้ใช้งานเพื่อเริ่มต้นใช้งานแพลตฟอร์ม</p>

        <div className="flex bg-surface-container-high rounded-xl p-1 mb-8 shadow-inner">
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`flex-1 py-3 text-base font-bold font-label rounded-lg transition-colors ${role === 'patient' ? 'bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/20' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            ผู้ป่วยโรคไต / ญาติ
          </button>
          <button
            type="button"
            onClick={() => setRole('buddy')}
            className={`flex-1 py-3 text-base font-bold font-label rounded-lg transition-colors ${role === 'buddy' ? 'bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/20' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            ผู้ดูแล (Care Buddy)
          </button>
        </div>

        {registerError && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-error shrink-0" />
            <p className="text-sm text-error font-medium">{registerError}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold font-label text-on-surface w-full block">ชื่อ-นามสกุล ของคุณ</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ระบุชื่อและนามสกุลจริง"
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary/50 focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold font-label text-on-surface w-full block">เบอร์โทรศัพท์ที่ติดต่อได้</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="ตัวอย่าง 0812345678"
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary/50 focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold font-label text-on-surface w-full block">ตั้งรหัสผ่านความปลอดภัย</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ระบุอย่างน้อย 8 ตัวอักษร"
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-4 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary/50 focus:outline-none"
                required
                minLength={8}
              />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full mt-6 flex items-center justify-center bg-primary text-on-primary font-bold font-label py-4 rounded-xl shadow-ambient hover:bg-primary-dim transition-colors text-lg disabled:opacity-60">
            {isSubmitting ? "กำลังสร้างบัญชี..." : "ลงทะเบียนใช้งาน"}
          </button>
        </form>

        <p className="text-center text-base font-body text-on-surface-variant mt-8">
          มีบัญชีผู้ใช้งานระบบอยู่แล้วใช่ไหม? <Link href="/login" className="text-primary font-bold hover:underline">คลิกเพื่อเข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
}