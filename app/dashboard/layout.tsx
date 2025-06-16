// "use client";

import SideNav from "../components/dashboard/SideNav";
import { Toaster } from "react-hot-toast";
import { redirect } from "next/navigation";
import clsx from "clsx";
import MyLogo from "../components/dashboard/MyLogo";
import Logo from "../components/front-end/shared/Logo";
import { fontClasses } from "../components/fonts";
import { getAuthSession } from "../lib/auth";
import DashboardClient from "@/app/components/dashboard/DashboardClient";

// Remove experimental_ppr flag as it might be causing issues
// export const experimental_ppr = true;

// Use revalidate instead of force-dynamic for better performance
// export const revalidate = 0;
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: 'NewsStudios CMS | Dashboard - Content Management System',
  description: 'Manage your content, articles, and media with NewsStudios CMS. Track analytics, manage users, and control your content platform.',
  keywords: 'CMS, content management, dashboard, analytics, media management',
  authors: [{
    name: 'Thang Truong',
    email: 'thangtruong1808@gmail.com'
  }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'noindex, nofollow'
};

export default async function LayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header section with logo and title */}
      <div className="flex flex-col lg:flex-row bg-gray-50 border-b border-gray-200">
        {/* Logo container with dynamic width based on sidebar state */}
        <div
          className={clsx(
            "transition-all duration-300 ease-in-out border-r border-gray-50 h-[88px] lg:h-auto",
            "w-72",
            fontClasses.robotoMono
          )}
        >
          <div className="p-4 text-blue-500">
            <Logo />
          </div>
        </div>

        {/* Title section with blue text color */}
        <div
          className={clsx(
            "flex-1 flex items-center justify-center py-4 lg:py-0",
            fontClasses.robotoMono
          )}
        >
          <h1 className="text-2xl font-bold">
            NewsStudios Content Management System
          </h1>
        </div>
      </div>

      {/* Main content area with sidebar and content */}
      <DashboardClient session={session}>{children}</DashboardClient>

      {/* Toast notifications configuration */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}
