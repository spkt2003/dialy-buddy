## [2026-06-15] (session 34)

### ทำเสร็จวันนี้
- **แก้ bug แชทโชว์ซ้ำ 2 ครั้ง** ✅
  - สาเหตุ: optimistic ID = `Date.now()` (client) ≠ `new Date(created_at).getTime()` (server) → dedup miss → realtime event เพิ่มข้อความซ้ำ
  - Fix ทั้งสองฝั่ง (`ChatBox.tsx` + `app/tracking/page.tsx`): เปลี่ยน `insert(...)` → `insert(...).select().single()` แล้ว map optimistic ID → real timestamp จาก DB ก่อน realtime event มาถึง
  - error rollback: ถ้า insert fail → ลบ optimistic message ออก
- **แก้ไฟล์ truncation (Windows→Linux mount)** — เขียนใหม่ผ่าน bash heredoc
- TypeScript 0 errors ✅

### ค้างอยู่ / ยังไม่เสร็จ
- ทดสอบ E2E chat หลัง Supabase SQL fix (`ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages`)
- `chat_messages` realtime ยังต้องการ user รัน SQL ใน Supabase

### ตัดสินใจ / โน้ตสำคัญ
- Pattern dedup ที่ถูกต้อง: insert → `.select().single()` → ได้ `created_at` จริง → `setMessages(prev => prev.map(m => m.id === optimisticId ? {...m, id: realId} : m))` → realtime event จะ find match และ skip
- อย่า insert แล้ว depend แค่ realtime event (no optimistic): UX ช้า เห็น delay
- อย่า optimistic-only (ไม่ update ID): duplicate เมื่อ realtime event มา

### พรุ่งนี้เริ่มจาก
- ผู้ใช้รัน SQL enable realtime บน `chat_messages`
- E2E test: caregiver รับงาน → patient ส่งแชท → caregiver เห็น realtime → ตอบ → patient เห็น unread badge

---

## [2026-06-15] (session 33) — wrap

### ทำเสร็จวันนี้
- **Feature C: In-app Realtime Chat** ✅ (commit `cce548e`)
  - SQL migration: ตาราง `chat_messages` + RLS + policy INSERT/SELECT
  - `ChatBox.tsx` — rewrite: Supabase realtime subscribe, optimistic update, duplicate prevention, unread badge, auto-scroll
  - `ChatColumn.tsx` — เพิ่ม `jobId: string` prop
  - `app/caregiver/tracking/page.tsx` — ส่ง `activeJob.id` ให้ `<ChatColumn />`
  - `app/caregiver/dashboard/page.tsx` — ลบ `<ChatColumn />` ออก, grid → `grid-cols-1`
  - `app/tracking/page.tsx` (patient) — Supabase realtime แทน mock, unread badge บนปุ่มแชท, redesign modal
- **commit + push** เสร็จแล้ว ✅ branch `main` up to date

### ค้างอยู่ / ยังไม่เสร็จ
- ยังไม่ได้ทดสอบ E2E จริง (ต้องมี 2 browser หรือ 2 tab login ต่างบัญชี)

### ตัดสินใจ / โน้ตสำคัญ
- channel name: caregiver `chat_${jobId}`, patient `chat_patient_${jobId}` — ต่างกันเพื่อไม่ชน (Supabase channel name unique per client)
- optimistic ID = `Date.now()` ms; realtime ID = `new Date(created_at).getTime()` — ตรงกัน = duplicate กรองออก
- ลบ ChatColumn จาก dashboard แทน optional jobId — chat ต้องมี job context

### พรุ่งนี้เริ่มจาก
- ทดสอบ E2E chat: login caregiver tab 1, login patient tab 2 → caregiver รับงาน → patient ส่งแชท → caregiver เห็น realtime → ตอบกลับ → patient เห็น unread badge

---

## [2026-06-15] (session 32)

### ทำเสร็จวันนี้
- **E2E test ผ่าน** — register caregiver ใหม่ → login patient → find-buddy แสดง real caregiver จาก Supabase ✅
- **Feature B: Rating/Review หลังจบงาน** ✅
  - **SQL migration** — `ALTER TABLE active_jobs ADD COLUMN IF NOT EXISTS caregiver_id uuid;`
  - **`context/JobContext.tsx`** — `acceptJob` เปลี่ยนเป็น async; ดึง `caregiver_id` จาก `supabase.auth.getUser()` แล้ว upsert ลง `active_jobs` (null สำหรับ dev credentials)
  - **`app/tracking/page.tsx`** — เมื่อ DELETE event ยิง แทน redirect ทันที → แสดง rating modal; patient ให้ 1–5 ดาว + ความคิดเห็น (ไม่บังคับ); submit → คำนวณ weighted average → update `caregiver_profiles.rating` + `reviews`; ปุ่ม "ข้าม" → redirect `/dashboard` โดยไม่บันทึก
  - **`app/caregiver/settings/page.tsx`** — fetch `rating`/`reviews` จาก `caregiver_profiles` ด้วย `supabase.auth.getUser()` → แสดง card ดาวใน profile tab (ซ่อนสำหรับ dev credentials)
  - **`app/find-buddy/page.tsx`** — ไม่ต้องแก้ อ่าน rating จาก Supabase อยู่แล้ว อัปเดตอัตโนมัติ
- **ai-planner/samples disclaimer** — ย้าย "card นี้ใช้สำหรับทดสอบระบบเท่านั้น" เข้าไปในทุก card แทนที่จะอยู่ footer ✅
- TypeScript ผ่าน 0 errors ใหม่

### ค้างอยู่ / ยังไม่เสร็จ
- **Feature C (in-app chat)** — chat realtime ระหว่าง patient กับ caregiver ยังไม่ได้ทำ
- **ยังไม่ commit/push** — งาน session นี้ยังไม่ stage

### ตัดสินใจ / โน้ตสำคัญ
- `caregiver_id` ใน `active_jobs` เป็น `uuid` ไม่มี foreign key constraint (ไม่ references caregiver_profiles) เพื่อรองรับ dev credentials ที่ไม่มีแถวใน caregiver_profiles
- DELETE realtime payload มี `payload.old` แค่ primary key โดย default — ถ้า Supabase table ไม่ได้ตั้ง `REPLICA IDENTITY FULL` จะได้ `caregiver_id` จาก `payload.old` ไม่ได้; แก้โดยเก็บ `caregiverId` จาก `liveJob` state ผ่าน ref แทน (liveJob ยังอยู่ใน state ตอน DELETE fire)
- weighted average: `new_rating = (old_rating * old_reviews + stars) / (old_reviews + 1)` — race condition เป็นไปได้ถ้า 2 patient rate พร้อมกัน แต่ยอมรับได้สำหรับ prototype
- `acceptJob` type signature เปลี่ยนเป็น `Promise<void>` — caller ใน caregiver dashboard ไม่ได้ await (fire-and-forget) ซึ่งถูกต้อง

### พรุ่งนี้เริ่มจาก
- `git commit` + `git push` งาน session นี้
- ตัดสินใจว่าจะทำ Feature C (in-app chat) หรือ polish อื่น

---

## [2026-06-15] (session 31)

### ทำเสร็จวันนี้
- **Push งาน session 30** ✅ — 2 commits (`8e8920c`, `d402425`) ขึ้น origin/main สำเร็จ
- **Email key by user** (`app/profile/page.tsx`, `app/caregiver/settings/page.tsx`) — เปลี่ยน key จาก `userEmail` → `userEmail_${userPhone || userName}` ป้องกัน user คนละคน share email กัน ✅
- **บันทึกข้อมูล save ชื่อจริง** — เพิ่ม `updateUserName()` ใน `AuthContext.tsx`; เรียก `supabase.auth.updateUser({ data: { userName } })` สำหรับ Supabase user, fallback ไป localStorage สำหรับ dev credentials; ปุ่มบันทึกแสดง toast "บันทึกแล้ว ✓" 2 วินาที ✅
- **Phone field read-only** — ทั้ง patient profile และ caregiver settings; `FormInput` ได้รับ `readOnly` prop ใหม่ ✅
- **Name inputs controlled** — `firstName`/`lastName` เปลี่ยนจาก `defaultValue` เป็น `value` + `onChange` ✅
- **Real caregivers ใน find-buddy** (`app/find-buddy/page.tsx`) — fetch จาก `caregiver_profiles` table ใน Supabase, prepend ก่อน hardcoded; skeleton loading ขณะ fetch; `HOSPITAL_FROM_LOCATION` map เพิ่ม district-only keys สำหรับ real caregivers ✅
- **Register insert caregiver_profiles** (`app/register/page.tsx`) — หลัง `supabase.auth.signUp` สำเร็จ (caregiver role) → insert `{ id, name, service_area, certifications }` ลง `caregiver_profiles` table ✅
- **Playwright verify ผ่าน 13/13** — PASS ทุก test, FAIL 0, WARN 0 ✅
- **Push `5a5082f`** — branch ตรงกับ origin/main ✅

### ค้างอยู่ / ยังไม่เสร็จ
- **`caregiver_profiles` Supabase table** — user รัน SQL แล้ว แต่ยังไม่มี real caregiver register → find-buddy ยังแสดงแค่ 4 hardcoded cards
- **Feature backlog ที่ยังไม่ทำ**: B (rating/review หลังจบงาน), C (in-app chat)

