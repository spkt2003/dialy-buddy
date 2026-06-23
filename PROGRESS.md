## [2026-06-23] (session 5 — group-3 features)

### ทำเสร็จวันนี้
- **`CLAUDE.md`** — เพิ่ม Supabase, jsqr, qrcode.react ใน tech stack; เพิ่ม caregiver sub-routes, API route handler, lib/supabaseClient note; แก้ dev commands section
- **PDPA consent** (`app/register/page.tsx`) — checkbox บังคับก่อน submit; modal แสดง policy เต็ม 7 ข้อ (ผู้ควบคุม/ข้อมูลที่เก็บ/วัตถุประสงค์/ฐานกฎหมาย/สิทธิ์/ระยะเวลา/ติดต่อ); ปุ่ม "รับทราบและยอมรับ" tick checkbox อัตโนมัติ; เก็บ `pdpaConsented: true` + timestamp ใน Supabase user_metadata
- **`components/patient/TaxInvoiceModal.tsx`** (ใหม่) — 2-step modal: step 1 = กรอกชื่อผู้เสียภาษี/เลข 13 หลัก/ที่อยู่ (validation); step 2 = preview ใบกำกับภาษีเต็มรูปแบบ พร้อมปุ่มพิมพ์; VAT 7% คำนวณจาก totalPaid inclusive (preTax = totalPaid/1.07)
- **`app/transactions/page.tsx`** — เพิ่มปุ่ม "ใบกำกับภาษี" (Receipt icon, สี primary) ต่อทุก transaction row; render TaxInvoiceModal
- **`app/subscription/page.tsx`** (ใหม่, Client Component) — แสดง Free vs Premium (฿299/เดือน) card; Premium: fee 10%, จองล่วงหน้า 3 เดือน, rewards 2x, Premium badge, priority, hotline; สมัคร → save `isPremium=true` localStorage; confirm modal ก่อน subscribe; ยกเลิกได้จาก banner
- **`app/rewards/page.tsx`** (ใหม่, Client Component) — คะแนนจาก localStorage transactions (1 point/฿10); tier Bronze(0)/Silver(500)/Gold(1000); progress bar ไป tier ถัดไป; catalog แลกรางวัล 4 รายการ (200/500/1000/1500 แต้ม); redeem → toast 5 วิ; ประวัติสะสมแต้ม 5 รายการล่าสุด; ตาราง tier
- **`components/auth/AuthGuard.tsx`** — เพิ่ม `/subscription` + `/rewards` ใน isPatientRoute
- **`components/layout/Navbar.tsx`** — เพิ่ม "รางวัล" (Gift) ใน desktop patient nav; dropdown: รางวัลสะสม + สมาชิก Premium (สี amber); mobile: รางวัลสะสม + สมาชิก Premium
- TypeScript 0 errors ✅; ยังไม่ commit/push

### ค้างอยู่ / ยังไม่เสร็จ
- **ยังไม่ commit/push** — 4 files modified + 3 untracked (app/rewards/, app/subscription/, components/patient/TaxInvoiceModal.tsx)
- **group-2 commit `80f8910` ยัง push แล้ว** — ตรวจแล้ว branch up to date กับ origin/main

### ตัดสินใจ / โน้ตสำคัญ
- **PDPA modal ใช้ fragment `<>...</>`** — return มี 2 sibling (form div + modal) → ต้อง wrap; ลืมครั้งแรก → TypeScript error TS1005
- **VAT inclusive ไม่ใช่ exclusive** — ใบกำกับภาษีแสดง totalPaid เป็นยอดรวม VAT แล้ว → preTax = totalPaid/1.07; ถ้าคิด exclusive จะทำให้ยอดรวมต่างจากใบเสร็จ
- **isPremium ใน localStorage** — ไม่มี backend จริง; prototype เท่านั้น; ยกเลิก = `localStorage.removeItem("isPremium")`
- **Rewards คำนวณแบบ client-side** — อ่าน transactions จาก localStorage เหมือน transactions page; ถ้า localStorage ว่างใช้ MOCK_PATIENT_TRANSACTIONS (dev path เห็น mock points)
- **`/subscription` และ `/rewards` เป็น patient route** — caregiver เข้าไม่ได้ (redirect ไป caregiver dashboard); เหมาะกว่าเพราะ feature เหล่านี้ target ฝั่ง patient

