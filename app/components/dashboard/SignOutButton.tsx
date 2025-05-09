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
        "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors",
        isCollapsed && "justify-center"
      )}
    >
      <ArrowRightOnRectangleIcon className="h-5 w-5" />
      {!isCollapsed && <span className="ml-3">Sign Out</span>}
    </button>
  );
}