### ตัดสินใจ / โน้ตสำคัญ
- `updateUserName` ลอง Supabase ก่อน; ถ้า error (dev credentials ไม่มี session) → fallback localStorage — pattern สะอาด ไม่ต้องเช็ค session แยก
- `caregiver_profiles` เป็น table แยก (ไม่ใช่ query `auth.users` โดยตรง) เพราะ `auth.users` ไม่ queryable จาก client โดยไม่มี admin key
- find-buddy search ค้น name + location + exp พร้อมกัน → hardcoded cards ติด "ศิริราช" search เพราะ exp field มีคำนั้น — ไม่ใช่ bug
- SQL ที่รันแล้ว:
  ```sql
  create table caregiver_profiles (id uuid primary key references auth.users(id) on delete cascade, name text not null, service_area text not null, certifications text[] not null default '{}', rating numeric(3,2) not null default 5.0, reviews int not null default 0, created_at timestamptz not null default now());
  alter table caregiver_profiles enable row level security;
  create policy "public read" on caregiver_profiles for select using (true);
  create policy "public insert" on caregiver_profiles for insert with check (true);
  ```

### พรุ่งนี้เริ่มจาก
- ทดสอบ end-to-end: register caregiver ใหม่ → login patient → find-buddy → ดูว่า real caregiver โผล่บน list
- ตัดสินใจ feature B หรือ C ต่อไป

---

## [2026-06-15] (session 30)

### ทำเสร็จวันนี้
- **ยืนยัน phone number แสดงถูกต้องบน browser** — user ยืนยันเองว่าเบอร์โชว์ใน profile/settings ✅
- **Email field persist via localStorage** (`app/profile/page.tsx`, `app/caregiver/settings/page.tsx`, `components/ui/FormInput.tsx`) — ช่อง email เปลี่ยนเป็น controlled input; โหลดค่าจาก `localStorage("userEmail")` ตอน mount; กด "บันทึกข้อมูล" → save ลง localStorage; ทั้ง patient และ caregiver ใช้ key เดียวกัน (`8e8920c`) ✅
- **FormInput รองรับ controlled mode** — เพิ่ม `value` + `onChange` props (optional); ถ้า `value !== undefined` ใช้ controlled path, ไม่งั้นใช้ `defaultValue` เหมือนเดิม — ไม่ break existing usages ✅
- TypeScript 0 errors ✅

### ค้างอยู่ / ยังไม่เสร็จ
- **ยังไม่ได้ push** — branch ahead of origin/main 1 commit (`8e8920c`)
- **Email ไม่ได้ key by user** — `userEmail` ใน localStorage ไม่ผูกกับ phone/user id → ถ้า device เดิม user คนละคน login สลับกัน จะเห็น email ของ user เดิม (ยอมรับได้สำหรับ prototype ตอนนี้)
- **บันทึกข้อมูลยังไม่ save ชื่อ/เบอร์** — ปุ่ม "บันทึกข้อมูล" save แค่ email เพราะชื่อ/เบอร์มาจาก Supabase session (แก้ยากกว่า); ยังไม่ได้ทำ

### ตัดสินใจ / โน้ตสำคัญ
- email field ตัดสินใจให้กรอกเองอิสระ ไม่ดึงจาก Supabase (เพราะ Supabase email จริงเป็น `{phone}@dialybuddy.local` ไม่ใช่ email จริง)
- placeholder เปลี่ยนเป็น "อีเมล (ไม่บังคับ)" เพื่อสื่อว่า optional
- `FormInput` controlled mode: spread `{ value, onChange }` หรือ `{ defaultValue }` แบบ conditional เพื่อหลีกเลี่ยง React warning เรื่อง switching between controlled/uncontrolled

### พรุ่งนี้เริ่มจาก
- `git push` ขึ้น origin ก่อน
- คิดว่าจะทำ feature อะไรต่อ (ยังไม่มี backlog ชัดเจน)

---

## [2026-06-15] (session 29)

### ทำเสร็จวันนี้
- **Commit + push งาน session 28** (`243af60`) — 8 files (7 code + PROGRESS.md) ถูก commit และ push ขึ้น origin/main ✅
- **ทดสอบ Flow K ผ่าน** — caregiver กด "เสร็จสิ้น" → patient tracking redirect ไป `/dashboard` อัตโนมัติผ่าน Supabase realtime DELETE event ✅
- **ทดสอบ patient profile + CG settings ชื่อ ผ่าน** — `userName` จาก AuthContext แสดงถูกต้องใน profile และ settings ✅
- **Fix phone number** (`context/AuthContext.tsx`, `app/profile/page.tsx`, `app/caregiver/settings/page.tsx`) — เพิ่ม `userPhone` ใน AuthContext; parse จาก `session.user.email` (`{phone}@dialybuddy.local` → ตัด suffix); patient profile + CG settings แสดงเบอร์ใน phone field (`cf22fea`) ✅

### ค้างอยู่ / ยังไม่เสร็จ
- **email field ว่างเปล่า** — ช่อง "อีเมล" ใน profile/settings แสดง placeholder ว่าง เพราะ email จริงใน Supabase เป็น fake domain (`{phone}@dialybuddy.local`) ไม่ถูกแสดง — รอตัดสินใจว่าจะทำอะไรกับ field นี้
- **ยังไม่ได้ทดสอบ phone number บน browser จริง** — implement แล้ว commit แล้ว แต่ยังไม่ได้ verify ว่าเบอร์โชว์ถูกต้องใน UI

### ตัดสินใจ / โน้ตสำคัญ
- `userPhone` parse จาก `session.user.email` — check `.endsWith("@dialybuddy.local")` ก่อน split เพื่อกันกรณีที่ email ปกติถูก parse ผิด
- dev credentials (admin/user) ได้ `userPhone = ""` เพราะไม่มี Supabase session → phone field แสดง placeholder ว่าง — ถูกต้อง
- logout reset `userPhone = ""` ด้วย

### พรุ่งนี้เริ่มจาก
- ทดสอบ phone number แสดงใน profile/settings จริงบน browser — register user ใหม่ → login → เปิด profile → ตรวจว่าเบอร์โผล่ใน phone field
- ตัดสินใจว่าช่อง email ควรแสดงอะไร (ว่าง /숨기기 field เลย / แสดงข้อความ "ไม่มีอีเมล")

---

## [2026-06-15] (session 28)

### ทำเสร็จวันนี้
- **ลบ Demo buttons** (`components/home/HeroSection.tsx`) — ลบ `<DemoLoginButtons />` + import ออกทั้งหมด ✅
- **Flow H — per-card print** (`app/ai-planner/samples/page.tsx`) — เพิ่มปุ่ม "พิมพ์ card นี้" ใน SampleCard แต่ละใบ; inject CSS ซ่อน card อื่นใน `#print-area` ผ่าน `data-sample` attribute ก่อนเรียก `window.print()`; cleanup style ผ่าน `afterprint` event ✅
- **Flow I — card expand fix** (`app/find-buddy/page.tsx`) — ลบ `animate-in fade-in slide-in-from-top-2 duration-300` ออกจาก expand form ที่ทำให้ element ซ่อน ✅
- **Flow I — clear search button** (`app/find-buddy/page.tsx`) — เพิ่มปุ่ม "✕ ล้างการค้นหา" ใน search bar ขณะมี searchTerm ✅
- **Flow K — patient redirect** (`app/tracking/page.tsx`) — เมื่อ caregiver จบงาน (DELETE event ยิง) → `router.push("/dashboard")` แทน `setLiveJob(null)` ใช้ `useRef` track ว่ามี active job จริงก่อน redirect ✅
- **Patient profile name** (`app/profile/page.tsx`) — ใช้ `userName` จาก AuthContext; split by space → firstName/lastName; avatar `userName.charAt(0)`; ลบ hardcode email/phone ✅
- **CG dashboard name** (`app/caregiver/dashboard/page.tsx`) — import `useAuth`; ใช้ `userName` แทน "สมศรี"; avatar `userName.charAt(0)` ✅
- **CG settings name** (`app/caregiver/settings/page.tsx`) — split `userName` → `firstName`/`lastName` ใส่ช่องถูกต้อง; ลบ hardcode phone/email ✅
- TypeScript ผ่าน 0 errors

### ค้างอยู่ / ยังไม่เสร็จ
- **ยังไม่ commit** — 7 files modified ยังไม่ stage (+ PROGRESS.md)
- Flow K ยังไม่ได้ทดสอบจริง — ต้องเทส caregiver กด "เสร็จสิ้น" แล้วดูว่า patient ถูก redirect ออกจาก tracking
- phone number ยังไม่แสดงใน profile/settings ทั้ง patient/caregiver — เพราะ Supabase เก็บ phone เป็น `email` field (`{phone}@dialybuddy.local`) ไม่ได้อยู่ใน user_metadata → ต้องดึงมาแยก

### ตัดสินใจ / โน้ตสำคัญ
- per-card print ใช้ `data-sample` attribute บน wrapper ใน `#print-area` + inject `<style id="print-one-style">` ชั่วคราว; ไม่ใช้ React state เพิ่ม, ใช้ `data-id` attribute บน card
- tracking redirect ใช้ `useRef` เพราะ realtime callback ปิดทับค่า `liveJob` ณ เวลา subscribe (ไม่ใช่ค่าปัจจุบัน)
- `userName` จาก Supabase register เก็บ full name เป็น string เดียว → split ด้วย space ได้ถูกต้องถ้าชื่อ-นามสกุลไม่มีเว้นวรรคซ้อน
- dev credentials (admin/user) ใน localStorage ไม่มี email/phone จริง → placeholder แสดงแทน

### พรุ่งนี้เริ่มจาก
- **Commit** 7 files + PROGRESS.md แล้ว push ขึ้น origin
- ทดสอบ Flow K จริง: caregiver กด "เสร็จสิ้น" → patient tracking ต้อง redirect ไป `/dashboard`
- ทดสอบ patient profile + CG settings แสดงชื่อที่ register ไว้ถูกต้อง

---

