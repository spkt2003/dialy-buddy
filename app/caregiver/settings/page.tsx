"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Shield, Bell, Camera, Save, LogOut, WalletCards, BriefcaseMedical } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { SettingsTabButton } from "@/components/ui/SettingsTabButton";
import { NotifRow } from "@/components/ui/ToggleSwitch";
import { FormInput } from "@/components/ui/FormInput";
import { FADE_IN_UP, INPUT_CLS } from "@/lib/styles";

export default function CaregiverSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();
  const { logout, userName } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline text-slate-900 mb-2">ตั้งค่าบัญชีผู้ดูแล</h1>
        <p className="text-lg text-slate-500 font-body">จัดการข้อมูลส่วนตัว การรับเงิน และความปลอดภัยของคุณ</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-72 space-y-2 shrink-0">
          <SettingsTabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={<User className="w-5 h-5" />}>
            ข้อมูลส่วนตัว
          </SettingsTabButton>
          <SettingsTabButton active={activeTab === "payout"} onClick={() => setActiveTab("payout")} icon={<WalletCards className="w-5 h-5" />}>
            การรับเงิน
          </SettingsTabButton>
          <SettingsTabButton active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} icon={<Bell className="w-5 h-5" />}>
            การแจ้งเตือน
          </SettingsTabButton>
          <SettingsTabButton active={activeTab === "security"} onClick={() => setActiveTab("security")} icon={<Shield className="w-5 h-5" />}>
            ความปลอดภัย
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

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-10 min-h-[500px]">
          {activeTab === "profile" && (
            <div className={FADE_IN_UP}>
              <h2 className="text-2xl font-bold font-headline text-slate-900 mb-8">ข้อมูลส่วนตัว</h2>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="relative">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold border-4 border-white shadow-sm shrink-0">
                    {userName.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2.5 bg-white rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center sm:text-left w-full">
                  <h3 className="font-bold text-lg text-slate-900">รูปโปรไฟล์ผู้ดูแล</h3>
                  <p className="text-sm text-slate-500 mt-1 mb-3">ไฟล์ JPG, GIF หรือ PNG ขนาดไม่เกิน 5MB เพื่อใช้ยืนยันตัวตนกับผู้ป่วย</p>
                  <button className="text-sm font-bold bg-white border border-slate-200 text-blue-600 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                    อัปโหลดรูปใหม่
                  </button>
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="ชื่อ" defaultValue={userName} />
                  <FormInput label="นามสกุล" defaultValue="ใจสู้" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="เบอร์โทรศัพท์" type="tel" defaultValue="089-123-4567" />
                  <FormInput label="อีเมล" type="email" defaultValue="caregiver@dialybuddy.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-base font-bold text-slate-700 flex items-center gap-2">
                    <BriefcaseMedical className="w-5 h-5 text-blue-600" />
                    ใบอนุญาตประกอบวิชาชีพ
                  </label>
                  {/* disabled — license changes require admin support, not self-service. */}
                  <FormInput label="" defaultValue="พย. 12345678" disabled />
                </div>

                <div className="pt-6 mt-8 border-t border-slate-100 flex justify-end">
                  <button type="button" className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 active:scale-95 text-lg">
                    <Save className="w-5 h-5" />
                    บันทึกข้อมูล
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "payout" && (
            <div className={FADE_IN_UP}>
              <h2 className="text-2xl font-bold font-headline text-slate-900 mb-8">บัญชีรับเงิน</h2>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
                      <img src="https://upload.wikimedia.org/wikipedia/th/thumb/f/f7/KBank_Logo.svg/1200px-KBank_Logo.svg.png" alt="KBank" className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">ธนาคารกสิกรไทย</h3>
                      <p className="text-slate-600 font-medium tracking-widest mt-1">XXX-X-XX123-4</p>
                      <p className="text-sm text-slate-500 mt-1">ชื่อบัญชี: น.ส. สมศรี ใจสู้</p>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">ใช้งานอยู่</span>
                </div>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-base font-bold text-slate-700">เปลี่ยนบัญชีธนาคาร</label>
                  {/* appearance-none removes the native arrow so it looks consistent cross-browser. */}
                  <select className={`${INPUT_CLS} appearance-none`}>
                    <option>ธนาคารกสิกรไทย</option>
                    <option>ธนาคารไทยพาณิชย์</option>
                    <option>ธนาคารกรุงเทพ</option>
                    <option>ธนาคารกรุงไทย</option>
                  </select>
                </div>
                <FormInput label="หมายเลขบัญชีใหม่" placeholder="กรอกหมายเลขบัญชี 10 หลัก" />

                <div className="pt-6 mt-8 border-t border-slate-100 flex justify-end">
                  <button type="button" className="flex items-center gap-2 px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors shadow-md active:scale-95 text-lg">
                    <Save className="w-5 h-5" />
                    อัปเดตบัญชีรับเงิน
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className={FADE_IN_UP}>
              <h2 className="text-2xl font-bold font-headline text-slate-900 mb-8">การแจ้งเตือน</h2>
              <div className="space-y-4">
                <NotifRow
                  title="แจ้งเตือนงานใหม่"
                  description="รับการแจ้งเตือนทันทีเมื่อมีผู้ป่วยเรียกใช้บริการในพื้นที่ของคุณ"
                />
                <NotifRow
                  title="แจ้งเตือนข้อความแชท"
                  description="รับการแจ้งเตือนเมื่อผู้ป่วยหรือญาติส่งข้อความถึงคุณ"
                />
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className={FADE_IN_UP}>
              <h2 className="text-2xl font-bold font-headline text-slate-900 mb-8">รหัสผ่านและความปลอดภัย</h2>
              <form className="space-y-6">
                <FormInput label="รหัสผ่านปัจจุบัน" type="password" placeholder="••••••••" />
                <div className="border-t border-slate-100 my-6"></div>
                <FormInput label="รหัสผ่านใหม่" type="password" placeholder="••••••••" />
                <FormInput label="ยืนยันรหัสผ่านใหม่" type="password" placeholder="••••••••" />

                <div className="pt-6 mt-8 border-t border-slate-100 flex justify-end">
                  <button type="button" className="flex items-center gap-2 px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors shadow-md active:scale-95 text-lg">
                    <Shield className="w-5 h-5" />
                    อัปเดตรหัสผ่าน
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
