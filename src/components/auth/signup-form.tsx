"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { errorMessage, storeSession, type AuthTokens, type SessionUser } from "@/lib/api";
import { ROLE_SIGNUP_PATH, type UserRoleKey } from "@/lib/session";
import { cx } from "@/components/ui";
import {
  AuthError,
  AuthHeader,
  CHECKBOX_INPUT,
  FOOTER,
  FOOTER_LINK,
  FOOTER_TEXT,
  FORM,
  Field,
  GROUP,
  GOOGLE_AUTH_PATH,
  GoogleButton,
  LABEL,
  OrDivider,
  ROLE_SELECTOR,
  ROLE_TAB_ACTIVE,
  ROLE_TAB_BASE,
  ROLE_TAB_SUB,
  ROLE_TAB_TITLE,
  ROW,
  SUBMIT_BTN,
} from "./auth-form";

type AuthResponse = SessionUser & AuthTokens;

const ROLES: { key: UserRoleKey; title: string; sub: string }[] = [
  { key: "farmer", title: "Farmer", sub: "I grow crops or rear livestock" },
  { key: "dco", title: "Officer", sub: "I collect field data" },
  { key: "organization", title: "Organization", sub: "A company or cooperative" },
];

/*
 * Port of the signup.ejs form + js/auth.js:
 * - three role panels stay mounted; only the active one is shown and carries
 *   `required` (legacy toggleAttribute("required", active) behaviour),
 * - consent + password-match checks run client-side before the POST,
 * - bodies match submitSignup() field names exactly (otherName undefined when
 *   empty, confirmPassword included).
 */
