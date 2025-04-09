"use client";

import { PowerIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import clsx from "clsx";

export default function SignOutLink() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Redirect to the sign-out route
      router.push("/api/auth/signout");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className={clsx(
        "flex h-12 w-full items-center justify-center rounded-lg p-2 text-sm font-medium md:h-10 md:w-full md:flex-none md:justify-start md:p-2 md:px-3",
        "text-gray-600 hover:bg-gray-100"
      )}
    >
      <PowerIcon className="h-8 w-8 md:h-5 md:w-5" />
      <span className="hidden md:ml-3 md:block">Sign Out</span>
    </button>
  );
}
