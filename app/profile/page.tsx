"use client";
import { useState, useEffect } from "react";
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
  const { logout, userName, userPhone } = useAuth();

  const nameParts = userName.trim().split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");

  const [email, setEmail] = useState("");
  useEffect(() => {
    setEmail(localStorage.getItem("userEmail") ?? "");
  }, []);

  // Uses AuthContext logout() so React state and all localStorage keys are cleared atomically.
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <PatientPageShell maxWidth="max-w-5xl" pt="pt-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="p-2.5 bg-surface-container-lowest rounded-full shadow-ambient ghost-border hover:bg-surface-container-low transition-colors">
          <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-on-background">ตั้งค่าบัญชี</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">จัดการข้อมูลส่วนตัวและความปลอดภัยของคุณ</p>
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

          <div className="pt-6 mt-6 border-t border-outline-variant/20">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 font-bold transition-all text-error bg-error/10 hover:bg-error/15 border border-error/20 shadow-ambient"
            >
              <LogOut className="w-5 h-5" />
              ออกจากระบบ
            </button>
          </div>
        </div>

        <div className="flex-1 bg-surface-container-lowest rounded-[2rem] shadow-ambient ghost-border p-6 md:p-10">
          {activeTab === "profile" && (
            <div className={FADE_IN_UP}>
              <h2 className="text-xl font-bold text-on-background mb-6">ข้อมูลส่วนตัว</h2>

              <div className="flex items-center gap-6 mb-8 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                <div className="relative">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl font-bold border-4 border-surface-container-lowest shadow-ambient">
                    {userName.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-surface-container-lowest rounded-full border border-outline-variant/20 shadow-ambient hover:bg-surface-container-low text-on-surface-variant transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-on-background">รูปโปรไฟล์</h3>
                  <p className="text-xs text-on-surface-variant mt-1 mb-2">ไฟล์ JPG, GIF หรือ PNG ขนาดไม่เกิน 5MB</p>
                  <button className="text-xs font-bold text-primary hover:underline">อัปโหลดรูปใหม่</button>
                </div>
              </div>

              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface">ชื่อ</label>
                    <input type="text" defaultValue={firstName} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface">นามสกุล</label>
                    <input type="text" defaultValue={lastName} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">อีเมล</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="อีเมล (ไม่บังคับ)" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">เบอร์โทรศัพท์</label>
                  <input type="tel" defaultValue={userPhone} placeholder="เบอร์โทรศัพท์" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface text-sm" />
                </div>

                <div className="pt-6 mt-8 border-t border-outline-variant/15 flex justify-end">
                  <button type="button" onClick={() => localStorage.setItem("userEmail", email)} className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-dim transition-colors shadow-ambient active:scale-95">
                    <Save className="w-4 h-4" />
                    บันทึกข้อมูล
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className={FADE_IN_UP}>
              <h2 className="text-xl font-bold text-on-background mb-6">เปลี่ยนรหัสผ่าน</h2>
              <form className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">รหัสผ่านปัจจุบัน</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface text-sm" />
                </div>
                <div className="border-t border-outline-variant/15 my-6"></div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">รหัสผ่านใหม่</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">ยืนยันรหัสผ่านใหม่</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface text-sm" />
                </div>

                <div className="pt-6 mt-8 border-t border-outline-variant/15 flex justify-end">
                  <button type="button" className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-dim transition-colors shadow-ambient active:scale-95">
                    <Shield className="w-4 h-4" />
                    อัปเดตรหัสผ่าน
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className={FADE_IN_UP}>
              <h2 className="text-xl font-bold text-on-background mb-6">การตั้งค่าการแจ้งเตือน</h2>
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
