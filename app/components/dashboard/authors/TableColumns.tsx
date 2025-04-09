"use client";

import React, { ReactElement } from "react";
import { Column } from "./types";
import { Author } from "../../../type/definitions";
import Link from "next/link";

// Helper function to split text into rows of 8 words each
const splitTextIntoRows = (
  text: string | undefined | null,
  wordsPerRow: number = 8
): ReactElement => {
  if (!text) return <>-</>;

  const words = text.split(/\s+/);

  if (words.length <= wordsPerRow) {
    return <>{text}</>;
  }

  const rows = [];
  for (let i = 0; i < words.length; i += wordsPerRow) {
    const rowWords = words.slice(i, i + wordsPerRow);
    rows.push(rowWords.join(" "));
  }

  return (
    <>
      {rows.map((row, index) => (
        <React.Fragment key={index}>
          {index > 0 && <br />}
          {row}
        </React.Fragment>
      ))}
    </>
  );
};

export function getTableColumns(
  currentPage: number,
  itemsPerPage: number,
  onDelete: (id: number, authorName: string) => Promise<void>,
  isDeleting: boolean
): Column[] {
  return [
    {
      key: "sequence",
      label: "#",
      sortable: false,
      cell: (author: Author, index: number) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </div>
      ),
    },
    {
      key: "id",
      label: "ID",
      sortable: true,
      cell: (author: Author) => (
        <div className="whitespace-nowrap text-xs text-gray-900 sm:text-sm">
          {author.id}
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      cell: (author: Author) => (
        <div className="whitespace-nowrap text-xs text-gray-900 sm:text-sm">
          {author.name}
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      sortable: false,
      cell: (author: Author) => (
        <div className="text-xs text-gray-500 sm:text-sm">
          {splitTextIntoRows(author.description)}
        </div>
      ),
    },
    {
      key: "bio",
      label: "Bio",
      sortable: false,
      cell: (author: Author) => (
        <div className="text-xs text-gray-500 sm:text-sm">
          {splitTextIntoRows(author.bio)}
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      sortable: true,
      cell: (author: Author) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          {author.created_at
            ? new Date(author.created_at).toLocaleDateString()
            : "-"}
        </div>
      ),
    },
    {
      key: "updated_at",
      label: "Updated At",
      sortable: true,
      cell: (author: Author) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          {author.updated_at
            ? new Date(author.updated_at).toLocaleDateString()
            : "-"}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      cell: (author: Author) => (
        <div className="flex justify-center gap-2">
          <Link
            href={`/dashboard/author/${author.id}/edit`}
            className="rounded border border-blue-500 px-3 py-1 text-blue-500 hover:bg-blue-50"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(author.id, author.name)}
            disabled={isDeleting}
            className="rounded border border-red-500 px-3 py-1 text-red-500 hover:bg-red-50 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
}
