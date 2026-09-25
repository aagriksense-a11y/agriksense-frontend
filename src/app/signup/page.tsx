import type { Metadata } from "next";
import AuthShell from "@/components/auth/auth-shell";
import SignupForm from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create your Agriksense account. Join the agricultural intelligence infrastructure for Africa.",
};

export default function SignupPage() {
  return (
    <AuthShell
      heading={
        <>
          Start your agricultural
          <br />
          intelligence journey
        </>
      }
      body="Join operators, cooperatives, and financial institutions building the future of precision agriculture across Sub-Saharan Africa."
      features={[
        "Verified farm identity & records",
        "0-1000 AgriScore credit index",
        "Field telemetry & aerial vision",
      ]}
      trust="Trusted by agricultural operations across Nigeria"
    >
      <SignupForm />
    </AuthShell>
  );
}
