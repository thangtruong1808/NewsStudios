"use client";

import MyLogo from "./MyLogo";
import NavLinks from "./NavLinks";
import SignOutButton from "./SignOutButton";
import {
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { useUser } from "../../context/UserContext";
import Image from "next/image";

interface SideNavProps {
  onCollapse: (collapsed: boolean) => void;
}

export default function SideNav({ onCollapse }: SideNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useUser();

  // Log user context and user_image in SideNav
  useEffect(() => {
    console.log("SideNav - Current user context:", user);
    console.log("SideNav - User image URL:", user?.user_image);
    console.log("SideNav - Has user image:", !!user?.user_image);

    if (user?.user_image) {
      console.log("Rendering user image:", user.user_image);
    } else {
      console.log("No user image found, using default icon");
    }
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      const shouldCollapse = window.innerWidth < 1024;
      setIsCollapsed(shouldCollapse);
      onCollapse(shouldCollapse);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [onCollapse]);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapse(newState);
  };

  return (
    <div
      className={clsx(
        "flex h-full flex-col bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 shadow-lg transition-all duration-300 relative",
        isCollapsed ? "w-32" : "w-64"
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
      <div className="p-4 border-b border-violet-100 bg-gradient-to-br from-violet-50/90 via-purple-50/90 to-fuchsia-50/90 backdrop-blur-sm">
        <div
          className={clsx(
            "flex flex-col items-center space-y-3",
            isCollapsed && "justify-center"
          )}
        >
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-md ring-2 ring-white/50 overflow-hidden">
            {user?.user_image ? (
              <Image
                src={user.user_image}
                alt={`${user.firstname} ${user.lastname}`}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserCircleIcon className="h-10 w-10 text-white" />
            )}
          </div>
          {!isCollapsed && user && (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
              <p className="text-xs text-gray-500 capitalize mt-1">
                {user.role}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-violet-50/90 via-purple-50/90 to-fuchsia-50/90 backdrop-blur-sm">
        <div className={clsx("py-4", isCollapsed ? "px-2" : "px-3")}>
          <NavLinks isCollapsed={isCollapsed} />
        </div>
      </div>

      {/* Sign Out Section */}
      <div className="border-t border-violet-100 p-4 bg-gradient-to-br from-violet-50/90 via-purple-50/90 to-fuchsia-50/90 backdrop-blur-sm">
        <SignOutButton isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}