### พรุ่งนี้เริ่มจาก
- `git add` + `git commit` งาน group-3 ทั้งหมด แล้ว `git push`
- เลือก feature กลุ่ม 4 หรือ polish ที่เหลือ

---

## [2026-06-23] (session 4 — group-2 features)

### ทำเสร็จวันนี้
- **`lib/mockData.ts`** — เพิ่ม `CaregiverTier` type + `getCaregiverTier(name, certifications?)` helper; parse tier จากชื่อก่อน fallback ไปดูจาก certifications array
- **`components/ui/TierBadge.tsx`** (ใหม่) — reusable badge component; 3 tier: indigo=พยาบาลวิชาชีพ (Stethoscope icon), sky=ผช.พยาบาล (Heart), emerald=ผู้ดูแลผ่านการอบรม (GraduationCap); รองรับ `size="sm"|"xs"`
- **`app/find-buddy/page.tsx`** — import TierBadge + getCaregiverTier; แสดง badge ใน name row ของทุก caregiver card; ทำงานทั้ง mock caregivers (parse จากชื่อ) และ Supabase real caregivers (parse จาก tags/certifications)
- **`app/ranking/page.tsx`** (ใหม่, Server Component) — leaderboard หน้าผู้ดูแลยอดเยี่ยม; aggregate จาก MOCK_PATIENT_TRANSACTIONS ตาม basePay; top 3 มี Medal icon สีทอง/เงิน/ทองแดง; แสดง tier badge, rating, จำนวนงาน, รายได้รวม; อันดับ 1 = สมศรี ใจดี ฿4,200 (3 งาน)
- **`app/admin/page.tsx`** (ใหม่, Client Component) — PIN-gated admin dashboard; PIN: `db2025`; หลัง unlock แสดง: 4 stat cards (ผู้ดูแล 10 คน / งาน 10 ครั้ง / รายได้แพลตฟอร์ม ฿2,070 / ค่าเฉลี่ย ฿207), top 5 caregivers พร้อม tier badges, recent 5 transactions
- **`components/auth/AuthGuard.tsx`** — เพิ่ม `/ranking` ใน isPatientRoute (ต้อง login, caregiver ถูก redirect ไป caregiver dashboard)
- **`components/layout/Navbar.tsx`** — เพิ่ม "อันดับผู้ดูแล" (Trophy icon) ใน desktop patient nav + mobile patient menu
- TypeScript 0 errors ✅; ยังไม่ commit/push

### ค้างอยู่ / ยังไม่เสร็จ
- **ยังไม่ commit/push** — 5 files modified + 3 untracked (app/admin/, app/ranking/, components/ui/TierBadge.tsx); wrap commit `2270af1` ก็ยังไม่ push ด้วย (ahead 1)

### ตัดสินใจ / โน้ตสำคัญ
- **`/ranking` เป็น patient route** (ไม่ใช่ public) — caregiver เข้าไม่ได้ (redirect ไป caregiver dashboard); เหมาะกับ perspective ของ patient ที่จะดูก่อนเลือกผู้ดูแล
- **`/admin` ไม่อยู่ใน AuthGuard** — PIN เป็น protection เดียว (เหมือน /booth/operator); ไม่ต้องเพิ่ม role ใหม่
- **Ranking page เป็น Server Component** — ข้อมูลคำนวณ compile time จาก mock data ที่ static; ไม่ต้องใช้ hook → ไม่ต้อง "use client"
- **getCaregiverTier parse ชื่อก่อน certifications** — MOCK_CAREGIVERS มี tier ใน parenthetical suffix ของชื่อ; Supabase real caregivers ไม่มี → detect จาก certifications/tags แทน; ทั้งสอง path ทำงานถูกต้องจาก verify
- **ESLint pre-existing errors** — errors ทั้งหมดใน lint output เป็น pre-existing จากไฟล์อื่น; ไฟล์ใหม่ที่สร้างวันนี้ไม่มี error ใหม่

