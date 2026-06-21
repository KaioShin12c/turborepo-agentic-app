import { InputGroup, InputGroupButton, InputGroupInput } from "@repo/ui/components/ui/input-group";
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
} & Omit<ComponentProps<"input">, "autoComplete" | "id" | "placeholder" | "type">;

export function PasswordInput({
  id,
  label,
  placeholder,
  autoComplete,
  required,
  disabled,
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
        className="font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.22em] text-muted-foreground"
      >
        {label}
      </Label>
      <InputGroup className="h-12 rounded-xl border-border/60 bg-background/50 has-[[data-slot=input-group-control]:focus-visible]:border-primary/70 has-[[data-slot=input-group-control]:focus-visible]:ring-primary/20">
        <InputGroupInput
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="font-sans text-foreground placeholder:text-muted-foreground"
          required={required}
          disabled={disabled}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          {...inputProps}
        />
        <InputGroupButton
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={disabled}
          aria-label={showPassword ? hidePasswordAriaLabel : showPasswordAriaLabel}
          aria-pressed={showPassword}
          className="mr-2 text-muted-foreground hover:bg-transparent hover:text-primary"
          onClick={() => setShowPassword((isPasswordShown) => !isPasswordShown)}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </InputGroupButton>
      </InputGroup>
      {error ? (
        <p id={errorId} className="font-sans text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
