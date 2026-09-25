"use client";

import { useState } from "react";
import DashboardShell from "@/components/dashboard/shell";
import { Button, InitialTile, TableWrap, Td, Tag, Th } from "@/components/ui";
import type { TagKind } from "@/lib/format";
import {
  AdminCard,
  AdminCardHead,
  AdminKpiCard,
  Legend,
  LegendItem,
  Mini,
  SearchBox,
  TABLE_COLLAPSE,
  Toolbar,
} from "@/components/admin/parts";

/* Static demo content from server/views/iot.ejs (no API call in the legacy page). */

const MOISTURE: { label: string; pct: number }[] = [
  { label: "Rice", pct: 52 },
  { label: "Maize", pct: 38 },
  { label: "Beans", pct: 31 },
  { label: "Tomato", pct: 24 },
];

/* dashboard.css defines `.al-dot` (red) and `.al-dot.amber` only — the legacy markup's
   `al-dot green` has no rule, so that alert keeps the default red dot. */
const ALERTS: { title: string; meta: string; tone: "red" | "amber" }[] = [
  { title: "Moisture critically low", meta: "Tomato cluster · 10 min ago", tone: "red" },
  { title: "Battery below 20%", meta: "STM-014 · 2 h ago", tone: "amber" },
  { title: "Rain expected Thu", meta: "Kano forecast · 6 h ago", tone: "amber" },
  { title: "Irrigation complete", meta: "Rice cluster · 7 h ago", tone: "red" },
];

type Sensor = {
  tile: string;
  tone?: "co" | "fb" | "im" | "ne" | "sa";
  id: string;
  deployed: string;
  type: string;
  cluster: string;
  battery: string;
  status: string;
  kind: TagKind;
};

const SENSORS: Sensor[] = [
  { tile: "01", id: "STM-011", deployed: "Deployed Mar 2025", type: "Soil", cluster: "Rice cluster", battery: "86%", status: "Online", kind: "green" },
  { tile: "02", tone: "co", id: "STM-014", deployed: "Deployed Mar 2025", type: "Soil", cluster: "Tomato farms", battery: "17%", status: "Low battery", kind: "amber" },
  { tile: "03", tone: "fb", id: "WTB-003", deployed: "Deployed Jan 2025", type: "Weather", cluster: "Maize belt", battery: "91%", status: "Online", kind: "green" },
  { tile: "04", tone: "im", id: "WTR-007", deployed: "Deployed Feb 2025", type: "Water", cluster: "Rice cluster", battery: "74%", status: "Online", kind: "green" },
  { tile: "05", tone: "ne", id: "STM-019", deployed: "Deployed Apr 2025", type: "Soil", cluster: "Beans block", battery: "63%", status: "Offline", kind: "maroon" },
  { tile: "06", tone: "sa", id: "WTB-005", deployed: "Deployed Jan 2025", type: "Weather", cluster: "Rice cluster", battery: "88%", status: "Online", kind: "green" },
];

const WEATHER: { label: string; value: string }[] = [
  { label: "High", value: "28°C" },
  { label: "Low", value: "21°C" },
  { label: "Rain", value: "Thu 40%" },
  { label: "Humidity", value: "68%" },
];

const BAR_CHART =
  "mt-2.5 flex h-[260px] items-stretch justify-between gap-3 overflow-visible border-b border-[#e7ebe5] px-1 pt-2 max-560px:h-[230px] max-560px:gap-1.5";

