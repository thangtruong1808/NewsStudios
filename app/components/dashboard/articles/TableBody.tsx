"use client";

import { Article } from "../../../lib/definition";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteArticle } from "../../../lib/actions/articles";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Not published";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const handleDelete = async (id: number, title: string) => {
    const toastId = toast.loading("Deleting article...");

    try {
      await deleteArticle(id);
      toast.success(`Article "${title}" has been deleted`, {
        id: toastId,
      });
      router.refresh();
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article", {
        id: toastId,
      });
    }
  };

  const confirmDelete = (id: number, title: string) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <TrashIcon className="h-10 w-10 text-red-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Delete Article
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Are you sure you want to delete "{title}"? This action cannot
                  be undone.
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                handleDelete(id, title);
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
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
          <td className="px-2 py-3 text-sm text-gray-500">
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
          <td className="px-3 py-3 text-sm text-gray-500 text-center">
            <div className="flex justify-center gap-2">
              <Link
                href={`/dashboard/articles/${article.id}/edit`}
                className="inline-flex items-center gap-1 rounded border border-blue-500 px-2.5 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-100"
              >
                <PencilIcon className="h-3.5 w-3.5" />
                Edit
              </Link>
              <button
                onClick={() => confirmDelete(article.id, article.title)}
                className="inline-flex items-center gap-1 rounded border border-red-500 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-100"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
