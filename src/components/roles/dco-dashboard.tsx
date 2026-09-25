"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import DashboardShell from "@/components/dashboard/shell";
import {
  Button,
  Card,
  CardHead,
  FormError,
  IconButton,
  KpiCard,
  List,
  Modal,
  TableWrap,
  Td,
  Th,
  Tag,
  inputClass,
} from "@/components/ui";
import {
  AdminCardHead,
  FormActions,
  FormGroup,
  Mini,
  StatusCard,
  TABLE_COLLAPSE,
} from "@/components/admin/parts";
import { ListI, PlatformIdBanner } from "@/components/roles/parts";
import { api } from "@/lib/api";
import { money, num, tagKind } from "@/lib/format";

/* Payload of GET /api/dashboards/dco — mirrors dcoDashboard() in server/src/routes/dashboard.js. */
type DcoDashboardData = {
  platformId: string;
  onboardingStep: string;
  profile: {
    firstName: string;
    lastName: string;
    otherName: string | null;
    email: string | null;
    phoneNumber: string | null;
    state: string | null;
    lga: string | null;
    cityTown: string | null;
    address: string | null;
    nin: string | null;
    ninStatus: string | null;
  };
  fareRate: { state: string; costPerMile: number } | null;
  visitRequests: {
    id: string;
    status: string;
    farmCount: number;
    estimatedCost: number;
    notes: string | null;
    createdAt: string;
    farms: {
      id: string;
      farmName: string;
      address: string | null;
      state: string | null;
      transportCost: number;
      distanceKm: number;
    }[];
  }[];
  assignments: {
    id: string;
    status: string;
    assignedAt: string;
    visitedAt: string | null;
    farm: {
      id: string;
      name: string;
      state: string | null;
      lga: string | null;
      cityTown: string | null;
      address: string | null;
      farmer: string;
      farmerPhone: string | null;
      plots: { name: string; crop: string | null; areaHa: number | null }[];
    };
  }[];
};

/* One `.vfarm` line in the visit-request modal (legacy farmRowHtml()). */
type VisitFarmRow = { farmName: string; address: string; distanceKm: string };
const emptyFarmRow = (): VisitFarmRow => ({ farmName: "", address: "", distanceKm: "" });

const VFARM_INPUT =
  "min-w-[120px] flex-1 rounded-[10px] border border-[#e5e9e5] px-3 py-[9px] font-[inherit] text-[13px] text-ink outline-none focus:border-[#9fc18f]";

