import type { Metadata } from "next";
import AuthShell from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/password-reset-forms";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your Agriksense password using your email, phone number or Platform ID.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      heading={
        <>
          Get back into
          <br />
          Agriksense
        </>
      }
      body="Enter the email, phone number or Platform ID on your account and we'll send you a link to set a new password."
      features={["Real-time field telemetry", "AgriScore credit infrastructure", "Multi-channel farmer access"]}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
