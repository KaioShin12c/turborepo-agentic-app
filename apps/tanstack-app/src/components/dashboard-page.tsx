import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
} from "@repo/ui/components/ui/avatar";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
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
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { authClient } from "@repo/auth/client";
import type { AuthSession } from "@repo/auth/server";

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
  { label: "Active accounts", value: "2,842", change: "+9.1%", icon: UsersRound },
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
      setSignOutError(
        "Unable to sign out right now. Check your connection and try again.",
      );
      setIsSigningOut(false);
    }
  };

  return (
    <SidebarProvider
      className="min-h-screen bg-[#F7FBFF] font-['Avenir_Next','Segoe_UI',sans-serif] text-[#102033]"
      style={
        {
          "--sidebar-width": "18rem",
          "--sidebar": "rgba(255,255,255,0.72)",
          "--sidebar-foreground": "#102033",
          "--sidebar-accent": "rgba(224,242,254,0.75)",
          "--sidebar-accent-foreground": "#075985",
          "--sidebar-border": "rgba(203,213,225,0.78)",
          "--sidebar-ring": "#0284C7",
        } as CSSProperties
      }
    >
      <DashboardAtmosphere />
      <Sidebar
        collapsible="icon"
        variant="inset"
        className="p-3 text-[#102033]"
      >
        <SidebarHeader className="rounded-t-[1.75rem] border-x border-t border-white/75 bg-white/70 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.1)] backdrop-blur-2xl">
          <div className="flex items-center gap-3 rounded-2xl border border-[#CFE8F7] bg-[#F8FCFF]/80 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-[#0284C7]/20 bg-[#E0F2FE]/80 text-[#0369A1] shadow-[0_16px_42px_rgba(14,116,144,0.14)]">
              <BriefcaseBusiness />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.28em] text-[#64748B]">
                Lumina OS
              </p>
              <p className="truncate font-['Avenir_Next','Segoe_UI',sans-serif] text-sm font-semibold text-[#102033]">
                Private console
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="overflow-x-hidden border-x border-white/75 bg-white/70 px-2 py-3 backdrop-blur-2xl">
          <SidebarGroup className="p-2">
            <SidebarGroupLabel className="font-[ui-monospace,Menlo,monospace] uppercase tracking-[0.22em] text-[#64748B]">
              Command
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.label} className="min-w-0">
                    <SidebarMenuButton
                      isActive={item.isActive}
                      tooltip={item.label}
                      className="h-11 rounded-2xl border border-transparent px-3 font-['Avenir_Next','Segoe_UI',sans-serif] text-[#475569] transition-all duration-300 data-[active=true]:border-[#0284C7]/25 data-[active=true]:bg-[#E0F2FE]/80 data-[active=true]:text-[#075985] data-[active=true]:shadow-[0_16px_42px_rgba(14,116,144,0.1)] hover:border-[#CBD5E1] hover:bg-white/80 hover:text-[#102033]"
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {item.badge ? (
                      <SidebarMenuBadge className="text-[#059669]">
                        {item.badge}
                      </SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="bg-[#CBD5E1]" />

          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="font-[ui-monospace,Menlo,monospace] uppercase tracking-[0.22em] text-[#64748B]">
              Health
            </SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-4 rounded-2xl border border-[#CFE8F7] bg-[#F8FCFF]/80 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              {workspaceItems.map((item) => (
                <div key={item.label} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-medium text-[#334155]">{item.label}</span>
                    <span className="font-[ui-monospace,Menlo,monospace] text-[#64748B]">
                      {item.value}%
                    </span>
                  </div>
                  <Progress
                    value={item.value}
                    className="h-1.5 bg-[#DBEAFE] [&_[data-slot=progress-indicator]]:bg-[#0284C7]"
                  />
                  <p className="text-xs text-[#64748B]">{item.detail}</p>
                </div>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="rounded-b-[1.75rem] border-x border-b border-white/75 bg-white/70 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.1)] backdrop-blur-2xl">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 rounded-2xl text-[#475569] hover:bg-white/80 hover:text-[#102033]">
                <Settings2 />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 rounded-2xl text-[#475569] hover:bg-white/80 hover:text-[#102033]">
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
            <header className="sticky top-3 z-20 flex flex-col gap-4 rounded-[1.75rem] border border-white/75 bg-white/72 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <SidebarTrigger className="rounded-xl border border-[#CBD5E1] bg-white/70 text-[#102033] hover:bg-white hover:text-[#075985]" />
                <Separator orientation="vertical" className="hidden h-8 bg-[#CBD5E1] sm:block" />
                <div className="min-w-0">
                  <p className="font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.3em] text-[#64748B]">
                    Executive dashboard
                  </p>
                  <h1 className="truncate font-['Didot','Bodoni_72','Times_New_Roman',serif] text-2xl font-medium tracking-[-0.05em] text-[#102033] sm:text-3xl">
                    Good to see you, {userName}
                  </h1>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Badge className="border border-[#10B981]/20 bg-[#ECFDF5]/80 px-3 py-1 text-[#047857] hover:bg-[#ECFDF5]">
                  <ShieldCheck />
                  Session live
                </Badge>
                <div className="flex items-center gap-3 rounded-2xl border border-[#CFE8F7] bg-[#F8FCFF]/80 px-3 py-2">
                  <Avatar size="lg" className="bg-[#E0F2FE] text-[#075985]">
                    <AvatarFallback className="bg-[#E0F2FE] font-semibold text-[#075985]">
                      {userInitials}
                    </AvatarFallback>
                    <AvatarBadge className="bg-[#10B981]" />
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#102033]">{userName}</p>
                    <p className="truncate text-xs text-[#64748B]">
                      {session.user.email || "No email on file"}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  aria-busy={isSigningOut}
                  className="h-11 rounded-xl border-[#CBD5E1] bg-white/70 font-[ui-monospace,Menlo,monospace] text-xs uppercase tracking-[0.18em] text-[#102033] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] hover:border-[#0284C7]/35 hover:bg-white hover:text-[#075985]"
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
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {signOutError}
              </div>
            ) : null}

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.55fr)]">
              <Card className="relative overflow-hidden rounded-[2rem] border-white/75 bg-white/78 py-0 text-[#102033] shadow-[0_30px_110px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#0284C7]/55 to-transparent" />
                <CardHeader className="gap-6 p-6 lg:p-8">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl space-y-4">
                      <Badge variant="outline" className="border-[#0284C7]/20 bg-[#E0F2FE]/70 text-[#0369A1]">
                        <Sparkles />
                        Q4 growth plan
                      </Badge>
                      <CardTitle className="font-['Didot','Bodoni_72','Times_New_Roman',serif] text-4xl font-medium leading-[0.95] tracking-[-0.07em] text-[#102033] sm:text-6xl">
                        Scale revenue without losing operational texture.
                      </CardTitle>
                      <CardDescription className="max-w-2xl text-base leading-8 text-[#475569]">
                        A focused cockpit for customer health, commercial motion,
                        and account risk. Your authenticated workspace is ready.
                      </CardDescription>
                    </div>
                    <div className="rounded-[1.5rem] border border-[#CFE8F7] bg-[#F8FCFF]/80 p-4 shadow-[0_20px_54px_rgba(14,116,144,0.1)]">
                      <p className="font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.26em] text-[#64748B]">
                        Net retention
                      </p>
                      <p className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-[#102033]">
                        118%
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-sm text-[#059669]">
                        <TrendingUp />
                        4.8 point lift
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 p-6 pt-0 lg:p-8 lg:pt-0">
                  <div className="grid gap-4 md:grid-cols-3">
                    {metrics.map((metric) => (
                      <Card key={metric.label} className="rounded-[1.5rem] border-[#CFE8F7] bg-[#F8FCFF]/80 py-0 text-[#102033]">
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between gap-4">
                            <div className="rounded-xl border border-[#0284C7]/20 bg-[#E0F2FE]/70 p-2 text-[#0369A1]">
                              <metric.icon />
                            </div>
                            <Badge variant="outline" className="border-[#10B981]/20 bg-[#ECFDF5]/70 text-[#047857]">
                              {metric.change}
                            </Badge>
                          </div>
                          <p className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#102033]">
                            {metric.value}
                          </p>
                          <p className="mt-2 text-sm text-[#475569]">{metric.label}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(280px,0.55fr)]">
                    <div className="rounded-[1.75rem] border border-[#CFE8F7] bg-[#F8FCFF]/80 p-5 text-[#102033]">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.28em] text-[#64748B]">
                            Revenue curve
                          </p>
                          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                            Forecast quality
                          </h2>
                        </div>
                        <Badge className="bg-[#ECFDF5]/80 text-[#047857] hover:bg-[#ECFDF5]">
                          <BarChart3 />
                          Clean
                        </Badge>
                      </div>
                      <div className="mt-8 grid h-56 grid-cols-12 items-end gap-2 rounded-2xl border border-[#CFE8F7] bg-white/72 p-4">
                        {[36, 44, 41, 58, 53, 68, 64, 72, 79, 74, 86, 92].map(
                          (height, index) => (
                            <div
                              key={`${height}-${index}`}
                              className={cn(
                                "rounded-t-lg bg-[#38BDF8]/65 shadow-[0_14px_24px_rgba(14,116,144,0.14)]",
                                index > 8 && "bg-[#10B981] shadow-[0_14px_26px_rgba(16,185,129,0.18)]",
                              )}
                              style={{ height: `${height}%` }}
                            />
                          ),
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <InfoRow icon={UserRound} label="Operator" value={userName} />
                      <InfoRow
                        icon={Fingerprint}
                        label="Email"
                        value={session.user.email || "Not available"}
                      />
                      <InfoRow
                        icon={Clock3}
                        label="Session expires"
                        value={formatDate(session.session.expiresAt)}
                      />
                      <InfoRow
                        icon={KeyRound}
                        label="User ID"
                        value={session.user.id || "Not available"}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <aside className="grid gap-5">
                <Card className="rounded-[2rem] border-white/75 bg-white/76 py-0 text-[#102033] shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="rounded-xl border border-[#10B981]/20 bg-[#ECFDF5]/80 p-2 text-[#047857]">
                        <ShieldCheck />
                      </div>
                      <Badge variant="outline" className="border-[#10B981]/20 bg-[#ECFDF5]/70 text-[#047857]">
                        Verified
                      </Badge>
                    </div>
                    <CardTitle className="font-['Didot','Bodoni_72','Times_New_Roman',serif] text-3xl font-medium tracking-[-0.05em] text-[#102033]">
                      Account posture is clear.
                    </CardTitle>
                    <CardDescription className="leading-7 text-[#475569]">
                      This browser session is active. Use logout to invalidate it
                      before switching operators or leaving a shared device.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="rounded-[2rem] border-white/75 bg-white/76 py-0 text-[#102033] shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
                  <CardContent className="space-y-5 p-6">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-[#0284C7]/20 bg-[#E0F2FE]/70 p-2 text-[#0369A1]">
                        <PanelTop />
                      </div>
                      <div>
                        <p className="font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.28em] text-[#64748B]">
                          Today
                        </p>
                        <h2 className="text-xl font-semibold tracking-[-0.04em]">
                          Operating notes
                        </h2>
                      </div>
                    </div>
                    <Separator className="bg-[#CBD5E1]" />
                    {activityItems.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 text-[#059669]" />
                        <p className="text-sm leading-6 text-[#475569]">{item}</p>
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

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#CFE8F7] bg-[#F8FCFF]/80 p-4">
      <div className="mb-3 flex items-center gap-2 text-[#0369A1]">
        <Icon />
        <span className="font-[ui-monospace,Menlo,monospace] text-[10px] uppercase tracking-[0.24em] text-[#64748B]">
          {label}
        </span>
      </div>
      <p className="break-words text-sm leading-6 text-[#334155]">{value}</p>
    </div>
  );
}

function DashboardAtmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Dashboard shares the auth atmosphere so the protected app feels like the same Lumina command surface. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.24),transparent_34%),radial-gradient(circle_at_84%_8%,rgba(45,212,191,0.18),transparent_36%),radial-gradient(circle_at_50%_96%,rgba(251,191,36,0.14),transparent_34%),linear-gradient(120deg,#F9FCFF_0%,#ECF8FF_48%,#FFF8EA_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,32,51,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(16,32,51,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_86%)]" />
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute left-1/2 top-0 h-px w-[70vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#0284C7]/45 to-transparent" />
    </div>
  );
}
