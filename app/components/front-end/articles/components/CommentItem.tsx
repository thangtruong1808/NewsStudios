"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { deleteComment, updateComment } from "@/app/lib/actions/comments";
import { showSuccessToast, showErrorToast } from "@/app/components/dashboard/shared/toast/Toast";

// Component Info
// Description: Display individual comment with edit and delete actions for authenticated users.
// Date updated: 2025-November-21
// Author: thangtruong

interface CommentItemProps {
  comment: {
    id: number;
    article_id: number;
    user_id: number;
    content: string;
    created_at: Date;
    updated_at: Date;
    user_name: string;
    user_firstname?: string;
    user_lastname?: string;
  };
  onUpdate: () => void;
}

export default function CommentItem({ comment, onUpdate }: CommentItemProps) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const isOwner = session?.user?.id === comment.user_id.toString();

  // Handle delete comment
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setIsDeleting(true);
    try {
      const result = await deleteComment(comment.id);
      if (result.error) {
        showErrorToast({ message: result.error });
        return;
      }
      showSuccessToast({ message: "Comment deleted successfully" });
      onUpdate();
    } catch (error) {
      showErrorToast({
        message: error instanceof Error ? error.message : "Failed to delete comment",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle update comment
  const handleUpdate = async () => {
    if (!editContent.trim()) {
      showErrorToast({ message: "Comment cannot be empty" });
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateComment(comment.id, editContent);
      if (result.error) {
        showErrorToast({ message: result.error });
        return;
      }
      showSuccessToast({ message: "Comment updated successfully" });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      showErrorToast({
        message: error instanceof Error ? error.message : "Failed to update comment",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return commentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      {/* Comment header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* User avatar with initials fallback */}
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-xs font-semibold text-blue-600">
              {comment.user_firstname && comment.user_lastname
                ? `${comment.user_firstname.charAt(0).toUpperCase()}${comment.user_lastname.charAt(0).toUpperCase()}`
                : comment.user_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{comment.user_name}</p>
            <p className="text-xs text-gray-500">{formatDate(comment.created_at)}</p>
          </div>
        </div>

        {/* Action buttons for comment owner */}
        {isOwner && !isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              aria-label="Edit comment"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
              aria-label="Delete comment"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Comment content */}
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdating || !editContent.trim()}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
              }}
              className="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
      )}
    </div>
  );
}

