import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Tags | NewsStudios",
  description: "Manage and view all tags in the NewsStudios dashboard.",
  keywords: "dashboard, tags, management, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Dashboard Tags | NewsStudios",
    description: "Manage and view all tags in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function DashboardTagsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 