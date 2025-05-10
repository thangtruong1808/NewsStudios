import { Advertisement } from "@/app/lib/definition";
import { format } from "date-fns";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

interface TableRowProps {
  advertisement: Advertisement;
  onDelete: (id: number) => void;
  index: number;
}

export default function TableRow({
  advertisement,
  onDelete,
  index,
}: TableRowProps) {
  const handleDelete = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium">Delete Advertisement</p>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this advertisement? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium"
              onClick={() => {
                toast.dismiss(t.id);
                onDelete(advertisement.id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
      }
    );
  };

  return (
    <tr className="bg-white border-b hover:bg-gray-50">
      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 w-12">
        {index + 1}
      </td>
      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 w-48">
        {advertisement.sponsor_name ||
          `Sponsor ID: ${advertisement.sponsor_id}`}
      </td>
      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 w-32">
        {advertisement.ad_type}
      </td>
      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 w-32">
        {advertisement.article_id || "N/A"}
      </td>
      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 w-32">
        {advertisement.category_name ||
          `Category ID: ${advertisement.category_id}`}
      </td>
      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 w-48">
        {advertisement.ad_content}
      </td>
      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 w-32">
        {format(new Date(advertisement.start_date), "dd/MM/yyyy")}
      </td>
      <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 w-32">
        {format(new Date(advertisement.end_date), "dd/MM/yyyy")}
      </td>
      <td className="px-2 py-2 whitespace-nowrap text-right text-sm font-medium w-32">
        <div className="flex justify-center gap-4">
          <Link
            href={`/dashboard/advertisements/${advertisement.id}/edit`}
            className="inline-flex items-center gap-1 rounded border border-blue-500 px-2.5 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-100"
          >
            <PencilIcon className="h-3.5 w-3.5" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1 rounded border border-red-500 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-100"
          >
            <TrashIcon className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
