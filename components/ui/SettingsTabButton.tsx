import type { ReactNode } from "react";

type SettingsTabButtonProps = {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
};

// Full-width sidebar tile used in both profile and caregiver settings.
// Active: solid blue fill. Inactive: white card with border.
export function SettingsTabButton({ active, onClick, icon, children }: SettingsTabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${
        active
          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
          : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100 shadow-sm"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
