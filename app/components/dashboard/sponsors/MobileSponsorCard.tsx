"use client";

import { Sponsor } from "../../../lib/definition";

interface MobileSponsorCardProps {
  sponsor: Sponsor;
  onEdit: (sponsor: Sponsor) => void;
  onDelete: (sponsor: Sponsor) => void;
}

export default function MobileSponsorCard({
  sponsor,
  onEdit,
  onDelete,
}: MobileSponsorCardProps) {
  return (
    <div className="mb-4 w-full rounded-md bg-white p-4 shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {sponsor.name.charAt(0)}
            </span>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-900">
              {sponsor.name}
            </h3>
            <p className="text-sm text-gray-500">ID: {sponsor.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(sponsor)}
            className="rounded-md border border-blue-500 px-3 py-1 text-blue-500 hover:bg-blue-50"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(sponsor)}
            className="rounded-md border border-red-500 px-3 py-1 text-red-500 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <p className="text-xs text-gray-500">Description</p>
          <p className="text-sm text-gray-900">
            {sponsor.description || "No description provided"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Contact Email</p>
          <p className="text-sm text-gray-900">
            {sponsor.contact_email || "Not provided"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Contact Phone</p>
          <p className="text-sm text-gray-900">
            {sponsor.contact_phone || "Not provided"}
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-gray-500">Website</p>
          <p className="text-sm text-gray-900">
            {sponsor.website_url || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
}
