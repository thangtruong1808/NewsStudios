import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Photos | NewsStudios",
  description: "Manage and view all photos in the NewsStudios dashboard.",
  keywords: "dashboard, photos, management, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Dashboard Photos | NewsStudios",
    description: "Manage and view all photos in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function DashboardPhotosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 