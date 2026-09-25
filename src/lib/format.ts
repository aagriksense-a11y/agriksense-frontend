/** Formatting helpers ported from window.AG in server/views/partials/scripts.ejs. */

export function money(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  return `₦${Number(n).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

export function num(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  return Number(n).toLocaleString("en-NG");
}

export function mask(value: string | null | undefined): string {
  if (!value) return "";
  return value.startsWith("+") ? `+***${value.slice(-4)}` : `***${value.slice(-4)}`;
}

export type TagKind = "green" | "blue" | "amber" | "red" | "gray" | "maroon";

const TAG_BY_STATUS: Record<string, TagKind> = {
  VERIFIED: "green",
  REJECTED: "red",
  PENDING: "amber",
  HEALTHY: "green",
  WATCHLIST: "amber",
  CRITICAL: "red",
  MAPPED: "green",
  ASSIGNED: "blue",
  COMPLETED: "green",
  VISITED: "blue",
  REQUESTED: "amber",
  CANCELLED: "gray",
  ACTIVE: "green",
  DORMANT: "gray",
  HARVESTED: "blue",
  MAINTENANCE: "amber",
  OFFLINE: "red",
  ONLINE: "green",
  PHASE_1_BASIC: "amber",
  PHASE_2_COMPLETED: "green",
  LOW: "gray",
  MEDIUM: "blue",
  HIGH: "amber",
};

export function tagKind(status: string | null | undefined): TagKind {
  return TAG_BY_STATUS[status ?? ""] ?? "gray";
}
