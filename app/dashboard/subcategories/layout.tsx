import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Subcategories | NewsStudios",
  description: "Manage and view all subcategories in the NewsStudios dashboard.",
  keywords: "dashboard, subcategories, management, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Dashboard Subcategories | NewsStudios",
    description: "Manage and view all subcategories in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function DashboardSubcategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 