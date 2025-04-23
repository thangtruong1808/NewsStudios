"use client";

import { PowerIcon } from "@heroicons/react/24/outline";
import { signOutAction } from "@/app/actions/auth";
import clsx from "clsx";

interface SignOutButtonProps {
  isMobile?: boolean;
}

export default function SignOutButton({
  isMobile = false,
}: SignOutButtonProps) {
  return (
    <div className="group relative w-full px-2">
      <form action={signOutAction} className="w-full">
        <button
          className={clsx(
            "flex h-12 w-full items-center justify-center text-sm font-medium md:h-10 md:w-full md:flex-none md:justify-start",
            {
              "text-gray-600 hover:bg-zinc-200 rounded-md": true,
            }
          )}
        >
          <div className="flex items-center justify-center md:justify-start w-full px-3">
            <PowerIcon className="h-7 w-7 md:h-6 md:w-6" />
            <span className="hidden md:ml-3 md:block text-sm"> Sign Out</span>
          </div>
        </button>
      </form>
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:hidden">
        Sign Out
      </div>
    </div>
  );
}
