import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Authors | NewsStudios",
  description: "Manage and view all authors in the NewsStudios dashboard.",
  keywords: "dashboard, authors, management, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Dashboard Authors | NewsStudios",
    description: "Manage and view all authors in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function DashboardAuthorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 