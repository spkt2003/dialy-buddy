"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  UserCircle,
  ChevronDown,
  LogOut,
  Settings,
  LayoutDashboard,
  ShieldCheck // ไอคอนสำหรับ Admin
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isLoggedIn, role, userName, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-container-lowest/80 backdrop-blur-xl shadow-ambient">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
            <div className="w-28 sm:w-36 md:w-44">
              <Image src="/logo.png" alt="DialyBuddy Logo" width={250} height={250} className="w-full h-auto object-contain" />
            </div>
          </Link>
        </div>

        {/* เมนูหลัก */}
        <nav className="hidden md:flex gap-8">
          {role === 'caregiver' ? (
            <>
              <Link href="/caregiver/dashboard" className="text-sm font-label font-bold border-b-2 border-transparent hover:border-primary text-secondary hover:text-primary transition-colors py-1">แผงควบคุม</Link>
              <Link href="/caregiver/jobs" className="text-sm font-label font-bold border-b-2 border-transparent hover:border-primary text-secondary hover:text-primary transition-colors py-1">งานของฉัน</Link>
            </>
          ) : (
            <>
              <Link href="/find-buddy" className="text-sm font-label font-bold border-b-2 border-transparent hover:border-primary text-secondary hover:text-primary transition-colors py-1">ค้นหาผู้ดูแล</Link>
              <Link href="/ai-planner" className="text-sm font-label font-bold border-b-2 border-transparent hover:border-primary text-secondary hover:text-primary transition-colors py-1">AI จัดโภชนาการ</Link>
              <Link href="/booking" className="text-sm font-label font-bold border-b-2 border-transparent hover:border-primary text-secondary hover:text-primary transition-colors py-1">การทำรายการจอง</Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-sm font-label font-bold text-primary hover:text-primary-dim transition-colors hidden sm:block">
                เข้าสู่ระบบ
              </Link>
              <Link href="/register" className="rounded-xl font-label bg-primary text-on-primary px-6 py-2.5 text-sm font-semibold shadow-sm hover:brightness-105 active:scale-95 transition duration-200">
                ลงทะเบียน
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-full border ghost-border bg-surface-container-lowest p-1.5 pr-4 transition-all hover:bg-surface-container-low hover:shadow-ambient"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${role === 'caregiver' ? 'bg-tertiary-container/40 text-tertiary' : 'bg-primary/10 text-primary'}`}>
                  {role === 'caregiver' ? <ShieldCheck className="h-5 w-5" /> : <UserCircle className="h-5 w-5" />}
                </div>
                <span className="text-sm font-semibold font-label text-on-surface uppercase">
                  {userName} {role === 'caregiver' && "(ผู้ดูแล)"}
                </span>
                <ChevronDown className="h-4 w-4 text-on-surface-variant" />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl bg-surface-container-lowest shadow-ambient ghost-border animate-in fade-in slide-in-from-top-2">
                    <div className="p-2">
                      {role === 'caregiver' && (
                        <Link href="/caregiver/dashboard" onClick={() => setIsProfileOpen(false)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold font-label text-tertiary bg-tertiary-container/30 hover:bg-tertiary-container/40 transition-colors mb-1">
                          <LayoutDashboard className="h-4 w-4" />
                          หน้าจัดการงาน (ผู้ดูแล)
                        </Link>
                      )}

                      {role !== 'caregiver' && (
                        <Link href="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-label text-on-surface hover:bg-surface-container-low transition-colors">
                          <LayoutDashboard className="h-4 w-4 text-secondary" />
                          แผงควบคุม (Dashboard)
                        </Link>
                      )}

                      {/* ลิงก์ไปหน้า Profile แยกตามสิทธิ์ */}
                      <Link
                        href={role === 'caregiver' ? "/caregiver/settings" : "/profile"}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-label text-on-surface hover:bg-surface-container-low transition-colors"
                      >
                        <Settings className="h-4 w-4 text-secondary" />
                        ตั้งค่าบัญชี
                      </Link>
                    </div>

                    <div className="border-t ghost-border p-2">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-label text-error hover:bg-error/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4 text-error" />
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}