"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cx } from "@/components/ui";

/*
 * Port of the legacy <nav class="nav auth-nav"> from login.ejs / signup.ejs,
 * styled by .nav/.brand/.nav-* rules in css/style.css plus the .auth-nav
 * overrides in css/auth.css (always-white nav, dark logo, #5c665f links).
 */

const LINKS = [
  { href: "/#platform", label: "Platform" },
  { href: "/#network", label: "Network" },
  { href: "/#field", label: "Field" },
  { href: "/#credit", label: "Credit" },
  { href: "/dashboard", label: "Dashboard" },
];

/* Legacy auth-page mobile sheet links (mobile-nav-inner in login/signup.ejs). */
const MOBILE_LINKS = [
  { href: "/dashboard", label: "Platform" },
  { href: "/farmers", label: "Network" },
  { href: "/farms", label: "Field" },
  { href: "/agriscore", label: "Credit" },
];

function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={cx(
        "fixed inset-0 z-[55] hidden bg-[rgba(8,13,10,0.97)] backdrop-blur-[18px] transition-[opacity,visibility] duration-[350ms] ease-[cubic-bezier(.16,1,.3,1)] max-1000px:block",
        open ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      <div className="flex h-full flex-col items-center justify-center gap-3.5 p-6">
        {MOBILE_LINKS.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            onClick={onClose}
            className="rounded-xl px-6 py-3.5 text-[18px] text-white transition-colors hover:bg-white/[0.08] focus-visible:bg-white/[0.08]"
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/login"
          onClick={onClose}
          className="mt-5 rounded-xl px-6 py-3.5 text-[18px] text-lime transition-colors hover:bg-white/[0.08] focus-visible:bg-white/[0.08]"
        >
          Login
        </Link>
        <Link
          href="/signup"
          onClick={onClose}
          className="rounded-xl px-6 py-3.5 text-[18px] text-lime transition-colors hover:bg-white/[0.08] focus-visible:bg-white/[0.08]"
        >
          Sign up
        </Link>
      </div>
      <button
        type="button"
        aria-label="close menu"
        onClick={onClose}
        className="absolute top-[18px] right-[18px] grid min-w-12 size-12 place-items-center rounded-xl bg-white/[0.08] p-1.5 text-[28px] text-white transition-colors hover:bg-white/15 focus-visible:bg-white/15"
      >
        ✕
      </button>
    </div>
  );
}

export default function AuthNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  /* js/main.js keeps toggling .solid past 32px; on ≤1000px the auth page scrolls. */
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* .nav-links a / .nav-contact under .auth-nav */
  const itemClass =
    "rounded-full px-3.5 py-2.5 text-[15px] text-[#5c665f] transition-colors hover:bg-paper hover:text-ink";

  return (
    <>
      <nav
        className={cx(
          "fixed top-0 right-0 left-0 z-50 border-b py-3.5 text-ink transition-all duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)] max-1000px:py-3",
          solid
            ? "border-[rgba(11,16,13,0.08)] bg-[rgba(247,248,245,0.86)] backdrop-blur-[20px]"
            : "border-line bg-white",
        )}
      >
        <div className="wrap flex h-[60px] items-center max-1000px:h-11 max-420px:h-[42px]">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[20px] font-bold tracking-[-0.045em] max-420px:text-[15px]"
          >
            <Image
              src="/images/logo/logo-dark.png"
              alt="Agriksense"
              width={1320}
              height={750}
              priority
              className="h-[54px] w-auto max-w-[230px] rounded-xl bg-white/5 object-contain p-1.5"
            />
          </Link>
          <div className="mx-auto flex gap-0.5 max-1000px:hidden">
            {LINKS.map((l) => (
              <Link key={l.label} href={l.href} className={itemClass}>
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="/login" className={cx(itemClass, "max-1000px:hidden")}>
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-ink px-4 py-[11px] text-[14px] font-[650] text-white transition-colors hover:bg-green max-1000px:hidden"
          >
            Sign up ↗
          </Link>
          <button
            type="button"
            aria-label="menu"
            onClick={() => setMenuOpen(true)}
            className="ml-auto hidden min-w-11 size-11 rounded-[10px] border-0 bg-transparent p-1.5 text-[24px] text-ink transition-colors hover:bg-[rgba(11,16,13,0.08)] focus-visible:bg-[rgba(11,16,13,0.08)] max-1000px:block"
          >
            ☰
          </button>
        </div>
      </nav>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
