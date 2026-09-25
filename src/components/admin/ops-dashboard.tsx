"use client";

import { useEffect, useState, type CSSProperties } from "react";
import DashboardShell from "@/components/dashboard/shell";
import { InitialTile, List, TableWrap, Td, Th, Tag } from "@/components/ui";
import {
  AdminCard,
  AdminCardHead,
  AdminKpiCard,
  AreaBars,
  EmptyRow,
  Legend,
  LegendItem,
  Mini,
  StatusCard,
  TABLE_COLLAPSE,
} from "@/components/admin/parts";
import { api } from "@/lib/api";
import { num, tagKind } from "@/lib/format";

type Summary = {
  kpis: {
    farmers: number;
    fieldsMonitored: number;
    sensors: number;
    sensorsOnline: number;
    avgAgriScore: number;
    openAdvisories: number;
    monthFarmers: number;
    farmVisitRequests: number;
    orgs: number;
    dcos: number;
  };
  gpsPlotCount: number;
  creditCount: number;
  weeklySignups: { day: string; count: number }[];
  healthMix: { healthy: number; watch: number; critical: number };
  crops: { crop: string; plots: number; areaHa: number }[];
  recentFarms: {
    id: string;
    name: string;
    farmer: string;
    farmerPhone: string | null;
    state: string | null;
    areaHa: number;
    agriScore: number | null;
    moisture: number | null;
    stress: string | null;
    status: string;
  }[];
  recentAdvisories: {
    id: string;
    title: string;
    type: string;
    priority: string;
    createdAt: string;
    farmer: string | null;
  }[];
};

const BAR_CHART =
  "mt-2.5 flex h-[260px] items-stretch justify-between gap-3 overflow-visible border-b border-[#e7ebe5] px-1 pt-2 max-560px:h-[230px] max-560px:gap-1.5";

