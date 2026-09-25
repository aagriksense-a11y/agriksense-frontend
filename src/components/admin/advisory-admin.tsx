"use client";

import DashboardShell from "@/components/dashboard/shell";
import { Dot, List, ProgressBar, TableWrap, Td, Tag, Th } from "@/components/ui";
import type { TagKind } from "@/lib/format";
import { AdminCard, AdminCardHead, AdminKpiCard, TABLE_COLLAPSE } from "@/components/admin/parts";

/* Static demo content from server/views/advisory.ejs (no API call in the legacy page). */

const QUEUE: {
  type: string;
  note: string;
  topic: string;
  channel: string;
  farmers: number;
  status: string;
  kind: TagKind;
}[] = [
  { type: "Irrigation", note: "Weekly", topic: "Rice cluster moisture low", channel: "SMS + USSD", farmers: 38, status: "Sent", kind: "green" },
  { type: "Fertilizer", note: "Growth stage", topic: "Maize early nitrogen topdress", channel: "SMS", farmers: 52, status: "Sent", kind: "green" },
  { type: "Pest alert", note: "Urgent", topic: "Tomato whitefly detected", channel: "SMS + USSD", farmers: 7, status: "Queued", kind: "amber" },
  { type: "Market", note: "Weekly", topic: "Maize price spike - sell window", channel: "USSD", farmers: 186, status: "Queued", kind: "amber" },
];

const CHANNELS: { label: string; pct: string }[] = [
  { label: "SMS", pct: "54%" },
  { label: "USSD", pct: "31%" },
  { label: "Voice", pct: "15%" },
];

const FUNNEL: { label: string; tone: "green" | "amber"; pct: number }[] = [
  { label: "Delivered", tone: "green", pct: 76 },
  { label: "Read", tone: "amber", pct: 61 },
  { label: "Acted", tone: "amber", pct: 41 },
];

export default function AdvisoryAdmin() {
  return (
    <DashboardShell title="AI Advisory">
      <section className="kpis">
        <AdminKpiCard label="Advisories sent" value="1,284" delta="▲ 212 this week" />
        <AdminKpiCard label="Read rate" value="76%" delta="across SMS + USSD" />
        <AdminKpiCard label="Acted on" value="41%" delta="of read advisories" />
        <AdminKpiCard label="Languages" value="4" delta="EN, HA, IG, YO" tone="amber" />
      </section>

      <section className="grid-2">
        <AdminCard>
          <AdminCardHead title="Advisory queue" sub="Generated advisories sorted by urgency" />
          <TableWrap className={TABLE_COLLAPSE}>
            <thead>
              <tr>
                <Th>Type</Th>
                <Th>Topic</Th>
                <Th>Channel</Th>
                <Th>Farmers</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {QUEUE.map((q, i) => (
                <tr key={`${q.type}-${q.topic}-${i}`}>
                  <Td>
                    <b className="text-[13px]">{q.type}</b>
                    <small className="text-[11px] text-[#889189]">{q.note}</small>
                  </Td>
                  <Td>{q.topic}</Td>
                  <Td>{q.channel}</Td>
                  <Td>{q.farmers}</Td>
                  <Td>
                    <Tag kind={q.kind}>{q.status}</Tag>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </AdminCard>

        <AdminCard>
          <AdminCardHead title="Delivery channels" sub="Advisory reach by channel" />
          <div className="dev-kpis">
            {CHANNELS.map((c) => (
              <div key={c.label}>
                <b>{c.label}</b>
                <span>{c.pct}</span>
              </div>
            ))}
          </div>
          <List>
            {FUNNEL.map((f) => (
              <div key={f.label} className="flex items-center gap-2.5 py-2.5 text-[12px] text-[#5c665f]">
                <span>
                  <Dot tone={f.tone} />
                  {f.label}
                </span>
                <ProgressBar pct={f.pct} className="min-w-[60px]" />
                <b className="ml-auto font-bold text-[#111]">{f.pct}%</b>
              </div>
            ))}
          </List>
        </AdminCard>
      </section>
    </DashboardShell>
  );
}
