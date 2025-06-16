import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Tag | NewsStudios Dashboard",
  description: "Create a new tag in the NewsStudios dashboard.",
  keywords: "dashboard, tag, create, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Create Tag | NewsStudios Dashboard",
    description: "Create a new tag in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function CreateTagLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 