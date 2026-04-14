"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stethoscope, UserCircle, ChevronDown, LogOut, Settings, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Mock login state if we are on restricted pages
    if (pathname?.includes('/dashboard') || pathname?.includes('/tracking')) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-container-lowest/80 backdrop-blur-xl shadow-ambient">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Stethoscope className="h-8 w-8 text-primary" />
          <Link href="/" className="text-2xl font-bold tracking-tight text-primary font-headline">Dialybuddy</Link>
        </div>
        <nav className="hidden md:flex gap-8">
          <Link href="/find-buddy" className="text-sm font-label font-bold border-b-2 border-transparent hover:border-primary text-secondary hover:text-primary transition-colors py-1">ค้นหาผู้ดูแล</Link>
          <Link href="/ai-planner" className="text-sm font-label font-bold border-b-2 border-transparent hover:border-primary text-secondary hover:text-primary transition-colors py-1">AI จัดโภชนาการ</Link>
          <Link href="/booking" className="text-sm font-label font-bold border-b-2 border-transparent hover:border-primary text-secondary hover:text-primary transition-colors py-1">การทำรายการจอง</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link 
                href="/login" 
                className="text-sm font-label font-bold text-primary hover:text-primary-dim transition-colors hidden sm:block"
              >
                เข้าสู่ระบบ
              </Link>
              <Link 
                href="/register" 
                className="rounded-xl font-label bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 text-sm font-semibold shadow-sm hover:scale-95 transition-transform duration-200"
              >
                ลงทะเบียน
              </Link>
            </>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-full border ghost-border bg-surface-container-lowest p-1.5 pr-4 transition-all hover:bg-surface-container-low hover:shadow-ambient"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserCircle className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold font-label text-on-surface">สวัสดี, คุณสมหมาย</span>
                <ChevronDown className="h-4 w-4 text-on-surface-variant" />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl bg-surface-container-lowest shadow-ambient ghost-border animate-in fade-in slide-in-from-top-2">
                    <div className="p-2">
                      <Link href="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-label text-on-surface hover:bg-surface-container-low transition-colors">
                        <LayoutDashboard className="h-4 w-4 text-secondary" />
                        หน้าหลัก (Dashboard)
                      </Link>
                      <Link href="/tracking" onClick={() => setIsProfileOpen(false)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-label text-on-surface hover:bg-surface-container-low transition-colors">
                        <Settings className="h-4 w-4 text-secondary" />
                        ตั้งค่าบัญชี
                      </Link>
                    </div>
                    <div className="border-t ghost-border p-2">
                      <Link 
                        href="/" 
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-label text-error hover:bg-error-container/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4 text-error" />
                        ออกจากระบบ
                      </Link>
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
