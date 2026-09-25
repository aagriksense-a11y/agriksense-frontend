"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cx } from "@/components/ui";

const LINKS = [
  { href: "#platform", label: "Platform" },
  { href: "#network", label: "Network" },
  { href: "#field", label: "Field" },
  { href: "#credit", label: "Credit" },
  { href: "#architecture", label: "Architecture" },
  { href: "#company", label: "Company" },
];

/* Mobile sheet mirrors the legacy .mobile-nav: hidden above 1000px. */
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
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={onClose}
            className="rounded-xl px-6 py-3.5 text-[18px] text-white transition-colors hover:bg-white/[0.08] focus-visible:bg-white/[0.08]"
          >
            {l.label}
          </Link>
        ))}
        <Link href="/login" onClick={onClose} className="mt-5 rounded-xl px-6 py-3.5 text-[18px] text-lime hover:bg-white/[0.08]">
          Login
        </Link>
        <Link href="/signup" onClick={onClose} className="rounded-xl px-6 py-3.5 text-[18px] text-lime hover:bg-white/[0.08]">
          Sign up
        </Link>
      </div>
      <button
        type="button"
        aria-label="close menu"
        onClick={onClose}
        className="absolute top-[18px] right-[18px] grid min-w-12 size-12 place-items-center rounded-xl bg-white/[0.08] p-1.5 text-[28px] text-white transition-colors hover:bg-white/15"
      >
        ✕
      </button>
    </div>
  );
}

export default function LandingNav() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const itemClass = cx(
    "rounded-full px-3.5 py-2.5 text-[15px] transition-colors",
    solid ? "text-[#5c665f] hover:bg-white" : "text-white/[0.72] hover:bg-white/10",
  );

  return (
    <>
      <nav
        className={cx(
          "fixed top-0 right-0 left-0 z-50 py-3.5 text-white transition-[background,color] duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)] max-1000px:py-3",
          solid && "border-b border-[rgba(11,16,13,0.08)] bg-[rgba(247,248,245,0.86)] text-ink backdrop-blur-[20px]",
        )}
      >
        <div className="wrap flex h-[60px] items-center max-1000px:h-11 max-420px:h-[42px]">
          <Link href="#top" className="flex items-center gap-2.5 text-[20px] font-bold tracking-[-0.045em] max-420px:text-[15px]">
            <Image
              src="/images/logo/logo-light.png"
              alt="Agriksense"
              width={1320}
              height={750}
              priority
              className={cx(
                "h-[54px] w-auto max-w-[230px] rounded-xl bg-white/5 object-contain p-1.5",
                solid && "hidden",
              )}
            />
            <Image
              src="/images/logo/logo-dark.png"
              alt="Agriksense"
              width={1320}
              height={750}
              priority
              className={cx(
                "h-[54px] w-auto max-w-[230px] rounded-xl bg-white/5 object-contain p-1.5",
                !solid && "hidden",
              )}
            />
          </Link>
          <div className="mx-auto flex gap-0.5 max-1000px:hidden">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={itemClass}>
                {l.label}
              </Link>
            ))}
            <Link href="/dashboard" className={itemClass}>
              Dashboard
            </Link>
          </div>
          <Link href="/login" className={cx(itemClass, "max-1000px:hidden")}>
            Login
          </Link>
          <Link
            href="/signup"
            className={cx(
              "rounded-full px-4 py-[11px] text-[14px] font-[650] transition-colors max-1000px:hidden",
              solid ? "bg-ink text-white" : "bg-white text-ink",
            )}
          >
            Sign up ↗
          </Link>
          <button
            type="button"
            aria-label="menu"
            onClick={() => setMenuOpen(true)}
            className={cx(
              "ml-auto hidden min-w-11 size-11 rounded-[10px] p-1.5 text-[24px] transition-colors max-1000px:block",
              solid ? "hover:bg-[rgba(11,16,13,0.08)]" : "hover:bg-white/10",
            )}
          >
            ☰
          </button>
        </div>
      </nav>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
