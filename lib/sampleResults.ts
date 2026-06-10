// TODO: Replace hardcoded result sets with real Gemini blood analysis.
// Each SAMPLE_* key maps to a fixed result — remove this file when
// /api/analyze-blood returns live AI output instead.

// BloodValue.status drives color-coding in the UI via getValueStyle() in ai-planner/page.tsx.
export type BloodValue = {
  value: string;
  unit: string;
  // "high" | "normal" | "low" is the API contract; the Thai `label` is display-only.
  status: "high" | "normal" | "low";
  // Thai copy kept here so the UI never hard-codes condition labels.
  label: string;
};

export type MealItem = {
  title: string;
  note: string;
};

// SampleResult is the exact shape returned by /api/analyze-blood and consumed by the ai-planner page.
export type SampleResult = {
  sampleId: string;
  bloodValues: {
    potassium: BloodValue;
    sodium: BloodValue;
    phosphorus: BloodValue;
  };
  meals: {
    breakfast: MealItem;
    lunch: MealItem;
    dinner: MealItem;
  };
  // Personalised dietary warning string rendered verbatim in the red alert box.
  warning: string;
};

export const SAMPLE_RESULTS: Record<string, SampleResult> = {
  // SAMPLE_001: hyperkalemia — most common risk in dialysis patients; also used as the QR-unreadable fallback.
  SAMPLE_001: {
    sampleId: "SAMPLE_001",
    bloodValues: {
      potassium: { value: "5.8", unit: "mEq/L", status: "high", label: "ค่อนข้างสูง" },
      sodium: { value: "138", unit: "mEq/L", status: "normal", label: "ปกติ" },
      phosphorus: { value: "3.9", unit: "mg/dL", status: "normal", label: "ปกติ" },
    },
    meals: {
      breakfast: {
        title: "โจ๊กข้าวขาว ใส่ไข่ขาวล้วน",
        note: "ลดโพแทสเซียมโดยการเลี่ยงผักใบเขียว",
      },
      lunch: {
        title: "เส้นหมี่น้ำใสอกไก่ ไม่ซดน้ำซุป",
        note: "จำกัดโซเดียม และควบคุมฟอสฟอรัสจากอกไก่",
      },
      dinner: {
        title: "ข้าวสวย ปลาทูย่าง",
        note: "ใช้ปลาสดเลี่ยงสารกันบูด และเน้นข้าวขาวแทนข้าวกล้อง",
      },
    },
    warning:
      'เนื่องจากค่าโพแทสเซียมของคุณสูง แนะนำให้ "งด" ผลไม้สีเข้ม เช่น ทุเรียน ขนุน หรือกล้วย ในช่วง 3 วันนี้ และแนะนำให้ลวกผักในน้ำร้อนก่อนปรุงอาหารทุกครั้ง',
  },
  // SAMPLE_002: hyperphosphatemia — elevated phosphorus triggers a stricter dairy/legume restriction.
  SAMPLE_002: {
    sampleId: "SAMPLE_002",
    bloodValues: {
      potassium: { value: "4.2", unit: "mEq/L", status: "normal", label: "ปกติ" },
      sodium: { value: "136", unit: "mEq/L", status: "normal", label: "ปกติ" },
      phosphorus: { value: "6.1", unit: "mg/dL", status: "high", label: "สูงมาก" },
    },
    meals: {
      breakfast: {
        title: "ข้าวต้มปลาขาว ไม่ใส่ผัก",
        note: "หลีกเลี่ยงนม ชีส และอาหารแปรรูปที่มีฟอสฟอรัสสูง",
      },
      lunch: {
        title: "ก๋วยเตี๋ยวหมูน้ำใส ไม่ใส่เครื่องใน",
        note: "งดถั่วและธัญพืชทุกชนิด",
      },
      dinner: {
        title: "ข้าวสวย ไข่ต้มสุก ผักลวก",
        note: "เน้นผักที่มีฟอสฟอรัสต่ำ เช่น กะหล่ำปลี แตงกวา",
      },
    },
    warning:
      "ค่าฟอสฟอรัสสูงมาก ห้ามรับประทานนม โยเกิร์ต ชีส ถั่ว งา และอาหารแปรรูปทุกชนิด ควรปรึกษาแพทย์ก่อนปรับอาหาร",
  },
  // SAMPLE_003: well-controlled patient — all values normal, demonstrates the "all-clear" UI state.
  SAMPLE_003: {
    sampleId: "SAMPLE_003",
    bloodValues: {
      potassium: { value: "4.0", unit: "mEq/L", status: "normal", label: "ปกติ" },
      sodium: { value: "137", unit: "mEq/L", status: "normal", label: "ปกติ" },
      phosphorus: { value: "3.5", unit: "mg/dL", status: "normal", label: "ปกติ" },
    },
    meals: {
      breakfast: {
        title: "ข้าวต้มหมูสับ ใส่ผักชี",
        note: "ค่าเลือดสมดุล สามารถรับประทานได้ตามปกติในขนาดที่เหมาะสม",
      },
      lunch: {
        title: "ข้าวสวย แกงจืดเต้าหู้หมูสับ",
        note: "เน้นโปรตีนคุณภาพดีในปริมาณที่พอดี",
      },
      dinner: {
        title: "ข้าวสวย ปลานึ่งมะนาว ผัดผัก",
        note: "ดีต่อสุขภาพไต หลีกเลี่ยงเครื่องปรุงโซเดียมสูง",
      },
    },
    warning:
      "ค่าเลือดทุกตัวอยู่ในเกณฑ์ดี แต่ยังคงต้องรักษาอาหารไตวายอย่างต่อเนื่อง ดื่มน้ำตามที่แพทย์แนะนำ",
  },
};
