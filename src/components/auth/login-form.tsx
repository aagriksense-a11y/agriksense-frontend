"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { errorMessage, storeSession, type AuthTokens, type SessionUser } from "@/lib/api";
import {
  AuthError,
  AuthHeader,
  CHECKBOX_INPUT,
  CHECKBOX_LABEL,
  FOOTER,
  FOOTER_LINK,
  FOOTER_TEXT,
  FORM,
  FORM_OPTIONS,
  Field,
  GOOGLE_AUTH_PATH,
  GoogleButton,
  GREEN_LINK,
  OrDivider,
  SUBMIT_BTN,
} from "./auth-form";

/** Same payload the login endpoint returns on success: `{ data: { …user, tokens } }`. */
type AuthResponse = SessionUser & AuthTokens;

/*
 * Port of the login.ejs form + js/auth.js submitLogin():
 * POSTs { identifier, password } to /api/auth/login, shows the API error via
 * .auth-error, stores the session and navigates to /dashboard (the dashboard
 * shell's role guard then routes the user to their role home).
 */
export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    setBusy(true);
    try {
      const identifier = form.querySelector<HTMLInputElement>("#identifier")?.value.trim() ?? "";
      const password = form.querySelector<HTMLInputElement>("#password")?.value ?? "";
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = (await res.json()) as {
        data?: AuthResponse;
        errors?: { message: string }[];
        message?: string;
      };
      if (!res.ok) {
        setError(errorMessage(data, "Login failed. Please try again."));
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
      <AuthHeader title="Log in to your account" sub="Enter your credentials to access your workspace" />

      <form className={FORM} onSubmit={onSubmit}>
        {error ? <AuthError>{error}</AuthError> : null}

        <Field
          id="identifier"
          name="identifier"
          label="Email, phone, or Platform ID"
          placeholder="you@company.com / +2348... / 1234567890"
          required
          autoComplete="username"
          onFirstInput={() => setError(null)}
        />

        <Field
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          required
          autoComplete="current-password"
        />

        <div className={FORM_OPTIONS}>
          <label className={CHECKBOX_LABEL}>
            <input type="checkbox" name="remember" className={CHECKBOX_INPUT} />
            <span>Remember me</span>
          </label>
          <Link href="/forgot-password" className={GREEN_LINK}>
            Forgot password?
          </Link>
        </div>

        <button type="submit" className={SUBMIT_BTN} disabled={busy}>
          {busy ? "Logging in..." : "Log in"}
        </button>

        <OrDivider />
        <GoogleButton label="Continue with Google" href={GOOGLE_AUTH_PATH} />
      </form>

      <div className={FOOTER}>
        <p className={FOOTER_TEXT}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className={FOOTER_LINK}>
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}
