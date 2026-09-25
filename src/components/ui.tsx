import type { ButtonHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { type TagKind } from "@/lib/format";

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/* ---- Card ---- */

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cx("min-w-0 rounded-2xl border border-line-soft bg-white p-[18px] max-560px:p-[15px]", className)}>
      {children}
    </section>
  );
}

export function CardHead({
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

export function Metric({ children }: { children: ReactNode }) {
  return <div className="my-4 text-[34px] font-bold tracking-[-0.04em] max-560px:text-[28px]">{children}</div>;
}

export function KpiCard({
  label,
  value,
  delta,
  tone = "up",
}: {
  label: ReactNode;
  value: ReactNode;
  delta?: ReactNode;
  tone?: "up" | "amber" | "red";
}) {
  const toneClass =
    tone === "amber" ? "text-[#b8860b]" : tone === "red" ? "text-[#c44747]" : "text-[#2aa564]";
  return (
    <div className="rounded-[14px] border border-line-soft bg-white p-4 max-560px:px-[18px]">
      <small className="block text-[11px] font-semibold tracking-[0.06em] text-muted uppercase">
        {label}
      </small>
      <strong className="mt-2.5 block text-[26px] tracking-[-0.04em]">{value}</strong>
      {delta ? <span className={cx("mt-1.5 block text-[12px] font-semibold", toneClass)}>{delta}</span> : null}
    </div>
  );
}

/* ---- Tags, pills, dots ---- */

const TAG_STYLES: Record<TagKind, string> = {
  green: "bg-lime-soft text-green",
  blue: "bg-[#e8eefc] text-[#3557c9]",
  amber: "bg-[#f5f0d8] text-[#7a6a1f]",
  red: "bg-[#fbe9e7] text-[#b3382c]",
  gray: "bg-[#eef1ed] text-[#5c665f]",
  maroon: "bg-[#efe5f0] text-[#7a3d6b]",
};

export function Tag({ kind = "gray", children }: { kind?: TagKind; children: ReactNode }) {
  return (
    <span
      className={cx(
        "inline-flex items-center whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-[650]",
        TAG_STYLES[kind],
      )}
    >
      {children}
    </span>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="grid h-[18px] min-w-5 place-items-center rounded-full bg-green px-1.5 text-[10px] font-bold text-white">
      {children}
    </span>
  );
}

const DOT_STYLES = {
  green: "bg-green",
  amber: "bg-[#b8860b]",
  red: "bg-[#c44747]",
  blue: "bg-[#3557c9]",
  gray: "bg-[#889189]",
} as const;

export function Dot({ tone = "gray" }: { tone?: keyof typeof DOT_STYLES }) {
  return <i className={cx("mr-1.5 inline-block size-2.5 rounded-full", DOT_STYLES[tone])} />;
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "inline-flex items-center gap-2 rounded-full border border-[#dfe5de] bg-[#f7faf5] px-[11px] py-[7px] text-[11px] font-semibold text-[#4f5b53]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function LivePill({ label, className }: { label: string; className?: string }) {
  return (
    <Pill className={className}>
      {/* legacy's global `.dot{margin-right:6px}` also applies inside .pill */}
      <span className="mr-1.5 size-[7px] rounded-full bg-green shadow-[0_0_0_4px_rgba(11,91,62,0.12)]" />
      {label}
    </Pill>
  );
}

/* ---- Buttons ---- */

type ButtonProps = {
  variant?: "primary" | "ghost";
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = "primary", className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cx(
        "inline-flex items-center gap-2 whitespace-nowrap rounded-[10px] px-3.5 py-[9px] text-[13px] font-semibold transition-[background,color,transform] duration-200 ease-[cubic-bezier(.16,1,.3,1)] disabled:pointer-events-none disabled:opacity-45",
        variant === "primary"
          ? "bg-green text-white hover:bg-green-dark"
          : "border border-line-soft bg-white text-[#4f5b53] hover:bg-[#f5f7f4]",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function IconButton({
  label,
  children,
  className,
  ...rest
}: { label: string; children: ReactNode; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cx(
        "grid size-9 place-items-center rounded-[10px] bg-canvas text-[#4d5a52] hover:bg-[#e8ede6] max-560px:size-8",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ---- Data display ---- */

export function Select({
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cx(
        "font-ua whitespace-nowrap rounded-lg border border-[#e5e9e5] bg-[#f5f7f4] px-2 py-1.5 text-[12px] text-[#667068]",
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  );
}

export function TableWrap({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cx("scrollbar-slim -mx-1 overflow-x-auto px-1", className)}>
      <table className="w-full min-w-[480px] border-collapse text-[13px] max-560px:min-w-[520px] max-560px:text-[12px]">
        {children}
      </table>
    </div>
  );
}

export function Th({
  children,
  className,
  colSpan,
}: {
  children?: ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <th
      colSpan={colSpan}
      className={cx(
        "border-none px-2 py-3 text-left text-[11px] font-semibold tracking-[0.06em] text-[#889189] uppercase",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
  colSpan,
}: {
  children?: ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td colSpan={colSpan} className={cx("border-t border-[#eef1ed] px-2 py-3", className)}>
      {children}
    </td>
  );
}

/** Small colour key used by chart legends (`.legend i`, `.legend-map i`): square, not round. */
export function Swatch({ className }: { className?: string }) {
  return <i className={cx("mr-1.5 inline-block size-2.5 rounded-[3px]", className)} />;
}

export function ClickableRow({
  onOpen,
  children,
}: {
  onOpen: () => void;
  children: ReactNode;
}) {
  return (
    <tr
      className="cursor-pointer [&>td]:transition-colors hover:[&>td]:bg-[#f8faf6]"
      onClick={onOpen}
    >
      {children}
    </tr>
  );
}

export function List({ children }: { children: ReactNode }) {
  return <div className="[&>*+*]:border-t [&>*+*]:border-[#f0f2ef]">{children}</div>;
}

export function MiniLine({ label, value }: { label: ReactNode; value?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2.5 py-[5px] text-[13px] text-[#2a332d]">
      <span>{label}</span>
      {value ?? null}
    </div>
  );
}

export function ProgressBar({
  pct,
  className,
  fillClass = "bg-green",
}: {
  pct: number;
  className?: string;
  fillClass?: string;
}) {
  return (
    <div className={cx("my-4 h-[7px] flex-1 overflow-hidden rounded-full bg-[#eef1ed]", className)}>
      <div className={cx("h-full rounded-full", fillClass)} style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ---- Overlays ---- */

export function Drawer({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <>
      <div
        className={cx(
          "fixed inset-0 z-50 bg-[rgba(11,16,13,0.45)] transition-opacity duration-250",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cx(
          "fixed top-0 right-0 bottom-0 z-51 flex w-[400px] max-w-[92vw] flex-col border-l border-line-soft bg-white transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          open ? "translate-x-0" : "translate-x-[105%]",
        )}
        inert={!open}
      >
        <header className="flex items-center justify-between gap-2.5 border-b border-line-soft px-5 py-[18px] text-[15px]">
          <b>{title}</b>
          <IconButton label="Close" onClick={onClose}>
            ✕
          </IconButton>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </>
  );
}

export function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-[rgba(11,16,13,0.45)] p-5"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-[18px] bg-white p-[22px] shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function FormField({
  label,
  htmlFor,
  full,
  children,
}: {
  label: ReactNode;
  htmlFor?: string;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cx("flex flex-col gap-1.5", full && "col-span-full")}>
      <label
        htmlFor={htmlFor}
        className="text-[11px] font-[650] tracking-[0.06em] text-[#4f5b53] uppercase"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputClass =
  "rounded-[10px] border border-[#e5e9e5] bg-white px-3 py-2.5 text-[13px] text-ink outline-none focus:border-[#9fc18f] focus:shadow-[0_0_0_3px_rgba(11,91,62,0.08)]";

export function FormError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="text-[12px] font-semibold text-[#c44747]">{children}</p>;
}

/* ---- Avatars ---- */

const SM_TONES = {
  co: "bg-[#3557c9]",
  fb: "bg-[#a05b2c]",
  im: "bg-[#7a6a1f]",
  ne: "bg-[#8a4d8f]",
  sa: "bg-[#c44747]",
} as const;

export function InitialTile({
  initials,
  tone,
}: {
  initials: ReactNode;
  tone?: keyof typeof SM_TONES;
}) {
  return (
    <span
      className={cx(
        "grid size-[34px] shrink-0 place-items-center rounded-[9px] text-[11px] font-bold text-white",
        tone ? SM_TONES[tone] : "bg-green",
      )}
    >
      {initials}
    </span>
  );
}
