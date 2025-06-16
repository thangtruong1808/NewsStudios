import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Video | NewsStudios Dashboard",
  description: "Edit an existing video in the NewsStudios dashboard.",
  keywords: "dashboard, edit video, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Edit Video | NewsStudios Dashboard",
    description: "Edit an existing video in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function EditVideoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 