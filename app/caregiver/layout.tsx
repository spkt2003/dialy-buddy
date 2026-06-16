// app/caregiver/layout.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, Users, Settings, LogOut, HeartPulse } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function CaregiverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isLoggedIn, role, userName } = useAuth();

  // แจ้งสถานะออนไลน์ผ่าน Supabase Realtime Presence เพื่อให้หน้า find-buddy เห็นว่าใครออนไลน์อยู่
  useEffect(() => {
    if (!isLoggedIn || role !== "caregiver") return;
    const channel = supabase.channel("caregiver-presence").subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ name: userName });
      }
    });
    return () => { supabase.removeChannel(channel); };
  }, [isLoggedIn, role, userName]);

  if (!isLoggedIn || role !== "caregiver") return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };
  
  const navItems = [
    { name: "แผงควบคุม", href: "/caregiver/dashboard", icon: Home },
    { name: "งานของฉัน", href: "/caregiver/jobs", icon: Users },
    { name: "ตั้งค่า", href: "/caregiver/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface font-body text-on-background">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6">
          <Link href="/" className="flex items-center gap-4">
            <Image src="/logo.png" alt="DialyBuddy Logo" width={250} height={250} className="object-contain" />
            <span className="text-on-surface-variant font-bold text-xl mt-1">ผู้ดูแล</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-medium ${
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-background"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="w-px h-6 bg-outline-variant/30 mx-2"></div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors font-medium"
            >
              <LogOut className="h-5 w-5" />
              <span>ออกจากระบบ</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/20 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant text-sm">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="DialyBuddy" className="h-6 w-auto object-contain grayscale opacity-70" />
            <span>© {new Date().getFullYear()} DialyBuddy – บริการดูแลผู้ป่วยผู้สูงอายุ</span>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-primary transition-colors">เงื่อนไขการใช้งาน</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">นโยบายความเป็นส่วนตัว</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
