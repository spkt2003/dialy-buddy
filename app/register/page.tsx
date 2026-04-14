"use client";
import Link from "next/link";
import { ArrowLeft, Stethoscope, User, Lock, Phone } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [role, setRole] = useState<'patient' | 'buddy'>('patient');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
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
            className={`flex-1 py-3 text-base font-bold font-label rounded-lg transition-colors ${role === 'patient' ? 'bg-surface-container-lowest text-on-background shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            ผู้ป่วยโรคไต / ญาติ
          </button>
          <button 
            type="button"
            onClick={() => setRole('buddy')}
            className={`flex-1 py-3 text-base font-bold font-label rounded-lg transition-colors ${role === 'buddy' ? 'bg-surface-container-lowest text-on-background shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            ผู้ดูแล (Care Buddy)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold font-label text-on-surface w-full block">ชื่อ-นามสกุล ของคุณ</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
              <input 
                type="text" 
                placeholder="ระบุชื่อและนามสกุลจริง" 
                className="w-full bg-surface-container-high border-none rounded-xl py-4 pl-12 pr-4 text-on-surface font-body focus:ring-2 focus:ring-primary/50 focus:outline-none text-base"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold font-label text-on-surface w-full block">เบอร์โทรศัพท์ที่ติดต่อได้</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
              <input 
                type="tel" 
                placeholder="ตัวอย่าง 0812345678" 
                className="w-full bg-surface-container-high border-none rounded-xl py-4 pl-12 pr-4 text-on-surface font-body focus:ring-2 focus:ring-primary/50 focus:outline-none text-base"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold font-label text-on-surface w-full block">ตั้งรหัสผ่านความปลอดภัย</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
              <input 
                type="password" 
                placeholder="ระบุอย่างน้อย 8 ตัวอักษร" 
                className="w-full bg-surface-container-high border-none rounded-xl py-4 pl-12 pr-4 text-on-surface font-body focus:ring-2 focus:ring-primary/50 focus:outline-none text-base"
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full mt-6 flex items-center justify-center bg-blue-700 text-white font-bold font-label py-4 rounded-xl shadow-md hover:bg-blue-800 transition-colors text-lg">
            ลงทะเบียนใช้งาน
          </button>
        </form>

        <p className="text-center text-base font-body text-on-surface-variant mt-8">
          มีบัญชีผู้ใช้งานระบบอยู่แล้วใช่ไหม? <Link href="/login" className="text-primary font-bold hover:underline">คลิกเพื่อเข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
}
