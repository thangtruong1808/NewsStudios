import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Subcategory | NewsStudios Dashboard",
  description: "Edit an existing subcategory in the NewsStudios dashboard.",
  keywords: "dashboard, subcategory, edit, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Edit Subcategory | NewsStudios Dashboard",
    description: "Edit an existing subcategory in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function EditSubcategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 