"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, Role } from "../../context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Define protected routes
    const isCaregiverRoute = pathname.startsWith("/caregiver");
    const isPatientRoute = 
      pathname.startsWith("/find-buddy") || 
      pathname.startsWith("/ai-planner") || 
      pathname.startsWith("/booking") || 
      pathname === "/dashboard" ||
      pathname.startsWith("/tracking");
      
    // Common protected (need login, but role doesn't strictly matter yet, though usually it's one or the other)
    const isProtectedRoute = isCaregiverRoute || isPatientRoute || pathname.startsWith("/profile");

    // 1. Not logged in but trying to access protected route -> redirect to login
    if (!isLoggedIn && isProtectedRoute) {
      router.push("/login");
      return;
    }

    // 2. Logged in role checks
    if (isLoggedIn) {
      if (role === "caregiver" && isPatientRoute) {
        // Caregiver trying to access patient routes -> redirect to caregiver dashboard
        router.push("/caregiver/dashboard");
      } else if (role === "patient" && isCaregiverRoute) {
        // Patient trying to access caregiver routes -> redirect to patient dashboard
        router.push("/dashboard");
      }
    }
  }, [isLoggedIn, role, pathname, router]);

  return <>{children}</>;
}
