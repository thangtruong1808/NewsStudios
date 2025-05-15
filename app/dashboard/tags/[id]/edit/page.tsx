"use client";

import { notFound, useParams } from "next/navigation";
import TagForm from "../../../../components/dashboard/tags/form/TagForm";
import { getTagById } from "../../../../lib/actions/tags";
import { useEffect, useState } from "react";

export default function EditTagPage() {
  const params = useParams();
  const tagId = params.id as string;
  const [tag, setTag] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const { data, error } = await getTagById(parseInt(tagId));
        if (error) {
          setError(error);
          return;
        }
        if (data) {
          setTag(data);
        } else {
          setError("Tag not found");
        }
      } catch (err) {
        setError("Failed to fetch tag data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTag();
  }, [tagId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-2">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <TagForm tag={tag} isEditMode={true} tagId={parseInt(tagId)} />
        </div>
      </div>
    </div>
  );
}
