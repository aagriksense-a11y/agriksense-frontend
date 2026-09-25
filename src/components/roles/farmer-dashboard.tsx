"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/shell";
import { Card, CardHead, KpiCard, List, Tag } from "@/components/ui";
import { Mini, StatusCard } from "@/components/admin/parts";
import { ListI, PlatformIdBanner, PlotChip, RProfile } from "@/components/roles/parts";
import { api } from "@/lib/api";
import { num, tagKind } from "@/lib/format";

/* Payload of GET /api/dashboards/farmer — mirrors farmerDashboard() in server/src/routes/dashboard.js. */
type FarmerDashboardData = {
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
    agriScore: number | null;
    creditReady: boolean;
    managerName: string | null;
    managerPhone: string | null;
  };
  memberships: {
    id: string;
    membershipId: string;
    isVerified: boolean;
    verifiedAt: string | null;
    orgName: string;
  }[];
  bankAccounts: {
    id: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
  }[];
  farms: {
    id: string;
    name: string;
    state: string | null;
    lga: string | null;
    cityTown: string | null;
    address: string | null;
    plots: {
      id: string;
      name: string;
      crop: string | null;
      areaHa: number | null;
      soilHealth: string | null;
      soilMoisture: number | null;
      stressLevel: string | null;
      status: string;
      mapStatus: string;
      sensors: {
        id: string;
        name: string;
        sensorType: string;
        status: string;
        battery: number | null;
        lastReading: { value: number; unit: string } | null;
      }[];
      advisories: {
        id: string;
        title: string;
        body: string;
        priority: string;
        sent: boolean;
        createdAt: string;
      }[];
    }[];
  }[];
  stats: {
    farms: number;
    plots: number;
    areaHa: number | null;
    sensors: number;
    sensorsOnline: number;
  };
};

export default function FarmerDashboard() {
  const [data, setData] = useState<FarmerDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<{ data: FarmerDashboardData }>("/api/dashboards/farmer")
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

  const st = data?.stats;
  const agriScore =
    data && data.profile.agriScore != null ? num(data.profile.agriScore) : "—";

  // Legacy: farms → plots → advisories, newest first, top 6.
  const advisories = data
    ? data.farms
        .flatMap((f) => f.plots.flatMap((p) => p.advisories))
        .sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 6)
    : [];

  return (
    <DashboardShell title="My Farm Dashboard">
      {error ? (
        <StatusCard failed>Failed to load dashboard: {error}</StatusCard>
      ) : null}
      {!data && !error ? <StatusCard>Loading your profile…</StatusCard> : null}

      {data && st ? (
        <>
          <section className="kpis">
            <KpiCard label="My farms" value={num(st.farms)} delta="registered" />
            <KpiCard
              label="Plots"
              value={num(st.plots)}
              delta={`${num(st.areaHa)} ha total`}
            />
            <KpiCard
              label="Sensors online"
              value={`${num(st.sensorsOnline)}/${num(st.sensors)}`}
              delta="field telemetry"
            />
            <KpiCard
              label="AgriScore"
              value={agriScore}
              delta={data.profile.creditReady ? "credit-ready ✅" : "building profile"}
            />
          </section>

          <section className="grid-2">
            <Card>
              <CardHead
                title="My Agriksense ID"
                sub="Your unique platform identity"
                right={
                  <Tag kind="green">
                    {data.profile.creditReady ? "Credit-ready" : "In credit review"}
                  </Tag>
                }
              />
              <PlatformIdBanner id={data.platformId} />
              <Mini
                label="Onboarding"
                value={data.onboardingStep === "PHASE_2_COMPLETED" ? "Completed" : "In progress"}
              />
            </Card>

            <Card>
              <CardHead
                title="Association memberships"
                sub="Membership IDs from your organizations"
              />
              <List>
                {data.memberships.length ? (
                  data.memberships.map((m) => (
                    <ListI key={m.id}>
                      <span>
                        <b>{m.orgName}</b>
                        <small>Membership ID {m.membershipId}</small>
                      </span>
                      <Tag kind={tagKind(m.isVerified ? "VERIFIED" : "PENDING")}>
                        {m.isVerified ? "Verified" : "Unverified"}
                      </Tag>
                    </ListI>
                  ))
                ) : (
                  <ListI>
                    <span>No association memberships yet</span>
                  </ListI>
                )}
              </List>
            </Card>
          </section>

          <section className="grid-3">
            <Card className="span-2">
              <CardHead
                title="My farms & plots"
                sub="Registered land, crops and live sensors"
              />
              <div className="roster py-2">
                {data.farms.length ? (
                  data.farms.map((f) => (
                    <RProfile
                      key={f.id}
                      name={f.name}
                      location={[f.cityTown, f.lga, f.state].filter(Boolean).join(", ") || "—"}
                      meta={f.plots.map((p, i) => (
                        <PlotChip key={p.id ?? i}>
                          {p.crop || "plot"} · {p.areaHa ?? "—"}ha
                        </PlotChip>
                      ))}
                    />
                  ))
                ) : (
                  <div className="py-3 text-[13px] text-[#889189]">
                    You haven&apos;t registered any farms yet — reach out to your DCO.
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <b>Season summary</b>
              <Mini label="Farms" value={num(st.farms)} />
              <Mini label="Plots" value={num(st.plots)} />
              <Mini label="Total area" value={`${num(st.areaHa)} ha`} />
              <Mini
                label="Sensors online"
                value={`${num(st.sensorsOnline)}/${num(st.sensors)}`}
              />
              <div className="rings">
                <div className="absolute text-center text-[11px] text-[#5c665f]">
                  <strong className="block text-[18px] tracking-[-0.04em] text-ink">
                    {agriScore}
                  </strong>
                  AgriScore
                </div>
              </div>
            </Card>
          </section>

          <Card>
            <CardHead
              title="My advisories"
              sub="Latest AI advisory sent to your plots"
            />
            <List>
              {advisories.length ? (
                advisories.map((a) => {
                  const body = a.body || "";
                  return (
                    <ListI key={a.id}>
                      <span>
                        <b>{a.title}</b>
                        <small>{body.slice(0, 90)}{body.length > 90 ? "…" : ""}</small>
                      </span>
                      <Tag kind={tagKind(a.priority)}>{a.priority}</Tag>
                    </ListI>
                  );
                })
              ) : (
                <ListI>
                  <span>No advisories yet</span>
                </ListI>
              )}
            </List>
          </Card>
        </>
      ) : null}
    </DashboardShell>
  );
}
