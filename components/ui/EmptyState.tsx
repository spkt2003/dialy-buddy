import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: ReactNode;
  message: string;
  subMessage?: string;
  action?: ReactNode;
  // dashed=true adds a dashed border — used when the empty state invites the user to add content.
  dashed?: boolean;
};

// Centred empty state block used on job boards, search results, history lists, etc.
export function EmptyState({ icon, message, subMessage, action, dashed = false }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 rounded-3xl text-center ${
        dashed
          ? "border-2 border-dashed border-outline-variant/30"
          : "bg-surface-container-lowest ghost-border shadow-ambient"
      }`}
    >
      <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface-variant">
        {icon}
      </div>
      <p className="text-xl font-semibold text-on-surface-variant">{message}</p>
      {subMessage && <p className="text-sm text-on-surface-variant mt-2">{subMessage}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
