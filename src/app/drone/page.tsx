import type { Metadata } from "next";
import DroneAdmin from "@/components/admin/drone-admin";

export const metadata: Metadata = { title: "Drone Monitoring" };

export default function DronePage() {
  return <DroneAdmin />;
}
