"use client";

import { Article } from "../../../lib/definition";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteArticle } from "../../../lib/actions/articles";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";

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
  const router = useRouter();

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      await deleteArticle(id);
      toast.success("Article deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete article");
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "-";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "dd/MM/yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  };

  return (
    <tbody className="bg-white">
      {articles.map((article, index) => (
        <tr
          key={article.id}
          className="border-b border-gray-200 hover:bg-gray-50"
        >
          <td className="px-2 py-2 text-sm text-gray-500">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td>
          <td className="px-3 py-3 text-sm text-gray-500 max-w-[300px]">
            <Link
              href={`/dashboard/articles/${article.id}`}
              className="text-blue-600 hover:text-blue-800 line-clamp-2"
            >
              {article.title}
            </Link>
          </td>
          <td className="px-3 py-3 text-sm text-gray-500 max-w-[400px]">
            <div className="line-clamp-3 whitespace-pre-wrap">
              {article.content}
            </div>
          </td>
          <td className="px-3 py-3 text-sm text-gray-500">
            {article.category_name || "Unknown Category"}
          </td>
          <td className="px-3 py-3 text-sm text-gray-500">
            {article.author_name || "Unknown Author"}
          </td>
          <td className="px-3 py-3 text-sm text-gray-500">
            {formatDate(article.published_at)}
          </td>
          <td className="px-3 py-3 text-sm text-gray-500">
            {formatDate(article.updated_at)}
          </td>
          <td className="px-3 py-3 text-sm text-gray-500">
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
          <td className="px-3 py-3 text-sm text-gray-500">
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
          <td className="px-3 py-3 text-sm text-gray-500">
            <div className="flex justify-end gap-2">
              <Link
                href={`/dashboard/articles/${article.id}/edit`}
                className="rounded border border-blue-500 px-3 py-1 text-blue-500 hover:bg-blue-100"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(article.id)}
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
