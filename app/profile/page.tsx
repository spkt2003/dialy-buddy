"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import { ArrowLeft, User, Shield, Bell, Camera, Save, LogOut } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const router = useRouter(); // 2. เรียกใช้งาน useRouter

    // 3. สร้างฟังก์ชันสำหรับออกจากระบบ
    const handleLogout = () => {
        // ลบข้อมูลการล็อกอินออกจากเบราว์เซอร์
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");

        // เด้งกลับไปหน้าแรก (หรือเปลี่ยนเป็น "/login" ก็ได้)
        router.push("/");
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 pb-24">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/dashboard" className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900"> ตั้งค่าบัญชี </h1>
                            <p className="text-sm text-gray-500 mt-0.5"> จัดการข้อมูลส่วนตัวและความปลอดภัยของคุณ </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-72 space-y-2 shrink-0">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === "profile"
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                                    }`}
                            >
                                <User className="w-5 h-5" />
                                ข้อมูลส่วนตัว
                            </button>
                            <button
                                onClick={() => setActiveTab("security")}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === "security"
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                                    }`}
                            >
                                <Shield className="w-5 h-5" />
                                รหัสผ่านและความปลอดภัย
                            </button>
                            <button
                                onClick={() => setActiveTab("notifications")}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === "notifications"
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                                    }`}
                            >
                                <Bell className="w-5 h-5" />
                                การแจ้งเตือน
                            </button>

                            <div className="pt-6 mt-6 border-t border-gray-200">
                                {/* ปุ่มนี้จะเรียกใช้ฟังก์ชัน handleLogout เมื่อถูกคลิก */}
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium font-label text-error hover:bg-error-container/10 transition-colors text-red-600 bg-red-50"
                                >
                                    <LogOut className="w-4 h-4 text-error text-red-600" />
                                    ออกจากระบบ
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-10">
                            {
                                activeTab === "profile" && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <h2 className="text-xl font-bold text-gray-900 mb-6"> ข้อมูลส่วนตัว </h2>

                                        <div className="flex items-center gap-6 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="relative">
                                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white shadow-sm">
                                                    ส
                                                </div>
                                                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 text-gray-600 transition-colors">
                                                    <Camera className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900"> รูปโปรไฟล์ </h3>
                                                <p className="text-xs text-gray-500 mt-1 mb-2"> ไฟล์ JPG, GIF หรือ PNG ขนาดไม่เกิน 5MB </p>
                                                <button className="text-xs font-bold text-blue-600 hover:underline"> อัปโหลดรูปใหม่ </button>
                                            </div>
                                        </div>

                                        <form className="space-y-5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-700"> ชื่อ </label>
                                                    <input type="text" defaultValue="สมหมาย" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 text-sm" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-700"> นามสกุล </label>
                                                    <input type="text" defaultValue="ใจดี" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 text-sm" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700"> อีเมล </label>
                                                <input type="email" defaultValue="sommai@dialybuddy.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 text-sm" />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700"> เบอร์โทรศัพท์ </label>
                                                <input type="tel" defaultValue="081-234-5678" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 text-sm" />
                                            </div>

                                            <div className="pt-6 mt-8 border-t border-gray-100 flex justify-end">
                                                <button type="button" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 active:scale-95">
                                                    <Save className="w-4 h-4" />
                                                    บันทึกข้อมูล
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )
                            }

                            {
                                activeTab === "security" && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <h2 className="text-xl font-bold text-gray-900 mb-6"> เปลี่ยนรหัสผ่าน </h2>
                                        <form className="space-y-5">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700"> รหัสผ่านปัจจุบัน </label>
                                                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 text-sm" />
                                            </div>
                                            <div className="border-t border-gray-100 my-6"> </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700"> รหัสผ่านใหม่ </label>
                                                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 text-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700"> ยืนยันรหัสผ่านใหม่ </label>
                                                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 text-sm" />
                                            </div>

                                            <div className="pt-6 mt-8 border-t border-gray-100 flex justify-end">
                                                <button type="button" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 active:scale-95">
                                                    <Shield className="w-4 h-4" />
                                                    อัปเดตรหัสผ่าน
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )
                            }

                            {
                                activeTab === "notifications" && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <h2 className="text-xl font-bold text-gray-900 mb-6"> การตั้งค่าการแจ้งเตือน </h2>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                                <div>
                                                    <h4 className="font-bold text-gray-900"> แจ้งเตือนสถานะการจอง </h4>
                                                    <p className="text-sm text-gray-500 mt-1"> รับการแจ้งเตือนเมื่อมีการยืนยัน หรือเปลี่ยนแปลงการจองของคุณ </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"> </div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                                <div>
                                                    <h4 className="font-bold text-gray-900"> ข้อความแชทใหม่ </h4>
                                                    <p className="text-sm text-gray-500 mt-1"> รับการแจ้งเตือนเมื่อมีข้อความใหม่จากผู้ให้บริการ </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"> </div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                                <div>
                                                    <h4 className="font-bold text-gray-900"> ข่าวสารและสิทธิพิเศษ </h4>
                                                    <p className="text-sm text-gray-500 mt-1"> รับข้อมูลโปรโมชั่นและการอัปเดตระบบจาก DialyBuddy </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                                                    <input type="checkbox" className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"> </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}