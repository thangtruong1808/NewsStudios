"use client";

import Link from "next/link";
import { ComponentType } from "react";
import clsx from "clsx";
import { fontClasses } from "../fonts";

// Props interface for the NavLink component
interface NavLinkProps {
  href: string; // The URL the link points to
  icon: ComponentType<{ className?: string }>; // Icon component to display
  label: string; // Text label for the link
  isActive?: boolean; // Whether the link is currently active
  isCollapsed?: boolean; // Whether the navigation is in collapsed state
}

export default function NavLink({
  href,
  icon: Icon,
  label,
  isActive,
  isCollapsed,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        // Base link styles with active and hover states
        "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
        fontClasses.robotoMono,
        {
          "text-blue-600": isActive, // Active link color
          "text-gray-600 hover:text-blue-600": !isActive, // Default and hover colors
          "justify-center": isCollapsed, // Center alignment in collapsed state
          "flex-col space-y-1": isCollapsed, // Vertical layout in collapsed state
          "w-full": isCollapsed, // Full width in collapsed state
        }
      )}
    >
      {/* Icon with responsive sizing and color states */}
      <Icon
        className={clsx("transition-colors duration-200", {
          "text-blue-600": isActive, // Active icon color
          "text-gray-400 group-hover:text-blue-600": !isActive, // Default and hover colors
          "mr-3": !isCollapsed, // Right margin in expanded state
          "h-5 w-5": !isCollapsed, // Icon size in expanded state
          "h-7 w-7": isCollapsed, // Larger icon in collapsed state
        })}
      />
      {/* Label for collapsed state with active indicator */}
      <span
        className={clsx("relative text-xs", {
          hidden: !isCollapsed, // Hide in expanded state
          "w-full text-center truncate px-1": isCollapsed, // Styling for collapsed state
        })}
      >
        {label}
        {isActive && (
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
        )}
      </span>
      {/* Label for expanded state with active indicator */}
      {!isCollapsed && (
        <span className="relative">
          {label}
          {isActive && (
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
          )}
        </span>
      )}
    </Link>
  );
}
