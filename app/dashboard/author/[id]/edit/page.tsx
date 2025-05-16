"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthorForm from "@/app/components/dashboard/authors/form/AuthorForm";
import { getAuthorById } from "@/app/lib/actions/authors";
import { Author } from "@/app/lib/definition";
import FormSkeleton from "@/app/components/dashboard/shared/skeleton/FormSkeleton";

export default function EditAuthorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const result = await getAuthorById(parseInt(params.id));
        if (result.error || !result.data) {
          setError("Author not found");
          return;
        }
        setAuthor(result.data);
      } catch (error) {
        console.error("Error fetching author:", error);
        setError("Failed to fetch author data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthor();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-2">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <FormSkeleton
              fields={3} // Number of fields in the author form: name, description, bio
              showHeader={true}
              showActions={true}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-2">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <AuthorForm author={author} />
        </div>
      </div>
    </div>
  );
}
