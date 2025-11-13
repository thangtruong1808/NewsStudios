import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

// Component Info
// Description: Route layout providing page-level background and spacing for login screens.
// Data created: Outer wrappers that frame login content within a centered viewport.
// Author: thangtruong

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-12 sm:px-10 lg:px-12 xl:px-16">
        {children}
      </div>
    </div>
  );
}
