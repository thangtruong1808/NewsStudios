import { TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

interface DeleteSponsorButtonProps {
  id: number;
  name: string;
  onDelete: (id: number, name: string) => void;
  isDeleting: boolean;
}

export default function DeleteSponsorButton({
  id,
  name,
  onDelete,
  isDeleting,
}: DeleteSponsorButtonProps) {
  const handleDelete = async () => {
    const confirmed = await new Promise<boolean>((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col gap-2">
            <p>Are you sure you want to delete {name}?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
        }
      );
    });

    if (confirmed) {
      try {
        await onDelete(id, name);
      } catch (error) {
        console.error("Error deleting sponsor:", error);
        toast.error("Failed to delete sponsor");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`text-red-600 hover:text-red-800 ${
        isDeleting ? "opacity-50 cursor-not-allowed" : ""
      }`}
      aria-label={`Delete ${name}`}
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  );
}
