import { INPUT_CLS } from "@/lib/styles";

type FormInputProps = {
  label: string;
  type?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
};

// Labelled input field using the shared INPUT_CLS constant; avoids repeating the long Tailwind string.
export function FormInput({
  label,
  type = "text",
  defaultValue,
  value,
  onChange,
  placeholder,
  disabled = false,
  readOnly = false,
}: FormInputProps) {
  const controlled = value !== undefined;
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-semibold text-on-surface">{label}</label>}
      <input
        type={type}
        {...(controlled ? { value, onChange } : { defaultValue })}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={INPUT_CLS}
      />
    </div>
  );
}