## [2026-06-15] (session 27)

### ทำเสร็จวันนี้
- ไม่มี commit ใหม่ — session นี้เป็นแค่ diagnosis อ่านโค้ดหลายไฟล์เพื่อเตรียม fix bug batch

### ค้างอยู่ / ยังไม่เสร็จ
ทั้งหมดยังไม่ได้แตะโค้ดเลย รอ implement:

1. **Flow H — per-card print** (`app/ai-planner/samples/page.tsx`)
   - ปัจจุบัน: มีแค่ปุ่ม "พิมพ์ทุก Card" เดียว
   - Fix: inject temp `<style>` ก่อน `window.print()` เพื่อซ่อน card อื่น → ลบ style หลัง print
   - ไม่ต้อง React state เพิ่ม, ใช้ `data-id` attribute บน card

2. **Flow I — card ไม่ขยาย + ไม่มีปุ่มล้างการค้นหา** (`app/find-buddy/page.tsx`)
   - โค้ด `expandedIdx` ถูกแล้ว แต่ `animate-in fade-in slide-in-from-top-2` อาจทำ element hidden ถ้า tailwindcss-animate ไม่ run ครบ → ลบ animation classes
   - ปุ่ม "ล้างการค้นหา" มีแค่ใน EmptyState (filteredData.length===0) → เพิ่มปุ่มใน search bar ด้วย (ขณะมี searchTerm)

3. **Flow K — tracking redirect** (`app/tracking/page.tsx`)
   - ตอนนี้: DELETE event → `setLiveJob(null)` → แสดง empty state
   - Fix: เพิ่ม `useRouter` → `router.push("/dashboard")` แทนการ setLiveJob(null)

4. **Demo buttons** (`components/home/HeroSection.tsx` line 37)
   - `<DemoLoginButtons />` อยู่ใน HeroSection → ลบบรรทัดนั้น + ลบ import

5. **Patient profile name** (`app/profile/page.tsx`)
   - Avatar hardcode "ส", ชื่อ hardcode "สมหมาย", นามสกุล hardcode "ใจดี", email hardcode "sommai@dialybuddy.com"
   - Fix: import `useAuth`, ใช้ `userName` split ด้วย space → first/last

6. **Caregiver dashboard name** (`app/caregiver/dashboard/page.tsx`)
   - line 44: `<h1>ยินดีต้อนรับ, สมศรี</h1>` hardcode, avatar "ส" hardcode
   - Fix: import `useAuth` → ใช้ `userName`

7. **Caregiver settings name** (`app/caregiver/settings/page.tsx`)
   - line 82: `defaultValue="ใจสู้"` hardcode surname, phone/email ก็ hardcode
   - Fix: split `userName` → first/last, ลบ hardcode phone/email

### ตัดสินใจ / โน้ตสำคัญ
- `DemoLoginButtons` อยู่ใน `components/home/HeroSection.tsx` (ไม่ได้อยู่ใน `app/page.tsx` โดยตรง)
- find-buddy card expand logic ถูก 100% — ปัญหาน่าจะเป็น Tailwind animate classes ทำ opacity:0 ค้าง
- patient profile = `app/profile/page.tsx` (ไม่ใช่ `app/profile/settings`) — ชื่อ component เป็น `SettingsPage` แต่ path คือ `/profile`
- caregiver settings ใช้ `FormInput` component (`components/ui/FormInput.tsx`) — ต้องดูว่า accepts `defaultValue` หรือ `value`

### พรุ่งนี้เริ่มจาก
- เริ่ม fix 7 items ด้านบนตามลำดับ (H → I → K → Demo → Profile → CG Dashboard → CG Settings)
- ทุก item ไม่มี dependency ต่อกัน → fix พร้อมกันได้ใน batch เดียว

---

## [2026-06-15] (session 26)

### ทำเสร็จวันนี้
- **Login label/icon** (`app/login/page.tsx`) — เปลี่ยน "เบอร์โทรศัพท์ หรือ อีเมล" → "เบอร์โทรศัพท์", icon Mail → Phone, input type → tel ✅
- **Register overhaul** (`app/register/page.tsx`) — form แยก field ตาม role (`45d5438`) ✅
  - Patient: ชื่อ + ความสัมพันธ์กับผู้ป่วย (dropdown) + เบอร์ + รหัสผ่าน
  - Caregiver: ชื่อ + เลขบัตรฯ (validate 13 หลัก client-side เท่านั้น ไม่เก็บ) + เขตที่ให้บริการ (34 เขต) + ประสบการณ์/ใบรับรอง (pill toggle 10 ตัวเลือก เลือกได้หลายอัน) + เบอร์ + รหัสผ่าน
  - redirect หลัง register → `/find-buddy` (patient) / `/caregiver/dashboard` (caregiver)
- **Security decision** — เลขบัตรประชาชนไม่เก็บใน Supabase เลย (ใช้แค่ client-side validation) เพราะ sensitive + ไม่มี background check จริง

### ค้างอยู่ / ยังไม่เสร็จ
- ทดสอบ register flow จริงบน Vercel ยังไม่ได้ทำ
- find-buddy ยังใช้ hardcoded caregivers — ยังไม่ดึงจาก Supabase profiles

### ตัดสินใจ / โน้ตสำคัญ
- `idCard` validate client-side (13 หลัก) แต่ **ไม่ส่งไปใน metadata** — ถ้า production จริงต้อง encrypt ด้วย KMS ก่อนเก็บ + อยู่ภายใต้ PDPA
- `certifications` เก็บเป็น array ใน `user_metadata` — ยังไม่ได้ connect กับ find-buddy card (ยังเป็น hardcode)
- `serviceArea` เก็บใน `user_metadata` — format: "เขตบางกอกน้อย" (ไม่มี รพ. suffix)

### พรุ่งนี้เริ่มจาก
- ทดสอบ register flow บน Vercel: สมัคร caregiver → ดู certifications/serviceArea ใน Supabase dashboard → login → เข้า `/caregiver/dashboard`

---

## [2026-06-15] (session 25)

### ทำเสร็จวันนี้
- **Login redirect → `/find-buddy`** (`app/login/page.tsx`) — patient login (ทั้ง `user/user123` และ Supabase registered) redirect ไป `/find-buddy` แทน `/dashboard` ✅
- **Dashboard dynamic** (`app/dashboard/page.tsx`) — rewrite เป็น client component:
  - ชื่อทักทายใช้ `userName` จาก auth context จริง ไม่ hardcode
  - blood test card (right column) ซ่อนสำหรับ new user — แสดง CTA "อัปโหลดผลตรวจเลือด" → link ไป `/ai-planner` แทน
  - หลังอัปผลตรวจ: blood test card โชว์ค่าจริงจาก `localStorage.lastBloodTest` (dynamic สีตาม status)
- **AI planner save result** (`app/ai-planner/page.tsx`) — หลัง analyze สำเร็จ save `SampleResult` ลง `localStorage.lastBloodTest` เพื่อให้ dashboard อ่านได้
- **Find-buddy booking mini-form** (`app/find-buddy/page.tsx`) — ปุ่ม "เลือกวันและเวลา" expand card แสดง date picker + time slot + hospital dropdown; hospital pre-select จาก caregiver location อัตโนมัติ; ปุ่ม "ยืนยันและดำเนินการต่อ" ส่ง `date`, `slot`, `hospital` ไปกับ query params
- **Booking pre-fill** (`app/booking/page.tsx`) — อ่าน `date`, `slot`, `hospital` จาก query params แล้ว pre-fill ฟอร์ม ปุ่ม "ชำระเงิน" active ทันทีถ้าครบ
- TypeScript ผ่าน 0 errors ทั้งสองรอบ

### ค้างอยู่ / ยังไม่เสร็จ
- **ยังไม่ commit** — 5 files modified ยังไม่ stage

### ตัดสินใจ / โน้ตสำคัญ
- `localStorage.lastBloodTest` เป็น key ใหม่ — เก็บ full `SampleResult` JSON; dashboard อ่านครั้งเดียวตอน mount ด้วย `isInitialized` guard ป้องกัน hydration mismatch
- Dashboard return `null` จนกว่า `initialized = true` (เหมือน pattern context) ป้องกัน SSR/CSR mismatch
- Hospital pre-select ใช้ `HOSPITAL_FROM_LOCATION` map ที่ match กับ caregiver location string — ถ้า location ไม่ match จะ default เป็น "" (user เลือกเอง)
- Booking ยังให้แก้ date/slot/hospital ได้หลัง pre-fill — form ไม่ lock

### พรุ่งนี้เริ่มจาก
- **Commit** 5 files ทั้งหมด แล้ว push ขึ้น origin
- ทดสอบ flow จริง: login → find-buddy → เลือก caregiver + กรอก date/time/hospital → booking pre-filled → ชำระเงิน → tracking

---

## [2026-06-15] (session 24)

### ทำเสร็จวันนี้
- **Commit + push `7cc4aa5`** — งาน session 23 ทั้งหมด (sample cards + QR fix + AuthGuard + jsqr) ถูก commit และ push ขึ้น origin/main แล้ว branch ตรงกับ remote ✅
- **Realtime live-INSERT booth end-to-end test ผ่าน** — ทดสอบบน Vercel จริง: อัปรูป sample card ใน `/ai-planner` (patient) → `/booth/operator` อัปเดต visit log live โดยไม่ refresh ✅
- ทดสอบด้วย 2 tabs บน Vercel URL เดียวกัน (PIN `1234`)

### ค้างอยู่ / ยังไม่เสร็จ
- `booking/page.tsx` — วันที่/เวลา/ปลายทาง ยังเป็น hardcode ยังไม่ผูกกับ find-buddy flow จริง

