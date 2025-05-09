"use client";

import { signOut } from "next-auth/react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface SignOutButtonProps {
  isCollapsed?: boolean;
}

export default function SignOutButton({ isCollapsed }: SignOutButtonProps) {
  return (
    <button
      onClick={() => signOut()}
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
