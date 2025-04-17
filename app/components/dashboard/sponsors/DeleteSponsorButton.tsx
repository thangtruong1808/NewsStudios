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
  const handleDelete = () => {
    // Directly call the onDelete function which will handle the confirmation
    onDelete(id, name);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-md border border-red-500 px-3 py-1 text-red-500 hover:bg-red-50 disabled:opacity-50"
    >
      Delete
    </button>
  );
}
