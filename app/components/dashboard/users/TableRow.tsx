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
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <p>{index + 1}</p>
        </div>
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
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onEdit(user)}
            className="rounded border border-blue-500 px-3 py-1 text-blue-500 hover:bg-blue-100"
          >
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
            className="rounded border border-red-500 px-3 py-1 text-red-500 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
