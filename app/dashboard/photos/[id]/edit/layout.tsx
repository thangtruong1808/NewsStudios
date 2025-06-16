import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Photo | NewsStudios Dashboard",
  description: "Edit an existing photo in the NewsStudios dashboard.",
  keywords: "dashboard, edit photo, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Edit Photo | NewsStudios Dashboard",
    description: "Edit an existing photo in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function EditPhotoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 