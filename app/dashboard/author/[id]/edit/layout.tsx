import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Author | NewsStudios Dashboard",
  description: "Edit an existing author in the NewsStudios dashboard.",
  keywords: "dashboard, author, edit, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Edit Author | NewsStudios Dashboard",
    description: "Edit an existing author in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function EditAuthorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 