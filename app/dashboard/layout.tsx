"use client";

import SideNav from "../components/dashboard/SideNav";
import { Toaster } from "react-hot-toast";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx";
import MyLogo from "../components/dashboard/MyLogo";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { fontClasses } from "../components/fonts";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when screen size changes to sm or larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with Logo */}
      <div className="flex flex-col lg:flex-row bg-gray-50 border-b border-gray-200">
        {/* Logo div - matches sidebar width */}
        <div
          className={clsx(
            "transition-all duration-300 ease-in-out border-r border-gray-50 h-[88px] lg:h-auto",
            isSideNavCollapsed ? "w-36" : "w-72",
            fontClasses.robotoMono
          )}
        >
          <div className="p-4">
            <MyLogo />
          </div>
        </div>

        {/* Title div - matches main content width */}
        <div
          className={clsx(
            "flex-1 flex items-center justify-center py-4 lg:py-0",
            fontClasses.robotoMono
          )}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            Content Management System
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed bottom-4 right-4 z-50 sm:hidden bg-violet-600 text-white p-3 rounded-full shadow-lg hover:bg-violet-700 transition-colors"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>

        {/* Side Navigation */}
        <aside
          className={clsx(
            "transition-all duration-300 ease-in-out border-r border-gray-100",
            "fixed sm:relative inset-y-0 left-0 z-40",
            "transform transition-transform duration-300",
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full sm:translate-x-0",
            isSideNavCollapsed ? "w-36" : "w-72",
            fontClasses.robotoMono
          )}
        >
          <SideNav onCollapse={setIsSideNavCollapsed} />
        </aside>

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main
          className={clsx(
            "flex-1 overflow-y-auto transition-all duration-300",
            fontClasses.poppins
          )}
        >
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
