import { Label } from "@repo/ui/components/ui/label";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { cn } from "@repo/ui/lib/utils";
import { labelClass } from "./constants";

const textareaClass =
  "min-h-[80px] rounded-xl border-border/60 bg-background/50 font-sans text-foreground placeholder:text-muted-foreground focus-visible:border-primary/70 focus-visible:ring-primary/20";

interface FormTextareaProps extends React.ComponentProps<"textarea"> {
  label: string;
  error?: string;
  optional?: boolean;
}

export function FormTextarea({ label, error, optional, id, className, ...props }: FormTextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className={labelClass}>
        {label}
        {optional && <span className="normal-case tracking-normal text-[10px]"> (optional)</span>}
      </Label>
      <Textarea id={id} className={cn(textareaClass, className)} {...props} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
