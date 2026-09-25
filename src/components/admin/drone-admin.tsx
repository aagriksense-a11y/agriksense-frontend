"use client";

import DashboardShell from "@/components/dashboard/shell";
import { Dot, List, ProgressBar, TableWrap, Td, Tag, Th } from "@/components/ui";
import type { TagKind } from "@/lib/format";
import { AdminCard, AdminCardHead, AdminKpiCard, TABLE_COLLAPSE } from "@/components/admin/parts";

/* Static demo content from server/views/drone.ejs (no API call in the legacy page). */

const MISSIONS: { mission: string; drone: string; cluster: string; area: string; time: string; status: string; kind: TagKind }[] = [
  { mission: "NDVI scan", drone: "MAV21", cluster: "Maize belt", area: "18 ha", time: "08:00", status: "Done", kind: "green" },
  { mission: "NDVI scan", drone: "MAV21", cluster: "Rice cluster", area: "12 ha", time: "09:30", status: "Done", kind: "green" },
  { mission: "Pest survey", drone: "MAV20", cluster: "Tomato farms", area: "11 ha", time: "11:00", status: "Flying", kind: "blue" },
  { mission: "Irrigation check", drone: "MAV18", cluster: "Rice cluster", area: "9 ha", time: "14:45", status: "Queued", kind: "amber" },
  { mission: "Salt stress scan", drone: "MAV22", cluster: "Beans block", area: "8 ha", time: "16:20", status: "Queued", kind: "amber" },
];

const COVERAGE: { crop: string; tone: "green" | "amber"; pct: number }[] = [
  { crop: "Maize", tone: "green", pct: 88 },
  { crop: "Rice", tone: "green", pct: 76 },
  { crop: "Tomato", tone: "amber", pct: 58 },
  { crop: "Beans", tone: "amber", pct: 52 },
];

const NDVI_STATS: { value: string; label: string }[] = [
  { value: "81%", label: "Overall" },
  { value: "24", label: "Scans" },
  { value: "4.2", label: "Avg flights/wk" },
];

export default function DroneAdmin() {
  return (
    <DashboardShell title="Drone Monitoring">
      <section className="kpis">
        <AdminKpiCard label="Active drones" value="3 of 4" delta="1 on charge" />
        <AdminKpiCard label="Area scanned" value="312" delta="ha this week" />
        <AdminKpiCard label="NDVI coverage" value="81%" delta="of active farms" />
        <AdminKpiCard label="Flies scheduled" value="14" delta="3 for review" tone="amber" />
      </section>

      <section className="grid-2">
        <AdminCard>
          <AdminCardHead title="Flight schedule" sub="Upcoming drone missions across clusters" />
          <TableWrap className={TABLE_COLLAPSE}>
            <thead>
              <tr>
                <Th>Mission</Th>
                <Th>Cluster</Th>
                <Th>Area</Th>
                <Th>Time</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {MISSIONS.map((m, i) => (
                <tr key={`${m.mission}-${m.cluster}-${i}`}>
                  <Td>
                    <b className="text-[13px]">{m.mission}</b>
                    <small className="text-[11px] text-[#889189]">{m.drone}</small>
                  </Td>
                  <Td>{m.cluster}</Td>
                  <Td>{m.area}</Td>
                  <Td>{m.time}</Td>
                  <Td>
                    <Tag kind={m.kind}>{m.status}</Tag>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </AdminCard>

        <AdminCard>
          <AdminCardHead
            title="NDVI coverage"
            sub="Vegetation health scans completed per crop"
          />
          <div className="dev-kpis">
            {NDVI_STATS.map((s) => (
              <div key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <List>
            {COVERAGE.map((c) => (
              <div key={c.crop} className="flex items-center gap-2.5 py-2.5 text-[12px] text-[#5c665f]">
                <span>
                  <Dot tone={c.tone} />
                  {c.crop}
                </span>
                <ProgressBar pct={c.pct} className="min-w-[60px]" />
                <b className="ml-auto font-bold text-[#111]">{c.pct}%</b>
              </div>
            ))}
          </List>
        </AdminCard>
      </section>
    </DashboardShell>
  );
}
