import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Article | NewsStudios Dashboard",
  description: "Create a new article in the NewsStudios dashboard.",
  keywords: "dashboard, create article, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Create Article | NewsStudios Dashboard",
    description: "Create a new article in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function CreateArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 