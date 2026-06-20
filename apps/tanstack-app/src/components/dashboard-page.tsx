import { authClient } from "@repo/auth/client";
import type { AuthSession } from "@repo/auth/server";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/components/ui/tooltip";
import { useRouter } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  Clock,
  Globe,
  HelpCircle,
  LayoutDashboard,
  Library,
  LogOut,
  PlusCircle,
  ReceiptText,
  Search,
  Settings,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ModeToggle } from "./mode-toggle";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const NAV_MAIN = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Books", icon: BookOpen },
  { label: "Library Activities", icon: BarChart3 },
  { label: "Members", icon: Users },
];

const NAV_MANAGEMENT = [
  { label: "Report & Analytics", icon: BarChart3 },
  { label: "Overdue Reminder", icon: Bell },
  { label: "Add Books", icon: PlusCircle },
  { label: "Fines & Fees", icon: ReceiptText },
];

const NAV_SETTINGS = [
  { label: "Setting", icon: Settings },
  { label: "Help & Support", icon: HelpCircle },
  { label: "Log Out", icon: LogOut, action: "signout" as const },
];

const REVENUE_DATA = [
  { label: "Membership", value: 8800 },
  { label: "Overdue", value: 7200 },
  { label: "Events", value: 4910 },
  { label: "Others", value: 3400 },
];

