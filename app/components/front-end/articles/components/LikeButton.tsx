"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon as HandThumbUpIconSolid } from "@heroicons/react/24/solid";
import { toggleLike, checkUserLiked, getLikesCount } from "@/app/lib/actions/likes";
import { showSuccessToast, showErrorToast } from "@/app/components/dashboard/shared/toast/Toast";

// Component Info
// Description: Like button component for articles with authentication check and like/unlike functionality.
// Date updated: 2025-November-21
// Author: thangtruong

interface LikeButtonProps {
  articleId: number;
  initialLikesCount?: number;
}

export default function LikeButton({ articleId, initialLikesCount = 0 }: LikeButtonProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if user has liked the article on mount
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!session?.user) {
        setIsChecking(false);
        return;
      }

      try {
        const [likedResult, countResult] = await Promise.all([
          checkUserLiked(articleId),
          getLikesCount(articleId),
        ]);

        if (likedResult.error) {
          showErrorToast({ message: likedResult.error });
        } else {
          setIsLiked(likedResult.data ?? false);
        }

        if (countResult.error) {
          showErrorToast({ message: countResult.error });
        } else {
          setLikesCount(countResult.data ?? 0);
        }
      } catch (error) {
        showErrorToast({
          message: error instanceof Error ? error.message : "Failed to load like status",
        });
      } finally {
        setIsChecking(false);
      }
    };

    checkLikeStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId, session?.user]);

  // Handle like/unlike toggle
  const handleToggleLike = async () => {
    if (!session?.user) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await toggleLike(articleId);
      if (result.error) {
        showErrorToast({ message: result.error });
        return;
      }

      setIsLiked(result.data?.liked ?? false);
      setLikesCount((prev) => (result.data?.liked ? prev + 1 : Math.max(0, prev - 1)));
      showSuccessToast({
        message: result.data?.liked ? "Article liked!" : "Article unliked!",
      });
    } catch (error) {
      showErrorToast({
        message: error instanceof Error ? error.message : "Failed to toggle like",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show login prompt for non-authenticated users
  if (!session?.user) {
    return (
      <Link
        href={`/login?callbackUrl=/articles/${articleId}`}
        className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
      >
        <HandThumbUpIcon className="h-4 w-4 text-gray-400" />
        <span>{likesCount} likes</span>
      </Link>
    );
  }

  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading || isChecking}
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-colors ${
        isLiked
          ? "bg-blue-50 hover:bg-blue-100"
          : "bg-gray-50 hover:bg-gray-100"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label={isLiked ? "Unlike article" : "Like article"}
    >
      {isLiked ? (
        <HandThumbUpIconSolid className="h-4 w-4 text-blue-600" />
      ) : (
        <HandThumbUpIcon className="h-4 w-4 text-gray-400" />
      )}
      <span className={isLiked ? "text-blue-600 font-medium" : "text-gray-600"}>
        {likesCount} {likesCount === 1 ? "like" : "likes"}
      </span>
    </button>
  );
}
