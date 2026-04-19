// app/caregiver/layout.tsx
"use client";

import Link from "next/link";
import { Home, Users, Settings, LogOut, HeartPulse } from "lucide-react";
import { usePathname } from "next/navigation";

export default function CaregiverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const navItems = [
    { name: "แผงควบคุม", href: "/caregiver/dashboard", icon: Home },
    { name: "งานของฉัน", href: "/caregiver/jobs", icon: Users },
    { name: "ตั้งค่า", href: "/caregiver/profile", icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-body text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="DialyBuddy" className="h-10 w-auto object-contain drop-shadow-sm" />
            <span className="text-2xl font-bold font-headline">
              <span className="text-blue-600">Dialy</span><span className="text-emerald-500">Buddy</span> <span className="text-slate-500 font-medium text-lg">ผู้ดูแล</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-medium ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <Link
              href="/logout"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors font-medium"
            >
              <LogOut className="h-5 w-5" />
              <span>ออกจากระบบ</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="DialyBuddy" className="h-6 w-auto object-contain grayscale opacity-70" />
            <span>© {new Date().getFullYear()} DialyBuddy – บริการดูแลผู้ป่วยผู้สูงอายุ</span>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-blue-600 transition-colors">เงื่อนไขการใช้งาน</Link>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">นโยบายความเป็นส่วนตัว</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
