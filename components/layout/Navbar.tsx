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
  ShieldCheck,
  Menu,
  X,
  Search,
  Brain,
  Briefcase,
  Home,
  History,
  Trophy,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isLoggedIn, role, userName, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsProfileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMobileOpen(false);
    router.push("/");
  };

  const navLinkClass =
    "text-sm font-label font-bold border-b-2 border-transparent hover:border-primary text-secondary hover:text-primary transition-colors py-1";

  const mobileNavLinkClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-label font-bold text-on-surface hover:bg-surface-container-low transition-colors";

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-container-lowest/80 backdrop-blur-xl shadow-ambient">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
            <div className="w-28 sm:w-36 md:w-44">
              <Image
                src="/logo.png"
                alt="DialyBuddy Logo"
                width={250}
                height={250}
                className="w-full h-auto object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          {role === "caregiver" ? (
            <>
              <Link href="/caregiver/dashboard" className={navLinkClass}>แผงควบคุม</Link>
              <Link href="/caregiver/jobs" className={navLinkClass}>งานของฉัน</Link>
            </>
          ) : (
            <>
              <Link href="/find-buddy" className={navLinkClass}>ค้นหาผู้ดูแล</Link>
              <Link href="/ai-planner" className={navLinkClass}>AI จัดโภชนาการ</Link>
              <Link href="/ranking" className={navLinkClass}>อันดับผู้ดูแล</Link>
            </>
          )}
        </nav>

        {/* Right: Desktop Auth + Mobile controls */}
        <div className="flex items-center gap-2">
          {/* Desktop auth */}
          {!isLoggedIn ? (
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-label font-bold text-primary hover:text-primary-dim transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="rounded-xl font-label bg-primary text-on-primary px-6 py-2.5 text-sm font-semibold shadow-sm hover:brightness-105 active:scale-95 transition duration-200"
              >
                ลงทะเบียน
              </Link>
            </div>
          ) : (
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-full border ghost-border bg-surface-container-lowest p-1.5 pr-4 transition-all hover:bg-surface-container-low hover:shadow-ambient"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    role === "caregiver"
                      ? "bg-tertiary-container/40 text-tertiary"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {role === "caregiver" ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : (
                    <UserCircle className="h-5 w-5" />
                  )}
                </div>
                <span className="text-sm font-semibold font-label text-on-surface uppercase">
                  {userName} {role === "caregiver" && "(ผู้ดูแล)"}
                </span>
                <ChevronDown className="h-4 w-4 text-on-surface-variant" />
              </button>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl bg-surface-container-lowest shadow-ambient ghost-border animate-in fade-in slide-in-from-top-2">
                    <div className="p-2">
                      {role === "caregiver" && (
                        <Link
                          href="/caregiver/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold font-label text-tertiary bg-tertiary-container/30 hover:bg-tertiary-container/40 transition-colors mb-1"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          หน้าจัดการงาน (ผู้ดูแล)
                        </Link>
                      )}
                      {role !== "caregiver" && (
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-label text-on-surface hover:bg-surface-container-low transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-secondary" />
                          แผงควบคุม (Dashboard)
                        </Link>
                      )}
                      {role !== "caregiver" && (
                        <Link
                          href="/transactions"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-label text-on-surface hover:bg-surface-container-low transition-colors"
                        >
                          <History className="h-4 w-4 text-secondary" />
                          ประวัติธุรกรรม
                        </Link>
                      )}
                      <Link
                        href={role === "caregiver" ? "/caregiver/settings" : "/profile"}
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

          {/* Mobile: login shortcut (unauthenticated only) */}
          {!isLoggedIn && (
            <Link
              href="/login"
              className="md:hidden text-sm font-label font-bold text-primary"
            >
              เข้าสู่ระบบ
            </Link>
          )}

          {/* Hamburger button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-surface-container-low text-on-surface-variant transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="เมนู"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-outline-variant/15 bg-surface-container-lowest/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">

            {/* User info (logged in) */}
            {isLoggedIn && (
              <div className="flex items-center gap-3 px-4 py-3 mb-1 bg-surface-container-low rounded-xl">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${
                    role === "caregiver"
                      ? "bg-tertiary-container/40 text-tertiary"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {role === "caregiver" ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : (
                    <UserCircle className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{userName}</p>
                  <p className="text-xs text-on-surface-variant">
                    {role === "caregiver" ? "ผู้ดูแล (Care Buddy)" : "ผู้ป่วย / ครอบครัว"}
                  </p>
                </div>
              </div>
            )}

            {/* Nav links — unauthenticated */}
            {!isLoggedIn && (
              <>
                <Link href="/" className={mobileNavLinkClass}>
                  <Home className="h-5 w-5 text-secondary" />
                  หน้าหลัก
                </Link>
                <Link href="/find-buddy" className={mobileNavLinkClass}>
                  <Search className="h-5 w-5 text-secondary" />
                  ค้นหาผู้ดูแล
                </Link>
                <Link href="/ai-planner" className={mobileNavLinkClass}>
                  <Brain className="h-5 w-5 text-secondary" />
                  AI จัดโภชนาการ
                </Link>
                <div className="border-t border-outline-variant/15 my-1" />
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 mt-1 px-4 py-3 rounded-xl bg-primary text-on-primary text-sm font-bold transition-colors hover:brightness-105"
                >
                  ลงทะเบียนใช้งาน
                </Link>
              </>
            )}

            {/* Nav links — patient */}
            {isLoggedIn && role !== "caregiver" && (
              <>
                <Link href="/dashboard" className={mobileNavLinkClass}>
                  <LayoutDashboard className="h-5 w-5 text-secondary" />
                  แผงควบคุม
                </Link>
                <Link href="/find-buddy" className={mobileNavLinkClass}>
                  <Search className="h-5 w-5 text-secondary" />
                  ค้นหาผู้ดูแล
                </Link>
                <Link href="/ai-planner" className={mobileNavLinkClass}>
                  <Brain className="h-5 w-5 text-secondary" />
                  AI จัดโภชนาการ
                </Link>
                <Link href="/transactions" className={mobileNavLinkClass}>
                  <History className="h-5 w-5 text-secondary" />
                  ประวัติธุรกรรม
                </Link>
                <Link href="/ranking" className={mobileNavLinkClass}>
                  <Trophy className="h-5 w-5 text-secondary" />
                  อันดับผู้ดูแล
                </Link>
                <Link href="/profile" className={mobileNavLinkClass}>
                  <Settings className="h-5 w-5 text-secondary" />
                  ตั้งค่าบัญชี
                </Link>
              </>
            )}

            {/* Nav links — caregiver */}
            {isLoggedIn && role === "caregiver" && (
              <>
                <Link href="/caregiver/dashboard" className={mobileNavLinkClass}>
                  <LayoutDashboard className="h-5 w-5 text-tertiary" />
                  แผงควบคุม
                </Link>
                <Link href="/caregiver/jobs" className={mobileNavLinkClass}>
                  <Briefcase className="h-5 w-5 text-tertiary" />
                  งานของฉัน
                </Link>
                <Link href="/caregiver/settings" className={mobileNavLinkClass}>
                  <Settings className="h-5 w-5 text-tertiary" />
                  ตั้งค่าบัญชี
                </Link>
              </>
            )}

            {/* Logout */}
            {isLoggedIn && (
              <>
                <div className="border-t border-outline-variant/15 my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-label font-bold text-error hover:bg-error/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  ออกจากระบบ
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
