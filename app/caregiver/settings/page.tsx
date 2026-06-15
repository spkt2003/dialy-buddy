"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Shield, Bell, Camera, Save, LogOut, WalletCards, BriefcaseMedical, Star } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { SettingsTabButton } from "@/components/ui/SettingsTabButton";
import { NotifRow } from "@/components/ui/ToggleSwitch";
import { FormInput } from "@/components/ui/FormInput";
import { FADE_IN_UP, INPUT_CLS } from "@/lib/styles";

export default function CaregiverSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();
  const { logout, userName, userPhone, updateUserName } = useAuth();

  const nameParts = userName.trim().split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");

  const [firstNameInput, setFirstNameInput] = useState(firstName);
  const [lastNameInput, setLastNameInput] = useState(lastName);
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [myRating, setMyRating] = useState<number | null>(null);
  const [myReviews, setMyReviews] = useState<number | null>(null);

  const emailKey = `userEmail_${userPhone || userName}`;

  useEffect(() => {
    setEmail(localStorage.getItem(emailKey) ?? "");
  }, [emailKey]);

  useEffect(() => {
    // ดึงคะแนนของตัวเองจาก caregiver_profiles (null สำหรับ dev credentials ที่ไม่มี session)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("caregiver_profiles")
        .select("rating, reviews")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setMyRating(data.rating);
            setMyReviews(data.reviews);
          }
        });
    });
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSave = async () => {
    const fullName = [firstNameInput, lastNameInput].filter(Boolean).join(" ");
    await updateUserName(fullName);
    localStorage.setItem(emailKey, email);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline text-on-background mb-2">ตั้งค่าบัญชีผู้ดูแล</h1>
        <p className="text-lg text-on-surface-variant font-body">จัดการข้อมูลส่วนตัว การรับเงิน และความปลอดภัยของคุณ</p>
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

          <div className="pt-6 mt-6 border-t border-outline-variant/20">
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
        <div className="flex-1 bg-surface-container-lowest rounded-[2rem] shadow-ambient ghost-border p-6 md:p-10 min-h-[500px]">
          {activeTab === "profile" && (
            <div className={FADE_IN_UP}>
              <h2 className="text-2xl font-bold font-headline text-on-background mb-8">ข้อมูลส่วนตัว</h2>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 p-6 bg-surface-container-low rounded-2xl border border-outline-variant/15">
                <div className="relative">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-4xl font-bold border-4 border-white shadow-sm shrink-0">
                    {userName.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2.5 bg-surface-container-lowest rounded-full border border-outline-variant/20 shadow-sm hover:bg-surface-container-low text-on-surface-variant transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center sm:text-left w-full">
                  <h3 className="font-bold text-lg text-on-background">รูปโปรไฟล์ผู้ดูแล</h3>
                  <p className="text-sm text-on-surface-variant mt-1 mb-3">ไฟล์ JPG, GIF หรือ PNG ขนาดไม่เกิน 5MB เพื่อใช้ยืนยันตัวตนกับผู้ป่วย</p>
                  <button className="text-sm font-bold bg-surface-container-lowest border border-outline-variant/20 text-primary px-4 py-2 rounded-xl hover:bg-surface-container-low transition-colors shadow-sm">
                    อัปโหลดรูปใหม่
                  </button>
                </div>
              </div>

              {/* Rating summary — แสดงเฉพาะ Supabase caregivers ที่มีข้อมูลใน caregiver_profiles */}
              {myRating !== null && myReviews !== null && (
                <div className="flex items-center gap-5 p-5 bg-surface-container-low rounded-2xl border border-outline-variant/15 mb-8">
                  <div className="w-14 h-14 bg-[#FBBF24]/15 rounded-2xl flex items-center justify-center shrink-0">
                    <Star className={`w-7 h-7 ${myReviews > 0 ? "fill-[#FBBF24] text-[#FBBF24]" : "text-outline-variant"}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-on-surface-variant mb-1">คะแนนเฉลี่ยจากผู้ป่วย</p>
                    {myReviews === 0 ? (
                      <p className="text-sm text-on-surface-variant">ยังไม่มีการให้คะแนน</p>
                    ) : (
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-extrabold text-on-background">{myRating.toFixed(2)}</span>
                        <span className="text-sm text-on-surface-variant mb-1">/ 5.00 • จาก {myReviews} คน</span>
                      </div>
                    )}
                  </div>
                  {myReviews > 0 && (
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star
                          key={s}
                          className={`w-5 h-5 ${s <= Math.round(myRating) ? "fill-[#FBBF24] text-[#FBBF24]" : "text-outline-variant"}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="ชื่อ" value={firstNameInput} onChange={e => setFirstNameInput(e.target.value)} />
                  <FormInput label="นามสกุล" value={lastNameInput} onChange={e => setLastNameInput(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="เบอร์โทรศัพท์" type="tel" value={userPhone} readOnly placeholder="เบอร์โทรศัพท์" />
                  <FormInput label="อีเมล" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="อีเมล (ไม่บังคับ)" />
                </div>
                <div className="space-y-2">
                  <label className="text-base font-bold text-on-surface flex items-center gap-2">
                    <BriefcaseMedical className="w-5 h-5 text-primary" />
                    ใบอนุญาตประกอบวิชาชีพ
                  </label>
                  <FormInput label="" defaultValue="พย. 12345678" disabled />
                </div>

                <div className="pt-6 mt-8 border-t border-outline-variant/15 flex justify-end">
                  <button type="button" onClick={handleSave} className="flex items-center gap-2 px-8 py-4 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-dim transition-colors shadow-md active:scale-95 text-lg">
                    <Save className="w-5 h-5" />
                    {saved ? "บันทึกแล้ว ✓" : "บันทึกข้อมูล"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "payout" && (
            <div className={FADE_IN_UP}>
              <h2 className="text-2xl font-bold font-headline text-on-background mb-8">บัญชีรับเงิน</h2>

              <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-surface-container-lowest rounded-full flex items-center justify-center shrink-0 border border-outline-variant/20 shadow-sm">
                      <img src="https://upload.wikimedia.org/wikipedia/th/thumb/f/f7/KBank_Logo.svg/1200px-KBank_Logo.svg.png" alt="KBank" className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-on-background">ธนาคารกสิกรไทย</h3>
                      <p className="text-on-surface-variant font-medium tracking-widest mt-1">XXX-X-XX123-4</p>
                      <p className="text-sm text-on-surface-variant mt-1">ชื่อบัญชี: น.ส. สมศรี ใจสู้</p>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">ใช้งานอยู่</span>
                </div>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-base font-bold text-on-surface">เปลี่ยนบัญชีธนาคาร</label>
                  {/* appearance-none removes the native arrow so it looks consistent cross-browser. */}
                  <select className={`${INPUT_CLS} appearance-none`}>
                    <option>ธนาคารกสิกรไทย</option>
                    <option>ธนาคารไทยพาณิชย์</option>
                    <option>ธนาคารกรุงเทพ</option>
                    <option>ธนาคารกรุงไทย</option>
                  </select>
                </div>
                <FormInput label="หมายเลขบัญชีใหม่" placeholder="กรอกหมายเลขบัญชี 10 หลัก" />

                <div className="pt-6 mt-8 border-t border-outline-variant/15 flex justify-end">
                  <button type="button" className="flex items-center gap-2 px-8 py-4 bg-primary-dim text-on-primary font-bold rounded-xl hover:bg-primary transition-colors shadow-md active:scale-95 text-lg">
                    <Save className="w-5 h-5" />
                    อัปเดตบัญชีรับเงิน
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className={FADE_IN_UP}>
              <h2 className="text-2xl font-bold font-headline text-on-background mb-8">การแจ้งเตือน</h2>
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
              <h2 className="text-2xl font-bold font-headline text-on-background mb-8">รหัสผ่านและความปลอดภัย</h2>
              <form className="space-y-6">
                <FormInput label="รหัสผ่านปัจจุบัน" type="password" placeholder="••••••••" />
                <div className="border-t border-outline-variant/15 my-6"></div>
                <FormInput label="รหัสผ่านใหม่" type="password" placeholder="••••••••" />
                <FormInput label="ยืนยันรหัสผ่านใหม่" type="password" placeholder="••••••••" />

                <div className="pt-6 mt-8 border-t border-outline-variant/15 flex justify-end">
                  <button type="button" className="flex items-center gap-2 px-8 py-4 bg-primary-dim text-on-primary font-bold rounded-xl hover:bg-primary transition-colors shadow-md active:scale-95 text-lg">
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