### พรุ่งนี้เริ่มจาก
- `git add` + `git commit` งาน group-2 ทั้งหมด แล้ว `git push` (รวม wrap commit `2270af1` ที่ค้างอยู่)
- เลือก feature กลุ่ม 3: Premium subscription UI / Rewards / ใบกำกับภาษี / PDPA consent

---

## [2026-06-23] (session 3 — group-1 features)

### ทำเสร็จวันนี้
- **Commit 3 files ค้าง** (`Navbar.tsx`, `ChatBox.tsx`, `tracking/page.tsx`, `PROGRESS.md`) — `94c59ac`
- **lib/mockData.ts** (ใหม่) — `CaregiverCard[]` 10 คน + `MOCK_PATIENT_TRANSACTIONS` 10 รายการ; เป็น centralized source สำหรับ find-buddy และ transactions page
- **find-buddy refactor** — ลบ `HARDCODED_CAREGIVERS` inline, import `MOCK_CAREGIVERS` จาก mockData แทน; ตอนนี้มี 10 card แทน 4
- **app/booking/page.tsx** — เปลี่ยน insert เป็น `.select("id").single()` เพื่อได้ ID กลับ; บันทึก `PatientTransaction` ลง `localStorage.patientTransactions` ทุกครั้งที่ patient ชำระเงิน
- **types/index.ts** — เพิ่ม `PatientTransaction` interface
- **app/transactions/page.tsx** (ใหม่) — หน้าประวัติธุรกรรม patient: อ่าน localStorage; ถ้าว่างแสดง MOCK_PATIENT_TRANSACTIONS; summary strip ยอดใช้จ่ายสะสม + จำนวนครั้ง; ปุ่ม "ดูใบเสร็จ" ต่อ row
- **components/patient/ReceiptModal.tsx** (ใหม่) — modal ใบเสร็จ: รายละเอียดการเดินทาง + fee breakdown (ค่าบริการ/ค่าธรรมเนียม 15%/ส่วนลด/ยอดสุทธิ) + ปุ่มพิมพ์ (เปิด popup window + window.print())
- **AuthGuard.tsx** — เพิ่ม `/transactions` เป็น patient route
- **Navbar.tsx** — เพิ่ม "ประวัติธุรกรรม" (History icon) ใน desktop profile dropdown (patient) + mobile menu (patient)
- **context/JobContext.tsx** — เพิ่ม `completedAt?: number` ใน `Job`, เพิ่ม `completed_at` ใน CompletedJobRow + Supabase query + completedRowToJob mapping
- **app/caregiver/jobs/page.tsx** — เพิ่ม stats grid 3 column: สัปดาห์นี้ / เดือนนี้ / 1 ปีล่าสุด คำนวณจาก `completedAt` timestamp
- TypeScript 0 errors, ESLint 0 errors ✅; Push ขึ้น origin/main แล้ว ✅ (`3bb3411`)

### ค้างอยู่ / ยังไม่เสร็จ
- ไม่มี — กลุ่ม 1 ทั้งหมดเสร็จแล้ว

