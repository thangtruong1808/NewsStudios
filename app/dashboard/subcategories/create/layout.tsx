import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Subcategory | NewsStudios Dashboard",
  description: "Create a new subcategory in the NewsStudios dashboard.",
  keywords: "dashboard, subcategory, create, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Create Subcategory | NewsStudios Dashboard",
    description: "Create a new subcategory in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function CreateSubcategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 