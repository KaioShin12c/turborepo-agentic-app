import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@repo/ui/components/ui/input-group";
import { Label } from "@repo/ui/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import type { ComponentProps } from "react";
import { useState } from "react";

type PasswordInputProps = {
  id: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  required?: boolean;
  error?: string;
  showPasswordAriaLabel?: string;
  hidePasswordAriaLabel?: string;
} & Omit<
  ComponentProps<"input">,
  "autoComplete" | "id" | "placeholder" | "type"
>;

export function PasswordInput({
  id,
  label,
  placeholder,
  autoComplete,
  required,
  error,
  showPasswordAriaLabel = "Show password",
  hidePasswordAriaLabel = "Hide password",
  ...inputProps
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={id}
        className="font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.22em] text-[#475569]"
      >
        {label}
      </Label>
      <InputGroup className="h-12 rounded-xl border-[#CBD5E1] bg-white/72 has-[[data-slot=input-group-control]:focus-visible]:border-[#0284C7]/70 has-[[data-slot=input-group-control]:focus-visible]:ring-[#38BDF8]/20">
        <InputGroupInput
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="font-['Avenir_Next','Segoe_UI',sans-serif] text-[#102033] placeholder:text-[#94A3B8]"
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          {...inputProps}
        />
        <InputGroupButton
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={
            showPassword ? hidePasswordAriaLabel : showPasswordAriaLabel
          }
          aria-pressed={showPassword}
          className="mr-2 text-[#64748B] hover:bg-transparent hover:text-[#0284C7]"
          onClick={() => setShowPassword((isPasswordShown) => !isPasswordShown)}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </InputGroupButton>
      </InputGroup>
      {error ? (
        <p
          id={errorId}
          className="font-['Avenir_Next','Segoe_UI',sans-serif] text-sm text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