### ตัดสินใจ / โน้ตสำคัญ
- **Patient transaction history ใช้ localStorage ไม่ใช่ Supabase** — completed_jobs ไม่มี patient_id; กรองด้วย patient_name เป็นไปได้แต่ไม่ robust; localStorage บันทึกตอน booking เก็บข้อมูลครบ (caregiver name, fee breakdown) ซึ่ง completed_jobs ไม่มี
- **Mock data แสดงแทนเมื่อ localStorage ว่าง** — dev credentials (user/user123) ที่ไม่เคยจองจะเห็นข้อมูลตัวอย่าง 10 รายการ; ไม่มี flag แยก "isMockData" เพราะ prototype
- **MOCK_CAREGIVERS ใช้ `type Caregiver = CaregiverCard`** — find-buddy ไม่มี type ซ้ำอีกแล้ว; ถ้าจะเพิ่ม caregiver mock ใหม่แก้ที่ lib/mockData.ts ที่เดียว
- **`react-hooks/set-state-in-effect` rule** — ESLint rule นี้ block setState ใน useEffect ทุกที่; ใช้ `// eslint-disable-next-line` สำหรับ pattern localStorage-read-on-mount เพราะเป็น pattern มาตรฐาน codebase นี้ (ดู booking/page.tsx บรรทัด 64, Navbar.tsx บรรทัด 31)
- **ค่าธรรมเนียม 15% ใน booking** — เสร็จมานานแล้ว (ไม่ใช่ feature ใหม่); item 4 ของ backlog จริงๆ หมายถึง earnings breakdown caregiver ซึ่งทำเสร็จแล้ว

### พรุ่งนี้เริ่มจาก
- เลือก feature กลุ่ม 2: Admin dashboard / monthly top caregiver ranking / caregiver tier (basic/ผช.พยาบาล/พยาบาลวิชาชีพ)

---

## [2026-06-23] (session 2 — feature planning)

### ทำเสร็จวันนี้
- **ไม่มี code change** — session นี้เป็นการสำรวจโค้ดและวางแผน feature backlog
- ทำ inventory ฟีเจอร์ที่มีอยู่ทั้งหมด + ฟีเจอร์ที่ยังขาด จากโจทย์ที่ปรึกษา
- จัดลำดับ backlog เป็น 4 กลุ่มตามความยาก/เร็ว พร้อมเหตุผล

### ค้างอยู่ / ยังไม่เสร็จ
- **3 files ยังไม่ commit** (`Navbar.tsx`, `ChatBox.tsx`, `app/tracking/page.tsx`) — ค้างมาจาก session ก่อน ต้อง stage + commit ก่อนเริ่มงานใหม่
- **Feature backlog (กลุ่ม 1 ทำก่อน):**
  1. Mock data 10 patients + 10 caregivers (`lib/mockData.ts` หรือคล้ายกัน)
  2. ประวัติรายการธุรกรรม (patient) — หน้าใหม่ใช้ข้อมูล completed jobs
  3. ใบเสร็จรับเงิน per transaction — component modal/page
  4. แสดงค่าธรรมเนียม 15% ใน booking + caregiver earnings breakdown
  5. Caregiver earnings breakdown รายสัปดาห์/รายเดือน

### ตัดสินใจ / โน้ตสำคัญ
- กลุ่ม 2: Admin dashboard, monthly top caregiver ranking, caregiver tier (basic/ผช.พยาบาล/พยาบาลวิชาชีพ)
- กลุ่ม 3: Premium subscription UI, Rewards, ใบกำกับภาษี, PDPA consent
- กลุ่ม 4 (ไม่ทำ prototype): Hospital portal, real payment gateway
- ระบบชำระเงินจริง — เก็บไว้ในแผนระยะยาว ยังไม่ทำ

### พรุ่งนี้เริ่มจาก
- Commit 3 files ค้างก่อน (`Navbar.tsx`, `ChatBox.tsx`, `tracking/page.tsx`)
- เริ่ม mock data (กลุ่ม 1 ข้อ 1) — ไม่ต้องแตะ UI เลย ทำได้เร็ว

---

## [2026-06-23]

