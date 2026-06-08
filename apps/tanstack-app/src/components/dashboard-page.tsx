import { authClient } from "@repo/auth/client";
import type { AuthSession } from "@repo/auth/server";
import { Avatar, AvatarBadge, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Progress } from "@repo/ui/components/ui/progress";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@repo/ui/components/ui/sidebar";
import { cn } from "@repo/ui/lib/utils";
import { useRouter } from "@tanstack/react-router";
import {
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Fingerprint,
  Gauge,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  Loader2,
  LogOut,
  MessageSquareText,
  PanelTop,
  Settings2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ModeToggle } from "./mode-toggle";

const navigationItems = [
  { label: "Overview", icon: LayoutDashboard, isActive: true, badge: "Live" },
  { label: "Customers", icon: UsersRound },
  { label: "Revenue", icon: CircleDollarSign },
  { label: "Messages", icon: MessageSquareText, badge: "8" },
  { label: "Billing", icon: CreditCard },
];

const workspaceItems = [
  { label: "Acquisition", value: 78, detail: "+12.4% this month" },
  { label: "Activation", value: 64, detail: "2,431 qualified users" },
  { label: "Retention", value: 91, detail: "enterprise cohort steady" },
];

const metrics = [
  {
    label: "Monthly recurring revenue",
    value: "$84.2K",
    change: "+18.7%",
    icon: CircleDollarSign,
  },
  {
    label: "Active accounts",
    value: "2,842",
    change: "+9.1%",
    icon: UsersRound,
  },
  { label: "Pipeline health", value: "94%", change: "On track", icon: Gauge },
];

const activityItems = [
  "Northstar renewal moved to procurement review",
  "Usage alerts resolved for the Atlas workspace",
  "Quarterly billing export is ready for finance",
];

