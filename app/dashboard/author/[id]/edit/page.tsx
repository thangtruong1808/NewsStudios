"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthorById } from "@/app/lib/actions/authors";
import { Author } from "@/app/lib/definition";
import AuthorForm from "@/app/components/dashboard/authors/form/AuthorForm";
import { showErrorToast } from "@/app/components/dashboard/shared/toast/Toast";

interface EditAuthorPageProps {
  params: {
    id: string;
  };
}

export default function EditAuthorPage({ params }: EditAuthorPageProps) {
  const router = useRouter();
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const result = await getAuthorById(parseInt(params.id));
        if (result.error) {
          throw new Error(result.error);
        }
        if (!result.data) {
          throw new Error("Author not found");
        }
        setAuthor(result.data);
      } catch (error) {
        console.error("Error fetching author:", error);
        showErrorToast({
          message:
            error instanceof Error ? error.message : "Failed to fetch author",
        });
        router.push("/dashboard/author");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthor();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!author) {
    return null;
  }

  return <AuthorForm author={author} />;
}
