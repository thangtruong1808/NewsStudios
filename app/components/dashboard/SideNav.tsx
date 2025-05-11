"use client";

import MyLogo from "./MyLogo";
import NavLinks from "./NavLinks";
import SignOutButton from "./SignOutButton";
import {
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import clsx from "clsx";

interface SideNavProps {
  onCollapse: (collapsed: boolean) => void;
}

export default function SideNav({ onCollapse }: SideNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapse(newState);
  };

  return (
    <div
      className={clsx(
        "flex h-full flex-col bg-gradient-to-br from-white via-gray-50 to-gray-100/80 shadow-sm transition-all duration-300 relative",
        isCollapsed ? "w-32" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="absolute -right-3 top-6 bg-white rounded-full p-1.5 shadow-md border border-gray-100 hover:bg-gray-50 transition-colors z-10"
      >
        {isCollapsed ? (
          <ChevronRightIcon className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
        )}
      </button>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div
          className={clsx(
            "flex items-center space-x-3",
            isCollapsed && "justify-center"
          )}
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-sm">
            <UserCircleIcon className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white/50 via-gray-50/30 to-gray-100/30">
        <div className={clsx("py-4", isCollapsed ? "px-2" : "px-3")}>
          <NavLinks isCollapsed={isCollapsed} />
        </div>
      </div>

      {/* Sign Out Section */}
      <div className="border-t border-gray-100 p-4 bg-white/90 backdrop-blur-sm">
        <SignOutButton isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}
