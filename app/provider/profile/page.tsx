"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Car, ChevronRight, CheckCircle2, LogOut } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function ProviderProfilePage() {
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const userName = localStorage.getItem("userName");

        // เงื่อนไข: ถ้าล็อกอินแล้ว และเป็น admin ให้ผ่าน
        if (isLoggedIn === "true" && userName === "admin") {
            return; // เข้าใช้งานได้ปกติ
        } else {
            // ถ้าไม่ใช่ admin หรือไม่ได้ล็อกอิน ให้เด้งออกทันที
            router.push("/login");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans">
            <Navbar />
            <main className="py-8 px-4 max-w-[420px] mx-auto w-full animate-in fade-in duration-500">
                <h2 className="text-[22px] font-extrabold text-slate-900 mb-5">โปรไฟล์ของฉัน</h2>

                {/* สถานะรับงาน */}
                <div className="bg-white p-4 rounded-[28px] shadow-sm border border-slate-100 mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-[50px] h-[50px] rounded-full flex items-center justify-center ${isOnline ? 'bg-emerald-50 text-[#00d27e]' : 'bg-slate-100 text-slate-400'}`}>
                            <Car className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-[16px] mb-0.5">สถานะรับงาน</h3>
                            <p className={`text-[14px] font-medium ${isOnline ? 'text-[#00d27e]' : 'text-slate-500'}`}>
                                {isOnline ? 'เปิดรับงาน (ออนไลน์)' : 'พักผ่อน (ออฟไลน์)'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOnline(!isOnline)}
                        className={`relative inline-flex h-[36px] w-[60px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none ${isOnline ? 'bg-[#00d27e]' : 'bg-slate-300'}`}
                    >
                        <span className={`inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-sm transition duration-300 ${isOnline ? 'translate-x-[28px]' : 'translate-x-[4px]'}`} />
                    </button>
                </div>

                {/* ข้อมูลโปรไฟล์หลัก */}
                <div className="bg-white rounded-[28px] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-7">
                        <div className="flex items-center gap-5">
                            <div className="w-[84px] h-[84px] bg-[#1d4ed8] rounded-full flex items-center justify-center text-white text-[32px] font-bold shadow-sm uppercase">
                                ส
                            </div>
                            <div>
                                <h3 className="text-[20px] font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                                    สมศรี ใจดี <CheckCircle2 className="w-5 h-5 text-[#2563eb] fill-blue-50" />
                                </h3>
                                <p className="text-slate-500 text-[15px] font-medium mb-1.5">พยาบาลวิชาชีพ (RN)</p>
                                <div className="flex items-center gap-1.5 text-[14px] text-slate-500">
                                    <span className="text-[#eab308] text-[16px]">★</span> 4.9 (128 รีวิว)
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-[1px] bg-slate-50"></div>

                    <div className="px-7 pt-6 pb-7 space-y-6">
                        <div>
                            <label className="text-[14px] font-bold text-slate-500 mb-3 block">ข้อมูลยานพาหนะ</label>
                            <div className="flex items-center justify-between bg-[#f8fafc] p-[18px] rounded-[18px] border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <Car className="w-6 h-6 text-slate-400" />
                                    <div>
                                        <p className="font-bold text-slate-800 text-[15px] mb-0.5">Honda City (สีขาว)</p>
                                        <p className="text-[13px] text-slate-500">กท 1234 กรุงเทพมหานคร</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300" />
                            </div>
                        </div>

                        <div>
                            <label className="text-[14px] font-bold text-slate-500 mb-1 block">ตั้งค่าบัญชี</label>
                            <div className="space-y-1">
                                <button className="w-full flex items-center justify-between py-3.5 group transition-colors">
                                    <span className="font-bold text-slate-700 text-[15px] group-hover:text-[#2563eb]">แก้ไขข้อมูลส่วนตัว</span>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#2563eb]" />
                                </button>
                                <button className="w-full flex items-center justify-between py-3.5 group transition-colors">
                                    <span className="font-bold text-slate-700 text-[15px] group-hover:text-[#2563eb]">ประวัติการทำงานและรายได้</span>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#2563eb]" />
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button onClick={handleLogout} className="w-full py-[16px] text-[#ef4444] font-bold bg-[#fef2f2] rounded-[16px] hover:bg-red-100 transition-colors text-[16px]">
                                ออกจากระบบ
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}