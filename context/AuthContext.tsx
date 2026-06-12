"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Role = "patient" | "caregiver" | null;

interface AuthContextType {
  isLoggedIn: boolean;
  role: Role;
  userName: string;
  login: (role: Role, userName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  /**
   * การจัดการ State ของ Authentication (Global State)
   * 
   * 1. isLoggedIn: เก็บสถานะว่าผู้ใช้ล็อกอินเข้ามาแล้วหรือยัง
   * 2. role: เก็บประเภทของผู้ใช้ ("patient" = ผู้ป่วย, "caregiver" = ผู้ดูแล) เพื่อใช้ทำ Role-based Access
   * 3. userName: เก็บชื่อของผู้ใช้งานเพื่อนำไปแสดงผลบน UI (เช่น เมนูโปรไฟล์ หรือ Navbar)
   * 4. isInitialized: เก็บสถานะว่าตัวแอปดึงข้อมูลจาก Local Storage เสร็จหรือยัง ป้องกัน UI กระตุก (Hydration mismatch)
   */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [userName, setUserName] = useState("ผู้ใช้งาน");
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Business Logic: โหลด session จาก Supabase Auth (หลัก) หรือ localStorage (fallback สำหรับ dev credentials)
   *
   * onAuthStateChange fires ทันทีหลัง subscribe พร้อม session ปัจจุบัน (INITIAL_SESSION event)
   * ทำให้ไม่ต้องเรียก getSession() แยก
   */
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Supabase session — role และ userName เก็บไว้ใน user_metadata ตอน signUp
        setIsLoggedIn(true);
        setRole((session.user.user_metadata?.role as Role) || "patient");
        setUserName(session.user.user_metadata?.userName || "ผู้ใช้งาน");
      } else {
        // ไม่มี Supabase session — fallback ไปเช็ค localStorage สำหรับ dev credentials (admin/user)
        const storedLoginStatus = localStorage.getItem("isLoggedIn");
        if (storedLoginStatus === "true") {
          setIsLoggedIn(true);
          setRole((localStorage.getItem("role") as Role) || "patient");
          setUserName(localStorage.getItem("userName") || "ผู้ใช้งาน");
        } else {
          setIsLoggedIn(false);
          setRole(null);
          setUserName("ผู้ใช้งาน");
        }
      }
      setIsInitialized(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  /**
   * ฟังก์ชัน login (การเข้าสู่ระบบ)
   * 
   * - รับค่า `newRole` และ `newUserName` จากหน้าจอเข้าสู่ระบบ
   * - ทำการอัปเดต React State เพื่อให้ส่วนต่างๆ ของแอปพลิเคชัน (เช่น Navbar) เปลี่ยนแปลงทันที
   * - บันทึกข้อมูลลง localStorage อย่างถาวร (จนกว่าจะลบ) เพื่อใช้ในการเข้าใช้งานครั้งต่อไป
   */
  const login = (newRole: Role, newUserName: string) => {
    setIsLoggedIn(true);
    setRole(newRole);
    setUserName(newUserName);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", newRole || "");
    localStorage.setItem("userName", newUserName);
  };

  /**
   * ฟังก์ชัน logout (การออกจากระบบ)
   *
   * - เรียก supabase.auth.signOut() — onAuthStateChange จะ fire แล้ว reset state อัตโนมัติ
   * - ลบ localStorage dev credential keys ด้วย (สำหรับ admin/user hardcoded path)
   * - Reset React state ทันทีโดยไม่รอ callback เพื่อให้ UI ตอบสนองเร็ว
   */
  const logout = () => {
    supabase.auth.signOut(); // fire-and-forget
    setIsLoggedIn(false);
    setRole(null);
    setUserName("ผู้ใช้งาน");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
  };

  // รอจนกว่าจะตรวจสอบ localStorage เสร็จสมบูรณ์ ค่อยเริ่มแสดง UI เพื่อป้องกันจอแสดงข้อมูลสลับไปมาระหว่าง Guest กับ User
  if (!isInitialized) return null;

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
