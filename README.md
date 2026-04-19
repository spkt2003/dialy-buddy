# 🏥 DialyBuddy | The Curated Caregiver

DialyBuddy is a specialized healthcare web platform designed to seamlessly connect dialysis patients (and their relatives) with certified, professional caregivers. 

By focusing heavily on **Role-Based Access Control (RBAC)** and an **Elderly-Friendly Accessible UI**, the platform ensures a safe, reliable, and user-friendly experience for managing medical transportation and patient care.

---

## ✨ Key Features

### 🎭 Role-Based Access Control (RBAC)
- **Strict Route Protection:** Dedicated, isolated environments for `Patient` and `Caregiver` roles.
- **Dynamic Navigation:** The UI adapts intelligently based on the authenticated user's role.

### 🩺 For Caregivers (ผู้ดูแล)
- **Job Board & Single Active Flow:** View pending jobs, accept a single active job, and prevent overlapping schedules.
- **Interactive Progress Tracker:** Step-by-step job tracking (e.g., *On the way to pick up* ➔ *At hospital* ➔ *Returned home safely*).
- **Earnings & History:** Comprehensive dashboard to view completed jobs and accumulated earnings.
- **Profile Management:** Manage professional credentials, banking details, and alert preferences.

### 👥 For Patients / Relatives (ผู้ป่วย / ญาติ)
- **Buddy Matching:** Easily find and hire specialized caregivers for dialysis transportation.
- **Health Tracking:** (Upcoming) Track dialysis schedules and vital health metrics.
- **Secure Profiles:** Manage patient requirements and emergency contacts.

### 🎨 The "Dialy-UI" Design System
Designed specifically for accessibility and an aging population using our internal **Clarify** design principles:
- **High Legibility:** Large typography (Manrope & Lexend fonts) and high-contrast text (`slate-900`).
- **Soothing Aesthetics:** Soft medical blues (`blue-600`), gentle backgrounds (`slate-50`), and `emerald` accents for success states.
- **Friendly Shapes:** Heavily rounded corners (`rounded-[2rem]`) and prominent, easy-to-tap buttons.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Vanilla + Custom Tokens)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Context API (`AuthContext`, `JobContext`)

---

## 📂 Project Structure

```text
Dialy-Buddy/
├── app/
│   ├── caregiver/      # Protected routes for Caregivers (Dashboard, Tracking, Jobs, Settings)
│   ├── patient/        # Protected routes for Patients/Relatives
│   ├── login/          # Authentication entry point
│   ├── register/       # Role-based onboarding
│   └── layout.tsx      # Root layout containing AuthProvider & AuthGuard
├── components/
│   ├── auth/           # Route protection guards
│   ├── layout/         # Dynamic Navbar & Footer
│   ├── caregiver/      # Caregiver specific UI (ChatBox)
│   └── dialy-ui/       # (Core) Reusable, accessible UI component system
├── context/
│   ├── AuthContext.tsx # Global authentication & role state (localStorage mocked)
│   └── JobContext.tsx  # Global job queue & tracking state
└── public/             # Static assets (Logos, Icons)
```

---

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 🧪 How to Test the Flow

1. Go to **Login** or **Register**.
2. Select your desired role (**ผู้ดูแล** for Caregiver, or **ผู้ป่วย/ญาติ** for Patient).
3. The `AuthGuard` will automatically route you to the correct, protected dashboard.
4. If testing the **Caregiver**, try accepting a job to see the interactive tracking system in action!

---

## 🔒 Security Note
*Currently, authentication and state management are mocked using React Context and `localStorage` for frontend demonstration and UI/UX validation purposes. In a production environment, this should be replaced with secure, server-side session management (e.g., NextAuth.js) and a robust backend database.*