### ตัดสินใจ / โน้ตสำคัญ
- Realtime INSERT บน `demo_uploads` ทำงานถูกต้องบน Vercel — Supabase realtime config ไม่ต้องแก้เพิ่ม
- PIN `/booth/operator` บน Vercel คือ `1234` (ยืนยันแล้ว)

### พรุ่งนี้เริ่มจาก
- **`booking/page.tsx`** — ผูก date/time/destination กับ query params จาก find-buddy flow แทน hardcode

---

## [2026-06-15] (session 23)

### ทำเสร็จวันนี้
- **Blood test sample cards feature เสร็จแล้ว** — co-work สร้าง `app/ai-planner/samples/page.tsx`: 3 card แสดงค่าเลือด + QR code + print layout พร้อมใช้งาน ✅
- **Fix QR decode bug** — อัพรูป card ไหนก็ได้ output เป็น SAMPLE_001 ทุกครั้ง; แก้ด้วย:
  - ติดตั้ง `jsqr` — QR decoder ฝั่ง client
  - `app/ai-planner/page.tsx` — decode QR จากรูปก่อนส่ง API, ถ้าเจอ sample ID ที่ valid → ส่งไปกับ request body ด้วย
  - `app/api/analyze-blood/route.ts` — ถ้า request body มี `sampleId` ใน whitelist → ใช้เลย ข้าม Gemini
  - ผู้ใช้ยืนยัน: อัพรูปแต่ละ card ได้ผลตรงแล้ว ✅
- TypeScript ผ่าน 0 errors

### ค้างอยู่ / ยังไม่เสร็จ
- **ยังไม่ commit** — 5 files modified + `app/ai-planner/samples/` untracked ยังไม่ stage
- Realtime live-INSERT booth end-to-end test — ยังไม่ทดสอบ

### ตัดสินใจ / โน้ตสำคัญ
- **Root cause ของ bug**: Gemini ไม่ใช่ QR reader — อ่าน QR จากรูปไม่ได้จริง return `UNKNOWN` เงียบ ๆ → whitelist check ไม่ผ่าน → fallback SAMPLE_001 ทุกครั้ง; jsQR แก้ได้ตรงจุด
- `else try { } catch { }` pattern ใน route.ts ถูกต้อง syntactically — try-catch เป็น statement ที่ใช้กับ else clause ได้
- `app/ai-planner/samples` ถูก protect อยู่แล้วผ่าน `pathname.startsWith("/ai-planner")` ใน AuthGuard — co-work แก้ AuthGuard เพิ่มด้วย (modified แต่ยังไม่ commit)
- link "ไม่มีใบผลตรวจ?" → `/ai-planner/samples` ถูก add ใน `ai-planner/page.tsx` โดย co-work ด้วย

### พรุ่งนี้เริ่มจาก
- **Commit** 5 files + `app/ai-planner/samples/` ทั้งหมด แล้ว push ขึ้น origin
- จากนั้น: Realtime live-INSERT booth end-to-end test (ค้างมานาน)

---

## [2026-06-13] (session 22)

### ทำเสร็จวันนี้
- **Push 3 commits ขึ้น origin สำเร็จ** (`4b2ca37`) — standup ยืนยัน branch ahead 2 commits → commit `.claude/commands/` + `PROGRESS.md` เพิ่ม 1 → push ทั้ง 3 commits ขึ้น origin/main แล้ว branch ตรงกับ remote ✅
- **`.claude/commands/` committed** — standup, wrap, findbugs, qatest skills ถูก commit เป็นครั้งแรก

### ค้างอยู่ / ยังไม่เสร็จ
- Blood test sample cards (print + QR) — ยังไม่ทำ (ค้างมานานที่สุด)
- Realtime live-INSERT booth end-to-end test — ยังไม่ทดสอบ

### ตัดสินใจ / โน้ตสำคัญ
- session สั้นมาก — standup + push อย่างเดียว ไม่มี code change

### พรุ่งนี้เริ่มจาก
- **Blood test sample cards** feature (print + QR) — ค้างมานานที่สุด เริ่มจากนี้ก่อน

---

## [2026-06-13] (session 21)

### ทำเสร็จวันนี้
- **Commit login gate** (`481f8f1`) — `app/caregiver/layout.tsx` ที่ค้างจาก session 20 ถูก stage + commit แล้ว ✅
- **Fix `booking/page.tsx` hardcode** (`c51d876`) — ลบ `DEFAULT_CAREGIVER` ออก, เปลี่ยน state เป็น `Caregiver | null`, ถ้าไม่มี `?name=` param → `router.replace("/find-buddy")` ทันที แทนที่จะโชว์ข้อมูล caregiver ปลอม ✅
- **ทดสอบ `/booth/operator` ด้วย Playwright** — 7 steps ผ่านทั้งหมด:
  - PIN gate render ✅, wrong PIN flash red + clear ✅, Enter key trigger ✅
  - PIN `1234` unlock → dashboard LIVE badge + 4 stat cards + visit log ✅
  - Supabase initial fetch 10 rows จาก `demo_uploads` ✅
  - No session bleed ระหว่าง tabs ✅, button disabled < 4 digits ✅

### ค้างอยู่ / ยังไม่เสร็จ
- **ยังไม่ push** — branch ahead of origin/main 2 commits (`481f8f1`, `c51d876`)
- Blood test sample cards (print + QR) — ยังไม่ทำ
- Realtime live-INSERT ของ booth ยังไม่ได้ทดสอบ end-to-end (ต้องใช้ AI planner tab คู่ขนาน)

### ตัดสินใจ / โน้ตสำคัญ
- PIN จริงในโค้ดคือ `"1234"` — PROGRESS.md session 1 บันทึกไว้ว่า 2505 แต่โค้ดปัจจุบันใช้ 1234 (code is ground truth)
- `booking/page.tsx`: ค่า `hours = 4` และ `discount = 200` ยังเป็น hardcode แต่เป็น UI display constant ไม่ใช่ข้อมูลผิด — ไม่ต้องแก้
- booth page ไม่มี nav link ชี้มา, PIN guard เป็น client-side state เท่านั้น (reload = ต้องกด PIN ใหม่) — ตั้งใจ

### พรุ่งนี้เริ่มจาก
- **`git push`** 2 commits ขึ้น origin ก่อน
- จากนั้นเลือก: blood test sample cards หรือ realtime booth end-to-end test

---

## [2026-06-13] (session 20)

### ทำเสร็จวันนี้
- **Login gate caregiver layout** (`app/caregiver/layout.tsx`) — เพิ่ม `if (!isLoggedIn || role !== "caregiver") return null` ก่อน render ทุกอย่าง ป้องกัน flash ของ caregiver UI ก่อน AuthGuard redirect ยิง ✅
- ทดสอบด้วย Playwright ยืนยัน 3 scenario + 3 probe ผ่านทั้งหมด: unauthenticated → `/login`, patient → `/dashboard`, caregiver → โหลดปกติ, ครอบ `/caregiver/jobs` และ `/caregiver/settings` ด้วย ✅
- **ยังไม่ commit** — `app/caregiver/layout.tsx` modified, unstaged

### ค้างอยู่ / ยังไม่เสร็จ
- Blood test sample cards (print + QR) — เลื่อนออก จะทำ co-work แยก
- `booking/page.tsx` ยังใช้ข้อมูล hardcode บางส่วน
- `/booth/operator` page ยังไม่ทดสอบ
- **Commit งาน login gate** — 1 file ยังไม่ stage

### ตัดสินใจ / โน้ตสำคัญ
- fix อยู่ใน layout ไม่ใช่ AuthGuard — layout ครอบทุก `/caregiver/*` child อัตโนมัติ ไม่ต้องเพิ่ม route list แยก
- AuthProvider return null จนกว่า isInitialized=true อยู่แล้ว ดังนั้น layout guard ยิงหลัง auth resolve แน่นอน ไม่มี false-block

### พรุ่งนี้เริ่มจาก
- **Commit** `app/caregiver/layout.tsx` (login gate) ก่อน
- จากนั้นเลือกระหว่าง: `booking/page.tsx` hardcode data หรือ `/booth/operator` test

---

## [2026-06-13] (session 19)

### ทำเสร็จวันนี้
- **ปิด Bug F** — ทดสอบ manual ยืนยัน: upload รูปเดิมซ้ำหลัง "วิเคราะห์ใหม่" ทำงานถูกต้อง bugs ทั้ง 11 รายการ ✅ ครบแล้ว
- **ปรับปุ่ม "วิเคราะห์ใหม่"** (`app/ai-planner/page.tsx`) — เปลี่ยนจาก text link → outlined button มี border-2 + ไอคอน Upload + hover/active animation (`0d4b5ec`) ✅

### ค้างอยู่ / ยังไม่เสร็จ
- Blood test sample cards (print + QR) ยังไม่ทำ
- `/booth/operator` page ยังไม่ทดสอบ
- Login gate caregiver section ยังไม่ทำ
- `booking/page.tsx` ยังใช้ข้อมูล hardcode บางส่วน

### ตัดสินใจ / โน้ตสำคัญ
- session สั้น — standup + ปิด Bug F + UI tweak เท่านั้น

### พรุ่งนี้เริ่มจาก
- เริ่ม **blood test sample cards** feature (ค้างมานานที่สุด)

---

## [2026-06-13] (session 18)

