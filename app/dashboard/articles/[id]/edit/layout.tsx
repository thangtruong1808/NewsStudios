import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Article | NewsStudios Dashboard",
  description: "Edit an existing article in the NewsStudios dashboard.",
  keywords: "dashboard, edit article, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Edit Article | NewsStudios Dashboard",
    description: "Edit an existing article in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function EditArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 