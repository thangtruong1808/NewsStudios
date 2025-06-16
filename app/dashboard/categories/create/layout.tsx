import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Category | NewsStudios Dashboard",
  description: "Create a new category in the NewsStudios dashboard.",
  keywords: "dashboard, category, create, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Create Category | NewsStudios Dashboard",
    description: "Create a new category in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function CreateCategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 