const OVERDUE_ITEMS = [
  {
    id: "USR-2007",
    name: "John Smith",
    book: "Don Quixote",
    author: "Miguel de Cervantes",
    days: 5,
    fine: 4.5,
    color: "var(--chart-1)",
    initial: "J",
  },
  {
    id: "USR-2025",
    name: "Emma",
    book: "Pride and Prejudice",
    author: "Jane Austen",
    days: 4,
    fine: 3.5,
    color: "var(--chart-5)",
    initial: "E",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type DashboardPageProps = { session: AuthSession };

export default function DashboardPage({ session }: DashboardPageProps) {
  const router = useRouter();
  const [_isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const userName = session?.user?.name || "James";

  const handleSignOut = async () => {
    setSignOutError(null);
    setIsSigningOut(true);
    try {
      const { error } = await authClient.signOut({
        fetchOptions: { onSuccess: () => router.navigate({ to: "/login" }) },
      });
      if (error) {
        setSignOutError(error.message || "Unable to sign out.");
        setIsSigningOut(false);
      }
    } catch {
      setSignOutError("Unable to sign out right now.");
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">
      {/* ---- Sidebar ---- */}
      <TooltipProvider delayDuration={0}>
        <aside
          className={`flex h-full shrink-0 flex-col border-r border-border bg-card transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-0 overflow-hidden lg:w-16"
          }`}
        >
          <div className="flex h-[72px] shrink-0 items-center border-b border-border px-3 overflow-hidden">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Library size={22} />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" align="center" hidden={sidebarOpen}>
                Bookary
              </TooltipContent>
            </Tooltip>
            <span className={`ml-2 text-2xl font-bold tracking-tight text-primary ${sidebarOpen ? "" : "lg:hidden"}`}>
              Bookary
            </span>
          </div>

          <div className="flex-1 overflow-auto px-3 pt-4">
            <NavSection title="MAIN MENU" visible={sidebarOpen} items={NAV_MAIN} />
            <NavSection title="MANAGEMENT" visible={sidebarOpen} items={NAV_MANAGEMENT} />
            <NavSection
              title="SETTING & OTHERS"
              visible={sidebarOpen}
              items={NAV_SETTINGS}
              onAction={(action) => {
                if (action === "signout") handleSignOut();
              }}
            />
          </div>

          <div className="shrink-0 p-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex w-full items-center justify-center rounded-lg h-10 bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <ChevronLeft size={18} className={sidebarOpen ? "" : "rotate-180"} />
            </button>
          </div>
        </aside>
      </TooltipProvider>

      {/* ---- Main Content ---- */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* ---- Top Bar ---- */}
        <header className="flex items-center gap-4 border-b border-border bg-background px-6 h-[72px] shrink-0">
          <div className="shrink-0">
            <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Good morning {userName} 👋</p>
          </div>

          <div className="ml-6 flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="type here to search anything"
                className="h-11 rounded-2xl border-border bg-muted/60 pl-11 pr-16 text-sm outline-none"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
                ⌘F
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground"
            >
              <Globe size={18} />
            </button>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground"
            >
              <Bell size={18} />
            </button>
            <Button className="h-10 gap-2 rounded-2xl px-5 text-sm font-semibold">
              <UserPlus size={16} />
              Add Member
            </Button>
          </div>
        </header>

        {/* ---- Dashboard Content ---- */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {signOutError && (
            <div
              role="alert"
              className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {signOutError}
            </div>
          )}

          {/* Top Row: Stats + Right Column */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column (8/12) */}
            <section className="col-span-12 space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <StatCard
                  icon={BookOpen}
                  label="Total Books"
                  value="12,856"
                  sub="In collection"
                  change="+120"
                  changeType="up"
                />
                <StatCard
                  icon={Users}
                  label="Active Members"
                  value="2,170+"
                  sub="This month"
                  change="+3.7%"
                  changeType="up"
                />
                <StatCard
                  icon={BookOpen}
                  label="Borrowed Books"
                  value="4,793+"
                  sub="Books borrowed"
                  change="+25%"
                  changeType="up"
                />
                <StatCard
                  icon={Clock}
                  label="Overdue Returns"
                  value="237+"
                  sub="Item overdue"
                  change="-5.8%"
                  changeType="down"
                />
              </div>

              {/* Revenue Breakdown */}
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
                        <RechartsTooltip
                          formatter={(value: number) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                        />
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

              {/* Overdue Table */}
              <Card className="rounded-2xl border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-0">
                  <CardTitle className="text-base font-semibold">Overdue Items Summary</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 rounded-full border border-border bg-muted/60 text-xs text-muted-foreground"
                  >
                    This week <ChevronDown size={12} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-muted-foreground">
                          <th className="py-2 text-left font-medium">Borrower ⇅</th>
                          <th className="py-2 text-left font-medium">Book Info ⇅</th>
                          <th className="py-2 text-left font-medium">Days O/D ⇅</th>
                          <th className="py-2 text-left font-medium">Fine ⇅</th>
                          <th className="py-2 text-left font-medium">Action ⇅</th>
                        </tr>
                      </thead>
                      <tbody>
                        {OVERDUE_ITEMS.map((item) => (
                          <tr key={item.id} className="border-t border-border">
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="grid size-10 place-items-center rounded-full text-sm font-semibold text-primary-foreground"
                                  style={{ background: item.color }}
                                >
                                  {item.initial}
                                </div>
                                <div>
                                  <div className="font-semibold">{item.name}</div>
                                  <div className="text-xs text-muted-foreground">ID: {item.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-10 rounded-md border border-border bg-gradient-to-br from-accent to-muted" />
                                <div>
                                  <div className="font-semibold">{item.book}</div>
                                  <div className="text-xs text-muted-foreground">{item.author}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 font-medium">{String(item.days).padStart(2, "0")} Days</td>
                            <td className="py-3 font-medium">${item.fine}</td>
                            <td className="py-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full border-border text-xs font-semibold hover:bg-muted"
                              >
                                Notify
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function NavSection({
  title,
  visible,
  items,
  onAction,
}: {
  title: string;
  visible: boolean;
  items: { label: string; icon: React.ComponentType<{ size?: number }>; active?: boolean; action?: string }[];
  onAction?: (action: string) => void;
}) {
  return (
    <div className="mt-6 first:mt-0">
      <div
        className={`mb-3 text-[11px] font-semibold tracking-[0.12em] text-muted-foreground px-2 ${
          visible ? "" : "lg:hidden"
        }`}
      >
        {title}
      </div>
      <nav className="space-y-1">
        {items.map((item) => (
          <Tooltip key={item.label}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => item.action && onAction?.(item.action)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 h-10 text-sm font-medium transition-colors ${
                  visible ? "" : "lg:size-10 lg:justify-center lg:p-0 lg:gap-0"
                } ${item.active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground/80 hover:bg-muted"}`}
              >
                <item.icon size={18} />
                <span className={visible ? "" : "lg:hidden"}>{item.label}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center" hidden={visible}>
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  change,
  changeType,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
  sub: string;
  change: string;
  changeType: "up" | "down";
}) {
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
            className={`inline-flex items-center gap-1 text-sm font-semibold ${
              changeType === "up" ? "text-success" : "text-danger"
            }`}
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