### ทำเสร็จวันนี้
- **fix: Navbar แสดงปุ่มเข้าสู่ระบบบน mobile** — ลบ `hidden sm:block` ออกจาก login link ใน `components/layout/Navbar.tsx`
- **feat: Navbar burger menu สำหรับ mobile** (`components/layout/Navbar.tsx`) — เพิ่มปุ่ม hamburger (`Menu`/`X` icon) ที่โชว์เฉพาะ `< md breakpoint`; mobile drawer แสดง nav ครบตามสิทธิ์:
  - ไม่ได้ login: หน้าหลัก / ค้นหาผู้ดูแล / AI จัดโภชนาการ / ปุ่มลงทะเบียน
  - Patient: แผงควบคุม / ค้นหาผู้ดูแล / AI จัดโภชนาการ / ตั้งค่าบัญชี / ออกจากระบบ
  - Caregiver: แผงควบคุม / งานของฉัน / ตั้งค่าบัญชี / ออกจากระบบ
  - menu ปิดอัตโนมัติเมื่อเปลี่ยน route (useEffect บน pathname)
- **fix: chat bubble ขนาดล็อค** (`components/caregiver/ChatBox.tsx`, `app/tracking/page.tsx`) — เพิ่ม `w-fit` บน bubble div; root cause: bubble เป็น block div ที่ stretch เต็ม 80% container เสมอ ทำให้ข้อความสั้น เช่น "สวัสดีครับ" ถูก wrap แยกบรรทัดโดยไม่จำเป็น; ตอนนี้ bubble fit ตามเนื้อหา ยังมี `max-w-[80%]` cap ไว้สำหรับข้อความยาว
- TypeScript 0 errors ✅

### ค้างอยู่ / ยังไม่เสร็จ
- **ยังไม่ commit** — 3 files modified (`Navbar.tsx`, `ChatBox.tsx`, `app/tracking/page.tsx`) ยังไม่ stage

### ตัดสินใจ / โน้ตสำคัญ
- Burger menu ใช้ drawer แบบ dropdown ใต้ header (ไม่ใช่ slide-in จากข้าง) เพื่อให้ simple และ consistent กับ design
- Desktop nav และ profile dropdown ยังเหมือนเดิมทุกอย่าง — แก้เฉพาะ mobile layer เพิ่มเข้ามา
- `w-fit` fix ใช้ได้กับทุก browser ที่ support `width: fit-content` — ไม่ต้อง polyfill

### พรุ่งนี้เริ่มจาก
- Commit 3 files ที่แก้วันนี้แล้ว push ขึ้น origin
- ทดสอบ mobile view บน Chrome DevTools ครบทุก state (unauthenticated / patient / caregiver)

---

## [2026-06-16] (session 3 — DB cleanup ต่อ)

### ทำเสร็จวันนี้
- **feat: auto-expire pending_jobs เกิน 24 ชั่วโมง** (`d3d1588`)
  - SQL: `ALTER TABLE pending_jobs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();` — user รันแล้ว
  - `context/JobContext.tsx`: เพิ่ม cleanup ใน `loadData()` — ลบ row ที่ `created_at < now - 24h` ทุกครั้งที่ caregiver mount
  - Realtime DELETE event propagate ให้ caregiver ทุกคนที่ออนไลน์อยู่อัตโนมัติ — ไม่ต้องแก้ไฟล์อื่น
- **feat: auto-delete completed_jobs เกิน 365 วัน** (`b22f47b`)
  - ไม่ต้องรัน SQL เพิ่ม — `completed_at` มีอยู่แล้ว (ใช้ใน `.order()`)
  - `context/JobContext.tsx`: เพิ่ม cleanup ใน `loadData()` — ลบ row ที่ `completed_at < now - 365 วัน`
  - `app/caregiver/jobs/page.tsx`: label เปลี่ยนเป็น "ยอดรายได้สะสม (1 ปีล่าสุด)" เพื่อความถูกต้อง
- Push ขึ้น origin/main แล้ว ✅

### ค้างอยู่ / ยังไม่เสร็จ
- ไม่มี

