# Skill: add-page

When to use: any time you are creating a new page file under `app/`.

---

## What goes wrong without this process

The git history records five separate commits attempting to get the caregiver dashboard layout right (`5068f4e`, `63e0f7a`, `b479ffb`, `cf1fe38`, `8fd6a63`). Each one got something different wrong: wrong layout system, missing `<Navbar />`, wrong token classes, server component used with hooks. The `fix: remove duplicated handleUpload function` commit (`8170325`) shows the second failure mode: a developer wrote a mock version first, then wrote the real version directly below it without deleting the mock. The duplicate silently passed TypeScript.

---

## Step 1 — Determine the role ownership

Ask: which role does this page serve?

| Answer | Layout to use | Token system to use |
|---|---|---|
| **Patient** (`/dashboard`, `/find-buddy`, `/ai-planner`, etc.) | No dedicated layout file. The page renders inside the root `app/layout.tsx` which provides `AuthProvider → AuthGuard → JobProvider`. | M3 semantic tokens: `bg-surface`, `text-on-surface`, `text-primary`, `shadow-ambient`, `ghost-border`, `font-body`, `font-headline`, `font-label`. |
| **Caregiver** (`/caregiver/*`) | `app/caregiver/layout.tsx` wraps all children automatically. It already provides its own sticky header and footer. | Raw Tailwind: `bg-slate-*`, `text-slate-*`, `border-slate-*`, `bg-blue-*`. |
| **Public** (`/`, `/login`, `/register`) | Root layout only. No auth gate. | M3 tokens (follows patient side). |

**Never mix the two token systems in the same file.** `gray-*` (not `slate-*`) and `text-[#hex]` are banned project-wide.

---

## Step 2 — Decide Server vs Client Component

Default to **Server Component** (no directive, no hooks). Upgrade to `"use client"` only when the file needs:
- `useState`, `useEffect`, or any other React hook
- `useRouter`, `usePathname` (next/navigation)
- `useAuth()` or `useJobContext()`
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Browser APIs (`localStorage`, `window`, etc.)

The landing page `app/page.tsx` is a correct Server Component example — no directive, no hooks, composes client child components.

**Do not add `"use client"` as a precaution.** Every Server Component that becomes a Client Component loses RSC streaming and forces all its children to also become client bundles.

---

## Step 3 — Place the file

```
app/
  <route-segment>/
    page.tsx        ← the new file
```

For the caregiver section, place under `app/caregiver/<segment>/page.tsx`. The `app/caregiver/layout.tsx` wraps it automatically.

---

## Step 4 — Write the Navbar correctly

**Patient and public pages:** `<Navbar />` is NOT in the layout — each page renders it manually.

```tsx
// Patient page pattern
export default function MyPatientPage() {
  return (
    <>
      <Navbar />
      <div className="bg-slate-50 min-h-[calc(100vh-80px)] ...">
        ...
      </div>
    </>
  );
}
```

**Caregiver pages:** `app/caregiver/layout.tsx` already renders the header. **Do not add `<Navbar />` inside a caregiver page component** — it will double-render the header.

---

## Step 5 — Register the route in AuthGuard

Open `components/auth/AuthGuard.tsx`. Find the three route classification variables and add your new path to the correct one:

```tsx
const isCaregiverRoute = pathname.startsWith("/caregiver");

const isPatientRoute =
  pathname.startsWith("/find-buddy") ||
  pathname.startsWith("/ai-planner") ||
  pathname.startsWith("/booking") ||
  pathname === "/dashboard" ||
  pathname.startsWith("/tracking") ||
  pathname.startsWith("/YOUR-NEW-PATIENT-ROUTE"); // ← add here

const isProtectedRoute =
  isCaregiverRoute || isPatientRoute || pathname.startsWith("/profile");
  // or: pathname.startsWith("/YOUR-NEW-PUBLIC-PROTECTED-ROUTE")
```

**Skipping this step means unauthenticated users can access the page, and the role-based redirect that sends caregivers to their dashboard (and patients to theirs) will not fire.**

Public pages (landing, login, register) do not need to be registered anywhere.

---

## Step 6 — Handle mock data honestly

If the page needs data that doesn't exist yet (no API, no backend), mark it explicitly:

```tsx
// MOCK: replace with GET /api/caregivers when backend exists
const caregivers = [
  { name: "...", ... },
];
```

Do not leave mock data unmarked. Do not write a `fetch("/api/route")` call unless `app/api/route/route.ts` exists — the call will silently 404 in development and return an HTML error page that `.json()` will crash on.

---

## Step 7 — Verify before committing

Checklist:

- [ ] File is in the right place (`app/<segment>/page.tsx`)
- [ ] `"use client"` is present only if hooks or event handlers are used
- [ ] Caregiver pages: no `<Navbar />` in the JSX
- [ ] Patient/public pages: `<Navbar />` is the first child of the return
- [ ] Route is added to `AuthGuard.tsx` if it should be protected
- [ ] Token system matches the role (M3 tokens for patient, slate-* for caregiver)
- [ ] No `gray-*` classes, no hardcoded hex values, no `font-sans`
- [ ] Any mock/static data arrays are marked with `// MOCK:` comment
- [ ] No duplicate function declarations (the `8170325` bug: writing a mock version then an async version below it)
