"use client";

import Link from "next/link";
import { ComponentType } from "react";
import clsx from "clsx";

interface NavLinkProps {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
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
        "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
        {
          "text-violet-600": isActive,
          "text-gray-600 hover:text-violet-600": !isActive,
          "justify-center": isCollapsed,
          "flex-col space-y-1": isCollapsed,
          "w-full": isCollapsed,
        }
      )}
    >
      <Icon
        className={clsx("transition-colors duration-200", {
          "text-violet-600": isActive,
          "text-gray-400 group-hover:text-violet-600": !isActive,
          "mr-3": !isCollapsed,
          "h-5 w-5": !isCollapsed,
          "h-7 w-7": isCollapsed,
        })}
      />
      <span
        className={clsx("relative text-xs", {
          hidden: !isCollapsed,
          "w-full text-center truncate px-1": isCollapsed,
        })}
      >
        {label}
        {isActive && (
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
        )}
      </span>
      {!isCollapsed && (
        <span className="relative">
          {label}
          {isActive && (
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
          )}
        </span>
      )}
    </Link>
  );
}
