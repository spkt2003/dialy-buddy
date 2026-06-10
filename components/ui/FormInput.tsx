import { INPUT_CLS } from "@/lib/styles";

type FormInputProps = {
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
};

// Labelled input field using the shared INPUT_CLS constant; avoids repeating the long Tailwind string.
export function FormInput({
  label,
  type = "text",
  defaultValue,
  placeholder,
  disabled = false,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-semibold text-slate-700">{label}</label>}
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        className={INPUT_CLS}
      />
    </div>
  );
}
