# Skill: auth-flow

When to use: any time you touch login, logout, registration, route protection, role checks, or read auth state in a component.

---

## What goes wrong without this process

Three different logout implementations exist in this codebase, each doing something different:

| File | What it does | Problem |
|---|---|---|
| `app/caregiver/settings/page.tsx:12-15` | `const { logout } = useAuth(); logout(); router.push("/")` | **Correct.** |
| `app/provider/profile/page.tsx:24-26` | `localStorage.clear(); router.push("/login")` | **Broken.** AuthContext React state is never reset. The UI still shows the user as logged in until a hard refresh because `isLoggedIn` in context is still `true`. |
| `app/profile/page.tsx:14-16` | `localStorage.removeItem("isLoggedIn"); localStorage.removeItem("userName")` | **Broken.** Omits `role` — stale role remains in localStorage and will be read back on the next session. |

Additionally, `app/provider/profile/page.tsx` bypasses `AuthGuard` entirely, implementing its own `useEffect` that reads `localStorage.getItem("userName") === "admin"` directly. This route is not in AuthGuard's protected list, creating two competing access-control systems on the same route.

---

## The golden rule

**All auth state lives in `AuthContext`. Never read or write `isLoggedIn`, `role`, or `userName` from `localStorage` directly in a page or component.** Use the `useAuth()` hook.

If you find yourself writing `localStorage.getItem("isLoggedIn")` in a page component, stop — that is the bug pattern.

---

## Logout — always do this

```tsx
// ✓ correct pattern — works in any component
const { logout } = useAuth();
const router = useRouter();

const handleLogout = () => {
  logout();           // resets React state AND clears localStorage
  router.push("/");   // redirect after state is updated
};
```

`AuthContext.logout()` does three things: resets `isLoggedIn` to false, resets `role` to null, resets `userName` to default, then calls `localStorage.clear()`. Calling `localStorage.clear()` yourself without calling `logout()` leaves React state stale.

**Never call `localStorage.removeItem(...)` for auth keys.** Use `logout()`.

---

## Login — always do this

```tsx
const { login } = useAuth();
const router = useRouter();

// After validating credentials:
login("patient", userName);     // or login("caregiver", userName)
router.push("/dashboard");      // or router.push("/caregiver/dashboard")
```

`login(role, userName)` updates React state AND writes to localStorage atomically. Do not write to localStorage before calling `login()`.

---

## Protecting a new route

**Step 1:** Open `components/auth/AuthGuard.tsx`.

**Step 2:** Add your route to the correct classification variable:

```tsx
// For a caregiver-only route:
const isCaregiverRoute = pathname.startsWith("/caregiver") ||
  pathname.startsWith("/your-new-caregiver-route");

// For a patient-only route:
const isPatientRoute =
  pathname.startsWith("/find-buddy") ||
  pathname.startsWith("/your-new-patient-route") || // ← add
  ...

// For a route that requires login but is role-neutral:
const isProtectedRoute =
  isCaregiverRoute || isPatientRoute || pathname.startsWith("/your-new-route");
```

**Step 3:** Do not write a `useEffect` in the page itself to check `isLoggedIn`. AuthGuard handles all redirects. A page-local guard creates two competing systems and introduces race conditions.

---

## Reading auth state in a component

```tsx
// ✓ correct
const { isLoggedIn, role, userName } = useAuth();

// ✗ never do this in a component
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
const role = localStorage.getItem("role");
```

The `useAuth()` hook throws `"useAuth must be used within AuthProvider"` if called outside the provider tree — this is intentional. If you see that error, the component is being rendered outside `<AuthProvider>` in `app/layout.tsx`.

---

## Conditional rendering by role

```tsx
const { role } = useAuth();

// In Navbar and role-aware UI:
{role === "caregiver" ? (
  <CaregiverMenu />
) : (
  <PatientMenu />
)}
```

The two roles are: `"patient"` and `"caregiver"`. The type is `Role = "patient" | "caregiver" | null`. `null` means not logged in.

---

## Checking the dev credentials

Three hardcoded credential sets exist in `app/login/page.tsx` for development. Do not remove them:

| Username | Password | Role assigned |
|---|---|---|
| `admin` | `admin123` | caregiver |
| `user` | `user123` | patient |
| Registered phone number | Registered password | Whichever was chosen at register |

These exist because there is no backend. When a real auth API is added, replace the `handleLogin` function body — the credential logic is isolated there.

---

## Adding a new role

The `Role` type is defined in `context/AuthContext.tsx:6`:
```ts
export type Role = "patient" | "caregiver" | null;
```

To add a role:
1. Add the string literal to the union type in `AuthContext.tsx`
2. Add the role's routes to `AuthGuard.tsx`
3. Add role-conditional rendering to `components/layout/Navbar.tsx`
4. Add a new credential set to `app/login/page.tsx` for development

Do not add role checks in individual pages — all role-based routing must go through `AuthGuard`.
