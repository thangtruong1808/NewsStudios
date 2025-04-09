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
    <tr className="w-full border-b border-zinc-300 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:bg-zinc-100 transition-colors">
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <p className="text-xs font-medium text-gray-900 sm:text-sm">
            {index + 1}
          </p>
        </div>
      </td>
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <p className="text-xs font-medium text-gray-900 sm:text-sm">
            {category.id}
          </p>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <p className="text-xs font-medium text-gray-900 sm:text-sm">
          {category.name}
        </p>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <p className="text-xs text-gray-500 sm:text-sm">
          {category.description || "-"}
        </p>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <p className="text-xs text-gray-500 sm:text-sm">
          {new Date(category.created_at).toLocaleDateString()}
        </p>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <p className="text-xs text-gray-500 sm:text-sm">
          {new Date(category.updated_at).toLocaleDateString()}
        </p>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="flex justify-around">
          <button
            onClick={onEdit}
            className="rounded border border-blue-500 px-3 py-1 text-blue-500 hover:bg-blue-100"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="rounded border border-red-500 px-3 py-1 text-red-500 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
