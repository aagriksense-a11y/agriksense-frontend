import type { Metadata } from "next";
import FarmsAdmin from "@/components/admin/farms-admin";

export const metadata: Metadata = { title: "Farms & Plots" };

export default function FarmsPage() {
  return <FarmsAdmin />;
}
