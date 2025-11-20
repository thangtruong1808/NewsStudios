"use client";

import { useState, useEffect } from "react";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { getComments } from "@/app/lib/actions/comments";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { showErrorToast } from "@/app/components/dashboard/shared/toast/Toast";

// Component Info
// Description: Comments section displaying comment list and form for authenticated users with real-time count updates.
// Date updated: 2025-November-21
// Author: thangtruong

interface CommentsProps {
  articleId: number;
  onCommentCountUpdate?: (_count: number) => void; // Callback to update comment count in parent
}

interface Comment {
  id: number;
  article_id: number;
  user_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
  user_name: string;
  user_firstname?: string;
  user_lastname?: string;
}

export default function Comments({ articleId, onCommentCountUpdate }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getComments({ article_id: articleId, page: 1, limit: 50 });
      if (result.error) {
        setError(result.error);
        return;
      }
      const fetchedComments = result.data || [];
      setComments(fetchedComments);
      // Notify parent component of comment count update
      if (onCommentCountUpdate) {
        onCommentCountUpdate(fetchedComments.length);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load comments";
      setError(errorMessage);
      showErrorToast({ message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  // Handle comment added/updated
  const handleCommentUpdate = () => {
    fetchComments();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <ChatBubbleLeftIcon className="h-6 w-6 text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>
      </div>

      {/* Comment form */}
      <div className="mb-6">
        <CommentForm articleId={articleId} onCommentAdded={handleCommentUpdate} />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-8 text-gray-500">
          <p>Loading comments...</p>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {/* Comments list */}
      {!isLoading && !error && (
        <>
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-0">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onUpdate={handleCommentUpdate}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

