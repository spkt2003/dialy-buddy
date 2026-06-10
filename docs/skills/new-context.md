# Skill: new-context

When to use: any time you need to add shared state that multiple components or pages need to read or mutate — especially if that state should survive page navigation or be persisted to localStorage.

---

## What goes wrong without this process

`app/provider/profile/page.tsx` broke the pattern that both existing contexts follow. It reads `localStorage.getItem("isLoggedIn")` directly in a `useEffect` with no `isInitialized` guard, meaning on the first render it acts on `undefined` (localStorage returns `null` synchronously, but the `useEffect` runs after paint). This caused a flash where the page would briefly render before redirecting. The correct pattern — used by both `AuthContext` and `JobContext` — prevents this.

The `fix: remove duplicated handleUpload function` commit (`8170325`) shows a related failure: a developer wrote an initial mock implementation, then wrote the real implementation directly below it in the same file without removing the first. TypeScript does not catch duplicate `const` declarations in all cases when the first is inside a closure. Always delete the mock before writing the real version.

---

## The required anatomy

Every context in this project must have exactly this shape. Do not deviate.

```tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Type definitions
interface MyThingContextType {
  value: string;
  setValue: (v: string) => void;
}

// 2. Context object — internal, not exported
const MyThingContext = createContext<MyThingContextType | undefined>(undefined);

// 3. Provider component — exported
export const MyThingProvider = ({ children }: { children: React.ReactNode }) => {
  const [value, setValue] = useState("");
  const [isInitialized, setIsInitialized] = useState(false); // ← required for localStorage

  // 4. Load from localStorage on mount — set isInitialized when done
  useEffect(() => {
    const stored = localStorage.getItem("myThing");
    if (stored) setValue(stored);
    setIsInitialized(true); // ← must be last line of this effect
  }, []);

  // 5. Sync to localStorage when state changes — gate on isInitialized
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("myThing", value);
    }
  }, [value, isInitialized]);

  // 6. Return null until initialized — prevents hydration mismatch
  if (!isInitialized) return null;

  return (
    <MyThingContext.Provider value={{ value, setValue }}>
      {children}
    </MyThingContext.Provider>
  );
};

// 7. Consumer hook — exported, throws if used outside provider
export const useMyThing = () => {
  const context = useContext(MyThingContext);
  if (context === undefined) {
    throw new Error("useMyThing must be used within MyThingProvider");
  }
  return context;
};
```

---

## The `isInitialized` guard — why it matters

Without this guard:
1. Component renders on the server (or initial client paint) — `localStorage` is not available
2. `useEffect` fires after paint — reads from localStorage, updates state
3. State changes cause a second render — UI visually flips from "unauthenticated" to "authenticated"

With the guard (`if (!isInitialized) return null`):
- The entire subtree renders nothing until the localStorage read is complete
- No visible flip
- No hydration mismatch between server and client

**This guard is not optional.** Both `AuthContext` and `JobContext` use it. If your context does not read from localStorage, you can omit `isInitialized` — but if it does, the guard is required.

---

## If the context does NOT need localStorage

Simpler form — no `isInitialized`:

```tsx
"use client";

import React, { createContext, useContext, useState } from "react";

interface MyThingContextType { /* ... */ }
const MyThingContext = createContext<MyThingContextType | undefined>(undefined);

export const MyThingProvider = ({ children }: { children: React.ReactNode }) => {
  const [value, setValue] = useState("");

  return (
    <MyThingContext.Provider value={{ value, setValue }}>
      {children}
    </MyThingContext.Provider>
  );
};

export const useMyThing = () => {
  const context = useContext(MyThingContext);
  if (context === undefined) throw new Error("useMyThing must be used within MyThingProvider");
  return context;
};
```

---

## Step: Add the Provider to the root layout

Open `app/layout.tsx`. The provider order matters — providers lower in the tree can read from providers above them.

**Current nesting:**
```tsx
<AuthProvider>         {/* auth state */}
  <AuthGuard>          {/* reads AuthProvider — must be inside it */}
    <JobProvider>      {/* job state — does not need auth */}
      {children}
    </JobProvider>
  </AuthGuard>
</AuthProvider>
```

**Rules:**
- Providers that need to read from another provider must be nested inside it
- `AuthGuard` must stay inside `AuthProvider` (it calls `useAuth()`)
- Add your new provider at the appropriate level:
  - Needs auth state? Add inside `<AuthProvider>`, outside or inside `<AuthGuard>` depending on whether unauthenticated users need it
  - Doesn't need auth state? Can go outside `<AuthProvider>` if needed, or inside `<JobProvider>`

```tsx
<AuthProvider>
  <AuthGuard>
    <JobProvider>
      <MyThingProvider>  {/* ← add here if it needs auth+job state */}
        {children}
      </MyThingProvider>
    </JobProvider>
  </AuthGuard>
</AuthProvider>
```

---

## What to export — and what not to

| Export | Purpose |
|---|---|
| `MyThingProvider` | Mounted in `app/layout.tsx` |
| `useMyThing` | Used in any component that needs the state |
| The `Job`, `Role`, etc. type definitions | Used by other files that type-check against the context |

**Do not export the context object itself** (`MyThingContext`). Exporting it allows consumers to call `useContext(MyThingContext)` directly, bypassing the error-throwing hook. All consumption must go through `useMyThing()`.

---

## Initializing with seed data

If the context ships with initial/mock data (as `JobContext` does with `initialPendingJobs`):

```tsx
const initialItems: Item[] = [ /* seed data */ ];

export const MyThingProvider = ({ children }) => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("myItems");
    if (stored) setItems(JSON.parse(stored)); // overwrite seed with stored if present
    setIsInitialized(true);
  }, []);
  ...
```

**Warning:** Calling `localStorage.clear()` (as `AuthContext.logout()` does) wipes the stored state and the seed data re-initializes on next mount. This is the current behavior — `JobContext` resets to its initial mock jobs after logout. If you need job history to survive across sessions, do not use `localStorage.clear()` in logout; instead selectively remove only auth keys.

---

## Checklist before committing a new context

- [ ] File has `"use client"` at the top
- [ ] Context object is NOT exported (only Provider and hook are exported)
- [ ] `useMyThing()` throws `"useMyThing must be used within MyThingProvider"` — not silently returns `undefined`
- [ ] If the context reads from localStorage: `isInitialized` state exists, `setIsInitialized(true)` is the last line of the load effect, `if (!isInitialized) return null` is in the Provider before the return
- [ ] Sync-to-localStorage effect is gated on `isInitialized` (prevents overwriting stored data on first render)
- [ ] Provider is added to `app/layout.tsx` at the correct nesting level
- [ ] No page component reads from `localStorage` directly to get data this context manages
