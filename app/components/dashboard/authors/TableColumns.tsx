"use client";

import React from "react";
import { Column } from "./types";
import { Author } from "../../../type/definitions";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import DeleteAuthorButton from "./DeleteAuthorButton";

// Helper function to split text into rows of 10 words each
const splitTextIntoRows = (
  text: string | undefined | null,
  wordsPerRow: number
): JSX.Element => {
  if (!text) return <>-</>;

  const words = text.split(/\s+/);

  if (words.length <= wordsPerRow) {
    return <>{text}</>;
  }

  const firstRow = words.slice(0, wordsPerRow).join(" ");
  const secondRow = words.slice(wordsPerRow).join(" ");

  return (
    <>
      {firstRow}
      <br />
      {secondRow}
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
      label: "No",
      sortable: false,
      cell: (author: Author, index: number) =>
        (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      key: "id",
      label: "ID",
      sortable: true,
      cell: (author: Author) => author.id,
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      cell: (author: Author) => author.name,
    },
    {
      key: "description",
      label: "Description",
      sortable: false,
      cell: (author: Author) => splitTextIntoRows(author.description, 10),
    },
    {
      key: "bio",
      label: "Bio",
      sortable: false,
      cell: (author: Author) => splitTextIntoRows(author.bio, 10),
    },
    {
      key: "created_at",
      label: "Created At",
      sortable: true,
      cell: (author: Author) =>
        author.created_at
          ? new Date(author.created_at).toLocaleDateString()
          : "-",
    },
    {
      key: "updated_at",
      label: "Updated At",
      sortable: true,
      cell: (author: Author) =>
        author.updated_at
          ? new Date(author.updated_at).toLocaleDateString()
          : "-",
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      cell: (author: Author) => (
        <div className="flex justify-center space-x-2">
          <Link
            href={`/dashboard/author/${author.id}/edit`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <PencilIcon className="h-5 w-5" />
          </Link>
          <DeleteAuthorButton
            authorId={author.id}
            authorName={author.name}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        </div>
      ),
    },
  ];
}
