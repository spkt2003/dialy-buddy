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
          ? "bg-primary text-on-primary shadow-ambient"
          : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low border border-outline-variant/15 shadow-ambient"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
