import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Video | NewsStudios Dashboard",
  description: "Create a new video in the NewsStudios dashboard.",
  keywords: "dashboard, create video, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Create Video | NewsStudios Dashboard",
    description: "Create a new video in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function CreateVideoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 