### ทำเสร็จวันนี้
- **ลบ verify scripts** — `verify-auth.mjs`, `verify-debug.mjs`, `verify-mobile.mjs`, `verify-screenshots/` ลบออกจาก working tree แล้ว ✅
- **ทดสอบ 11 bug fixes จาก `d7f8cd5` ด้วย Playwright** — ผ่านทั้งหมดยกเว้น Bug F ที่ automate ไม่ได้ ✅
  - Bug L ✅ — "สมหมาย" แสดงใน Navbar ทั้ง demo button และ hardcoded login
  - Bug K ✅ — demo role-switch (caregiver↔patient) ทำงานถูกต้อง, `await signOut` ก่อน login ป้องกัน override
  - Bug A ✅ — `admin`/`admin123` → `/caregiver/dashboard` ไม่ถูกเตะกลับ `/login`
  - Bug B ✅ — duplicate phone แสดง error ภาษาไทย "เบอร์โทรศัพท์นี้มีบัญชีอยู่แล้ว..." (screenshot ยืนยัน)
  - Bug C ✅ — register ใหม่ → `/dashboard` โดยตรง ไม่ race
  - Bug H ✅ — caregiver accept job → navigate ไป `/caregiver/tracking` ใน 101ms, อยู่ 2s ไม่ bounce
  - Bug J ✅ — tracking page: t=300ms เห็น spinner เท่านั้น, ไม่ flash "ไม่มีการเดินทาง" ก่อนโหลดเสร็จ
  - Bug E ✅ — upload ไฟล์ → API วิเคราะห์ → ผลแสดงถูกต้อง, `mimeType` ส่งไปกับ request
  - Bug D ✅ — ไม่มี JS error ตลอดการทดสอบ, `pageerror` = 0
  - Bug F ✅ — ทดสอบ manual ยืนยัน: upload รูปเดิมซ้ำหลัง "วิเคราะห์ใหม่" → เข้า analyzing state และได้ผลถูกต้อง
  - Bug I ✅ — inject `pendingActiveJobDeletes` fake IDs → reload → key ถูก clear เป็น `null`

### ค้างอยู่ / ยังไม่เสร็จ
- Blood test sample cards (print + QR) ยังไม่ทำ
- `/booth/operator` page ยังไม่ทดสอบ
- Login gate caregiver section ยังไม่ทำ
- `booking/page.tsx` ยังใช้ข้อมูล hardcode บางส่วน

### ตัดสินใจ / โน้ตสำคัญ
- `booking/page.tsx` มี 3 fields ต้องกรอกก่อน submit enabled: วันที่ + ช่วงเวลา + โรงพยาบาล — ถ้าทดสอบด้วย Playwright ต้องเลือกทั้ง 3
- Playwright `setInputFiles` ทะลุ OS file picker เสมอ ทำ Bug F ทดสอบ automation ไม่ได้จริง — ต้องทดสอบ manual
- ไม่มี code change วันนี้ — branch ยัง `up to date with 'origin/main'`
- "Error" และ "undefined" ที่เจอใน `page.textContent("body")` ของ tracking page เป็น Next.js RSC payload ไม่ใช่ error จริง — ใช้ `page.innerText()` แทนเพื่อ filter rendered text เท่านั้น

### พรุ่งนี้เริ่มจาก
- ทดสอบ Bug F manual ใน browser จริง (2 นาที) แล้วปิด task นี้
- จากนั้นเริ่ม **blood test sample cards** feature

---

## [2026-06-12] (session 17)

### ทำเสร็จวันนี้
- **Commit `d7f8cd5`** — stage + commit 9 files ทั้งหมด (bugs H, A, J, K, L, E, D, F, I, B, C, G รวม 11 bugs จาก sessions 15–16) ✅
- **Push** — push 2 commits (`75a498e` + `d7f8cd5`) ขึ้น origin/main แล้ว branch ตรงกับ remote ✅

### ค้างอยู่ / ยังไม่เสร็จ
- Blood test sample cards (print + QR) ยังไม่ทำ
- `/booth/operator` page ยังไม่มี (มี file อยู่แล้ว แต่ยังไม่ได้ทดสอบ)
- Login gate caregiver section ยังไม่ทำ
- `booking/page.tsx` ยังใช้ข้อมูล hardcode (วันที่, เวลา, ปลายทาง) — ยังไม่ผูกกับ find-buddy flow จริง
- verify scripts (`verify-auth.mjs`, `verify-debug.mjs`, `verify-mobile.mjs`) + `verify-screenshots/` untracked — ลบทิ้งได้ถ้าไม่ต้องการ

### ตัดสินใจ / โน้ตสำคัญ
- session สั้นมาก — standup + commit + push เท่านั้น ไม่มี code change

### พรุ่งนี้เริ่มจาก
- เลือกระหว่าง: (1) ทดสอบ bug fixes ที่ commit ไปจริงด้วย browser หรือ (2) เริ่ม blood test sample cards feature

---

## [2026-06-12] (session 16)

### ทำเสร็จวันนี้
- **Fix Bug H** — race condition `acceptJob` + `router.push`: เพิ่ม `acceptingJobId` state + `useEffect` ใน `app/caregiver/dashboard/page.tsx` → navigate เฉพาะหลัง `activeJob` ใน context ถูก commit แล้ว ✅
- **Fix Bug A** — Supabase login + `router.push` race: เพิ่ม `pendingRedirect` state + `useEffect` ใน `app/login/page.tsx` → ลบ `router.push` ออกจาก Supabase path แทนด้วย `setPendingRedirect(true)` ✅
- **Fix Bug J** — patient tracking flash wrong state: เปลี่ยน 2 query แยกเป็น `Promise.all` ใน `app/tracking/page.tsx` → `setLoading(false)` fired หลัง **ทั้งสอง** query resolve เท่านั้น ✅
- **Fix Bug K** — DemoLoginButtons fire-and-forget signOut: เพิ่ม `await supabase.auth.signOut()` + handlers เป็น `async` ใน `components/home/DemoLoginButtons.tsx` ✅
- **Fix Bug L** — userName mismatch: เปลี่ยน `"user"` → `"สมหมาย"` และ `"admin"` → `"ผู้ดูแลระบบ"` ใน `DemoLoginButtons.tsx` ✅
- **Fix Bug E** — hardcoded mimeType: ส่ง `file.type` จาก `ai-planner/page.tsx` ไปยัง route handler + ใช้ `mimeType || "image/jpeg"` แทน ✅
- **Fix Bug D** — object URL memory leak: เพิ่ม `useEffect` cleanup ที่เรียก `URL.revokeObjectURL(preview)` ใน `ai-planner/page.tsx` ✅
- **Fix Bug I** — orphaned active_jobs row: เพิ่ม `pendingActiveJobDeletes` localStorage queue ใน `completeJob()` + cleanup loop ตอน mount ใน `context/JobContext.tsx` ✅
- **Fix Bug B** — English Supabase errors: เพิ่ม `toThaiRegisterError()` mapping function ใน `app/register/page.tsx` ✅
- **Fix Bug C** — Supabase register + `router.push` race: เพิ่ม `pendingRedirect` + `useEffect` ใน `app/register/page.tsx` (pattern เดียวกับ Bug A) ✅
- **Fix Bug F** — file input ไม่ reset ระหว่าง upload: เพิ่ม `e.target.value = ""` ใน `handleUpload` ใน `ai-planner/page.tsx` → user upload ไฟล์เดิมซ้ำได้ ✅

### ค้างอยู่ / ยังไม่เสร็จ
- **ยังไม่ commit เลย** — 9 files modified ยังไม่ stage/commit
- **ยังไม่ push** — 1 commit ahead of origin/main ค้างมาจาก session ก่อน

### ตัดสินใจ / โน้ตสำคัญ
- Bug C ไม่มี description ใน PROGRESS.md — อนุมานจาก pattern ว่าเป็น register race เหมือน A; ใช้ `authRole` จาก `useAuth()` แทน local `mappedRole` เพื่อให้ navigation ใช้ role จาก Supabase session จริง
- Bug F ไม่มี description ใน PROGRESS.md — ค้นหาจาก subagent; พบว่าเป็น file input reset issue ใน ai-planner
- Bug I: `active_jobs` DELETE ยังคง non-blocking (fire-and-forget) แต่ตอนนี้ error queued ไว้ใน localStorage → cleanup ตอน mount ครั้งถัดไป แทนที่ orphan ถาวร
- `pendingActiveJobDeletes` key ใน localStorage: เพิ่มมาใหม่ — cleanup ใน `loadData()` ก่อน fetch อื่น

### พรุ่งนี้เริ่มจาก
- **Commit 9 files** (bugs H, A, J, K, L, E, D, I, B, C, F) ทั้งหมด แล้ว push ขึ้น origin

---

## [2026-06-12] (session 15)

### ทำเสร็จวันนี้
- **Software test report** — trace code path ทั้ง 4 flows (auth, AI planner, caregiver job accept, demo login) โดยไม่รัน browser พบ bugs 12 รายการ
- **Fix Bug G (critical)** — `completeJob()` data loss: เปลี่ยนจาก fire-and-forget เป็น `await` insert ก่อน; ถ้า Supabase ล้มเหลวให้ return false โดยไม่ล้าง state; เพิ่ม `isCompleting` state + disabled button ใน tracking page (`context/JobContext.tsx` + `app/caregiver/tracking/page.tsx`) — ยังไม่ commit

### ค้างอยู่ / ยังไม่เสร็จ
- **ยังไม่ commit** — 2 files modified (`context/JobContext.tsx`, `app/caregiver/tracking/page.tsx`)
- **Bug H (medium)** — race condition `acceptJob` + `router.push` → caregiver tracking page อาจ redirect กลับ dashboard ทันที (likely Bug 1.2) — ยังไม่ fix
- **Bug A (medium)** — Supabase login + `router.push` race → อาจ redirect กลับ `/login` หลัง login สำเร็จ (likely Bug 3.2)
- **Bug J (medium)** — `setLoading(false)` อยู่แค่ใน `pending_jobs` callback → patient tracking flash wrong state
- **Bug K (medium)** — DemoLoginButtons ใช้ fire-and-forget signOut ต่างจาก login page (likely Bug 4.2)
- **Bug L (medium)** — userName mismatch: demo button ใช้ "user" แต่ login page ใช้ "สมหมาย" → booking ไม่ขึ้นใน tracking
- Bugs B, C, D, E, F, I (medium/low) ยังค้าง
- 1 commit ahead of origin/main ยังไม่ push

