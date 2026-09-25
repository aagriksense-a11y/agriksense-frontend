import type { Metadata } from "next";
import IotAdmin from "@/components/admin/iot-admin";

export const metadata: Metadata = { title: "IoT Sensors" };

export default function IotPage() {
  return <IotAdmin />;
}
