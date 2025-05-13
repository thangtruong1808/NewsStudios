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
        onClick={() => window.history.back()}
        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        disabled={isLoading || isSubmitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading || isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            <span>Saving...</span>
          </div>
        ) : isEditMode ? (
          "Update User"
        ) : (
          "Create User"
        )}
      </button>
    </div>
  );
}
