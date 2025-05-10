"use client";

import { useRouter } from "next/navigation";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

interface UserFormActionsProps {
  isLoading: boolean;
  isSubmitting: boolean;
  isEditMode: boolean;
}

export default function UserFormActions({
  isLoading,
  isSubmitting,
  isEditMode,
}: UserFormActionsProps) {
  const router = useRouter();

  return (
    <div className="flex justify-end gap-4">
      <button
        type="button"
        onClick={() => router.push("/dashboard/users")}
        className="inline-flex justify-center items-center gap-1 rounded-md border border-zinc-300 bg-zinc-200 py-2 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
      >
        <XMarkIcon className="h-4 w-4" />
        Cancel
      </button>
      <button
        type="submit"
        disabled={isLoading || isSubmitting}
        className="inline-flex justify-center items-center gap-1 rounded-md border border-transparent bg-zinc-200 py-2 px-4 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading || isSubmitting ? (
          "Processing..."
        ) : (
          <>
            <CheckIcon className="h-4 w-4" />
            Submit
          </>
        )}
      </button>
    </div>
  );
}
