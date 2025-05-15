"use client";

import MyLogo from "./MyLogo";
import NavLinks from "./NavLinks";
import SignOutButton from "./SignOutButton";
import {
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect, useCallback, useMemo } from "react";
import clsx from "clsx";
import { useUser } from "../../context/UserContext";
import Image from "next/image";
import { usePathname } from "next/navigation";

/**
 * SideNav Component Props
 * @param onCollapse - Callback function to notify parent of collapse state changes
 */
interface SideNavProps {
  onCollapse: (collapsed: boolean) => void;
}

/**
 * SideNav Component
 * Responsive sidebar navigation with collapsible functionality
 * Features user profile, navigation links, and sign out button
 */
export default function SideNav({ onCollapse }: SideNavProps) {
  // State management for sidebar collapse and user data
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, isLoading } = useUser();
  const pathname = usePathname();

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

  // Memoize user display name to prevent unnecessary recalculations
  const userDisplayName = useMemo(() => {
    if (!user) return "";
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    }
    return user.email || "";
  }, [user?.firstname, user?.lastname, user?.email]);

  // Memoize user role to prevent unnecessary recalculations
  const userRole = useMemo(() => {
    return user?.role || "";
  }, [user?.role]);

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
          {/* User avatar with gradient background and fallback icon */}
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center shadow-md ring-2 ring-white/50 overflow-hidden">
            {!isLoading && user?.user_image ? (
              <Image
                src={user.user_image}
                alt={userDisplayName}
                width={64}
                height={64}
                className="h-full w-full object-cover"
                priority
              />
            ) : (
              <UserCircleIcon className="h-10 w-10 text-white" />
            )}
          </div>
          {/* User name and role display (hidden when collapsed) */}
          {!isCollapsed && !isLoading && user && (
            <div className="text-center">
              <p className="text-sm font-medium text-blue-600">
                {userDisplayName}
              </p>
              <p className="text-xs text-blue-400 capitalize mt-1">
                {userRole}
              </p>
            </div>
          )}
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
