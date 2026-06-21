import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Clock, Users } from "lucide-react";
import { OverdueTable } from "../../features/dashboard/components/overdue-table";
import { RevenueChart } from "../../features/dashboard/components/revenue-chart";
import { StatCard } from "../../features/dashboard/components/stat-card";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-12 flex flex-col gap-6">
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
  );
}
