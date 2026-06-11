import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";

type PatientPageShellProps = {
  children: ReactNode;
  maxWidth?: string;
  // pt controls the top padding inside the content area — pages vary between pt-8 and pt-12.
  pt?: string;
  // outerClass lets pages like ai-planner opt into font-sans on the outer wrapper.
  outerClass?: string;
};

// Wraps all patient-side pages: Navbar + bg-background full-height container + centred content box.
// Eliminates the repeated <>Navbar /><div className="bg-background ..."><div className="max-w-* mx-auto px-6"> pattern.
export function PatientPageShell({
  children,
  maxWidth = "max-w-7xl",
  pt = "pt-12",
  outerClass = "",
}: PatientPageShellProps) {
  return (
    <>
      <Navbar />
      <div className={`bg-background min-h-screen pb-24 ${pt} ${outerClass}`}>
        <div className={`${maxWidth} mx-auto px-6`}>{children}</div>
      </div>
    </>
  );
}
