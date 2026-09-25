import type { Metadata } from "next";
import AnalyticsAdmin from "@/components/admin/analytics-admin";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return <AnalyticsAdmin />;
}
