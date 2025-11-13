"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getImages, searchImages, deleteImage } from "@/app/lib/actions/images";
import { Image } from "@/app/lib/definition";
import {
  showSuccessToast,
  showErrorToast,
  showConfirmationToast,
} from "@/app/components/dashboard/shared/toast/Toast";

type ImagesResult = Awaited<ReturnType<typeof getImages>>;
type SearchResult = Awaited<ReturnType<typeof searchImages>>;

// Description: Manage dashboard photo listing state with search, pagination, and delete actions.
// Data created: 2024-11-13
// Author: thangtruong
export function usePhotos() {
  const router = useRouter();

  // State management
  const [photos, setPhotos] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch photos with pagination and search support
  const fetchPhotos = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else if (currentPage === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      try {
        if (searchQuery) {
          const searchResult: SearchResult = await searchImages(searchQuery);
          if (searchResult.error) {
            showErrorToast({ message: searchResult.error });
            if (currentPage === 1) {
              setPhotos([]);
              setTotalItems(0);
            }
            setHasMore(false);
            return;
          }

          const convertedPhotos = searchResult.data.map((img) => ({
            ...img,
            created_at: new Date(img.created_at).toISOString(),
            updated_at: new Date(img.updated_at).toISOString(),
          }));

          if (convertedPhotos.length > 0 || currentPage === 1) {
            if (currentPage === 1) {
              setPhotos(convertedPhotos);
            } else {
              setPhotos((prev) => [...prev, ...convertedPhotos]);
            }
            const total = searchResult.pagination?.total ?? convertedPhotos.length;
            setTotalItems(total);
            setHasMore(total > currentPage * itemsPerPage);
          } else {
            setHasMore(false);
          }
        } else {
          const { images, totalItems: total, totalPages: _totalPages } = (await getImages({
            page: currentPage,
            limit: itemsPerPage,
            sortField: "created_at",
            sortDirection: "desc",
            searchQuery: "",
          })) as ImagesResult;

          if (!images || images.length === 0) {
            if (currentPage === 1) {
              setPhotos([]);
              setTotalItems(0);
            }
            setHasMore(false);
            return;
          }

          const convertedPhotos = images.map((img) => ({
            ...img,
            created_at: new Date(img.created_at).toISOString(),
            updated_at: new Date(img.updated_at).toISOString(),
          }));

          if (convertedPhotos.length > 0 || currentPage === 1) {
            if (currentPage === 1) {
              setPhotos(convertedPhotos);
            } else {
              setPhotos((prev) => [...prev, ...convertedPhotos]);
            }
            setTotalItems(total);
            setHasMore(total > currentPage * itemsPerPage);
          } else {
            setHasMore(false);
          }
        }
      } catch (error) {
        showErrorToast({
          message:
            error instanceof Error ? error.message : "Failed to fetch photos",
        });
        if (currentPage === 1) {
          setPhotos([]);
          setTotalItems(0);
        }
        setHasMore(false);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [currentPage, itemsPerPage, searchQuery]
  );

  // Initialize and cleanup photo fetching
  useEffect(() => {
    const fetchData = async () => {
      await fetchPhotos();
    };
    fetchData();
  }, [fetchPhotos]);

  // Search functionality handlers
  const handleSearch = useCallback((term: string) => {
    setSearchQuery(term);
    setCurrentPage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  // Load more photos for pagination
  const handleLoadMore = useCallback(() => {
    setIsLoadingMore(true);
    setCurrentPage((prev) => prev + 1);
  }, []);

  // Refresh photos list
  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    setSearchQuery("");
    fetchPhotos(true);
  }, [fetchPhotos]);

  // Navigate to edit page for a specific photo
  const handleEdit = async ({ item }: { item: Image }) => {
    try {
      // TODO: Implement photo update logic here
      await new Promise((resolve) => setTimeout(resolve, 100)); // Temporary delay
      router.push(`/dashboard/photos/${item.id}/edit`);
    } catch (error) {
      showErrorToast({ message: "Failed to edit photo" });
    }
  };

  // Delete photo with confirmation
  const handleDelete = async ({ item }: { item: Image }) => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      showConfirmationToast({
        title: "Delete Photo",
        message:
          "Are you sure you want to delete this photo? This action cannot be undone.",
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const result = await deleteImage(item.id);

      if (!result.success) {
        throw new Error(result.error || "Failed to delete photo");
      }

      showSuccessToast({ message: "Photo deleted successfully" });

      // Reset to first page and refresh data
      setCurrentPage(1);
      await fetchPhotos(true);
    } catch (error) {
      showErrorToast({ message: "Failed to delete photo" });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    photos,
    totalItems,
    currentPage,
    itemsPerPage,
    searchQuery,
    hasMore,
    isLoading,
    isDeleting,
    isRefreshing,
    isLoadingMore,
    handleSearch,
    handleClearSearch,
    handleLoadMore,
    handleRefresh,
    handleEdit,
    handleDelete,
  };
}
