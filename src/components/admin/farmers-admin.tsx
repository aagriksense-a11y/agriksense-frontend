"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/shell";
import { Button, ClickableRow, InitialTile, Select, TableWrap, Td, Tag, Th } from "@/components/ui";
import {
  AdminCard,
  AdminCardHead,
  AdminKpiCard,
  EmptyRow,
  Mini,
  SearchBox,
  StatusCard,
  TABLE_COLLAPSE,
  Toolbar,
} from "@/components/admin/parts";
import FarmerDrawer, { initialsOf, type FarmerDetail } from "@/components/admin/farmer-drawer";
import FarmerCreateModal from "@/components/admin/farmer-create-modal";
import { api } from "@/lib/api";
import { num, tagKind } from "@/lib/format";

type Summary = {
  farmerCount: number;
  verifiedCount: number;
  gpsPlotCount: number;
  creditCount: number;
  funnel: { registered: number; verified: number; gpsPlotted: number; creditReady: number };
};

type FarmerRow = {
  id: string;
  platformId: string | null;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string | null;
  state: string | null;
  lga: string | null;
  ninStatus: string;
  agriScore: number | null;
  plots: number;
  areaHa: number;
  verifiedMemberships: number;
  totalMemberships: number;
};

type FarmerList = { total: number; page: number; limit: number; rows: FarmerRow[] };

