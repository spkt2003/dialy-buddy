# DialyBuddy | The Curated Caregiver

DialyBuddy is a Thai-language healthcare platform that connects **dialysis patients** (and their families) with certified, professional caregivers (Care Buddies). Designed for the Thai market with an elderly-friendly UI, it handles the full lifecycle from matching and booking to real-time job tracking and earnings.

---

## Key Features

### For Caregivers (ผู้ดูแล)
- **Job Board** — Browse pending jobs, accept a single active job, and complete it step by step.
- **Interactive Progress Tracker** — Step-by-step status updates: on the way → at pick-up → at hospital → returned home.
- **Earnings Dashboard** — Completed jobs, accumulated earnings, and an itemized breakdown with fee/discount details.
- **Tier Badges & Leaderboard** — Ranked by completed jobs; badge tiers unlock higher visibility.
- **Ratings & Reviews** — Real ratings loaded from Supabase; shown on the caregiver dashboard.
- **Profile & Settings** — Professional credentials, banking details, and notification preferences.

### For Patients / Relatives (ผู้ป่วย / ญาติ)
- **Find a Buddy** — Browse and hire caregivers filtered by specialty, rating, and availability.
- **Booking Flow** — Book appointments with fee calculation, discounts, and Supabase-persisted receipts.
- **AI Nutrition Planner** — Upload a blood-test image; Gemini Vision generates a personalized Thai-language meal plan.
- **Appointment Tracking** — View upcoming and past dialysis sessions.
- **Transaction History** — Itemized receipts with tax invoices.
- **PDPA Consent** — In-app consent management for personal data handling.
- **Rewards & Subscriptions** — Loyalty points and subscription plan selection.

### Platform / Admin
- **Admin Dashboard** — PIN-gated operator panel (`/booth/operator`) for job oversight and system stats.
- **Role-Based Access Control** — Strict route protection via `AuthGuard`; caregivers and patients see completely separate UIs.
- **In-App Chat** — Real-time chat widget between patient and assigned caregiver.
- **QR Integration** — QR code generation and decoding (jsqr + qrcode.react) for session verification.

---

## Tech Stack

| Layer | Tool | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.3 |
| Language | TypeScript (strict) | ^5 |
| Styling | Tailwind CSS v4 | ^4 |
| Icons | lucide-react | ^1.8.0 |
| Backend / DB | Supabase | ^2.108.0 |
| AI | Google Generative AI (Gemini) | ^0.24.1 |
| QR | jsqr + qrcode.react | — |
| Fonts | Manrope, Lexend (Google Fonts) | — |

State is split between **Supabase** (auth, caregiver profiles, jobs, chat, ratings) and **localStorage** (patient-side session state, booking context).

---

## Project Structure

```
dialy-buddy/
├── app/
│   ├── caregiver/        # Caregiver sub-app (dashboard, jobs, tracking, settings)
│   ├── dashboard/        # Patient dashboard
│   ├── find-buddy/       # Caregiver search & booking
│   ├── ai-planner/       # Gemini-powered nutrition planner
│   ├── booking/          # Appointment booking flow
│   ├── tracking/         # Patient appointment tracker
│   ├── booth/operator/   # PIN-gated admin panel
│   ├── login/            # Authentication
│   ├── register/         # Role-based onboarding
│   ├── api/analyze-blood/ # Route handler: Gemini blood-test analysis
│   └── layout.tsx        # Root: AuthProvider → AuthGuard → JobProvider
├── components/
│   ├── auth/             # AuthGuard (route protection)
│   ├── layout/           # Role-aware Navbar & Footer
│   └── caregiver/        # ChatBox and caregiver-specific widgets
├── context/
│   ├── AuthContext.tsx   # Global auth & role state
│   └── JobContext.tsx    # Job queue, active job, tracking state
├── lib/
│   └── supabaseClient.ts # Shared Supabase client
└── dialy-ui/             # Static HTML mockups & design references (not built)
```

---

## Getting Started

```bash
npm install
npm run dev       # http://localhost:3000
```

### Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_GEMINI_API_KEY=...
NEXT_PUBLIC_OPERATOR_PIN=123456
```

### Dev Credentials

Three hardcoded accounts are available for testing without registering:

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | Caregiver |
| `user` | `user123` | Patient |

Phone/password accounts created via `/register` are also persisted to localStorage.

---

## Other Commands

```bash
npm run build    # Production build
npm start        # Serve production build
npm run lint     # ESLint
```
