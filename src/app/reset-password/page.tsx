import type { Metadata } from "next";
import AuthShell from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/password-reset-forms";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new password for your Agriksense account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthShell
      heading={
        <>
          Set a new
          <br />
          password
        </>
      }
      body="Choose a new password for your Agriksense account, then log in to get back to your workspace."
      features={["Real-time field telemetry", "AgriScore credit infrastructure", "Multi-channel farmer access"]}
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
