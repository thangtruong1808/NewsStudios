import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Category | NewsStudios Dashboard",
  description: "Edit an existing category in the NewsStudios dashboard.",
  keywords: "dashboard, category, edit, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Edit Category | NewsStudios Dashboard",
    description: "Edit an existing category in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function EditCategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 