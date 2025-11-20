"use client";

// Component Info
// Description: Form action buttons with save/cancel functionality and loading state indicator.
// Date updated: 2025-November-21
// Author: thangtruong

import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  isEditMode: boolean;
  isFormEmpty: boolean;
}

export default function FormActions({
  isSubmitting,
  onCancel,
  isEditMode,
  isFormEmpty,
}: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
      {/* Cancel button */}
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      {/* Submit button with saving state indicator */}
      <button
        type="submit"
        disabled={isSubmitting || (!isEditMode && isFormEmpty)}
        className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <ArrowPathIcon className="h-4 w-4 animate-spin" />
            <span>Saving...</span>
          </>
        ) : isEditMode ? (
          "Update Article"
        ) : (
          "Create Article"
        )}
      </button>
    </div>
  );
}
