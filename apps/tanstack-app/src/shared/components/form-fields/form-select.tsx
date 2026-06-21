import { Label } from "@repo/ui/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { cn } from "@repo/ui/lib/utils";
import { labelClass } from "./constants";

const selectClass =
  "h-12 rounded-xl border-border/60 bg-background/50 font-sans text-foreground data-[placeholder]:text-muted-foreground focus:border-primary/70 focus:ring-primary/20";

interface FormSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  id: string;
  placeholder: string;
  options: readonly string[];
  className?: string;
}

export function FormSelect({
  label,
  value,
  onValueChange,
  error,
  id,
  placeholder,
  options,
  className,
}: FormSelectProps) {
  return (
    <div className="flex flex-col gap-2" data-invalid={error ? "" : undefined}>
      <Label htmlFor={id} className={labelClass}>
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className={cn(selectClass, className)} aria-invalid={error ? "true" : "false"}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
