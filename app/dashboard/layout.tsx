"use client";

import SideNav from "../components/dashboard/SideNav";
import { Toaster } from "react-hot-toast";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import MyLogo from "../components/dashboard/MyLogo";
import { NewspaperIcon } from "@heroicons/react/24/outline";

// Remove experimental_ppr flag as it might be causing issues
// export const experimental_ppr = true;

// Use revalidate instead of force-dynamic for better performance
// export const revalidate = 0;
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSideNavCollapsed, setIsSideNavCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header with Logo */}
      <div className="flex items-center justify-center p-2 space-x-4 bg-zinc-200">
        <MyLogo />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Content Management System
        </h1>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation */}
        <aside
          className={clsx(
            "transition-all duration-300 ease-in-out border-r border-gray-100",
            isSideNavCollapsed ? "w-20" : "w-64"
          )}
        >
          <SideNav onCollapse={setIsSideNavCollapsed} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">{children}</div>
        </main>
      </div>

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
