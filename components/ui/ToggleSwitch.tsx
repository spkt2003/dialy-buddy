// Standardised toggle control + notification row used in both settings pages.

type ToggleProps = {
  defaultChecked?: boolean;
};

export function ToggleSwitch({ defaultChecked = true }: ToggleProps) {
  return (
    <label className="relative inline-flex items-center cursor-pointer shrink-0">
      <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
      {/* w-14/h-7 size is the larger, more touch-friendly variant (normalised from two different sizes). */}
      <div className="w-14 h-7 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-outline-variant after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary" />
    </label>
  );
}

type NotifRowProps = {
  title: string;
  description: string;
  defaultChecked?: boolean;
};

// Notification preference row used inside settings pages.
export function NotifRow({ title, description, defaultChecked = true }: NotifRowProps) {
  return (
    <div className="flex items-center justify-between p-5 md:p-6 bg-surface-container-low rounded-2xl border border-outline-variant/15 shadow-ambient">
      <div className="pr-4">
        <h4 className="font-bold text-on-background">{title}</h4>
        <p className="text-sm text-on-surface-variant mt-1">{description}</p>
      </div>
      <ToggleSwitch defaultChecked={defaultChecked} />
    </div>
  );
}