export default function FarmersAdmin() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [states, setStates] = useState<string[]>([]);
  const [list, setList] = useState<FarmerList | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);

  const [detail, setDetail] = useState<FarmerDetail | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api<{ data: Summary }>("/api/admin/summary")
      .then((res) => {
        if (cancelled) return;
        setSummary(res.data);
        return api<{ data: FarmerList }>("/api/admin/farmers?limit=200")
          .then((statesRes) => {
            if (cancelled) return;
            const seen = new Set(
              statesRes.data.rows.map((f) => f.state).filter((s): s is string => Boolean(s)),
            );
            setStates([...seen].sort());
          })
          .catch(() => {});
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!summary) return;
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search, summary]);

  useEffect(() => {
    if (!summary) return;
    let cancelled = false;
    const params = `q=${encodeURIComponent(debounced)}&state=${encodeURIComponent(
      stateFilter,
    )}&status=${encodeURIComponent(statusFilter)}&page=${page}`;
    api<{ data: FarmerList }>(`/api/admin/farmers?${params}`)
      .then((res) => {
        if (!cancelled) setList(res.data);
      })
      .catch(() => {
        /* the legacy follow-up fetches leave the previous table on screen */
      });
    return () => {
      cancelled = true;
    };
  }, [summary, debounced, stateFilter, statusFilter, page, reload]);

  async function openFarmer(id: string) {
    try {
      const res = await api<{ data: FarmerDetail }>(`/api/admin/farmers/${id}`);
      setDetail(res.data);
      setDrawerOpen(true);
    } catch (err) {
      window.alert((err as Error).message);
    }
  }

  const funnel = summary?.funnel;
  const pages = list ? Math.max(1, Math.ceil(list.total / list.limit)) : 1;

  return (
    <DashboardShell title="Farmers">
      {error ? (
        <StatusCard failed>Failed to load farmers: {error}</StatusCard>
      ) : null}
      {!summary && !error ? <StatusCard>Loading farmers…</StatusCard> : null}

      {summary ? (
        <>
          <section className="kpis">
            <AdminKpiCard
              label="Total farmers"
              value={num(summary.farmerCount)}
              delta={`${num(funnel?.registered)} registered`}
            />
            <AdminKpiCard label="Verified profiles" value={num(summary.verifiedCount)} delta="NIN verified" />
            <AdminKpiCard
              label="GPS plotted"
              value={num(summary.gpsPlotCount)}
              delta="mapped plots"
            />
            <AdminKpiCard
              label="Credit-ready"
              value={num(summary.creditCount)}
              delta={`${num(funnel?.verified)} awaiting docs`}
              tone="amber"
            />
          </section>

          <Toolbar>
            <SearchBox
              value={search}
              onChange={setSearch}
              placeholder="Search farmers by name, phone, or platform ID"
            />
            <Select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
              <option value="">All states</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending</option>
            </Select>
            <Button
              className="max-560px:justify-center"
              onClick={() => setModalOpen(true)}
            >
              + Onboard farmer
            </Button>
          </Toolbar>

          <section className="grid-3">
            <AdminCard className="span-2">
              <AdminCardHead title="Farmer registry" sub={list ? `${num(list.total)} farmers` : ""} />
              <TableWrap className={TABLE_COLLAPSE}>
                <thead>
                  <tr>
                    <Th>Farmer</Th>
                    <Th>Location</Th>
                    <Th>Plots</Th>
                    <Th>AgriScore</Th>
                    <Th>Memberships</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {list && list.rows.length ? (
                    list.rows.map((f) => (
                      <ClickableRow key={f.id} onOpen={() => openFarmer(f.id)}>
                        <Td>
                          <div className="flex items-center gap-2.5">
                            <InitialTile initials={initialsOf(f)} />
                            <span>
                              <b className="block text-[13px]">{f.fullName}</b>
                              <small className="mt-0.5 block text-[11px] text-[#889189]">
                                {f.phoneNumber || ""} · ID {f.platformId}
                              </small>
                            </span>
                          </div>
                        </Td>
                        <Td>
                          {f.state || "—"}
                          {f.lga ? ` · ${f.lga}` : ""}
                        </Td>
                        <Td>
                          {num(f.plots)} plots · {f.areaHa} ha
                        </Td>
                        <Td>
                          {f.agriScore ? (
                            <Tag kind={tagKind(f.agriScore >= 650 ? "HEALTHY" : "WATCHLIST")}>
                              {num(f.agriScore)}
                            </Tag>
                          ) : (
                            <Tag kind="gray">—</Tag>
                          )}
                        </Td>
                        <Td>
                          {f.totalMemberships ? (
                            <Tag kind={f.verifiedMemberships === f.totalMemberships ? "green" : "amber"}>
                              {f.verifiedMemberships}/{f.totalMemberships}
                            </Tag>
                          ) : (
                            <Tag kind="gray">0</Tag>
                          )}
                        </Td>
                        <Td>
                          <Tag kind={tagKind(f.ninStatus)}>{f.ninStatus}</Tag>
                        </Td>
                      </ClickableRow>
                    ))
                  ) : list ? (
                    <EmptyRow colSpan={6} pad={30} gray>
                      No farmers match your search
                    </EmptyRow>
                  ) : null}
                </tbody>
              </TableWrap>
              {list ? (
                <div className="mt-3.5 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    className="max-560px:justify-center"
                    disabled={page <= 1}
                    onClick={() => setPage(Math.max(1, page - 1))}
                  >
                    ← Previous
                  </Button>
                  <span className="self-center text-[12px] text-[#5c665f]">
                    Page {page} of {pages}
                  </span>
                  <Button
                    variant="ghost"
                    className="max-560px:justify-center"
                    disabled={page >= pages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next →
                  </Button>
                </div>
              ) : null}
            </AdminCard>

            <AdminCard>
              <b>Onboarding funnel</b>
              {/* The legacy widths divide by funnel.gpsPlotCount / funnel.creditCount,
                  fields the summary endpoint never returns, so the stylesheet
                  defaults (28% / 36% / 36%) are what actually renders. */}
              <div className="my-3.5 h-2.5 overflow-hidden rounded-full bg-[#eee]">
                <i className="float-left block h-full w-[28%] bg-green" />
                <i className="float-left block h-full w-[36%] bg-[#3d6bff]" />
                <i className="float-left block h-full w-[36%] bg-lime" />
              </div>
              <Mini label="Registered" value={num(funnel?.registered)} />
              <Mini label="NIN verified" value={num(funnel?.verified)} />
              <Mini label="GPS plotted" value={num(funnel?.gpsPlotted)} />
              <Mini label="Credit-ready" value={num(funnel?.creditReady)} />
            </AdminCard>
          </section>
        </>
      ) : null}

      <FarmerDrawer open={drawerOpen} detail={detail} onClose={() => setDrawerOpen(false)} />
      {modalOpen ? (
        <FarmerCreateModal
          onClose={() => setModalOpen(false)}
          onCreated={() => setReload((r) => r + 1)}
        />
      ) : null}
    </DashboardShell>
  );
}
