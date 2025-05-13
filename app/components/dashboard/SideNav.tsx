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

interface SideNavProps {
  onCollapse: (collapsed: boolean) => void;
}

export default function SideNav({ onCollapse }: SideNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, isLoading } = useUser();
  const pathname = usePathname();

  // Handle window resize
  const handleResize = useCallback(() => {
    const shouldCollapse = window.innerWidth < 1024;
    setIsCollapsed(shouldCollapse);
    onCollapse(shouldCollapse);
  }, [onCollapse]);

  // Set up resize listener
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

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
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="absolute -right-3 top-6 bg-white rounded-full p-1.5 shadow-lg border border-zinc-200 hover:bg-zinc-100 transition-all duration-200 z-10 hidden lg:block hover:scale-105"
      >
        {isCollapsed ? (
          <ChevronRightIcon className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
        )}
      </button>

      {/* User Profile Section */}
      <div className="flex-none p-4 border-b border-violet-100 bg-gray-50 backdrop-blur-sm">
        <div
          className={clsx(
            "flex flex-col items-center space-y-3",
            isCollapsed && "justify-center"
          )}
        >
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-md ring-2 ring-white/50 overflow-hidden">
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
          {!isCollapsed && !isLoading && user && (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                {userDisplayName}
              </p>
              <p className="text-xs text-gray-500 capitalize mt-1">
                {userRole}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50 backdrop-blur-sm">
        <div className={clsx("py-4", isCollapsed ? "px-2" : "px-3")}>
          <NavLinks isCollapsed={isCollapsed} />
        </div>
      </div>

      {/* Sign Out Button at the bottom */}
      <div className="flex-none border-t border-violet-100 bg-gray-50 backdrop-blur-sm">
        <div className={clsx("p-4", isCollapsed ? "px-2" : "px-3")}>
          <SignOutButton isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
  );
}
