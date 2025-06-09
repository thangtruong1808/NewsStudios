"use client";

interface FormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
  isFormEmpty: boolean;
  onCancel: () => void;
}

export function FormActions({
  isSubmitting,
  isEditMode,
  isFormEmpty,
  onCancel,
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-x-3">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting || isFormEmpty}
        className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
      >
        {isSubmitting
          ? "Saving..."
          : isEditMode
          ? "Update Photo"
          : "Create Photo"}
      </button>
    </div>
  );
}
