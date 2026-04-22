import type { Metadata } from "next";
import { Manrope, Lexend } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import AuthGuard from "../components/auth/AuthGuard";
import { JobProvider } from "../context/JobContext";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dialybuddy | The Curated Caregiver",
  description: "Specialized care and AI nutrition for dialysis patients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /**
   * RootLayout Component (โครงสร้างหลักของแอปพลิเคชัน)
   * 
   * หน้าที่หลัก (Purpose):
   * ทำหน้าที่เป็น Layout พื้นฐานสำหรับทุกหน้าในแอป (Next.js App Router)
   * ซึ่งรวมถึงการตั้งค่าฟอนต์ (Fonts), CSS แบบ Global, โครงสร้าง HTML (html, body) 
   * และการครอบแอปด้วย Provider ต่างๆ ที่จำเป็นต้องใช้แบบ Global
   * 
   * การจัดการ State (State Management):
   * - ควบคุม Global State ผ่าน Context Providers:
   *   1. <AuthProvider>: จัดการสถานะการเข้าสู่ระบบ (Authentication) ของผู้ใช้
   *   2. <JobProvider>: จัดการสถานะข้อมูลงาน (Jobs) ที่เกี่ยวข้องกับผู้ดูแลหรือผู้ป่วย
   * 
   * Business Logic:
   * - ใช้ <AuthGuard> เพื่อตรวจสอบสิทธิ์การเข้าถึงหน้าต่างๆ 
   *   ป้องกันไม่ให้ผู้ใช้ที่ยังไม่ล็อกอิน หรือไม่มีสิทธิ์ เข้าถึงหน้าเว็บที่ต้องการการยืนยันตัวตน
   * - ห่อหุ้ม {children} ซึ่งก็คือ Component ของแต่ละหน้า (Page) ให้อยู่ภายใต้ Provider และ AuthGuard
   */
  return (
    <html lang="th" className={`${manrope.variable} ${lexend.variable} antialiased scroll-smooth`}>
      <body className="min-h-[100dvh] flex flex-col font-body bg-surface text-on-surface overflow-x-hidden">
        <AuthProvider>
          <AuthGuard>
            <JobProvider>
              {children}
            </JobProvider>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
