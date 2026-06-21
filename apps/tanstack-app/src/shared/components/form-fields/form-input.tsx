import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { cn } from "@repo/ui/lib/utils";
import { labelClass } from "./constants";

const fieldClass =
  "h-12 rounded-xl border-border/60 bg-background/50 font-sans text-foreground placeholder:text-muted-foreground focus-visible:border-primary/70 focus-visible:ring-primary/20";

interface FormInputProps extends React.ComponentProps<"input"> {
  label: string;
  error?: string;
  optional?: boolean;
}

export function FormInput({ label, error, optional, id, className, ...props }: FormInputProps) {
  return (
    <div className="flex flex-col gap-2" data-invalid={error ? "" : undefined}>
      <Label htmlFor={id} className={labelClass}>
        {label}
        {optional && <span className="normal-case tracking-normal text-[10px]"> (optional)</span>}
      </Label>
      <Input id={id} className={cn(fieldClass, className)} aria-invalid={error ? "true" : "false"} {...props} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
