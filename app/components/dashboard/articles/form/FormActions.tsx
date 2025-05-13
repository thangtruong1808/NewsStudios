import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export default function FormActions({
  isSubmitting,
  onCancel,
}: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
      >
        <XMarkIcon className="h-4 w-4" />
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-1 rounded-md border border-transparent bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 disabled:opacity-50"
      >
        {isSubmitting ? (
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
