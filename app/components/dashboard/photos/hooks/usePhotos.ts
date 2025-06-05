"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getImages, searchImages, deleteImage } from "@/app/lib/actions/images";
import { Image } from "@/app/lib/definition";
import {
  showSuccessToast,
  showErrorToast,
  showConfirmationToast,
} from "@/app/components/dashboard/shared/toast/Toast";

// Interface for image data from database
interface ImageRow {
  id: number;
  article_id: number | null;
  image_url: string;
  description: string | null;
  type: "banner" | "video" | "thumbnail" | "gallery";
  entity_type: "advertisement" | "article" | "author" | "category";
  entity_id: number;
  is_featured: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
  article_title?: string;
}

// Interface for paginated API response
interface PaginatedResult {
  data: ImageRow[];
  error: string | null;
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

// Helper function to convert database row to Image type
const convertImageRowToImage = (row: ImageRow): Image => ({
  ...row,
  created_at: row.created_at.toISOString(),
  updated_at: row.updated_at.toISOString(),
});

export function usePhotos() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
      } else {
        setIsLoading(true);
      }
      try {
        const result = searchQuery
          ? await searchImages(searchQuery)
          : await getImages(currentPage, itemsPerPage);

        if (result.error) {
          showErrorToast({ message: result.error });
          if (currentPage === 1) {
            setPhotos([]);
            setTotalItems(0);
          }
          setHasMore(false);
          return;
        }

        const paginatedResult = result as PaginatedResult;
        const convertedPhotos = paginatedResult.data.map(
          convertImageRowToImage
        );

        // Update photos list based on pagination
        if (convertedPhotos.length > 0 || currentPage === 1) {
          if (currentPage === 1) {
            setPhotos(convertedPhotos);
          } else {
            setPhotos((prev) => [...prev, ...convertedPhotos]);
          }
          setTotalItems(paginatedResult.pagination.total);
          setHasMore(
            paginatedResult.pagination.total > currentPage * itemsPerPage
          );
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
        showErrorToast({ message: "Failed to fetch photos" });
        if (currentPage === 1) {
          setPhotos([]);
          setTotalItems(0);
        }
        setHasMore(false);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [currentPage, itemsPerPage, searchQuery]
  );

  // Initialize and cleanup photo fetching
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      await fetchPhotos();
    };
    fetchData();
    return () => {
      isMounted = false;
    };
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
    setCurrentPage((prev) => prev + 1);
  }, []);

  // Refresh photos list
  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    fetchPhotos(true);
  }, [fetchPhotos]);

  // Navigate to edit page for a specific photo
  const handleEdit = async (photo: Image) => {
    try {
      // TODO: Implement photo update logic here
      await new Promise((resolve) => setTimeout(resolve, 100)); // Temporary delay
      router.push(`/dashboard/photos/${photo.id}/edit`);
    } catch (error) {
      console.error("Error editing photo:", error);
      showErrorToast({ message: "Failed to edit photo" });
    }
  };

  // Delete photo with confirmation
  const handleDelete = async (photo: Image) => {
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
      const result = await deleteImage(photo.id);

      if (!result.success) {
        throw new Error(result.error || "Failed to delete photo");
      }

      showSuccessToast({ message: "Photo deleted successfully" });

      // Reset to first page and refresh data
      setCurrentPage(1);
      await fetchPhotos(true);
    } catch (error) {
      console.error("Error deleting photo:", error);
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
