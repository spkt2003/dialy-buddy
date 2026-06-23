@AGENTS.md

<!--
CONTEXT LOADING — read only what the task needs, never speculatively

NEW PAGE            → docs/skills/add-page.md · components/auth/AuthGuard.tsx · app/globals.css
AUTH / LOGOUT       → docs/skills/auth-flow.md · context/AuthContext.tsx · components/auth/AuthGuard.tsx
NEW CONTEXT         → docs/skills/new-context.md · app/layout.tsx
UI / DESIGN         → app/globals.css · then invoke /skill
BUG (auth/routing)  → broken file + context/AuthContext.tsx + docs/skills/auth-flow.md
BUG (job state)     → broken file + context/JobContext.tsx
REFACTOR            → target file + its direct imports only

NEVER read: dialy-ui/*.html  public/  .next/  node_modules/
Design skills in .agents/skills/ are 10–22 KB each — invoke via /skill-name, do not Glob into them
-->

# DialyBuddy — Project Guide

## 1. Project Overview

DialyBuddy is a Thai-language healthcare platform that connects **dialysis patients** (and their families) with **caregivers** (Care Buddies). The app is targeted at the Thai market and all UI copy is in Thai.

**Core features:**
- Landing page with marketing sections (hero, stats, how-it-works, testimonials)
- Role-based authentication (patient vs caregiver), persisted in localStorage
- **Patient side**: dashboard, find-a-buddy, booking, AI nutrition planner (blood-test image → meal plan via Gemini), appointment tracking
- **Caregiver side**: job board (pending → active → completed), step-by-step job tracking, earnings history, in-app chat widget

**Who uses it:** Dialysis patients in Thailand and the professional caregivers who escort them to dialysis sessions.

---

## 2. Tech Stack

| Layer | Library / Tool | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.3 |
| UI Library | React | 19.2.4 |
| Language | TypeScript (strict) | ^5 |
| Styling | Tailwind CSS v4 | ^4 |
| Tailwind PostCSS | @tailwindcss/postcss | ^4 |
| Icons | lucide-react | ^1.8.0 |
| AI SDK | @google/generative-ai | ^0.24.1 |
| Backend / DB | Supabase (@supabase/supabase-js) | ^2.108.0 |
| QR | jsqr (decode) + qrcode.react (generate) | ^1.4 / ^4.2 |
| Fonts | Manrope, Lexend (Google Fonts via next/font) | — |
| Linter | ESLint + eslint-config-next | 16.2.3 |

**TypeScript config highlights:** `strict: true`, `moduleResolution: bundler`, `paths: { "@/*": ["./*"] }` (alias maps to project root, not `src/`).

---

## 3. Project Structure

- `app/` — App Router pages. `layout.tsx` wraps everything in `AuthProvider → AuthGuard → JobProvider`. `globals.css` defines the full M3 token system and font variables.
- `app/caregiver/` — Caregiver sub-app with its **own** `layout.tsx` (sticky header + footer already included — do not add `<Navbar />` inside caregiver pages). Patient pages include `<Navbar />` manually. Sub-routes: `dashboard/`, `jobs/`, `tracking/`, `settings/`.
- `app/api/analyze-blood/route.ts` — The only Next.js Route Handler. Receives a blood-test image, decodes QR via jsqr to short-circuit known sample IDs, otherwise calls Gemini. **No other API routes exist.**
- `app/admin/page.tsx` — PIN-gated admin dashboard (PIN: `db2025`). Not in AuthGuard — PIN is the only protection.
- `lib/supabaseClient.ts` — Single shared Supabase client instance. Auth uses phone-as-email (`{phone}@dialybuddy.local`) so real phone numbers are stored in the email field, not the phone field.
- `components/auth/AuthGuard.tsx` — All route protection and role-based redirects live here. Must be updated when adding protected routes.
- `components/layout/Navbar.tsx` — Role-aware; renders different nav for `patient` vs `caregiver`.
- `context/AuthContext.tsx` / `context/JobContext.tsx` — Only two global state providers. Both use the `isInitialized` localStorage guard pattern.
- `docs/skills/` — Step-by-step workflow skills for the three most error-prone tasks.
- `.agents/skills/` — Design skills invoked via `/skill-name`. Each file is 5–22 KB; do not read directly.
- `dialy-ui/` — Static HTML mockups and design reference PNGs. Not part of the build; see `.claudeignore`.

---

## 4. Dev Commands

```bash
npm run dev      # Start dev server (next dev) — http://localhost:3000
npm run build    # Production build (next build)
npm start        # Serve production build (next start)
npm run lint     # Run ESLint (eslint)
```

There is no test runner configured (`playwright` is installed as a dev dependency but no test files exist). There are no database migrations (data is localStorage-only for patient transactions; Supabase holds auth, caregiver profiles, active/pending/completed jobs, and chat messages).

---

## 5. Code Conventions

### "use client" boundary
Add `"use client"` only when the file uses hooks, event handlers, `useRouter`/`usePathname`, or browser APIs. `app/page.tsx` (landing) is intentionally a Server Component.

### Context pattern
`createContext<T | undefined>(undefined)` → `XProvider` with `isInitialized` guard → `useX()` hook that throws on missing provider. Full template in `docs/skills/new-context.md`.

### localStorage guard
Both contexts gate rendering on `isInitialized` (set at the end of the load-from-localStorage `useEffect`). Return `null` until initialized. Any new context touching localStorage must follow this pattern.

### Tailwind tokens (patient side)
Patient pages use M3 semantic tokens from `globals.css`: `bg-surface`, `text-on-surface`, `text-primary`, `bg-surface-container-*`, `shadow-ambient`, `font-headline` / `font-body` / `font-label`. Custom utilities: `.glass-panel`, `.ghost-border`. Ban: `gray-*`, hardcoded hex, `font-sans`.

Caregiver pages (`app/caregiver/`) use raw `slate-*` / `blue-*` — this inconsistency exists intentionally in current code.

### Layout & comments
Large cards: `rounded-[2rem]`. Secondary: `rounded-xl`/`rounded-2xl`. Imports: `@/*` alias maps to project root. Comments in existing files are written in Thai.

---

## 6. Critical Rules

### Provider order in root layout — do not change
```tsx
<AuthProvider>
  <AuthGuard>
    <JobProvider>
      {children}
    </JobProvider>
  </AuthGuard>
</AuthProvider>
```
`AuthGuard` must be inside `AuthProvider` (it reads auth context). `JobProvider` must be inside `AuthGuard` (so unauthenticated users don't initialize job state).

### AuthGuard route rules
`AuthGuard` (`components/auth/AuthGuard.tsx`) enforces:
- Unauthenticated users → `/login` if they try to access any protected route
- `caregiver` role → redirected to `/caregiver/dashboard` if they visit patient routes
- `patient` role → redirected to `/dashboard` if they visit `/caregiver/*`

**Protected patient routes:** `/find-buddy`, `/ai-planner`, `/booking`, `/dashboard`, `/tracking`, `/profile/*`
**Protected caregiver routes:** anything starting with `/caregiver`

Adding a new protected route requires updating the route lists in `AuthGuard.tsx`.

### Single active job constraint
`JobContext.acceptJob` silently no-ops if `activeJob` is already set (`if (activeJob) return`). This is intentional — caregivers cannot hold two active jobs. Do not remove this guard.

### localStorage is the only persistence layer
There is no backend, no database, no API routes for auth or jobs. All state is stored in localStorage and rehydrated on mount. The AI planner calls `/api/analyze-blood` (a Next.js Route Handler, not yet visible in the file listing) using Google Generative AI.

### Hardcoded dev credentials (login page)
Three credential sets are hardcoded in `app/login/page.tsx`:
- `admin` / `admin123` → caregiver role
- `user` / `user123` → patient role
- Registered phone/password saved to localStorage during `/register`

Do not remove these during development — they are the only way to test both roles without registering.

### Next.js version
This project uses **Next.js 16.2.3**, which may have breaking changes from earlier versions. Per `AGENTS.md`: read `node_modules/next/dist/docs/` before writing Next.js-specific code (routing, metadata, image, font APIs).

### TypeScript strict mode
`strict: true` is set. Do not use `any` to work around type errors.

---

## 7. Project Workflow Skills

These skills document exact step-by-step processes for the workflows that most commonly go wrong in this codebase. **Read the relevant skill file before starting the task**, not after hitting a problem.

| Trigger | Skill file | What it prevents |
|---|---|---|
| Creating any new `app/*/page.tsx` | [`docs/skills/add-page.md`](docs/skills/add-page.md) | Wrong layout system, missing Navbar, missing AuthGuard registration, wrong token classes, duplicate function declarations |
| Touching login, logout, registration, route protection, or reading `isLoggedIn`/`role` anywhere | [`docs/skills/auth-flow.md`](docs/skills/auth-flow.md) | Broken logout leaving stale React state, direct `localStorage` reads in pages, competing auth guards, missing role from localStorage on logout |
| Adding a new `createContext` / `Provider` / global state | [`docs/skills/new-context.md`](docs/skills/new-context.md) | Missing `isInitialized` guard causing hydration mismatch, exported context object bypassing the error-throwing hook, wrong nesting order in `app/layout.tsx` |

---

## 8. Agent Skills

Design skills in `.agents/skills/` — invoke by name, do not read the files directly (5–22 KB each):

`/impeccable` (craft|teach|extract) · `/polish` · `/animate` · `/colorize` · `/typeset` · `/layout` · `/critique` · `/harden` · `/optimize` · `/audit` · `/adapt` · `/distill` · `/bolder` · `/quieter` · `/delight` · `/shape` · `/clarify` · `/overdrive`

Run `/impeccable teach` on first use — it generates `.impeccable.md` with the project's design context, which all other design skills require.
