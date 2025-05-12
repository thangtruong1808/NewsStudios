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
    const toastId = toast.loading("Deleting article...");

    try {
      await deleteArticle(id);
      toast.success("Article deleted successfully", {
        id: toastId,
        duration: 3000, // Auto-dismiss after 3 seconds
      });
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete article", {
        id: toastId,
        duration: 4000, // Keep error message a bit longer
      });
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
            <div className="line-clamp-2">{article.title}</div>
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
                className="inline-flex items-center gap-1 rounded border border-blue-500 px-2.5 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
              >
                <PencilIcon className="h-4 w-4" />
                Edit
              </Link>
              <button
                onClick={() => {
                  toast(
                    (t) => (
                      <div className="flex flex-col gap-3 p-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                              <TrashIcon className="h-5 w-5 text-red-600" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                              Delete Article
                            </h3>
                            <p className="text-sm text-gray-500">
                              Are you sure you want to delete this article? This
                              action cannot be undone.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end mt-2">
                          <button
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                            onClick={() => toast.dismiss(t.id)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                            onClick={() => {
                              toast.dismiss(t.id);
                              handleDelete(article.id);
                            }}
                          >
                            Delete Article
                          </button>
                        </div>
                      </div>
                    ),
                    {
                      duration: 6000,
                      style: {
                        minWidth: "400px",
                        background: "white",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        borderRadius: "0.5rem",
                      },
                    }
                  );
                }}
                className="inline-flex items-center gap-1 rounded border border-red-500 px-2.5 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
              >
                <TrashIcon className="h-4 w-4" />
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
