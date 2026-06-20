import { authClient } from "@repo/auth/client";
import type { AuthSession } from "@repo/auth/server";
import { useRouter } from "@tanstack/react-router";
import { BookOpen, Clock, Users } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "../../../shared/components/sidebar";
import { TopBar } from "../../../shared/components/top-bar";
import { OverdueTable } from "./overdue-table";
import { RevenueChart } from "./revenue-chart";
import { StatCard } from "./stat-card";

type DashboardPageProps = { session: AuthSession };

export default function DashboardPage({ session }: DashboardPageProps) {
  const router = useRouter();
  const [_isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      <Sidebar sidebarOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} onSignOut={handleSignOut} />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar session={session} onSignOut={handleSignOut} />

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {signOutError && (
            <div
              role="alert"
              className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {signOutError}
            </div>
          )}

          <div className="grid grid-cols-12 gap-6">
            <section className="col-span-12 space-y-6">
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

              <RevenueChart />
              <OverdueTable />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
