"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

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
   * Business Logic: โหลดข้อมูลการล็อกอินจาก Local Storage
   * 
   * - ทำงานเมื่อแอปถูกโหลดครั้งแรก (on mount)
   * - ไปอ่านค่าที่เคยเซฟไว้ใน localStorage เพื่อกู้คืน session ให้ผู้ใช้ไม่ต้องล็อกอินใหม่ทุกครั้งที่รีเฟรชหน้าเว็บ
   */
  useEffect(() => {
    // โหลดข้อมูลจาก local storage
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    const storedRole = localStorage.getItem("role");
    const storedUserName = localStorage.getItem("userName");

    if (storedLoginStatus === "true") {
      setIsLoggedIn(true);
      setRole((storedRole as Role) || "patient");
      setUserName(storedUserName || "ผู้ใช้งาน");
    }
    
    setIsInitialized(true);
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
   * - เคลียร์ค่า React State ทั้งหมดให้กลับเป็นค่าเริ่มต้นเหมือนตอนเข้ามาเว็บครั้งแรก
   * - ลบข้อมูลทั้งหมดที่เก็บอยู่ใน localStorage ด้วย localStorage.clear() 
   */
  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setUserName("ผู้ใช้งาน");
    localStorage.clear();
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
