"use client";

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import clsx from "clsx";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import SideNav from "../components/dashboard/SideNav";
import { fontClasses } from "../components/fonts";

interface DashboardClientProps {
  children: React.ReactNode;
  session: Session;
}

export default function DashboardClient({
  children,
  session,
}: DashboardClientProps) {
  const [isSideNavCollapsed, setIsSideNavCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Responsive behavior: Close mobile menu on larger screens
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
    <div className="flex flex-1 overflow-hidden">
      {/* Mobile menu toggle button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed bottom-4 right-4 z-50 sm:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar navigation with responsive behavior */}
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

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content area with scrolling */}
      <main
        className={clsx(
          "flex-1 overflow-y-auto transition-all duration-300",
          fontClasses.poppins
        )}
      >
        <div className="px-6 py-4">{children}</div>
      </main>
    </div>
  );
}
