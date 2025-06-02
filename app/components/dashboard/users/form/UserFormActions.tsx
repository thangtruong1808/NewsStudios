"use client";

/**
 * Props interface for UserFormActions component
 */
interface UserFormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
  isSubmitDisabled: boolean;
  onCancel: () => void;
}

/**
 * UserFormActions Component
 * Renders the form action buttons (Cancel and Submit)
 * with appropriate styling and states
 */
export default function UserFormActions({
  isSubmitting,
  isEditMode,
  isSubmitDisabled,
  onCancel,
}: UserFormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
      <button
        type="button"
        onClick={onCancel}
        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-400 border border-transparent rounded-md shadow-sm hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting
          ? "Saving..."
          : isEditMode
          ? "Update User"
          : "Create User"}
      </button>
    </div>
  );
}
