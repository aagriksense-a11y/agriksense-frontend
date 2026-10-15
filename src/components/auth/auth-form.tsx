"use client";

import type { ReactNode } from "react";
import { cx } from "@/components/ui";

/*
 * Shared auth-form primitives for /login and /signup.
 * Every class string below is a direct translation of a css/auth.css rule.
 */

/** .auth-form { display:grid; gap:18px } */
export const FORM = "grid gap-[18px]";

/** .auth-header { margin-bottom:28px } */
export const HEADER = "mb-7";
export const HEADER_TITLE =
  "m-0 mb-2 text-[26px] font-semibold leading-[1.2] tracking-[-0.04em] text-ink max-520px:text-[24px]";
export const HEADER_SUB = "m-0 text-[14px] leading-[1.5] text-muted";

/** .form-group { display:grid; gap:7px } */
export const GROUP = "grid gap-[7px]";
/** .form-group label { font-size:13px; font-weight:600; color:var(--ink); letter-spacing:-.01em } */
export const LABEL = "text-[13px] font-semibold tracking-[-0.01em] text-ink";
/** .input-hint { font-size:12px; color:var(--muted); margin-top:-4px } */
export const HINT = "-mt-1 text-[12px] text-muted";
/** .form-group input[type=text|email|password|tel] → the auth-input @utility in globals.css */
export const TEXT_INPUT = "auth-input";

/** .form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px } + ≤520px single column */
export const ROW = "grid grid-cols-2 gap-3 max-520px:grid-cols-1";

/** .checkbox-label */
export const CHECKBOX_LABEL = "flex cursor-pointer items-start gap-2.5 text-[14px] text-ink";
export const CHECKBOX_INPUT =
  "mt-0.5 mr-[3px] mb-[3px] ml-[4px] size-[18px] shrink-0 cursor-pointer rounded-[5px] accent-green";

/** .form-options + ≤520px stacked variant */
export const FORM_OPTIONS =
  "-mt-1 flex items-center justify-between max-520px:flex-col max-520px:items-start max-520px:gap-3";
/** .forgot-link / .inline-link */
export const GREEN_LINK =
  "text-[13px] font-semibold text-green transition-colors duration-200 hover:text-green-deep";

/** .btn-submit — legacy sets no padding at all, so the UA's `1px 6px` sticks */
export const SUBMIT_BTN = cx(
  "mt-1 h-12 w-full cursor-pointer rounded-[12px] border-0 bg-green px-[6px] py-px",
  "[font-family:inherit] text-[15px] font-[650] tracking-[-0.01em] text-white",
  "[transition:background-color_.3s_cubic-bezier(.16,1,.3,1),transform_.2s]",
  "hover:-translate-y-0.5 hover:bg-green-deep active:translate-y-0",
  "disabled:cursor-not-allowed disabled:opacity-70",
);

/** .auth-error */
export const ERROR_BOX =
  "mb-1 rounded-[10px] border border-[#f3c1c1] bg-[#fdecec] px-3.5 py-3 text-[13px] text-[#8a1f1f]";

/** .auth-footer */
export const FOOTER = "mt-5 border-t border-line pt-5 text-center";
export const FOOTER_TEXT = "m-0 text-[14px] text-muted";
export const FOOTER_LINK =
  "font-[650] text-green transition-colors duration-200 hover:text-green-deep";

/** .role-selector + ≤520px single column */
export const ROLE_SELECTOR = "grid grid-cols-3 gap-2 max-520px:grid-cols-1";
/** .role-tab / .role-tab.active / .role-tab:hover */
export const ROLE_TAB_BASE =
  "flex cursor-pointer flex-col gap-[3px] rounded-[12px] border-[1.5px] border-line bg-white p-3 text-left " +
  "[font-family:inherit] transition-[border-color,background-color,box-shadow] duration-200 hover:border-[#c4d4c9]";
export const ROLE_TAB_ACTIVE =
  "border-green bg-lime/[0.1] shadow-[0_0_0_4px_rgba(11,91,62,0.06)] hover:border-green";
/** .role-tab-title / .role-tab-sub */
export const ROLE_TAB_TITLE = "text-[13px] font-[650] tracking-[-0.01em] text-ink";
export const ROLE_TAB_SUB = "text-[11px] leading-[1.35] text-muted";

/** Field group: label + auth-input-style input + optional .input-hint. */
export function Field({
  id,
  label,
  type = "text",
  name,
  placeholder,
  required,
  autoComplete,
  hint,
  onFirstInput,
}: {
  id: string;
  label: string;
  type?: "text" | "email" | "password" | "tel";
  name?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
  /** legacy: typing in the login form's first input clears the error */
  onFirstInput?: () => void;
}) {
  return (
    <div className={GROUP}>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        className={TEXT_INPUT}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        onChange={onFirstInput}
      />
      {hint ? <span className={HINT}>{hint}</span> : null}
    </div>
  );
}

export function AuthError({ children }: { children: ReactNode }) {
  return <div className={ERROR_BOX}>{children}</div>;
}

export function AuthHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className={HEADER}>
      <h2 className={HEADER_TITLE}>{title}</h2>
      <p className={HEADER_SUB}>{sub}</p>
    </div>
  );
}

/** Path the backend team must implement server-side (GET, optional ?role=). */
export const GOOGLE_AUTH_PATH = "/api/auth/google";

/** Divider between the primary submit action and the Google button. */
export function OrDivider() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-line" />
      <span className="text-[12px] text-muted">or</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

const GOOGLE_SVG = (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62Z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86a5.4 5.4 0 0 1-5.06-3.72H.96v2.33A9 9 0 0 0 9 18Z"
    />
    <path
      fill="#FBBC05"
      d="M3.94 10.7a5.41 5.41 0 0 1 0-3.4V4.97H.96a9 9 0 0 0 0 8.06l2.98-2.33Z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58A8.98 8.98 0 0 0 9 0 9 9 0 0 0 .96 4.97l2.98 2.33A5.4 5.4 0 0 1 9 3.58Z"
    />
  </svg>
);

/**
 * Plain <a> link to the server's Google auth endpoint — full-page navigation,
 * no client fetch. The backend must implement GET /api/auth/google (optionally
 * reading ?role= to pick the account type to create) and store the session the
 * same way POST /api/auth/login does before redirecting to /dashboard.
 */
export function GoogleButton({ label, href = GOOGLE_AUTH_PATH }: { label: string; href?: string }) {
  return (
    <a
      href={href}
      className="flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-[12px] border border-line bg-white text-[15px] font-[650] tracking-[-0.01em] text-ink [font-family:inherit] [transition:background-color_.2s,transform_.2s] hover:-translate-y-0.5 hover:bg-[#f6faf7]"
    >
      {GOOGLE_SVG}
      {label}
    </a>
  );
}
