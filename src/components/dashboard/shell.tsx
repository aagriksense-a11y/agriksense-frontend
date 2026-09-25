"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import { clearSession, type SessionUser } from "@/lib/api";
import { mask } from "@/lib/format";
import { userDisplay, userInitial, useSession } from "@/lib/use-session";
import { Badge, IconButton, LivePill, cx } from "@/components/ui";
import {
  IconAdvisory,
  IconAnalytics,
  IconBell,
  IconDrone,
  IconFarms,
  IconFarmers,
  IconGrid,
  IconLogout,
  IconMenu,
  IconScore,
  IconSensor,
  type IconComponent,
} from "@/components/icons";

const ADMIN_NAV: { group: string; items: { href: string; label: string; Icon: IconComponent; badge?: boolean }[] }[] = [
  {
    group: "Operations",
    items: [
      { href: "/dashboard", label: "Dashboard", Icon: IconGrid },
      { href: "/farmers", label: "Farmers", Icon: IconFarmers },
      { href: "/farms", label: "Farms & Plots", Icon: IconFarms },
    ],
  },
  {
    group: "Monitoring",
    items: [
      { href: "/drone", label: "Drone Monitoring", Icon: IconDrone },
      { href: "/iot", label: "IoT Sensors", Icon: IconSensor },
      { href: "/advisory", label: "AI Advisory", Icon: IconAdvisory, badge: true },
    ],
  },
  {
    group: "Credit & Admin",
    items: [
      { href: "/agriscore", label: "AgriScore", Icon: IconScore },
      { href: "/analytics", label: "Analytics", Icon: IconAnalytics },
    ],
  },
];

const MEMBER_HOME: Record<string, string> = {
  FARMER: "/farmer-dashboard",
  DATA_COLLECTION_OFFICER: "/dco-dashboard",
  ORGANIZATION: "/org-dashboard",
};

function SideItem({
  href,
  label,
  Icon,
  active,
  badge,
  onNavigate,
}: {
  href: string;
  label: string;
  Icon: IconComponent;
  active: boolean;
  badge?: number;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cx(
        "mb-0.5 flex items-center justify-between gap-2 rounded-[10px] px-3 py-[11px] text-[13px] transition-colors duration-200",
        active ? "bg-lime-soft font-[650] text-green" : "text-[#4f5b53] hover:bg-[#f1f4f0]",
      )}
    >
      <span className="flex items-center gap-2.5">
        <Icon className="size-4 shrink-0" />
        {label}
      </span>
      {badge !== undefined ? <Badge>{badge}</Badge> : null}
    </Link>
  );
}

function SideTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mx-2 mt-3.5 mb-2 text-[11px] font-semibold tracking-[0.08em] text-[#889189] uppercase">
      {children}
    </div>
  );
}

function Sidebar({
  user,
  open,
  onClose,
  advisoryCount,
}: {
  user: SessionUser | null;
  open: boolean;
  onClose: () => void;
  advisoryCount?: number;
}) {
  const pathname = usePathname();
  const memberHome = user ? MEMBER_HOME[user.role] : undefined;

  return (
    <aside
      className={cx("app-sidebar", open && "app-sidebar-open")}
      onClick={(e) => {
        if (open) e.stopPropagation();
      }}
    >
      <Link href="/" className="flex items-center gap-2.5 px-2 pt-1.5 pb-[18px]">
        <Image
          src="/images/logo/logo-dark.png"
          alt="Agriksense"
          width={1320}
          height={750}
          className="h-9 w-auto rounded-[8px]"
        />
      </Link>

      {/* One wrapper for the whole admin group, like legacy's .admin-only div:
          as a flex item it forms a block container, so each .side-title's
          margin-top collapses with the previous item's margin-bottom. Flattening
          these into flex items would make every group start 2px lower. */}
      {user?.role === "ADMIN" ? (
        <div>
          {ADMIN_NAV.map((section) => (
            <Fragment key={section.group}>
              <SideTitle>{section.group}</SideTitle>
              {section.items.map((item) => (
                <SideItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  Icon={item.Icon}
                  active={pathname === item.href}
                  badge={item.badge ? (advisoryCount ?? 0) : undefined}
                  onNavigate={onClose}
                />
              ))}
            </Fragment>
          ))}
        </div>
      ) : (
        <div>
          <SideTitle>My Workspace</SideTitle>
          {memberHome ? (
            <SideItem
              href={memberHome}
              label="My Dashboard"
              Icon={IconGrid}
              // Legacy ships this item without the `active` class on every page
              // and never adds it, so the member dashboards show no highlight.
              active={false}
              onNavigate={onClose}
            />
          ) : null}
        </div>
      )}

      <div className="mt-auto border-t border-line-soft px-2.5 pt-3.5 pb-1.5 text-[12px] text-[#666]">
        Workspace
        <b className="mt-[3px] block text-[13px] text-[#111]">Agriksense</b>
      </div>
    </aside>
  );
}

function PlatformIdChip({ user }: { user: SessionUser | null }) {
  const [revealed, setRevealed] = useState(false);
  if (!user?.platformId) return null;
  return (
    <button
      type="button"
      title="Click to show / hide My Agriksense ID"
      onClick={() => setRevealed((r) => !r)}
      className="inline-flex items-center gap-2 rounded-full border border-[#dfe5de] bg-[#f7faf5] px-[11px] py-[7px] text-[11px] font-semibold text-[#4f5b53]"
    >
      <span>My Agriksense ID</span>
      <b>{revealed ? user.platformId : mask(user.platformId)}</b>
    </button>
  );
}

export default function DashboardShell({
  title,
  children,
  advisoryCount,
}: {
  title: string;
  children: ReactNode;
  advisoryCount?: number;
}) {
  const { user, ready } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onClick = () => setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [menuOpen]);

  if (!ready) return null;

  return (
    <div className="app-shell bg-canvas font-dm text-ink">
      <Sidebar
        user={user}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        advisoryCount={advisoryCount}
      />
      <div className="app-main">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-line-soft bg-white px-[22px] max-560px:h-[58px] max-560px:px-3">
          <div className="flex items-center gap-3.5">
            <IconButton
              label="Open menu"
              className="hidden max-900px:grid max-560px:size-8"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((o) => !o);
              }}
            >
              <IconMenu className="size-4" />
            </IconButton>
            <h1 className="text-[18px] font-bold tracking-[-0.03em] max-560px:text-[16px]">{title}</h1>
            <LivePill label="Field network live" className="max-560px:hidden" />
          </div>
          <div className="flex items-center gap-2.5 max-560px:gap-1.5">
            <PlatformIdChip user={user} />
            <IconButton label="Alerts" className="max-560px:size-8">
              <IconBell className="size-[15px]" />
            </IconButton>
            <div className="flex items-center gap-2 rounded-full bg-canvas py-1.5 pr-2.5 pl-1.5 text-[12px] font-semibold max-560px:p-1">
              <span className="grid size-7 place-items-center rounded-full bg-green text-[11px] font-bold text-white">
                {userInitial(user)}
              </span>
              <span className="max-560px:hidden">{userDisplay(user)}</span>
            </div>
            <IconButton
              label="Log out"
              className="max-560px:size-8"
              onClick={() => {
                clearSession();
                window.location.href = "/login";
              }}
            >
              <IconLogout className="size-[15px]" />
            </IconButton>
          </div>
        </header>
        <main className="content-pad">{children}</main>
      </div>
    </div>
  );
}
