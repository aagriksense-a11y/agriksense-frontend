"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import DashboardShell from "@/components/dashboard/shell";
import {
  Button,
  Card,
  CardHead,
  FormError,
  IconButton,
  InitialTile,
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
import { num, tagKind } from "@/lib/format";

/* Payload of GET /api/dashboards/organization — mirrors orgDashboard() in server/src/routes/dashboard.js. */
type OrgDashboardData = {
  platformId: string;
  onboardingStep: string;
  org: {
    orgName: string;
    headquartersAddress: string | null;
    cityTown: string | null;
    lga: string | null;
    state: string | null;
    isRegistered: boolean;
    cacNumber: string | null;
    cacStatus: string;
    email: string | null;
    phoneNumber: string | null;
  };
  directors: {
    id: string;
    fullName: string;
    phoneNumber: string;
    email?: string | null;
  }[];
  bankAccounts: {
    id: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
  }[];
  members: {
    id: string;
    membershipId: string;
    isVerified: boolean;
    verifiedAt: string | null;
    createdAt: string;
    farmer: {
      id: string | null;
      platformId: string | null;
      name: string;
      phoneNumber: string | null;
      state: string | null;
      lga: string | null;
    };
  }[];
};

export default function OrgDashboard() {
  const [data, setData] = useState<OrgDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [memberError, setMemberError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api<{ data: OrgDashboardData }>("/api/dashboards/organization")
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

  async function submitMember(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    setMemberError("");
    try {
      await api("/api/dashboards/organization/members", { method: "POST", body: payload });
      setModalOpen(false);
      form.reset();
      reload();
    } catch (err) {
      setMemberError((err as Error).message);
    }
  }

  const members = data?.members ?? [];
  const verifiedCount = members.filter((m) => m.isVerified).length;

  return (
    <DashboardShell title="Organization Dashboard">
      {error ? (
        <StatusCard failed>Failed to load organization: {error}</StatusCard>
      ) : null}
      {!data && !error ? <StatusCard>Loading your organization…</StatusCard> : null}

      {data ? (
        <>
          <section className="kpis">
            <KpiCard
              label="Members"
              value={num(members.length)}
              delta={`${num(verifiedCount)} verified`}
            />
            <KpiCard
              label="Directors"
              value={num(data.directors.length)}
              delta="on file"
            />
            <KpiCard
              label="Registration"
              value={data.org.isRegistered ? "Yes" : "No"}
              delta={
                data.org.isRegistered ? `CAC ${data.org.cacNumber || ""}` : "not registered"
              }
            />
            <KpiCard
              label="HQ"
              value={data.org.state || "—"}
              delta={data.org.lga || ""}
            />
          </section>

          <section className="grid-2">
            <Card>
              <CardHead
                title="My Agriksense ID"
                sub="Your unique platform identity"
                right={<Tag kind={tagKind(data.org.cacStatus)}>{data.org.cacStatus}</Tag>}
              />
              <PlatformIdBanner id={data.platformId} />
              <Mini label="Organization" value={data.org.orgName} />
              <Mini label="CAC number" value={data.org.cacNumber || "—"} />
              <Mini
                label="Headquarters"
                value={
                  [
                    data.org.headquartersAddress,
                    data.org.cityTown,
                    data.org.lga,
                    data.org.state,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—"
                }
              />
            </Card>

            <Card>
              <CardHead
                title="Directors / contact persons"
                sub="Registered directors on the admin portal"
              />
              <List>
                {data.directors.length ? (
                  data.directors.map((d) => (
                    <ListI key={d.id}>
                      <span>
                        <b>{d.fullName}</b>
                        <small>
                          {d.phoneNumber}
                          {d.email ? ` · ${d.email}` : ""}
                        </small>
                      </span>
                    </ListI>
                  ))
                ) : (
                  <ListI>
                    <span>No directors on file</span>
                  </ListI>
                )}
              </List>
            </Card>
          </section>

          <section className="grid-3">
            <Card className="span-2">
              <CardHead
                title="My members"
                sub="Farmers linked to this organization"
                right={
                  <Button onClick={() => setModalOpen(true)}>+ Add member</Button>
                }
              />
              <TableWrap className={TABLE_COLLAPSE}>
                <thead>
                  <tr>
                    <Th>Member</Th>
                    <Th>Location</Th>
                    <Th>Membership ID</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {members.length ? (
                    members.map((m) => (
                      <tr key={m.id}>
                        <Td>
                          <div className="flex items-center gap-2.5">
                            <InitialTile initials={(m.farmer.name || "M").charAt(0)} />
                            <span>
                              <b className="block text-[13px]">{m.farmer.name}</b>
                              <small className="mt-0.5 block text-[11px] text-[#889189]">
                                {m.farmer.phoneNumber || ""}
                              </small>
                            </span>
                          </div>
                        </Td>
                        {/* Legacy also lists farmer.cityTown, but the API never sends it. */}
                        <Td>
                          {[m.farmer.lga, m.farmer.state].filter(Boolean).join(", ") || "—"}
                        </Td>
                        <Td>
                          <b className="text-[13px]">{m.membershipId}</b>
                        </Td>
                        <Td>
                          <Tag kind={tagKind(m.isVerified ? "VERIFIED" : "PENDING")}>
                            {m.isVerified ? "Verified" : "Unverified"}
                          </Tag>
                        </Td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <Td colSpan={4} className="p-[26px] text-center text-[#889189]">
                        No members yet — add your first member
                      </Td>
                    </tr>
                  )}
                </tbody>
              </TableWrap>
            </Card>

            <Card>
              <b>Membership summary</b>
              <Mini label="Total members" value={num(members.length)} />
              <Mini label="Verified memberships" value={num(verifiedCount)} />
              <Mini label="Pending verification" value={num(members.length - verifiedCount)} />
            </Card>
          </section>

          {modalOpen ? (
            <Modal onClose={() => setModalOpen(false)}>
              <AdminCardHead
                title="Add organization member"
                sub="Create a farmer & link to this organization"
                right={
                  <IconButton label="Close" onClick={() => setModalOpen(false)}>
                    ✕
                  </IconButton>
                }
              />
              <form onSubmit={submitMember} className="form-grid">
                <FormGroup label="First name *">
                  <input name="firstName" className={inputClass} required />
                </FormGroup>
                <FormGroup label="Last name *">
                  <input name="lastName" className={inputClass} required />
                </FormGroup>
                <FormGroup label="Other name">
                  <input name="otherName" className={inputClass} />
                </FormGroup>
                <FormGroup label="Phone number *">
                  <input
                    name="phoneNumber"
                    className={inputClass}
                    required
                    placeholder="2348012345678"
                  />
                </FormGroup>
                <FormGroup label="Email (optional)">
                  <input name="email" type="email" className={inputClass} />
                </FormGroup>
                <FormGroup label="Membership ID (optional)">
                  <input
                    name="membershipId"
                    className={inputClass}
                    placeholder="Leave blank to auto-generate"
                  />
                </FormGroup>
                <FormGroup label="State">
                  <input name="state" className={inputClass} />
                </FormGroup>
                <FormGroup label="LGA">
                  <input name="lga" className={inputClass} />
                </FormGroup>
                <FormGroup label="City / town">
                  <input name="cityTown" className={inputClass} />
                </FormGroup>
                <FormGroup label="Address">
                  <input name="address" className={inputClass} />
                </FormGroup>
                <FormActions>
                  <Button type="submit">Add member</Button>
                  <FormError>{memberError}</FormError>
                </FormActions>
              </form>
            </Modal>
          ) : null}
        </>
      ) : null}
    </DashboardShell>
  );
}
