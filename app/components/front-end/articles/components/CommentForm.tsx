"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { createComment } from "@/app/lib/actions/comments";
import { showSuccessToast, showErrorToast } from "@/app/components/dashboard/shared/toast/Toast";

// Component Info
// Description: Comment form component for authenticated users to submit new comments.
// Date updated: 2025-November-21
// Author: thangtruong

interface CommentFormProps {
  articleId: number;
  onCommentAdded: () => void;
}

export default function CommentForm({ articleId, onCommentAdded }: CommentFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content.trim()) {
      showErrorToast({ message: "Please enter a comment" });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createComment(articleId, content);
      if (result.error) {
        showErrorToast({ message: result.error });
        return;
      }
      showSuccessToast({ message: "Comment added successfully" });
      setContent("");
      onCommentAdded();
    } catch (error) {
      showErrorToast({
        message: error instanceof Error ? error.message : "Failed to add comment",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show login prompt for non-authenticated users
  if (!session?.user) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-gray-700 mb-2">Please login to leave a comment</p>
        <Link
          href={`/login?callbackUrl=/articles/${articleId}`}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Add a comment
        </label>
        <textarea
          id="comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment here..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={4}
          disabled={isSubmitting}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
}
