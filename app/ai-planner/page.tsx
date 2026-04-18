"use client";

import { useState } from "react";

import { Apple, Upload, Loader2, CheckCircle2, FileText, Soup, Coffee, Moon, AlertCircle } from "lucide-react";

import Navbar from "@/components/layout/Navbar";



export default function AIPlannerPage() {

  const [status, setStatus] = useState<"idle" | "analyzing" | "success">("idle");

  const [preview, setPreview] = useState<string | null>(null);



  // จำลองการวิเคราะห์ภาพ

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];

    if (file) {

      setPreview(URL.createObjectURL(file));

      setStatus("analyzing");



      // จำลองเวลาประมวลผล 3 วินาที

      setTimeout(() => {

        setStatus("success");

      }, 3000);

    }

  };

  const [analysisResult, setAnalysisResult] = useState<any>(null);



  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];

    if (!file) return;



    setPreview(URL.createObjectURL(file));

    setStatus("analyzing");



    try {

      // แปลงไฟล์ภาพเป็น Base64

      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = async () => {

        const base64 = (reader.result as string).split(",")[1];



        // ส่งไปวิเคราะห์ที่ API

        const res = await fetch("/api/analyze-blood", {

          method: "POST",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({ imageBase64: base64 }),

        });



        const data = await res.json();



        if (data.error) throw new Error(data.error);



        setAnalysisResult(data);

        setStatus("success");

      };

    } catch (error) {

      alert("เกิดข้อผิดพลาดในการวิเคราะห์ กรุณาลองใหม่อีกครั้ง");

      setStatus("idle");

    }

  };



  return (

    <>

      <Navbar />

      <div className="bg-slate-50 min-h-[calc(100vh-80px)] pt-12 pb-24 font-sans">

        <div className="max-w-4xl mx-auto px-6">



          {/* Header Section */}

          <div className="text-center mb-12">

            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-200">

              <Apple className="h-10 w-10" />

            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">AI โภชนาการโรคไต</h1>

            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">

              สแกนผลเลือดเพื่อวิเคราะห์ค่าแร่ธาตุ และรับตารางอาหารที่ออกแบบมาเพื่อคุณโดยเฉพาะ

            </p>

          </div>



          <div className="grid gap-8">



            {/* Step 1: Upload Area */}

            {status === "idle" && (

              <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border-2 border-dashed border-slate-200 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">

                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">

                  <Upload className="w-10 h-10 text-slate-400" />

                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">อัพโหลดใบตรวจเลือด</h3>

                <p className="text-slate-500 mb-8 max-w-md text-base">รองรับไฟล์ JPG, PNG หรือ PDF (กรุณาให้ข้อมูลชัดเจน เพื่อการวิเคราะห์ที่แม่นยำ)</p>

                <label className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all cursor-pointer active:scale-95 text-lg">

                  เลือกรูปภาพหรือไฟล์

                  <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />

                </label>

              </div>

            )}



            {/* Step 2: Analyzing Area */}

            {status === "analyzing" && (

              <div className="bg-white p-16 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center animate-in fade-in duration-500">

                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />

                <h3 className="text-2xl font-bold text-slate-900 mb-2">กำลังวิเคราะห์ข้อมูล...</h3>

                <p className="text-slate-500">AI กำลังอ่านค่าสารอาหารและประมวลผลความเสี่ยง</p>

                {preview && (

                  <div className="mt-8 relative w-40 h-52 border border-slate-200 rounded-xl overflow-hidden opacity-50">

                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />

                  </div>

                )}

              </div>

            )}



            {/* Step 3: Success & Result Area */}

            {status === "success" && (

              <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">



                {/* Analysis Dashboard */}

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">

                  <div className="flex items-center gap-3 mb-8">

                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />

                    <h3 className="text-2xl font-bold text-slate-900">สรุปการวิเคราะห์ผลเลือด</h3>

                  </div>



                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="p-5 rounded-2xl bg-orange-50 border border-orange-100">

                      <p className="text-orange-600 text-sm font-bold mb-1">โพแทสเซียม (Potassium)</p>

                      <p className="text-3xl font-black text-orange-700">5.2 <span className="text-lg font-bold">mEq/L</span></p>

                      <span className="text-xs font-bold bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full mt-2 inline-block">ค่อนข้างสูง</span>

                    </div>

                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">

                      <p className="text-emerald-600 text-sm font-bold mb-1">โซเดียม (Sodium)</p>

                      <p className="text-3xl font-black text-emerald-700">138 <span className="text-lg font-bold">mEq/L</span></p>

                      <span className="text-xs font-bold bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full mt-2 inline-block">ปกติ</span>

                    </div>

                    <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">

                      <p className="text-blue-600 text-sm font-bold mb-1">ฟอสฟอรัส (Phosphorus)</p>

                      <p className="text-3xl font-black text-blue-700">3.8 <span className="text-lg font-bold">mg/dL</span></p>

                      <span className="text-xs font-bold bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full mt-2 inline-block">ปกติ</span>

                    </div>

                  </div>

                </div>



                {/* Personalized Meal Plan */}

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">

                  <div className="flex items-center justify-between mb-8">

                    <div className="flex items-center gap-3">

                      <FileText className="w-8 h-8 text-blue-600" />

                      <h3 className="text-2xl font-bold text-slate-900">ตารางอาหารที่ AI แนะนำวันนี้</h3>

                    </div>

                    <button onClick={() => setStatus("idle")} className="text-sm font-bold text-blue-600 hover:underline">วิเคราะห์ใหม่</button>

                  </div>



                  <div className="space-y-4">

                    {/* Breakfast */}

                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100">

                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">

                        <Coffee className="w-8 h-8" />

                      </div>

                      <div className="flex-1">

                        <p className="text-sm font-bold text-slate-400">มื้อเช้า (07:00 - 08:30)</p>

                        <h4 className="text-lg font-bold text-slate-800">โจ๊กข้าวขาว ใส่ไข่ขาวล้วน</h4>

                        <p className="text-sm text-slate-500">ลดโพแทสเซียมโดยการเลี่ยงผักใบเขียว</p>

                      </div>

                    </div>



                    {/* Lunch */}

                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100">

                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">

                        <Soup className="w-8 h-8" />

                      </div>

                      <div className="flex-1">

                        <p className="text-sm font-bold text-slate-400">มื้อเที่ยง (12:00 - 13:00)</p>

                        <h4 className="text-lg font-bold text-slate-800">เส้นหมี่น้ำใสอกไก่ ไม่ซดน้ำซุป</h4>

                        <p className="text-sm text-slate-500">จำกัดโซเดียม และควบคุมฟอสฟอรัสจากอกไก่</p>

                      </div>

                    </div>



                    {/* Dinner */}

                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100">

                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-purple-500 shadow-sm">

                        <Moon className="w-8 h-8" />

                      </div>

                      <div className="flex-1">

                        <p className="text-sm font-bold text-slate-400">มื้อเย็น (18:00 - 19:00)</p>

                        <h4 className="text-lg font-bold text-slate-800">ข้าวสวย ขยำปลาทูย่าง</h4>

                        <p className="text-sm text-slate-500">ใช้ปลาสดเลี่ยงสารกันบูด และเน้นข้าวขาวแทนข้าวกล้อง</p>

                      </div>

                    </div>

                  </div>



                  <div className="mt-8 flex items-start gap-3 p-5 rounded-2xl bg-red-50 text-red-700">

                    <AlertCircle className="w-6 h-6 shrink-0" />

                    <p className="text-sm leading-relaxed">

                      <strong>หมายเหตุจาก AI:</strong> เนื่องจากค่าโพแทสเซียมของคุณค่อนข้างสูง แนะนำให้ <strong>"งด"</strong> ผลไม้สีเข้ม เช่น ทุเรียน ขนุน หรือกล้วย ในช่วง 3 วันนี้ และแนะนำให้ลวกผักในน้ำร้อนก่อนปรุงอาหารทุกครั้ง

                    </p>

                  </div>

                </div>



              </div>

            )}



          </div>

        </div>

      </div>

    </>

  );

}