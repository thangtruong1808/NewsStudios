"use client";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { signOutAction } from "@/app/actions/auth";

interface SignOutButtonProps {
  isCollapsed?: boolean;
}

export default function SignOutButton({ isCollapsed }: SignOutButtonProps) {
  return (
    <button
      onClick={() => signOutAction()}
      className={clsx(
        "flex w-full items-center rounded-lg px-3 py-3 text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-fuchsia-500/10",
        isCollapsed ? "flex-col space-y-1 justify-center" : "justify-start"
      )}
    >
      <ArrowRightOnRectangleIcon
        className={clsx(
          "transition-colors duration-200",
          isCollapsed ? "h-7 w-7" : "h-5 w-5"
        )}
      />
      <span
        className={clsx(
          "relative",
          isCollapsed ? "text-xs text-center w-full truncate px-1" : "ml-3"
        )}
      >
        Sign Out
      </span>
    </button>
  );
}
