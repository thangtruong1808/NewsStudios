"use client";

import { Article } from "../../../lib/definition";
import Link from "next/link";
import {
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface TableBodyProps {
  articles: Article[];
  currentPage: number;
  itemsPerPage: number;
}

export function TableBody({
  articles,
  currentPage,
  itemsPerPage,
}: TableBodyProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Not published";
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  return (
    <tbody className="bg-white">
      {articles.map((article, index) => (
        <tr
          key={article.id}
          className="border-b border-gray-200 hover:bg-gray-50"
        >
          <td className="px-4 py-3">
            {(currentPage - 1) * itemsPerPage +
              index +
              1}
          </td>
          <td className="px-4 py-3">
            {article.id}
          </td>
          <td className="px-4 py-3">
            <Link
              href={`/dashboard/articles/${article.id}`}
              className="text-blue-600 hover:text-blue-800"
            >
              {article.title}
            </Link>
          </td>
          <td className="px-4 py-3">
            <div className="max-w-xs truncate">
              {article.content}
            </div>
          </td>
          <td className="px-4 py-3">
            {(article as any).category_name ||
              "Unknown Category"}
          </td>
          <td className="px-4 py-3">
            {(article as any).author_name ||
              "Unknown Author"}
          </td>
          <td className="px-4 py-3">
            {formatDate(article.published_at)}
          </td>
          <td className="px-4 py-3">
            {article.is_featured ? (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Yes
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                No
              </span>
            )}
          </td>
          <td className="px-4 py-3">
            {article.is_trending ? (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Yes
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                No
              </span>
            )}
          </td>
          <td className="px-4 py-3 text-right">
            <div className="flex justify-end gap-2">
              <Link
                href={`/dashboard/articles/${article.id}/edit`}
                className="rounded border border-blue-500 px-3 py-1 text-blue-500 hover:bg-blue-100"
              >
                Edit
              </Link>
              <button
                onClick={() => {
                  // TODO: Implement delete functionality
                  console.log(
                    "Delete article:",
                    article.id
                  );
                }}
                className="rounded border border-red-500 px-3 py-1 text-red-500 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
