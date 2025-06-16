import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create User | NewsStudios Dashboard",
  description: "Create a new user in the NewsStudios dashboard.",
  keywords: "dashboard, create user, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Create User | NewsStudios Dashboard",
    description: "Create a new user in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function CreateUserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 