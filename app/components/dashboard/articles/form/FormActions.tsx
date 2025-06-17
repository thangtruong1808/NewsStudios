"use client";

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
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting || (!isEditMode && isFormEmpty)}
        className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting
          ? "Saving..."
          : isEditMode
            ? "Update Article"
            : "Create Article"}
      </button>
    </div>
  );
}
