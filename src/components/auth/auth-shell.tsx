import type { ReactNode } from "react";
import Image from "next/image";
import { IconCheck } from "@/components/icons";
import { cx } from "@/components/ui";
import AuthNav from "./auth-nav";

/*
 * Auth page shell — port of .auth-main / .auth-container / .auth-visual from
 * css/auth.css (used by login.ejs and signup.ejs). The dark visual column is
 * hidden at ≤1000px and the card collapses to a single 520px column there.
 */

/** .auth-visual-bg radial + linear wash (auth.css) */
const VISUAL_BG =
  "[background:radial-gradient(circle_at_78%_25%,rgba(196,232,112,0.16),transparent_28%),linear-gradient(125deg,#06100b_5%,#123b29_56%,#0b1911_100%)]";
/** .auth-visual-bg:after dotted overlay */
const VISUAL_DOTS =
  "[background:radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] opacity-30";

function AuthVisual({
  heading,
  body,
  features,
  trust,
}: {
  heading: ReactNode;
  body: string;
  features: string[];
  trust?: string;
}) {
  return (
    <div className="relative flex h-full flex-col justify-center bg-[#0a1510] p-12 text-white max-1000px:hidden">
      <div className="relative z-[2]">
        <div className="mb-7 block">
          <Image
            src="/images/logo/logo-tile.png"
            alt="Agriksense"
            width={56}
            height={56}
            className="size-14 rounded-[14px] object-contain"
          />
        </div>
        <h1 className="m-0 mb-4 text-[clamp(32px,3.5vw,42px)] font-semibold leading-[1.15] tracking-[-0.055em]">
          {heading}
        </h1>
        <p className="m-0 mb-8 max-w-[440px] text-sm leading-[1.6] text-white/70">{body}</p>
        <div className="mb-0 grid gap-3.5">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 text-[14px] text-white/[0.85]"
            >
              <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-lime/20 bg-lime/[0.12] text-lime">
                <IconCheck width={20} height={20} />
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
        {trust ? (
          <div className="border-t border-white/[0.12] pt-8">
            {/* legacy's `.auth-visual p` out-specifies `.trust-text`, so the trust
                line keeps the body copy's 14px / 32px bottom margin / 70% white. */}
            <p className="m-0 mb-8 max-w-[440px] text-[14px] leading-[1.6] text-white/70">
              {trust}
            </p>
          </div>
        ) : null}
      </div>
      <div className={cx("absolute inset-0 z-[1] opacity-95", VISUAL_BG)}>
        <div className={cx("absolute inset-0", VISUAL_DOTS)} />
      </div>
    </div>
  );
}

export default function AuthShell({
  heading,
  body,
  features,
  trust,
  children,
}: {
  heading: ReactNode;
  body: string;
  features: string[];
  trust?: string;
  children: ReactNode;
}) {
  return (
    <>
      <AuthNav />
      {/* .auth-main */}
      <main className="flex h-screen items-center justify-center overflow-hidden bg-paper pt-[88px] font-sans text-ink max-1000px:h-auto max-1000px:overflow-auto max-1000px:px-5 max-1000px:pb-10">
        {/* .auth-container */}
        <div className="grid h-[calc(100vh-120px)] max-h-[720px] w-full max-w-[1240px] grid-cols-2 overflow-hidden rounded-[32px] border border-line bg-white shadow-[0_40px_120px_rgba(11,16,13,0.12)] max-1000px:h-auto max-1000px:max-h-none max-1000px:max-w-[520px] max-1000px:grid-cols-1">
          <AuthVisual heading={heading} body={body} features={features} trust={trust} />
          {/* .auth-form-panel */}
          <div className="flex h-full items-center justify-center overflow-y-auto bg-white p-12 max-1000px:px-8 max-520px:p-[40px_24px]">
            {/* .auth-form-wrap */}
            <div className="w-full max-w-[400px]">{children}</div>
          </div>
        </div>
      </main>
    </>
  );
}
