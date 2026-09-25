import type { Metadata } from "next";
import OpsDashboard from "@/components/admin/ops-dashboard";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <OpsDashboard />;
}
