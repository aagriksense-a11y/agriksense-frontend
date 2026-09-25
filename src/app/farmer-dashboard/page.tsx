import type { Metadata } from "next";
import FarmerDashboard from "@/components/roles/farmer-dashboard";

export const metadata: Metadata = { title: "My Dashboard" };

export default function FarmerDashboardPage() {
  return <FarmerDashboard />;
}
