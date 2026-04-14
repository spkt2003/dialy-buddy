import Link from "next/link";
import { ArrowLeft, Stethoscope, Mail, Lock } from "lucide-react";

export default function LoginPage() {
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
        <p className="text-on-surface-variant font-body mb-8 text-lg">เข้าสู่ระบบเพื่อจัดการนัดหมายและข้อมูลสุขภาพของคุณ</p>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold font-label text-on-surface w-full block">เบอร์โทรศัพท์ หรือ อีเมล</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
              <input 
                type="text" 
                placeholder="กรุณาระบุข้อมูลเข้าสู่ระบบ" 
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
                placeholder="กรุณากรอกรหัสผ่านของคุณ" 
                className="w-full bg-surface-container-high border-none rounded-xl py-4 pl-12 pr-4 text-on-surface font-body focus:ring-2 focus:ring-primary/50 focus:outline-none text-base"
              />
            </div>
          </div>

          <Link href="/dashboard" className="w-full mt-6 flex items-center justify-center bg-blue-700 text-white font-bold font-label py-4 rounded-xl shadow-md hover:bg-blue-800 transition-colors text-lg">
            เข้าสู่ระบบ
          </Link>
        </form>

        <p className="text-center text-base font-body text-on-surface-variant mt-8">
          คุณยังไม่มีบัญชีผู้ใช้งานใช่ไหม? <Link href="/register" className="text-primary font-bold hover:underline">ลงทะเบียนที่นี่</Link>
        </p>
      </div>
    </div>
  );
}
