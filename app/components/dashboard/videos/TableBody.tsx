"use client";

import React from "react";
import { Video } from "../../../type/Video";
import { formatDateToLocal } from "../../../lib/utils";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface TableBodyProps {
  videos: Video[];
  onDelete: (id: number) => void;
}

export function TableBody({ videos, onDelete }: TableBodyProps) {
  return (
    <tbody className="bg-white">
      {videos.map((video) => (
        <tr
          key={video.id}
          className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
        >
          <td className="whitespace-nowrap py-3 pl-6 pr-3">
            <div className="flex items-center gap-3">
              <p>{video.id}</p>
            </div>
          </td>
          <td className="whitespace-nowrap px-3 py-3">
            <p>{video.article_title || "No article"}</p>
          </td>
          <td className="whitespace-nowrap px-3 py-3">
            <a
              href={video.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              {video.video_url}
            </a>
          </td>
          <td className="px-3 py-3">
            <p className="max-w-xs truncate">
              {video.description || "No description"}
            </p>
          </td>
          <td className="whitespace-nowrap px-3 py-3">
            {formatDateToLocal(video.created_at)}
          </td>
          <td className="whitespace-nowrap px-3 py-3">
            {formatDateToLocal(video.updated_at)}
          </td>
          <td className="whitespace-nowrap py-3 pl-3 pr-6">
            <div className="flex justify-end gap-3">
              <Link
                href={`/dashboard/videos/${video.id}/edit`}
                className="rounded-md border p-2 hover:bg-gray-100"
              >
                <PencilIcon className="w-5" />
              </Link>
              <button
                onClick={() => onDelete(video.id)}
                className="rounded-md border p-2 hover:bg-gray-100"
              >
                <TrashIcon className="w-5" />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
