"use client";

import type { ReactNode } from "react";
import { Drawer, MiniLine, Tag } from "@/components/ui";
import { RAvatar } from "@/components/admin/parts";
import { num, tagKind } from "@/lib/format";

export type FarmerDetail = {
  id: string;
  platformId: string | null;
  phoneNumber: string | null;
  email: string | null;
  profile: {
    firstName?: string | null;
    lastName?: string | null;
    address?: string | null;
    cityTown?: string | null;
    lga?: string | null;
    state?: string | null;
    nin?: string | null;
    ninStatus?: string | null;
  } | null;
  bankAccounts: {
    id: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
  }[];
  memberships: { id: string; memberId: string; isVerified: boolean; orgName: string }[];
  farms: { id: string; name: string; state: string | null; plots: { id: string }[] }[];
};

export function initialsOf(f: { firstName?: string | null; lastName?: string | null }): string {
  return ((f.firstName || "F").charAt(0) + (f.lastName || "").charAt(0)) || "F";
}

function DetailBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-[#f0f2ef] py-3.5 text-[13px]">
      <b className="mb-1.5 block text-[11px] uppercase tracking-[0.06em] text-[#889189]">{title}</b>
      {children}
    </div>
  );
}

export default function FarmerDrawer({
  open,
  detail,
  onClose,
}: {
  open: boolean;
  detail: FarmerDetail | null;
  onClose: () => void;
}) {
  return (
    <Drawer open={open} title="Farmer profile" onClose={onClose}>
      {detail ? <Body detail={detail} /> : null}
    </Drawer>
  );
}

function Body({ detail }: { detail: FarmerDetail }) {
  const p = detail.profile || {};
  const memberships = detail.memberships || [];
  const banks = detail.bankAccounts || [];
  const farms = detail.farms || [];
  return (
    <>
      <div className="flex items-center gap-3.5 border-b border-[#f0f2ef] pb-4">
        <RAvatar>{initialsOf(p)}</RAvatar>
        <div>
          <b className="block text-[16px] tracking-[-0.02em]">
            {`${p.firstName || ""} ${p.lastName || ""}`.trim()}
          </b>
          <small className="mt-0.5 block text-[11px] text-[#889189]">
            ID {detail.platformId} · {detail.email || ""} · {detail.phoneNumber || ""}
          </small>
        </div>
      </div>

      <DetailBlock title="Residence">
        <span className="text-[#2a332d]">
          {[p.address, p.cityTown, p.lga, p.state].filter(Boolean).join(", ") || "—"}
        </span>
      </DetailBlock>

      <DetailBlock title="NIN verification">
        <span className="text-[#2a332d]">
          <Tag kind={tagKind(p.ninStatus)}>{p.ninStatus}</Tag> {p.nin ? `· ${p.nin}` : ""}
        </span>
      </DetailBlock>

      <DetailBlock title="Memberships">
        {memberships.length ? (
          memberships.map((m) => (
            <MiniLine
              key={m.id}
              label={`${m.orgName} · ${m.memberId}`}
              value={
                <Tag kind={tagKind(m.isVerified ? "VERIFIED" : "PENDING")}>
                  {m.isVerified ? "Verified" : "Unverified"}
                </Tag>
              }
            />
          ))
        ) : (
          <span className="text-[#889189]">No memberships</span>
        )}
      </DetailBlock>

      <DetailBlock title="Bank accounts">
        {banks.length ? (
          banks.map((b) => (
            <MiniLine
              key={b.id}
              label={b.bankName}
              value={
                <small className="mt-px block text-[11px] text-[#889189]">
                  {b.accountName} · {b.accountNumber}
                </small>
              }
            />
          ))
        ) : (
          <span className="text-[#889189]">None added</span>
        )}
      </DetailBlock>

      <DetailBlock title={`Farms & plots (${num(farms.length)})`}>
        {farms.length ? (
          farms.map((f) => (
            <MiniLine
              key={f.id}
              label={
                <span>
                  <b>{f.name}</b>
                  <small className="mt-px block text-[11px] text-[#889189]">
                    {f.state || ""} · {num(f.plots.length)} plots
                  </small>
                </span>
              }
              value={null}
            />
          ))
        ) : (
          <span className="text-[#889189]">No farms registered</span>
        )}
      </DetailBlock>
    </>
  );
}
