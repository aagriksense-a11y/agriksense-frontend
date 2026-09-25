"use client";

import DashboardShell from "@/components/dashboard/shell";
import { TableWrap, Td, Tag, Th } from "@/components/ui";
import type { TagKind } from "@/lib/format";
import { AdminCard, AdminCardHead, AdminKpiCard, Mini, TABLE_COLLAPSE } from "@/components/admin/parts";

/* Static demo content from server/views/agriscore.ejs (no API call in the legacy page). */

const BANDS: { band: string; range: string; farmers: number; status: string; kind: TagKind }[] = [
  { band: "Excellent", range: "800 - 900", farmers: 24, status: "Credit-ready", kind: "green" },
  { band: "Good", range: "700 - 799", farmers: 51, status: "Credit-ready", kind: "green" },
  { band: "Fair", range: "600 - 699", farmers: 37, status: "Qualifying", kind: "blue" },
  { band: "Needs data", range: "400 - 599", farmers: 44, status: "Docs pending", kind: "amber" },
  { band: "Low trust", range: "0 - 399", farmers: 16, status: "Review", kind: "red" },
];

const INPUTS: { label: string; value: string }[] = [
  { label: "Score inputs", value: "Yield + plots + repayment" },
  { label: "Data sources", value: "NIN, BVN, drone NDVI" },
  { label: "Avg verified score", value: "712" },
];

export default function AgriscoreAdmin() {
  return (
    <DashboardShell title="AgriScore">
      <section className="kpis">
        <AdminKpiCard label="Farmers scored" value="172" delta="of 186 onboarded" />
        <AdminKpiCard label="Avg AgriScore" value="681" delta="▲ 24 this quarter" />
        <AdminKpiCard label="Credit-ready" value="112" delta="score ≥ 600" />
        <AdminKpiCard label="Loan access" value="₦86M" delta="approved pipeline" tone="amber" />
      </section>

      <section className="grid-2">
        <AdminCard>
          <AdminCardHead title="Score bands" sub="Farmer distribution across AgriScore bands" />
          <TableWrap className={TABLE_COLLAPSE}>
            <thead>
              <tr>
                <Th>Band</Th>
                <Th>Range</Th>
                <Th>Farmers</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {BANDS.map((b) => (
                <tr key={b.band}>
                  <Td>
                    <b className="text-[13px]">{b.band}</b>
                  </Td>
                  <Td>{b.range}</Td>
                  <Td>{b.farmers}</Td>
                  <Td>
                    <Tag kind={b.kind}>{b.status}</Tag>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </AdminCard>

        <AdminCard>
          <AdminCardHead title="Credit readiness" sub="Monthly pipeline toward lending partners" />
          <div className="rings">
            <div className="absolute text-center text-[11px] text-[#5c665f]">
              <strong className="block text-[18px] tracking-[-0.04em] text-ink">112</strong>
              farmers
            </div>
          </div>
          {INPUTS.map((i) => (
            <Mini key={i.label} label={i.label} value={i.value} />
          ))}
        </AdminCard>
      </section>
    </DashboardShell>
  );
}
