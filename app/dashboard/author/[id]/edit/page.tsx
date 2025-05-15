"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthorForm from "@/app/components/dashboard/authors/form/AuthorForm";
import { getAuthorById } from "@/app/lib/actions/authors";
import { Author } from "@/app/lib/definition";

export default function EditAuthorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const result = await getAuthorById(parseInt(params.id));
        if (result.error || !result.data) {
          router.push("/dashboard/author");
          return;
        }
        setAuthor(result.data);
      } catch (error) {
        console.error("Error fetching author:", error);
        router.push("/dashboard/author");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthor();
  }, [params.id, router]);

  if (isLoading) {
    return <div>Loading...</div>;
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
