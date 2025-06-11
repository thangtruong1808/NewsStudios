"use client";

import { useEffect, useState } from "react";
import TagForm from "../../../../components/dashboard/tags/form/TagForm";
import { getTagById } from "../../../../lib/actions/tags";
import { Tag } from "@/app/lib/definition";
import FormSkeleton from "@/app/components/dashboard/shared/skeleton/FormSkeleton";
import { useParams } from "next/navigation";

export default function EditTagPage() {
  const params = useParams();
  const tagId = params.id as string;
  const [tag, setTag] = useState<Tag | null>(null);
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
          console.log("Fetched tag data:", data); // Debug log
          setTag(data);
        } else {
          setError("Tag not found");
        }
      } catch (err) {
        console.error("Error fetching tag:", err); // Debug log
        setError("Failed to fetch tag data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTag();
  }, [tagId]);

  if (isLoading) {
    return (
      <div className="w-full">
        <FormSkeleton
          fields={3} // Number of fields in the tag form: name, description, color
          showHeader={true}
          showActions={true}
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!tag) {
    return null;
  }

  return (
    <div className="bg-gray-50">
      <TagForm
        tag={{
          ...tag,
          category_id: tag.category_id || 0,
          sub_category_id: tag.sub_category_id || 0,
        }}
        isEditMode={true}
        tagId={parseInt(tagId)}
      />
    </div>
  );
}