### ตัดสินใจ / โน้ตสำคัญ
- cleanup ทั้งสอง table ใช้ pattern เดิม (non-blocking `.then()`) เหมือน orphaned active_jobs cleanup — consistent กับโค้ดที่มีอยู่
- `booking/page.tsx` ไม่ต้องแก้ — `DEFAULT NOW()` จัดการ `created_at` อัตโนมัติตอน INSERT
- `completed_jobs` ไม่มี filter by `caregiver_id` — caregiver ทุกคนเห็น completed jobs ของทุกคน (known limitation, acceptable สำหรับ prototype)
- DB cleanup ครบ 3 table แล้ว: `chat_messages` (FK CASCADE), `pending_jobs` (24h), `completed_jobs` (365 วัน)

### พรุ่งนี้เริ่มจาก
- ไม่มี backlog — เลือก feature ใหม่

---

## [2026-06-16] (session 2 — DB cleanup)

### ทำเสร็จวันนี้
- **DB: FK CASCADE DELETE บน `chat_messages`** — ไม่มี code change, รัน SQL ใน Supabase dashboard เท่านั้น
  - เหตุผล: ป้องกัน Supabase free tier 500MB storage เต็มจาก chat rows สะสม
  - SQL ที่รัน:
    ```sql
    DELETE FROM chat_messages WHERE job_id NOT IN (SELECT id FROM active_jobs);
    ALTER TABLE chat_messages ADD CONSTRAINT chat_messages_job_id_fkey FOREIGN KEY (job_id) REFERENCES active_jobs(id) ON DELETE CASCADE;
    ```
  - ต้องลบ orphaned rows ก่อน (job จบแล้วแต่ chat ยังค้าง) ถึงจะ ADD CONSTRAINT ได้
  - ผลลัพธ์: ทุกครั้งที่ `active_jobs` row ถูกลบ (completeJob หรือ pendingActiveJobDeletes cleanup) → `chat_messages` ลบตาม auto

### ค้างอยู่ / ยังไม่เสร็จ
- ไม่มี

### ตัดสินใจ / โน้ตสำคัญ
- ทางเลือกแรกที่ลองคือเพิ่ม `DELETE policy USING (true)` + code ใน `completeJob` → ยกเลิก เพราะเปิด permission กว้างเกินและต้องแก้โค้ด
- FK CASCADE ดีกว่าเพราะ: ไม่ต้อง DELETE policy, ไม่ต้องแก้โค้ด, DB จัดการเองระดับ atomic
- `completed_jobs` และ `pending_jobs` ยังไม่มี cleanup — ถ้าใช้งานจริงนานๆ อาจต้องทำ แต่ยังไม่เร่ง

### พรุ่งนี้เริ่มจาก
- ไม่มี backlog — เลือก feature ใหม่

---

## [2026-06-16]

### ทำเสร็จวันนี้
- **Feature: Caregiver online/offline + availability status บนหน้า find-buddy** (`4c1372e`)
  - `app/caregiver/layout.tsx`: join Supabase Realtime Presence channel `"caregiver-presence"` เมื่อ caregiver login, track `{ name: userName }`, cleanup เมื่อ logout/unmount
  - `app/find-buddy/page.tsx`: subscribe presence channel → `onlineNames`; query `active_jobs` + `caregiver_profiles` → `busyNames`; realtime subscription บน `active_jobs` อัปเดตทันที
  - Status badge: **ว่างรับงาน** (เขียว), **กำลังรับงาน** (amber), **ออฟไลน์** (เทา) — แสดงทั้งเป็น dot บน avatar และ pill badge ข้างชื่อ
- **Fix: caregiver คนแรกแสดง "กำลังรับงาน" ผิด** — เกิดจาก stale record ค้างใน `active_jobs` ใน Supabase (DELETE ล้มเหลวครั้งก่อน) → user ลบ record ใน Supabase dashboard แล้ว ทำงานถูกต้อง

### ค้างอยู่ / ยังไม่เสร็จ
- ไม่มี

