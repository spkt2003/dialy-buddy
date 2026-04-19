import type { Metadata } from "next";
import { Manrope, Lexend } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import AuthGuard from "../components/auth/AuthGuard";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dialybuddy | The Curated Caregiver",
  description: "Specialized care and AI nutrition for dialysis patients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${manrope.variable} ${lexend.variable} antialiased scroll-smooth`}>
      <body className="min-h-[100dvh] flex flex-col font-body bg-surface text-on-surface overflow-x-hidden">
        <AuthProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