export default function SignupForm() {
  const [role, setRole] = useState<UserRoleKey>("farmer");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function selectRole(next: UserRoleKey) {
    setRole(next);
    setError(null); // legacy: tab click clears the error
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    setBusy(true);
    try {
      if (role === "farmer" && !form.querySelector<HTMLInputElement>('input[name="consent"]')?.checked) {
        setError("Please accept the Farmer Informed Consent terms.");
        return;
      }
      const panel = form.querySelector<HTMLElement>(`[data-role-panel="${role}"]`);
      const read = (selector: string, trim = false): string => {
        const el = panel?.querySelector<HTMLInputElement>(selector);
        const value = el?.value ?? "";
        return trim ? value.trim() : value;
      };
      const pwdSelector = role === "farmer" ? "#f-password" : role === "dco" ? "#dco-password" : "#org-password";
      const confirmSelector =
        role === "farmer" ? "#f-confirm-password" : role === "dco" ? "#dco-confirm-password" : "#org-confirm-password";
      const password = read(pwdSelector);
      const confirmPassword = read(confirmSelector);
      if (confirmPassword && password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      let body: Record<string, string | boolean | undefined>;
      if (role === "farmer") {
        body = {
          firstName: read("#f-first-name", true),
          lastName: read("#f-last-name", true),
          otherName: read("#f-other-name", true) || undefined,
          phoneNumber: read("#f-phone", true),
          email: read("#f-email", true),
          password,
          confirmPassword,
          consentAccepted:
            form.querySelector<HTMLInputElement>('input[name="consent"]')?.checked ?? false,
        };
      } else if (role === "dco") {
        body = {
          firstName: read("#dco-first-name", true),
          lastName: read("#dco-last-name", true),
          otherName: read("#dco-other-name", true) || undefined,
          email: read("#dco-email", true),
          phoneNumber: read("#dco-phone", true),
          password,
          confirmPassword,
        };
      } else {
        body = {
          orgName: read("#org-org-name", true),
          email: read("#org-email", true),
          phoneNumber: read("#org-phone", true) || "",
          password,
          confirmPassword,
        };
      }

      const res = await fetch(ROLE_SIGNUP_PATH[role], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as {
        data?: AuthResponse;
        errors?: { message: string }[];
        message?: string;
      };
      if (!res.ok) {
        setError(errorMessage(data, "Sign up failed. Please try again."));
        return;
      }
      if (data.data) storeSession(data.data);
      window.location.href = "/dashboard";
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <AuthHeader title="Create your account" sub="Get started with Agriksense today" />

      <form className={FORM} onSubmit={onSubmit}>
        {error ? <AuthError>{error}</AuthError> : null}

        <div className={GROUP}>
          <label className={LABEL}>Account type</label>
          <div className={ROLE_SELECTOR} role="radiogroup" aria-label="Account type">
            {ROLES.map((tab) => (
              <button
                key={tab.key}
                type="button"
                aria-pressed={role === tab.key}
                className={cx(ROLE_TAB_BASE, role === tab.key && ROLE_TAB_ACTIVE)}
                onClick={() => selectRole(tab.key)}
              >
                <span className={ROLE_TAB_TITLE}>{tab.title}</span>
                <span className={ROLE_TAB_SUB}>{tab.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FARMER PANEL */}
        <div data-role-panel="farmer" hidden={role !== "farmer"}>
          <div className={ROW}>
            <Field
              id="f-first-name"
              name="first_name"
              label="First name"
              placeholder="John"
              required={role === "farmer"}
              autoComplete="given-name"
            />
            <Field
              id="f-last-name"
              name="last_name"
              label="Last name"
              placeholder="Doe"
              required={role === "farmer"}
              autoComplete="family-name"
            />
          </div>
          <Field id="f-other-name" name="other_name" label="Other name" placeholder="Optional" />
          <Field
            id="f-phone"
            name="phone"
            type="tel"
            label="WhatsApp phone number"
            placeholder="+2348..."
            required={role === "farmer"}
            autoComplete="tel"
          />
          <Field
            id="f-email"
            name="email"
            type="email"
            label="Email address"
            placeholder="you@example.com"
            hint="Used only for account recovery"
          />
          <Field
            id="f-password"
            name="password"
            type="password"
            label="Password"
            placeholder="Create a strong password"
            required={role === "farmer"}
            autoComplete="new-password"
            hint="Must be at least 6 characters"
          />
          <Field
            id="f-confirm-password"
            name="confirm_password"
            type="password"
            label="Confirm password"
            placeholder="Repeat your password"
            required={role === "farmer"}
            autoComplete="new-password"
          />
          <div className={GROUP}>
            <label className="flex cursor-pointer items-start gap-2.5 text-[13px] font-semibold tracking-[-0.01em] text-ink">
              <input type="checkbox" name="consent" className={CHECKBOX_INPUT} />
              <span>I accept the Farmer Informed Consent terms for data collection and verification.</span>
            </label>
          </div>
        </div>

        {/* DCO PANEL */}
        <div data-role-panel="dco" hidden={role !== "dco"}>
          <div className={ROW}>
            <Field
              id="dco-first-name"
              name="first_name"
              label="First name"
              placeholder="Ada"
              required={role === "dco"}
              autoComplete="given-name"
            />
            <Field
              id="dco-last-name"
              name="last_name"
              label="Last name"
              placeholder="Okafor"
              required={role === "dco"}
              autoComplete="family-name"
            />
          </div>
          <Field id="dco-other-name" name="other_name" label="Other name" placeholder="Optional" />
          <Field
            id="dco-email"
            name="email"
            type="email"
            label="Email address"
            placeholder="you@company.com"
            required={role === "dco"}
            autoComplete="email"
          />
          <Field
            id="dco-phone"
            name="phone"
            type="tel"
            label="WhatsApp phone number"
            placeholder="+2348..."
            required={role === "dco"}
            autoComplete="tel"
          />
          <Field
            id="dco-password"
            name="password"
            type="password"
            label="Password"
            placeholder="Create a strong password"
            required={role === "dco"}
            autoComplete="new-password"
            hint="Must be at least 6 characters"
          />
          <Field
            id="dco-confirm-password"
            name="confirm_password"
            type="password"
            label="Confirm password"
            placeholder="Repeat your password"
            required={role === "dco"}
            autoComplete="new-password"
          />
        </div>

        {/* ORGANIZATION PANEL */}
        <div
          data-role-panel="organization"
          hidden={role !== "organization"}
        >
          <Field
            id="org-org-name"
            name="org_name"
            label="Organization name"
            placeholder="Your company or cooperative"
            required={role === "organization"}
            autoComplete="organization"
          />
          <Field
            id="org-email"
            name="email"
            type="email"
            label="Work email address"
            placeholder="you@company.com"
            required={role === "organization"}
            autoComplete="email"
          />
          <Field id="org-phone" name="phone" type="tel" label="Phone number" placeholder="+2348..." />
          <Field
            id="org-password"
            name="password"
            type="password"
            label="Password"
            placeholder="Create a strong password"
            required={role === "organization"}
            autoComplete="new-password"
            hint="Must be at least 6 characters"
          />
          <Field
            id="org-confirm-password"
            name="confirm_password"
            type="password"
            label="Confirm password"
            placeholder="Repeat your password"
            required={role === "organization"}
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className={SUBMIT_BTN} disabled={busy}>
          {busy ? "Creating account..." : "Create account"}
        </button>

        <OrDivider />
        <GoogleButton
          label="Sign up with Google"
          href={`${GOOGLE_AUTH_PATH}?role=${role}`}
        />
      </form>

      <div className={FOOTER}>
        <p className={FOOTER_TEXT}>
          Already have an account?{" "}
          <Link href="/login" className={FOOTER_LINK}>
            Log in
          </Link>
        </p>
      </div>
    </>
  );
}