### ตัดสินใจ / โน้ตสำคัญ
- ใช้ Supabase Realtime Presence (ไม่ต้องเพิ่ม column ใน DB) สำหรับ online tracking — ถ้า caregiver ปิด browser สถานะหาย auto
- busy status ดูจาก `active_jobs.caregiver_id` JOIN `caregiver_profiles.id` — ใช้ได้กับ Supabase auth users (id ตรงกัน); dev credentials (admin) `caregiver_id` จะเป็น null เพราะไม่มี profile ชื่อ "ผู้ดูแลระบบ" → แสดง offline (acceptable)
- stale `active_jobs` rows จะทำให้ status ผิดพลาด — ถ้าเจออีกให้ลบใน Supabase dashboard

### พรุ่งนี้เริ่มจาก
- เลือก feature ใหม่ — ไม่มี backlog ค้าง

---

## [2026-06-15] (session 36) — wrap

### ทำเสร็จวันนี้
- **E2E test chat ผ่าน** — ยืนยันว่า realtime chat ทำงานถูกต้องทั้งสองฝั่ง ✅
- **Feature: Chat Read Receipts** (`2060175`) — เพิ่ม "อ่านแล้ว" ใต้ข้อความสุดท้ายที่อีกฝ่ายอ่าน (เหมือน LINE/IG)
  - เพิ่ม `readAt?: number` ใน `Message` type
  - `ChatBox.tsx`: initial fetch ข้อความเก่า, mark patient msgs as read on mount/INSERT, subscribe UPDATE events
  - `tracking/page.tsx`: initial fetch, mark caregiver msgs as read เมื่อเปิดแชท, subscribe UPDATE events
  - เพิ่ม `read_at TIMESTAMPTZ` column ใน `chat_messages` (user รัน SQL แล้ว)
- **Feature: Caregiver Rating Display** (`2060175`) — settings แสดง "ยังไม่มีการให้คะแนน" เมื่อ reviews=0, เปลี่ยน "X รีวิว" → "จาก X คน", ซ่อนดาวเมื่อยังไม่มีรีวิว
- **Fix: Rating submission ไม่ทำงาน** (`97e8e33`) — `payload.old` ของ DELETE event ไม่มี `caregiver_id` (ไม่มี REPLICA IDENTITY FULL) → เพิ่ม `caregiverIdRef` track `liveJob.caregiver_id` ผ่าน useEffect แทน
- **Fix: "อ่านแล้ว" ไม่ขึ้น** (`97e8e33`) — Supabase ต้องการ REPLICA IDENTITY FULL สำหรับ UPDATE subscription ที่มี filter → ลบ filter ออก ใช้ client-side `row.job_id !== jobId` check แทน
- **Fix: Caregiver settings rating ไม่ live update** (`97e8e33`, `53b0a77`) — เพิ่ม realtime subscription บน `caregiver_profiles`; แก้ React StrictMode error "cannot add callbacks after subscribe()" ด้วย `isMounted` flag + `user.id` ใน channel name
- **SQL ที่ user รันใน Supabase**:
  - `ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;`
  - `CREATE POLICY "public update" ON chat_messages FOR UPDATE USING (true) WITH CHECK (true);`

### ค้างอยู่ / ยังไม่เสร็จ
- ยังไม่ได้ทดสอบ "อ่านแล้ว" E2E จริง (caregiver + patient สองหน้าต่าง) หลัง RLS fix

### ตัดสินใจ / โน้ตสำคัญ
- **Root cause "อ่านแล้ว" ไม่ขึ้น**: ไม่ใช่ REPLICA IDENTITY แต่เป็น RLS — `chat_messages` ไม่มี UPDATE policy → `UPDATE read_at` ถูก block เงียบๆ ไม่มี error
- **REPLICA IDENTITY กับ Supabase filter**: UPDATE subscription ที่มี `filter:` จะไม่ได้รับ event โดยไม่มี REPLICA IDENTITY FULL → วิธีแก้คือลบ filter ออก ใช้ client-side check แทน (pattern นี้ใช้กับทุก UPDATE subscription ในโปรเจกต์)
- **React StrictMode double-mount**: async `getUser().then()` ที่สร้าง channel จะถูกเรียกสองครั้ง → ใช้ `isMounted` flag ใน cleanup เพื่อ skip การสร้าง channel ในรอบที่สอง
- ไม่มี feature backlog ที่ค้างอยู่แล้ว

