import type { Metadata } from "next";
import FarmersAdmin from "@/components/admin/farmers-admin";

export const metadata: Metadata = { title: "Farmers" };

export default function FarmersPage() {
  return <FarmersAdmin />;
}
