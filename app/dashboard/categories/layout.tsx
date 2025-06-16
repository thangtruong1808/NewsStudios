import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Categories | NewsStudios",
  description: "Manage and view all categories in the NewsStudios dashboard.",
  keywords: "dashboard, categories, management, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Dashboard Categories | NewsStudios",
    description: "Manage and view all categories in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function DashboardCategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 