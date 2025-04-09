"use client";

import { useRouter } from "next/navigation";

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
        className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isLoading || isSubmitting}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading || isSubmitting
          ? "Processing..."
          : isEditMode
          ? "Update User"
          : "Create User"}
      </button>
    </div>
  );
}