function formatDate(value?: string | Date | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

type DashboardPageProps = {
  session: AuthSession;
};

export default function DashboardPage({ session }: DashboardPageProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const userName = session?.user?.name || "SaaS operator";
  const userInitials = useMemo(() => {
    const nameParts = userName.trim().split(/\s+/).filter(Boolean);
    return (
      nameParts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "SO"
    );
  }, [userName]);

  const handleSignOut = async () => {
    setSignOutError(null);
    setIsSigningOut(true);

    try {
      const { error: logoutError } = await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.navigate({ to: "/login" });
          },
        },
      });

      if (logoutError) {
        setSignOutError(logoutError.message || "Unable to sign out.");
        setIsSigningOut(false);
      }
    } catch {
      setSignOutError("Unable to sign out right now. Check your connection and try again.");
      setIsSigningOut(false);
    }
  };

  return (
    <SidebarProvider className="min-h-screen bg-background font-['Avenir_Next','Segoe_UI',sans-serif] text-foreground [--sidebar-width:18rem]">
      <DashboardAtmosphere />
      <Sidebar collapsible="icon" variant="inset" className="p-3 text-foreground">
        <SidebarHeader className="rounded-t-[1.75rem] border-x border-t border-border/60 bg-card/70 p-4 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/35 p-3">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary shadow-xl">
              <BriefcaseBusiness />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Lumina OS
              </p>
              <p className="truncate font-['Avenir_Next','Segoe_UI',sans-serif] text-sm font-semibold text-card-foreground">
                Private console
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="overflow-x-hidden border-x border-border/60 bg-card/70 px-2 py-3 backdrop-blur-2xl">
          <SidebarGroup className="p-2">
            <SidebarGroupLabel className="font-[ui-monospace,Menlo,monospace] uppercase tracking-[0.22em] text-muted-foreground">
              Command
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.label} className="min-w-0">
                    <SidebarMenuButton
                      isActive={item.isActive}
                      tooltip={item.label}
                      className="h-11 rounded-2xl border border-transparent px-3 font-['Avenir_Next','Segoe_UI',sans-serif] text-muted-foreground transition-all duration-300 data-[active=true]:border-primary/25 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:shadow-xl hover:border-border/60 hover:bg-secondary/40 hover:text-foreground"
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {item.badge ? <SidebarMenuBadge className="text-primary">{item.badge}</SidebarMenuBadge> : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="bg-border/60" />

          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="font-[ui-monospace,Menlo,monospace] uppercase tracking-[0.22em] text-muted-foreground">
              Health
            </SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-background/35 p-3">
              {workspaceItems.map((item) => (
                <div key={item.label} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-medium text-card-foreground">{item.label}</span>
                    <span className="font-[ui-monospace,Menlo,monospace] text-muted-foreground">{item.value}%</span>
                  </div>
                  <Progress
                    value={item.value}
                    className="h-1.5 bg-secondary/40 [&_[data-slot=progress-indicator]]:bg-primary"
                  />
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="rounded-b-[1.75rem] border-x border-b border-border/60 bg-card/70 p-4 shadow-2xl backdrop-blur-2xl">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 rounded-2xl text-muted-foreground hover:bg-secondary/40 hover:text-foreground">
                <Settings2 />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 rounded-2xl text-muted-foreground hover:bg-secondary/40 hover:text-foreground">
                <LifeBuoy />
                <span>Support</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="relative bg-transparent">
        <main className="relative z-10 min-h-screen p-3 md:p-5">
          <div className="mx-auto flex max-w-7xl flex-col gap-5">
            <header className="sticky top-3 z-20 flex flex-col gap-4 rounded-[1.75rem] border border-border/60 bg-card/75 p-4 shadow-2xl backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <SidebarTrigger className="rounded-xl border border-border/60 bg-secondary/40 text-foreground hover:bg-secondary/70 hover:text-primary" />
                <Separator orientation="vertical" className="hidden h-8 bg-border/60 sm:block" />
                <div className="min-w-0">
                  <p className="font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Executive dashboard
                  </p>
                  <h1 className="truncate font-['Didot','Bodoni_72','Times_New_Roman',serif] text-2xl font-medium tracking-[-0.05em] text-foreground sm:text-3xl">
                    Good to see you, {userName}
                  </h1>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <ModeToggle />
                <Badge className="border border-border/60 bg-secondary/40 px-3 py-1 text-primary hover:bg-secondary/70">
                  <ShieldCheck />
                  Session live
                </Badge>
                <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/35 px-3 py-2">
                  <Avatar size="lg" className="bg-primary/10 text-primary">
                    <AvatarFallback className="bg-primary/10 font-semibold text-primary">{userInitials}</AvatarFallback>
                    <AvatarBadge className="bg-primary" />
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{userName}</p>
                    <p className="truncate text-xs text-muted-foreground">{session.user.email || "No email on file"}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  aria-busy={isSigningOut}
                  className="h-11 rounded-xl border-border/60 bg-secondary/40 font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.18em] text-secondary-foreground hover:bg-secondary/70 hover:text-primary"
                >
                  {isSigningOut ? (
                    <Loader2 className="animate-spin" data-icon="inline-start" />
                  ) : (
                    <LogOut data-icon="inline-start" />
                  )}
                  {isSigningOut ? "Signing out" : "Logout"}
                </Button>
                <span className="sr-only" aria-live="polite">
                  {isSigningOut ? "Signing out" : ""}
                </span>
              </div>
            </header>

            {signOutError ? (
              <div
                role="alert"
                className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {signOutError}
              </div>
            ) : null}

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.55fr)]">
              <Card className="relative overflow-hidden rounded-[2rem] border-border/60 bg-card/75 py-0 text-card-foreground shadow-2xl backdrop-blur-2xl">
                <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-primary/80 to-transparent" />
                <CardHeader className="gap-6 p-6 lg:p-8">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl space-y-4">
                      <Badge variant="outline" className="border-primary/25 bg-primary/10 text-primary">
                        <Sparkles />
                        Q4 growth plan
                      </Badge>
                      <CardTitle className="font-['Didot','Bodoni_72','Times_New_Roman',serif] text-4xl font-medium leading-[0.95] tracking-[-0.07em] text-card-foreground sm:text-6xl">
                        Scale revenue without losing operational texture.
                      </CardTitle>
                      <CardDescription className="max-w-2xl text-base leading-8 text-muted-foreground">
                        A focused cockpit for customer health, commercial motion, and account risk. Your authenticated
                        workspace is ready.
                      </CardDescription>
                    </div>
                    <div className="rounded-[1.5rem] border border-border/60 bg-background/35 p-4">
                      <p className="font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                        Net retention
                      </p>
                      <p className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-card-foreground">118%</p>
                      <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                        <TrendingUp />
                        4.8 point lift
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 p-6 pt-0 lg:p-8 lg:pt-0">
                  <div className="grid gap-4 md:grid-cols-3">
                    {metrics.map((metric) => (
                      <Card
                        key={metric.label}
                        className="rounded-[1.5rem] border-border/60 bg-background/35 py-0 text-card-foreground"
                      >
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between gap-4">
                            <div className="rounded-xl border border-primary/25 bg-primary/10 p-2 text-primary">
                              <metric.icon />
                            </div>
                            <Badge variant="outline" className="border-border/60 bg-secondary/40 text-primary">
                              {metric.change}
                            </Badge>
                          </div>
                          <p className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-card-foreground">
                            {metric.value}
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">{metric.label}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(280px,0.55fr)]">
                    <div className="rounded-[1.75rem] border border-border/60 bg-background/35 p-5 text-card-foreground">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                            Revenue curve
                          </p>
                          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Forecast quality</h2>
                        </div>
                        <Badge className="bg-secondary/40 text-primary hover:bg-secondary/70">
                          <BarChart3 />
                          Clean
                        </Badge>
                      </div>
                      <div className="mt-8 grid h-56 grid-cols-12 items-end gap-2 rounded-2xl border border-border/60 bg-background/35 p-4">
                        {[36, 44, 41, 58, 53, 68, 64, 72, 79, 74, 86, 92].map((height, index) => (
                          <div
                            key={height}
                            className={cn("rounded-t-lg bg-primary/65 shadow-xl", index > 8 && "bg-primary")}
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <InfoRow icon={UserRound} label="Operator" value={userName} />
                      <InfoRow icon={Fingerprint} label="Email" value={session.user.email || "Not available"} />
                      <InfoRow icon={Clock3} label="Session expires" value={formatDate(session.session.expiresAt)} />
                      <InfoRow icon={KeyRound} label="User ID" value={session.user.id || "Not available"} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <aside className="grid gap-5">
                <Card className="rounded-[2rem] border-border/60 bg-card/75 py-0 text-card-foreground shadow-2xl backdrop-blur-2xl">
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="rounded-xl border border-primary/25 bg-primary/10 p-2 text-primary">
                        <ShieldCheck />
                      </div>
                      <Badge variant="outline" className="border-border/60 bg-secondary/40 text-primary">
                        Verified
                      </Badge>
                    </div>
                    <CardTitle className="font-['Didot','Bodoni_72','Times_New_Roman',serif] text-3xl font-medium tracking-[-0.05em] text-card-foreground">
                      Account posture is clear.
                    </CardTitle>
                    <CardDescription className="leading-7 text-muted-foreground">
                      This browser session is active. Use logout to invalidate it before switching operators or leaving
                      a shared device.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="rounded-[2rem] border-border/60 bg-card/75 py-0 text-card-foreground shadow-2xl backdrop-blur-2xl">
                  <CardContent className="space-y-5 p-6">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-primary/25 bg-primary/10 p-2 text-primary">
                        <PanelTop />
                      </div>
                      <div>
                        <p className="font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                          Today
                        </p>
                        <h2 className="text-xl font-semibold tracking-[-0.04em]">Operating notes</h2>
                      </div>
                    </div>
                    <Separator className="bg-border/60" />
                    {activityItems.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 text-primary" />
                        <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </aside>
            </section>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/35 p-4">
      <div className="mb-3 flex items-center gap-2 text-primary">
        <Icon />
        <span className="font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="break-words text-sm leading-6 text-card-foreground">{value}</p>
    </div>
  );
}

function DashboardAtmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Dashboard shares the auth atmosphere so the protected app feels like the same Lumina command surface. */}
      <div className="home-atmosphere absolute inset-0" />
      <div className="home-grid-overlay absolute inset-0" />
      <div className="home-noise-overlay absolute inset-0 opacity-[0.035] mix-blend-multiply dark:opacity-5 dark:mix-blend-screen" />
      <div className="absolute left-1/2 top-0 h-px w-[70vw] -translate-x-1/2 bg-linear-to-r from-transparent via-primary/70 to-transparent" />
    </div>
  );
}
