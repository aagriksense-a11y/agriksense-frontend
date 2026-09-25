import type { Metadata } from "next";
import OrgDashboard from "@/components/roles/org-dashboard";

export const metadata: Metadata = { title: "Organization Dashboard" };

export default function OrgDashboardPage() {
  return <OrgDashboard />;
}
