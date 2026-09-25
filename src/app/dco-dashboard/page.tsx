import type { Metadata } from "next";
import DcoDashboard from "@/components/roles/dco-dashboard";

export const metadata: Metadata = { title: "DCO Dashboard" };

export default function DcoDashboardPage() {
  return <DcoDashboard />;
}
