"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Shield, Bell, Camera, Save, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PatientPageShell } from "@/components/layout/PatientPageShell";
import { SettingsTabButton } from "@/components/ui/SettingsTabButton";
import { NotifRow } from "@/components/ui/ToggleSwitch";
import { FADE_IN_UP } from "@/lib/styles";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();
  const { logout } = useAuth();

  // Uses AuthContext logout() so React state and all localStorage keys are cleared atomically.
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <PatientPageShell maxWidth="max-w-5xl" pt="pt-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="p-2.5 bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ตั้งค่าบัญชี</h1>
          <p className="text-sm text-slate-500 mt-0.5">จัดการข้อมูลส่วนตัวและความปลอดภัยของคุณ</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-72 space-y-2 shrink-0">
          <SettingsTabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={<User className="w-5 h-5" />}>
            ข้อมูลส่วนตัว
          </SettingsTabButton>
          <SettingsTabButton active={activeTab === "security"} onClick={() => setActiveTab("security")} icon={<Shield className="w-5 h-5" />}>
            รหัสผ่านและความปลอดภัย
          </SettingsTabButton>
          <SettingsTabButton active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} icon={<Bell className="w-5 h-5" />}>
            การแจ้งเตือน
          </SettingsTabButton>

          <div className="pt-6 mt-6 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 font-bold transition-all text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 shadow-sm"
            >
              <LogOut className="w-5 h-5" />
              ออกจากระบบ
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-10">
          {activeTab === "profile" && (
            <div className={FADE_IN_UP}>
              <h2 className="text-xl font-bold text-slate-900 mb-6">ข้อมูลส่วนตัว</h2>

              <div className="flex items-center gap-6 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="relative">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white shadow-sm">
                    ส
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">รูปโปรไฟล์</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-2">ไฟล์ JPG, GIF หรือ PNG ขนาดไม่เกิน 5MB</p>
                  <button className="text-xs font-bold text-blue-600 hover:underline">อัปโหลดรูปใหม่</button>
                </div>
              </div>

              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">ชื่อ</label>
                    <input type="text" defaultValue="สมหมาย" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">นามสกุล</label>
                    <input type="text" defaultValue="ใจดี" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">อีเมล</label>
                  <input type="email" defaultValue="sommai@dialybuddy.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">เบอร์โทรศัพท์</label>
                  <input type="tel" defaultValue="081-234-5678" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 text-sm" />
                </div>

                <div className="pt-6 mt-8 border-t border-slate-100 flex justify-end">
                  <button type="button" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 active:scale-95">
                    <Save className="w-4 h-4" />
                    บันทึกข้อมูล
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className={FADE_IN_UP}>
              <h2 className="text-xl font-bold text-slate-900 mb-6">เปลี่ยนรหัสผ่าน</h2>
              <form className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">รหัสผ่านปัจจุบัน</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 text-sm" />
                </div>
                <div className="border-t border-slate-100 my-6"></div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">รหัสผ่านใหม่</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">ยืนยันรหัสผ่านใหม่</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 text-sm" />
                </div>

                <div className="pt-6 mt-8 border-t border-slate-100 flex justify-end">
                  <button type="button" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 active:scale-95">
                    <Shield className="w-4 h-4" />
                    อัปเดตรหัสผ่าน
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className={FADE_IN_UP}>
              <h2 className="text-xl font-bold text-slate-900 mb-6">การตั้งค่าการแจ้งเตือน</h2>
              <div className="space-y-4">
                <NotifRow
                  title="แจ้งเตือนสถานะการจอง"
                  description="รับการแจ้งเตือนเมื่อมีการยืนยัน หรือเปลี่ยนแปลงการจองของคุณ"
                />
                <NotifRow
                  title="ข้อความแชทใหม่"
                  description="รับการแจ้งเตือนเมื่อมีข้อความใหม่จากผู้ให้บริการ"
                />
                <NotifRow
                  title="ข่าวสารและสิทธิพิเศษ"
                  description="รับข้อมูลโปรโมชั่นและการอัปเดตระบบจาก DialyBuddy"
                  defaultChecked={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </PatientPageShell>
  );
}
