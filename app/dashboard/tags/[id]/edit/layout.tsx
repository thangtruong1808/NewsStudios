import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Tag | NewsStudios Dashboard",
  description: "Edit an existing tag in the NewsStudios dashboard.",
  keywords: "dashboard, tag, edit, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Edit Tag | NewsStudios Dashboard",
    description: "Edit an existing tag in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function EditTagLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 