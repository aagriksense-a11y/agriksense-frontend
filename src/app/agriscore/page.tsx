import type { Metadata } from "next";
import AgriscoreAdmin from "@/components/admin/agriscore-admin";

export const metadata: Metadata = { title: "AgriScore" };

export default function AgriscorePage() {
  return <AgriscoreAdmin />;
}
