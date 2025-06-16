import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit User | NewsStudios Dashboard",
  description: "Edit an existing user in the NewsStudios dashboard.",
  keywords: "dashboard, edit user, NewsStudios",
  authors: [{ name: "Thang Truong" }],
  openGraph: {
    title: "Edit User | NewsStudios Dashboard",
    description: "Edit an existing user in the NewsStudios dashboard.",
    type: "website",
    locale: "en_US",
    siteName: "NewsStudios",
  }
};

export default function EditUserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 