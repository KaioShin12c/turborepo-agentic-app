import { cn } from "@repo/ui/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
  sub: string;
  change: string;
  changeType: "up" | "down";
}

export function StatCard({ icon: Icon, label, value, sub, change, changeType }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
          <Icon size={18} />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <div className="text-3xl font-bold tracking-tight">{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
        </div>
        <div className="text-right">
          <div
            className={cn(
              "inline-flex items-center gap-1 text-sm font-semibold",
              changeType === "up" ? "text-success" : "text-danger",
            )}
          >
            {changeType === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {change}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Since last month</div>
        </div>
      </div>
    </div>
  );
}
