// Centralized mock data for demo and development.

export type CaregiverTier = "พยาบาลวิชาชีพ" | "ผช.พยาบาล" | "ผู้ดูแลผ่านการอบรม";

export function getCaregiverTier(name: string, certifications?: string[]): CaregiverTier {
  if (name.includes("พยาบาลวิชาชีพ")) return "พยาบาลวิชาชีพ";
  if (name.includes("ผู้ช่วยพยาบาล")) return "ผช.พยาบาล";
  const certs = certifications ?? [];
  if (certs.some((c) => c.includes("พยาบาลวิชาชีพ"))) return "พยาบาลวิชาชีพ";
  if (certs.some((c) => c.includes("ผู้ช่วยพยาบาล") || c.includes("ผช."))) return "ผช.พยาบาล";
  return "ผู้ดูแลผ่านการอบรม";
}

export type CaregiverCard = {
  name: string;
  rating: number;
  reviews: number;
  exp: string;
  location: string;
  rate: string;
  tags: string[];
};

export const MOCK_CAREGIVERS: CaregiverCard[] = [
  {
    name: "สมศรี ใจดี (พยาบาลวิชาชีพ)",
    rating: 4.9,
    reviews: 124,
    exp: "เชี่ยวชาญการดูแลผู้ป่วยฟอกไต 5 ปี",
    location: "เขตบางกอกน้อย (ใกล้ รพ. ศิริราช)",
    rate: "350 บาท/ชม.",
    tags: ["ฉีดยาเบื้องต้นได้", "ขับรถยนต์ส่วนตัว"],
  },
  {
    name: "วิภา รักษ์สุขภาพ (ผู้ช่วยพยาบาล)",
    rating: 4.8,
    reviews: 89,
    exp: "ประสบการณ์ดูแลผู้สูงอายุติดเตียง 3 ปี",
    location: "เขตดุสิต (ใกล้ รพ. วชิรพยาบาล)",
    rate: "250 บาท/ชม.",
    tags: ["ดูแลให้อาหารทางสายยาง", "ใจเย็น"],
  },
  {
    name: "ธนา มีสุข (พยาบาลวิชาชีพ)",
    rating: 5.0,
    reviews: 210,
    exp: "อดีตพยาบาลศูนย์ไตเทียม 8 ปี",
    location: "เขตพญาไท (ใกล้ รพ. รามาธิบดี)",
    rate: "400 บาท/ชม.",
    tags: ["วิเคราะห์ผลงดน้ำ", "เชี่ยวชาญไตวายเรื้อรัง"],
  },
  {
    name: "มาลี ศรีเมือง (ผู้ดูแลผ่านการอบรม)",
    rating: 4.7,
    reviews: 45,
    exp: "ผ่านการอบรมดูแลผู้ป่วยโรคไต (120 ชม.)",
    location: "เขตภาษีเจริญ (ใกล้ รพ. ธนบุรี 2)",
    rate: "200 บาท/ชม.",
    tags: ["ทำอาหารคุมเค็ม", "ช่วยพยุงเดิน"],
  },
  {
    name: "กานดา สุขสบาย (พยาบาลวิชาชีพ)",
    rating: 4.8,
    reviews: 67,
    exp: "เชี่ยวชาญดูแลผู้ป่วยโรคไตเรื้อรัง 4 ปี",
    location: "เขตปทุมวัน (ใกล้ รพ. จุฬาลงกรณ์)",
    rate: "380 บาท/ชม.",
    tags: ["ดูแลการฉีดอินซูลิน", "ช่วยออกกำลังกายเบา"],
  },
  {
    name: "สุนีย์ รุ่งเรือง (ผู้ช่วยพยาบาล)",
    rating: 4.6,
    reviews: 33,
    exp: "ดูแลผู้ป่วยสูงอายุ 2 ปี ใส่ใจทุกรายละเอียด",
    location: "เขตดุสิต (ใกล้ รพ. วชิรพยาบาล)",
    rate: "280 บาท/ชม.",
    tags: ["ขับรถยนต์ส่วนตัว", "พูดภาษาอังกฤษได้"],
  },
  {
    name: "อรอุมา ทิพย์สุข (ผู้ดูแลผ่านการอบรม)",
    rating: 4.9,
    reviews: 102,
    exp: "ผ่านการอบรมการดูแลผู้ป่วยไต (200 ชม.)",
    location: "เขตพญาไท (ใกล้ รพ. รามาธิบดี)",
    rate: "320 บาท/ชม.",
    tags: ["วัดความดันได้", "ดูแลสายน้ำเกลือ"],
  },
  {
    name: "พิมพ์ใจ ดีงาม (พยาบาลวิชาชีพ)",
    rating: 4.7,
    reviews: 78,
    exp: "ทำงานด้านการฟอกเลือด 6 ปี",
    location: "เขตบางกอกน้อย (ใกล้ รพ. ศิริราช)",
    rate: "360 บาท/ชม.",
    tags: ["เชี่ยวชาญไตเทียม", "ฉีดยาเบื้องต้นได้"],
  },
  {
    name: "วรรณา จิตใจดี (ผู้ช่วยพยาบาล)",
    rating: 4.5,
    reviews: 29,
    exp: "ช่วยดูแลผู้ป่วยสูงอายุ 1.5 ปี",
    location: "เขตภาษีเจริญ (ใกล้ รพ. ธนบุรี 2)",
    rate: "240 บาท/ชม.",
    tags: ["ทำอาหารควบคุมโรคไต", "พาออกไปนอกบ้านได้"],
  },
  {
    name: "ประภา สมานใจ (พยาบาลวิชาชีพ)",
    rating: 5.0,
    reviews: 156,
    exp: "อดีตพยาบาลหน่วยไตเทียม 10 ปี",
    location: "เขตบางรัก (ใกล้ รพ. จุฬาลงกรณ์)",
    rate: "450 บาท/ชม.",
    tags: ["เชี่ยวชาญสูง", "วิเคราะห์ค่าเลือดได้", "ขับรถยนต์ส่วนตัว"],
  },
];

