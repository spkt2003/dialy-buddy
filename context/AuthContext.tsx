"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export type Role = "patient" | "caregiver" | null;

interface AuthContextType {
  isLoggedIn: boolean;
  role: Role;
  userName: string;
  login: (role: Role, userName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [userName, setUserName] = useState("ผู้ใช้งาน");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    const storedRole = localStorage.getItem("role");
    const storedUserName = localStorage.getItem("userName");

    if (storedLoginStatus === "true") {
      setIsLoggedIn(true);
      setRole((storedRole as Role) || "patient");
      setUserName(storedUserName || "ผู้ใช้งาน");
    }
    
    setIsInitialized(true);
  }, []);

  const login = (newRole: Role, newUserName: string) => {
    setIsLoggedIn(true);
    setRole(newRole);
    setUserName(newUserName);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", newRole || "");
    localStorage.setItem("userName", newUserName);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setUserName("ผู้ใช้งาน");
    localStorage.clear();
  };

  // Render nothing until we've checked localStorage to prevent hydration mismatch and flashes
  if (!isInitialized) return null;

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
