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

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("ผู้ใช้งาน");
  const [role, setRole] = useState(""); // เพิ่มการเช็คสิทธิ์
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      const storedLoginStatus = localStorage.getItem("isLoggedIn");
      const storedUserName = localStorage.getItem("userName");

      if (storedLoginStatus === "true") {
        setIsLoggedIn(true);
        setUserName(storedUserName || "ผู้ใช้งาน");
      } else {
        setIsLoggedIn(false);

        // แปลง Path เป็นตัวพิมพ์เล็กทั้งหมดเพื่อป้องกันปัญหา /Profile vs /profile
        const currentPath = pathname?.toLowerCase() || "";
        const protectedPaths = ["/dashboard", "/profile", "/provider", "/booking"];

        // ถ้าไม่มีการ Login และพยายามเข้าหน้าเหล่านี้ ให้เด้งไป Login
        const isProtected = protectedPaths.some(path => currentPath.includes(path));

        if (isProtected) {
          router.push("/login");
        }
      }
    };

    checkLoginStatus();
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.clear(); // ล้างข้อมูลทั้งหมด
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-container-lowest/80 backdrop-blur-xl shadow-ambient">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="DialyBuddy Logo" width={250} height={250} className="object-contain" />
          </Link>
        </div>

        {/* เมนูหลักสำหรับทุกคน */}
        <nav className="hidden md:flex gap-8">
          <Link href="/find-buddy" className="text-sm font-label font-bold border-b-2 border-transparent hover:border-primary text-secondary hover:text-primary transition-colors py-1">ค้นหาผู้ดูแล</Link>
          <Link href="/ai-planner" className="text-sm font-label font-bold border-b-2 border-transparent hover:border-primary text-secondary hover:text-primary transition-colors py-1">AI จัดโภชนาการ</Link>
          <Link href="/booking" className="text-sm font-label font-bold border-b-2 border-transparent hover:border-primary text-secondary hover:text-primary transition-colors py-1">การทำรายการจอง</Link>
        </nav>

        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-sm font-label font-bold text-primary hover:text-primary-dim transition-colors hidden sm:block">
                เข้าสู่ระบบ
              </Link>
              <Link href="/register" className="rounded-xl font-label bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 text-sm font-semibold shadow-sm hover:scale-95 transition-transform duration-200">
                ลงทะเบียน
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-full border ghost-border bg-surface-container-lowest p-1.5 pr-4 transition-all hover:bg-surface-container-low hover:shadow-ambient"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${role === 'admin' ? 'bg-emerald-100 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
                  {role === 'admin' ? <ShieldCheck className="h-5 w-5" /> : <UserCircle className="h-5 w-5" />}
                </div>
                <span className="text-sm font-semibold font-label text-on-surface uppercase">
                  {userName} {role === 'admin' && "(ผู้ดูแล)"}
                </span>
                <ChevronDown className="h-4 w-4 text-on-surface-variant" />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl bg-surface-container-lowest shadow-ambient ghost-border animate-in fade-in slide-in-from-top-2">
                    <div className="p-2">
                      {/* ถ้าเป็น Admin ให้โชว์ทางเข้าเมนู Dashboard ของผู้ดูแล */}
                      {role === 'admin' && (
                        <Link href="/provider/dashboard" onClick={() => setIsProfileOpen(false)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold font-label text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors mb-1">
                          <LayoutDashboard className="h-4 w-4" />
                          หน้าจัดการงาน (Provider)
                        </Link>
                      )}

                      <Link href="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-label text-on-surface hover:bg-surface-container-low transition-colors">
                        <LayoutDashboard className="h-4 w-4 text-secondary" />
                        แผงควบคุม (Dashboard)
                      </Link>

                      {/* ลิงก์ไปหน้า Profile แยกตามสิทธิ์ */}
                      <Link
                        href={role === 'admin' ? "/provider/profile" : "/profile"}
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
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-label text-error hover:bg-red-50 transition-colors"
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