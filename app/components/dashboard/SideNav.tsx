"use client";

import NavLinks from "./NavLinks";
import SignOutButton from "./SignOutButton";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import Image from "next/image";
import { useSession } from "next-auth/react";

/**
 * SideNav Component Props
 * @param onCollapse - Callback function to notify parent of collapse state changes
 */
/* eslint-disable no-unused-vars */
interface SideNavProps {
  onCollapse: (collapsed: boolean) => void;
}
/* eslint-enable no-unused-vars */

/**
 * SideNav Component
 * Responsive sidebar navigation with collapsible functionality
 * Features user profile, navigation links, and sign out button
 */
// Component Info
// Description: Responsive dashboard side navigation with collapse toggles and user summary with avatar initials fallback.
// Date created: 2025-01-27
// Author: thangtruong
export default function SideNav({ onCollapse }: SideNavProps) {
  const { data: session } = useSession({ required: true });
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Handle window resize for responsive behavior
  const handleResize = useCallback(() => {
    const shouldCollapse = window.innerWidth < 1024;
    setIsCollapsed(shouldCollapse);
    onCollapse(shouldCollapse);
  }, [onCollapse]);

  // Set up resize listener for responsive behavior
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Toggle sidebar collapse state
  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapse(newState);
  };


  return (
    <div
      className={clsx(
        "flex h-full flex-col bg-gray-50 shadow-lg transition-all duration-300 relative",
        isCollapsed ? "w-36" : "w-72"
      )}
    >
      {/* Collapse toggle button with hover effects */}
      <button
        onClick={handleToggle}
        className="absolute -right-3 top-6 bg-white rounded-full p-1.5 shadow-lg border border-blue-200 hover:bg-blue-50 transition-all duration-200 z-10 hidden lg:block hover:scale-105"
      >
        {isCollapsed ? (
          <ChevronRightIcon className="h-4 w-4 text-blue-600" />
        ) : (
          <ChevronLeftIcon className="h-4 w-4 text-blue-600" />
        )}
      </button>

      {/* User profile section with avatar and user info */}
      <div className="flex-none p-4 border-b border-blue-100 bg-gray-50 backdrop-blur-sm">
        <div
          className={clsx(
            "flex flex-col items-center space-y-3",
            isCollapsed && "justify-center"
          )}
        >
          <div className="flex flex-col items-center gap-2">
            {/* User avatar with gradient background and initials fallback */}
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center shadow-md ring-2 ring-white/50 overflow-hidden">
              {session?.user?.user_image && typeof session.user.user_image === "string" && session.user.user_image.trim() !== "" ? (
                <Image
                  src={session.user.user_image}
                  alt={session.user.firstname || ""}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  priority
                />
              ) : (
                <span className="text-lg font-semibold text-white">
                  {session?.user?.firstname && session?.user?.lastname
                    ? `${session.user.firstname.charAt(0).toUpperCase()}${session.user.lastname.charAt(0).toUpperCase()}`
                    : session?.user?.firstname
                    ? session.user.firstname.charAt(0).toUpperCase()
                    : session?.user?.lastname
                    ? session.user.lastname.charAt(0).toUpperCase()
                    : "U"}
                </span>
              )}
            </div>
            {/* User name and role display (always visible) */}
            {session?.user && (
              <div className="text-center">
                <p className="text-sm font-medium text-blue-600">
                  {session.user.firstname} {session.user.lastname}
                </p>
                <p className="text-sm text-blue-400 capitalize mt-1 text-uppercase">
                  {session.user.role}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation links section with scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50 backdrop-blur-sm">
        <div className={clsx("py-4", isCollapsed ? "px-2" : "px-3")}>
          <NavLinks isCollapsed={isCollapsed} />
        </div>
      </div>

      {/* Sign out button section at the bottom */}
      <div className="flex-none border-t border-blue-100 bg-gray-50 backdrop-blur-sm">
        <div className={clsx("p-4", isCollapsed ? "px-2" : "px-3")}>
          <SignOutButton isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
  );
}
