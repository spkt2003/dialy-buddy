"use client";
import Link from "next/link";
import { ArrowLeft, Stethoscope, User, Phone, Lock, CreditCard, MapPin, AlertCircle, CheckCircle2, X, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

function toThaiRegisterError(message: string): string {
  if (message.includes("already registered") || message.includes("already been registered")) {
    return "เบอร์โทรศัพท์นี้มีบัญชีอยู่แล้ว กรุณาเข้าสู่ระบบแทน";
  }
  if (message.includes("Password should be at least")) {
    return "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
  }
  if (message.includes("rate limit") || message.includes("too many requests")) {
    return "พยายามบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่";
  }
  if (message.includes("disabled") || message.includes("not allowed") || message.includes("signup_disabled")) {
    return "ระบบลงทะเบียนปิดชั่วคราว กรุณาลองใหม่ในภายหลัง";
  }
  return "ไม่สามารถสร้างบัญชีได้ กรุณาตรวจสอบข้อมูลแล้วลองใหม่อีกครั้ง";
}

const PATIENT_RELATIONS = [
  "ผู้ป่วยเอง",
  "บุตร / ลูก",
  "คู่สมรส",
  "บิดา / มารดา",
  "พี่น้อง",
  "หลาน",
  "ผู้ดูแล (ไม่ใช่เจ้าหน้าที่)",
];

const SERVICE_AREAS = [
  "เขตบางกอกน้อย", "เขตบางกอกใหญ่", "เขตดุสิต", "เขตพระนคร",
  "เขตพญาไท", "เขตราชเทวี", "เขตปทุมวัน", "เขตบึงกุ่ม",
  "เขตลาดพร้าว", "เขตจตุจักร", "เขตบางซื่อ", "เขตดอนเมือง",
  "เขตหลักสี่", "เขตสาทร", "เขตบางรัก", "เขตสัมพันธวงศ์",
  "เขตป้อมปราบศัตรูพ่าย", "เขตภาษีเจริญ", "เขตธนบุรี",
  "เขตคลองสาน", "เขตตลิ่งชัน", "เขตทวีวัฒนา", "เขตหนองแขม",
  "เขตบางแค", "เขตราษฎร์บูรณะ", "เขตทุ่งครุ", "เขตพระโขนง",
  "เขตบางนา", "เขตประเวศ", "เขตลาดกระบัง", "เขตมีนบุรี",
  "เขตสะพานสูง", "เขตคันนายาว", "เขตห้วยขวาง", "เขตวังทองหลาง",
];

const CERT_OPTIONS = [
  "ฉีดยาเบื้องต้นได้",
  "ขับรถยนต์ส่วนตัว",
  "ดูแลให้อาหารทางสายยาง",
  "วิเคราะห์ผลงดน้ำ",
  "เชี่ยวชาญไตวายเรื้อรัง",
  "ทำอาหารคุมเค็ม",
  "ช่วยพยุงเดิน",
  "ผ่านการอบรม CPR",
  "ใบอนุญาตพยาบาลวิชาชีพ",
  "ใจเย็น / ดูแลผู้สูงอายุ",
];

export default function RegisterPage() {
  const [role, setRole] = useState<"patient" | "buddy">("patient");

  // Common
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Patient-only
  const [relation, setRelation] = useState("");

  // Caregiver-only
  const [idCard, setIdCard] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);

  const [registerError, setRegisterError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(false);
  const [pdpaAccepted, setPdpaAccepted] = useState(false);
  const [showPdpa, setShowPdpa] = useState(false);

  const router = useRouter();
  const { isLoggedIn, role: authRole } = useAuth();

  useEffect(() => {
    if (pendingRedirect && isLoggedIn) {
      setPendingRedirect(false);
      router.push(authRole === "caregiver" ? "/caregiver/dashboard" : "/find-buddy");
    }
  }, [pendingRedirect, isLoggedIn, authRole, router]);

  const toggleCert = (cert: string) => {
    setCertifications((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]
    );
  };

  const switchRole = (r: "patient" | "buddy") => {
    setRole(r);
    setRelation("");
    setIdCard("");
    setServiceArea("");
    setCertifications([]);
    setRegisterError("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");

    if (role === "buddy" && idCard.replace(/\D/g, "").length !== 13) {
      setRegisterError("เลขบัตรประชาชนต้องมี 13 หลัก");
      return;
    }

    setIsSubmitting(true);
    const mappedRole = role === "buddy" ? "caregiver" : "patient";

    const metadata =
      role === "patient"
        ? { role: mappedRole, userName: name, relation, pdpaConsented: true, pdpaConsentedAt: new Date().toISOString() }
        : { role: mappedRole, userName: name, serviceArea, certifications, pdpaConsented: true, pdpaConsentedAt: new Date().toISOString() };

    const { data, error } = await supabase.auth.signUp({
      email: `${phone}@dialybuddy.local`,
      password,
      options: { data: metadata },
    });

    setIsSubmitting(false);

    if (error) {
      setRegisterError(toThaiRegisterError(error.message));
      return;
    }

    // Write caregiver profile to public table so find-buddy can query it
    if (role === "buddy" && data.user) {
      await supabase.from("caregiver_profiles").insert({
        id: data.user.id,
        name,
        service_area: serviceArea,
        certifications,
      });
      // ignore insert error — auth account was already created successfully
    }

    setPendingRedirect(true);
  };

  const inputClass =
    "w-full bg-surface-container-high border-none rounded-xl py-4 pl-12 pr-4 text-on-surface font-body focus:ring-2 focus:ring-primary/50 focus:outline-none text-base";

  const selectClass =
    "w-full bg-surface-container-high border-none rounded-xl py-4 pl-12 pr-4 text-on-surface font-body focus:ring-2 focus:ring-primary/50 focus:outline-none text-base appearance-none";

  return (
    <>
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-[2rem] shadow-ambient ghost-border border border-outline-variant/20 p-8">

        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2 mx-auto pr-8">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold font-headline text-primary">Dialybuddy</span>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold font-headline mb-2 text-on-background">เข้าร่วมเป็นส่วนหนึ่งกับเรา</h1>
        <p className="text-on-surface-variant font-body mb-6 text-lg">สร้างบัญชีผู้ใช้งานเพื่อเริ่มต้นใช้งานแพลตฟอร์ม</p>

        {/* Role toggle */}
        <div className="flex bg-surface-container-high rounded-xl p-1 mb-8 shadow-inner">
          <button type="button" onClick={() => switchRole("patient")}
            className={`flex-1 py-3 text-base font-bold font-label rounded-lg transition-colors ${role === "patient" ? "bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/20" : "text-on-surface-variant hover:text-on-surface"}`}>
            ผู้ป่วย / ญาติ
          </button>
          <button type="button" onClick={() => switchRole("buddy")}
            className={`flex-1 py-3 text-base font-bold font-label rounded-lg transition-colors ${role === "buddy" ? "bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/20" : "text-on-surface-variant hover:text-on-surface"}`}>
            ผู้ดูแล (Care Buddy)
          </button>
        </div>

        {registerError && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-error shrink-0" />
            <p className="text-sm text-error font-medium">{registerError}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">

          {/* ชื่อ-นามสกุล — ทั้งสอง role */}
          <div className="space-y-2">
            <label className="text-sm font-bold font-label text-on-surface block">ชื่อ-นามสกุล</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="ชื่อและนามสกุลจริง" required className={inputClass} />
            </div>
          </div>

          {/* Patient: ความสัมพันธ์ */}
          {role === "patient" && (
            <div className="space-y-2">
              <label className="text-sm font-bold font-label text-on-surface block">ความสัมพันธ์กับผู้ป่วย</label>
              <div className="relative">
                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
                <select value={relation} onChange={(e) => setRelation(e.target.value)} required className={selectClass}>
                  <option value="">เลือกความสัมพันธ์...</option>
                  {PATIENT_RELATIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Caregiver: เลขบัตรประชาชน */}
          {role === "buddy" && (
            <div className="space-y-2">
              <label className="text-sm font-bold font-label text-on-surface block">เลขบัตรประชาชน</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
                <input type="text" inputMode="numeric" maxLength={13} value={idCard}
                  onChange={(e) => setIdCard(e.target.value.replace(/\D/g, ""))}
                  placeholder="13 หลัก (ใช้ยืนยันตัวตน)" required className={inputClass} />
              </div>
              <p className="text-xs text-on-surface-variant pl-1">ข้อมูลนี้ใช้สำหรับตรวจสอบประวัติเท่านั้น และถูกเข้ารหัสอย่างปลอดภัย</p>
            </div>
          )}

          {/* Caregiver: เขตที่ให้บริการ */}
          {role === "buddy" && (
            <div className="space-y-2">
              <label className="text-sm font-bold font-label text-on-surface block">เขตที่ให้บริการหลัก</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
                <select value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} required className={selectClass}>
                  <option value="">เลือกเขต...</option>
                  {SERVICE_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Caregiver: ประสบการณ์/ใบรับรอง */}
          {role === "buddy" && (
            <div className="space-y-3">
              <label className="text-sm font-bold font-label text-on-surface block">
                ประสบการณ์ / ใบรับรอง
                <span className="ml-2 text-on-surface-variant font-normal">(เลือกได้หลายรายการ)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CERT_OPTIONS.map((cert) => {
                  const selected = certifications.includes(cert);
                  return (
                    <button key={cert} type="button" onClick={() => toggleCert(cert)}
                      className={`px-3 py-2 rounded-xl text-sm font-bold border transition-all ${
                        selected
                          ? "bg-primary text-on-primary border-primary shadow-sm"
                          : "bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:border-primary/40 hover:text-on-surface"
                      }`}>
                      {selected && <span className="mr-1">✓</span>}{cert}
                    </button>
                  );
                })}
              </div>
              {certifications.length === 0 && (
                <p className="text-xs text-on-surface-variant">ไม่เลือกก็ได้ หากยังไม่มีใบรับรอง</p>
              )}
            </div>
          )}

          {/* เบอร์โทรศัพท์ — ทั้งสอง role */}
          <div className="space-y-2">
            <label className="text-sm font-bold font-label text-on-surface block">เบอร์โทรศัพท์</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="ตัวอย่าง 0812345678" required className={inputClass} />
            </div>
            <p className="text-xs text-on-surface-variant pl-1">ใช้สำหรับเข้าสู่ระบบในภายหลัง</p>
          </div>

          {/* รหัสผ่าน — ทั้งสอง role */}
          <div className="space-y-2">
            <label className="text-sm font-bold font-label text-on-surface block">ตั้งรหัสผ่าน</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="อย่างน้อย 8 ตัวอักษร" required minLength={8} className={inputClass} />
            </div>
          </div>

          {/* PDPA Consent */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={pdpaAccepted}
              onChange={(e) => setPdpaAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 accent-primary shrink-0 cursor-pointer"
            />
            <span className="text-sm text-on-surface-variant font-body leading-relaxed">
              ฉันได้อ่านและยอมรับ{" "}
              <button
                type="button"
                onClick={() => setShowPdpa(true)}
                className="text-primary font-bold underline hover:no-underline"
              >
                นโยบายความเป็นส่วนตัว (PDPA)
              </button>{" "}
              และยินยอมให้แพลตฟอร์มประมวลผลข้อมูลส่วนบุคคลของฉัน
            </span>
          </label>

          <button type="submit" disabled={isSubmitting || !pdpaAccepted}
            className="w-full mt-2 flex items-center justify-center bg-primary text-on-primary font-bold font-label py-4 rounded-xl shadow-ambient hover:bg-primary-dim transition-colors text-lg disabled:opacity-60">
            {isSubmitting ? "กำลังสร้างบัญชี..." : "ลงทะเบียนใช้งาน"}
          </button>
        </form>

        <p className="text-center text-base font-body text-on-surface-variant mt-8">
          มีบัญชีผู้ใช้งานอยู่แล้ว? <Link href="/login" className="text-primary font-bold hover:underline">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>

    {/* PDPA Policy Modal */}
    {showPdpa && (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPdpa(false)} />
        <div className="relative z-10 w-full max-w-lg bg-surface-container-lowest rounded-[2rem] shadow-xl ghost-border overflow-hidden flex flex-col max-h-[85vh]">
          <div className="flex items-center justify-between px-8 pt-8 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-headline text-on-background">นโยบายความเป็นส่วนตัว</h2>
                <p className="text-xs text-on-surface-variant">ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) พ.ศ. 2562</p>
              </div>
            </div>
            <button onClick={() => setShowPdpa(false)} className="p-2 rounded-xl hover:bg-surface-container-low text-on-surface-variant transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-8 pb-4 overflow-y-auto text-sm text-on-surface font-body space-y-4 leading-relaxed">
            <p className="font-bold text-on-background">1. ผู้ควบคุมข้อมูลส่วนบุคคล</p>
            <p>Dialybuddy Platform ("แพลตฟอร์ม") ทำหน้าที่เป็นผู้ควบคุมข้อมูลส่วนบุคคลตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562</p>

            <p className="font-bold text-on-background">2. ข้อมูลส่วนบุคคลที่เก็บรวบรวม</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>ข้อมูลระบุตัวตน: ชื่อ-นามสกุล, เบอร์โทรศัพท์</li>
              <li>ข้อมูลสุขภาพ (ข้อมูลอ่อนไหว): ผลตรวจเลือดที่อัปโหลดผ่านระบบ AI โภชนาการ</li>
              <li>ข้อมูลการใช้งาน: ประวัติการจอง, บันทึกการสนทนา</li>
              <li>สำหรับผู้ดูแล: ใบรับรองวิชาชีพ, พื้นที่ให้บริการ</li>
            </ul>

            <p className="font-bold text-on-background">3. วัตถุประสงค์การใช้ข้อมูล</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>จับคู่ผู้ป่วยกับผู้ดูแลที่เหมาะสม</li>
              <li>วิเคราะห์และแนะนำแผนโภชนาการผ่าน AI</li>
              <li>ปรับปรุงคุณภาพบริการและประสบการณ์ผู้ใช้</li>
              <li>ออกใบเสร็จและเอกสารทางการเงิน</li>
            </ul>

            <p className="font-bold text-on-background">4. ฐานทางกฎหมายในการประมวลผล</p>
            <p>แพลตฟอร์มประมวลผลข้อมูลบนฐาน <strong>ความยินยอม (Consent)</strong> ของเจ้าของข้อมูล และ <strong>การปฏิบัติตามสัญญา</strong> เพื่อให้บริการได้อย่างสมบูรณ์</p>

            <p className="font-bold text-on-background">5. สิทธิ์ของเจ้าของข้อมูล</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>สิทธิ์เข้าถึงและรับสำเนาข้อมูล</li>
              <li>สิทธิ์แก้ไขข้อมูลให้ถูกต้อง</li>
              <li>สิทธิ์ลบข้อมูล (Right to Erasure)</li>
              <li>สิทธิ์คัดค้านการประมวลผล</li>
              <li>สิทธิ์ถอนความยินยอมเมื่อใดก็ได้</li>
            </ul>

            <p className="font-bold text-on-background">6. ระยะเวลาเก็บรักษาข้อมูล</p>
            <p>แพลตฟอร์มเก็บข้อมูลตลอดระยะเวลาที่ท่านใช้บริการ และเก็บต่ออีก 3 ปีหลังยกเลิกบัญชี เพื่อวัตถุประสงค์ทางกฎหมายและการเงิน</p>

            <p className="font-bold text-on-background">7. การติดต่อ</p>
            <p>หากมีข้อสงสัยหรือต้องการใช้สิทธิ์ ติดต่อเจ้าหน้าที่คุ้มครองข้อมูล (DPO) ได้ที่ privacy@dialybuddy.th</p>
          </div>

          <div className="px-8 py-5 border-t border-outline-variant/20 shrink-0 flex gap-3">
            <button
              onClick={() => { setPdpaAccepted(true); setShowPdpa(false); }}
              className="flex-1 bg-primary text-on-primary font-bold font-label py-3 rounded-xl hover:brightness-105 transition-colors"
            >
              รับทราบและยอมรับ
            </button>
            <button
              onClick={() => setShowPdpa(false)}
              className="px-5 bg-surface-container-high text-on-surface font-bold font-label py-3 rounded-xl hover:bg-surface-container transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
