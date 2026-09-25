import type { ReactNode } from "react";
import { Card, cx } from "@/components/ui";
import { IconSearch } from "@/components/icons";

/*
  Shared Card / CardHead / KpiCard stop at the desktop rules; the legacy 560px
  block also shrinks card padding, card titles and KPI padding, so the dashboard
  pages wrap them here instead of editing the shared primitives.
*/

export function AdminCard({ className, children }: { className?: string; children: ReactNode }) {
  return <Card className={cx("max-560px:p-[15px]", className)}>{children}</Card>;
}

export function AdminCardHead({
  title,
  sub,
  right,
}: {
  title: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <b className="block text-[14px] tracking-[-0.02em] max-560px:text-[13px]">{title}</b>
        {sub ? <div className="mt-[3px] text-[12px] text-muted">{sub}</div> : null}
      </div>
      {right}
    </div>
  );
}

const KPI_TONE = {
  up: "text-[#2aa564]",
  amber: "text-[#b8860b]",
  red: "text-[#c44747]",
} as const;

export function AdminKpiCard({
  label,
  value,
  delta,
  tone = "up",
}: {
  label: ReactNode;
  value: ReactNode;
  delta?: ReactNode;
  tone?: keyof typeof KPI_TONE;
}) {
  return (
    <div className="rounded-[14px] border border-line-soft bg-white p-4 max-560px:px-[18px]">
      <small className="block text-[11px] font-semibold tracking-[0.06em] text-muted uppercase">
        {label}
      </small>
      <strong className="mt-2.5 block text-[26px] tracking-[-0.04em]">{value}</strong>
      {delta ? (
        <span className={cx("mt-1.5 block text-[12px] font-semibold", KPI_TONE[tone])}>{delta}</span>
      ) : null}
    </div>
  );
}

/**
 * `TableWrap` hard-codes the desktop `.table` metrics (480px / 13px); the legacy
 * 560px block re-declares them, and the table is the wrapper's only child element.
 */
export const TABLE_COLLAPSE = "max-560px:[&>table]:min-w-[520px] max-560px:[&>table]:text-[12px]";

export function StatusCard({ children, failed = false }: { children: ReactNode; failed?: boolean }) {
  return <AdminCard className={failed ? "text-[#c44747]" : undefined}>{children}</AdminCard>;
}

export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 max-560px:flex-col max-560px:items-stretch">
      {children}
    </div>
  );
}

export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-[10px] border border-line-soft bg-white px-3 py-[9px] max-560px:min-w-0">
      <IconSearch className="size-[15px] shrink-0 text-[#889189]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border-0 bg-transparent font-[inherit] text-[13px] text-ink outline-none"
      />
    </div>
  );
}

export function Mini({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="flex justify-between py-2 text-[12px] text-[#5c665f]">
      <span>{label}</span>
      <b className="text-[#111]">{value}</b>
    </div>
  );
}

const LEGEND_DOT = {
  green: "bg-green",
  amber: "bg-[#b8860b]",
  red: "bg-[#c44747]",
  blue: "bg-[#3557c9]",
  gray: "bg-[#889189]",
} as const;

export function Legend({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3.5 flex flex-wrap gap-4 text-[12px] font-semibold text-[#4f5b53]">
      {children}
    </div>
  );
}

/** `.legend i` outranks `.dot`, so these markers keep the 3px radius, not a circle. */
export function LegendItem({ tone, children }: { tone: keyof typeof LEGEND_DOT; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <i className={cx("mr-1.5 inline-block size-2.5 rounded-[3px]", LEGEND_DOT[tone])} />
      {children}
    </span>
  );
}

export type AreaBar = { label: string; pct: number; value: string };

export function AreaBars({ items }: { items: AreaBar[] }) {
  return (
    <div className="mt-2">
      {items.map((bar) => (
        <div
          key={bar.label}
          className="flex items-center gap-2.5 py-[9px] text-[12px] text-[#4f5b53]"
        >
          <b className="w-16 shrink-0 text-[12px]">{bar.label}</b>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#eef1ed]">
            <div className="h-full rounded-full bg-green" style={{ width: `${bar.pct}%` }} />
          </div>
          <span>{bar.value}</span>
        </div>
      ))}
    </div>
  );
}

export function RAvatar({ children }: { children: ReactNode }) {
  return (
    <span className="grid size-[46px] shrink-0 place-items-center rounded-xl bg-green text-[14px] font-bold text-white">
      {children}
    </span>
  );
}

/**
 * `.form-group` keeps `<label>` as a sibling of the control. The shared `FormField`
 * wraps it in a `<label>`, which steals clicks from the multi-select on the farms page.
 */
export function FormGroup({
  label,
  full,
  children,
}: {
  label: ReactNode;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cx("flex flex-col gap-1.5", full && "col-span-full")}>
      <label className="text-[11px] font-[650] uppercase tracking-[0.06em] text-[#4f5b53]">
        {label}
      </label>
      {children}
    </div>
  );
}

export function FormActions({ children }: { children: ReactNode }) {
  return <div className="col-span-full flex items-center gap-3 pt-1.5">{children}</div>;
}

/**
 * `Td` takes no colSpan, and the legacy empty states inline a full-width padding that
 * overrides `.table td`. The dashboard row spells its colour `#88918`, which is invalid,
 * so that one cell keeps the inherited ink.
 */
const EMPTY_PAD = { 20: "p-5", 24: "p-6", 30: "p-[30px]" } as const;

export function EmptyRow({
  colSpan,
  pad,
  gray = false,
  children,
}: {
  colSpan: number;
  pad: keyof typeof EMPTY_PAD;
  gray?: boolean;
  children: ReactNode;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={cx("border-t border-[#eef1ed] text-center", EMPTY_PAD[pad], gray && "text-[#889189]")}
      >
        {children}
      </td>
    </tr>
  );
}

