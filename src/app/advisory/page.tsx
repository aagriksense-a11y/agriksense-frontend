import type { Metadata } from "next";
import AdvisoryAdmin from "@/components/admin/advisory-admin";

export const metadata: Metadata = { title: "AI Advisory" };

export default function AdvisoryPage() {
  return <AdvisoryAdmin />;
}
