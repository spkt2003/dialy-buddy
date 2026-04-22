"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, Role } from "../../context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  /**
   * การจัดการ State และ Data Flow
   * - เรียกใช้ Hook `useAuth()` เพื่อดึงข้อมูล `isLoggedIn` (สถานะล็อกอิน) และ `role` จาก AuthContext (Global State)
   * - ข้อมูลเหล่านี้จะถูกใช้อ้างอิงเพื่อตัดสินใจว่าจะอนุญาตให้ผู้ใช้เข้าถึงเส้นทางนั้นๆ ได้หรือไม่
   */
  const { isLoggedIn, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Business Logic: การปกป้อง Route (Route Protection & Role-based Access Control)
   * 
   * useEffect นี้จะทำงานทุกครั้งที่ `isLoggedIn`, `role`, หรือ URL (`pathname`) มีการเปลี่ยนแปลง
   * โดยมีกฎในการ Redirect เพื่อนำทางผู้ใช้ให้เหมาะสมกับสิทธิ์การเข้าถึง
   */
  useEffect(() => {
    if (!pathname) return;

    // กำหนดกลุ่มของ URL ที่สงวนไว้สำหรับผู้ดูแล (Caregiver) และผู้ป่วย (Patient)
    const isCaregiverRoute = pathname.startsWith("/caregiver");
    const isPatientRoute = 
      pathname.startsWith("/find-buddy") || 
      pathname.startsWith("/ai-planner") || 
      pathname.startsWith("/booking") || 
      pathname === "/dashboard" ||
      pathname.startsWith("/tracking");
      
    // เส้นทางใดๆ ที่ต้องล็อกอินก่อนถึงจะเข้าใช้งานได้
    const isProtectedRoute = isCaregiverRoute || isPatientRoute || pathname.startsWith("/profile");

    // กฎข้อ 1: กรณีที่ยังไม่ได้ล็อกอิน (Guest) แต่พยายามเข้าถึงหน้าที่ถูกสงวนไว้ (Protected)
    // ผลลัพธ์ -> ให้ Redirect ผลักผู้ใช้ออกไปที่หน้า Login
    if (!isLoggedIn && isProtectedRoute) {
      router.push("/login");
      return;
    }

    // กฎข้อ 2: กรณีล็อกอินสำเร็จแล้ว ต้องตรวจสอบประเภทของผู้ใช้ (Role) ว่าเข้าถูกที่หรือไม่
    if (isLoggedIn) {
      if (role === "caregiver" && isPatientRoute) {
        // หากบัญชีเป็น 'ผู้ดูแล' (Caregiver) แต่กำลังเข้าหน้าเว็บของ 'ผู้ป่วย' (Patient) 
        // ผลลัพธ์ -> ให้ Redirect กลับไปหน้า Dashboard ฝั่งผู้ดูแล
        router.push("/caregiver/dashboard");
      } else if (role === "patient" && isCaregiverRoute) {
        // หากบัญชีเป็น 'ผู้ป่วย' (Patient) แต่กำลังเข้าหน้าเว็บของ 'ผู้ดูแล' (Caregiver)
        // ผลลัพธ์ -> ให้ Redirect กลับไปหน้า Dashboard ฝั่งผู้ป่วย
        router.push("/dashboard");
      }
    }
  }, [isLoggedIn, role, pathname, router]);

  return <>{children}</>;
}
