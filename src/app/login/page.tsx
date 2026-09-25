import type { Metadata } from "next";
import AuthShell from "@/components/auth/auth-shell";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Access your Agriksense account. Agricultural intelligence for operations and finance.",
};

export default function LoginPage() {
  return (
    <AuthShell
      heading={
        <>
          Welcome back to
          <br />
          Agriksense
        </>
      }
      body="Access your agricultural intelligence workspace. Monitor fields, track AgriScores, and coordinate operations in real time."
      features={[
        "Real-time field telemetry",
        "AgriScore credit infrastructure",
        "Multi-channel farmer access",
      ]}
    >
      <LoginForm />
    </AuthShell>
  );
}