// Sample transactions shown to demo/dev users who have no real booking history.
export const MOCK_PATIENT_TRANSACTIONS = [
  {
    id: "mock-001",
    caregiverName: "สมศรี ใจดี (พยาบาลวิชาชีพ)",
    destination: "โรงพยาบาลศิริราช (ศูนย์ไตเทียม)",
    date: "วันจันทร์ที่ 16 มิถุนายน 2569",
    timeSlot: "08:00 - 12:00 น.",
    basePay: 1400,
    platformFee: 210,
    discount: 200,
    totalPaid: 1410,
    bookedAt: "2026-06-16T05:00:00.000Z",
  },
  {
    id: "mock-002",
    caregiverName: "ธนา มีสุข (พยาบาลวิชาชีพ)",
    destination: "โรงพยาบาลรามาธิบดี",
    date: "วันพุธที่ 11 มิถุนายน 2569",
    timeSlot: "09:00 - 13:00 น.",
    basePay: 1600,
    platformFee: 240,
    discount: 0,
    totalPaid: 1840,
    bookedAt: "2026-06-11T06:00:00.000Z",
  },
  {
    id: "mock-003",
    caregiverName: "วิภา รักษ์สุขภาพ (ผู้ช่วยพยาบาล)",
    destination: "โรงพยาบาลวชิรพยาบาล",
    date: "วันศุกร์ที่ 6 มิถุนายน 2569",
    timeSlot: "12:00 - 16:00 น.",
    basePay: 1000,
    platformFee: 150,
    discount: 0,
    totalPaid: 1150,
    bookedAt: "2026-06-06T09:00:00.000Z",
  },
  {
    id: "mock-004",
    caregiverName: "สมศรี ใจดี (พยาบาลวิชาชีพ)",
    destination: "โรงพยาบาลศิริราช (ศูนย์ไตเทียม)",
    date: "วันจันทร์ที่ 2 มิถุนายน 2569",
    timeSlot: "08:00 - 12:00 น.",
    basePay: 1400,
    platformFee: 210,
    discount: 0,
    totalPaid: 1610,
    bookedAt: "2026-06-02T05:00:00.000Z",
  },
  {
    id: "mock-005",
    caregiverName: "กานดา สุขสบาย (พยาบาลวิชาชีพ)",
    destination: "โรงพยาบาลจุฬาลงกรณ์",
    date: "วันพุธที่ 28 พฤษภาคม 2569",
    timeSlot: "13:00 - 17:00 น.",
    basePay: 1520,
    platformFee: 228,
    discount: 0,
    totalPaid: 1748,
    bookedAt: "2026-05-28T10:00:00.000Z",
  },
  {
    id: "mock-006",
    caregiverName: "ธนา มีสุข (พยาบาลวิชาชีพ)",
    destination: "โรงพยาบาลรามาธิบดี",
    date: "วันศุกร์ที่ 23 พฤษภาคม 2569",
    timeSlot: "08:00 - 12:00 น.",
    basePay: 1600,
    platformFee: 240,
    discount: 0,
    totalPaid: 1840,
    bookedAt: "2026-05-23T05:00:00.000Z",
  },
  {
    id: "mock-007",
    caregiverName: "มาลี ศรีเมือง (ผู้ดูแลผ่านการอบรม)",
    destination: "โรงพยาบาลธนบุรี 2",
    date: "วันจันทร์ที่ 19 พฤษภาคม 2569",
    timeSlot: "12:00 - 16:00 น.",
    basePay: 800,
    platformFee: 120,
    discount: 0,
    totalPaid: 920,
    bookedAt: "2026-05-19T09:00:00.000Z",
  },
  {
    id: "mock-008",
    caregiverName: "อรอุมา ทิพย์สุข (ผู้ดูแลผ่านการอบรม)",
    destination: "โรงพยาบาลรามาธิบดี",
    date: "วันพุธที่ 14 พฤษภาคม 2569",
    timeSlot: "09:00 - 13:00 น.",
    basePay: 1280,
    platformFee: 192,
    discount: 0,
    totalPaid: 1472,
    bookedAt: "2026-05-14T06:00:00.000Z",
  },
  {
    id: "mock-009",
    caregiverName: "สมศรี ใจดี (พยาบาลวิชาชีพ)",
    destination: "โรงพยาบาลศิริราช (ศูนย์ไตเทียม)",
    date: "วันศุกร์ที่ 25 เมษายน 2569",
    timeSlot: "08:00 - 12:00 น.",
    basePay: 1400,
    platformFee: 210,
    discount: 0,
    totalPaid: 1610,
    bookedAt: "2026-04-25T05:00:00.000Z",
  },
  {
    id: "mock-010",
    caregiverName: "ประภา สมานใจ (พยาบาลวิชาชีพ)",
    destination: "โรงพยาบาลจุฬาลงกรณ์",
    date: "วันจันทร์ที่ 21 เมษายน 2569",
    timeSlot: "13:00 - 17:00 น.",
    basePay: 1800,
    platformFee: 270,
    discount: 200,
    totalPaid: 1870,
    bookedAt: "2026-04-21T10:00:00.000Z",
  },
];
