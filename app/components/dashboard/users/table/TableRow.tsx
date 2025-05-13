"use client";

import { User } from "../../../login/login-definitions";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface TableRowProps {
  user: User;
  index: number;
  onEdit: (user: User) => void;
  onDelete: (userData: {
    id: number;
    firstname: string;
    lastname: string;
  }) => void;
}

export default function TableRow({
  user,
  index,
  onEdit,
  onDelete,
}: TableRowProps) {
  return (
    <tr className="w-full border-b border-zinc-300 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:bg-zinc-100 transition-colors">
      <td className="py-3 px-2">
        <p className="text-left text-xs text-gray-500 sm:text-sm">
          {index + 1}
        </p>
      </td>
      <td className="whitespace-nowrap px-3 py-3">{user.firstname}</td>
      <td className="whitespace-nowrap px-3 py-3">{user.lastname}</td>
      <td className="whitespace-nowrap px-3 py-3">{user.description || "-"}</td>
      <td className="whitespace-nowrap px-3 py-3">{user.email}</td>
      <td className="whitespace-nowrap px-3 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
            user.role === "admin"
              ? "bg-purple-100 text-purple-700"
              : user.role === "editor"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {user.role}
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
            user.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.status}
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="text-xs text-gray-500 sm:text-sm">
          {user.created_at
            ? new Date(user.created_at).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "-"}
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <div className="text-xs text-gray-500 sm:text-sm">
          {user.updated_at
            ? new Date(user.updated_at).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "-"}
        </div>
      </td>
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onEdit(user)}
            className="inline-flex items-center gap-1 rounded border border-blue-500 px-2.5 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-100"
          >
            <PencilIcon className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            onClick={() =>
              onDelete({
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
              })
            }
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
