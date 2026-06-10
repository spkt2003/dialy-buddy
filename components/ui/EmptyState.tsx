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
          ? "border-2 border-dashed border-slate-200"
          : "bg-white border border-slate-100 shadow-sm"
      }`}
    >
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
        {icon}
      </div>
      <p className="text-xl font-semibold text-slate-500">{message}</p>
      {subMessage && <p className="text-sm text-slate-400 mt-2">{subMessage}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