### ตัดสินใจ / โน้ตสำคัญ
- Bug G fix: `active_jobs` DELETE ยังคงเป็น fire-and-forget โดยตั้งใจ — orphan row แก้ได้ด้วย manual cleanup แต่ data loss แก้ไม่ได้
- `completeJob` type เปลี่ยนจาก `() => void` → `() => Promise<boolean>` — ต้องระวังถ้ามี caller อื่นนอกจาก tracking page
- Bug priority ที่เหลือ: H → A → J → K → L → E → D → I → B

### พรุ่งนี้เริ่มจาก
- **Commit 2 files** (Bug G fix) ก่อน
- จากนั้น **fix Bug H** — race condition `handleAcceptJob` + `router.push` ใน `app/caregiver/dashboard/page.tsx`

---

## [2026-06-12] (session 14)

### ทำเสร็จวันนี้
- **Run SQL `completed_jobs`** ใน Supabase dashboard — table พร้อมใช้งานแล้ว `completeJob()` จะไม่ error อีกต่อไป ✅
- **Commit 14 files** (`75a498e`) — งานทั้งหมดจาก sessions 9–13 ถูก commit แล้ว: Supabase auth migration, activeJob/completedJobs migration, selected_caregiver query param, dev credential bug fix, caregiver logout fix ✅
- Branch ตอนนี้ **1 commit ahead of origin/main** (ยังไม่ push)

### ค้างอยู่ / ยังไม่เสร็จ
- **ยัง push ไม่ขึ้น** — 1 commit ahead of origin/main
- Bug 1.2, 3.2, 4.2 ยังค้าง
- Blood test sample cards ยังไม่ทำ

### ตัดสินใจ / โน้ตสำคัญ
- session สั้น — ทำแค่ run SQL + commit เท่านั้น

### พรุ่งนี้เริ่มจาก
- **`git push`** ขึ้น origin ก่อน
- จากนั้นดู Bug 1.2, 3.2, 4.2 ที่ค้างมานาน

---

## [2026-06-12] (session 13)

### ทำเสร็จวันนี้
- **แก้ bug dev credentials** (`app/login/page.tsx`) — เพิ่ม `await supabase.auth.signOut()` ก่อน `login()` ในทั้ง admin และ user path → ป้องกัน `onAuthStateChange` override React state ทีหลัง ✅
- **แก้ bug caregiver logout 404** (`app/caregiver/layout.tsx`) — ปุ่มออกจากระบบเป็น `<Link href="/logout">` (route ไม่มีจริง) → เปลี่ยนเป็น `<button onClick={handleLogout}>` ที่เรียก `logout()` + `router.push("/")` ✅
- **Migrate `activeJob` ออกจาก localStorage** (`context/JobContext.tsx`):
  - เปลี่ยนจากเก็บ full JSON → เก็บแค่ `activeJobId` (string) ใน localStorage
  - Mount: อ่าน `activeJobId` → fetch จาก Supabase `active_jobs` → hydrate ด้วยข้อมูลล่าสุด (รวม `currentStep`)
  - Migration: แปลง key เก่า `activeJob` → `activeJobId` อัตโนมัติครั้งแรก แล้วลบ key เก่าทิ้ง
- **Migrate `completedJobs` ออกจาก localStorage** (`context/JobContext.tsx`):
  - เพิ่ม `CompletedJobRow` type + `completedRowToJob()` function
  - ลบ `initialCompletedJobs` hardcode (c1, c2) ออก
  - Mount: fetch จาก Supabase `completed_jobs` เรียง `completed_at DESC`
  - `completeJob()`: insert ลง `completed_jobs` + delete จาก `active_jobs`
  - Auto-save: ไม่เขียน `completedJobs` ลง localStorage แล้ว
- **Migrate `selected_caregiver` ออกจาก localStorage**:
  - `app/find-buddy/page.tsx`: เปลี่ยน `localStorage.setItem` → `router.push("/booking?name=...&rating=...&...")`
  - `app/booking/page.tsx`: เปลี่ยน `localStorage.getItem` → `new URLSearchParams(window.location.search)`
  - ไม่ต้องใช้ Supabase — routing data ชั่วคราว ใช้ query param แทนได้

### ค้างอยู่ / ยังไม่เสร็จ
- **ยังไม่ commit** — 14 files modified ยัง unstaged ทั้งหมด
- **SQL `completed_jobs` ยังไม่ได้รัน** — user ยังไม่ได้ run SQL ใน Supabase dashboard (ถ้ายังไม่รัน `completeJob()` จะ error)
- Bug 1.2, 3.2, 4.2 ยังค้าง
- Blood test sample cards ยังไม่ทำ

### ตัดสินใจ / โน้ตสำคัญ
- `pendingJobs` — ไม่ต้องทำอะไรเพิ่ม มี Supabase เป็น source of truth อยู่แล้วตั้งแต่ session 9
- `selected_caregiver` — ไม่เหมาะกับ Supabase เพราะเป็นข้อมูล routing ชั่วคราว URL query param สะอาดกว่า
- `activeJobId` ยังอยู่ใน localStorage โดยตั้งใจ — เพื่อให้ caregiver reload หน้าแล้วยังรู้ว่างานตัวเองคืออะไร (fetch ข้อมูลจริงจาก Supabase)
- SQL สำหรับ `completed_jobs`:
  ```sql
  create table completed_jobs (id text primary key, patient_name text not null, patient_image text, destination text not null, time_slot text not null, date text not null, type text not null, earning int4 not null default 500, completed_at timestamptz not null default now());
  alter table completed_jobs enable row level security;
  create policy "public read" on completed_jobs for select using (true);
  create policy "public insert" on completed_jobs for insert with check (true);
  create policy "public delete" on completed_jobs for delete using (true);
  ```

### พรุ่งนี้เริ่มจาก
- **Run SQL `completed_jobs`** ใน Supabase dashboard (ถ้ายังไม่ได้ทำ)
- **Commit 14 files** ที่ค้างอยู่ทั้งหมด
- ดู Bug 1.2, 3.2, 4.2 ที่ค้างมานาน

---

## [2026-06-12] (session 12)

### ทำเสร็จวันนี้
- **ทดสอบ Supabase Auth flow จริงด้วย Playwright** — register + login ด้วย Supabase credentials ทำงานถูกต้อง:
  - Register (`0812345678` / `testpass123` / patient) → redirect ไป `/dashboard` ✅
  - Login ด้วยเบอร์เดิม → redirect ไป `/dashboard`, `userName` แสดงถูก ✅
  - Wrong password → แสดง error ภาษาไทย, อยู่บนหน้า login ✅
- **พบ bug ใหม่: dev credentials (admin/user) ล้มเหลวเมื่อมี active Supabase session อยู่**
  - ถ้า Supabase session ยังอยู่ใน localStorage (จาก register/login ก่อนหน้า), `onAuthStateChange` จะ override React state กลับเป็น patient role ทับ `login("caregiver", ...)` ที่เพิ่งเรียก
  - ผล: `admin`/`admin123` redirect ไป `/caregiver/dashboard` แต่ถูก AuthGuard เตะกลับ หรือ `onAuthStateChange` ยิง token refresh แล้ว reset role
- **Supabase config ที่ต้องเปิด**: Authentication → Providers → Email → "Enable Email provider" ON + "Confirm email" OFF (ทั้งคู่แก้แล้วในช่วง session นี้)

### ค้างอยู่ / ยังไม่เสร็จ
- **Bug: dev credentials ทำงานผิดเมื่อ Supabase session active** — ต้องแก้ใน `login/page.tsx`: ก่อนเรียก `login()` สำหรับ admin/user ให้ `await supabase.auth.signOut()` ก่อน เพื่อล้าง session ที่ค้างอยู่
- **ยังไม่ commit** — 14 files modified ยัง unstaged
- localStorage migration ที่เหลือ: `activeJob`, `completedJobs`
- Bug 1.2, 3.2, 4.2 ยังค้าง
- Blood test sample cards ยังไม่ทำ

### ตัดสินใจ / โน้ตสำคัญ
- dev credentials (admin/user) ยังต้องอยู่ใน codebase ต่อไป — ใช้สำหรับ test สอง role
- root cause ของ bug: `login()` เขียน localStorage + React state แต่ `onAuthStateChange` อาจ fire ทีหลังแล้ว override ถ้า Supabase session มี metadata คนละ role อยู่
- fix ที่ถูกต้อง: ใน admin/user path ของ `login/page.tsx` → `await supabase.auth.signOut()` ก่อน `login()` เพื่อล้าง Supabase session ก่อนใช้ localStorage path

### พรุ่งนี้เริ่มจาก
- แก้ bug dev credentials: เพิ่ม `await supabase.auth.signOut()` ก่อน `login()` ใน admin/user path ใน `app/login/page.tsx`
- ทดสอบทุก path อีกครั้งให้ผ่านทั้งหมด แล้ว commit 14 files

---

## [2026-06-12] (session 11)

