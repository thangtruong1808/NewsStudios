import type { Metadata } from "next";
import SignUpPageClient from "./SignUpPageClient";

export const metadata: Metadata = {
  title: "Sign Up | NewsStudios",
  description: "Create a NewsStudios account to join the newsroom platform.",
};

// Component Info
// Description: Next.js page entry rendering the client-side sign-up experience.
// Data created: None directly; delegates UI rendering to SignUpPageClient.
// Author: thangtruong

export default function SignUpPage() {
  return (
    <main className="min-h-screen">
      {/* Sign-up experience */}
      <SignUpPageClient />
    </main>
  );
}
