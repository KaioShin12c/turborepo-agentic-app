import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { ChevronDown, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { REVENUE_DATA } from "./dashboard-data";

export function RevenueChart() {
  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle className="text-base font-semibold">Revenue Breakdown</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 rounded-full border border-border bg-muted/60 text-xs text-muted-foreground"
        >
          This week <ChevronDown size={12} />
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          Total <span className="text-foreground">&rarr;</span>
          <span className="text-2xl font-bold text-foreground">$20,671</span>
        </div>
        <div className="relative mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                tickFormatter={(v: number) => `$${v / 1000}K`}
                domain={[0, 10000]}
                ticks={[0, 2000, 4000, 6000, 8000, 10000]}
                axisLine={false}
                tickLine={false}
              />
              <RechartsTooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
              <Area
                type="linear"
                dataKey="value"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                dot={false}
                activeDot={{ r: 4, fill: "var(--chart-1)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 rounded-lg bg-chart-1 px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg">
            <div className="text-[10px] font-medium opacity-80">Revenue</div>
            <div className="text-sm font-bold">$4,910</div>
          </div>
          <div className="pointer-events-none absolute bottom-14 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-md bg-foreground px-2 py-1 text-[11px] text-background">
            <span>26% of Total</span>
            <span className="flex items-center gap-0.5 text-success">
              <TrendingUp size={12} /> +3.7%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
