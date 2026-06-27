# DialyBuddy — คู่มือ Setup สำหรับผู้รับช่วงต่อ

## ขั้นตอนที่ 1 — Clone & Install

```bash
git clone https://github.com/spkt2003/dialy-buddy.git
cd dialy-buddy
npm install
```

---

## ขั้นตอนที่ 2 — สร้าง Supabase Project

1. เข้า [supabase.com](https://supabase.com) → **New Project**
2. ตั้งชื่อ project, region เลือก **Southeast Asia (Singapore)**
3. รอ project สร้างเสร็จ (~2 นาที)
4. ไปที่ **Project Settings → API** → copy 2 ค่านี้ไว้:
   - **Project URL**
   - **anon / public key**

---

## ขั้นตอนที่ 3 — สร้าง Supabase Tables

ไปที่ **SQL Editor** ใน Supabase → วาง SQL ด้านล่างแล้วกด **Run**:

```sql
-- ตารางรายการงานที่รอรับ
create table pending_jobs (
  id uuid primary key default gen_random_uuid(),
  patient_name text,
  patient_image text,
  destination text,
  time_slot text,
  date text,
  type text,
  status text default 'pending',
  earning numeric,
  created_at timestamptz default now()
);

-- ตารางงานที่กำลังทำอยู่
create table active_jobs (
  id uuid primary key,
  patient_name text,
  patient_image text,
  destination text,
  time_slot text,
  date text,
  type text,
  current_step int default 0,
  caregiver_id uuid,
  updated_at timestamptz default now()
);

-- ตารางงานที่เสร็จแล้ว
create table completed_jobs (
  id uuid primary key,
  patient_name text,
  patient_image text,
  destination text,
  time_slot text,
  date text,
  type text,
  earning numeric,
  completed_at timestamptz default now()
);

-- ตารางโปรไฟล์ผู้ดูแล
create table caregiver_profiles (
  id uuid primary key,
  name text,
  service_area text,
  certifications text[],
  rating numeric default 5.0,
  reviews int default 0
);

-- ตารางธุรกรรมผู้ป่วย
create table patient_transactions (
  id uuid primary key,
  user_id uuid,
  caregiver_name text,
  destination text,
  date text,
  time_slot text,
  base_pay numeric,
  platform_fee numeric,
  discount numeric,
  total_paid numeric,
  booked_at timestamptz
);

-- ตารางแชท
create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  job_id uuid,
  sender text,
  text text,
  created_at timestamptz default now(),
  read_at timestamptz
);

-- ตารางสำหรับ AI Planner (analytics)
create table demo_uploads (
  visitor_number int generated always as identity,
  image_url text,
  analysis_result jsonb,
  meal_plan jsonb,
  sample_id text,
  created_at timestamptz default now()
);
```

---

## ขั้นตอนที่ 4 — เปิด Realtime

ไปที่ **Database → Replication → Supabase Realtime** → เปิด toggle ให้ครบทุก table นี้:
- `pending_jobs`
- `active_jobs`
- `chat_messages`

---

## ขั้นตอนที่ 5 — เปิด Row Level Security (RLS)

ตอนนี้ปิด RLS ไว้ก่อนเพื่อให้ทดสอบได้ง่าย ไปที่ **Authentication → Policies** → ตรวจสอบว่าแต่ละ table **ยังไม่ได้ enable RLS** (default คือปิด)

---

## ขั้นตอนที่ 6 — สร้าง Gemini API Key

1. เข้า [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. กด **Create API Key**
3. Copy key ไว้

---

## ขั้นตอนที่ 7 — สร้างไฟล์ `.env.local`

สร้างไฟล์ `.env.local` ที่ root ของ project (ดู `.env.example` เป็น template) แล้วใส่ค่า:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co   ← จาก Step 2
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...             ← จาก Step 2
NEXT_PUBLIC_OPERATOR_PIN=123456                      ← ตั้งเป็นเลขอะไรก็ได้
GEMINI_API_KEY=AIzaSy...                             ← จาก Step 6
```

---

## ขั้นตอนที่ 8 — รัน

```bash
npm run dev
```

เปิด browser ที่ `http://localhost:3000`

---

## Test Credentials (hardcoded ใน code ใช้ทดสอบได้เลย)

| username | password | บทบาท |
|---|---|---|
| `admin` | `admin123` | Caregiver |
| `user` | `user123` | Patient |
