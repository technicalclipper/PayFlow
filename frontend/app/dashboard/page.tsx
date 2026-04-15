import { getDashboardStats, getRecentActivity, getPayrolls } from "@/lib/queries";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, recentActivity, payrolls] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(5),
    getPayrolls(),
  ]);

  return (
    <DashboardClient
      stats={stats}
      recentActivity={recentActivity}
      payrolls={payrolls}
    />
  );
}
