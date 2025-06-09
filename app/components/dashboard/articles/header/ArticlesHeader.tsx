"use client";

import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

/**
 * ArticlesHeader Component
 * Displays the header section of the articles management page with title, description,
 * and a create article button. The component is responsive and adapts its layout
 * based on screen size.
 */
export default function ArticlesHeader() {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto">
        <h1 className="text-2xl font-semibold text-blue-500">Articles List</h1>
        <p className="mt-2 text-sm ">
          A list of all articles in your account including their title, content,
          and status.
        </p>
      </div>
      {isAdmin && (
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => router.push("/dashboard/articles/create")}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-2 text-sm font-medium text-white transition-colors hover:from-blue-700 hover:to-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 justify-center items-center"
          >
            <PlusIcon className="h-5 mr-2" />
            <span>Create Article</span>
          </button>
        </div>
      )}
    </div>
  );
}
