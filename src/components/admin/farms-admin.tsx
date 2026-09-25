"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/dashboard/shell";
import { Button, InitialTile, Select, TableWrap, Td, Tag, Th } from "@/components/ui";
import {
  AdminCard,
  AdminCardHead,
  AdminKpiCard,
  AreaBars,
  EmptyRow,
  Legend,
  LegendItem,
  Mini,
  SearchBox,
  StatusCard,
  TABLE_COLLAPSE,
  Toolbar,
} from "@/components/admin/parts";
import { AssignModal, PlotModal } from "@/components/admin/farms-modals";
import { api } from "@/lib/api";
import { money, num } from "@/lib/format";

type FarmRow = {
  id: string;
  name: string;
  farmer: string;
  state: string | null;
};

type PlotRow = {
  id: string;
  name: string;
  crop: string | null;
  areaHa: number | null;
  soilMoisture: number | null;
  stressLevel: string | null;
  mapStatus: string;
  lat: number | null;
  lng: number | null;
  farmName: string;
  state: string | null;
  farmer: string | null;
};

type FareRate = { id: string; state: string; costPerMile: number };
type DcoRow = { id: string; fullName: string; state: string | null };

type AdminData = {
  farms: { total: number; rows: FarmRow[] };
  plots: PlotRow[];
  fares: FareRate[];
  dcos: DcoRow[];
};

const EMPTY_PLOT = "grid h-full place-items-center text-[12px] text-[#667068]";

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

