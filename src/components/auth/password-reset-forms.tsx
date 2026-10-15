"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { errorMessage } from "@/lib/api";
import {
  AuthError,
  AuthHeader,
  FOOTER,
  FOOTER_LINK,
  FOOTER_TEXT,
  FORM,
  Field,
  HEADER_SUB,
  SUBMIT_BTN,
} from "./auth-form";

/** Same rule sign-up uses ("Must be at least 6 characters"). */
const MIN_PASSWORD = 6;

type ApiBody = { errors?: { message: string }[]; message?: string };

function BackToLogin() {
  return (
    <div className={FOOTER}>
      <p className={FOOTER_TEXT}>
        Remembered it?{" "}
        <Link href="/login" className={FOOTER_LINK}>
          Back to log in
        </Link>
      </p>
    </div>
  );
}

/* POSTs { identifier } to /api/auth/forgot-password (backend team implements). */
export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    setBusy(true);
    try {
      const identifier = form.querySelector<HTMLInputElement>("#identifier")?.value.trim() ?? "";
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as ApiBody;
        setError(errorMessage(data, "Could not send reset instructions. Please try again."));
        return;
      }
      setSent(true);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <>
        <AuthHeader title="Check your messages" sub="We've processed your request." />
        <p className={HEADER_SUB}>If an account exists for what you entered, we&apos;ve sent reset instructions.</p>
        <BackToLogin />
      </>
    );
  }

  return (
    <>
      <AuthHeader title="Forgot your password?" sub="Enter your details and we'll send you a reset link" />
      <form className={FORM} onSubmit={onSubmit}>
        {error ? <AuthError>{error}</AuthError> : null}
        <Field
          id="identifier"
          name="identifier"
          label="Email, phone or Platform ID"
          placeholder="you@company.com / +2348... / 1234567890"
          required
          autoComplete="username"
          onFirstInput={() => setError(null)}
        />
        <button type="submit" className={SUBMIT_BTN} disabled={busy}>
          {busy ? "Sending..." : "Send reset link"}
        </button>
      </form>
      <BackToLogin />
    </>
  );
}

/* Reads ?token= and POSTs { token, password } to /api/auth/reset-password (backend team implements). */
export function ResetPasswordForm() {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token"));
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    const password = form.querySelector<HTMLInputElement>("#password")?.value ?? "";
    const confirm = form.querySelector<HTMLInputElement>("#confirm-password")?.value ?? "";
    if (password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as ApiBody;
        setError(errorMessage(data, "Could not reset your password. Please try again."));
        return;
      }
      setDone(true);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (token === undefined) return null;

  if (!token) {
    return (
      <>
        <AuthHeader title="Link not valid" sub="This reset link is invalid or has expired" />
        <div className={FOOTER}>
          <p className={FOOTER_TEXT}>
            <Link href="/forgot-password" className={FOOTER_LINK}>
              Request a new reset link
            </Link>
          </p>
        </div>
      </>
    );
  }

  if (done) {
    return (
      <>
        <AuthHeader title="Your password has been reset" sub="You can now log in with your new password" />
        <Link href="/login" className={`${SUBMIT_BTN} flex items-center justify-center`}>
          Log in
        </Link>
      </>
    );
  }

  return (
    <>
      <AuthHeader title="Set a new password" sub="Choose a new password for your account" />
      <form className={FORM} onSubmit={onSubmit}>
        {error ? <AuthError>{error}</AuthError> : null}
        <Field
          id="password"
          name="password"
          type="password"
          label="New password"
          placeholder="Create a strong password"
          required
          autoComplete="new-password"
          hint="Must be at least 6 characters"
        />
        <Field
          id="confirm-password"
          name="confirm_password"
          type="password"
          label="Confirm password"
          placeholder="Repeat your password"
          required
          autoComplete="new-password"
        />
        <button type="submit" className={SUBMIT_BTN} disabled={busy}>
          {busy ? "Resetting..." : "Reset password"}
        </button>
      </form>
      <BackToLogin />
    </>
  );
}
