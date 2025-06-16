import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Users | NewsStudios",
  description: "Manage and view all users in the NewsStudios dashboard.",
  keywords: "dashboard, users, management, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Dashboard Users | NewsStudios",
    description: "Manage and view all users in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function DashboardUsersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 