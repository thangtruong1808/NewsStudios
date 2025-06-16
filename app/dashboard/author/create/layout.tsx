import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Author | NewsStudios Dashboard",
  description: "Create a new author in the NewsStudios dashboard.",
  keywords: "dashboard, author, create, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Create Author | NewsStudios Dashboard",
    description: "Create a new author in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function CreateAuthorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 