### พรุ่งนี้เริ่มจาก
- ทดสอบ "อ่านแล้ว" E2E: caregiver tracking (ChatBox visible) + patient tracking (เปิดแชท) → ข้อความควรขึ้น "อ่านแล้ว" ทั้งสองฝั่ง
- ถ้าผ่าน → ไม่มี backlog เหลือ เลือก feature ใหม่

---

## [2026-06-15] (session 35) — wrap

### ทำเสร็จวันนี้
- **Enable Supabase realtime บน `chat_messages`** ✅ — user รัน `ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages` ใน Supabase dashboard แล้ว
- **Commit + push session 34** (`c832010`) — chat dedup fix ขึ้น origin/main แล้ว branch ตรงกับ remote ✅

### ค้างอยู่ / ยังไม่เสร็จ
- **E2E test chat ยังไม่ได้ทดสอบ** — Supabase realtime เปิดแล้ว แต่ยังไม่ได้นั่งทดสอบ 2 tab จริง

### ตัดสินใจ / โน้ตสำคัญ
- session สั้น — standup + commit/push + enable realtime เท่านั้น ไม่มี code change

### พรุ่งนี้เริ่มจาก
- E2E test chat: login caregiver tab 1, login patient tab 2 → caregiver รับงาน → patient ส่งแชท → caregiver เห็น realtime → ตอบกลับ → patient เห็น unread badge

---

## [2026-06-15] (session 35)

### ทำเสร็จวันนี้
- **แก้ bug rating ไม่อัปเดตใน caregiver/settings** ✅
  - Root cause: Supabase DELETE event ส่งแค่ PK ใน `payload.old` (ไม่มี `caregiver_id` เว้นแต่ตั้ง `REPLICA IDENTITY FULL`)
  - Fix: เพิ่ม `caregiverIdRef` track `liveJob.caregiver_id` realtime → ตอน DELETE fire ใช้ค่าจาก ref แทน `payload.old`
- **แก้ไฟล์ truncation ซ้ำ** (Windows→Linux mount) — เขียนใหม่ผ่าน Python write ทั้ง 3 ไฟล์:
  - `app/tracking/page.tsx` (600 lines)
  - `app/caregiver/settings/page.tsx` (274 lines)
  - `components/caregiver/ChatBox.tsx` (155 lines) + `types/index.ts`
- **`types/index.ts`** — เพิ่ม `readAt?: number` ใน `Message` interface (user เพิ่ม read receipt feature)
- **ChatBox.tsx** — เพิ่ม optimistic ID → real timestamp fix (เหมือน patient side)
- TypeScript 0 errors ✅

### ค้างอยู่ / ยังไม่เสร็จ
- **SQL ที่ต้องรันใน Supabase** (ยังไม่ confirm):
  ```sql
  ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
  CREATE POLICY "chat_insert" ON chat_messages FOR INSERT WITH CHECK (true);
  CREATE POLICY "chat_select" ON chat_messages FOR SELECT USING (true);
  ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS read_at timestamptz;
  ```
- E2E test chat + rating flow หลัง SQL fix

### ตัดสินใจ / โน้ตสำคัญ
- `REPLICA IDENTITY FULL` บน `active_jobs` จะแก้ปัญหา `payload.old` แต่เปลี่ยน WAL overhead — ref pattern ปลอดภัยกว่า
- `read_at` column: ถ้า insert ไปยัง column ที่ไม่มีใน table Supabase จะ return error silently (ไม่ crash app) แต่ read receipt จะไม่ทำงาน

### พรุ่งนี้เริ่มจาก
- รัน SQL ทั้ง 4 คำสั่งข้างต้น
- ทดสอบ: patient ให้ rating → refresh caregiver/settings → คะแนนต้องขึ้น
- ทดสอบ: แชท 2 หน้าต่าง → ไม่ซ้ำ → "อ่านแล้ว" ขึ้นฝั่ง patient