export default function OpsDashboard() {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<{ data: Summary }>("/api/admin/summary")
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const k = data?.kpis;
  const healthMix = data?.healthMix;

  const signups = data?.weeklySignups ?? [];
  const maxSignup = Math.max(1, ...signups.map((d) => d.count));
  const signupBars = signups.map((d) => ({
    label: new Date(d.day).toLocaleDateString("en", { weekday: "short" }),
    pct: Math.max(6, Math.round((d.count / maxSignup) * 100)),
    count: d.count,
  }));

  const crops = data?.crops ?? [];
  const maxArea = Math.max(0.1, ...crops.map((c) => c.areaHa));
  const cropBars = crops.map((c) => ({
    label: c.crop,
    pct: Math.max(4, Math.round((c.areaHa / maxArea) * 100)),
    value: `${num(c.areaHa)} ha`,
  }));

  return (
    <DashboardShell
      title="Operations dashboard"
      advisoryCount={data ? data.recentAdvisories.length : undefined}
    >
      {error ? (
        <StatusCard failed>Failed to load dashboard: {error}</StatusCard>
      ) : null}
      {!data && !error ? <StatusCard>Loading platform data…</StatusCard> : null}

      {data && k ? (
        <>
          <section className="kpis">
            <AdminKpiCard
              label="Farmers onboarded"
              value={num(k.farmers)}
              delta={`▲ ${num(k.monthFarmers)} this month`}
            />
            <AdminKpiCard
              label="Fields monitored"
              value={num(k.fieldsMonitored)}
              delta={`${num(k.sensorsOnline)}/${num(k.sensors)} sensors online`}
            />
            <AdminKpiCard label="Avg AgriScore" value={num(k.avgAgriScore)} delta="across verified profiles" />
            <AdminKpiCard
              label="Open advisories"
              value={String(k.openAdvisories).padStart(2, "0")}
              delta={`${num(k.farmVisitRequests)} visit requests pending`}
            />
            <AdminKpiCard label="DCOs active" value={num(k.dcos)} delta={`${num(k.orgs)} organizations`} />
          </section>

          <section className="grid-2">
            <AdminCard>
              <AdminCardHead
                title="New farmer signups"
                sub="Daily registrations over the last 7 days"
              />
              <div className={BAR_CHART}>
                {signupBars.map((bar) => (
                  <div
                    key={bar.label}
                    title={`${bar.label}: ${bar.count} signups`}
                    className="relative flex h-full max-w-14 flex-1 flex-col items-center gap-2"
                  >
                    <div className="relative flex min-h-[180px] w-full flex-1 items-end justify-center max-560px:min-h-[150px]">
                      <div
                        className="relative min-h-[10px] w-7 rounded-t-[8px] bg-[#e8ece7] max-560px:w-[18px]"
                        style={{ height: `${bar.pct}%` }}
                      />
                    </div>
                    <span className="flex-none pb-2 text-[10px] font-semibold tracking-[0.02em] text-[#889189]">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </AdminCard>

            <AdminCard>
              <AdminCardHead
                title="Field health mix"
                sub="Health classification across monitored plots"
              />
              {healthMix ? (
                <>
                  <div
                    className="donut relative mx-auto my-4 grid size-[168px] place-items-center rounded-full"
                    style={
                      {
                        "--a": String(healthMix.healthy),
                        "--b": String(healthMix.watch),
                        "--c": String(healthMix.critical),
                      } as CSSProperties
                    }
                  />
                  <Legend>
                    <LegendItem tone="green">Healthy {healthMix.healthy}%</LegendItem>
                    <LegendItem tone="amber">Watch {healthMix.watch}%</LegendItem>
                    <LegendItem tone="red">Critical {healthMix.critical}%</LegendItem>
                  </Legend>
                </>
              ) : null}
            </AdminCard>
          </section>

          <section className="grid-3">
            <AdminCard className="span-2">
              <AdminCardHead
                title="Farm & plot network"
                sub="Recent farms with live moisture and credit band"
              />
              <TableWrap className={TABLE_COLLAPSE}>
                <thead>
                  <tr>
                    <Th>Farm</Th>
                    <Th>Farmer</Th>
                    <Th>Moisture</Th>
                    <Th>Stress</Th>
                    <Th>AgriScore</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentFarms.length ? (
                    data.recentFarms.map((f) => (
                      <tr key={f.id}>
                        <Td>
                          <div className="flex items-center gap-2.5">
                            <InitialTile initials={(f.farmer || "F").charAt(0)} />
                            <span>
                              <b className="block text-[13px]">{f.name}</b>
                              <small className="mt-0.5 block text-[11px] text-[#889189]">
                                {f.state || "—"} · {num(f.areaHa)} ha
                              </small>
                            </span>
                          </div>
                        </Td>
                        <Td>
                          <b className="text-[13px]">{f.farmer}</b>
                          <small className="text-[11px] text-[#889189]">{f.farmerPhone || ""}</small>
                        </Td>
                        <Td>{f.moisture !== null && f.moisture !== undefined ? `${f.moisture}%` : "—"}</Td>
                        <Td>
                          <Tag kind={f.stress === "High" ? "red" : f.stress === "Watch" ? "amber" : "green"}>
                            {f.stress || "Low"}
                          </Tag>
                        </Td>
                        <Td>
                          {f.agriScore !== null && f.agriScore !== undefined ? (
                            <Tag kind={tagKind(f.agriScore >= 650 ? "HEALTHY" : "WATCHLIST")}>
                              {num(f.agriScore)}
                            </Tag>
                          ) : (
                            <Tag kind="gray">—</Tag>
                          )}
                        </Td>
                        <Td>
                          <Tag kind={f.status === "MAPPED" ? "green" : "amber"}>
                            {f.status === "MAPPED" ? "Mapped" : "Pending"}
                          </Tag>
                        </Td>
                      </tr>
                    ))
                  ) : (
                    <EmptyRow colSpan={6} pad={24}>
                      No farms registered yet
                    </EmptyRow>
                  )}
                </tbody>
              </TableWrap>
            </AdminCard>

            <AdminCard>
              <b>Network snapshot</b>
              <Mini label="Online sensors" value={`${k.sensorsOnline}/${k.sensors}`} />
              <Mini label="Mapped plots" value={num(data.gpsPlotCount)} />
              <Mini label="Credit-ready farmers" value={num(data.creditCount)} />
              <Mini label="Pending visit requests" value={num(k.farmVisitRequests)} />
              <div className="rings">
                <div className="absolute text-center text-[11px] text-[#5c665f]">
                  <strong className="block text-[18px] tracking-[-0.04em] text-ink">
                    {num(k.avgAgriScore)}
                  </strong>
                  AgriScore
                </div>
              </div>
            </AdminCard>
          </section>

          <section className="grid-2">
            <AdminCard>
              <AdminCardHead title="AI advisories" sub="Latest advisories pushed to farmers" />
              <List>
                {data.recentAdvisories.length ? (
                  data.recentAdvisories.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between py-2.5 text-[13px]"
                    >
                      <span>
                        <b>{a.title}</b>
                        {" "}
                        <small>
                          {a.type}
                          {a.farmer ? ` · ${a.farmer}` : ""} ·{" "}
                          {new Date(a.createdAt).toLocaleDateString("en-GB")}
                        </small>
                      </span>
                      <Tag kind={tagKind(a.priority)}>{a.priority}</Tag>
                    </div>
                  ))
                ) : (
                  <div className="py-2.5 text-[13px]">
                    <span>No advisories yet</span>
                  </div>
                )}
              </List>
            </AdminCard>

            <AdminCard>
              <AdminCardHead title="Season outlook" sub="Crops under monitoring by area" />
              <AreaBars items={cropBars} />
            </AdminCard>
          </section>
        </>
      ) : null}
    </DashboardShell>
  );
}
