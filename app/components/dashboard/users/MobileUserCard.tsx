"use client";

import { User } from "../../../type/definitions";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface MobileUserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function MobileUserCard({
  user,
  onEdit,
  onDelete,
}: MobileUserCardProps) {
  return (
    <div className="mb-4 w-full rounded-md bg-white p-4 shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {user.firstname[0]}
              {user.lastname[0]}
            </span>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-900">
              {user.firstname} {user.lastname}
            </h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(user)}
            className="rounded-md border p-2 hover:bg-gray-100"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(user)}
            className="rounded-md border p-2 hover:bg-gray-100"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Role</p>
          <p className="text-sm font-medium text-gray-900">{user.role}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Status</p>
          <p className="text-sm font-medium text-gray-900">{user.status}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-gray-500">Description</p>
          <p className="text-sm font-medium text-gray-900">
            {user.description}
          </p>
        </div>
      </div>
    </div>
  );
}