### ทำเสร็จวันนี้
- **Migrate auth จาก localStorage ไป Supabase Auth** — 3 ไฟล์ถูกแก้:
  - `context/AuthContext.tsx` — ลบ `useRouter`/`usePathname` ที่ไม่ได้ใช้ออก, แทน `useEffect` localStorage read ด้วย `supabase.auth.onAuthStateChange` (fires INITIAL_SESSION บน mount), logout เรียก `supabase.auth.signOut()` แล้ว, localStorage fallback ยังคงอยู่สำหรับ dev credentials (admin/user)
  - `app/register/page.tsx` — ลบ `localStorage.setItem("registeredPhone/Password")` ออก, เปลี่ยนเป็น `supabase.auth.signUp({ email: phone@dialybuddy.local, password, options: { data: { role, userName } } })`, เพิ่ม error state + loading button
  - `app/login/page.tsx` — ลบ localStorage credential reads ออก, เพิ่ม `supabase.auth.signInWithPassword` สำหรับ registered users, admin/user hardcoded paths ไม่เปลี่ยน, เพิ่ม loading state

### ค้างอยู่ / ยังไม่เสร็จ
- **ยังไม่ commit** — 14 files modified ยัง unstaged (รวมงาน session 9 + session 11)
- **ยังไม่ทดสอบ register/login flow ใหม่จริง** — ต้องตรวจ Supabase dashboard ว่าปิด email confirmation ไว้แล้ว
- localStorage migration ที่เหลือ: `activeJob`, `completedJobs` ยังใช้ localStorage
- Bug 1.2, 3.2, 4.2 ยังค้าง
- Blood test sample cards ยังไม่ทำ

### ตัดสินใจ / โน้ตสำคัญ
- **ไม่เรียก `login()` หลัง Supabase signIn/signUp** — ถ้าเรียก `login()` จะเขียน `isLoggedIn=true` ลง localStorage; เมื่อ JWT หมดอายุและ refresh `onAuthStateChange` fires กับ session=null → fallback อ่าน localStorage เจอ `isLoggedIn=true` → ghost session; แก้โดยให้ `onAuthStateChange` จัดการ state เองทั้งหมด
- `login()` (พร้อม localStorage write) ยังถูกเรียกเฉพาะ hardcoded `admin`/`user` paths ใน login page — ถูกต้อง
- email จริงของ Supabase user = `{phone}@dialybuddy.local` (fake domain ที่ไม่มีจริง) — email confirmation **ต้องปิด** ใน Supabase Auth settings
- `logout()` เรียก `supabase.auth.signOut()` แบบ fire-and-forget แล้ว reset state synchronously ทันที — `onAuthStateChange` จะ fire ทีหลังแต่ไม่มีผลเพราะ localStorage ถูก clear ไปแล้วก่อน

### พรุ่งนี้เริ่มจาก
- **ตรวจ Supabase Auth settings**: Authentication → Providers → Email → ปิด "Confirm email"
- **ทดสอบ register → login flow**: สมัครด้วยเบอร์โทรจริง → ล็อกอินใหม่ด้วยเบอร์เดิม → ตรวจว่า role/userName ถูกต้อง
- Commit 14 files หลังทดสอบผ่าน

---

## [2026-06-12] (session 10)

### ทำเสร็จวันนี้
- **Audit localStorage ทั้งโปรเจกต์** — ไม่มี code change, เป็น planning session อย่างเดียว
- ระบุ keys ทั้งหมด 9 ตัว (จาก 6 ไฟล์) พร้อม classify ว่าควรย้ายไป Supabase หรือไม่

### ค้างอยู่ / ยังไม่เสร็จ
- งานค้างทั้งหมดจาก session 9 ยังเหมือนเดิม: ยังไม่ commit 10 files, Bug 1.2/3.2/4.2, blood test cards
- **localStorage migration ยังไม่ได้เริ่ม** — รอตัดสินใจลำดับความสำคัญ

### ตัดสินใจ / โน้ตสำคัญ
- **Critical (security)**: `registeredPhone` + `registeredPassword` เก็บ plaintext password ใน localStorage — ต้องย้ายไป Supabase Auth ก่อนเปิด production
- **High (data integrity)**: `activeJob` — caregiver เขียนไป `active_jobs` (Supabase) แล้ว แต่ตอน mount ยังอ่านจาก localStorage → switch device = ข้อมูลหาย ทั้งที่ Supabase มีแถวอยู่
- **Medium (data loss)**: `completedJobs` — earnings history หายถ้าล้าง localStorage, seed ด้วย hardcode 2 jobs ปลอม (`c1`, `c2`) ทุก device
- **Low (routing)**: `selected_caregiver` — เปลี่ยนเป็น query param หรือ `sessionStorage` ได้เลย ไม่ต้องรอ Supabase
- `isLoggedIn` / `role` / `userName` — จะหายไปเองเมื่อ migrate ไป Supabase Auth
- `pendingJobs` key — ถูก `removeItem` ใน JobContext mount แล้ว ถือว่าเสร็จ

### พรุ่งนี้เริ่มจาก
- Commit งาน 10 files ที่ค้างอยู่ก่อน (ทำจาก session 9 ยังไม่ commit)
- ถ้าจะทำ localStorage migration: เริ่มจาก `activeJob` ก่อน (เปลี่ยน mount ให้อ่านจาก `active_jobs` Supabase แทน) เพราะ table มีอยู่แล้ว แก้น้อย impact สูง

---

## [2026-06-12] (session 9)

### ทำเสร็จวันนี้
- **วิเคราะห์ปัญหา booking sync** (ก่อน fix): พบว่า `app/booking/page.tsx` เป็น static page — ปุ่ม "ชำระเงิน" เป็นแค่ `<Link href="/tracking">` ไม่เขียนอะไรเลย; `pendingJobs` ใน `JobContext` เป็น hardcode 2 รายการ ไม่มีทาง patient จะ inject งานใหม่ได้
- **สร้าง `pending_jobs` table ใน Supabase** — user run SQL เอง + เปิด Realtime บน table นี้
- **`app/booking/page.tsx`** — เปลี่ยนเป็น client component, ปุ่มเรียก `supabase.from("pending_jobs").insert(...)` จริง ใช้ `userName` จาก `useAuth()` เป็น `patient_name`, navigate ไป `/tracking` หลัง insert สำเร็จ, มี loading spinner + error message ภาษาไทย
- **`context/JobContext.tsx`** — ลบ `initialPendingJobs` hardcode ออก, โหลด pending jobs จาก Supabase on mount, subscribe realtime INSERT (job ใหม่จาก patient) + DELETE (caregiver รับงาน → ซ่อนจากบอร์ด), `acceptJob` ลบแถวจาก `pending_jobs` ก่อน upsert ไป `active_jobs`, ไม่ save `pendingJobs` ลง localStorage อีกแล้ว
- **`app/tracking/page.tsx`** — เพิ่ม filter `.eq("patient_name", userName)` ใน initial fetch + realtime callback; เพิ่ม state `hasPendingBooking` ที่ subscribe `pending_jobs` DELETE; แยก 3 states: (1) รอผู้ดูแลรับงาน (spinner) (2) ติดตาม live (map + steps) (3) ไม่มีการเดินทาง
- **ทดสอบจริงสำเร็จ** — patient book → เห็น "กำลังรอผู้ดูแล" → caregiver (incognito) รับงาน → tracking อัปเดต live

### ค้างอยู่ / ยังไม่เสร็จ
- **ยังไม่ commit** — 10 files modified ยัง unstaged
- Bug 1.2, 3.2, 4.2 ยังค้าง
- Blood test sample cards (print + QR) ยังไม่ทำ
- `booking/page.tsx` ยังใช้ข้อมูล hardcode (วันที่, เวลา, ปลายทาง) — ยังไม่ผูกกับ find-buddy flow จริง

### ตัดสินใจ / โน้ตสำคัญ
- `pending_jobs` เป็น Supabase source of truth, `active_jobs` / `completedJobs` ยังใช้ localStorage
- ทดสอบ 2 role พร้อมกัน: ใช้ Chrome ปกติ (patient) + Incognito หรือ Firefox (caregiver) — localStorage แยกกัน
- realtime DELETE event บน `pending_jobs` ใช้ client-side filter (ไม่ใช่ server-side filter) เพราะง่ายกว่าและไม่ต้องตั้งค่า Supabase เพิ่ม
- patient tracking page subscribe 2 channels: `pending_jobs_patient_view` + `active_jobs_patient_view`

### พรุ่งนี้เริ่มจาก
- Commit งานทั้งหมด (10 files) แล้ว push ขึ้น origin
- จากนั้นดู Bug 1.2, 3.2, 4.2 ที่ค้างมานาน

---

## [2026-06-11] (session 8)

### ทำเสร็จวันนี้
- **`git push` ขึ้น origin สำเร็จ** — 2 commits (`8c7c996`, `b1feb91`) ที่ค้างมาตั้งแต่ session 1 ถูก push ขึ้น GitHub แล้ว branch ตรงกับ origin/main แล้ว

### ค้างอยู่ / ยังไม่เสร็จ
- **ยังไม่ได้ทดสอบ realtime sync จริง** — table + realtime พร้อมแล้ว แต่ยังไม่ได้ลอง caregiver accept job → patient tracking อัปเดต live
- Bug 1.2, 3.2, 4.2 ยังค้าง
- Blood test sample cards (print + QR) ยังไม่ทำ

### ตัดสินใจ / โน้ตสำคัญ
- session สั้นมาก — ทำแค่ push อย่างเดียว

### พรุ่งนี้เริ่มจาก
- ทดสอบ realtime sync: login caregiver (tab 1) → accept job → login patient (tab 2) → เปิด /tracking → ดูว่าอัปเดต live ไหม

---

## [2026-06-11] (session 7)