export default function IotAdmin() {
  const [search, setSearch] = useState("");

  return (
    <DashboardShell title="IoT Sensors">
      <section className="kpis">
        <AdminKpiCard label="Active sensors" value="58" delta="of 62 deployed" />
        <AdminKpiCard label="Soil moisture" value="34%" delta="below target" tone="amber" />
        <AdminKpiCard label="Battery health" value="82%" delta="fleet average" />
        <AdminKpiCard label="Alerts today" value="7" delta="2 need action" />
      </section>

      <section className="grid-2">
        <AdminCard>
          <AdminCardHead
            title="Soil moisture by cluster"
            sub="Average volumetric moisture at 30 cm depth"
          />
          <div className={BAR_CHART}>
            {MOISTURE.map((bar) => (
              <div
                key={bar.label}
                className="relative flex h-full max-w-14 flex-1 flex-col items-center gap-2"
              >
                <div className="tooltip">{bar.pct}%</div>
                <div className="relative flex min-h-[180px] w-full flex-1 items-end justify-center max-560px:min-h-[150px]">
                  <div
                    className="relative min-h-[10px] w-7 rounded-t-[8px] bg-[#e8ece7] max-560px:w-[18px]"
                    style={{ height: `${bar.pct}%` }}
                  />
                </div>
                <div className="flex-none pb-2 text-[10px] font-semibold tracking-[0.02em] text-[#889189]">
                  {bar.label}
                </div>
              </div>
            ))}
          </div>
          <Legend>
            <LegendItem tone="green">Healthy</LegendItem>
            <LegendItem tone="amber">Watch</LegendItem>
            <LegendItem tone="red">Critical</LegendItem>
          </Legend>
        </AdminCard>

        <AdminCard>
          <AdminCardHead
            title="Live alerts"
            sub="Events from soil, weather and battery sensors"
          />
          <div className="mt-3.5 flex flex-col gap-3">
            {ALERTS.map((a) => (
              <div key={a.title} className="flex items-start gap-2.5">
                <i
                  className={
                    a.tone === "amber"
                      ? "mt-1 size-[9px] shrink-0 rounded-full bg-[#b8860b] shadow-[0_0_0_4px_rgba(184,134,11,0.12)]"
                      : "mt-1 size-[9px] shrink-0 rounded-full bg-[#c44747] shadow-[0_0_0_4px_rgba(196,71,71,0.12)]"
                  }
                />
                <div>
                  <b className="block text-[13px]">{a.title}</b>
                  <small className="mt-0.5 block text-[11px] text-[#889189]">{a.meta}</small>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </section>

      <Toolbar>
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search sensors by ID or cluster"
        />
        <Button variant="ghost" className="max-560px:justify-center">
          All clusters ▾
        </Button>
        <Button className="max-560px:justify-center">+ Deploy sensor</Button>
      </Toolbar>

      <section className="grid-3">
        <AdminCard className="span-2">
          <AdminCardHead title="Sensor fleet" sub="Deployed soil, weather and water sensors" />
          <TableWrap className={TABLE_COLLAPSE}>
            <thead>
              <tr>
                <Th>Sensor</Th>
                <Th>Type</Th>
                <Th>Cluster</Th>
                <Th>Battery</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {SENSORS.map((s) => (
                <tr key={s.id}>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <InitialTile initials={s.tile} tone={s.tone} />
                      <span>
                        <b className="block text-[13px]">{s.id}</b>
                        <small className="mt-0.5 block text-[11px] text-[#889189]">
                          {s.deployed}
                        </small>
                      </span>
                    </div>
                  </Td>
                  <Td>{s.type}</Td>
                  <Td>{s.cluster}</Td>
                  <Td>{s.battery}</Td>
                  <Td>
                    <Tag kind={s.kind}>{s.status}</Tag>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </AdminCard>

        <AdminCard>
          <AdminCardHead
            title="Weather signal"
            sub="Next 5-day outlook for monitored clusters"
          />
          <div className="minis">
            {WEATHER.map((w) => (
              <Mini key={w.label} label={w.label} value={w.value} />
            ))}
          </div>
          <div className="my-3.5 h-[10px] overflow-hidden rounded-full bg-[#eee]">
            <i className="float-left h-full w-[28%] bg-[#0b5b3e]" />
            <i className="float-left h-full w-[36%] bg-[#3d6bff]" />
            <i className="float-left h-full w-[36%] bg-[#d5f17f]" />
          </div>
          <Legend>
            <LegendItem tone="green">Rain today</LegendItem>
            <LegendItem tone="amber">Rain Thu</LegendItem>
          </Legend>
        </AdminCard>
      </section>
    </DashboardShell>
  );
}
