"use client";

import type { CSSProperties } from "react";
import DashboardShell from "@/components/dashboard/shell";
import { Dot, List, ProgressBar, TableWrap, Td, Tag, Th } from "@/components/ui";
import type { TagKind } from "@/lib/format";
import {
  AdminCard,
  AdminCardHead,
  AdminKpiCard,
  Legend,
  LegendItem,
  Mini,
  TABLE_COLLAPSE,
} from "@/components/admin/parts";

/* Static demo content from server/views/analytics.ejs (no API call in the legacy page). */

const TOP_FIELDS: { plot: string; farmer: string; crop: string; projected: string; confidence: string; kind: TagKind }[] = [
  { plot: "CO - Riverside", farmer: "Chidi Okeke", crop: "Rice", projected: "3.9 t/ha", confidence: "High", kind: "green" },
  { plot: "AY - North field", farmer: "Amina Yusuf", crop: "Maize", projected: "3.4 t/ha", confidence: "High", kind: "green" },
  { plot: "NE - Hill plot", farmer: "Ngozi Eze", crop: "Beans", projected: "2.8 t/ha", confidence: "Med", kind: "blue" },
];

const OPERATIONS: { label: string; value: string }[] = [
  { label: "NDVI scans", value: "24" },
  { label: "Irrigations", value: "18" },
  { label: "Fertilizer rounds", value: "11" },
  { label: "Pest treatments", value: "6" },
];

const OPS_PROGRESS: { label: string; tone: "green" | "amber"; pct: number }[] = [
  { label: "Farms watered", tone: "green", pct: 72 },
  { label: "Soil samples", tone: "amber", pct: 48 },
];

export default function AnalyticsAdmin() {
  return (
    <DashboardShell title="Analytics">
      <section className="kpis">
        <AdminKpiCard label="Yield confidence" value="82%" delta="▲ 4% vs last season" />
        <AdminKpiCard label="Field health" value="Good" delta="across 142 farms" />
        <AdminKpiCard label="Total hectarage" value="386" delta="under monitoring" />
        <AdminKpiCard label="Season output" value="₦142M" delta="projected value" />
      </section>

      <section className="grid-2">
        <AdminCard>
          <AdminCardHead title="Yield confidence trend" sub="Model confidence by crop across the season" />
          <div className="area-fill mt-[18px] h-[160px] rounded-xl" />
          <Legend>
            <LegendItem tone="green">Maize</LegendItem>
            <LegendItem tone="blue">Rice</LegendItem>
          </Legend>
        </AdminCard>

        <AdminCard>
          <AdminCardHead title="Field health mix" sub="Health classification across monitored farms" />
          <div
            className="donut relative mx-auto my-4 grid size-[168px] place-items-center rounded-full"
            style={{ "--a": "58", "--b": "29", "--c": "13" } as CSSProperties}
          />
          <Legend>
            <LegendItem tone="green">Healthy 58%</LegendItem>
            <LegendItem tone="amber">Watch 29%</LegendItem>
            <LegendItem tone="red">Critical 13%</LegendItem>
          </Legend>
        </AdminCard>
      </section>

      <section className="grid-2">
        <AdminCard>
          <AdminCardHead title="Top yielding fields" sub="Highest projected output this season" />
          <TableWrap className={TABLE_COLLAPSE}>
            <thead>
              <tr>
                <Th>Plot</Th>
                <Th>Crop</Th>
                <Th>Projected</Th>
                <Th>Confidence</Th>
              </tr>
            </thead>
            <tbody>
              {TOP_FIELDS.map((f) => (
                <tr key={f.plot}>
                  <Td>
                    <b className="text-[13px]">{f.plot}</b>
                    <small className="text-[11px] text-[#889189]">{f.farmer}</small>
                  </Td>
                  <Td>{f.crop}</Td>
                  <Td>{f.projected}</Td>
                  <Td>
                    <Tag kind={f.kind}>{f.confidence}</Tag>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </AdminCard>

        <AdminCard>
          <AdminCardHead title="Operational summary" sub="Season-to-date field operations rollup" />
          <div className="grid-2">
            {OPERATIONS.map((o) => (
              <Mini key={o.label} label={o.label} value={o.value} />
            ))}
          </div>
          <List>
            {OPS_PROGRESS.map((p) => (
              <div key={p.label} className="flex items-center gap-2.5 py-2.5 text-[12px] text-[#5c665f]">
                <span>
                  <Dot tone={p.tone} />
                  {p.label}
                </span>
                <ProgressBar pct={p.pct} className="min-w-[60px]" />
                <b className="ml-auto font-bold text-[#111]">{p.pct}%</b>
              </div>
            ))}
          </List>
        </AdminCard>
      </section>
    </DashboardShell>
  );
}
