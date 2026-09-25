"use client";

import { useState, type ReactNode, type SVGProps } from "react";
import { RAvatar } from "@/components/admin/parts";
import { mask } from "@/lib/format";

/**
 * Pieces shared by the three role dashboards (farmer / DCO / organization).
 * Everything else re-uses `components/ui` and `components/admin/parts`.
 */

/** `.list .i` — label row inside `.list` (the border-top comes from `List`). */
export function ListI({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-between py-2.5 text-[13px]">{children}</div>;
}

/** Eye icon taken verbatim from the legacy `#eyeBtn` inline SVG in each view. */
function IconEye(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      {...props}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/**
 * `.id-box` / `.id-value` — green platform-ID banner with the show/hide (eye)
 * toggle. Legacy starts masked (`mask(id)` contains "***") and flips on click.
 * `.id-box .icon-btn` overrides the button to translucent white.
 */
export function PlatformIdBanner({ id }: { id: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="mb-1 mt-4 flex items-center justify-between gap-3 rounded-[14px] bg-green p-4 text-white">
      <div className="text-[20px] font-bold tracking-[0.06em]">{revealed ? id : mask(id)}</div>
      <button
        type="button"
        aria-label="Show / hide ID"
        title="Show / hide ID"
        onClick={() => setRevealed((r) => !r)}
        className="grid size-9 place-items-center rounded-[10px] bg-[rgba(255,255,255,0.14)] text-white hover:bg-[rgba(255,255,255,0.24)] max-560px:size-8"
      >
        <IconEye className="size-4" />
      </button>
    </div>
  );
}

/** `.rprofile` — farm profile tile on the farmer dashboard roster. */
export function RProfile({
  name,
  location,
  meta,
}: {
  name: string;
  location: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-[14px] border border-line-soft bg-white p-4 transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#c4d8c0] hover:shadow-[0_10px_26px_rgba(11,91,62,0.07)]">
      <RAvatar>{(name || "F").charAt(0)}</RAvatar>
      <div className="min-w-0 flex-1">
        <b className="block text-[14px]">{name}</b>
        <small className="mt-0.5 block text-[11px] text-[#889189]">{location}</small>
        {meta ? <div className="mt-2 flex flex-wrap gap-1.5">{meta}</div> : null}
      </div>
    </div>
  );
}

/** `.r-chip.g` — small lime pill under a farm name. */
export function PlotChip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-lime-soft px-2 py-[3px] text-[10px] font-[650] text-green">
      {children}
    </span>
  );
}
