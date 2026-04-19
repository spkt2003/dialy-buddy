// app/caregiver/layout.tsx
"use client";

import Link from "next/link";
import { Home, Users, Settings, LogOut } from "lucide-react";

export default function CaregiverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link href="/" className="text-2xl font-bold">
            DialyBuddy ผู้ดูแล
          </Link>
          <nav className="flex space-x-4">
            <Link
              href="/caregiver/dashboard"
              className="flex items-center space-x-1 hover:text-blue-200"
            >
              <Home className="h-5 w-5" />
              <span>แผงควบคุม</span>
            </Link>
            <Link
              href="/caregiver/jobs"
              className="flex items-center space-x-1 hover:text-blue-200"
            >
              <Users className="h-5 w-5" />
              <span>งานของฉัน</span>
            </Link>
            <Link
              href="/caregiver/profile"
              className="flex items-center space-x-1 hover:text-blue-200"
            >
              <Settings className="h-5 w-5" />
              <span>ตั้งค่า</span>
            </Link>
            <Link
              href="/logout"
              className="flex items-center space-x-1 hover:text-blue-200"
            >
              <LogOut className="h-5 w-5" />
              <span>ออกจากระบบ</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-6 space-y-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-emerald-600 text-white py-4">
        <div className="container mx-auto text-center">
          © {new Date().getFullYear()} DialyBuddy – บริการดูแลผู้ป่วยผู้สูงอายุ
        </div>
      </footer>
    </div>
  );
}
