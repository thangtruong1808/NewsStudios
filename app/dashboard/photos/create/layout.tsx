import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Photo | NewsStudios Dashboard",
  description: "Create a new photo in the NewsStudios dashboard.",
  keywords: "dashboard, create photo, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Create Photo | NewsStudios Dashboard",
    description: "Create a new photo in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function CreatePhotoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 