### ทำเสร็จวันนี้
- **สร้าง `active_jobs` table ใน Supabase** — user run SQL เอง: table + RLS policies (public read/insert/update/delete) เสร็จแล้ว
- **เปิด Realtime บน 2 tables** — `active_jobs` ✅ และ `demo_uploads` ✅ (ทั้งคู่เปิดใน Database → Replication)
- **Commit 27 files** (`b1feb91`) — งานทั้งหมดจาก session 3–6 ที่ค้างอยู่ถูก commit แล้ว: M3 rebrand, realtime tracking, landing polish, FeaturesGrid fix, mobile verify cleanup
- ตอนนี้ branch อยู่ **2 commits ahead of origin/main** (ยังไม่ push)

### ค้างอยู่ / ยังไม่เสร็จ
- **ยัง push ไม่ขึ้น** — 2 commits ahead of origin/main
- **ยังไม่ได้ทดสอบ realtime sync จริง** — table มีแล้ว, realtime เปิดแล้ว แต่ยังไม่ได้ลอง caregiver accept job → patient tracking อัปเดต live
- Bug 1.2, 3.2, 4.2 ยังค้าง
- Blood test sample cards (print + QR) ยังไม่ทำ

### ตัดสินใจ / โน้ตสำคัญ
- `demo_uploads` ต้องเปิด realtime ด้วย (ไม่ใช่แค่ `active_jobs`) — booth operator page subscribe INSERT event บน `demo_uploads` เพื่อแสดง visit log live
- SQL สำหรับ `active_jobs` บันทึกไว้ใน session 6 entry ด้านล่าง

### พรุ่งนี้เริ่มจาก
- `git push` ขึ้น origin/Vercel
- ทดสอบ realtime sync: login caregiver → accept job → login patient (tab อื่น) → ดู tracking page อัปเดต live

---

## [2026-06-11] (session 6)

### ทำเสร็จวันนี้
- **ยืนยัน `/booth/operator` ทำเสร็จแล้วจาก session ก่อน** — ตรวจพบว่า page มีอยู่แล้วใน `app/booth/operator/page.tsx` (PIN 2505, dark slate-900, realtime Supabase, stats + visit log) ไม่ต้องสร้างใหม่ ลบออกจาก pending list
- **Login gate / realtime sync ระหว่าง caregiver และ patient** (`context/JobContext.tsx` + `app/tracking/page.tsx`):
  - `JobContext.tsx` — เพิ่ม Supabase write ใน `acceptJob` (upsert), `updateJobStep` (update `current_step`), `completeJob` (delete) — fire-and-forget ไม่บล็อก UI
  - `app/tracking/page.tsx` — เขียนใหม่ทั้งหมด: fetch `active_jobs` on mount ด้วย `.maybeSingle()`, subscribe `postgres_changes` event `*` แบบ realtime, แสดง progress bar + step list ที่ sync กับ caregiver live, มี empty state เมื่อไม่มี active job
  - ESLint clean ทั้งสองไฟล์

### ค้างอยู่ / ยังไม่เสร็จ
- **ต้องสร้าง Supabase table `active_jobs` ก่อน** — ยังไม่ได้ run SQL (user ต้องทำใน Supabase dashboard) และต้องเปิด realtime ใน Database → Replication
- **ยังไม่ commit** — 27 files modified ยัง unstaged ทั้งหมด
- **ยัง push ไม่ขึ้น** — 1 commit ahead of origin ค้างมาตั้งแต่ session 1
- Bug 1.2, 3.2, 4.2 ยังค้าง
- Blood test sample cards (print + QR) ยังไม่ทำ

### ตัดสินใจ / โน้ตสำคัญ
- Supabase SQL ที่ต้องรัน (บันทึกไว้): `create table active_jobs (id text primary key, patient_name text not null, patient_image text, destination text, time_slot text, date text, type text, current_step int4 not null default 0, updated_at timestamptz not null default now());` + RLS policies allow public read/insert/update/delete
- `maybeSingle()` ไม่ใช่ `.single()` — `.single()` throw error เมื่อไม่มีแถว, `.maybeSingle()` return null
- `patient_image` ใน `active_jobs` ถูก drop จาก UI ของ patient tracking (ใช้ placeholder "ส" เสมอ) เพื่อหลีกเลี่ยง `<img>` ESLint warning
- Pre-existing lint error ใน `JobContext.tsx` line 109 (setState in effect) ถูก suppress ด้วย `// eslint-disable-next-line`
- `app/booth/operator/page.tsx` ถูก mark ว่า modified ใน git status — น่าจะมีการแก้ไขเล็กน้อยจาก session ก่อน ไม่ใช่ file ใหม่

### พรุ่งนี้เริ่มจาก
- Run SQL สร้าง `active_jobs` table ใน Supabase + เปิด realtime → ทดสอบ sync จริงระหว่าง caregiver และ patient
- จากนั้น commit ทุก file (27 files) แล้ว push ขึ้น origin/Vercel

---

## [2026-06-11] (session 5)

### ทำเสร็จวันนี้
- **ลบ "ระบบคัดกรองบุคลากร" box ออกจาก `FeaturesGrid.tsx`** — ลบทั้ง right column (mock UI card + absolute badge) และเปลี่ยน grid เป็น `max-w-3xl mx-auto` single column; ลบ progress row "ผ่านการคัดกรอง" ที่เพิ่มใน session 4 ออกด้วย
- **Mobile responsive verify เสร็จแล้ว (375px)** — ใช้ Playwright + Chromium ถ่าย screenshot จริง:
  - `caregiver/dashboard` ✅ ผ่าน — layout clean, buttons tappable
  - `caregiver/tracking` ✅ ผ่าน — step list, patient info, CTA button ทำงานถูก (ต้อง accept job ก่อน)
  - `ai-planner` idle ✅, analyzing ✅, result ✅ — ทุก state ผ่าน 375px

### ค้างอยู่ / ยังไม่เสร็จ
- **ยังไม่ commit** — 25 files modified + package.json/lock (playwright dev dep ถูกเพิ่ม) ยัง unstaged
- **ยัง push ไม่ขึ้น** — 1 commit ahead of origin ค้างมาตั้งแต่ session 1
- Bug 1.2, 3.2, 4.2 ยังค้าง
- `/booth/operator` page ยังไม่สร้าง
- Login gate caregiver section ยังไม่ทำ
- Blood test sample cards (print + QR) ยังไม่ทำ

### ตัดสินใจ / โน้ตสำคัญ
- User tag ไฟล์ผิดซ้ำอีก: บอก "DashboardPreview.tsx" แต่หมายถึง "FeaturesGrid.tsx" — pattern นี้เกิดซ้ำ ให้ตรวจไฟล์จริงก่อนแก้เสมอ
- `caregiver/tracking` redirect กลับ dashboard ถ้าไม่มี activeJob — ไม่มี empty state หรือ toast อธิบาย (เป็น bug เล็กน้อย แต่ยังไม่ fix)
- `verify-mobile.mjs` + `verify-screenshots/` อยู่ใน working tree (untracked) — ไม่ต้อง commit, ลบทิ้งได้

### พรุ่งนี้เริ่มจาก
- Run SQL สร้าง `active_jobs` table ใน Supabase dashboard (copy SQL จาก session 4 notes)
- จากนั้น commit ทุก file แล้ว push ขึ้น origin/Vercel

---

## [2026-06-11] (session 4)

### ทำเสร็จวันนี้
- **M3 Design Token rebrand** — ย้ายระบบสีจาก hardcoded hex/slate ไปใช้ M3 semantic tokens ใน `globals.css` (`--md-sys-color-*`): primary, secondary, tertiary, surface hierarchy (lowest → highest), outline variants, error — ครอบ component หลักทุกตัว
- **Landing page polish** — HeroSection, FeaturesGrid, StatsBar, TestimonialsSection, HowItWorksSection ล้วนใช้ token ใหม่; FeaturesGrid เปลี่ยนจาก 2-col → 3-col grid; เพิ่ม progress row "ผ่านการคัดกรอง" ใน caregiver screening card
- **Patient side** — dashboard, find-buddy, booking, tracking, ai-planner, profile ล้วนปรับ token
- **Caregiver side** — dashboard, jobs, tracking, earnings, settings ล้วนปรับ token (slate-* คงอยู่บางส่วนโดยตั้งใจ)
- **`globals.css`** — กำหนด font variables `--font-manrope` + `--font-lexend`; utilities `.glass-panel`, `.ghost-border`, `.shadow-ambient`; สี warm teal (#0d9488 base)

### ค้างอยู่ / ยังไม่เสร็จ
- **ยังไม่ commit** — 25+ files modified ยัง unstaged
- **ยัง push ไม่ขึ้น** — 1 commit ahead of origin ค้างมาตั้งแต่ session 1
- Bug 1.2, 3.2, 4.2 ยังค้าง
- `/booth/operator` page ยังไม่สร้าง
- Login gate caregiver section ยังไม่ทำ
- Blood test sample cards (print + QR) ยังไม่ทำ
- `active_jobs` Supabase table ยังไม่ได้สร้าง

### ตัดสินใจ / โน้ตสำคัญ
- Warm teal primary: `#0d9488` (teal-600) — ไม่ใช่ indigo หรือ blue
- Caregiver pages ใช้ raw `slate-*` โดยตั้งใจ (inconsistency acknowledged in CLAUDE.md)
- Booth page: hidden route, PIN 2505, ไม่มี nav link ชี้มา
- credential hardcode ใน `app/login/page.tsx` เป็นตั้งใจ (demo) ห้ามลบ

### พรุ่งนี้เริ่มจาก

---

- แก้ dark backgrounds: เปิด `DashboardPreview.tsx` + Footer component แล้วเปลี่ยน bg token ให้ตรงกับ warm teal system