"use client";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
// import { signOutAction } from "@/app/actions/auth";

import { signOut } from "next-auth/react";

// Props interface for the SignOutButton component
interface SignOutButtonProps {
  isCollapsed?: boolean; // Controls whether the button is in collapsed state
}

export default function SignOutButton({ isCollapsed }: SignOutButtonProps) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })} // Handles user sign out action
      className={clsx(
        // Base button styles with hover effects
        "flex w-full items-center rounded-lg px-3 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-blue-400/10",
        // Conditional layout based on collapse state
        isCollapsed ? "flex-col space-y-1 justify-center" : "justify-start"
      )}
    >
      {/* Sign out icon with responsive sizing */}
      <ArrowRightOnRectangleIcon
        className={clsx(
          "transition-colors duration-200",
          isCollapsed ? "h-7 w-7" : "h-5 w-5" // Larger icon in collapsed state
        )}
      />
      {/* Sign out text with responsive layout */}
      <span
        className={clsx(
          "relative",
          isCollapsed ? "text-xs text-center w-full truncate px-1" : "ml-3" // Centered text in collapsed state
        )}
      >
        Sign Out
      </span>
    </button>
  );
}
