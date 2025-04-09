"use client";

import { Category } from "../../../type/definitions";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface TableRowProps {
  category: Category;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TableRow({
  category,
  index,
  onEdit,
  onDelete,
}: TableRowProps) {
  return (
    <tr
      key={category.id}
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      } border-b hover:bg-gray-100`}
    >
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        {category.id}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {category.name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {category.description || "No description"}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <div className="flex justify-end space-x-2">
          <button
            onClick={onEdit}
            className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