export default function FarmsAdmin() {
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const [plotModalOpen, setPlotModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api<{ data: { total: number; rows: FarmRow[] } }>("/api/admin/farms?limit=200"),
      api<{ data: PlotRow[] }>("/api/admin/plots"),
      api<{ data: FareRate[] }>("/api/admin/fare-rates"),
      api<{ data: DcoRow[] }>("/api/admin/dcos"),
    ])
      .then(([farmRes, plotRes, fareRes, dcoRes]) => {
        if (cancelled) return;
        setData({
          farms: farmRes.data,
          plots: plotRes.data,
          fares: fareRes.data,
          dcos: dcoRes.data,
        });
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [reload]);

  const allPlots = useMemo(() => data?.plots ?? [], [data]);

  const plots = useMemo(() => {
    const q = search.toLowerCase();
    return allPlots.filter((p) => {
      if (q && !`${p.name} ${p.farmName} ${p.farmer || ""}`.toLowerCase().includes(q)) return false;
      if (cropFilter && p.crop !== cropFilter) return false;
      if (stateFilter && p.state !== stateFilter) return false;
      return true;
    });
  }, [allPlots, search, cropFilter, stateFilter]);

  const totalHa = allPlots.reduce((a, p) => a + (p.areaHa || 0), 0);
  const mapped = allPlots.filter((p) => p.mapStatus === "MAPPED").length;
  const cropNames = unique(allPlots.map((p) => p.crop).filter((c): c is string => Boolean(c)));
  const topCrops = cropNames.slice(0, 3).join(", ");
  const stateNames = unique(allPlots.map((p) => p.state).filter((s): s is string => Boolean(s)));

  const cropBars = useMemo(() => {
    const crops = unique(plots.map((p) => p.crop).filter((c): c is string => Boolean(c)));
    const areaOf = (crop: string) =>
      plots.filter((p) => p.crop === crop).reduce((a, p) => a + (p.areaHa || 0), 0);
    const maxArea = Math.max(0.1, ...crops.map(areaOf));
    return crops.map((crop) => ({
      label: crop,
      pct: Math.max(4, Math.round((areaOf(crop) / maxArea) * 100)),
      value: `${num(Math.round(areaOf(crop) * 10) / 10)} ha`,
    }));
  }, [plots]);

  const pins = useMemo(() => {
    const points = allPlots.filter((p) => p.lat != null && p.lng != null).slice(0, 8);
    if (!points.length) return [];
    const lats = points.map((p) => p.lat as number);
    const lngs = points.map((p) => p.lng as number);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const spanLat = Math.max(0.01, maxLat - minLat);
    const spanLng = Math.max(0.01, maxLng - minLng);
    return points.map((p) => ({
      id: p.id,
      name: p.name,
      x: Math.round((((p.lng as number) - minLng) / spanLng) * 88 + 6),
      y: Math.round(((maxLat - (p.lat as number)) / spanLat) * 78 + 8),
    }));
  }, [allPlots]);

  return (
    <DashboardShell title="Farms & Plots">
      {error ? (
        <StatusCard failed>Failed to load farms: {error}</StatusCard>
      ) : null}
      {!data && !error ? <StatusCard>Loading farms & plots…</StatusCard> : null}

      {data ? (
        <>
          <section className="kpis">
            <AdminKpiCard label="Active farms" value={num(data.farms.total)} delta="registered farms" />
            <AdminKpiCard
              label="Total hectares"
              value={num(Math.round(totalHa * 10) / 10)}
              delta={`${num(allPlots.length)} plots`}
            />
            <AdminKpiCard
              label="Crops monitored"
              value={num(cropNames.length)}
              delta={topCrops || "—"}
            />
            <AdminKpiCard
              label="Plots mapped"
              value={num(mapped)}
              delta={`${num(allPlots.length - mapped)} pending GPS`}
              tone="amber"
            />
          </section>

          <Toolbar>
            <SearchBox
              value={search}
              onChange={setSearch}
              placeholder="Search farms by name, farmer or location"
            />
            <Select value={cropFilter} onChange={(e) => setCropFilter(e.target.value)}>
              <option value="">All crops</option>
              {cropNames.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
            <Select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
              <option value="">All states</option>
              {stateNames.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
            <Button
              variant="ghost"
              className="max-560px:justify-center"
              onClick={() => setAssignModalOpen(true)}
            >
              Assign to DCO
            </Button>
            <Button
              className="max-560px:justify-center"
              onClick={() => setPlotModalOpen(true)}
            >
              + Register plot
            </Button>
          </Toolbar>
        </>
      ) : null}

      <section className="grid-3">
        <AdminCard className="span-2">
          <AdminCardHead title="Farm & plot network" sub={data ? `${num(plots.length)} plots` : ""} />
          <TableWrap className={TABLE_COLLAPSE}>
            <thead>
              <tr>
                <Th>Field</Th>
                <Th>Crop</Th>
                <Th>Area</Th>
                <Th>Location</Th>
                <Th>Moisture</Th>
                <Th>Map</Th>
              </tr>
            </thead>
            <tbody>
              {plots.length ? (
                plots.map((p) => (
                  <tr key={p.id}>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <InitialTile initials={(p.farmer || "F").charAt(0)} />
                        <span>
                          <b className="block text-[13px]">{p.name}</b>
                          <small className="mt-0.5 block text-[11px] text-[#889189]">
                            {p.farmName} · {p.farmer || ""}
                          </small>
                        </span>
                      </div>
                    </Td>
                    <Td>{p.crop || "—"}</Td>
                    <Td>{p.areaHa ? `${p.areaHa} ha` : "—"}</Td>
                    <Td>{p.state || "—"}</Td>
                    <Td>
                      <Tag
                        kind={
                          p.stressLevel === "High" ? "red" : p.stressLevel === "Watch" ? "amber" : "green"
                        }
                      >
                        {p.soilMoisture != null ? `${p.soilMoisture}%` : "—"}
                      </Tag>
                    </Td>
                    <Td>
                      <Tag kind={p.mapStatus === "MAPPED" ? "green" : "amber"}>
                        {p.mapStatus === "MAPPED" ? "Mapped" : "Pending"}
                      </Tag>
                    </Td>
                  </tr>
                ))
              ) : data ? (
                <EmptyRow colSpan={6} pad={30} gray>
                  No plots match your filters
                </EmptyRow>
              ) : null}
            </tbody>
          </TableWrap>
        </AdminCard>

        <AdminCard>
          <b>Plot GPS mapping</b>
          <Mini label="Mapped" value={data ? num(mapped) : ""} />
          <Mini label="Pending" value={data ? num(allPlots.length - mapped) : ""} />
          <Mini label="Area under watch" value={data ? `${num(Math.round(totalHa * 10) / 10)} ha` : ""} />
          <div className="plot-stripes relative mt-2.5 h-[170px] rounded-xl bg-[#dbe7d5]">
            {pins.length ? (
              pins.map((pin) => (
                <span
                  key={pin.id}
                  title={`${pin.name}»`}
                  className="absolute size-2.5 rounded-full border-2 border-white bg-green shadow-[0_1px_4px_rgba(0,0,0,0.25)]"
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                />
              ))
            ) : data ? (
              <span className={EMPTY_PLOT}>No GPS coordinates yet</span>
            ) : (
              <span className={EMPTY_PLOT}>Map preview</span>
            )}
          </div>
          <Legend>
            <LegendItem tone="green">Mapped</LegendItem>
            <LegendItem tone="amber">Pending</LegendItem>
          </Legend>
        </AdminCard>
      </section>

      {data ? (
        <>
          <section className="grid-2">
            <AdminCard>
              <AdminCardHead title="Area by crop" sub="Hectares under monitoring per crop" />
              <AreaBars items={cropBars} />
            </AdminCard>
            <AdminCard>
              <AdminCardHead title="Fare rates" sub="Transport cost per mile by state (admin)" />
              <TableWrap className={TABLE_COLLAPSE}>
                <thead>
                  <tr>
                    <Th>State</Th>
                    <Th>₦ / mile</Th>
                  </tr>
                </thead>
                <tbody>
                  {data.fares.length ? (
                    data.fares.map((f) => (
                      <tr key={f.id}>
                        <Td>
                          <b className="text-[13px]">{f.state}</b>
                        </Td>
                        <Td>{money(f.costPerMile)}</Td>
                      </tr>
                    ))
                  ) : (
                    <EmptyRow colSpan={2} pad={20} gray>
                      No fare rates set
                    </EmptyRow>
                  )}
                </tbody>
              </TableWrap>
            </AdminCard>
          </section>

          {plotModalOpen ? (
            <PlotModal
              farms={data.farms.rows}
              onClose={() => setPlotModalOpen(false)}
              onRegistered={() => setReload((r) => r + 1)}
            />
          ) : null}
          {assignModalOpen ? (
            <AssignModal
              farms={data.farms.rows}
              dcos={data.dcos}
              onClose={() => setAssignModalOpen(false)}
            />
          ) : null}
        </>
      ) : null}
    </DashboardShell>
  );
}