export default function DcoDashboard() {
  const [data, setData] = useState<DcoDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [knownMode, setKnownMode] = useState<"yes" | "no">("yes");
  const [farmRows, setFarmRows] = useState<VisitFarmRow[]>([emptyFarmRow()]);
  const [notes, setNotes] = useState("");
  const [visitError, setVisitError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api<{ data: DcoDashboardData }>("/api/dashboards/dco")
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  function openVisitModal() {
    setFarmRows([emptyFarmRow()]); // legacy buildFarmRows(1)
    setKnownMode("yes");
    setNotes("");
    setVisitError("");
    setModalOpen(true);
  }

  async function submitVisit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const knownFarms: { farmName: string; address: string; distanceKm: number }[] = [];
    if (knownMode === "yes") {
      for (const r of farmRows) {
        if (!r.farmName) continue;
        knownFarms.push({
          farmName: r.farmName,
          address: r.address || "",
          distanceKm: Number(r.distanceKm) || 0,
        });
      }
    }
    setVisitError("");
    try {
      await api("/api/dashboards/dco/visit-requests", {
        method: "POST",
        body: { knownFarms, notes },
      });
      setModalOpen(false);
      reload();
    } catch (err) {
      setVisitError((err as Error).message);
    }
  }

  const pendingReviews = data
    ? data.visitRequests.filter((r) => r.status === "REQUESTED").length
    : 0;
  const toVisit = data
    ? data.assignments.filter((a) => a.status === "ASSIGNED").length
    : 0;
  const completedVisits = data
    ? data.assignments.filter((a) => a.status === "COMPLETED" || a.status === "VISITED")
        .length
    : 0;

  return (
    <DashboardShell title="Data Collection Officer">
      {error ? (
        <StatusCard failed>Failed to load dashboard: {error}</StatusCard>
      ) : null}
      {!data && !error ? <StatusCard>Loading your dashboard…</StatusCard> : null}

      {data ? (
        <>
          <section className="kpis">
            <KpiCard
              label="Visit requests"
              value={num(data.visitRequests.length)}
              delta={`${num(pendingReviews)} pending review`}
            />
            <KpiCard
              label="Assigned farms"
              value={num(data.assignments.length)}
              delta={`${num(toVisit)} to visit`}
            />
            <KpiCard
              label="Completed visits"
              value={num(completedVisits)}
              delta="completed"
            />
            <KpiCard
              label="Home base"
              value={data.profile.cityTown || "—"}
              delta={data.profile.state || ""}
            />
          </section>

          <section className="grid-2">
            <Card>
              <CardHead
                title="My Agriksense ID"
                sub="Your unique platform identity"
                right={
                  <Button variant="ghost" onClick={openVisitModal}>
                    + Request farm visit
                  </Button>
                }
              />
              <PlatformIdBanner id={data.platformId} />
              <Mini
                label="Onboarding"
                value={data.onboardingStep === "PHASE_2_COMPLETED" ? "Completed" : "In progress"}
              />
              <Mini
                label="Available fare rate (your state)"
                value={
                  data.fareRate ? `${money(data.fareRate.costPerMile)} / mile` : "No fare set for your state"
                }
              />
            </Card>

            <Card>
              <CardHead
                title="My visit requests"
                sub="Farm visit requests sent to admin"
              />
              <List>
                {data.visitRequests.length ? (
                  data.visitRequests.slice(0, 6).map((r) => (
                    <ListI key={r.id}>
                      <span>
                        <b>
                          {num(r.farmCount)} farms · {money(r.estimatedCost)}
                        </b>
                        <small>{new Date(r.createdAt).toLocaleDateString("en-GB")}</small>
                      </span>
                      <Tag kind={tagKind(r.status)}>{r.status}</Tag>
                    </ListI>
                  ))
                ) : (
                  <ListI>
                    <span>No visit requests yet</span>
                  </ListI>
                )}
              </List>
            </Card>
          </section>

          <Card>
            <CardHead
              title="Assigned farms"
              sub="Farms assigned to you by the platform administrator"
            />
            <TableWrap className={TABLE_COLLAPSE}>
              <thead>
                <tr>
                  <Th>Farm</Th>
                  <Th>Farmer</Th>
                  <Th>Location</Th>
                  <Th>Plots</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {data.assignments.length ? (
                  data.assignments.map((a) => (
                    <tr key={a.id}>
                      <Td>
                        <b className="text-[13px]">{a.farm.name}</b>
                        <small className="text-[11px] text-[#889189]">{a.farm.address || ""}</small>
                      </Td>
                      <Td>
                        {a.farm.farmer}
                        <small className="text-[11px] text-[#889189]">
                          {a.farm.farmerPhone || ""}
                        </small>
                      </Td>
                      <Td>
                        {[a.farm.cityTown, a.farm.lga, a.farm.state].filter(Boolean).join(", ") ||
                          "—"}
                      </Td>
                      <Td>
                        {a.farm.plots
                          .map((p) => `${p.crop || "—"} ${p.areaHa ?? ""}ha`)
                          .join(", ") || "—"}
                      </Td>
                      <Td>
                        <Tag kind={tagKind(a.status)}>{a.status}</Tag>
                      </Td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <Td colSpan={5} className="p-[26px] text-center text-[#889189]">
                      No farms assigned yet
                    </Td>
                  </tr>
                )}
              </tbody>
            </TableWrap>
          </Card>

          {modalOpen ? (
            <Modal onClose={() => setModalOpen(false)}>
              <AdminCardHead
                title="Request farm visit"
                sub="Notify admin you're available to visit farms"
                right={
                  <IconButton label="Close" onClick={() => setModalOpen(false)}>
                    ✕
                  </IconButton>
                }
              />
              <form onSubmit={submitVisit} className="form-grid">
                <FormGroup full label="I know existing farms">
                  <select
                    name="knownMode"
                    className={inputClass}
                    value={knownMode}
                    onChange={(e) => setKnownMode(e.target.value as "yes" | "no")}
                  >
                    <option value="yes">Yes — I&apos;ll list the farms</option>
                    <option value="no">No — farms should be assigned to me</option>
                  </select>
                </FormGroup>
                {/* Legacy hides the block with display:none; unmounting keeps the
                    `required` farm-name inputs out of constraint validation. */}
                {knownMode === "yes" ? (
                  <FormGroup full label="Known farms">
                    {farmRows.map((row, i) => (
                      <div key={i} className="flex flex-wrap gap-2 py-1.5">
                        <input
                          name="farmName"
                          required
                          placeholder="Farm name"
                          className={VFARM_INPUT}
                          value={row.farmName}
                          onChange={(e) =>
                            setFarmRows((rs) =>
                              rs.map((r, j) => (j === i ? { ...r, farmName: e.target.value } : r)),
                            )
                          }
                        />
                        <input
                          name="location"
                          placeholder="Location / address"
                          className={VFARM_INPUT}
                          value={row.address}
                          onChange={(e) =>
                            setFarmRows((rs) =>
                              rs.map((r, j) => (j === i ? { ...r, address: e.target.value } : r)),
                            )
                          }
                        />
                        <input
                          name="distanceKm"
                          type="number"
                          min={0}
                          step={0.5}
                          placeholder="Distance (km)"
                          className={VFARM_INPUT}
                          value={row.distanceKm}
                          onChange={(e) =>
                            setFarmRows((rs) =>
                              rs.map((r, j) =>
                                j === i ? { ...r, distanceKm: e.target.value } : r,
                              ),
                            )
                          }
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      className="mt-2"
                      onClick={() => setFarmRows((rs) => [...rs, emptyFarmRow()])}
                    >
                      + Add farm
                    </Button>
                  </FormGroup>
                ) : null}
                <FormGroup full label="Note to admin">
                  <input
                    name="notes"
                    placeholder="e.g. Farms along the same corridor; can cover in one trip"
                    className={inputClass}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </FormGroup>
                <FormActions>
                  <Button type="submit">Submit request</Button>
                  <FormError>{visitError}</FormError>
                </FormActions>
              </form>
            </Modal>
          ) : null}
        </>
      ) : null}
    </DashboardShell>
  );
}
