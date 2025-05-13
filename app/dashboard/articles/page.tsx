"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, Column } from "@/app/components/dashboard/shared/table";
import { Article } from "@/app/lib/definition";
import { getArticles } from "@/app/lib/actions/articles";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ExpandableContent from "@/app/components/dashboard/shared/table/ExpandableContent";
import { SearchWrapper } from "@/app/components/dashboard/shared/search";
import { useSearchParams } from "next/navigation";

interface ArticlesPageProps {
  searchParams: {
    page?: string;
    search?: string;
    sortField?: string;
    sortDirection?: "asc" | "desc";
    query?: string;
  };
}

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange?: (page: number) => void;
  showFirstLast?: boolean;
  showPageNumbers?: boolean;
  maxPageNumbers?: number;
  className?: string;
  buttonClassName?: string;
  activeButtonClassName?: string;
  disabledButtonClassName?: string;
}

export default function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = 5;
  const searchQuery = searchParams.query || "";
  const sortField = (searchParams.sortField as keyof Article) || "published_at";
  const sortDirection = searchParams.sortDirection || "desc";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isSearching && !isSorting) {
          setIsLoading(true);
        }
        const { data, totalItems, totalPages } = await getArticles({
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
          sortField: sortField as string,
          sortDirection,
        });

        setArticles(data);
        setTotalPages(totalPages);
        setTotalItems(totalItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
        setIsSorting(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, sortField, sortDirection, searchQuery]);

  const columns: Column<Article & { sequence?: number; actions?: never }>[] = [
    {
      field: "sequence",
      label: "#",
      sortable: false,
    },
    {
      field: "title",
      label: "Title",
      sortable: true,
      render: (value) => (
        <div className="w-48">
          <ExpandableContent content={value} maxWords={20} />
        </div>
      ),
    },
    {
      field: "content",
      label: "Content",
      sortable: true,
      render: (value) => (
        <div className="w-64">
          <ExpandableContent content={value} maxWords={20} />
        </div>
      ),
    },
    {
      field: "category_id",
      label: "Category",
      sortable: true,
      render: (_, article) => (
        <div className="w-32">
          <ExpandableContent
            content={article.category_name || "Uncategorized"}
            maxWords={20}
          />
        </div>
      ),
    },
    {
      field: "sub_category_id",
      label: "SubCategory",
      sortable: true,
      render: (_, article) => (
        <div className="w-32">
          <ExpandableContent
            content={article.sub_category_name || "None"}
            maxWords={20}
          />
        </div>
      ),
    },
    {
      field: "published_at",
      label: "Published At",
      sortable: true,
      render: (value) => (
        <div className="w-32">
          <span className="text-sm text-zinc-500 whitespace-nowrap text-left">
            {new Date(value).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      field: "updated_at",
      label: "Updated At",
      sortable: true,
      render: (value) => (
        <div className="w-32">
          <span className="text-sm text-zinc-500 whitespace-nowrap text-left">
            {new Date(value).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      field: "is_featured",
      label: "Featured",
      sortable: true,
      render: (value) => (
        <div className="w-24">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              value
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {value ? "Yes" : "No"}
          </span>
        </div>
      ),
    },
    {
      field: "is_trending",
      label: "Trending",
      sortable: true,
      render: (value) => (
        <div className="w-24">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              value
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {value ? "Yes" : "No"}
          </span>
        </div>
      ),
    },
    {
      field: "actions",
      label: "Actions",
      sortable: false,
      render: (_, article) => (
        <div className="flex justify-start items-start space-x-2">
          <button
            onClick={() => handleEdit(article)}
            className="inline-flex items-center gap-1 rounded border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => handleDelete(article)}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 rounded border border-red-500 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/dashboard/articles?${params.toString()}`);
  };

  const handleSort = (field: keyof Article) => {
    setIsSorting(true);
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortField", field as string);
    params.set("sortDirection", newDirection);
    router.push(`/dashboard/articles?${params.toString()}`);
  };

  const handleEdit = (article: Article) => {
    router.push(`/dashboard/articles/${article.id}/edit`);
  };

  const handleDelete = async (article: Article) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/articles/${article.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete article");
        }

        router.refresh();
      } catch (error) {
        console.error("Error deleting article:", error);
        alert("Failed to delete article. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSearch = (term: string) => {
    setIsSearching(true);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.push(`/dashboard/articles?${params.toString()}`);
  };

  if (isLoading && !isSearching && !isSorting) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Articles
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all articles in your account including their title,
            content, and status.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => router.push("/dashboard/articles/new")}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add article
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-4">
        <div className="w-full">
          <SearchWrapper
            placeholder="Search articles by title, content, or category..."
            onSearch={handleSearch}
          />
        </div>
      </div>

      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <Table
              data={articles}
              columns={columns}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onPageChange={handlePageChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
              searchQuery={searchQuery}
              isLoading={isSearching || isSorting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
