import { Advertisement } from "@/app/lib/definition";
import { format } from "date-fns";
import Link from "next/link";

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
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      onDelete(advertisement.id);
    }
  };

  return (
    <tr className="bg-white border-b hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {index + 1}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {advertisement.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {advertisement.sponsor_name ||
          `Sponsor ID: ${advertisement.sponsor_id}`}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {advertisement.ad_type}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {advertisement.article_title ||
          `Article ID: ${advertisement.article_id}`}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {advertisement.category_name ||
          `Category ID: ${advertisement.category_id}`}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {format(new Date(advertisement.start_date), "MMM d, yyyy")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {format(new Date(advertisement.end_date), "MMM d, yyyy")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {advertisement.ad_content}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link
          href={`/dashboard/advertisements/${advertisement.id}/edit`}
          className="rounded border border-blue-500 px-3 py-1 text-blue-500 hover:bg-blue-100"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="rounded border border-red-500 px-3 py-1 text-red-500 hover:bg-red-100"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
